import React from 'react';
import UserCourses from '../components/UserCourses/UserCourses';
import { Course } from '../../../types/course';

const UserCoursesPage: React.FC<{ courses: Course[] }> = ({ courses }) => {

  return <UserCourses courses={courses} />
};

export default UserCoursesPage;