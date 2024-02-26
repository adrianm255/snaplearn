import { API_URL } from "../constants";
import { getHeaders } from "./sessionService";

const COURSES_API_URL = `${API_URL}/courses`;
const COURSE_QUESTIONS_API_URL = `${API_URL}/questions`;

const fetchCourse = async (id) => {
  return performFetch(`${COURSES_API_URL}/${id}`);
}

const createCourse = async (postData) => {
  return performFetch(`${COURSES_API_URL}`, {
    method: "POST",
    body: postData,
  });
}

const updateCourse = async (id, postData) => {
  return performFetch(`${COURSES_API_URL}/${id}`, {
    method: "PUT",
    body: postData,
  });
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
  return performFetch(`${API_URL}/course/${id}/publish`, {
    method: "POST",
    headers: getHeaders()
  } as any);
};

const unpublishCourse = async (id) => {
  return performFetch(`${API_URL}/course/${id}/unpublish`, {
    method: "POST",
    headers: getHeaders()
  } as any);
};

const createCourseQuestion = async (postData) => {
  return performFetch(`${COURSE_QUESTIONS_API_URL}`, {
    method: "POST",
    body: postData,
  });
};

const getCourseQuestions = async (courseId, start) => {
  return performFetch(`/api/v1/questions?course_id=${courseId}&start=${start}&limit=5`);
};

const performFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    const error = {status: response.status} as any;
    if (data.errors) {
      error.errors = data.errors;
    }
    throw error;
  }
  return data;
};

export {
  createCourse,
  deleteCourse,
  fetchCourse,
  updateCourse,
  createCourseQuestion,
  publishCourse,
  unpublishCourse,
  getCourseQuestions,
};