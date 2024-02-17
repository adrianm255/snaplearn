class CreateCourseSectionEmbeddings < ActiveRecord::Migration[7.1]
  def change
    create_table :course_section_embeddings, id: :uuid do |t|
      t.text :content
      t.json :embedding
      t.integer :order
      t.belongs_to :course_section, null: false, foreign_key: true, type: :uuid
      t.json :details

      t.timestamps
    end
  end
end
