import { API_URL } from "../constants";

const COURSES_API_URL = `${API_URL}/courses`;

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
  });

  // 204 is No Content status
  if (response.status === 204) {
    return null;
  }

  throw new Error(response.statusText);
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  };
};

export {
  createCourse,
  deleteCourse,
  fetchAllCourses,
  fetchCourse,
  updateCourse,
};