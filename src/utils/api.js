// utils/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Debug: Log API URL when creating the api instance
console.log('Creating API instance with URL:', API_URL);

if (!API_URL) {
  console.error('API_URL is not defined! Check your environment variables.');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(async (config) => {
  try {
    // You can add auth token handling here if needed
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
      window.location.href = '/login';
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
    
  register: async (userData) => {
    console.log('Making registration request:', {
      url: `${API_URL}/users/register`,
      data: {
        email: userData.email,
        passwordLength: userData.password.length
      }
    });

    try {
      const response = await api.post('/users/register', {
        email: userData.email,
        password: userData.password,
      });
      return response;
    } catch (error) {
      console.error('Registration request failed:', {
        url: `${API_URL}/users/register`,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
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