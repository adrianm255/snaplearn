class DiscoverController < ApplicationController
  layout 'courses'

  def index
    @courses = Course.where(published: true).order(created_at: :desc)
  end
end
