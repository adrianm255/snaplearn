import React from "react";
import { CourseSection, CourseSectionType } from "../../../../types/course";
import { getSectionIconClass } from "../../../../helpers/courseHelper";
import useTranslation from "../../../../libs/i18n/useTranslation";

const CourseSectionSummary: React.FC<{ courseSection: CourseSection }> = ({ courseSection }) => {
  const { t } = useTranslation();

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
      <a role="button" className="button primary">
        {(courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.RichText) ? "Read" : "Watch"}
      </a>
    </div>
  </>);
};

export default CourseSectionSummary;