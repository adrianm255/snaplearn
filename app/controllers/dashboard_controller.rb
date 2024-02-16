class DashboardController < ApplicationController
  before_action :set_navbar_title

  def index
  end

  private

  def set_navbar_title
    @navbar_title = t('dashboard.title')
  end
end
