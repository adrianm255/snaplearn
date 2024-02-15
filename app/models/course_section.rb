class CourseSection < ApplicationRecord
  include ActionView::Helpers::NumberHelper
  
  enum section_type: [:rich_text, :pdf, :video]
  has_one_attached :file
  belongs_to :course

  def file_data
    if file.attached?
      {
        url: Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true),
        size: number_to_human_size(file.blob.byte_size),
        content_type: file.blob.content_type,
        filename: file.blob.filename.to_s
      }
    end
  end
end
