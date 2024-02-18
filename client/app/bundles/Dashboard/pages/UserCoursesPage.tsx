import React from 'react';
import UserCourses from '../components/UserCourses/UserCourses';
import { Course } from '../../../types/course';
import { serverFormatToClientFormat } from '../../../helpers/dataMapper';

const UserCoursesPage: React.FC<{ courses: Course[] }> = ({ courses }) => {

  return <UserCourses courses={serverFormatToClientFormat(courses)} />
};

export default UserCoursesPage;