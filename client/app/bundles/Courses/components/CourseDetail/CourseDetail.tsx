import React, { useState } from "react";
import { Course, CourseSection } from "@/types/course";
import useTranslation from "@/libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";
import CourseSectionSummary from "./CourseSectionSummary";
import { useStore } from "@/hooks-store/store";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import CourseSectionPage from "./CourseSectionPage";

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const course: Course = state.course;
  const currentUserIsAuthor = state.currentUserIsAuthor;

  const [fullScreenSection, setFullScreenSection] = useState<CourseSection | null>(null);
  
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
              onCourseSectionFullScreen={courseSectionId => setFullScreenSection(course.courseSections?.find(cs => cs.id === courseSectionId) || null)}
            />
          ))}
        </div>
      </div>

      {fullScreenSection && <Dialog defaultOpen={true} onOpenChange={isOpen => !isOpen && setFullScreenSection(null)}>
        <DialogContent className="course-section-full-screen" onOpenAutoFocus={e => e.preventDefault()}>
          <CourseSectionPage course={course} initialCourseSection={fullScreenSection} />
        </DialogContent>
      </Dialog>}
    </main>
  );
};

export default CourseDetail;