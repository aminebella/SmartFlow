import API from '../api/axios';

const base = '/admin/dashboard';

const getSummary = async () => {
  try{
    const res = await API.get(`${base}/summary`);
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard summary');
  }
};

const getReport = async (year) => {
  try {
    const res = await API.get(`${base}/report`, { params: { year } });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard report');
  }
};

export default {
  getSummary,
  getReport,
};
