import api from './axiosInstance';

export const matchAPI = {
  submit: (data) => api.post('/api/matches/submit', data),
  advance: (sportId) => api.post(`/api/matches/advance/${sportId}`),
  getHistory: (sportId) => api.get(`/api/matches/history/${sportId}`),
  getRecent: () => api.get('/api/matches/recent'),
};
