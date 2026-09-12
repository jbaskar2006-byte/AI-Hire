import api from './api';

export const getSkillGap = async (jobId, candidateId) => {
  const response = await api.get(`/ai/skill-gap/${jobId}/${candidateId}`);
  return response.data;
};

export const getRecommendedJobs = async () => {
  const response = await api.get('/ai/recommend-jobs');
  return response.data;
};
