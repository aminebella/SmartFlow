import API from '../api/axios';

const base = '/admin/dashboard';

const reportsService = {
  // Get yearly report data
  getYearlyReport: async (year) => {
    try {
      const response = await API.get(`${base}/report`, { params: { year } });
      return response.data;
    } catch (error) {
      console.error('Reports service: failed to fetch yearly report', error);
      throw error;
    }
  }
};

export default reportsService;
