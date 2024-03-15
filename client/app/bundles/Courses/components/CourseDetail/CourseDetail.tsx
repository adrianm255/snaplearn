import React from "react";
import { Course } from "@/types/course";
import useTranslation from "@/libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";
import CourseSectionSummary from "./CourseSectionSummary";
import { useStore } from "@/hooks-store/store";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { Book, FileQuestion, Home, NotebookPen, Pencil, Search } from "lucide-react";
import { CourseDetailStoreAction } from "@/hooks-store/courseDetailStore";

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const [ state, dispatch ] = useStore();
  const course: Course = state.course;
  const currentUserIsAuthor = state.currentUserIsAuthor;

  const setSectionExpanded = (courseSectionId: string | undefined) => {
    if (!courseSectionId) return;
    dispatch(CourseDetailStoreAction.ExpandAndHighlight, courseSectionId, true, false);
  };

  return (
    <main className="course-detail">
      <header className="sticky bg-secondary text-secondary-foreground">
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

      <div>
        <nav className="course-nav border-r">
          <section className="mt-8">
            <Button variant="ghost" className="w-full font-md text-secondary-foreground justify-start" onClick={() => {}}>
              <Book className="mr-2 w-4 h-4" />
              Course
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground font-normal justify-start" onClick={() => {}}>
              <NotebookPen className="mr-2 w-4 h-4" />
              Notes
            </Button>
          </section>
          <section>
            <CourseQuestionButton />
            <Button variant="ghost" className="w-full text-muted-foreground font-normal justify-start" onClick={() => {}}>
              <FileQuestion className="mr-2 w-4 h-4" />
              Questions
            </Button>
          </section>
          <section>
            <a className={`${buttonVariants({ variant: "ghost" })} w-full text-muted-foreground font-normal gap-0`} href="/dashboard">
              <Home className="mr-2 w-4 h-4" />
              Dashboard
            </a>
            <a className={`${buttonVariants({ variant: "ghost" })} w-full text-muted-foreground font-normal gap-0`} href="/discover">
              <Search className="mr-2 w-4 h-4" />
              Explore
            </a>
          </section>
        </nav>

        <div className="course-content flex flex-col gap-4">
          {course.description && <p className="text-base">{course.description}</p>}
          <div className="flex flex-col gap-4">
            {course.courseSections?.map(courseSection => (
              <CourseSectionSummary
                key={courseSection.id}
                course={course}
                courseSection={courseSection}
                expanded={courseSection.isExpanded}
                highlighted={courseSection.isHighlighted}
                onCourseSectionFullScreen={courseSectionId => setSectionExpanded(courseSectionId)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;