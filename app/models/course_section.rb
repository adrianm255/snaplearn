class CourseSection < ApplicationRecord
  include ActionView::Helpers::NumberHelper

  enum section_type: [:rich_text, :pdf, :video]
  has_one_attached :file
  belongs_to :course
  has_many :course_section_embeddings, dependent: :destroy

  after_create_commit -> { process_section }
  after_update_commit -> { process_updated_section }, if: -> { saved_change_to_content? }

  validates :title, presence: true, length: { minimum: 3, maximum: 100 }
  validate :validate_content_and_file

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

  def validate_content_and_file
    case section_type
    when 'rich_text'
      if content.blank?
        errors.add(:content, "can't be blank for text sections")
      end

      if file.attached?
        errors.add(:file, "must be empty for text sections")
      end
    when 'video'
      if content.present?
        errors.add(:content, "must be empty for video sections")
      end

      unless file.attached? && video_file?
        errors.add(:file, "must be present and be a MP4, webm, or ogg file for video sections")
      end
    when 'pdf'
      if content.present?
        errors.add(:content, "must be empty for PDF sections")
      end

      unless file.attached? && pdf_file?
        errors.add(:file, "must be present and be a PDF file for PDF sections")
      end
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

  def video_file?
    file.content_type.in?(%w[video/mp4 video/webm video/ogg])
  end

  def pdf_file?
    file.content_type == 'application/pdf'
  end
end
