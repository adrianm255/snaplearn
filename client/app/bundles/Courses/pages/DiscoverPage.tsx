import React from "react";
import { Course, CourseRaw } from "../../../types/course";
import { serverFormatToClientFormat } from "../../../helpers/dataMapper";
import CourseCard from "../components/CourseCard/CourseCard";

const DiscoverPage: React.FC<{ courses: CourseRaw[] }> = ({ courses }) => {
  const allCourses: Course[] = serverFormatToClientFormat(courses);
  return (
    <main>
      <header>
        <h1>Snaplearn</h1>
      </header>
      <div style={{ display: 'grid', gap: 'var(--spacer-6)' }}>
        <div className="paragraphs">
          <h2>All courses</h2>
          <div className="product-card-grid narrow">
            {allCourses.map(course => (
              <CourseCard course={course} key={course.id} referrer="discover" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiscoverPage;