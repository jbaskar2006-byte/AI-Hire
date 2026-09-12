import api from './api';

export const uploadResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/candidate/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export const getLatestResume = async () => {
  const response = await api.get('/candidate/resume/latest');
  return response.data;
};

export const getResumeHistory = async () => {
  const response = await api.get('/candidate/resume/history');
  return response.data;
};

export const analyzeResumeText = async (text) => {
  const response = await api.post('/ai/analyze-resume', { text });
  return response.data;
};
