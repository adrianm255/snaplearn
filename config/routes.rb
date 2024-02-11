require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users
  
  namespace :api do
    namespace :v1 do
      resources :courses
    end
  end

  # User courses
  get 'courses', to: 'user_courses#index'
  get 'course/:id/edit', to: 'user_courses#edit'

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
  # root "posts#index"

  mount Sidekiq::Web => '/sidekiq'
end
