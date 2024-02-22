import React from "react";
import DropdownButton from "../../../../common/components/DropdownButton/DropdownButton";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion, getCourseQuestions } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";
import { Course, CourseQuestion } from "../../../../types/course";
import Question from "./Question";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStore } from "../../../../hooks-store/store";

const CourseQuestionButton: React.FC = () => {
  const state = useStore()[0];
  const course: Course = state.course;
  const courseQuestionsCount: number = state.courseQuestionsCount;

  const [questions, setQuestions] = React.useState<CourseQuestion[]>(course.courseQuestions || []);
  const [totalQuestionsCount, setTotalQuestionsCount] = React.useState<number>(courseQuestionsCount);

  const handleAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;

    const tempQuestion = { body: question, answer: '', id: Date.now().toString() } as CourseQuestion;
    setQuestions(prevQuestions => [tempQuestion, ...prevQuestions]);

    const payload = convertToFormData({ course_question: { body: question, course_id: course.id } });
    const response = await createCourseQuestion(payload);

    const questionData = serverFormatToClientFormat(response);
    setQuestions(prevQuestions => [{ ...questionData, answer: '' }, ...prevQuestions.filter(q => q.id !== tempQuestion.id)]);

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

  const fetchNextQuestions = async () => {
    try {
      const nextQuestions = await getCourseQuestions(course.id, questions.length);
      const nextQuestionsData = serverFormatToClientFormat(nextQuestions);
  
      setTotalQuestionsCount(nextQuestionsData.totalCount);
      setQuestions(prevQuestions => [...prevQuestions, ...nextQuestionsData.questions]);
    } catch (e) {}
  };

  return (<div className="ask-question-button">
    <DropdownButton>
      <DropdownButton.Button buttonClass="primary">
        <span className="icon icon-plus-circle"></span>
        <span className="content">Ask a question</span>
      </DropdownButton.Button>
      <DropdownButton.Dropdown placement="right" closable={true} expandable={true}>
        <div className="course-question-box">
          {questions.length === 0 && <h4>You have no questions for this course yet.</h4>}
          {questions.length > 0 && <div id="questionsContainer">
            <InfiniteScroll
              dataLength={questions.length}
              next={fetchNextQuestions}
              className="questions-container"
              inverse={true}
              hasMore={questions.length < totalQuestionsCount}
              loader={<h4>Loading...</h4>}
              scrollableTarget="questionsContainer"
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Beginning of conversation</b>
                </p>
              }
            >
              {questions?.map(question => (
                <Question key={question.id} question={question} course={course} />
              ))}
            </InfiniteScroll>
          </div>}
          <CourseQuestionForm onAskQuestion={handleAskQuestion} />
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseQuestionButton;
