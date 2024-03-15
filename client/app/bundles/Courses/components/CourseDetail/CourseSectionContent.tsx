import { CourseSection, CourseSectionType } from "@/types/course";
import React, { useEffect, useRef } from "react";

const CourseSectionContent: React.FC<{ courseSection: CourseSection, isFullScreen?: boolean }> = ({ courseSection, isFullScreen = false }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  const [showMoreButton, setShowMoreButton] = React.useState(false);
  const descriptionEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowMoreButton(descriptionEl?.current ? descriptionEl?.current?.scrollHeight > descriptionEl?.current?.clientHeight : false);
  }, []);

  const sectionDescription = (border = '') => (
    <div className={`course-section-descriptions py-4 px-6 ${isDescriptionExpanded ? 'expanded' : ''} ${border}`}>
      <p ref={descriptionEl} className={isDescriptionExpanded ? '' : 'line-clamp-3'}>{courseSection.description}</p>
      {showMoreButton && <a
        href="#"
        onClick={e => {
          e.preventDefault();
          setIsDescriptionExpanded(!isDescriptionExpanded);
        }}
      >
        {isDescriptionExpanded ? 'Show less' : 'Show more'}
      </a>}
    </div>
  );
  return (<>
      {courseSection.description && courseSection.sectionType !== CourseSectionType.Video && sectionDescription('border-t')}
      {courseSection.content &&
        <div className="text-base prose dark:prose-invert max-w-none px-6 py-4 overflow-y-auto border-t" dangerouslySetInnerHTML={{ __html: courseSection.content }} />
      }
      {courseSection.sectionType !== CourseSectionType.RichText &&
        <div className="grow border-t">
          {courseSection.sectionType === CourseSectionType.Video && (
            <video key={courseSection.id} controls className={`w-full h-auto ${isFullScreen && !courseSection.description ? 'border-b' : ''}`}>
              <source src={courseSection.fileData?.downloadUrl} type={courseSection.fileData?.contentType} />
              Your browser cannot display the video.
            </video>)
          }
          {courseSection.sectionType === CourseSectionType.Pdf &&
            <iframe src={courseSection.fileData?.fileUrl} style={{ width: '100%', height: isFullScreen ? '100%' : '800px' }} />
          }
          {courseSection.description && courseSection.sectionType === CourseSectionType.Video && sectionDescription('border-t')}
        </div>
      }
    </>);
};

export default CourseSectionContent;