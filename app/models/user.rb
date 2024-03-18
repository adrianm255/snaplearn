class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :courses, foreign_key: 'author_id', class_name: 'Course'
  has_many :course_questions, dependent: :destroy

  enum role: { default: 0, admin: 1 }

  validates :username, presence: true, uniqueness: { case_sensitive: false }, length: { minimum: 3, maximum: 50 }, format: { with: /\A[a-zA-Z0-9]+\z/, message: "only allows alphanumeric characters" }

  after_initialize :set_default_role, if: :new_record?

  private

  def set_default_role
    self.role ||= :default
  end
end
