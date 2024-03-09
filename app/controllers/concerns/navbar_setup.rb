module NavbarSetup
  extend ActiveSupport::Concern

  included do
    before_action :set_navbar_items
  end

  private

  def set_navbar_items
    @navbar_items = [
      {
        title: t('dashboard.title'),
        url: dashboard_path,
        active: request.path == dashboard_path,
        section: 'home-section',
        iconClass: 'home'
      },
      {
        title: t('courses.title'),
        url: courses_path,
        active: request.path == courses_path || request.path.start_with?('/course'),
        section: 'home-section',
        iconClass: 'courses'
      },
      {
        title: t('discover.title'),
        url: discover_path,
        active: request.path == discover_path,
        section: 'discover-section',
        iconClass: 'discover'
      },
      {
        title: t('library.title'),
        url: library_path,
        active: request.path == library_path,
        section: 'discover-section',
        iconClass: 'library'
      },
    ]

    @user_info = current_user
  end
end