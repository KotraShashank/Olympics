import api from './axiosInstance';

export const sportsAPI = {
  getAll: () => api.get('/api/sports'),
  getOlympic: () => api.get('/api/sports/olympic'),
  getById: (id) => api.get(`/api/sports/${id}`),
};
