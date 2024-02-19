class LibraryController < ApplicationController
  layout 'dashboard'

  before_action :set_navbar_title
  before_action :authenticate_user!

  def index
    
  end

  def set_navbar_title
    @navbar_title = t('library.title')
  end
end
