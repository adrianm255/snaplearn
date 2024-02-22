import React from "react";
import { Course, CourseQuestion, CourseSection } from "../../../../types/course";
import CourseSectionSummary from "../CourseSectionSummary/CourseSectionSummary";

const Question: React.FC<{ question: CourseQuestion, course: Course }> = ({ question, course }) => {
  const getCourseSection = (courseSectionId: string): CourseSection | undefined => {
    return course.courseSections?.find(section => section.id === courseSectionId);
  };
  
  return (
    <div key={question.id} className="question">
      <div className="question-body">
        <div>Q:</div>
        <div>{question.body}</div>
      </div>
      <div className="question-answer">
        <div>A:</div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: question.answer }}></div>
          {question.relevantSections?.length && (
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}><strong>Relevant course material</strong></h4>
              <div role="tree">
                {question.relevantSections?.map(relevantSectionId => (
                  <div key={relevantSectionId} className="relevant-section" role="treeitem" style={{ fontSize: '0.875rem' }}>
                    {getCourseSection(relevantSectionId) && (
                      <CourseSectionSummary courseSection={getCourseSection(relevantSectionId)!} allowExpand={false} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;