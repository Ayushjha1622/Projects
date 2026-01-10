import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Generate a unique idempotency key
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and idempotency key
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add idempotency key for POST requests
    if (config.method === 'post') {
      // Use provided idempotency key or generate a new one
      if (!config.headers['Idempotency-Key']) {
        config.headers['Idempotency-Key'] = generateIdempotencyKey();
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
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
  getCurrentUser: () => api.get('/auth/me'),
};

// Tickets API
export const ticketsAPI = {
  getTickets: (params) => api.get('/tickets', { params }),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
};

export default api;