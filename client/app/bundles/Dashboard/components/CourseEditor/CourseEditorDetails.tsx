import React from 'react';
import Field, { FieldType } from '../../../../common/components/Field/Field';
import { useStore } from '../../../../hooks-store/store';
import { CourseEditorStoreAction } from '../../../../hooks-store/courseEditorStore';
import useTranslation from '../../../../libs/i18n/useTranslation';

const CourseEditorDetails: React.FC = () => {
  const [ state, dispatch ] = useStore();
  const { t } = useTranslation();
  const course = state.course;
  
  return (
    <form>
      <section className="input-group">
        <Field
          type={FieldType.Text}
          name="course_title"
          label={t('course.title_label')}
          placeholder={t('course.title_label')}
          value={course.title}
          onChange={e => dispatch(CourseEditorStoreAction.UpdateCourseAttribute, 'title', e.target.value)}
          required
        />

        <Field
          type={FieldType.Textarea}
          name="course_description"
          label={t('course.description_label')}
          placeholder={t('course.description_label')}
          value={course.description}
          onChange={e => dispatch(CourseEditorStoreAction.UpdateCourseAttribute, 'description', e.target.value)}
        />
      </section>
    </form>
  );
};

export default CourseEditorDetails;