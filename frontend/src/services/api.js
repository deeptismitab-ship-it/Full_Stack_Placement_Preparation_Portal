import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  bookmarkQuestion: (id) => api.post(`/auth/bookmark/question/${id}`),
  removeBookmark: (id) => api.delete(`/auth/bookmark/question/${id}`),
  getAllUsers: () => api.get('/auth/users')
};

// Questions API
export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  getByCategory: (category, params) => api.get(`/questions/category/${category}`, { params }),
  getRandom: (params) => api.get('/questions/random', { params }),
  getStats: () => api.get('/questions/stats'),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  bulkCreate: (data) => api.post('/questions/bulk', data)
};

// Tests API
export const testsAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getById: (id) => api.get(`/tests/${id}`),
  submit: (id, data) => api.post(`/tests/${id}/submit`, data),
  getResults: () => api.get('/tests/results'),
  getResultDetails: (id) => api.get(`/tests/results/${id}`),
  getLeaderboard: (id) => api.get(`/tests/${id}/leaderboard`),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  delete: (id) => api.delete(`/tests/${id}`),
  generate: (data) => api.post('/tests/generate', data)
};

// Companies API
export const companiesAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  getByStatus: (status) => api.get(`/companies/status/${status}`),
  getIndustries: () => api.get('/companies/industries'),
  getStats: () => api.get('/companies/stats'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  addExperience: (id, data) => api.post(`/companies/${id}/experience`, data)
};

// Progress API
export const progressAPI = {
  getUserProgress: () => api.get('/progress'),
  updateProgress: (data) => api.post('/progress', data),
  getStats: () => api.get('/progress/stats'),
  getWeekly: () => api.get('/progress/weekly'),
  getCategoryProgress: (category) => api.get(`/progress/${category}`),
  updateStreak: (data) => api.put('/progress/streak', data)
};

export default api;