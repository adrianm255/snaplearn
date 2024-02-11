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
};

export enum CourseSectionType {
  RichText = 'rich_text',
  Video = 'video',
  Pdf = 'pdf'
};
