import React from "react";
import { CourseRaw } from "../../../types/course";
import CourseDetail from "../components/CourseDetail/CourseDetail";
import { serverFormatToClientFormat } from "../../../helpers/dataMapper";
import configureCourseDetailStore from '../../../hooks-store/courseDetailStore';

const CourseDetailPage: React.FC<{
  course: CourseRaw,
  currentUserIsAuthor: boolean,
  courseQuestionsCount: number
}> = ({ course, currentUserIsAuthor, courseQuestionsCount }) => {
  configureCourseDetailStore({
    course: serverFormatToClientFormat(course),
    currentUserIsAuthor,
    courseQuestionsCount
  });

  return (<CourseDetail />);
};

export default CourseDetailPage;