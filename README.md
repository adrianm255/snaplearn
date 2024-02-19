# Snaplearn
Snaplearn is a dynamic platform designed to revolutionize the way educational content is created, published, and accessed. It empowers creators by providing them with the tools needed to build and publish comprehensive courses on a variety of subjects. For learners, Snaplearn offers an accessible library of these courses, enhanced by AI. This AI integration not only facilitates a personalized learning experience but also enables users to receive instant answers to their queries, directly based on the course content.

## Motivation
I built this app with Rails + React as a proof-of-concept of how current AI technology can be used to enhance a narrow portion of the Gumroad app's functionality. I focused on "course" type products where this AI enhancement would work best and I also included a stripped-down version of a course editor for building courses. The app was built to resemble Gumroad's *look and feel* as much as possible (by *literally copy-pasting the gumroad CSS file* and structuring the layout to work with it).

## Live demo
https://snaplearn-web.onrender.com/

For most pages you will be prompted to log-in. These are some predefined users with a small number of published courses:

 - gumroad1@test.com / password
 - gumroad2@test.com / password

but feel free to create any new accounts.

**Main Pages**
[Discover](https://snaplearn-web.onrender.com/discover) - publicly accessible, displays all published courses available in the platform.
[Dashboard](https://snaplearn-web.onrender.com/dashboard) - currently an empty page, but this gets you to the main dashboard from where you can create and edit courses.
[Courses](https://snaplearn-web.onrender.com/courses) - lists all courses created by you, with options to view/edit/delete them.

**Notes**
The hosted app is fairly slow because of limitations with the hosting provider (render) coupled with the fact that it uses Server-Side Rendering and it was not particularly optimized for this POC.

The app is nowhere near being completely polished - I rushed development over the last few days so I could get it ready in time. There are some minor (and bigger) things that could and should be improved and there are some UX and functional features missing that I initially planned to include, but didn't get around to implementing them yet - I will continue working on these over the next few days so by the time you see this some of them might have been fixed/implemented. These include:

 - Server-side validation and data sanitization
 - Proper error-handling
 - Optimization of bundle size and of React code to avoid unnecessary re-renders
 - UX stuff like user toaster success/error messages, profile page, pagination, infinite scroll, sorting of course sections etc.

Also, since this was built as a POC, accessibility (especially around ARIA attributes) and proper usage of HTML semantic elements were not focused on. The code itself is not as clean as it could be and the Typescript code is not typed everywhere. Some bigger React components could also benefit from better encapsulation.

For an overview of the major design decisions I made please see the section at the bottom of the page.

## Technical details

### Tech stack
 - Ruby on Rails (with *devise* gem for user/session management)
 - React_on_rails (with SSR)
 - React
 - PostgreSQL
 - Sidekiq + Redis - for async job management
 - OpenAI API (with *ruby-openai* gem) - for embedding course content and asking/answering questions

### High-level overview (and major technical decisions)
**The basics**
A `Course` has an `Author` and consists of a collection of `CourseSections`. A `CourseSection` can be of 3 types: 

 - `Text` (rich text) - user can type long-form text
 - `PDF` - user uploads a PDF file
 - `Video` - user uploads a Video file (.mp4, .ogg or .webm)

A `Course` can be `Published` or `Unpublished`. If published, the course and its content will be visible to all users on the Discover page. If unpublished, the course is only visible to its author.

Users can ask questions (`CourseQuestions`) on any published course (or only the author can ask if the course is unpublished) via a button popup on the course page. The conversation history for each course/user is also displayed in the popup.


**Embedding**
The following illustrates the typical workflow that happens in the background for a common scenario: user creates a course, adds a few sections and saves:

 1. A `ProcessCourseJob` is scheduled to be run for each newly added or updated course section. These jobs are batched so they can all run asynchronously and in parallel. The `ProcessCourseJob` processes the content of the course section to prepare it for embedding. Each job will temporarily save its output (the processed data) to Redis.
 2. After all current `ProcessCourseJobs` complete, an `EmbedCourseJob` is scheduled to batch-embed the processed course section data (retrieved from Redis) using the OpenAI API. The embeddings for each course section are then stored in the database.

A `ProcessCourseJob` works in the following way:

 1. For `Text` sections - it parses the rich text (HTML format) and chunks it into smaller sections (if applicable). A smaller section is defined by any content between two heading tags in the text.
 2. For `PDF`sections - it parses the PDF file to extract the text content and chunks it by page - this is done in memory. If the page ends mid-sentence the content of the page will include the full sentence  (from the following page).
 3. For `Video` sections - it first converts the video file to an .mp3 file (since we are only interested in the audio) to reduce its size. The generated audio file is further chunked into smaller pieces if necessary to comply with OpenAI's limits. This is all done on disk with temporary files. The audio file(s) are then transcribed using OpenAI API.

**Question answering**
 1. The question is embedded using the OpenAI API.
 2. The question embedding is used to retrieve the top relevant sections from the course's content by calculating the cosine similarity between it and each course section embedding.
 3. The (text) content for the top 5 relevant sections is passed onto the OpenAI Completions API along with a system prompt that instructs the AI to answer the question based only on the provided  content.
 4. The AI's answer is streamed back to the client word by word via Server-Sent Events (the client connects to an event-stream endpoint provided by the server after the question is created). This allows the answer to be displayed and updated in real-time in the UI.
 
**Architectural/design decisions**

 1. Using *react_on_rails* to take advantage of server-side rendering. This has the drawbacks that the pages load slower in the browser (especially if not properly optimized) and that the backend is more coupled with the frontend. Most of the frontend is in React and the rails views only act as containers.
 2. Including an "API part" (/api/v1) - this is currently used only internally by the rails app (and the react frontend) for CRUD operations on courses and questions and requires the user to be authenticated via *devise*. This could serve as the basis for a real external API that other apps could connect to (e.g. mobile apps).
 3. Running intensive content processing operations in Sidekiq jobs for obvious reasons such as better performance, concurrency and scalability. 
 4. Batching jobs to minimize OpenAI API calls and database updates. The batching mechanism is currently pretty simple and limited, but it can be significantly improved.
 5. Storing the embedding vectors in the postgreSQL databse in JSON columns. This works well for the purpose of this POC and in most cases, but a specialized vector database might be more suitable for very large amounts of data.
