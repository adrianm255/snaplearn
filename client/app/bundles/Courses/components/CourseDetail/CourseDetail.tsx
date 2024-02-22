import React from "react";
import { Course } from "../../../../types/course";
import useTranslation from "../../../../libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";
import CourseSectionSummary from "../CourseSectionSummary/CourseSectionSummary";
import { useStore } from "../../../../hooks-store/store";

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const course: Course = state.course;
  const currentUserIsAuthor = state.currentUserIsAuthor;
  
  return (
    <main className="product-content">
      <CourseQuestionButton />
      <div className="product-detail-nav">
        <a href="/discover" title="Back">
          <span className="icon icon-arrow-left-short"></span>
          Back
        </a>
      </div>
      <header>
        {!course.published && <div role="status" className="warning">This course is not currently published. Only you can see this page until the course is published.</div>}
        <h1>{course.title}</h1>
        {currentUserIsAuthor && <div className="actions">
          <a href={`/course/${course.id}/edit`} className="filled button">
            <span className="icon icon-pencil"></span>
          </a>
        </div>}
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
                <CourseSectionSummary
                  courseSection={courseSection}
                  expanded={courseSection.isExpanded}
                  highlighted={courseSection.isHighlighted}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;