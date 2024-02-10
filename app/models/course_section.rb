class CourseSection < ApplicationRecord
  enum section_type: [:rich_text, :pdf, :video]
  has_one_attached :file
  belongs_to :course
end
