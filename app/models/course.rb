class Course < ApplicationRecord
  has_many :course_sections, dependent: :destroy
  has_many :course_section_embeddings, through: :course_sections
  has_many :course_questions, dependent: :destroy
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  accepts_nested_attributes_for :course_sections, allow_destroy: true

  validates :title, presence: true, length: { minimum: 3, maximum: 100 }

  # Check if a given user is the author of the course
  def authored_by?(user)
    self.author_id == user.id
  end

  def as_json(options = nil)
    default_options = {
      include: {
        course_sections: {
          methods: :file_data
        },
        author: {
          only: [:id, :email, :username]
        }
      }
    }

    if options&.key?(:include)
      super(options)
    else
      super(default_options)
    end
  end
end
