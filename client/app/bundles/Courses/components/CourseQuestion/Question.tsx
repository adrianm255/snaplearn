import React from "react";
import { Course, CourseQuestion, CourseSection } from "../../../../types/course";
import CourseSectionSummary from "../CourseSectionSummary/CourseSectionSummary";
import { useStore } from "../../../../hooks-store/store";
import { CourseDetailStoreAction } from "../../../../hooks-store/courseDetailStore";

const Question: React.FC<{ question: CourseQuestion, course: Course }> = ({ question, course }) => {
  const dispatch = useStore()[1];
  
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
          {(question.relevantSections || []).length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}><strong>Relevant course material</strong></h4>
              <div role="tree">
                {question.relevantSections?.map(relevantSectionId => (
                  <div key={relevantSectionId} className="relevant-section" role="treeitem" style={{ fontSize: '0.875rem' }}>
                    {getCourseSection(relevantSectionId) && (
                      <CourseSectionSummary
                        courseSection={getCourseSection(relevantSectionId)!}
                        allowExpand={false}
                        onCourseSectionAction={() => dispatch(CourseDetailStoreAction.ExpandAndHighlight, relevantSectionId)}
                      />
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