import { API_PATHS } from '../constants/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const buildUrl = (path, queryParams = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const basePath = `${API_BASE_URL}${path}`;

  return queryString ? `${basePath}?${queryString}` : basePath;
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  return handleResponse(response);
};

export const getHealth = () => request(API_PATHS.HEALTH);

export const getApiInfo = () => request(API_PATHS.API_INFO);

export const getStudents = (params = {}) =>
  fetch(buildUrl(API_PATHS.STUDENTS, params), {
    headers: { 'Content-Type': 'application/json' },
  }).then(handleResponse);

export const getStudentById = (id) => request(`${API_PATHS.STUDENTS}/${id}`);

export const createStudent = (studentData) =>
  request(API_PATHS.STUDENTS, {
    method: 'POST',
    body: JSON.stringify(studentData),
  });

export const updateStudent = (id, studentData) =>
  request(`${API_PATHS.STUDENTS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  });

export const patchStudent = (id, studentData) =>
  request(`${API_PATHS.STUDENTS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(studentData),
  });

export const deleteStudent = (id) =>
  request(`${API_PATHS.STUDENTS}/${id}`, {
    method: 'DELETE',
  });
