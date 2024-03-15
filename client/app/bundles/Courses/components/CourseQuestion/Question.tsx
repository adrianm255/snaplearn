import React from "react";
import { Course, CourseQuestion, CourseSection } from "../../../../types/course";
import CourseSectionSummary from "../CourseDetail/CourseSectionSummary";
import { useStore } from "../../../../hooks-store/store";
import { CourseDetailStoreAction } from "../../../../hooks-store/courseDetailStore";
import { useDropdownButtonContext } from "../../../../common/components/DropdownButton/DropdownButton";

const Question: React.FC<{ question: CourseQuestion, course: Course }> = ({ question, course }) => {
  const dispatch = useStore()[1];

  // const { close } = useDropdownButtonContext();
  
  const getCourseSection = (courseSectionId: string): CourseSection | undefined => {
    return course.courseSections?.find(section => section.id === courseSectionId);
  };
  
  return (
    <div key={question.id} className="question">
      <div className="question-body">
        <div className="leading-7">Q:</div>
        <div className="prose dark:prose-invert max-w-none">{question.body}</div>
      </div>
      <div className="question-answer">
        <div className="leading-7">A:</div>
        <div>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: question.answer }}></div>
          {(question.relevantSections || []).length > 0 && (
            <div className="mt-2">
              <h4 className="mb-2">Relevant course material</h4>
              <div role="tree">
                {question.relevantSections?.map(relevantSectionId => (
                  <div key={relevantSectionId} className="relevant-section" role="treeitem" style={{ fontSize: '0.875rem' }}>
                    {getCourseSection(relevantSectionId) && (
                      <CourseSectionSummary
                        course={course}
                        courseSection={getCourseSection(relevantSectionId)!}
                        allowExpand={false}
                        allowDownload={false}
                        onCourseSectionAction={() => {dispatch(CourseDetailStoreAction.ExpandAndHighlight, relevantSectionId)}}
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