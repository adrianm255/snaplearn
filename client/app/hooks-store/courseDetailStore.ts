import { Course, CourseSectionType } from "../types/course";
import { initStore } from "./store";

export enum CourseDetailStoreAction {
  ExpandAndHighlight = 'EXPAND_AND_HIGHLIGHT_SECTION',
};

export type CourseDetailStore = {
  course: Course;
  currentUserIsAuthor: boolean;
  courseQuestionsCount: number;
};

const configureStore = (initialState: CourseDetailStore) => {
  const actions = {
    [CourseDetailStoreAction.ExpandAndHighlight]: (curState: any, sectionId: string, expand = true, highlight = true) => {
      const updatedSections = curState.course.courseSections.map(section => {
        if (section.id === sectionId) {
          return { ...section, isExpanded: expand, isHighlighted: highlight };
        } else {
          return { ...section, isExpanded: false, isHighlighted: false };
        }
      });
      const newCourseState = { ...curState.course, courseSections: updatedSections };
      return { course: newCourseState };
    },
  };
  initStore(actions, { ...initialState });
}

export default configureStore;