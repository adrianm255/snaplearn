import React from "react";
import { Course } from "../../../types/course";
import CourseDetail from "../components/CourseDetail/CourseDetail";
import { serverFormatToClientFormat } from "../../../helpers/dataMapper";

const CourseDetailPage: React.FC<{ course: Course }> = ({ course }) => {
  return (<CourseDetail course={serverFormatToClientFormat(course)} />);
};

export default CourseDetailPage;