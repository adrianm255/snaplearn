import React from 'react';
import { Course } from '../../../../types/course';
import useTranslation from '../../../../libs/i18n/useTranslation';
import CourseEditorDetails from './CourseEditorDetails';
import CourseEditorContent from './CourseEditorContent';
import { useStore } from '../../../../hooks-store/store';
import { publishCourse, unpublishCourse, updateCourse } from '../../../../services/courseService';
import { clientFormatToServerFormat, serverFormatToClientFormat } from '../../../../helpers/dataMapper';
import { convertToFormData } from '../../../../helpers/formDataHelper';
import { CourseEditorStoreAction } from '../../../../hooks-store/courseEditorStore';
import { ToastStoreAction } from '../../../../hooks-store/toastStore';
import { Button } from '@/common/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const CourseEditor: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const [isSaveButtonLoading, setIsSaveButtonLoading] = React.useState(false);
  const [isPublishButtonLoading, setIsPublishButtonLoading] = React.useState(false);
  const course: Course = state.course;

  const handleSuccess = (message: string) => {
    dispatch(ToastStoreAction.ShowToast, { message, type: 'success' });
  };

  const handleError = (errors: any) => {
    let errorToDisplay = '';
    if (errors?.title?.length > 0) {
      errorToDisplay = `Title ${errors.title[0]}`;
    } else if (errors?.['course_sections.title']?.length > 0) {
      errorToDisplay = `Section title ${errors['course_sections.title'][0]}`;
    } else if (errors?.['course_sections.file']?.length > 0) {
      errorToDisplay = `File ${errors['course_sections.file'][0]}`;
    } else if (errors?.['course_sections.content']?.length > 0) {
      errorToDisplay = `Content ${errors['course_sections.content'][0]}`;
    }
    if (errorToDisplay !== '') {
      dispatch(ToastStoreAction.ShowToast, { message: errorToDisplay, type: 'danger' });
    }
  };

  const saveCourseChanges = async () => {
    try {
      course.courseSections?.forEach(section => {
        if (section.isNew) delete section.id;
      });
      const formattedCourse = clientFormatToServerFormat(course);
      const payload = convertToFormData({ course: formattedCourse });

      setIsSaveButtonLoading(true);
      const response = await updateCourse(course.id, payload);

      handleSuccess('Changes saved');
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      handleError(e.errors);
    } finally {
      setIsSaveButtonLoading(false);
    }
  };

  const handleCoursePublish = async () => {
    try {
      setIsPublishButtonLoading(true);
      const response = await publishCourse(course.id);
      handleSuccess('Course published');
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      handleError(e.errors);
    } finally {
      setIsPublishButtonLoading(false);
    }
  };

  const handleCourseUnpublish = async () => {
    try {
      setIsPublishButtonLoading(true);
      const response = await unpublishCourse(course.id);
      handleSuccess('Course unpublished');
      await dispatch(CourseEditorStoreAction.UpdateCourse, serverFormatToClientFormat(response));
    } catch (e) {
      handleError(e.errors);
    } finally {
      setIsPublishButtonLoading(false);
    }
  };
  
  return <>
    <DashboardHeader>
      <h1>{course.title}</h1>
      <div className="actions">
        <Button variant="secondary" type="button" disabled={isSaveButtonLoading || isPublishButtonLoading} onClick={saveCourseChanges}>
          {isSaveButtonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('course_editor.save_changes_label')}
        </Button>
        <Button variant="highlight" type="button" disabled={isSaveButtonLoading || isPublishButtonLoading} onClick={course.published ? handleCourseUnpublish : handleCoursePublish}>
          {isPublishButtonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {course.published ? t('course_editor.unpublish_label') : t('course_editor.publish_label')}
        </Button>
      </div>
    </DashboardHeader>
    
    <main className="content course-editor">
      <Tabs defaultValue="courseTab">
        <TabsList>
          <TabsTrigger value="courseTab">{t('course_editor.course_tab_label')}</TabsTrigger>
          <TabsTrigger value="contentTab">{t('course_editor.content_tab_label')}</TabsTrigger>
        </TabsList>
        <TabsContent value="courseTab"><CourseEditorDetails /></TabsContent>
        <TabsContent value="contentTab"><CourseEditorContent /></TabsContent>
      </Tabs>
    </main>
</>};

export default CourseEditor;