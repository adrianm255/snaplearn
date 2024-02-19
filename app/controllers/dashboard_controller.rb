class DashboardController < ApplicationController
  before_action :set_navbar_title
  before_action :authenticate_user!

  def index
  end

  private

  def set_navbar_title
    @navbar_title = t('dashboard.title')
  end
end
