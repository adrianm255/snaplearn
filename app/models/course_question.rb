class CourseQuestion < ApplicationRecord
  belongs_to :course
  belongs_to :user

  # after_create_commit -> { process_question }

  private

  def process_question
    AskCourseQuestionJob.perform_async(self.id)
  end
end
