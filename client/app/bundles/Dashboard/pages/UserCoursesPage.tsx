import React from 'react';
import UserCourses from '../components/UserCourses/UserCourses';
import { Course } from '@/types/course';
import { serverFormatToClientFormat } from '@/helpers/dataMapper';
import configureToastStore from '@/hooks-store/toastStore';
import CourseEditorNotifications from '../components/CourseEditor/CourseEditorNotifications';

const UserCoursesPage: React.FC<{ courses: Course[] }> = ({ courses }) => {
  configureToastStore({ toast: { message: '', type: '', visible: false }});
  return(<>
    <CourseEditorNotifications />
    <UserCourses courses={serverFormatToClientFormat(courses)} />
  </>);
};

export default UserCoursesPage;