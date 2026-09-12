import api from './api';

export const candidateService = {
  getProfile: async () => {
    const response = await api.get('/candidate/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/candidate/profile', profileData);
    return response.data;
  },

  getSkills: async () => {
    const response = await api.get('/candidate/skills');
    return response.data;
  },

  addSkill: async (skillData) => {
    const response = await api.post('/candidate/skills', skillData);
    return response.data;
  },

  updateSkill: async (skillId, skillData) => {
    const response = await api.put(`/candidate/skills/${skillId}`, skillData);
    return response.data;
  },

  deleteSkill: async (skillId) => {
    const response = await api.delete(`/candidate/skills/${skillId}`);
    return response.data;
  },
};

export default candidateService;
