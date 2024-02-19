import React, { useState } from "react";
import { CourseSection, CourseSectionType } from "../../../../types/course";
import { getSectionIconClass } from "../../../../helpers/courseHelper";
import useTranslation from "../../../../libs/i18n/useTranslation";
import Tooltip from "../../../../common/components/Tooltip/Tooltip";

const CourseSectionSummary: React.FC<{ courseSection: CourseSection, allowExpand?: boolean }> = ({ courseSection, allowExpand = true }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isFileSection = courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.Video;

  return (<>
    <div className="content">
      <span className={"icon section-type-icon " + getSectionIconClass(courseSection.sectionType)}></span>
      <div>
        <h3>{courseSection.title}</h3>
        <ul className="inline">
          <li>{t(`course_section.type.${courseSection.sectionType}_label`)}</li>
          {courseSection.fileData && <li>{courseSection.fileData.size}</li>}
        </ul>
      </div>
    </div>
    <div className="actions">
      {allowExpand && (courseSection.description || courseSection.content) && <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={"icon " + (isExpanded ? "icon-outline-cheveron-up" : "icon-outline-cheveron-down")}></span>
      </button>}
      {isFileSection && <a role="button" className="button" href={courseSection.fileData?.url}>Download</a>}
      <Tooltip content="Coming soon! For now, please use the download button for PDF/Video sections and the expand button (or this button) for Text sections. For certain Video sections you can use the YouTube link in the section description." placement="bottom">
        <a role="button" className="button primary" onClick={() => allowExpand && courseSection.sectionType === CourseSectionType.RichText && setIsExpanded(true)}>
          {(courseSection.sectionType === CourseSectionType.Video) ? "Watch" : "Read"}
        </a>
      </Tooltip>
    </div>
    {isExpanded && (<div className="drawer">
      {courseSection.description && <p style={courseSection.content ? { marginBottom: '1rem' } : {}}>{courseSection.description}</p>}
      {courseSection.content && <div style={{ fontSize: '1rem', borderTop: '0.0625rem solid rgb(var(--color)/0.5)', paddingTop: '1rem' }} dangerouslySetInnerHTML={{ __html: courseSection.content }}></div>}
    </div>)}
  </>);
};

export default CourseSectionSummary;