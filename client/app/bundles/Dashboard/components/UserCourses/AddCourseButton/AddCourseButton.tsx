import React, { useState } from "react";
import Dialog from "../../../../../common/components/Dialog/Dialog";
import useTranslation from "../../../../../libs/i18n/useTranslation";
import Field, { FieldType } from "../../../../../common/components/Field/Field";
import Button from "../../../../../common/components/Button/Button";

const AddCourseButton: React.FC<{ onAddCourse: (title: string) => Promise<void> }> = ({ onAddCourse }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { t } = useTranslation();

  const handleNewCourseFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('course_title') as string;

    try {
      await onAddCourse(title);
      setIsDialogOpen(false);
    } catch {
      setIsButtonLoading(false);
    }
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

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
          {/* <button className="accent">{t('create')}</button> */}
          <Button type="submit" buttonClass="accent" isLoading={isButtonLoading}>{t('create')}</Button>
        </footer>
      </form>
    </Dialog>
  </>;
};

export default AddCourseButton;