import API from '../api/axios';

const base = '/client/dashboard';

const getClientSummary = async () => {
  try {
    const response = await API.get(`${base}/summary`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch client dashboard summary');
  }
};

export default {
  getClientSummary,
};
