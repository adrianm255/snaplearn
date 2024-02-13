import ReactOnRails from 'react-on-rails';
import SidebarNav from '../bundles/Dashboard/components/SidebarNav/SidebarNav';
import CourseEditorPage from '../bundles/Dashboard/pages/CourseEditorPage';
import UserCoursesPage from '../bundles/Dashboard/pages/UserCoursesPage';

ReactOnRails.register({
  SidebarNav,
  UserCoursesPage,
  CourseEditorPage,
});
