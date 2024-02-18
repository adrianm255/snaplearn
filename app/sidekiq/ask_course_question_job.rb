class AskCourseQuestionJob
  include Sidekiq::Job

  def perform(question_id, stream_session_id)
    question = CourseQuestion.find(question_id)
    course = question.course

    openai = OpenaiService.new()
    question_embeddings = openai.get_embeddings(question.body)

    course_embeddings = course.course_section_embeddings
    relevant_sections = rank_course_sections(question_embeddings.dig(0, 'embedding'), course_embeddings)

    stream_key = "question_stream_#{stream_session_id}"
    stream = Redis.new

    question.answer = ""
    stream_proc = proc do |chunk, _bytesize|
      new_content = chunk.dig("choices", 0, "delta", "content")
      stream.publish(stream_key, new_content) unless new_content.blank?
      question.answer += new_content.to_s unless new_content.blank?
    end

    answer = openai.ask_question(question.body, relevant_sections.map { |section| section[:content] }.take(5), stream_session_id, stream_proc) do
      final_message = {type: 'shutdown'}.to_json
      stream.publish(stream_key, final_message)
      stream.close

      question.save!
    end

  ensure
    stream.close
  end

  private
  
  #TODO move these somewhere else
  def rank_course_sections(query_embedding, sections)
    sections.map { |section|
      {
        course_section_id: section.course_section_id,
        content: section[:content],
        score: 1 - cosine_similarity(query_embedding, section[:embedding])
      }
    }.sort_by { |section| section[:score] }
  end

  def cosine_similarity(vec1, vec2)
    dot_product = vec1.zip(vec2).map { |v1, v2| v1 * v2 }.sum
    magnitude = Math.sqrt(vec1.map { |v| v**2 }.sum) * Math.sqrt(vec2.map { |v| v**2 }.sum)
    dot_product / magnitude
  end
end