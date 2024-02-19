require 'open3'
require 'uri'
require 'tempfile'

class VideoParser
  MAX_CHUNK_SIZE_MB = 24.8

  def initialize(video_url, video_extension)
    @video_url = video_url
    @video_extension = video_extension
    @openai = OpenaiService.new
  end

  def get_video_transcription
    audio_transcripts = []

    # Temporary file to save the video for conversion
    Tempfile.create(['video', ".#{@video_extension}"]) do |video_tempfile|
      video_tempfile.binmode

      uri = URI(@video_url)
      response = HttpFetcher.fetch(uri)
      if response.is_a?(Net::HTTPSuccess)
        video_tempfile.write(response.body)
      else
        puts "Failed to download video: #{response.code} #{response.message}"
      end
      video_tempfile.rewind

      # Temporary file to save the converted audio
      Tempfile.create(['audio', '.mp3']) do |audio_tempfile|
        convert_video_to_audio(video_tempfile.path, audio_tempfile.path)
        audio_file_size = File.size(audio_tempfile.path)

        # If .mp3 file size is bigger than MAX_CHUNK_SIZE_MB then chunk it
        chunks = audio_file_size > MAX_CHUNK_SIZE_MB * 1024 * 1024 ? chunk_audio_by_size(audio_tempfile.path, MAX_CHUNK_SIZE_MB) : [{ 'path': audio_tempfile.path, 'start_timestamp': 0 }]

        chunks.each_with_index do |chunk, i|
          chunk_path = chunk[:path]
          audio_file_transcript = process_audio_file(chunk_path)
          File.delete(chunk_path) if File.exist?(chunk_path)

          audio_transcripts << {
            order: i,
            start_timestamp: chunk[:start_timestamp],
            content: audio_file_transcript
          } unless audio_file_transcript.strip.empty?
        end
      end
    end

    audio_transcripts
  end

  private

  def convert_video_to_audio(video_path, audio_path)
    cmd = "ffmpeg -y -i #{video_path} -q:a 0 -map a #{audio_path}"
    execute_command(cmd)
  end

  def get_audio_duration(file_path)
    cmd = "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 #{Shellwords.shellescape(file_path)}"
    stdout_str = execute_command(cmd)
    stdout_str.strip.to_f
  end

  def extract_audio_chunk(input_path, output_path, start_time, duration)
    cmd = "ffmpeg -y -i #{Shellwords.shellescape(input_path)} -ss #{start_time} -t #{duration} -c copy #{Shellwords.shellescape(output_path)}"
    execute_command(cmd)
  end

  def execute_command(cmd)
    stdout_str, stderr_str, status = Open3.capture3(cmd)

    unless status.success?
      raise "ffmpeg failed with error: #{stderr_str}"
    end

    # Additional logging
    puts "ffmpeg stdout: #{stdout_str}" unless stdout_str.empty?
    puts "ffmpeg stderr: #{stderr_str}" unless stderr_str.empty?

    stdout_str
  end

  def process_audio_file(file_path)
    transcription = @openai.get_audio_transcription(file_path)
    transcription
  end

  def get_audio_bitrate(audio_path)
    cmd = "ffmpeg -i #{audio_path} 2>&1 | grep 'bitrate:'"
    stdout_str = execute_command(cmd)
    bitrate_match = stdout_str.match(/bitrate: (\d+) kb\/s/)
    bitrate_match[1].to_i if bitrate_match
  end
  
  def calculate_chunk_duration_for_size(bitrate_kbps, target_size_mb)
    # Calculate duration in seconds that corresponds to the target size at the given bitrate
    target_size_kb = target_size_mb * 1024
    (target_size_kb / bitrate_kbps.to_f) * 8 # Convert to seconds
  end
  
  def chunk_audio_by_size(audio_path, target_size_mb)
    bitrate_kbps = get_audio_bitrate(audio_path)
    chunk_duration_seconds = calculate_chunk_duration_for_size(bitrate_kbps, target_size_mb)
    total_duration = get_audio_duration(audio_path)
    number_of_chunks = (total_duration / chunk_duration_seconds).ceil
    
    chunks = []
    (0...number_of_chunks).each do |i|
      start_time = i * chunk_duration_seconds
      chunk_path = "#{audio_path}_chunk_#{i}.mp3"
      extract_audio_chunk(audio_path, chunk_path, start_time, chunk_duration_seconds)
      chunks << {
        'path': chunk_path,
        'start_timestamp': start_time
      }
    end
    
    chunks
  end
end
