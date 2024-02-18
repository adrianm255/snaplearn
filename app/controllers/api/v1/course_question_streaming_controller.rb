class Api::V1::CourseQuestionStreamingController < ApplicationController
  include ActionController::Live

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    session_id = params[:session_id]
    stream_key = "question_stream_#{session_id}"
    stream = Redis.new

    begin
      stream.subscribe(stream_key) do |on|
        on.message do |channel, message|
          parsed_message = JSON.parse(message) rescue {}
          if parsed_message.is_a?(Hash) && parsed_message['type'] == 'shutdown'
            stream.unsubscribe
          else
            response.stream.write "data: #{message}\n\n"
          end
        end
      end
    rescue => e
      Rails.logger.error "Redis subscription error: #{e.message}"
    ensure
      stream.del(stream_key)
      stream.close
      response.stream.close
    end
  end

end
