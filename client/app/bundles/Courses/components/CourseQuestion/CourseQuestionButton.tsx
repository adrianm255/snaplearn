import React, { useEffect, useRef } from "react";
import DropdownButton from "../../../../common/components/DropdownButton/DropdownButton";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";
import { Course, CourseQuestion } from "../../../../types/course";

const CourseQuestionButton: React.FC<{ course: Course }> = ({ course }) => {
  const [questions, setQuestions] = React.useState<CourseQuestion[]>(course.courseQuestions || []);
  const questionsContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (questionsContainer.current) {
      questionsContainer.current.scrollTop = questionsContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [questions]);

  const handleAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;

    const payload = convertToFormData({ course_question: { body: question, course_id: course.id } });
    const response = await createCourseQuestion(payload);

    const questionData = serverFormatToClientFormat(response);
    setQuestions(prevQuestions => [...prevQuestions, { ...questionData, answer: '' }]);

    if (questionData.sessionId) {
      const eventSource = new EventSource(`/api/v1/question_stream/${questionData.sessionId}`);
      eventSource.onmessage = (event) => {
        console.log('New message:', event.data);
        if (!event.data) return;

        setQuestions(prevQuestions => {
          const updatedQuestions = prevQuestions.map(question => {
            if (question.id === questionData.id) {
              return { ...question, answer: question.answer + event.data };
            }
            return question;
          });
          return updatedQuestions;
        });
      };
      eventSource.onerror = () => {
        eventSource.close();
      };
    }
  };

  return (<div className="ask-question-button">
    <DropdownButton onOpen={() => setTimeout(scrollToBottom)}>
      <DropdownButton.Button buttonClass="primary">
        <span className="icon icon-plus-circle"></span>
        <span className="content">Ask a question</span>
      </DropdownButton.Button>
      <DropdownButton.Dropdown customClass="right">
        <div className="course-question-box">
          {questions.length === 0 && <h4>You have no questions for this course yet.</h4>}
          {questions.length > 0 && <div ref={questionsContainer}>
            {questions?.map(question => (
              <div key={question.id} className="question">
                <div className="question-body">
                  <div>Q:</div>
                  <div>{question.body}</div>
                </div>
                <div className="question-answer">
                  <div>A:</div>
                  <div><div dangerouslySetInnerHTML={{ __html: question.answer }}></div></div>
                </div>
              </div>
            ))}
          </div>}
          <CourseQuestionForm courseId={course.id} onAskQuestion={handleAskQuestion} />
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseQuestionButton;
