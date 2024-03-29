import ReactOnRails from 'react-on-rails';
import SidebarNav from '../bundles/Dashboard/components/SidebarNav/SidebarNav';
import CourseEditorPage from '../bundles/Dashboard/pages/CourseEditorPage';
import UserCoursesPage from '../bundles/Dashboard/pages/UserCoursesPage';
import CourseDetailPage from '../bundles/Courses/pages/CourseDetailPage';
import DiscoverPage from '../bundles/Courses/pages/DiscoverPage';

ReactOnRails.register({
  SidebarNav,
  UserCoursesPage,
  CourseEditorPage,
  CourseDetailPage,
  DiscoverPage,
});
