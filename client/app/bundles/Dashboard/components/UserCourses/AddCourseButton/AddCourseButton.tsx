import React, { useState } from "react";
import Dialog from "../../../../../common/components/Dialog/Dialog";
import useTranslation from "../../../../../libs/i18n/useTranslation";

const AddCourseButton: React.FC<{ onAddCourse: (title: string) => void }> = ({ onAddCourse }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();

  const handleNewCourseFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('courseTitle') as string;
    onAddCourse(title);
  };

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return <>
    <button className="action primary" onClick={openDialog}>{t('courses.new_course_label')}</button>
    <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
      <header>
        <h2>{t('courses.create_course_title')}</h2>
        <div role="button" className="close" aria-label="Close" onClick={closeDialog}></div>
      </header>
      <form onSubmit={handleNewCourseFormSubmit}>
        <label>
          Course name:
          <input type="text" name="courseTitle" required/>
        </label>
        <footer>
          <button type="button" onClick={closeDialog}>{t('cancel')}</button>
          <button className="primary">{t('create')}</button>
        </footer>
      </form>
    </Dialog>
  </>;
};

export default AddCourseButton;