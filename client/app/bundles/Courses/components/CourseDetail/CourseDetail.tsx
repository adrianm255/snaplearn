import React from "react";
import { Course, CourseSectionType } from "../../../../types/course";
import { getSectionIconClass } from "../../../../helpers/courseHelper";
import useTranslation from "../../../../libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";

const CourseDetail: React.FC<{ course: Course }> = ({ course }) => {
  const { t } = useTranslation();
  
  return (
    <main className="product-content">
      <CourseQuestionButton course={course} />
      <div className="product-detail-nav">
        <a href="/library" title="Back to Library">
          <span className="icon icon-arrow-left-short"></span>
          Back to Library
        </a>
      </div>
      <header>
        <h1>{course.title}</h1>
      </header>
      <div className="has-sidebar">
        <div className="paragraphs">
            <div className="stack">
              <div>{course.title}</div>
              <div><span>By <a href="" target="_blank" rel="noreferrer">{course.author.email}</a></span>
              </div>
            </div>
        </div>

        <div className="paragraphs">
          <p>{course.description}</p>
          <div role="tree">
            {course.courseSections?.map(courseSection => (
              <div key={courseSection.id} role="treeitem">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;