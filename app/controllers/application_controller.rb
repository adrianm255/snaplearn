class ApplicationController < ActionController::Base
  before_action :set_navbar_items

  private

  def set_navbar_items
    @navbar_items = [
      {
        title: t('dashboard.title'),
        url: dashboard_path,
        active: request.path == dashboard_path,
        section: 'home-section',
        iconClass: 'icon-shop-window-fill'
      },
      {
        title: t('courses.title'),
        url: courses_path,
        active: request.path == courses_path || request.path.start_with?('/course'),
        section: 'home-section',
        iconClass: 'icon-archive-fill'
      },
      {
        title: t('discover.title'),
        url: discover_path,
        active: request.path == discover_path,
        section: 'discover-section',
        iconClass: 'icon-solid-search'
      },
      {
        title: t('library.title'),
        url: library_path,
        active: request.path == library_path,
        section: 'discover-section',
        iconClass: 'icon-bookmark-heart-fill'
      },
    ]
  end
end
