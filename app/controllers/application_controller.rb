class ApplicationController < ActionController::Base
  before_action :set_navbar_items

  private

  def set_navbar_items
    @navbar_items = {
      items: [
        {
          title: 'Home',
          url: '/'
        },
        {
          title: 'Courses',
          url: courses_path
        },
        {
          title: 'Discover',
          url: discover_path
        },
        {
          title: 'Library',
          url: library_path
        },
      ]
    }
  end
end
