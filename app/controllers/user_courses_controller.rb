class UserCoursesController < ApplicationController
  layout "dashboard"

  before_action :set_course, only: %i[ edit ]
  before_action :set_navbar_courses_title, only: %i[ index ]
  before_action :set_navbar_course_title, only: %i[ edit ]
  before_action :authenticate_user!
  before_action :authorize_user!, only: [ :edit ]

  def index
    redis = Redis.new
    @courses = current_user.courses.order(created_at: :desc).as_json.map do |course|
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
    #TODO rescue
    @course = Course.find(params[:id])
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
  end
end
