import React from "react";
import DropdownButton from "../../../../common/components/DropdownButton/DropdownButton";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";

const CourseQuestionButton: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [answer, setAnswer] = React.useState<string>('');

  const handleAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;

    // Send the question to the server
    const payload = convertToFormData({ course_question: { body: question, course_id: courseId } });
    const response = await createCourseQuestion(payload);
    console.log('RESPONSE');
    console.log(response);

    const questionData = serverFormatToClientFormat(response);
    if (questionData.sessionId) {
      const eventSource = new EventSource(`/api/v1/question_stream/${questionData.sessionId}`);
      eventSource.onmessage = (event) => {
        console.log('New message:', event.data);
        setAnswer(prevAnswer => prevAnswer += event.data);
      };
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };
    }
  };

  return (<div className="ask-question-button">
    <DropdownButton>
      <DropdownButton.Button buttonClass="primary">
        <span className="icon icon-plus-circle"></span>
        <span className="content">Ask a question</span>
      </DropdownButton.Button>
      <DropdownButton.Dropdown customClass="right">
        <div style={{ width: '500px', height: '500px' }} className="course-question-box">
          <div>
            <div dangerouslySetInnerHTML={{ __html: answer }}></div>
          </div>
          <CourseQuestionForm courseId={courseId} onAskQuestion={handleAskQuestion} />
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseQuestionButton;
