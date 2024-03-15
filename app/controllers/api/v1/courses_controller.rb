class Api::V1::CoursesController < ApplicationController
  before_action :set_course, only: %i[ show update destroy publish unpublish download_file serve_file ]
  before_action :authenticate_user!
  before_action :authorize_user!, only: [:update, :destroy, :publish, :unpublish]
  before_action :authorize_download!, only: [:download_file, :serve_file]

  # GET /courses
  def index
    @courses = Course.all.order(created_at: :desc)

    render json: @courses
  end

  # GET /courses/1
  def show
    render json: @course.as_json
  end

  def create
    @course = Course.new(course_params)
    @course.author = current_user

    if @course.save
      render json: @course.as_json, status: :created
    else
      render_errors(@course)
    end
  end

  # PATCH/PUT /courses/1
  def update
    process_course_sections(params[:course][:course_sections_attributes]) unless !params[:course][:course_sections_attributes]

    if @course.update(course_params)
      render json: @course.as_json
    else
      render_errors(@course)
    end
  end

  # DELETE /courses/1
  def destroy
    @course.destroy!
  end

  def publish
    @course.published = true
    if @course.save
      render json: @course.as_json
    else
      render_errors(@course)
    end
  end

  def unpublish
    @course.published = false
    if @course.save
      render json: @course.as_json
    else
      render_errors(@course)
    end
  end

  # GET /course/1/1/download
  def download_file
    course_section = @course.course_sections.find(params[:course_section_id])
    
    if course_section.file.attached?
      redirect_to rails_blob_path(course_section.file, disposition: "attachment")
    else
      head :not_found
    end
  end

  def serve_file
    course_section = @course.course_sections.find(params[:course_section_id])
    file = course_section.file
  
    if file.attached?
      response.headers['Content-Type'] = file.blob.content_type
      response.headers['Content-Disposition'] = 'inline'
      file.blob.download do |chunk|
        response.stream.write(chunk)
      end
    else
      head :not_found
    end
  ensure
    response.stream.close
  end

  private

  def set_course
    @course = Course.includes(course_sections: { file_attachment: :blob }).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course not found" }, status: :not_found
  end

  def course_params
    params.require(:course).permit(:title, :description, course_sections_attributes: [:id, :title, :description, :content, :section_type, :order, :file, :_destroy])
  end

  def render_errors(object)
    render json: { errors: object.errors }, status: :unprocessable_entity
  end

  def authorize_user!
    unless @course.authored_by?(current_user)
      render json: {error: "Not authorized to perform this action"}, status: :forbidden
    end
  end

  def authorize_download!
    unless @course.authored_by?(current_user) || @course.published
      render json: {error: "Not authorized to perform this action"}, status: :forbidden
    end
  end

  def process_course_sections(course_sections_attributes)
    current_section_ids = @course.course_sections.pluck(:id)
    new_section_ids = []
    course_sections_attributes.each do |_, cs|
      new_section_ids << cs['id'] if cs['id']
    end
    max_key = course_sections_attributes.keys.map(&:to_i).max || -1
    section_ids_to_delete = current_section_ids.difference(new_section_ids)
    section_ids_to_delete.each do |id|
      max_key += 1
      course_sections_attributes[max_key.to_s] = { id: id, _destroy: '1' }
    end
  end
end
