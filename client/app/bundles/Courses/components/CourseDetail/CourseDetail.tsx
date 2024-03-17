import React from "react";
import { Course } from "@/types/course";
import useTranslation from "@/libs/i18n/useTranslation";
import CourseQuestionButton from "../CourseQuestion/CourseQuestionButton";
import CourseSectionSummary from "./CourseSectionSummary";
import { useStore } from "@/hooks-store/store";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { Book, FileQuestion, Home, MessageCircleQuestion, NotebookPen, Pencil, Search } from "lucide-react";
import { CourseDetailStoreAction } from "@/hooks-store/courseDetailStore";
import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert";

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
          <div className="navbar footer-navbar text-muted-foreground">
            {/* TODO this is hardcoded as active for now */}
            <div className="w-full flex items-center justify-center text-secondary-foreground">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Book className="w-8 h-8" />
              </Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <NotebookPen className="w-8 h-8" />
              </Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <CourseQuestionButton>
                <Button variant="ghost" size="icon">
                  <MessageCircleQuestion className="w-8 h-8" />
                </Button>
              </CourseQuestionButton>
            </div>
            <div className="w-full flex items-center justify-center">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <FileQuestion className="w-8 h-8" />
              </Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <a className={`${buttonVariants({ variant: "ghost" })}`} href="/dashboard">
                <Home className="w-8 h-8" />
              </a>
            </div>
          </div>

          <section className="mt-8">
            {/* TODO this is hardcoded as active for now */}
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
            <CourseQuestionButton>
              <Button variant="ghost" className="w-full text-muted-foreground font-normal justify-start" >
                <MessageCircleQuestion className="mr-2 w-4 h-4" />
                Quick question
              </Button>
            </CourseQuestionButton>
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
          {!course.published &&
            <Alert variant="warning">
              <AlertTitle>Course not published</AlertTitle>
              <AlertDescription>
                This course is not currently published. Only you can see this page until the course is published
              </AlertDescription>
            </Alert>
          }
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