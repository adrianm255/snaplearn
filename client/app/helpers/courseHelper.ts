import { FileText, FileVideo, NotepadText } from "lucide-react";
import { CourseSectionType } from "../types/course";

export const getSectionIconClass = (courseSectionType: CourseSectionType): string => {
  switch (courseSectionType) {
    case CourseSectionType.RichText:
      return 'icon-book';
    case CourseSectionType.Pdf:
      return 'icon-file-earmark-text-fill';
    case CourseSectionType.Video:
      return 'icon-camera-video-fill';
    default:
      return '';
  }
};

export const getSectionIcon = (courseSectionType: CourseSectionType): any => {
  switch (courseSectionType) {
    case CourseSectionType.RichText:
      return NotepadText;
    case CourseSectionType.Pdf:
      return FileText;
    case CourseSectionType.Video:
      return FileVideo;
    default:
      return null;
  }
};