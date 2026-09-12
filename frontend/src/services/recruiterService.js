import api from './api';

export const recruiterService = {
  getProfile: async () => {
    const response = await api.get('/recruiter/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/recruiter/profile', profileData);
    return response.data;
  },

  getCompany: async () => {
    const response = await api.get('/recruiter/company');
    return response.data;
  },

  createCompany: async (companyData) => {
    const response = await api.post('/recruiter/company', companyData);
    return response.data;
  },

  updateCompany: async (companyData) => {
    const response = await api.put('/recruiter/company', companyData);
    return response.data;
  },
};

export default recruiterService;
