// lib/requests.js
import axios from 'axios';
import { baseUrl, getToken, getHeaders } from './api-config';

const handleAuthError = (error) => {
  if (typeof window !== 'undefined' && error.response?.status === 401) {
    localStorage.removeItem('program-admin-token');
    window.location.href = '/admin/login';
  }
  throw error;
};

export const getPrograms = () =>
  axios
    .get(`${baseUrl}/programs`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const deleteProgram = (id) =>
  axios
    .delete(`${baseUrl}/programs/${id}`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getSections = () =>
  axios
    .get(`${baseUrl}/sections`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const deleteSection = (id) =>
  axios
    .delete(`${baseUrl}/sections/${id}`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getQuestions = () =>
  axios
    .get(`${baseUrl}/questions`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const deleteQuestion = (id) =>
  axios
    .delete(`${baseUrl}/questions/${id}`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getAnswers = (questionId) =>
  axios
    .get(`${baseUrl}/questions/${questionId}/answers`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const deleteAnswer = (questionId, answerId) =>
  axios
    .delete(`${baseUrl}/questions/${questionId}/answers/${answerId}`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getAnswerScores = () =>
  axios
    .get(`${baseUrl}/scoring`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const updateAnswerScore = (answerId, programId, points) =>
  axios
    .put(`${baseUrl}/scoring/${answerId}/${programId}`, { points }, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const batchUpdateScores = (scores) =>
  axios
    .post(`${baseUrl}/scoring/batch`, { scores }, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getSurveys = () =>
  axios
    .get(`${baseUrl}/surveys`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const getSurvey = (id) =>
  axios
    .get(`${baseUrl}/surveys/${id}`, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const submitSurvey = (data) => axios.post(`${baseUrl}/surveys`, data).then((res) => res.data);

export const upsertAnswer = (questionId, data) =>
  axios
    .put(`${baseUrl}/questions/${questionId}/answers`, data, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const upsertProgram = (data) =>
  axios
    .put(`${baseUrl}/programs`, data, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const upsertSection = (data) =>
  axios
    .put(`${baseUrl}/sections`, data, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);

export const upsertQuestion = (data) =>
  axios
    .put(`${baseUrl}/questions`, data, { headers: getHeaders() })
    .then((res) => res.data)
    .catch(handleAuthError);
