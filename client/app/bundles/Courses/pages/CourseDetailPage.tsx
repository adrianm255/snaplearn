import React from "react";
import { Course } from "../../../types/course";
import CourseDetail from "../components/CourseDetail/CourseDetail";
import { serverFormatToClientFormat } from "../../../helpers/dataMapper";

const CourseDetailPage: React.FC<{ course: Course, currentUserIsAuthor: boolean, courseQuestionsCount: number }> = ({ course, currentUserIsAuthor, courseQuestionsCount }) => {
  return (<CourseDetail course={serverFormatToClientFormat(course)} currentUserIsAuthor={currentUserIsAuthor} courseQuestionsCount={courseQuestionsCount} />);
};

export default CourseDetailPage;