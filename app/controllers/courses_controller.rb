class CoursesController < ApplicationController
  layout 'courses'
  
  before_action :authenticate_user!
  before_action :set_course, only: %i[ show ]
  before_action :set_navbar_title
  before_action :authorize_user!
  
  # GET /course/1
  def show
    # TODO order by default
    course_questions = current_user.course_questions.where(course: @course).order(:created_at).last(5)
    @course_data = @course.as_json.merge(course_questions: course_questions)
    @current_user_is_author = @course.authored_by?(current_user)
  end

  private

  def set_course
    #TODO rescue
    @course = Course.find(params[:id])
  end

  def authorize_user!
    unless @course.published || @course.authored_by?(current_user)
      render json: {error: "Not authorized to perform this action"}, status: :forbidden
    end
  end

  def set_navbar_title
    @navbar_title = @course.title
  end
end
