import React from "react";
import Field, { FieldType } from "../../../../common/components/Field/Field";

const CourseQuestionForm: React.FC<{ onAskQuestion: (e: React.FormEvent<HTMLFormElement>) => void }> = ({ onAskQuestion }) => {
  const [question, setQuestion] = React.useState<string>('');

  const handleAskQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAskQuestion(e);
    setQuestion('');
  };

  return (
    <form onSubmit={handleAskQuestion}>
      <Field value={question} onChange={e => setQuestion(e.target.value)} type={FieldType.Textarea} name="question" placeholder="Ask a question" style={{ maxHeight: '76px' }} required />
      <button type="submit">Ask</button>
    </form>
  );
};

export default CourseQuestionForm;