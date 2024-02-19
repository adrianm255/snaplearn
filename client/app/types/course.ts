export type Course = {
  id: string;
  title: string;
  description: string;
  courseSections: CourseSection[];
  published: boolean;
  embeddedStatus: string; // TODO
  author: {
    id: string;
    name: string; // TODO
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
  fileData?: {
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
