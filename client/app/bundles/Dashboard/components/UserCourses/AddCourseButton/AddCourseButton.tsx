import React, { useState } from "react";
import Dialog from "../../../../../common/components/Dialog/Dialog";
import useTranslation from "../../../../../libs/i18n/useTranslation";
import Field, { FieldType } from "../../../../../common/components/Field/Field";

const AddCourseButton: React.FC<{ onAddCourse: (title: string) => void }> = ({ onAddCourse }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();

  const handleNewCourseFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('course_title') as string;
    onAddCourse(title);
  };

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return <>
    <button className="action accent" onClick={openDialog}>{t('user_courses.new_course_label')}</button>
    <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
      <header>
        <h2>{t('user_courses.create_course_title')}</h2>
        <div role="button" className="close" aria-label="Close" onClick={closeDialog}></div>
      </header>
      <form onSubmit={handleNewCourseFormSubmit}>
        <Field
          type={FieldType.Text}
          name="course_title"
          label={t('course.title_label')}
          placeholder={t('course_section.title_label')}
          required
        />
        <footer>
          <button type="button" onClick={closeDialog}>{t('cancel')}</button>
          <button className="accent">{t('create')}</button>
        </footer>
      </form>
    </Dialog>
  </>;
};

export default AddCourseButton;