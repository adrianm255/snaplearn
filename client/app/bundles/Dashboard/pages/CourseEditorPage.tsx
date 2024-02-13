import React from 'react';
import configureCourseStore from '../../../hooks-store/courseStore';
import CourseEditor from '../components/CourseEditor/CourseEditor';
import { Course } from '../../../types/course';

const CourseEditorPage: React.FC<{ course: Course }> = ({ course }) => {
  configureCourseStore(course);

  return <CourseEditor course={course}/>
};

export default CourseEditorPage;