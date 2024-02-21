import React, { useEffect, useRef } from "react";
import DropdownButton from "../../../../common/components/DropdownButton/DropdownButton";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";
import { Course, CourseQuestion, CourseSection } from "../../../../types/course";
import Question from "./Question";

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

    const tempQuestion = { body: question, answer: '', id: Date.now().toString() } as CourseQuestion;
    setQuestions(prevQuestions => [...prevQuestions, tempQuestion]);

    const payload = convertToFormData({ course_question: { body: question, course_id: course.id } });
    const response = await createCourseQuestion(payload);

    const questionData = serverFormatToClientFormat(response);
    setQuestions(prevQuestions => [...prevQuestions.filter(q => q.id !== tempQuestion.id), { ...questionData, answer: '' }]);

    const updateAnswer = (newAnswerChunk: string) => {
      setQuestions(prevQuestions => {
        const updatedQuestions = prevQuestions.map(question => {
          if (question.id === questionData.id) {
            return { ...question, answer: question.answer + newAnswerChunk };
          }
          return question;
        });
        return updatedQuestions;
      });
    };

    const addRelevantSections = (relevantSections: string[]) => {
      setQuestions(prevQuestions => {
        const updatedQuestions = prevQuestions.map(question => {
          if (question.id === questionData.id) {
            return { ...question, relevantSections };
          }
          return question;
        });
        return updatedQuestions;
      });
    }

    if (questionData.sessionId) {
      const eventSource = new EventSource(`/api/v1/question_stream/${questionData.sessionId}`);
      let relevantSectionIds: string[] = [];

      eventSource.onmessage = (event) => {
        if (!event.data) return;

        try {
          const parsedData = JSON.parse(event.data);

          if (parsedData?.type === 'answer_chunk' && parsedData.message) {
            updateAnswer(parsedData.message);
          } else if (parsedData?.type === 'relevant_sections') {
            relevantSectionIds = parsedData.message;
          } else if (parsedData?.type === 'shutdown') {
            if (relevantSectionIds.length) {
              addRelevantSections(relevantSectionIds);
            } 
          }
        } catch (e) {}
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
      <DropdownButton.Dropdown placement="right" closable={true} expandable={true}>
        <div className="course-question-box">
          {questions.length === 0 && <h4>You have no questions for this course yet.</h4>}
          {questions.length > 0 && <div ref={questionsContainer}>
            {questions?.map(question => (
              <Question key={question.id} question={question} course={course} />
            ))}
          </div>}
          <CourseQuestionForm onAskQuestion={handleAskQuestion} />
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseQuestionButton;
