import React from "react";
import Field, { FieldType } from "../../../../common/components/Field/Field";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";

const CourseQuestionForm: React.FC<{ courseId: string, onAskQuestion: (e: React.FormEvent<HTMLFormElement>) => void }> = ({ courseId, onAskQuestion }) => {
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const question = formData.get('question') as string;

  //   // Send the question to the server
  //   const payload = convertToFormData({ course_question: { body: question, course_id: courseId } });
  //   const response = await createCourseQuestion(payload);
  //   console.log('RESPONSE');
  //   console.log(response);

  //   const questionData = serverFormatToClientFormat(response);
  //   if (questionData.sessionId) {
  //     const eventSource = new EventSource(`/api/v1/question_stream/${questionData.sessionId}`);
  //     eventSource.onmessage = (event) => {
  //       console.log('New message:', event.data);
  //     };
  //     eventSource.onerror = (error) => {
  //       console.error('EventSource failed:', error);
  //       eventSource.close();
  //     };
  //   }
  // };

  return (
    <form onSubmit={onAskQuestion}>
      <Field type={FieldType.Textarea} name="question" placeholder="Ask a question" style={{ maxHeight: '76px' }} required />
      <button type="submit">Ask</button>
    </form>
  );
};

export default CourseQuestionForm;