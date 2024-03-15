require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users
  
  namespace :api do
    namespace :v1 do
      get 'course/:id/:course_section_id/download', to: 'courses#download_file', as: 'download_course_section_file'
      get 'course/:id/:course_section_id/:file_name', to: 'courses#serve_file', as: 'serve_course_section_file'

      post 'course/:id/publish', to: 'courses#publish', as: :publish_course
      post 'course/:id/unpublish', to: 'courses#unpublish', as: :unpublish_course

      resources :courses
      
      # Question streaming
      get 'question_stream/:session_id', to: 'course_question_streaming#stream', as: :stream_question

      # Questions
      resources :course_questions, path: 'questions', only: %i[ index create ]
    end
  end

  # User courses
  get 'courses', to: 'user_courses#index'
  get 'course/:id/edit', to: 'user_courses#edit', as: :course_edit

  # Dashboard
  get 'dashboard', to: 'dashboard#index'

  # Courses
  get 'course/:id', to: 'courses#show'

  # Library
  get 'library', to: 'library#index'
  
  # Discover
  get 'discover', to: 'discover#index'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root :to => redirect('/dashboard')

  mount Sidekiq::Web => '/sidekiq'
end
