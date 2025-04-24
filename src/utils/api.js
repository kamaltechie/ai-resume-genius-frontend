import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => 
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/token`,
      new URLSearchParams({
        username: credentials.email,
        password: credentials.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ),
  register: (userData) => 
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      {
        email: userData.email,
        password: userData.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ),
};

export const resumeApi = {
  create: (data) => api.post('/resumes', data),
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  analyze: (id) => api.post(`/ai/analyze_resume?resume_id=${id}`),
  optimize: (resumeId, jobId) => 
    api.post(`/ai/optimize_resume?resume_id=${resumeId}&job_id=${jobId}`),
};

export const jobApi = {
  create: (data) => api.post('/job_descriptions', data),
  getAll: () => api.get('/job_descriptions'),
  getById: (id) => api.get(`/job_descriptions/${id}`),
  update: (id, data) => api.put(`/job_descriptions/${id}`, data),
  delete: (id) => api.delete(`/job_descriptions/${id}`),
};

// Add CORS headers to all requests
api.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
  return config;
});

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
      // You might want to redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;