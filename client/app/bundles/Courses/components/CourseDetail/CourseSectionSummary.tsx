import React, { useEffect, useRef, useState } from "react";
import { Course, CourseSection, CourseSectionType } from "@/types/course";
import { getSectionIcon } from "@/helpers/courseHelper";
import useTranslation from "@/libs/i18n/useTranslation";
import { useStore } from "@/hooks-store/store";
import { CourseDetailStoreAction } from "@/hooks-store/courseDetailStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/common/components/ui/collapsible";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { ChevronDown, ChevronUp, Expand } from "lucide-react";
import CourseSectionContent from "./CourseSectionContent";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import CourseSectionPage from "./CourseSectionPage";

const CourseSectionSummary: React.FC<{
  course: Course,
  courseSection: CourseSection,
  allowExpand?: boolean,
  allowDownload?: boolean,
  expanded?: boolean,
  highlighted?: boolean,
  initialFullScreen?: boolean,
  onCourseSectionAction?: () => void,
  onCourseSectionFullScreen?: (courseSectionId: string | undefined) => void
}> = ({ course, courseSection, allowExpand = true, allowDownload = true, expanded = false, highlighted = false, initialFullScreen = false, onCourseSectionAction, onCourseSectionFullScreen }) => {
  const { t } = useTranslation();
  const dispatch = useStore()[1];

  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHighlighted, setIsHighlighted] = useState(highlighted);
  const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);

  const elementRef = useRef<HTMLDivElement>(null);

  const SectionIcon = getSectionIcon(courseSection.sectionType);
  const isFileSection = courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.Video;

  useEffect(() => {
    if (isHighlighted) {
      elementRef.current?.focus({ preventScroll: true });
      elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHighlighted]);

  useEffect(() => {
    setIsExpanded(expanded);
    setIsHighlighted(highlighted);
  }, [expanded, highlighted]);

  const handleAction = () => {
    if (onCourseSectionAction) {
      onCourseSectionAction();
    } else if (allowExpand) {
      setSectionExpanded(true);
    }
  };

  const setSectionExpanded = (sectionExpanded: boolean) => {
    setIsExpanded(sectionExpanded);
    dispatch(CourseDetailStoreAction.ExpandAndHighlight, courseSection.id, sectionExpanded, false);
  };

  const displayFullScreen = () => {
    setIsFullScreen(true);
  };

  return (<>
    <Collapsible
      ref={elementRef}
      tabIndex={-1}
      open={allowExpand && isExpanded}
      onOpenChange={setIsExpanded}
      className={`collapsible with-actions flex flex-col p-4 rounded-md border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${allowExpand && isExpanded ? 'pb-0' : ''}`}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        {allowExpand && <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0 -ml-2">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>}
        <div className={`content flex grow items-center gap-3 ${allowExpand ? '-ml-2' : ''}`}>
          <SectionIcon className="w-7 h-7" />
          <div>
            <h3>{courseSection.title}</h3>
            <ul className="inline">
              <li>{t(`course_section.type.${courseSection.sectionType}_label`)}</li>
              {courseSection.fileData && <li>{courseSection.fileData.size}</li>}
            </ul>
          </div>
        </div>
        <div className="actions">
          {allowDownload && isFileSection && <a role="button" className={buttonVariants({ variant: "outline" })} href={courseSection.fileData?.downloadUrl}>Download</a>}
          {!isExpanded && <Button role="button" variant="secondary" onClick={handleAction}>
            {(courseSection.sectionType === CourseSectionType.Video) ? "Watch" : "Read"}
          </Button>}
          <Button role="button" variant="outline" size="icon" className="icon-button" onClick={displayFullScreen}>
            <Expand className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <CollapsibleContent className={`flex flex-col -ml-4 -mr-4 ${isExpanded ? 'mt-4': ''}`}>
        <CourseSectionContent courseSection={courseSection} />
      </CollapsibleContent>
    </Collapsible>

    {isFullScreen && 
      <Dialog defaultOpen={true} onOpenChange={isOpen => !isOpen && setIsFullScreen(false)}>
        <DialogContent className="course-section-full-screen" onOpenAutoFocus={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()}>
          <CourseSectionPage course={course} initialCourseSection={courseSection} onCourseSectionFullScreen={onCourseSectionFullScreen} />
        </DialogContent>
      </Dialog>
    }
  </>);
};

export default CourseSectionSummary;