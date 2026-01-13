import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiUrlEnv = import.meta.env.VITE_API_URL;

const API_URL = apiUrlEnv || (backendUrl ? `${backendUrl}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login page (to prevent refresh loop on invalid credentials)
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const tutorAPI = {
  getAllTutors: (params) => api.get('/tutors', { params }),
  getTutorById: (id) => api.get(`/tutors/${id}`),
  getRecommendedTutors: () => api.get('/tutors/recommended'),
  updateTutorProfile: (data) => api.put('/tutors/profile', data)
};

export const sessionAPI = {
  createSession: (data) => api.post('/sessions', data),
  getUserSessions: (params) => api.get('/sessions', { params }),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  updateSessionStatus: (id, data) => api.put(`/sessions/${id}/status`, data),
  addReview: (id, data) => api.post(`/sessions/${id}/review`, data),
  cancelSession: (id) => api.delete(`/sessions/${id}`)
};

export const messageAPI = {
  sendMessage: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (otherUserId) => api.get(`/messages/${otherUserId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
};

export const moduleAPI = {
  getAllModules: (params) => api.get('/modules', { params }),
  getModuleById: (id) => api.get(`/modules/${id}`),
  createModule: (data) => api.post('/modules', data),
  addTutorToModule: (id, data) => api.post(`/modules/${id}/tutors`, data)
};

export const recommendationAPI = {
  getPersonalizedTutors: () => api.get('/recommendations/tutors'),
  getSubjectSuggestions: () => api.get('/recommendations/subjects'),
  getInsights: () => api.get('/recommendations/insights')
};

export const reportAPI = {
  createReport: (data) => api.post('/reports', data)
};

export const adminAPI = {
  getAllReports: () => api.get('/admin/reports'),
  dismissReport: (id) => api.put(`/admin/reports/${id}/dismiss`),
  resolveReport: (id) => api.put(`/admin/reports/${id}/resolve`),
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data)
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;

