import React, { useEffect, useRef, useState } from "react";
import { CourseSection, CourseSectionType } from "@/types/course";
import { getSectionIcon } from "@/helpers/courseHelper";
import useTranslation from "@/libs/i18n/useTranslation";
import { useStore } from "@/hooks-store/store";
import { CourseDetailStoreAction } from "@/hooks-store/courseDetailStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/common/components/ui/collapsible";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { ChevronDown, ChevronUp, Expand } from "lucide-react";
import CourseSectionContent from "./CourseSectionContent";

const CourseSectionSummary: React.FC<{
  courseSection: CourseSection,
  allowExpand?: boolean,
  expanded?: boolean,
  highlighted?: boolean,
  onCourseSectionAction?: () => void,
  onCourseSectionFullScreen?: (courseSectionId: string | null) => void
}> = ({ courseSection, allowExpand = true, expanded = false, highlighted = false, onCourseSectionAction, onCourseSectionFullScreen }) => {
  const { t } = useTranslation();
  const dispatch = useStore()[1];

  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHighlighted, setIsHighlighted] = useState(highlighted);
  const drawerElementRef = useRef<HTMLDivElement>(null);

  const SectionIcon = getSectionIcon(courseSection.sectionType);
  const isFileSection = courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.Video;

  useEffect(() => {
    if (isHighlighted) {
      drawerElementRef.current?.focus({ preventScroll: true });
      drawerElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  return (<>
    <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={`collapsible with-actions flex flex-col p-4 rounded-md border ${isExpanded ? 'pb-0' : ''}`}
      >
        <div className="flex flex-row items-center justify-between gap-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0 -ml-2">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <div className="content flex grow items-center gap-3 -ml-2">
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
            {isFileSection && <a role="button" className={buttonVariants({ variant: "outline" })} href={courseSection.fileData?.url}>Download</a>}
            {!isExpanded && <Button role="button" variant="default" onClick={handleAction}>
              {(courseSection.sectionType === CourseSectionType.Video) ? "Watch" : "Read"}
            </Button>}
            <Button role="button" variant="outline" size="icon" onClick={() => onCourseSectionFullScreen?.(courseSection.id!)}>
              <Expand className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CollapsibleContent className={`flex flex-col -ml-4 -mr-4 ${isExpanded ? 'mt-4': ''}`} tabIndex={-1}>
          <CourseSectionContent courseSection={courseSection} />
        </CollapsibleContent>
      </Collapsible>
  </>);
};

export default CourseSectionSummary;