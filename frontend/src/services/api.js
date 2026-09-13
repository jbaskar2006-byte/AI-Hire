import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hireai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Client-Side Mock Data Engine for Static Host Deployments (GitHub Pages / Offline)
const getMockResponse = (url, method, data) => {
  const lowerUrl = (url || '').toLowerCase();

  // Parse request body data if present
  let reqData = {};
  if (data) {
    try {
      reqData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      reqData = {};
    }
  }

  // --- 1. AUTHENTICATION & USER ENDPOINTS ---
  if (lowerUrl.includes('/auth/me')) {
    const saved = localStorage.getItem('hireai_user');
    return saved ? JSON.parse(saved) : { id: 1, full_name: 'Demo Candidate', email: 'candidate@hireai.com', role: 'candidate' };
  }

  // --- 2. CANDIDATE RESUME ANALYSIS ENDPOINTS ---
  if (lowerUrl.includes('/candidate/resume/latest') || (lowerUrl.includes('/candidate/resume') && method === 'get' && !lowerUrl.includes('/history'))) {
    const storedResume = localStorage.getItem('hireai_latest_resume');
    if (storedResume) {
      return { resume: JSON.parse(storedResume) };
    }
    const defaultResume = {
      id: 1,
      original_filename: 'Demo_Candidate_Resume.pdf',
      file_type: 'pdf',
      file_size: 1048576,
      uploaded_at: new Date().toISOString(),
      total_skills_count: 12,
      personal_info: {
        name: 'Demo Candidate',
        email: 'candidate@hireai.com',
        phone: '+1 (555) 234-5678'
      },
      skills_by_category: {
        'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL'],
        'Frameworks & Libraries': ['React', 'FastAPI', 'Node.js', 'TailwindCSS'],
        'AI & Data Processing': ['Machine Learning', 'PyPDF', 'NLP', 'Scikit-Learn']
      },
      all_extracted_skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'React', 'FastAPI', 'Node.js', 'TailwindCSS', 'Machine Learning', 'PyPDF', 'NLP', 'Scikit-Learn'],
      education: [
        'B.S. in Computer Science - State University (2020 - 2024)'
      ],
      experience: [
        'Senior Full-Stack & AI Engineer at Tech Solutions Inc. (2024 - Present)'
      ],
      projects: [
        'HireAI Intelligent Recruitment & Candidate Scoring System',
        'Automated Resume Extraction & Line-by-Line Skill Parser'
      ],
      certifications: [
        'AWS Certified Solutions Architect',
        'TensorFlow Machine Learning Specialist'
      ]
    };
    return { resume: defaultResume };
  }

  if (lowerUrl.includes('/candidate/resume/history')) {
    const storedHistory = localStorage.getItem('hireai_resume_history');
    if (storedHistory) {
      return { resumes: JSON.parse(storedHistory) };
    }
    const defaultHistory = [
      {
        id: 1,
        original_filename: 'Demo_Candidate_Resume.pdf',
        file_type: 'pdf',
        file_size: 1048576,
        extracted_skills_count: 12,
        analysis_status: 'Completed',
        uploaded_at: new Date().toISOString()
      }
    ];
    return { resumes: defaultHistory };
  }

  if (lowerUrl.includes('/candidate/resume') && method === 'post') {
    // Handle File Upload Fallback
    const fileName = reqData?.name || 'Uploaded_Resume.pdf';
    const ext = fileName.split('.').pop().toLowerCase();
    
    const newResume = {
      id: Date.now(),
      original_filename: fileName,
      file_type: ext,
      file_size: 1548576,
      uploaded_at: new Date().toISOString(),
      total_skills_count: 14,
      personal_info: {
        name: 'Demo Candidate',
        email: 'candidate@hireai.com',
        phone: '+1 (555) 234-5678'
      },
      skills_by_category: {
        'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL'],
        'Frameworks & Libraries': ['React', 'FastAPI', 'TailwindCSS', 'Node.js'],
        'AI & Machine Learning': ['Machine Learning', 'PyPDF', 'NLP', 'Scikit-Learn']
      },
      all_extracted_skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'React', 'FastAPI', 'TailwindCSS', 'Node.js', 'Machine Learning', 'PyPDF', 'NLP', 'Scikit-Learn'],
      education: [
        'B.S. in Computer Science - State University (2020 - 2024)'
      ],
      experience: [
        'Software Engineer at Tech Solutions Inc. (2024 - Present)'
      ],
      projects: [
        'Automated AI Resume Parser & Candidate Match Engine'
      ],
      certifications: [
        'AWS Certified Developer',
        'TensorFlow Machine Learning Specialist'
      ]
    };

    localStorage.setItem('hireai_latest_resume', JSON.stringify(newResume));

    const existingHistory = JSON.parse(localStorage.getItem('hireai_resume_history') || '[]');
    const historyItem = {
      id: newResume.id,
      original_filename: fileName,
      file_type: ext,
      file_size: 1548576,
      extracted_skills_count: 14,
      analysis_status: 'Completed',
      uploaded_at: newResume.uploaded_at
    };
    localStorage.setItem('hireai_resume_history', JSON.stringify([historyItem, ...existingHistory]));

    return {
      status: 'success',
      message: 'Resume uploaded and analyzed successfully!',
      resume: newResume
    };
  }

  // --- 3. CANDIDATE PROFILE ENDPOINTS ---
  if (lowerUrl.includes('/candidate/profile')) {
    if (method === 'put') {
      const existing = JSON.parse(localStorage.getItem('hireai_candidate_profile') || '{}');
      const updated = {
        ...existing,
        ...reqData,
        profile_completion: 95
      };
      localStorage.setItem('hireai_candidate_profile', JSON.stringify(updated));
      return updated;
    }

    const storedProfile = localStorage.getItem('hireai_candidate_profile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    return {
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      education: 'B.S. Computer Science, Stanford University',
      experience_years: 5,
      linkedin_url: 'https://linkedin.com/in/democandidate',
      github_url: 'https://github.com/democandidate',
      portfolio_url: 'https://democandidate.dev',
      profile_completion: 92
    };
  }

  // --- 4. CANDIDATE TECHNICAL SKILLS ENDPOINTS ---
  if (lowerUrl.includes('/candidate/skills')) {
    let storedSkills = JSON.parse(localStorage.getItem('hireai_skills') || 'null');
    if (!storedSkills) {
      storedSkills = [
        { id: 1, skill_name: 'React', skill_level: 'Expert' },
        { id: 2, skill_name: 'Python', skill_level: 'Advanced' },
        { id: 3, skill_name: 'FastAPI', skill_level: 'Advanced' },
        { id: 4, skill_name: 'SQL', skill_level: 'Intermediate' },
        { id: 5, skill_name: 'TailwindCSS', skill_level: 'Expert' },
        { id: 6, skill_name: 'Machine Learning', skill_level: 'Intermediate' }
      ];
      localStorage.setItem('hireai_skills', JSON.stringify(storedSkills));
    }

    if (method === 'post') {
      const newSkill = {
        id: Date.now(),
        skill_name: reqData.skill_name || 'New Skill',
        skill_level: reqData.skill_level || 'Intermediate'
      };
      storedSkills.push(newSkill);
      localStorage.setItem('hireai_skills', JSON.stringify(storedSkills));
      return newSkill;
    }

    if (method === 'put') {
      const skillId = parseInt(lowerUrl.split('/').pop());
      storedSkills = storedSkills.map(s => s.id === skillId ? { ...s, ...reqData } : s);
      localStorage.setItem('hireai_skills', JSON.stringify(storedSkills));
      return reqData;
    }

    if (method === 'delete') {
      const skillId = parseInt(lowerUrl.split('/').pop());
      storedSkills = storedSkills.filter(s => s.id !== skillId);
      localStorage.setItem('hireai_skills', JSON.stringify(storedSkills));
      return { status: 'success', message: 'Skill deleted' };
    }

    return storedSkills;
  }

  // --- 5. CANDIDATE APPLICATIONS ENDPOINTS ---
  if (lowerUrl.includes('/applications') || lowerUrl.includes('/candidate/applications')) {
    let storedApps = JSON.parse(localStorage.getItem('hireai_applications') || 'null');
    if (!storedApps) {
      storedApps = [
        {
          id: 501,
          job_title: 'Senior Full-Stack AI Engineer',
          company_name: 'TechCorp AI Labs',
          status: 'Under Review',
          applied_at: new Date().toISOString(),
          match_score: 95.8
        },
        {
          id: 502,
          job_title: 'Machine Learning & NLP Specialist',
          company_name: 'DataPulse Analytics',
          status: 'Interview Scheduled',
          applied_at: new Date().toISOString(),
          match_score: 91.2
        }
      ];
      localStorage.setItem('hireai_applications', JSON.stringify(storedApps));
    }

    if (method === 'post') {
      const newApp = {
        id: Date.now(),
        job_title: 'Applied Position',
        company_name: 'Tech Partner',
        status: 'Submitted',
        applied_at: new Date().toISOString(),
        match_score: 92.5
      };
      storedApps.unshift(newApp);
      localStorage.setItem('hireai_applications', JSON.stringify(storedApps));
      return newApp;
    }

    return storedApps;
  }

  // --- 6. JOBS BOARD ENDPOINTS ---
  if (lowerUrl.includes('/jobs')) {
    const mockJobs = [
      {
        id: 101,
        title: 'Senior Full-Stack AI Engineer',
        company_name: 'TechCorp AI Labs',
        company: { name: 'TechCorp AI Labs', industry: 'Artificial Intelligence', location: 'San Francisco, CA', website: 'https://techcorp.ai' },
        location: 'San Francisco, CA (Hybrid)',
        job_type: 'Full-Time',
        salary_range: '$140,000 - $180,000',
        salary_min: 140000,
        salary_max: 180000,
        min_experience: 3,
        description: 'Lead development of next-generation AI hiring and candidate evaluation algorithms using React, Python FastAPI, and LLMs.\n\nKey Responsibilities:\n• Architect scalable web applications and state management systems.\n• Develop automated document extraction models & skill matching matrix.',
        requirements: 'React, Python, FastAPI, Machine Learning, PostgreSQL, Docker',
        skills: [
          { skill_name: 'React', skill_type: 'required' },
          { skill_name: 'Python', skill_type: 'required' },
          { skill_name: 'FastAPI', skill_type: 'required' },
          { skill_name: 'Machine Learning', skill_type: 'preferred' }
        ],
        status: 'active',
        applications_count: 42,
        created_at: new Date().toISOString()
      },
      {
        id: 102,
        title: 'Machine Learning & NLP Specialist',
        company_name: 'DataPulse Analytics',
        company: { name: 'DataPulse Analytics', industry: 'Data Intelligence', location: 'Remote', website: 'https://datapulse.dev' },
        location: 'Remote',
        job_type: 'Full-Time',
        salary_range: '$130,000 - $165,000',
        salary_min: 130000,
        salary_max: 165000,
        min_experience: 2,
        description: 'Design automated document extraction models, resume parsing pipelines, and skill similarity graph matching engines.',
        requirements: 'Python, PyTorch, Scikit-Learn, PyPDF, NLP, REST APIs',
        skills: [
          { skill_name: 'Python', skill_type: 'required' },
          { skill_name: 'PyPDF', skill_type: 'required' },
          { skill_name: 'Scikit-Learn', skill_type: 'preferred' }
        ],
        status: 'active',
        applications_count: 28,
        created_at: new Date().toISOString()
      }
    ];

    if (method === 'get' && lowerUrl.match(/\/jobs\/\d+/)) {
      const jobId = parseInt(lowerUrl.split('/').pop());
      return mockJobs.find(j => j.id === jobId) || mockJobs[0];
    }
    return mockJobs;
  }

  // --- 7. AI MATCHING, RANKINGS, INTERVIEW PREP & RECS ---
  if (lowerUrl.includes('/ai/calculate-match') || lowerUrl.includes('/ai/match')) {
    return {
      final_score: 95.8,
      skill_score: 98,
      experience_score: 92,
      education_score: 95,
      similarity_score: 94,
      explanation: 'Exceptional skill overlap in React, Python, and AI Resume Parsing architecture.'
    };
  }

  if (lowerUrl.includes('/ai/rank-candidates')) {
    return [
      { candidate_id: 1, full_name: 'Alex Rivera', match_score: 95.8, headline: 'Senior React & Python Developer', match_category: 'Top Match' },
      { candidate_id: 2, full_name: 'Sophia Chen', match_score: 91.2, headline: 'AI Systems Architect', match_category: 'Strong Match' },
      { candidate_id: 3, full_name: 'Marcus Vance', match_score: 84.5, headline: 'Full-Stack Software Engineer', match_category: 'Good Match' }
    ];
  }

  if (lowerUrl.includes('/ai/interview-questions')) {
    return [
      { id: 1, category: 'Technical Architecture', question: 'How do you design a scalable state management system in React for high-frequency real-time updates?', sample_answer: 'By leveraging Context API alongside localized component state or Zustand/Redux for global domain state, avoiding unnecessary re-renders.' },
      { id: 2, category: 'Backend REST API', question: 'Explain how FastAPI async endpoints handle concurrent asynchronous IO bound requests.', sample_answer: 'FastAPI runs on Starlette/uvicorn using an asyncio event loop, yielding execution on async await calls to serve thousands of concurrent connections.' },
      { id: 3, category: 'AI & Data Processing', question: 'How do vector embeddings improve candidate resume matching accuracy over simple keyword matching?', sample_answer: 'Embeddings capture semantic context and concept similarity (e.g. matching "NLP" with "Text Parsing"), overcoming exact keyword mismatch limitations.' }
    ];
  }

  if (lowerUrl.includes('/ai/skill-gap')) {
    return {
      match_score: 92.0,
      matched_skills: ['React', 'Python', 'FastAPI', 'JavaScript', 'SQL'],
      missing_skills: ['Docker', 'Kubernetes'],
      recommendations: [
        'Complete a quick refresher module on Docker containerization and Kubernetes cluster deployment.',
        'Highlight your hands-on REST API & state management experience in your profile summary.'
      ]
    };
  }

  if (lowerUrl.includes('/ai/recommend-jobs')) {
    return [
      { id: 101, title: 'Senior Full-Stack AI Engineer', company_name: 'TechCorp AI Labs', match_score: 95.8 },
      { id: 102, title: 'Machine Learning & NLP Specialist', company_name: 'DataPulse Analytics', match_score: 91.2 }
    ];
  }

  // --- 8. RECRUITER & ADMIN ENDPOINTS ---
  if (lowerUrl.includes('/recruiter/profile') || lowerUrl.includes('/recruiter/company')) {
    return {
      full_name: 'Lead Recruiter',
      email: 'recruiter@hireai.com',
      company_name: 'TechCorp AI Labs',
      industry: 'Artificial Intelligence & Software',
      website: 'https://techcorp.ai'
    };
  }

  if (lowerUrl.includes('/admin/stats')) {
    return {
      total_users: 1420,
      active_jobs: 86,
      total_applications: 3890,
      match_accuracy: 96.4,
      ai_parses_completed: 12450
    };
  }

  if (lowerUrl.includes('/admin/users')) {
    return [
      { id: 1, full_name: 'Demo Candidate', email: 'candidate@hireai.com', role: 'candidate', is_active: true },
      { id: 2, full_name: 'Lead Recruiter', email: 'recruiter@hireai.com', role: 'recruiter', is_active: true },
      { id: 3, full_name: 'System Administrator', email: 'admin@hireai.com', role: 'admin', is_active: true }
    ];
  }

  if (lowerUrl.includes('/admin/jobs')) {
    return [
      { id: 101, title: 'Senior Full-Stack AI Engineer', company_name: 'TechCorp AI Labs', status: 'Active', applications_count: 42 },
      { id: 102, title: 'Machine Learning & NLP Specialist', company_name: 'DataPulse Analytics', status: 'Active', applications_count: 28 }
    ];
  }

  return { status: 'success', message: 'Operation completed in client mode' };
};

// Response Interceptor: Global 401 Unauthenticated & Offline Fallback Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend server is unreachable (e.g. GitHub Pages static deployment or connection refused)
    if (!error.response || error.response.status === 404 || error.code === 'ERR_NETWORK') {
      const url = error.config?.url || '';
      const method = (error.config?.method || 'get').toLowerCase();
      console.warn(`[Client Mock Engine] Intercepted offline request: ${method.toUpperCase()} ${url}`);
      const mockData = getMockResponse(url, method, error.config?.data);
      return Promise.resolve({ data: mockData, status: 200, statusText: 'OK', headers: {}, config: error.config });
    }

    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('hireai_token');
        localStorage.removeItem('hireai_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
