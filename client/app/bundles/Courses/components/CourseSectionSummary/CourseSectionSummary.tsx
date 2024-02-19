import React, { useState } from "react";
import { CourseSection, CourseSectionType } from "../../../../types/course";
import { getSectionIconClass } from "../../../../helpers/courseHelper";
import useTranslation from "../../../../libs/i18n/useTranslation";

const CourseSectionSummary: React.FC<{ courseSection: CourseSection, includeDescription?: boolean }> = ({ courseSection, includeDescription = true }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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
      {includeDescription && courseSection.description && <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={"icon " + (isExpanded ? "icon-outline-cheveron-up" : "icon-outline-cheveron-down")}></span>
      </button>}
      <a role="button" className="button primary">
        {(courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.RichText) ? "Read" : "Watch"}
      </a>
    </div>
    {isExpanded && (<div className="drawer">
      <p>{courseSection.description}</p>
    </div>)}
  </>);
};

export default CourseSectionSummary;