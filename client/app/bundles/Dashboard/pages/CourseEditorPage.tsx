import React from 'react';
import configureCourseStore from '../../../hooks-store/courseStore';
import CourseEditor from '../components/CourseEditor/CourseEditor';
import { Course, CourseRaw } from '../../../types/course';
import { serverFormatToClientFormat } from '../../../helpers/dataMapper';

const CourseEditorPage: React.FC<{ course: CourseRaw }> = ({ course }) => {
  configureCourseStore(serverFormatToClientFormat(course));

  return (<CourseEditor />);
};

export default CourseEditorPage;