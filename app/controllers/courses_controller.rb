class CoursesController < ApplicationController
  before_action :set_course, only: %i[ show ]
  before_action :set_navbar_title
  
  # GET /course/1
  def show
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
