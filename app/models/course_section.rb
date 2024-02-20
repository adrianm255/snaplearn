class CourseSection < ApplicationRecord
  include ActionView::Helpers::NumberHelper

  enum section_type: [:rich_text, :pdf, :video]
  has_one_attached :file
  belongs_to :course
  has_many :course_section_embeddings, dependent: :destroy

  after_create_commit -> { process_section }
  after_update_commit -> { process_updated_section }, if: -> { saved_change_to_content? }

  def file_data
    if file.attached?
      file_blob = file.blob
      {
        url: Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true),
        size: number_to_human_size(file_blob.byte_size),
        content_type: file_blob.content_type,
        filename: file_blob.filename.to_s
      }
    end
  end

  private

  def process_updated_section
    # The course section's content will be re-processed and re-embedded so destroy current embeddings
    self.course_section_embeddings.destroy_all
    process_section
  end

  def process_section
    redis_key = "course:#{self.course_id}:sections_processing_count"
    redis = Redis.new
    redis.incr(redis_key)
    redis.close
    
    ProcessCourseSectionJob.perform_in(15.seconds, self.id)
  end
end
