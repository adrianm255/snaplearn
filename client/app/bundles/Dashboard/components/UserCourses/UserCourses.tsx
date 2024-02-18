import React, { useState } from 'react';
import { Course } from '../../../../types/course';
import AddCourseButton from './AddCourseButton/AddCourseButton';
import { createCourse, deleteCourse } from '../../../../services/courseService';
import useTranslation from '../../../../libs/i18n/useTranslation';
import { convertToFormData } from '../../../../helpers/formDataHelper';
import Dialog from '../../../../common/components/Dialog/Dialog';

const UserCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const { t } = useTranslation();
  const [userCourses, setUserCourses] = useState<Course[]>(courses);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

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

  const handleCourseDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourseToDelete(null);
      setUserCourses(prevUserCourses => {
        return prevUserCourses.filter(course => course.id !== courseId);
      });
    } catch (e) {
      // TODO
    }
  };

  const openDeleteDialog = (course: Course) => setCourseToDelete(course);
  const closeDeleteDialog = () => setCourseToDelete(null);

  return <>
    <header className='sticky'>
      <h1>{t('courses.title')}</h1>
      <div className="actions">
        <AddCourseButton onAddCourse={handleNewCourseFormSubmit} />
      </div>
    </header >
    <main className="content">
      <table>
        <thead>
          <tr>
            <th></th>
            <th title={t('user_courses.table.title_header')}>{t('user_courses.table.title_header')}</th>
            <th title={t('user_courses.table.published_header')}>{t('user_courses.table.published_header')}</th>
            <th title={t('user_courses.table.embedded_header')}>{t('user_courses.table.embedded_header')}</th>
          </tr>
        </thead>
        <tbody>
          {userCourses.map(course => (
            <tr key={course.id}>
              <td className="icon-cell"><span className="icon icon-card-image-fill"></span></td>
              <td>{course.title}</td>
              <td>{course.published ? 'Published' : 'Unpublished'}</td>
              <td>{course.embeddedStatus === 'processing' ? 'Processing' : 'Embedded'}</td>

              <td>
                <div className="actions">
                  <a className="button" role="button" href={`/course/${course.id}`} title={t('view')}>
                    <span className="icon icon-eye-fill"></span>
                  </a>
                  <a className="button" role="button" href={`/course/${course.id}/edit`} title={t('edit')}>
                    <span className="icon icon-pencil"></span>
                  </a>
                  <button className="outline-danger" type="button" title={t('delete')} onClick={() => openDeleteDialog(course)}>
                    <span className="icon icon-trash2"></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courseToDelete && <div><Dialog isOpen={true} onClose={closeDeleteDialog}>
        <header>
          <h2>{t('user_courses.delete_course_title')}</h2>
          <div role="button" className="close" aria-label="Close" onClick={closeDeleteDialog}></div>
        </header>
        <h4>{t('delete_warning', { name: courseToDelete.title })}</h4>
        <footer>
          <button type="button" onClick={closeDeleteDialog}>{t('cancel')}</button>
          <button className="danger" onClick={() => handleCourseDelete(courseToDelete.id)}>{t('confirm')}</button>
        </footer>
      </Dialog></div>}
    </main>
  </>;
};

export default UserCourses;