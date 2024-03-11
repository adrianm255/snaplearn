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
        <div style={{ fontSize: '1rem' }} className="px-6 py-4 overflow-y-auto border-t" dangerouslySetInnerHTML={{ __html: courseSection.content }} />
      }
      {courseSection.sectionType !== CourseSectionType.RichText &&
        <div className="grow border-t">
          {courseSection.sectionType === CourseSectionType.Video && (
            <video key={courseSection.id} width="100%" height="auto" controls className={isFullScreen && !courseSection.description ? 'border-b' : ''}>
              <source src={courseSection.fileData?.url} type={courseSection.fileData?.contentType} />
              Your browser cannot display the video.
            </video>)
          }
          {courseSection.sectionType === CourseSectionType.Pdf &&
            <object data={courseSection.fileData?.url} type="application/pdf" style={{ width: '100%', height: isFullScreen ? '100%' : '800px' }}>
              Your browser cannot display the PDF.
            </object>
          }
          {courseSection.description && courseSection.sectionType === CourseSectionType.Video && sectionDescription('border-t')}
        </div>
      }
    </>);
};

export default CourseSectionContent;