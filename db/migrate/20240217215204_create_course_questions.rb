class CreateCourseQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :course_questions, id: :uuid do |t|
      t.text :body
      t.text :answer
      t.belongs_to :course, null: false, foreign_key: true, type: :uuid
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.json :relevant_sections

      t.timestamps
    end
  end
end
