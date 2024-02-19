import React from "react";
import Field, { FieldType } from "../../../../common/components/Field/Field";

const CourseQuestionForm: React.FC<{ onAskQuestion: (e: React.FormEvent<HTMLFormElement>) => void }> = ({ onAskQuestion }) => {
  return (
    <form onSubmit={onAskQuestion}>
      <Field type={FieldType.Textarea} name="question" placeholder="Ask a question" style={{ maxHeight: '76px' }} required />
      <button type="submit">Ask</button>
    </form>
  );
};

export default CourseQuestionForm;