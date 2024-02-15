export type Course = {
  id: string;
  title: string;
  description: string;
  courseSections: CourseSection[];
};

export type CourseSection = {
  id: string;
  title: string;
  description: string;
  content?: string;
  sectionType: CourseSectionType;
  order: number;
  courseId: string;
  fileDaata?: {
    contentType: string;
    filename: string;
    size: number;
    url: string;
  }
};

export enum CourseSectionType {
  RichText = 'rich_text',
  Pdf = 'pdf',
  Video = 'video'
};

export type CourseRaw = {
  id: string;
  title: string;
  description: string;
  course_sections: CourseSectionRaw[];
};

export type CourseSectionRaw = {
  id: string;
  title: string;
  description: string;
  content?: string;
  section_type: CourseSectionType;
  order: number;
  course_id: string;
  file_data?: {
    content_type: string;
    filename: string;
    size: number;
    url: string;
  }
};
