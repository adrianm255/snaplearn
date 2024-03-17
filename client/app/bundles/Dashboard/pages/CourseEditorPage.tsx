import React from 'react';
import configureCourseEditorStore from '@/hooks-store/courseEditorStore';
import CourseEditor from '../components/CourseEditor/CourseEditor';
import { CourseRaw } from '@/types/course';
import { serverFormatToClientFormat } from '@/helpers/dataMapper';
import configureToastStore from '@/hooks-store/toastStore';
import CourseEditorNotifications from '../components/CourseEditor/CourseEditorNotifications';

const CourseEditorPage: React.FC<{ course: CourseRaw }> = ({ course }) => {
  configureCourseEditorStore(serverFormatToClientFormat(course));
  configureToastStore({ toast: { message: '', type: 'success', visible: false }});

  return (
    <>
      <CourseEditorNotifications />
      <CourseEditor />
    </>
  );
};

export default CourseEditorPage;