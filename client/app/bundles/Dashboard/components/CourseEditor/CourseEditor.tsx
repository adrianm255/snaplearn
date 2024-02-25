import React from 'react';
import { Course } from '../../../../types/course';
import { Tab, TabList, TabPanel, Tabs } from '../../../../common/components/Tabs/Tabs';
import useTranslation from '../../../../libs/i18n/useTranslation';
import CourseEditorDetails from './CourseEditorDetails';
import CourseEditorContent from './CourseEditorContent';
import { useStore } from '../../../../hooks-store/store';
import { publishCourse, unpublishCourse, updateCourse } from '../../../../services/courseService';
import { clientFormatToServerFormat, serverFormatToClientFormat } from '../../../../helpers/dataMapper';
import { convertToFormData } from '../../../../helpers/formDataHelper';
import { CourseEditorStoreAction } from '../../../../hooks-store/courseEditorStore';
import Button from '../../../../common/components/Button/Button';

const CourseEditor: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const [isSaveButtonLoading, setIsSaveButtonLoading] = React.useState(false);
  const [isPublishButtonLoading, setIsPublishButtonLoading] = React.useState(false);
  const course: Course = state.course;

  const saveCourseChanges = async () => {
    try {
      course.courseSections?.forEach(section => {
        if (section.isNew) delete section.id;
      });
      const formattedCourse = clientFormatToServerFormat(course);
      const payload = convertToFormData({ course: formattedCourse });

      setIsSaveButtonLoading(true);
      const response = await updateCourse(course.id, payload);
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      // TODO
    } finally {
      setIsSaveButtonLoading(false);
    }
  };

  const handleCoursePublish = async () => {
    try {
      setIsPublishButtonLoading(true);
      const response = await publishCourse(course.id);
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      // TODO
    } finally {
      setIsPublishButtonLoading(false);
    }
  };

  const handleCourseUnpublish = async () => {
    try {
      setIsPublishButtonLoading(true);
      const response = await unpublishCourse(course.id);
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      // TODO
    } finally {
      setIsPublishButtonLoading(false);
    }
  };
  
  return <Tabs>
    <header className="dashboard-header sticky">
      <h1>{course.title}</h1>
      <div className="actions">
        <Button type="button" isLoading={isSaveButtonLoading} disabled={isSaveButtonLoading || isPublishButtonLoading} onClick={saveCourseChanges}>{t('course_editor.save_changes_label')}</Button>
        <Button type="button" isLoading={isPublishButtonLoading} disabled={isSaveButtonLoading || isPublishButtonLoading} buttonClass="accent" onClick={course.published ? handleCourseUnpublish : handleCoursePublish}>
          {course.published ? t('course_editor.unpublish_label') : t('course_editor.publish_label')}
        </Button>
      </div>
      <TabList>
        <Tab tabId="courseTab">{t('course_editor.course_tab_label')}</Tab>
        <Tab tabId="contentTab">{t('course_editor.content_tab_label')}</Tab>
      </TabList>
    </header >
    <main className="content course-editor">
      <TabPanel tabId="courseTab">
        <CourseEditorDetails />
      </TabPanel>
      <TabPanel tabId="contentTab">
        <CourseEditorContent />
      </TabPanel>
    </main>
  </Tabs>;
};

export default CourseEditor;