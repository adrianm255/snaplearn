import React from 'react';
import configureCourseEditorStore from '../../../hooks-store/courseEditorStore';
import CourseEditor from '../components/CourseEditor/CourseEditor';
import { CourseRaw } from '../../../types/course';
import { serverFormatToClientFormat } from '../../../helpers/dataMapper';

const CourseEditorPage: React.FC<{ course: CourseRaw }> = ({ course }) => {
  configureCourseEditorStore(serverFormatToClientFormat(course));

  return (<CourseEditor />);
};

export default CourseEditorPage;