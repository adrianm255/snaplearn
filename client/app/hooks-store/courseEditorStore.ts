import { Course, CourseSectionType } from "../types/course";
import { initStore } from "./store";

export enum CourseEditorStoreAction {
  UpdateCourse = 'UPDATE_COURSE',
  UpdateCourseAttribute = 'UPDATE_COURSE_ATTRIBUTE',
  UpdateCourseSectionAttribute = 'UPDATE_COURSE_SECTION_ATTRIBUTE',
  AddCourseSection = 'ADD_COURSE_SECTION',
  DeleteCourseSection = 'DELETE_COURSE_SECTION'
};

const configureStore = (initialState: Course) => {
  const actions = {
    [CourseEditorStoreAction.UpdateCourse]: (curState: any, newState: any) => {
      return { course: newState };
    },
    [CourseEditorStoreAction.UpdateCourseAttribute]: (curState: any, attrName: string, attrValue: any) => {
      const newCourseState = { ...curState.course, [attrName]: attrValue };
      return { course: newCourseState };
    },
    [CourseEditorStoreAction.UpdateCourseSectionAttribute]: (curState: any, sectionId: string, attrName: string, attrValue: any) => {
      const updatedSections = curState.course.courseSections.map(section =>
        section.id === sectionId ? { ...section, [attrName]: attrValue } : section
      );
      const newCourseState = { ...curState.course, courseSections: updatedSections };
      return { course: newCourseState };
    },
    [CourseEditorStoreAction.AddCourseSection]: (curState: any, sectionType: CourseSectionType = CourseSectionType.RichText, title: string) => {
      const curCourseState = curState.course;
      const newSection = {
        title: title || '',
        content: '',
        sectionType: sectionType,
        order: curCourseState.courseSections.length,
        courseId: curCourseState.id,
        id: Date.now(), // Temp ID
        isNew: true
      };
      const newCourseState = { ...curCourseState, courseSections: [...curCourseState.courseSections, newSection] };
      return { course: newCourseState };
    },
    [CourseEditorStoreAction.DeleteCourseSection]: (curState: any, sectionId: string) => {
      const updatedSections = curState.course.courseSections.filter(section => section.id !== sectionId);
      // Update order
      updatedSections.forEach((section, index) => section.order = index);
      const newCourseState = { ...curState.course, courseSections: updatedSections };
      return { course: newCourseState };
    },
  };
  initStore(actions, { course: initialState });
}

export default configureStore;