// lib/api-config.js
export const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export const getToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('program-admin-token') || '';
  return '';
};

export const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
});
