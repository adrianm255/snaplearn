import React from 'react';
import { Course } from '../../../../types/course';
import AddCourseButton from './AddCourseButton/AddCourseButton';
import { createCourse } from '../../../../services/courseService';
import useTranslation from '../../../../libs/i18n/useTranslation';
import { convertToFormData } from '../../../../helpers/formDataHelper';

const UserCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const { t } = useTranslation();

  const handleNewCourseFormSubmit = async (title: string) => {
    try {
      const payload = convertToFormData({ course: { title } });
      const response = await createCourse(payload);
      console.log('RESPONSE');
      console.log(response);
      window.location.href = `/course/${response.id}/edit`;
    } catch (e) {
      // TODO
    }
  };

  return <>
    <header className='sticky'>
      <h1>{t('courses.title')}</h1>
      <div className="actions">
        <AddCourseButton onAddCourse={handleNewCourseFormSubmit} />
      </div>
    </header >
    <main className="content">
      {courses.map(course => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </main>
  </>;
};

export default UserCourses;