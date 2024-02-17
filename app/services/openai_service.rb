class OpenaiService
  EMBEDDINGS_MODEL = 'text-embedding-3-large'
  AUDIO_TRANSCRIPTION_MODEL = 'whisper-1'

  def initialize()
    @client = OpenAI::Client.new
  end

  def get_embeddings(input)
    response = @client.embeddings(
      parameters: {
        model: EMBEDDINGS_MODEL,
        input: input
      }
    )

    response['data']
  end

  def batch_embed(chunks)
    batch_size = 100 # TODO need to batch by token count - max count 8191
    embeddings = []

    chunks.each_slice(batch_size) do |chunk_batch|
      response = get_embeddings(chunk_batch.map { |chunk| (chunk['title'] || '') + ' ' + chunk['content'] })
      embeddings.concat(response.map.with_index do |emb, i|
        chunk = chunk_batch[emb['index']]
        chunk.merge({
          embedding: emb['embedding']
        })
      end)
    end

    embeddings
  end

  def get_audio_transcription(audio_file_path)
    response = @client.audio.transcribe(
      parameters: {
        model: AUDIO_TRANSCRIPTION_MODEL,
        file: File.open(audio_file_path, "rb"),
        # response_format: 'srt'  # use for SRT format
      }
    )

    response['text']
  end
end