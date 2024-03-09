import React, { useState } from 'react';
import { Course } from '@/types/course';
import AddCourseButton from './AddCourseButton';
import { createCourse, deleteCourse } from '@/services/courseService';
import useTranslation from '@/libs/i18n/useTranslation';
import { convertToFormData } from '@/helpers/formDataHelper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { Eye, Pencil, Trash2, Image } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/common/components/ui/alert-dialog';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const UserCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const { t } = useTranslation();
  const [userCourses, setUserCourses] = useState<Course[]>(courses);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleNewCourseFormSubmit = async (title: string) => {
    try {
      const payload = convertToFormData({ course: { title } });
      const response = await createCourse(payload);

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
    <DashboardHeader>
      <h1>{t('courses.title')}</h1>
      <div className="actions">
        <AddCourseButton onAddCourse={handleNewCourseFormSubmit} />
      </div>
    </DashboardHeader>
    
    <main className="content">
      {userCourses.length === 0 && <h3>You have no courses yet.</h3>}

      {userCourses.length > 0 &&
        <Table className="rounded-sm border">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead title={t('user_courses.table.title_header')}>{t('user_courses.table.title_header')}</TableHead>
              <TableHead title={t('user_courses.table.published_header')}>{t('user_courses.table.published_header')}</TableHead>
              <TableHead title={t('user_courses.table.embedded_header')}>{t('user_courses.table.embedded_header')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userCourses.map(course => (
              <TableRow key={course.id}>
                <TableCell className="icon-cell"><Image /></TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.published ? 'Published' : 'Unpublished'}</TableCell>
                <TableCell>{course.embeddedStatus === 'processing' ? 'Processing' : 'Embedded'}</TableCell>

                <TableCell>
                  <div className="actions">
                    <Button variant="outline" size="icon" asChild>
                      <a className="button" role="button" href={`/course/${course.id}`} title={t('view')}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a className="button" role="button" href={`/course/${course.id}/edit`} title={t('edit')}>
                        <Pencil className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="icon" title={t('delete')} onClick={() => openDeleteDialog(course)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }

      <AlertDialog open={!!courseToDelete} onOpenChange={(isOpen) => {!isOpen && closeDeleteDialog()}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><h2>{t('user_courses.delete_course_title')}</h2></AlertDialogTitle>
            <AlertDialogDescription>
              <h4>{t('delete_warning', { name: courseToDelete?.title || '' })}</h4>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="secondary">
                {t('cancel')}
              </Button>
            </AlertDialogCancel>
            <Button variant="destructive" onClick={() => handleCourseDelete(courseToDelete!.id)}>
              {t('confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  </>;
};

export default UserCourses;