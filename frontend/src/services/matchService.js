import api from './api';

export const calculateMatch = async (jobId, candidateId) => {
  const response = await api.post(`/ai/calculate-match/${jobId}/${candidateId}`);
  return response.data;
};

export const getMatchScore = async (jobId, candidateId) => {
  const response = await api.get(`/ai/match/${jobId}/${candidateId}`);
  return response.data;
};

export const getRankedCandidates = async (jobId) => {
  const response = await api.get(`/ai/rank-candidates/${jobId}`);
  return response.data;
};
