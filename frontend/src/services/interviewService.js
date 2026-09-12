import api from './api';

export const getInterviewQuestions = async (jobId, candidateId) => {
  const response = await api.get(`/ai/interview-questions/${jobId}/${candidateId}`);
  return response.data;
};

export const generateInterviewQuestions = async (jobId, candidateId, numQuestions = 10) => {
  const response = await api.post('/ai/interview-questions', {
    job_id: jobId,
    candidate_id: candidateId,
    num_questions: numQuestions
  });
  return response.data;
};
