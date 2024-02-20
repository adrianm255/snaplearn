class Api::V1::CourseQuestionsController < ApplicationController
  before_action :set_course_question, only: %i[ show ]
  before_action :set_course, only: %i[ create ]
  before_action :authenticate_user!
  before_action :authorize_user!, only: [ :create ]

  # GET /questions/1
  def show
    render json: @course_question.as_json
  end

  # POST /questions
  def create
    @course_question = CourseQuestion.new(course_question_params)
    @course_question.user = current_user

    if @course_question.save
      stream_session_id = SecureRandom.hex(10)
      AskCourseQuestionJob.perform_async(@course_question.id, stream_session_id)
      render json: @course_question.as_json.merge(session_id: stream_session_id), status: :created
    else
      render json: @course_question.errors, status: :unprocessable_entity
    end
  end

  private

  def set_course_question
    @course_question = CourseQuestion.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course Question not found" }, status: :not_found
  end

  def set_course
    @course = Course.find(params[:course_question][:course_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course not found" }, status: :not_found
  end

  def course_question_params
    params.require(:course_question).permit(:body, :course_id)
  end

  # Allow questions only on published courses, unless the user is the author of the course
  def authorize_user!
    unless @course.published || @course.authored_by?(current_user)
      render json: {error: "Not authorized to perform this action"}, status: :forbidden
    end
  end
end
