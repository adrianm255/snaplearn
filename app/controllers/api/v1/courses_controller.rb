class Api::V1::CoursesController < ApplicationController
  before_action :set_course, only: %i[ show update destroy ]
  # skip_before_action :verify_authenticity_token

  # GET /courses
  def index
    @courses = Course.all.order(created_at: :desc)

    render json: @courses
  end

  # GET /courses/1
  def show
    render json: @course.as_json(include: :course_sections)
  end

  def create
    @course = Course.new(course_params)

    if @course.save
      render json: @course.as_json(include: :course_sections), status: :created
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /courses/1
  def update
    process_course_sections(params[:course][:course_sections_attributes]) unless !params[:course][:course_sections_attributes]

    if @course.update(course_params)
      render json: @course.as_json(include: :course_sections)
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  # DELETE /courses/1
  def destroy
    @course.destroy!
  end

  private

  def set_course
    @course = Course.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Course not found" }, status: :not_found
  end

  def course_params
    params.require(:course).permit(:title, :description, :published, course_sections_attributes: [:id, :title, :description, :content, :section_type, :order, :file, :_destroy])
  end

  def process_course_sections(course_sections_attributes)
    #TODO handle form data type too
    current_section_ids = @course.course_sections.pluck(:id)
    new_section_ids = []
    course_sections_attributes.each do |cs|
      new_section_ids << cs['id']
    end
    # max_key = course_sections_attributes.keys.map(&:to_i).max || -1
    section_ids_to_delete = current_section_ids.difference(new_section_ids)
    section_ids_to_delete.each do |id|
      # max_key += 1
      # course_sections_attributes[max_key.to_s] = { id: id, _destroy: '1' }
      course_sections_attributes << { id: id, _destroy: '1' }
    end
  end
end
