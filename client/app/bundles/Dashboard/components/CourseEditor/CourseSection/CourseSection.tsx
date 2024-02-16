import React, { useState } from "react";
import Field, { FieldType } from "../../../../../common/components/Field/Field";
import { useStore } from "../../../../../hooks-store/store";
import { CourseStoreAction } from "../../../../../hooks-store/courseStore";
import { CourseSectionType } from "../../../../../types/course";
import { getSectionIconClass } from "../../../../../helpers/courseHelper";
import useTranslation from "../../../../../libs/i18n/useTranslation";

const CourseSection: React.FC<{ courseSectionId: string, expanded?: boolean }> = ({ courseSectionId, expanded = false }) => {
  const [ isExpanded, setIsExpanded ] = useState(expanded);
  const [ state, dispatch ] = useStore();
  const { t } = useTranslation();

  const courseSection = state.course.courseSections.find(section => section.id === courseSectionId);
  const courseSectionIconClass = getSectionIconClass(courseSection.sectionType);

  const handleSectionAttributeChange = (attrName: string, value: any) => {
    dispatch(CourseStoreAction.UpdateCourseSectionAttribute, courseSection.id, attrName, value);
  };

  const getFileInputAcceptTypes = (): string => {
    return courseSection.sectionType === CourseSectionType.Pdf ? 'application/pdf' : 'video/mp4, video/webm, video/ogg';
  };

  return (
    <div className="course-section">
      <div className="content">
        <span className={"icon section-type-icon " + courseSectionIconClass}></span>
        <div>
          <h3>{courseSection.title}</h3>
          <ul className="inline">
            <li>{t(`course_section.type.${courseSection.sectionType}_label`)}</li>
            {courseSection.fileData && <li>{courseSection.fileData.size}</li>}
          </ul>
        </div>
      </div>
      <div className="actions">
        <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
          <span className={"icon " + (isExpanded ? "icon-outline-cheveron-up" : "icon-outline-cheveron-down")}></span>
        </button>
        <button className="outline-danger" type="button" aria-label="Remove" onClick={() => dispatch(CourseStoreAction.DeleteCourseSection, courseSection.id)}>
          <span className="icon icon-trash2"></span>
        </button>
      </div>
      {isExpanded && <div className="drawer">
        <form>
          <section className="input-group">
            <Field
              type={FieldType.Text}
              name="course_section_title"
              label={t('course_section.title_label')}
              placeholder={t('course_section.title_label')}
              value={courseSection.title}
              onChange={e => handleSectionAttributeChange('title', e.target.value)}
              required
            />

            <Field
              type={FieldType.Textarea}
              name="course_section_description"
              label={t('course_section.description_label')}
              placeholder={t('course_section.description_label')}
              value={courseSection.description}
              onChange={e => handleSectionAttributeChange('description', e.target.value)}
            />
          </section>

          <section className="input-group">
            {courseSection.sectionType === CourseSectionType.RichText && <Field
              type={FieldType.RichText}
              name="course_section_content"
              label={t('course_section.content_label')}
              placeholder={t('course_section.content_label')}
              value={courseSection.content}
              onChange={e => handleSectionAttributeChange('content', e)}
            />}

            {courseSection.sectionType !== CourseSectionType.RichText && courseSection.isNew && <Field
              type={FieldType.File}
              name="course_section_file"
              label={t('course_section.content_label')}
              accept={getFileInputAcceptTypes()}
              onChange={e => handleSectionAttributeChange('file', (e.target as HTMLInputElement)!.files?.[0])}
              required
            />}

            {courseSection.sectionType !== CourseSectionType.RichText && courseSection.fileData && (<>
              <label htmlFor="course_section_type">{t('course_section.content_label')}</label>
              <div className="content">
                <span className={"icon " + courseSectionIconClass}></span>
                <ul className="inline">
                  <li>{courseSection.fileData.filename}</li>
                  <li>{courseSection.fileData.size}</li>
                </ul>
              </div>
            </>)}
          </section>
        </form>
      </div>}
    </div>
  );
};

export default CourseSection;