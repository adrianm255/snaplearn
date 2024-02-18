class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :courses, foreign_key: 'author_id', class_name: 'Course'
  has_many :course_questions, dependent: :destroy
end
