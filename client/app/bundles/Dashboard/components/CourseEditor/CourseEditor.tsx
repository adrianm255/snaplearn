import React from 'react';
import { Course } from '../../../../types/course';
import { Tab, TabList, TabPanel, Tabs } from '../../../../common/components/Tabs/Tabs';
import useTranslation from '../../../../libs/i18n/useTranslation';
import CourseEditorCourseDetails from './CourseEditorCourseDetails/CourseEditorCourseDetails';
import CourseEditorCourseContent from './CourseEditorCourseContent/CourseEditorCourseContent';
import { useStore } from '../../../../hooks-store/store';
import { updateCourse } from '../../../../services/courseService';
import { clientFormatToServerFormat, serverFormatToClientFormat } from '../../../../helpers/dataMapper';
import { convertToFormData } from '../../../../helpers/formDataHelper';
import { CourseStoreAction } from '../../../../hooks-store/courseStore';

const CourseEditor: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const course = state.course;

  const saveCourseChanges = async () => {
    try {
      // TODO move this somewhere else?
      course.courseSections?.forEach(section => {
        if (section.isNew) delete section.id;
      });
      const formattedCourse = clientFormatToServerFormat(course);
      const payload = convertToFormData({ course: formattedCourse });

      const response = await updateCourse(course.id, payload);
      console.log('RESPONSE');
      console.log(response);

      dispatch(CourseStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      // TODO
    }
  };
  
  return <Tabs>
    <header className="dashboard-header sticky">
      <h1>{course.title}</h1>
      <div className="actions">
        <button type="button" onClick={saveCourseChanges}>{t('course_editor.save_changes_label')}</button>
        <button type="button" className="accent">Test 2</button>
      </div>
      <TabList>
        <Tab tabId="courseTab">{t('course_editor.course_tab_label')}</Tab>
        <Tab tabId="contentTab">{t('course_editor.content_tab_label')}</Tab>
      </TabList>
    </header >
    <main className="content course-editor">
      <TabPanel tabId="courseTab">
        <CourseEditorCourseDetails />
      </TabPanel>
      <TabPanel tabId="contentTab">
        <CourseEditorCourseContent />
      </TabPanel>
    </main>
  </Tabs>;
};

export default CourseEditor;