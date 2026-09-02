import axiosInstance from './axiosInstance';

export const leaderboardAPI = {
  // Get leaderboard data
  getLeaderboard: async (limit = 50) => {
    return axiosInstance.get('/api/leaderboard', {
      params: { limit },
    });
  },
};
