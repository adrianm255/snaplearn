import React from "react";
import Field, { FieldType } from "../../../../common/components/Field/Field";
import { Button } from "@/common/components/ui/button";

const CourseQuestionForm: React.FC<{ onAskQuestion: (e: React.FormEvent<HTMLFormElement>) => void }> = ({ onAskQuestion }) => {
  const [question, setQuestion] = React.useState<string>('');

  const handleAskQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAskQuestion(e);
    setQuestion('');
  };

  return (
    <form onSubmit={handleAskQuestion}>
      <Field value={question} onChange={e => setQuestion(e.target.value)} type={FieldType.Textarea} name="question" placeholder="Ask a question" style={{ maxHeight: '8rem' }} required />
      <Button variant="outline" type="submit">Ask</Button>
    </form>
  );
};

export default CourseQuestionForm;