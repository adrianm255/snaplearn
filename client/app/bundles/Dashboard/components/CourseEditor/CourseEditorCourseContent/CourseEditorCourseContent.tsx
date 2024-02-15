import React, { useState } from 'react';
import { useStore } from '../../../../../hooks-store/store';
import { CourseStoreAction } from '../../../../../hooks-store/courseStore';
import Field, { FieldType } from '../../../../../common/components/Field/Field';
import CourseSection from '../CourseSection/CourseSection';
import DropdownButton from '../../../../../common/components/DropdownButton/DropdownButton'
import { CourseSectionType } from '../../../../../types/course';
import { getSectionIconClass } from '../../../../../helpers/courseHelper';
import useTranslation from '../../../../../libs/i18n/useTranslation';

const CourseEditorCourseContent: React.FC = () => {
  const [ state, dispatch ] = useStore();
  const { t } = useTranslation();
  const course = state.course;
  course.courseSections?.sort((a, b) => a.order - b.order);

  const handleAddSection = (sectionType: CourseSectionType) => {
    dispatch(CourseStoreAction.AddCourseSection, sectionType, t('course_section.new_section_title'));
  };

  return (<div className="course-sections">
    {course.courseSections.map(section => (
      <CourseSection key={section.id} courseSectionId={section.id} expanded={section.isNew}/>
    ))}

    <DropdownButton key={course.courseSections?.length}>
      <DropdownButton.Button>
        <span className="icon icon-plus-circle"></span>
        <span className="content">{t('course_editor.add_section_label')}</span>
      </DropdownButton.Button>
      <DropdownButton.Dropdown>
        <div className="tab-buttons small" role="tablist">
          {Object.values(CourseSectionType).map(csType => (
            <button role="tab" onClick={() => handleAddSection(csType)}>
              <span className={"icon " + getSectionIconClass(csType)}></span>
              {t(`course_section.type.${csType}_label`)}
          </button>
          ))}
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseEditorCourseContent;