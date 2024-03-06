import React, { useState } from "react";
import useTranslation from "../../../../libs/i18n/useTranslation";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "../../../../common/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../common/components/ui/dialog";
import { Label } from "../../../../common/components/ui/label";
import { Input } from "../../../../common/components/ui/input";

const AddCourseButton: React.FC<{ onAddCourse: (title: string) => Promise<void> }> = ({ onAddCourse }) => {
  const [title, setTitle] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { t } = useTranslation();

  const handleAddCourse = async () => {
    setIsButtonLoading(true);

    try {
      await onAddCourse(title);
    } catch {
      setIsButtonLoading(false);
    }
  };

  return <>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="highlight">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('user_courses.new_course_label')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><h2>{t('user_courses.create_course_title')}</h2></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="course_title">
            {t('course.title_label')}
          </Label>
          <Input
            id="course_title"
            placeholder={t('course.title_label')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('cancel')}
            </Button>
          </DialogClose>
          {/* TODO add proper validation to title */}
          <Button variant="highlight" type="submit" disabled={isButtonLoading || title.length < 3} onClick={handleAddCourse}>
            {isButtonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>;
};

export default AddCourseButton;