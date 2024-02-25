import React, { useRef, useState } from 'react';
import { useStore } from '../../../../hooks-store/store';
import { CourseEditorStoreAction } from '../../../../hooks-store/courseEditorStore';
import CourseSection from './CourseSection/CourseSection';
import DropdownButton from '../../../../common/components/DropdownButton/DropdownButton'
import { CourseSectionType } from '../../../../types/course';
import { getSectionIconClass } from '../../../../helpers/courseHelper';
import useTranslation from '../../../../libs/i18n/useTranslation';
import FileInput, { FileInputHandle } from '../../../../common/components/FileInput/FileInput';

const CourseEditorContent: React.FC = () => {
  const [ state, dispatch ] = useStore();
  const { t } = useTranslation();
  const fileInputRef = useRef<FileInputHandle>(null);
  
  const course = state.course;
  course.courseSections?.sort((a, b) => a.order - b.order);

  const openFileUploadDialog = () => {
    fileInputRef.current?.openFileDialog();
  };

  const clearFileInput = () => {
    fileInputRef.current?.clear();
  };

  const handleAddSection = (sectionType: CourseSectionType) => {
    dispatch(CourseEditorStoreAction.AddCourseSection, {
      sectionType,
      title: t('course_section.new_section_title'),
    });
  };

  const handleAddSectionFromFile = (files: FileList) => {
    Array.from(files).forEach((file, i) => {
      const sectionType = file.type.includes('pdf') ? CourseSectionType.Pdf : CourseSectionType.Video;
      const fileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newSection = {
        sectionType,
        title: fileName,
        id: `${Date.now()}${i}`,
        file,
        fileData: {
          contentType: file.type,
          filename: file.name
        }
      };
      dispatch(CourseEditorStoreAction.AddCourseSection, newSection);
      clearFileInput();
    });
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
            <button key={csType} role="tab" onClick={() => handleAddSection(csType)}>
              <span className={"icon " + getSectionIconClass(csType)}></span>
              {t(`course_section.type.${csType}_label`)}
            </button>
          ))}
          <button role="tab" onClick={() => openFileUploadDialog()}>
            <span className="icon icon-upload"></span>
            {t('course_editor.add_section_from_file_label')}
          </button>
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>

    <FileInput
      ref={fileInputRef}
      style={{ display: 'none' }}
      name="course_section_files"
      id="course_section_files"
      accept="video/mp4, video/webm, video/ogg, application/pdf"
      multiple
      onFileSelect={handleAddSectionFromFile}
    />
  </div>);
};

export default CourseEditorContent;