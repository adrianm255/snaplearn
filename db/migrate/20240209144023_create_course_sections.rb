class CreateCourseSections < ActiveRecord::Migration[7.1]
  def change
    create_table :course_sections, id: :uuid do |t|
      t.string :title
      t.text :description
      t.text :content
      t.integer :section_type
      t.integer :order
      t.belongs_to :course, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
