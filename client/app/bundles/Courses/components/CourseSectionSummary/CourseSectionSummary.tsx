import React, { useEffect, useRef, useState } from "react";
import { CourseSection, CourseSectionType } from "@/types/course";
import { getSectionIcon, getSectionIconClass } from "@/helpers/courseHelper";
import useTranslation from "@/libs/i18n/useTranslation";
import { useStore } from "@/hooks-store/store";
import { CourseDetailStoreAction } from "@/hooks-store/courseDetailStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/common/components/ui/collapsible";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const CourseSectionSummary: React.FC<{
  courseSection: CourseSection,
  allowExpand?: boolean,
  expanded?: boolean,
  highlighted?: boolean,
  onCourseSectionAction?: () => void
}> = ({ courseSection, allowExpand = true, expanded = false, highlighted = false, onCourseSectionAction }) => {
  const { t } = useTranslation();
  const dispatch = useStore()[1];

  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHighlighted, setIsHighlighted] = useState(highlighted);
  const drawerElementRef = useRef<HTMLDivElement>(null);

  const SectionIcon = getSectionIcon(courseSection.sectionType);
  const isFileSection = courseSection.sectionType === CourseSectionType.Pdf || courseSection.sectionType === CourseSectionType.Video;
  // const hasContentToDisplay = courseSection.sectionType === CourseSectionType.RichText || courseSection.sectionType === CourseSectionType.Video;

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
    {/* <div className="content">
      <span className={"icon section-type-icon " + getSectionIconClass(courseSection.sectionType)}></span>
      <div>
        <h3>{courseSection.title}</h3>
        <ul className="inline">
          <li>{t(`course_section.type.${courseSection.sectionType}_label`)}</li>
          {courseSection.fileData && <li>{courseSection.fileData.size}</li>}
        </ul>
      </div>
    </div>
    <div className="actions">
      {allowExpand && (courseSection.description || hasContentToDisplay) && <button type="button" onClick={() => setSectionExpanded(!isExpanded)}>
        <span className={"icon " + (isExpanded ? "icon-outline-cheveron-up" : "icon-outline-cheveron-down")}></span>
      </button>}
      {isFileSection && <a role="button" className="button" href={courseSection.fileData?.url}>Download</a>}
      <a
        role="button"
        className="button primary"
        onClick={handleAction}
        href={courseSection.sectionType === CourseSectionType.Pdf ? courseSection.fileData?.url : undefined}
        target="_blank"
      >
        {(courseSection.sectionType === CourseSectionType.Video) ? "Watch" : "Read"}
      </a>
    </div>
    {isExpanded && (<div className="drawer" ref={drawerElementRef} tabIndex={-1}>
      {courseSection.description && <p style={courseSection.content ? { marginBottom: '1rem' } : {}}>{courseSection.description}</p>}
      {courseSection.content && <div style={{ fontSize: '1rem', borderTop: '0.0625rem solid rgb(var(--color)/0.5)', paddingTop: '1rem' }} dangerouslySetInnerHTML={{ __html: courseSection.content }}></div>}
      {courseSection.sectionType === CourseSectionType.Video && (<video width="100%" height="auto" controls>
        <source src={courseSection.fileData?.url} type={courseSection.fileData?.contentType} />
        Your browser does not support the video tag.
      </video>)}
    </div>)} */}


    <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="collapsible with-actions flex flex-col p-4 rounded-md border"
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
          </div>
        </div>
        <CollapsibleContent className={`flex flex-col ${isExpanded ? 'mt-6': ''}`} tabIndex={-1}>
          {courseSection.description && <p style={courseSection.content ? { marginBottom: '1rem' } : {}}>{courseSection.description}</p>}
          {courseSection.content && <div style={{ fontSize: '1rem', borderTop: '0.0625rem solid rgb(var(--color)/0.5)', paddingTop: '1rem' }} dangerouslySetInnerHTML={{ __html: courseSection.content }}></div>}
          {courseSection.sectionType === CourseSectionType.Video && (<video width="100%" height="auto" controls>
            <source src={courseSection.fileData?.url} type={courseSection.fileData?.contentType} />
              Your browser does not support the video tag.
          </video>)}
          {courseSection.sectionType === CourseSectionType.Pdf &&
            <object data={courseSection.fileData?.url} type="application/pdf" style={{ width: '100%', height: '800px' }}>
              Your browser does not support the object tag.
            </object>
          }
        </CollapsibleContent>
      </Collapsible>
  </>);
};

export default CourseSectionSummary;