import axios from 'axios';

const api = axios.create({
  baseURL: 'https://transport-booking.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Auto-attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// --- Transport search services ---
export const busService = {
  search: (params) => api.get('/buses/search', { params }),
  getById: (id) => api.get(`/buses/${id}`)
};

export const trainService = {
  search: (params) => api.get('/trains/search', { params }),
  getById: (id) => api.get(`/trains/${id}`)
};

export const flightService = {
  search: (params) => api.get('/flights/search', { params }),
  getById: (id) => api.get(`/flights/${id}`)
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason })
};