class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses, id: :uuid do |t|
      t.string :title
      t.text :description
      t.boolean :published

      t.timestamps
    end
  end
end
