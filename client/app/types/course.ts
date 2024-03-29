export type Course = {
  id: string;
  title: string;
  description: string;
  courseSections: CourseSection[];
  published: boolean;
  embeddedStatus: string;
  author: {
    id: string;
    username: string;
    email: string;
  },
  courseQuestions: CourseQuestion[];
};

export type CourseSection = {
  id?: string;
  title: string;
  description: string;
  content?: string;
  sectionType: CourseSectionType;
  order: number;
  courseId: string;
  isNew?: boolean;
  file?: File;
  fileData?: {
    contentType: string;
    filename: string;
    size: number;
    downloadUrl: string;
    fileUrl: string;
  };
  isExpanded?: boolean;
  isHighlighted?: boolean;
};

export enum CourseSectionType {
  RichText = 'rich_text',
  Pdf = 'pdf',
  Video = 'video'
};

export type CourseQuestion = {
  id: string;
  body: string;
  answer: string;
  courseId: string;
  relevantSections?: string[];
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
