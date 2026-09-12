import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const getAdminUsers = async (search = '', role = 'all') => {
  const params = {};
  if (search) params.search = search;
  if (role && role !== 'all') params.role = role;
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.put(`/admin/users/${userId}/status`, {
    is_active: isActive
  });
  return response.data;
};

export const getAdminJobs = async (search = '', status = 'all') => {
  const params = {};
  if (search) params.search = search;
  if (status && status !== 'all') params.status = status;
  const response = await api.get('/admin/jobs', { params });
  return response.data;
};

export const updateJobStatus = async (jobId, newStatus) => {
  const response = await api.put(`/admin/jobs/${jobId}/status`, {
    status: newStatus
  });
  return response.data;
};

export const getAdminApplications = async (search = '', status = 'all') => {
  const params = {};
  if (search) params.search = search;
  if (status && status !== 'all') params.status = status;
  const response = await api.get('/admin/applications', { params });
  return response.data;
};
