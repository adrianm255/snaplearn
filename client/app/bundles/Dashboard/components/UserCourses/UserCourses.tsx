import React from 'react';
import { Course } from '../../../../types/course';

const UserCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  return <>
    <header>
      <h1>Courses</h1>
    </header>
    <div className="content">
      {courses.map(course => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  </>;
};

export default UserCourses;