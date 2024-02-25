import React, { useEffect, useRef, useState } from "react";
import Field, { FieldType } from "../../../../../common/components/Field/Field";
import { useStore } from "../../../../../hooks-store/store";
import { CourseEditorStoreAction } from "../../../../../hooks-store/courseEditorStore";
import { CourseSectionType } from "../../../../../types/course";
import { getSectionIconClass } from "../../../../../helpers/courseHelper";
import useTranslation from "../../../../../libs/i18n/useTranslation";
import FileInput, { FileInputHandle } from "../../../../../common/components/FileInput/FileInput";

const CourseSection: React.FC<{ courseSectionId: string, expanded?: boolean }> = ({ courseSectionId, expanded = false }) => {
  const [ isExpanded, setIsExpanded ] = useState(expanded);
  const [ state, dispatch ] = useStore();
  const { t } = useTranslation();
  const fileInputRef = useRef<FileInputHandle>(null);

  const courseSection = state.course.courseSections.find(section => section.id === courseSectionId);
  const courseSectionIconClass = getSectionIconClass(courseSection.sectionType);

  useEffect(() => {
    if (courseSection.sectionType !== CourseSectionType.RichText && courseSection?.isNew && !courseSection.file) {
      openFileUploadDialog();
    }
  }, []);

  const handleSectionAttributeChange = (attrName: string, value: any) => {
    dispatch(CourseEditorStoreAction.UpdateCourseSectionAttribute, courseSection.id, attrName, value);
  };

  const getFileInputAcceptTypes = (): string => {
    return courseSection.sectionType === CourseSectionType.Pdf ? 'application/pdf' : 'video/mp4, video/webm, video/ogg';
  };

  const openFileUploadDialog = () => {
    fileInputRef.current?.openFileDialog();
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
        <button className="outline-danger" type="button" aria-label="Remove" onClick={() => dispatch(CourseEditorStoreAction.DeleteCourseSection, courseSection.id)}>
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

            {courseSection.sectionType !== CourseSectionType.RichText && courseSection.isNew &&
              <FileInput
                ref={fileInputRef}
                name="course_section_file"
                id="course_section_file"
                label={t('course_section.content_label')}
                accept={getFileInputAcceptTypes()}
                fileName={courseSection.fileData?.filename}
                onFileSelect={files => {
                  const file = files[0];
                  const fileName = file.name.replace(/\.[^/.]+$/, '');
                  handleSectionAttributeChange('file', file);
                  handleSectionAttributeChange('title', fileName.replace(/[-_]/g, ' '));
                }}
                description={courseSection.sectionType === CourseSectionType.Pdf ? t('course_section.pdf_file_description') : t('course_section.video_file_description')}
              />
            }

            {courseSection.sectionType !== CourseSectionType.RichText && courseSection.fileData && !courseSection.isNew && (<>
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