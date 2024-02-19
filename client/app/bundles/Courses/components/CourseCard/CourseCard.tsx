import React from "react"; 
import { Course } from "../../../../types/course";
import courseAvatarPlaceholder from "../../../../assets/images/course-avatar-placeholder.webp";

const CourseCard: React.FC<{ course: Course, referrer?: string }> = ({ course, referrer = '' }) => {
  return (
    <article key={course.id} className="product-card">
      <a href={`/course/${course.id}?referrer=${referrer}`} className="stretched-link">
        <div className="carousel">
          <div className="items"><img src={courseAvatarPlaceholder} /></div>
        </div>
      </a>

      <header>
        <h3>{course.title}</h3>
        <span>By <a href="" target="_blank" rel="noreferrer">{course.author.email}</a></span>
      </header>
    </article>
  );
}

export default CourseCard;