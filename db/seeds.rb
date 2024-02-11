# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


Course.destroy_all

# # Create 20 posts
# 100.times do
#   Post.create(
#     title: Faker::Lorem.sentence(word_count: 3),
#     body: Faker::Lorem.paragraph(sentence_count: 3)
#   )
# end

Course.create(
  title: 'Test course 1',
  description: 'Course 1 desc',
  author: User.first
)

Course.create(
  title: 'Test course 2',
  description: 'Course 2 desc',
  author: User.first
)

Course.create(
  title: 'Test course 3',
  description: 'Course 3 desc',
  author: User.first
)
