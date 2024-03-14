// import React from "react";

// const QuestionBox: React.FC = () => {
//   return (
//     <div className="course-question-box">
//       {questions.length === 0 && <h4>You have no questions for this course yet.</h4>}
//       {questions.length > 0 && <div ref={questionContainer} id="questionsContainer">
//         <InfiniteScroll
//           dataLength={questions.length}
//           next={fetchNextQuestions}
//           className="questions-container"
//           inverse={true}
//           hasMore={questions.length < totalQuestionsCount}
//           loader={<h4>Loading...</h4>}
//           scrollableTarget="questionsContainer"
//           endMessage={
//             <p style={{ textAlign: 'center' }}>
//               <b>Beginning of conversation</b>
//             </p>
//           }
//         >
//           {questions?.map(question => (
//             <Question key={question.id} question={question} course={course} />
//           ))}
//         </InfiniteScroll>
//       </div>}
//       <CourseQuestionForm onAskQuestion={handleAskQuestion} />
//     </div>
//   );
// };

// export default QuestionBox;