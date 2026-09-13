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

  // Active Job Database
  const baseJobs = [
    {
      id: 101,
      title: 'Full-Stack Developer',
      company_name: 'TechCorp AI Labs',
      company: { name: 'TechCorp AI Labs', industry: 'Software & AI', location: 'Chennai, TN', website: 'https://techcorp.ai' },
      location: 'Chennai, TN (Hybrid)',
      job_type: 'Full Time',
      salary_range: '₹8,00,000 - ₹12,00,000',
      salary_min: 800000,
      salary_max: 1200000,
      min_experience: 1,
      description: 'Build production-grade full-stack web applications with React.js, Node.js, Express, and MySQL/MongoDB databases. Responsible for REST API architecture, responsive frontend, and database schema design.',
      requirements: 'React.js, Python, Java, JavaScript, Node.js, Express, REST API, MySQL, MongoDB, Tailwind',
      skills: [
        { skill_name: 'React.js', skill_type: 'required' },
        { skill_name: 'Python', skill_type: 'required' },
        { skill_name: 'Node.js', skill_type: 'required' },
        { skill_name: 'Express', skill_type: 'required' },
        { skill_name: 'MySQL', skill_type: 'preferred' },
        { skill_name: 'MongoDB', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 14,
      created_at: new Date().toISOString()
    },
    {
      id: 102,
      title: 'Python Development Intern',
      company_name: 'DataPulse Analytics',
      company: { name: 'DataPulse Analytics', industry: 'Analytics', location: 'Remote / Chennai', website: 'https://datapulse.dev' },
      location: 'Remote / Chennai',
      job_type: 'Internship',
      salary_range: '₹25,000 / month',
      salary_min: 25000,
      salary_max: 40000,
      min_experience: 0,
      description: 'Develop automated Python backend scripts, REST API endpoints, and data processing utilities. Collaborate on data pipeline architecture and database synchronization.',
      requirements: 'Python, REST API, MySQL, Git/GitHub, Data Structures',
      skills: [
        { skill_name: 'Python', skill_type: 'required' },
        { skill_name: 'REST API', skill_type: 'required' },
        { skill_name: 'Git/GitHub', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 22,
      created_at: new Date().toISOString()
    },
    {
      id: 103,
      title: 'Data Science Virtual Intern',
      company_name: 'AI Vision Labs',
      company: { name: 'AI Vision Labs', industry: 'AI & Data Science', location: 'Remote', website: 'https://aivision.io' },
      location: 'Remote',
      job_type: 'Internship',
      salary_range: '₹20,000 / month',
      salary_min: 20000,
      salary_max: 35000,
      min_experience: 0,
      description: 'Build real-time data synchronization pipelines using Firebase, Python, and SQL databases. Analyze store metrics and surface AI-driven insights.',
      requirements: 'Python, SQL, Firebase, Data Analysis, Git',
      skills: [
        { skill_name: 'Python', skill_type: 'required' },
        { skill_name: 'Firebase', skill_type: 'required' },
        { skill_name: 'SQL', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 18,
      created_at: new Date().toISOString()
    }
  ];

  // --- 1. AUTHENTICATION ENDPOINTS ---
  if (lowerUrl.includes('/auth/me')) {
    const saved = localStorage.getItem('hireai_user');
    return saved ? JSON.parse(saved) : { id: 1, full_name: 'Baskar J', email: 'Jbaskar2006@gmail.com', role: 'candidate' };
  }

  // --- 2. CANDIDATE RESUME ENDPOINTS ---
  if (lowerUrl.includes('/candidate/resume/latest') || (lowerUrl.includes('/candidate/resume') && method === 'get' && !lowerUrl.includes('/history'))) {
    const storedResume = localStorage.getItem('hireai_latest_resume');
    if (storedResume) {
      return { resume: JSON.parse(storedResume) };
    }
    return { resume: null };
  }

  if (lowerUrl.includes('/candidate/resume/history')) {
    const storedHistory = localStorage.getItem('hireai_resume_history');
    if (storedHistory) {
      return { resumes: JSON.parse(storedHistory) };
    }
    return { resumes: [] };
  }

  if (lowerUrl.includes('/candidate/resume') && method === 'post') {
    return { offline: true, message: 'Backend unavailable, client-side parsing required' };
  }

  // --- 3. CANDIDATE APPLICATIONS ENDPOINTS ---
  if (lowerUrl.includes('/applications')) {
    let storedApps = JSON.parse(localStorage.getItem('hireai_applications') || 'null');
    if (!storedApps) {
      storedApps = [
        {
          id: 501,
          job_id: 101,
          status: 'Applied',
          applied_at: new Date().toISOString(),
          job: baseJobs[0]
        },
        {
          id: 502,
          job_id: 102,
          status: 'Under Review',
          applied_at: new Date().toISOString(),
          job: baseJobs[1]
        }
      ];
      localStorage.setItem('hireai_applications', JSON.stringify(storedApps));
    }

    // Submit New Application (POST /applications/:jobId)
    if (method === 'post') {
      const urlParts = lowerUrl.split('/');
      const jobId = parseInt(urlParts[urlParts.length - 1]) || 101;
      const targetJob = baseJobs.find(j => j.id === jobId) || baseJobs[0];

      const existingIndex = storedApps.findIndex(a => a.job_id === jobId || a.job?.id === jobId);
      let newApp;
      if (existingIndex >= 0) {
        newApp = storedApps[existingIndex];
      } else {
        newApp = {
          id: Date.now(),
          job_id: targetJob.id,
          status: 'Applied',
          applied_at: new Date().toISOString(),
          job: targetJob
        };
        storedApps.unshift(newApp);
        localStorage.setItem('hireai_applications', JSON.stringify(storedApps));
      }
      return { status: 'success', message: 'Application submitted successfully!', application: newApp };
    }

    // Withdraw Application (DELETE /applications/:id)
    if (method === 'delete') {
      const appId = parseInt(lowerUrl.split('/').pop());
      storedApps = storedApps.filter(a => a.id !== appId && a.job_id !== appId);
      localStorage.setItem('hireai_applications', JSON.stringify(storedApps));
      return { status: 'success', message: 'Application withdrawn successfully' };
    }

    // Return Candidate's Applications (GET /applications/my or GET /applications)
    return storedApps;
  }

  // --- 4. JOBS BOARD ENDPOINTS ---
  if (lowerUrl.includes('/jobs')) {
    const storedApps = JSON.parse(localStorage.getItem('hireai_applications') || '[]');
    const appliedJobIds = storedApps.map(a => a.job_id || a.job?.id);

    const jobsWithAppliedState = baseJobs.map(j => ({
      ...j,
      has_applied: appliedJobIds.includes(j.id)
    }));

    // Single Job Detail (GET /jobs/:id)
    if (method === 'get' && lowerUrl.match(/\/jobs\/\d+/)) {
      const jobId = parseInt(lowerUrl.split('/').pop());
      const singleJob = jobsWithAppliedState.find(j => j.id === jobId) || jobsWithAppliedState[0];
      return singleJob;
    }

    // Paginated Job Listing (GET /jobs)
    return {
      items: jobsWithAppliedState,
      total: jobsWithAppliedState.length,
      page: 1,
      size: 9,
      pages: 1
    };
  }

  // --- 5. AI RECOMMENDATIONS ENDPOINTS ---
  if (lowerUrl.includes('/ai/recommend-jobs') || lowerUrl.includes('/ai/recommendations')) {
    const storedApps = JSON.parse(localStorage.getItem('hireai_applications') || '[]');
    const appliedJobIds = storedApps.map(a => a.job_id || a.job?.id);

    const recommendations = [
      {
        job_id: 101,
        title: 'Full-Stack Developer',
        company_name: 'TechCorp AI Labs',
        location: 'Chennai, TN (Hybrid)',
        job_type: 'Full Time',
        min_experience: 1,
        salary_min: 800000,
        salary_max: 1200000,
        match_score: 96.5,
        skill_coverage: 95,
        matched_skills: ['React.js', 'Python', 'Node.js', 'Express', 'MySQL', 'MongoDB'],
        has_applied: appliedJobIds.includes(101)
      },
      {
        job_id: 102,
        title: 'Python Development Intern',
        company_name: 'DataPulse Analytics',
        location: 'Remote / Chennai',
        job_type: 'Internship',
        min_experience: 0,
        salary_min: 25000,
        salary_max: 40000,
        match_score: 94.0,
        skill_coverage: 92,
        matched_skills: ['Python', 'REST API', 'MySQL', 'Git/GitHub'],
        has_applied: appliedJobIds.includes(102)
      },
      {
        job_id: 103,
        title: 'Data Science Virtual Intern',
        company_name: 'AI Vision Labs',
        location: 'Remote',
        job_type: 'Internship',
        min_experience: 0,
        salary_min: 20000,
        salary_max: 35000,
        match_score: 91.5,
        skill_coverage: 88,
        matched_skills: ['Python', 'SQL', 'Firebase', 'Data Analysis'],
        has_applied: appliedJobIds.includes(103)
      }
    ];

    return {
      recommendations: recommendations,
      total_recommendations: recommendations.length
    };
  }

  // --- 6. CANDIDATE PROFILE ENDPOINTS ---
  if (lowerUrl.includes('/candidate/profile')) {
    if (method === 'put') {
      const existing = JSON.parse(localStorage.getItem('hireai_candidate_profile') || '{}');
      const updated = {
        ...existing,
        ...reqData,
        profile_completion: 98
      };
      localStorage.setItem('hireai_candidate_profile', JSON.stringify(updated));
      return updated;
    }

    const storedProfile = localStorage.getItem('hireai_candidate_profile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    return {
      phone: '+91 6381962678',
      location: 'Chennai, Tamil Nadu',
      education: 'B.Tech – Computer Science & Engineering, Rajalakshmi Institute of Technology',
      experience_years: 1,
      linkedin_url: 'https://linkedin.com/in/baskar-j-46b7bb32b',
      github_url: 'https://github.com/jbaskar2006-byte',
      portfolio_url: '',
      profile_completion: 98
    };
  }

  // --- 7. CANDIDATE TECHNICAL SKILLS ENDPOINTS ---
  if (lowerUrl.includes('/candidate/skills')) {
    let storedSkills = JSON.parse(localStorage.getItem('hireai_skills') || 'null');
    if (!storedSkills) {
      storedSkills = [
        { id: 1, skill_name: 'Python', skill_level: 'Expert' },
        { id: 2, skill_name: 'JavaScript', skill_level: 'Expert' },
        { id: 3, skill_name: 'React.js', skill_level: 'Advanced' },
        { id: 4, skill_name: 'Node.js', skill_level: 'Advanced' },
        { id: 5, skill_name: 'Express', skill_level: 'Advanced' },
        { id: 6, skill_name: 'MySQL', skill_level: 'Intermediate' },
        { id: 7, skill_name: 'MongoDB', skill_level: 'Intermediate' }
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

  // --- 8. AI SKILL GAP ANALYSIS ENDPOINT ---
  if (lowerUrl.includes('/ai/skill-gap')) {
    return {
      match_score: 95.8,
      matched_skills: ['React.js', 'Python', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'REST API'],
      missing_skills: ['Docker', 'Kubernetes'],
      recommendations: [
        'Complete a quick module on Docker containerization to maximize match score for cloud engineering roles.',
        'Highlight your hands-on REST API & state management experience in your profile summary.'
      ]
    };
  }

  // --- 9. RECRUITER & ADMIN MOCK ENDPOINTS ---
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

  return { status: 'success', message: 'Operation completed in client mode' };
};

// Response Interceptor: Global 401 Unauthenticated & Offline Fallback Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
