import React from "react";
import { Course, CourseRaw } from "../../../types/course";
import { serverFormatToClientFormat } from "../../../helpers/dataMapper";
import CourseCard from "../components/CourseCard/CourseCard";

const DiscoverPage: React.FC<{ courses: CourseRaw[] }> = ({ courses }) => {
  const allCourses: Course[] = serverFormatToClientFormat(courses);
  return (
    <main className="explore">
      <header className="bg-secondary text-secondary-foreground">
        <div>
          <h1>Snaplearn</h1>
        </div>
      </header>
      <div style={{ display: 'grid', gap: 'var(--spacer-6)' }}>
        <h2>All courses</h2>
        <div className="courses-grid">
          {allCourses.map(course => (
            <CourseCard course={course} key={course.id} referrer="discover" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DiscoverPage;