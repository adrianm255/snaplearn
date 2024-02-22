class CoursesController < ApplicationController
  include Paginatable

  layout 'courses'
  
  before_action :authenticate_user!
  before_action :set_course, only: %i[ show ]
  before_action :set_navbar_title
  before_action :authorize_user!
  
  # GET /course/1
  def show
    course_questions = current_user.course_questions.where(course: @course).order(created_at: :desc)
    paginated_questions, total_count = paginate(course_questions)

    @course_data = @course.as_json.merge(course_questions: paginated_questions)
    @course_questions_count = total_count
    @current_user_is_author = @course.authored_by?(current_user)
  end

  private

  def set_course
    @course = Course.includes(course_sections: { file_attachment: :blob }).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course not found" }, status: :not_found
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
