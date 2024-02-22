import { API_URL } from "../constants";
import { getHeaders } from "./sessionService";

const COURSES_API_URL = `${API_URL}/courses`;
const COURSE_QUESTIONS_API_URL = `${API_URL}/questions`;

const fetchAllCourses = async (page = 1) => {
  const response = await fetch(`${COURSES_API_URL}?page=${page}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

const fetchCourse = async (id) => {
  const response = await fetch(`${COURSES_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

const createCourse = async (postData) => {
  const response = await fetch(`${COURSES_API_URL}`, {
    method: "POST",
    body: postData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

const updateCourse = async (id, postData) => {
  const response = await fetch(`${COURSES_API_URL}/${id}`, {
    method: "PUT",
    body: postData,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

const deleteCourse = async (id) => {
  const response = await fetch(`${COURSES_API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  } as any);

  if (response.status === 204) {
    return null;
  }

  throw new Error(response.statusText);
}

const publishCourse = async (id) => {
  const response = await fetch(`${API_URL}/course/${id}/publish`, {
    method: "POST",
    headers: getHeaders()
  } as any);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const unpublishCourse = async (id) => {
  const response = await fetch(`${API_URL}/course/${id}/unpublish`, {
    method: "POST",
    headers: getHeaders()
  } as any);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const createCourseQuestion = async (postData) => {
  const response = await fetch(`${COURSE_QUESTIONS_API_URL}`, {
    method: "POST",
    body: postData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const getCourseQuestions = async (courseId, start) => {
  const response = await fetch(`/api/v1/questions?course_id=${courseId}&start=${start}&limit=5`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export {
  createCourse,
  deleteCourse,
  fetchAllCourses,
  fetchCourse,
  updateCourse,
  createCourseQuestion,
  publishCourse,
  unpublishCourse,
  getCourseQuestions,
};