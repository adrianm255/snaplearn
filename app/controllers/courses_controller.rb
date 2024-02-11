class CoursesController < ApplicationController
  before_action :set_course, only: %i[ show ]
  
  # GET /course/1
  def show
  end

  private

  def set_course
    #TODO rescue
    @course = Course.find(params[:id])
  end
end
