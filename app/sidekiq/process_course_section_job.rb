class ProcessCourseSectionJob
  include Sidekiq::Job

  def perform(course_section_id)
    course_section = CourseSection.find(course_section_id)
    course_id = course_section.course_id

    redis_key = "course:#{course_id}:sections_processing_count"
    @course_redis_key = "course:#{course_section.course_id}:content_chunks"

    @redis = Redis.new
    processed_sections = process_course_section(course_section)
  ensure
    if decrement_and_check(redis_key)
      EmbedCourseJob.perform_async(course_id)
    end
    @redis.del(redis_key)
    @redis.close
  end

  private

  def decrement_and_check(redis_key)
    lua_script = <<-LUA
      local current = redis.call('decr', KEYS[1])
      if current <= 0 then
        return 1
      else
        return 0
      end
    LUA
    result = @redis.eval(lua_script, keys: [redis_key])
    result == 1
  end

  def process_course_section(course_section)
    sections = []
    hostname = ENV["RAILS_ENV"] == 'production' ? 'https://snaplearn-web.onrender.com' : 'http://127.0.0.1:3000'
    file_path = course_section.file&.attached? ?  hostname + Rails.application.routes.url_helpers.rails_blob_url(course_section.file, only_path: true).to_s : nil

    case course_section.section_type
    when 'rich_text'
      rich_text_parser = RichTextParser.new(course_section.content)
      sections = rich_text_parser.chunk_by_sections
    when 'pdf'
      pdf_parser = PdfParser.new(file_path)
      sections = pdf_parser.extract_content
    when 'video'
      video_parser = VideoParser.new(file_path, file_path.split('.').last)
      sections = video_parser.get_video_transcription
    end

    @redis.hset(@course_redis_key, course_section.id, sections.to_json)
  end
end
