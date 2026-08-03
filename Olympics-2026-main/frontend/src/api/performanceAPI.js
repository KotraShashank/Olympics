import api from './axiosInstance';

export const performanceAPI = {
  getAllProgress: () => api.get('/api/performance/progress'),
  getProgressBySport: (sportId) => api.get(`/api/performance/progress/${sportId}`),
  getSummaryBySport: (sportId) => api.get(`/api/performance/summary/${sportId}`),
  getAllSummaries: () => api.get('/api/performance/summary'),
};
