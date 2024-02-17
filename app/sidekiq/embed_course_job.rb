require 'json'

class EmbedCourseJob
  include Sidekiq::Job

  def perform(course_id)
    course = Course.find(course_id)

    redis_key = "course:#{course_id}:content_chunks"
    redis = Redis.new

    course_chunks = redis.hgetall(redis_key)

    content_to_embed = []
    course_chunks.each do |course_section_id, course_section_content|
      content = JSON.parse(course_section_content)
      content.each do |c|
        c['course_section_id'] = course_section_id
        content_to_embed << c
      end
    end

    openai = OpenaiService.new
    embeddings = openai.batch_embed(content_to_embed)

    embeddings_to_insert = embeddings.map.with_index do |emb, i|
      {
        content: "#{(emb['title'] || '')} #{emb['content']}",
        embedding: emb[:embedding],
        course_section_id: emb['course_section_id']
      }
    end
    
    CourseSectionEmbedding.insert_all(embeddings_to_insert)
  ensure
    redis.del(redis_key)
    redis.close
  end
end