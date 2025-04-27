import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create base API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
      // You might want to redirect to login
      window.location.href = '/auth/signin';
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  login: (credentials) => 
    api.post('/token', 
      new URLSearchParams({
        username: credentials.email,
        password: credentials.password,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ),
    
  register: (userData) => 
    api.post('/users/register', {
      email: userData.email,
      password: userData.password,
    }),
};

// Resume API endpoints
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

// Job API endpoints
export const jobApi = {
  create: (data) => api.post('/job_descriptions', data),
  getAll: () => api.get('/job_descriptions'),
  getById: (id) => api.get(`/job_descriptions/${id}`),
  update: (id, data) => api.put(`/job_descriptions/${id}`, data),
  delete: (id) => api.delete(`/job_descriptions/${id}`),
};

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
  });

  api.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  });
}

export default api;