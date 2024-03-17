import React from "react";
import CourseQuestionForm from "./CourseQuestionForm";
import { convertToFormData } from "@/helpers/formDataHelper";
import { createCourseQuestion, getCourseQuestions } from "@/services/courseService";
import { serverFormatToClientFormat } from "@/helpers/dataMapper";
import { Course, CourseQuestion } from "@/types/course";
import Question from "./Question";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStore } from "@/hooks-store/store";
import { Button } from "@/common/components/ui/button";
import { ArrowDownRightFromSquare, MessageCircleQuestion, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { useMediaQuery } from "react-responsive";

const CourseQuestionButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useStore()[0];
  const course: Course = state.course;
  const courseQuestionsCount: number = state.courseQuestionsCount;

  const [questions, setQuestions] = React.useState<CourseQuestion[]>(course.courseQuestions || []);
  const [totalQuestionsCount, setTotalQuestionsCount] = React.useState<number>(courseQuestionsCount);
  const [isQuestionBoxOpen, setIsQuestionBoxOpen] = React.useState<boolean>(false);

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

  const isDesktop = useMediaQuery({
    query: '(min-width: 1024px)'
  })
  const popoverContentProps: any = isDesktop
    ? {
      align: "start",
      side: "right"
    }
    : {
      align: "center",
      sideOffset: 16,
      side: "top"
    };

  return (<>
    <Popover open={isQuestionBoxOpen} onOpenChange={setIsQuestionBoxOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent {...popoverContentProps} onPointerDownOutside={e => e.preventDefault()}>
        <div className="flex flex-row justify-end gap-3 pb-2">
          <Button variant="base" size="icon" className="h-4 w-4 opacity-70">
            <ArrowDownRightFromSquare className="h-4 w-4" />
          </Button>
          <Button variant="base" size="icon" className="h-4 w-4 opacity-70" onClick={() => setIsQuestionBoxOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="course-question-box">
          {questions.length === 0 && <h4 className="px-4 text-muted-foreground">You have no questions for this course yet.</h4>}
          {questions.length > 0 && <div id="questionsContainer">
            <InfiniteScroll
              dataLength={questions.length}
              next={fetchNextQuestions}
              className="questions-container"
              inverse={true}
              hasMore={questions.length < totalQuestionsCount}
              loader={<p className="text-center text-sm text-muted-foreground">Loading...</p>}
              scrollableTarget="questionsContainer"
              endMessage={<p className="text-center text-sm text-muted-foreground">Beginning of conversation</p>}
            >
              {questions?.map(question => (
                <Question key={question.id} question={question} course={course} />
              ))}
            </InfiniteScroll>
          </div>}
          <CourseQuestionForm onAskQuestion={handleAskQuestion} />
        </div>
      </PopoverContent>
    </Popover>
  </>);
};

export default CourseQuestionButton;
