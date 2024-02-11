class AddAuthorToCourses < ActiveRecord::Migration[7.1]
  def change
    add_reference :courses, :author, null: true, foreign_key: { to_table: :users }, type: :uuid
  end
end
