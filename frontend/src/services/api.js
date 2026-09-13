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

  if (lowerUrl.includes('/auth/me')) {
    const saved = localStorage.getItem('hireai_user');
    return saved ? JSON.parse(saved) : { id: 1, full_name: 'Demo User', email: 'demo@hireai.com', role: 'candidate' };
  }

  if (lowerUrl.includes('/jobs')) {
    const mockJobs = [
      {
        id: 101,
        title: 'Senior Full-Stack AI Engineer',
        company_name: 'TechCorp AI Labs',
        location: 'San Francisco, CA (Hybrid)',
        job_type: 'Full-Time',
        salary_range: '$140,000 - $180,000',
        description: 'Lead development of next-generation AI hiring and candidate evaluation algorithms using React, Python FastAPI, and LLMs.',
        requirements: 'React, Python, FastAPI, Machine Learning, PostgreSQL, Docker',
        status: 'Active',
        created_at: new Date().toISOString()
      },
      {
        id: 102,
        title: 'Machine Learning & NLP Specialist',
        company_name: 'DataPulse Analytics',
        location: 'Remote',
        job_type: 'Full-Time',
        salary_range: '$130,000 - $165,000',
        description: 'Design automated document extraction models, resume parsing pipelines, and skill similarity graph matching engines.',
        requirements: 'Python, PyTorch, Scikit-Learn, PyPDF, NLP, REST APIs',
        status: 'Active',
        created_at: new Date().toISOString()
      },
      {
        id: 103,
        title: 'Lead Frontend Developer (React)',
        company_name: 'NextGen Softworks',
        location: 'New York, NY (On-site)',
        job_type: 'Full-Time',
        salary_range: '$120,000 - $155,000',
        description: 'Craft responsive, high-performance web applications with modern glassmorphism, dynamic data visualizations, and TailwindCSS.',
        requirements: 'React, JavaScript (ES6+), Vite, TailwindCSS, Recharts, State Management',
        status: 'Active',
        created_at: new Date().toISOString()
      }
    ];

    if (method === 'get' && lowerUrl.match(/\/jobs\/\d+/)) {
      return mockJobs[0];
    }
    return mockJobs;
  }

  if (lowerUrl.includes('/candidate/profile')) {
    return {
      full_name: 'Demo Candidate',
      email: 'candidate@hireai.com',
      phone: '+1 (555) 234-5678',
      headline: 'Senior Software & AI Engineer',
      summary: 'Passionate developer with 5+ years of experience building modern web apps, full-stack REST services, and AI data parsing pipelines.',
      skills: ['React', 'Python', 'FastAPI', 'JavaScript', 'SQL', 'Machine Learning', 'TailwindCSS']
    };
  }

  if (lowerUrl.includes('/candidate/resume')) {
    return {
      id: 1,
      filename: 'Candidate_Resume_Parsed.pdf',
      upload_date: new Date().toISOString(),
      parsed_data: {
        contact_info: {
          full_name: 'Demo Candidate',
          email: 'candidate@hireai.com',
          phone: '+1 (555) 234-5678',
          linkedin: 'https://linkedin.com/in/democandidate',
          github: 'https://github.com/democandidate'
        },
        skills: ['React', 'Python', 'FastAPI', 'JavaScript', 'SQL', 'PyPDF', 'TailwindCSS'],
        education: [
          { degree: 'B.S. in Computer Science', institution: 'State University', year: '2020 - 2024' }
        ],
        experience: [
          { role: 'Software Engineer', company: 'Tech Solutions Inc.', duration: '2024 - Present', description: 'Developed full-stack web applications and automated AI data processing modules.' }
        ],
        certificates: ['AWS Certified Developer', 'TensorFlow Machine Learning Specialist'],
        line_by_line_analysis: [
          { section: 'Education', text: 'B.S. Computer Science - State University (2020-2024)', confidence: 0.98 },
          { section: 'Skills', text: 'Languages: Python, JavaScript, SQL. Frameworks: React, FastAPI, TailwindCSS.', confidence: 0.99 },
          { section: 'Experience', text: 'Software Engineer at Tech Solutions Inc: Implemented REST APIs and web interfaces.', confidence: 0.96 }
        ]
      }
    };
  }

  if (lowerUrl.includes('/ai/analyze-resume')) {
    return {
      status: 'success',
      match_score: 94.5,
      candidate_name: 'Parsed Candidate Profile',
      parsed_data: {
        contact: { email: 'candidate@hireai.com', phone: '+1 (555) 234-5678' },
        skills: ['React', 'Python', 'FastAPI', 'TailwindCSS', 'SQL', 'Machine Learning'],
        education: ['B.S. Computer Science'],
        experience: ['Software Engineer (2+ years)'],
        certificates: ['AWS Certified Developer']
      },
      analysis_insights: [
        'Strong alignment with Full-Stack and AI Engineering requirements.',
        'Extracted verified education, certified skills, and line-by-line experience credentials.'
      ]
    };
  }

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
