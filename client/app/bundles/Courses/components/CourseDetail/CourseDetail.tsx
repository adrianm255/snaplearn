import React from "react";
import { Course } from "@/types/course";
import useTranslation from "@/libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";
import CourseSectionSummary from "../CourseSectionSummary/CourseSectionSummary";
import { useStore } from "@/hooks-store/store";
import { buttonVariants } from "@/common/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const course: Course = state.course;
  const currentUserIsAuthor = state.currentUserIsAuthor;
  
  return (
    <main className="course-detail">
      {/* <CourseQuestionButton /> */}
      <header className="bg-secondary text-secondary-foreground relative">
        <div className="course-detail-nav">
          <a href="/discover" title="Back">
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </div>
        <div className="gap-y-0">
          {!course.published && <div role="status" className="warning">This course is not currently published. Only you can see this page until the course is published.</div>}
          <h1>{course.title}</h1>
          <div className="actions">
            {currentUserIsAuthor && <a role="button" className={buttonVariants({ variant: "outline", size: "icon" })} href={`/course/${course.id}/edit`}>
              <Pencil />
            </a>}
          </div>
          <div>
            <span>By <a href="" target="_blank" rel="noreferrer">{course.author.email}</a></span>
          </div>
        </div>
      </header>
      <div className="course-content flex flex-col gap-4">
        <p className="text-base">{course.description}</p>
        <div className="flex flex-col gap-4">
          {course.courseSections?.map(courseSection => (
            <CourseSectionSummary
              key={courseSection.id}
              courseSection={courseSection}
              expanded={courseSection.isExpanded}
              highlighted={courseSection.isHighlighted}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;