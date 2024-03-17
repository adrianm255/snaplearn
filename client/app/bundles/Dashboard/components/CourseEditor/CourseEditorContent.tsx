import React, { useRef, useState } from 'react';
import { useStore } from '@/hooks-store/store';
import { CourseEditorStoreAction } from '@/hooks-store/courseEditorStore';
import CourseSection from './CourseSection';
import { CourseSectionType } from '@/types/course';
import { getSectionIcon } from '@/helpers/courseHelper';
import useTranslation from '@/libs/i18n/useTranslation';
import FileInput, { FileInputHandle } from '@/common/components/FileInput';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Button } from '@/common/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';

const CourseEditorContent: React.FC = () => {
  const [ state, dispatch ] = useStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
    setIsPopoverOpen(false);
    dispatch(CourseEditorStoreAction.AddCourseSection, {
      sectionType,
      title: t('course_section.new_section_title'),
    });
  };

  const handleAddSectionFromFile = (files: FileList) => {
    setIsPopoverOpen(false);
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

  return (<div className="course-sections flex flex-col gap-4">
    {course.courseSections.map(section => (
      <CourseSection key={section.id} courseSectionId={section.id} expanded={section.isNew}/>
    ))}

    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="w-fit" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('course_editor.add_section_label')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="grid grid-cols-3 gap-3">
          {Object.values(CourseSectionType).map(csType => {
            const SectionIcon = getSectionIcon(csType)
            return <Button className="h-auto" variant="outline" key={csType} onClick={() => handleAddSection(csType)}>
              <div className="flex flex-col gap-2 items-center justify-center text-sm">
                <SectionIcon />
                {t(`course_section.type.${csType}_label`)}
              </div>
            </Button>
          })}
          <Button variant="outline" className="col-span-3 h-auto" onClick={() => openFileUploadDialog()}>
            <div className="flex flex-col gap-2 items-center justify-center text-sm">
              <Upload />
              {t('course_editor.add_section_from_file_label')}
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>

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