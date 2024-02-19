import React, { useEffect, useRef } from "react";
import DropdownButton from "../../../../common/components/DropdownButton/DropdownButton";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "../../../../helpers/formDataHelper";
import { createCourseQuestion } from "../../../../services/courseService";
import { serverFormatToClientFormat } from "../../../../helpers/dataMapper";
import { Course, CourseQuestion, CourseSection } from "../../../../types/course";
import { getSectionIconClass } from "../../../../helpers/courseHelper";
import CourseSectionSummary from "../CourseSectionSummary/CourseSectionSummary";

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

  const getCourseSection = (courseSectionId: string): CourseSection | undefined => {
    return course.courseSections?.find(section => section.id === courseSectionId);
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
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: question.answer }}></div>
                    {question.relevantSections?.length && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}><strong>Relevant course material</strong></h4>
                        <div role="tree">
                          {question.relevantSections?.map(relevantSectionId => (
                            <div key={relevantSectionId} className="relevant-section" role="treeitem" style={{ fontSize: '0.875rem' }}>
                              {getCourseSection(relevantSectionId) && (
                                <CourseSectionSummary courseSection={getCourseSection(relevantSectionId)!} includeDescription={false} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>}
          <CourseQuestionForm key={questions.length} onAskQuestion={handleAskQuestion} />
        </div>
      </DropdownButton.Dropdown>
    </DropdownButton>
  </div>);
};

export default CourseQuestionButton;
