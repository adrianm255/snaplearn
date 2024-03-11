import { Button } from "@/common/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/components/ui/tooltip";
import { Course, CourseSection } from "@/types/course";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import CourseSectionContent from "./CourseSectionContent";

type CourseSectionPageProps = {
  course: Course;
  initialCourseSection: CourseSection;
};

const CourseSectionPage: React.FC<CourseSectionPageProps> = ({ course, initialCourseSection = null }) => {
  const [courseSection, setCourseSection] = useState<CourseSection | null>(initialCourseSection || course.courseSections?.[0] || null);

  const courseSectionIndex = course.courseSections?.findIndex(cs => cs.id === courseSection?.id);
  const prevSection = courseSectionIndex !== undefined ? (course.courseSections?.[courseSectionIndex - 1] ?? null) : null;
  const nextSection = courseSectionIndex !== undefined ? (course.courseSections?.[courseSectionIndex + 1] ?? null) : null;

  const getNavButton = (type: string, section: CourseSection) => {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="base" className={`h-full w-full ${type === 'prev' ? 'border-r' : 'border-l'}`} onClick={() => setCourseSection(section)}>
              {type === 'prev' ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="flex flex-col items-center gap-2 p-2">
              <span>{type === 'prev' ? 'Previous' : 'Next'} section</span>
              <h4>{section.title}</h4>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="course-section-page flex flex-col">
      <header className="bg-secondary text-secondary-foreground px-16 py-6">
        <div className="flex flex-row items-center gap-4 px-4">
          <h2 className="flex grow justify-center">{course?.title}</h2>
        </div>
      </header>
      <div className="flex flex-row border-t">
        <div className="h-full w-20">{prevSection && getNavButton('prev', prevSection)}</div>
        <h3 className="flex grow justify-center p-4">{courseSection?.title}</h3>
        <div className="h-full w-20">{nextSection && getNavButton('next', nextSection)}</div>
      </div>
      <div className="flex flex-col grow overflow-hidden">
        <CourseSectionContent key={courseSection?.id} courseSection={courseSection!} isFullScreen={true}/>
      </div>
    </div>
  );
};

export default CourseSectionPage;