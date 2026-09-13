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

// Scoped LocalStorage Key Helper per Active User Identity
export const getUserStorageKey = (baseKey) => {
  try {
    const savedUserStr = localStorage.getItem('hireai_user');
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      const identifier = savedUser?.email || savedUser?.id || 'default';
      const sanitized = String(identifier).toLowerCase().replace(/[^a-z0-9]/g, '_');
      const scopedKey = `${baseKey}_${sanitized}`;

      // Migrate legacy un-scoped data for Baskar J if scoped key does not exist yet
      if (!localStorage.getItem(scopedKey) && sanitized.includes('baskar')) {
        const legacyData = localStorage.getItem(baseKey);
        if (legacyData) {
          localStorage.setItem(scopedKey, legacyData);
        }
      }
      return scopedKey;
    }
  } catch (e) {
    console.warn("Error resolving scoped storage key:", e);
  }
  return `${baseKey}_default`;
};

// Client-Side Mock Data Engine for Static Host Deployments (GitHub Pages / Offline)
const getMockResponse = (url, method, data) => {
  const lowerUrl = (url || '').toLowerCase();

  let reqData = {};
  if (data) {
    try {
      reqData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      reqData = {};
    }
  }

  // Diverse Active Job & Internship Database (10 Requisitions)
  const baseJobs = [
    {
      id: 101,
      title: 'Full-Stack Developer',
      company_name: 'TechCorp AI Labs',
      company: { name: 'TechCorp AI Labs', industry: 'Software & AI', location: 'Chennai, TN', website: 'https://techcorp.ai' },
      location: 'Chennai, TN (Hybrid)',
      job_type: 'Full-Time',
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
    },
    {
      id: 104,
      title: 'Frontend Developer Intern (React)',
      company_name: 'WebCraft Innovations',
      company: { name: 'WebCraft Innovations', industry: 'Web Technologies', location: 'Chennai, TN', website: 'https://webcraft.dev' },
      location: 'Chennai, TN',
      job_type: 'Internship',
      salary_range: '₹18,000 / month',
      salary_min: 18000,
      salary_max: 30000,
      min_experience: 0,
      description: 'Craft responsive, high-performance UI components using React.js, TailwindCSS, and JavaScript. Optimize web pages for maximum render speed.',
      requirements: 'React.js, JavaScript, HTML5, CSS3, TailwindCSS, Redux',
      skills: [
        { skill_name: 'React.js', skill_type: 'required' },
        { skill_name: 'JavaScript', skill_type: 'required' },
        { skill_name: 'TailwindCSS', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 31,
      created_at: new Date().toISOString()
    },
    {
      id: 105,
      title: 'Backend Software Engineering Intern',
      company_name: 'CloudScale Systems',
      company: { name: 'CloudScale Systems', industry: 'Cloud & DevOps', location: 'Remote', website: 'https://cloudscale.io' },
      location: 'Remote',
      job_type: 'Internship',
      salary_range: '₹22,000 / month',
      salary_min: 22000,
      salary_max: 38000,
      min_experience: 0,
      description: 'Architect RESTful APIs with Python FastAPI and Node.js. Implement PostgreSQL database models and Docker containerization.',
      requirements: 'Python, FastAPI, Node.js, PostgreSQL, Docker, REST API',
      skills: [
        { skill_name: 'Python', skill_type: 'required' },
        { skill_name: 'FastAPI', skill_type: 'required' },
        { skill_name: 'PostgreSQL', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 27,
      created_at: new Date().toISOString()
    },
    {
      id: 106,
      title: 'Cybersecurity & Threat Analyst Intern',
      company_name: 'SecureNet Shield',
      company: { name: 'SecureNet Shield', industry: 'Cybersecurity', location: 'Chennai, TN', website: 'https://securenet.com' },
      location: 'Chennai, TN',
      job_type: 'Internship',
      salary_range: '₹20,000 / month',
      salary_min: 20000,
      salary_max: 32000,
      min_experience: 0,
      description: 'Conduct vulnerability assessments, analyze malware threats, and research preventive cybersecurity measures for enterprise networks.',
      requirements: 'Cybersecurity, Linux, Networking, Python, Threat Analysis',
      skills: [
        { skill_name: 'Cybersecurity', skill_type: 'required' },
        { skill_name: 'Linux', skill_type: 'required' },
        { skill_name: 'Python', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 15,
      created_at: new Date().toISOString()
    },
    {
      id: 107,
      title: 'AI & Machine Learning Specialist',
      company_name: 'NeuralTech Solutions',
      company: { name: 'NeuralTech Solutions', industry: 'Artificial Intelligence', location: 'Remote / Bangalore', website: 'https://neuraltech.ai' },
      location: 'Remote / Hybrid',
      job_type: 'Full-Time',
      salary_range: '₹10,000,000 - ₹15,00,000',
      salary_min: 1000000,
      salary_max: 1500000,
      min_experience: 2,
      description: 'Train deep learning models, natural language processing pipelines, and automated document extraction engines using PyTorch and Scikit-Learn.',
      requirements: 'Python, Machine Learning, PyTorch, TensorFlow, NLP, Scikit-Learn',
      skills: [
        { skill_name: 'Machine Learning', skill_type: 'required' },
        { skill_name: 'PyTorch', skill_type: 'required' },
        { skill_name: 'Python', skill_type: 'required' }
      ],
      status: 'active',
      applications_count: 38,
      created_at: new Date().toISOString()
    },
    {
      id: 108,
      title: 'DevOps & Cloud Engineer',
      company_name: 'Infrastructure Cloud Labs',
      company: { name: 'Infrastructure Cloud Labs', industry: 'Cloud Services', location: 'Chennai, TN', website: 'https://infracloud.io' },
      location: 'Chennai, TN (Hybrid)',
      job_type: 'Full-Time',
      salary_range: '₹9,00,000 - ₹14,00,000',
      salary_min: 900000,
      salary_max: 1400000,
      min_experience: 2,
      description: 'Automate CI/CD pipelines, configure AWS cloud infrastructure, Docker containers, and Kubernetes clusters for web platforms.',
      requirements: 'AWS, Docker, Kubernetes, Git, CI/CD, Nginx, Linux',
      skills: [
        { skill_name: 'AWS', skill_type: 'required' },
        { skill_name: 'Docker', skill_type: 'required' },
        { skill_name: 'Linux', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 19,
      created_at: new Date().toISOString()
    },
    {
      id: 109,
      title: 'Mobile App Developer (React Native)',
      company_name: 'AppNexus Studio',
      company: { name: 'AppNexus Studio', industry: 'Mobile Apps', location: 'Remote', website: 'https://appnexus.dev' },
      location: 'Remote',
      job_type: 'Full-Time',
      salary_range: '₹7,00,000 - ₹11,00,000',
      salary_min: 700000,
      salary_max: 1100000,
      min_experience: 1,
      description: 'Build cross-platform iOS and Android mobile applications using React Native, Redux, and Firebase backend integration.',
      requirements: 'React Native, JavaScript, TypeScript, Redux, Firebase, REST API',
      skills: [
        { skill_name: 'JavaScript', skill_type: 'required' },
        { skill_name: 'React.js', skill_type: 'required' },
        { skill_name: 'Firebase', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 24,
      created_at: new Date().toISOString()
    },
    {
      id: 110,
      title: 'Database & REST API Engineer',
      company_name: 'DataGrid Enterprise',
      company: { name: 'DataGrid Enterprise', industry: 'Database Systems', location: 'Chennai, TN', website: 'https://datagrid.com' },
      location: 'Chennai, TN',
      job_type: 'Full-Time',
      salary_range: '₹8,00,000 - ₹13,00,000',
      salary_min: 800000,
      salary_max: 1300000,
      min_experience: 1,
      description: 'Design relational database schemas (MySQL, PostgreSQL), write complex SQL queries, and implement secure RESTful microservices.',
      requirements: 'SQL, MySQL, PostgreSQL, Node.js, Express, Python, Redis',
      skills: [
        { skill_name: 'SQL', skill_type: 'required' },
        { skill_name: 'MySQL', skill_type: 'required' },
        { skill_name: 'Node.js', skill_type: 'preferred' }
      ],
      status: 'active',
      applications_count: 21,
      created_at: new Date().toISOString()
    }
  ];

  // 1. AUTHENTICATION
  if (lowerUrl.includes('/auth/me')) {
    const saved = localStorage.getItem('hireai_user');
    return saved ? JSON.parse(saved) : null;
  }

  // 2. RESUME ENDPOINTS
  if (lowerUrl.includes('/candidate/resume/latest') || (lowerUrl.includes('/candidate/resume') && method === 'get' && !lowerUrl.includes('/history'))) {
    const key = getUserStorageKey('hireai_latest_resume');
    const storedResume = localStorage.getItem(key);
    if (storedResume) {
      return { resume: JSON.parse(storedResume) };
    }
    return { resume: null };
  }

  if (lowerUrl.includes('/candidate/resume/history')) {
    const key = getUserStorageKey('hireai_resume_history');
    const storedHistory = localStorage.getItem(key);
    if (storedHistory) {
      return { resumes: JSON.parse(storedHistory) };
    }
    return { resumes: [] };
  }

  if (lowerUrl.includes('/candidate/resume') && method === 'post') {
    return { offline: true, message: 'Backend unavailable, client-side parsing required' };
  }

  // 3. APPLICATIONS ENDPOINTS
  if (lowerUrl.includes('/applications')) {
    const key = getUserStorageKey('hireai_applications');
    let storedApps = JSON.parse(localStorage.getItem(key) || 'null');
    if (storedApps === null) {
      const userStr = localStorage.getItem('hireai_user');
      const userObj = userStr ? JSON.parse(userStr) : {};
      const isBaskar = userObj.email && userObj.email.toLowerCase().includes('baskar');

      if (isBaskar) {
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
      } else {
        storedApps = [];
      }
      localStorage.setItem(key, JSON.stringify(storedApps));
    }

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
        localStorage.setItem(key, JSON.stringify(storedApps));
      }
      return { status: 'success', message: 'Application submitted successfully!', application: newApp };
    }

    if (method === 'delete') {
      const appId = parseInt(lowerUrl.split('/').pop());
      storedApps = storedApps.filter(a => a.id !== appId && a.job_id !== appId);
      localStorage.setItem(key, JSON.stringify(storedApps));
      return { status: 'success', message: 'Application withdrawn successfully' };
    }

    return storedApps;
  }

  // 4. JOBS BOARD ENDPOINTS
  if (lowerUrl.includes('/jobs')) {
    const key = getUserStorageKey('hireai_applications');
    const storedApps = JSON.parse(localStorage.getItem(key) || '[]');
    const appliedJobIds = storedApps.map(a => a.job_id || a.job?.id);

    const jobsWithAppliedState = baseJobs.map(j => ({
      ...j,
      has_applied: appliedJobIds.includes(j.id)
    }));

    if (method === 'get' && lowerUrl.match(/\/jobs\/\d+/)) {
      const jobId = parseInt(lowerUrl.split('/').pop());
      const singleJob = jobsWithAppliedState.find(j => j.id === jobId) || jobsWithAppliedState[0];
      return singleJob;
    }

    return {
      items: jobsWithAppliedState,
      total: jobsWithAppliedState.length,
      page: 1,
      size: 12,
      pages: 1
    };
  }

  // 5. AI RECOMMENDATIONS ENDPOINTS
  if (lowerUrl.includes('/ai/recommend-jobs') || lowerUrl.includes('/ai/recommendations')) {
    const key = getUserStorageKey('hireai_applications');
    const storedApps = JSON.parse(localStorage.getItem(key) || '[]');
    const appliedJobIds = storedApps.map(a => a.job_id || a.job?.id);

    const recommendations = baseJobs.slice(0, 6).map((j, idx) => ({
      job_id: j.id,
      title: j.title,
      company_name: j.company_name,
      location: j.location,
      job_type: j.job_type,
      min_experience: j.min_experience,
      salary_min: j.salary_min,
      salary_max: j.salary_max,
      match_score: Math.max(85, 98 - (idx * 2.5)),
      skill_coverage: Math.max(80, 96 - (idx * 3)),
      matched_skills: j.skills.map(s => s.skill_name),
      has_applied: appliedJobIds.includes(j.id)
    }));

    return {
      recommendations: recommendations,
      total_recommendations: recommendations.length
    };
  }

  // 6. INTERVIEW PRACTICE & ANSWER EVALUATOR ENDPOINT
  if (lowerUrl.includes('/ai/interview-questions') || lowerUrl.includes('/interview/questions')) {
    return {
      job_id: 101,
      job_title: 'Full-Stack Developer',
      questions_by_category: {
        'Technical': [
          { id: 1, category: 'Technical', question: 'How do you design a scalable state management system in React for high-frequency updates?', sample_answer: 'Leverage Context API alongside localized component state or Zustand/Redux for domain state.' },
          { id: 2, category: 'Technical', question: 'Explain how Node.js/Express handles non-blocking asynchronous IO operations.', sample_answer: 'Node.js utilizes libuv event loop and thread pool to delegate asynchronous IO operations efficiently.' }
        ],
        'HR': [
          { id: 3, category: 'HR', question: 'Describe a situation where you had to debug a complex issue under tight project deadlines.', sample_answer: 'I prioritized systematic log tracing, isolated the root cause, and delivered an optimized fix.' }
        ],
        'Project': [
          { id: 4, category: 'Project', question: 'Walk us through the architecture of your Smart AI Retail Analytics System project.', sample_answer: 'Designed a React frontend with Node.js/Express backend exposing REST APIs connected to MongoDB and MySQL databases.' }
        ],
        'Skill-Based': [
          { id: 5, category: 'Skill-Based', question: 'How do you structure RESTful API endpoints and handle database query optimization in Python/Node?', sample_answer: 'Follow RESTful conventions, implement indexed queries, pagination, and caching layer with Redis.' }
        ]
      },
      questions: [
        { id: 1, category: 'Technical', question: 'How do you design a scalable state management system in React for high-frequency updates?' },
        { id: 2, category: 'Technical', question: 'Explain how Node.js/Express handles non-blocking asynchronous IO operations.' },
        { id: 3, category: 'HR', question: 'Describe a situation where you had to debug a complex issue under tight project deadlines.' },
        { id: 4, category: 'Project', question: 'Walk us through the architecture of your Smart AI Retail Analytics System project.' },
        { id: 5, category: 'Skill-Based', question: 'How do you structure RESTful API endpoints and handle database query optimization in Python/Node?' }
      ]
    };
  }

  // 7. CANDIDATE PROFILE ENDPOINTS
  if (lowerUrl.includes('/candidate/profile')) {
    const key = getUserStorageKey('hireai_candidate_profile');
    if (method === 'put') {
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      const updated = {
        ...existing,
        ...reqData,
        profile_completion: reqData.profile_completion || 85
      };
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    }

    const storedProfile = localStorage.getItem(key);
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }

    const userStr = localStorage.getItem('hireai_user');
    const userObj = userStr ? JSON.parse(userStr) : {};
    const isBaskar = userObj.email && userObj.email.toLowerCase().includes('baskar');

    if (isBaskar) {
      const defaultBaskarProfile = {
        full_name: userObj.full_name || 'Baskar J',
        email: userObj.email || 'Jbaskar2006@gmail.com',
        phone: '+91 6381962678',
        location: 'Chennai, Tamil Nadu',
        education: 'B.Tech – Computer Science & Engineering, Rajalakshmi Institute of Technology',
        experience_years: 1,
        linkedin_url: 'https://linkedin.com/in/baskar-j-46b7bb32b',
        github_url: 'https://github.com/jbaskar2006-byte',
        portfolio_url: '',
        profile_completion: 98
      };
      localStorage.setItem(key, JSON.stringify(defaultBaskarProfile));
      return defaultBaskarProfile;
    }

    const cleanInitialProfile = {
      full_name: userObj.full_name || userObj.name || 'Candidate',
      email: userObj.email || '',
      phone: '',
      location: '',
      education: '',
      experience_years: 0,
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
      profile_completion: 25
    };
    localStorage.setItem(key, JSON.stringify(cleanInitialProfile));
    return cleanInitialProfile;
  }

  // 8. TECHNICAL SKILLS ENDPOINTS
  if (lowerUrl.includes('/candidate/skills')) {
    const key = getUserStorageKey('hireai_skills');
    let storedSkills = JSON.parse(localStorage.getItem(key) || 'null');
    if (storedSkills === null) {
      const userStr = localStorage.getItem('hireai_user');
      const userObj = userStr ? JSON.parse(userStr) : {};
      const isBaskar = userObj.email && userObj.email.toLowerCase().includes('baskar');

      if (isBaskar) {
        storedSkills = [
          { id: 1, skill_name: 'Python', skill_level: 'Expert' },
          { id: 2, skill_name: 'JavaScript', skill_level: 'Expert' },
          { id: 3, skill_name: 'React.js', skill_level: 'Advanced' },
          { id: 4, skill_name: 'Node.js', skill_level: 'Advanced' },
          { id: 5, skill_name: 'Express', skill_level: 'Advanced' },
          { id: 6, skill_name: 'MySQL', skill_level: 'Intermediate' },
          { id: 7, skill_name: 'MongoDB', skill_level: 'Intermediate' }
        ];
      } else {
        storedSkills = [];
      }
      localStorage.setItem(key, JSON.stringify(storedSkills));
    }

    if (method === 'post') {
      const newSkill = {
        id: Date.now(),
        skill_name: reqData.skill_name || 'New Skill',
        skill_level: reqData.skill_level || 'Intermediate'
      };
      storedSkills.push(newSkill);
      localStorage.setItem(key, JSON.stringify(storedSkills));
      return newSkill;
    }

    if (method === 'delete') {
      const skillId = parseInt(lowerUrl.split('/').pop());
      storedSkills = storedSkills.filter(s => s.id !== skillId);
      localStorage.setItem(key, JSON.stringify(storedSkills));
      return { status: 'success', message: 'Skill deleted' };
    }

    return storedSkills;
  }

  // 9. AI SKILL GAP ANALYSIS
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
