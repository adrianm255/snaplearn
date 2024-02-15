class Course < ApplicationRecord
  has_many :course_sections, dependent: :destroy
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  accepts_nested_attributes_for :course_sections, allow_destroy: true

  # Check if a given user is the author of the course
  def authored_by?(user)
    self.author_id == user.id
  end

  def as_json(options = nil)
    super(include: {
      course_sections: {
        methods: :file_data
      }
    })
  end
end
