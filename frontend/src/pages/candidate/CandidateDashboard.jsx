import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import candidateService from '../../services/candidateService';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Code, 
  FileText, 
  Search, 
  Briefcase, 
  Zap, 
  BookOpen, 
  Settings, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Bell, 
  X,
  Award,
  ChevronRight,
  Menu
} from 'lucide-react';

export const CandidateDashboard = () => {
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comingSoonModal, setComingSoonModal] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const data = await candidateService.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load candidate profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, []);

  const sidebarNavItems = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, active: true },
    { label: 'My Profile', path: '/candidate/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'My Skills', path: '/candidate/skills', icon: <Code className="w-4 h-4" /> },
    { label: 'My Resume', path: '/candidate/resume', icon: <FileText className="w-4 h-4" /> },
    { label: 'Browse Jobs', path: '/candidate/jobs', icon: <Search className="w-4 h-4" /> },
    { label: 'AI Recommendations', path: '/candidate/recommendations', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { label: 'My Applications', path: '/candidate/applications', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Skill Gap', path: '/candidate/skill-gap', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { label: 'Interview Prep', path: '/candidate/interview-prep', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, comingSoon: true },
  ];

  const handleNavClick = (item) => {
    setMobileSidebarOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.comingSoon) {
      setComingSoonModal(item.label);
    }
  };

  const completionPct = profileData?.profile_completion || 0;
  const skillsCount = profileData?.skills?.length || 0;
  const userName = user?.name || user?.full_name || 'Candidate';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation (Responsive Desktop & Mobile Drawer) */}
      <aside className={`w-full md:w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0 ${mobileSidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">HireAI</h1>
                <span className="text-[10px] font-semibold text-emerald-400">Candidate Portal</span>
              </div>
            </div>

            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {sidebarNavItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    Soon
                  </span>
                )}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="p-4 m-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Candidate Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header with Mobile Hamburger */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-sm font-semibold text-slate-300 truncate">Candidate Dashboard</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-medium hidden sm:inline-block">
              Profile {completionPct}% Complete
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => showToast('No pending notifications', 'info')}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 p-8 border border-emerald-500/20 shadow-2xl">
            <div className="absolute inset-0 z-0 opacity-25">
              <img 
                src="/images/tech_workspace.jpg" 
                alt="Candidate Workstation" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Job Seeker Workspace</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {userName}!
                </h1>
                <p className="text-sm text-slate-300 mt-2 max-w-xl">
                  Manage your candidate profile, technical skill stack, and track application readiness.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                  {completionPct}%
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Profile Completion</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {completionPct === 100 ? 'Fully Completed!' : 'Pending details'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Dashboard Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Profile Completion */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Score</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">{completionPct}%</p>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <Link to="/candidate/profile" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-4 inline-flex items-center gap-1">
                Edit Profile <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Total Skills */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Skills</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">{skillsCount}</p>
              <p className="text-xs text-slate-400 mt-2">Added to technical stack</p>
              <Link to="/candidate/skills" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-4 inline-flex items-center gap-1">
                Manage Skills <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Resume Status */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resume Status</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mt-4">AI Analyzed</p>
              <p className="text-xs text-slate-400 mt-2">Upload & parse resume</p>
              <Link to="/candidate/resume" className="text-xs font-bold text-purple-400 hover:text-purple-300 mt-4 inline-flex items-center gap-1">
                Upload & View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Applications */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">0</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400">
                Coming Soon
              </span>
            </div>

          </div>

          {/* Informational Feature Modules Roadmap */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Candidate AI Tools & Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Job Recommendations */}
              <button 
                onClick={() => navigate('/candidate/recommendations')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-emerald-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/recommendations_job_feed.png" alt="AI Job Recommendations" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300">AI Job Recommendations</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Search job openings tailored to your skill set and vector match score.</p>
                </div>
              </button>

              {/* Card 2: Skill Gap Analysis */}
              <button 
                onClick={() => navigate('/candidate/skill-gap')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-emerald-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/skill_gap_analysis.png" alt="Skill Gap Analysis" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300">Skill Gap Analysis</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Identify missing technologies for targeted senior software engineering roles.</p>
                </div>
              </button>

              {/* Card 3: Interview Prep */}
              <button 
                onClick={() => navigate('/candidate/interview-prep')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-purple-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/interview_practice_bot.png" alt="Interview Prep Assistant" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-purple-300">Interview Prep Assistant</span>
                  <p className="text-xs text-slate-400 leading-relaxed">AI-generated technical, HR, project, and skill-based interview questions.</p>
                </div>
              </button>

              {/* Card 4: Resume AI Builder */}
              <button 
                onClick={() => navigate('/candidate/resume')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-blue-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/resume_builder_ai.png" alt="AI Resume Parsing & Builder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-blue-300">AI Resume Optimizer</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Parse, score, and optimize your resume for automated applicant tracking systems.</p>
                </div>
              </button>

              {/* Card 5: Team & Career Collaboration */}
              <button 
                onClick={() => navigate('/candidate/profile')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-teal-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/team_collaboration.jpg" alt="Team & Career Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-teal-300">Developer Profile & Stack</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Showcase your engineering portfolio, Github, and work experience.</p>
                </div>
              </button>

              {/* Card 6: AI Hiring Command */}
              <button 
                onClick={() => navigate('/candidate/applications')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-amber-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="/images/ai_command_center.jpg" alt="AI Application Tracker" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-amber-300">Application Command</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Track interview schedules, real-time application updates, and recruiter chats.</p>
                </div>
              </button>

            </div>
          </div>

        </main>
      </div>

      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setComingSoonModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{comingSoonModal}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Coming Soon. Available in the next development phase. Candidate Profile Management and Skill Matrix are currently active!
            </p>

            <button
              onClick={() => setComingSoonModal(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Close Notification
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateDashboard;
