class CoursesController < ApplicationController
  layout 'courses'
  
  before_action :authenticate_user!
  before_action :set_course, only: %i[ show ]
  before_action :set_navbar_title
  
  # GET /course/1
  def show
    # TODO order by default
    course_questions = current_user.course_questions.where(course: @course).order(:created_at).last(3)
    @course_data = @course.as_json.merge(course_questions: course_questions)
  end

  private

  def set_course
    #TODO rescue
    @course = Course.find(params[:id])
  end

  def set_navbar_title
    @navbar_title = @course.title
  end
end
