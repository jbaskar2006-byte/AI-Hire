import api from './api';

export const applyForJob = async (jobId) => {
  const response = await api.post(`/applications/${jobId}`);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/applications/my');
  return response.data;
};

export const withdrawApplication = async (applicationId) => {
  const response = await api.delete(`/applications/${applicationId}`);
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.put(`/applications/${applicationId}/status`, { status });
  return response.data;
};
