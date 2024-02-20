class DiscoverController < ApplicationController
  layout 'courses'

  def index
    @courses = Course.where(published: true).order(created_at: :desc).as_json(include: { author: { only: %i[id email] } })
  end
end
