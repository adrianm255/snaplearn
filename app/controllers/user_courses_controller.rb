class UserCoursesController < ApplicationController
  include NavbarSetup
  
  layout "dashboard"

  before_action :set_course, only: %i[ edit ]
  before_action :set_navbar_courses_title, only: %i[ index ]
  before_action :set_navbar_course_title, only: %i[ edit ]
  before_action :authenticate_user!
  before_action :authorize_user!, only: [ :edit ]

  def index
    redis = Redis.new
    @courses = current_user.courses.order(created_at: :desc).as_json(include: {}).map do |course|
      course["embedded_status"] = redis.exists("course:#{course["id"]}:content_chunks") == 1 || redis.exists("course:#{course["id"]}:sections_processing_count") == 1 ? "processing" : "embedded"
      course
    end
    redis.close
  end

  # GET /course/1/edit
  def edit
  end

  private

  def set_course
    @course = Course.includes(course_sections: { file_attachment: :blob }).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course not found" }, status: :not_found
  end

  def authorize_user!
    #TODO return 404 here?
    unless @course.authored_by?(current_user)
      render json: {error: "Not authorized to perform this action"}, status: :forbidden
    end
  end

  def set_navbar_courses_title
    @navbar_title = t('courses.title')
  end

  def set_navbar_course_title
    @navbar_title = @course.title
    @use_course_title = true;
  end
end
