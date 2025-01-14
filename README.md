# Snaplearn
Snaplearn is a dynamic platform designed to revolutionize the way educational content is created, published, and accessed. It empowers creators by providing them with the tools needed to build and publish comprehensive courses on a variety of subjects. For learners, Snaplearn offers an accessible library of these courses, enhanced by AI. This AI integration not only facilitates a personalized learning experience but also enables users to receive instant answers to their queries, directly based on the course content.

⚠ The app is still in prototype phase so best coding practices and standards were not always used. There are several areas within the app that may still have issues, require further polishing, or lack proper error handling and full security measures. The current state of the app reflects a work in progress, where functionality has been prioritized to demonstrate the core features and potential of the project.

<br /> 

**Features**
<br />
Question asking:
<img width="1080" alt="Question asking" src="https://github.com/adrianm255/snaplearn/assets/95966222/b38d6e66-c7b5-47e7-84c1-04d1a7b6747e">
<br />

<br />
Create course/Course editor:
<img width="1080" alt="Create course" src="https://github.com/adrianm255/snaplearn/assets/95966222/79ad2071-af85-41f3-8ceb-be7df29e6c97">
<br />

## Technical details

### Tech stack
 - Ruby on Rails (with *devise* gem for user/session management)
 - React_on_rails (with SSR)
 - Sidekiq + Redis - for async job management
 - PostgreSQL
 - React + Tailwind + Shadcn
 - OpenAI API - for embedding course content and asking/answering questions

### High-level overview (and major technical decisions)
**The basics**

A `Course` has an `Author` and consists of a collection of `CourseSections`. A `CourseSection` can be of 3 types: 

 - `Text` (rich text) - user can type long-form text
 - `PDF` - user uploads a PDF file
 - `Video` - user uploads a Video file (.mp4, .ogg or .webm)

A `Course` can be `Published` or `Unpublished`. If published, the course and its content will be visible to all users on the Discover page. If unpublished, the course is only visible to its author.

Users can ask questions (`CourseQuestions`) on any published course (or only the author can ask if the course is unpublished) via a button popup on the course page. The conversation history for each course/user is also displayed in the popup.

<br /> 

**Embedding**

The following illustrates the typical workflow that happens in the background for a common scenario: user creates a course, adds a few sections and saves:

 1. A `ProcessCourseJob` is scheduled to be run for each newly added or updated course section. These jobs are batched so they can all run asynchronously and in parallel. The `ProcessCourseJob` processes the content of the course section to prepare it for embedding. Each job will temporarily save its output (the processed data) to Redis.
 2. After all current `ProcessCourseJobs` complete, an `EmbedCourseJob` is scheduled to batch-embed the processed course section data (retrieved from Redis) using the OpenAI API. The embeddings for each course section are then stored in the database.

A `ProcessCourseJob` works in the following way:

 1. For `Text` sections - it parses the rich text (HTML format) and chunks it into smaller sections (if applicable). A smaller section is defined by any content between two heading tags in the text.
 2. For `PDF`sections - it parses the PDF file to extract the text content and chunks it by page - this is done in memory. If the page ends mid-sentence the content of the page will include the full sentence  (from the following page).
 3. For `Video` sections - it first converts the video file to an .mp3 file (since we are only interested in the audio) to reduce its size. The generated audio file is further chunked into smaller pieces if necessary to comply with OpenAI's limits. This is all done on disk with temporary files. The audio file(s) are then transcribed using OpenAI API.

<br /> 

**Question answering**
 1. The question is embedded using the OpenAI API.
 2. The question embedding is used to retrieve the top relevant sections from the course's content by calculating the cosine similarity between it and each course section embedding.
 3. The (text) content for the top 5 relevant sections is passed onto the OpenAI Completions API along with a system prompt that instructs the AI to answer the question based only on the provided content.
 4. The AI's answer is streamed back to the client word by word via Server-Sent Events (the client connects to an event-stream endpoint provided by the server after the question is created). This allows the answer to be displayed and updated in real-time in the UI.

<br /> 
 
**Architectural/design decisions**
 1. Using *react_on_rails* to take advantage of server-side rendering. This has the drawbacks that the pages load slower in the browser and that the backend is more coupled with the frontend. Most of the frontend is in React and the rails views only act as containers.
 2. Including an "API part" (/api/v1) - this is currently used only internally by the rails app (and the react frontend) for CRUD operations on courses and questions and requires the user to be authenticated via *devise*. This could serve as the basis for a real external API that other apps could connect to (e.g. mobile apps).
 3. Running intensive content processing operations in Sidekiq jobs for obvious reasons such as better performance, concurrency and scalability. 
 4. Batching jobs to minimize OpenAI API calls and database updates. The batching mechanism is currently pretty simple and limited, but it can be significantly improved.
 5. Storing the embedding vectors in the postgreSQL databse in JSON columns. This works well for most cases, but a specialized vector database might be more suitable for very large amounts of data.
 6. File storage is handled by Rails Active Storage, but a better approach would be to use a third-party service like AWS or similar.
 7. Client-side state management is handled with simple *hooks-store*s which were implemented from scratch and offer redux-like functionality.
