import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import recruiterService from '../../services/recruiterService';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Building2, 
  Briefcase, 
  Users, 
  TrendingUp, 
  PieChart, 
  Settings, 
  LogOut, 
  Sparkles, 
  Clock, 
  Bell, 
  X, 
  Plus, 
  ChevronRight,
  Globe,
  MapPin,
  Menu
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();

  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comingSoonModal, setComingSoonModal] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const data = await recruiterService.getProfile();
        setRecruiterData(data);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  const sidebarNavItems = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, active: true },
    { label: 'My Profile', path: '/recruiter/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'My Company', path: '/recruiter/company', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Job Management', path: '/recruiter/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Create Job', path: '/recruiter/jobs/create', icon: <Plus className="w-4 h-4" /> },
    { label: 'Applicants', path: '/recruiter/applicants', icon: <Users className="w-4 h-4" /> },
    { label: 'Candidate Ranking', path: '/recruiter/rankings', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Analytics', icon: <PieChart className="w-4 h-4" />, comingSoon: true },
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

  const company = recruiterData?.company;
  const userName = user?.name || user?.full_name || 'Recruiter';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation (Responsive Desktop & Mobile Drawer) */}
      <aside className={`w-full md:w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0 ${mobileSidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">HireAI</h1>
                <span className="text-[10px] font-semibold text-indigo-400">Recruiter Portal</span>
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
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold'
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
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-indigo-400 font-mono">Recruiter Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-sm font-semibold text-slate-300 truncate">Recruiter Dashboard</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-medium hidden sm:inline-block">
              {company ? company.name : 'No Company Set'}
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

        {/* Workspace Body */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-950 p-8 border border-indigo-500/20 shadow-2xl">
            <div className="absolute inset-0 z-0 opacity-30">
              <img 
                src="./images/recruiter_talent_search.png" 
                alt="AI Recruiter Talent Sourcing Engine" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>HR Talent Acquisition Hub</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {userName}!
                </h1>
                <p className="text-sm text-slate-300 mt-2 max-w-xl">
                  Manage company profile details, talent acquisition pipeline, and applicant evaluation metrics.
                </p>
              </div>

              {company ? (
                <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Company Profile</p>
                    <p className="text-sm font-bold text-white mt-0.5">{company.name}</p>
                  </div>
                </div>
              ) : (
                <Link
                  to="/recruiter/company"
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Setup Company Profile
                </Link>
              )}
            </div>
          </div>

          {/* 4 Dashboard Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Company Profile */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-bold text-white mt-4 truncate">
                {company ? company.name : 'Not Configured'}
              </p>
              <p className="text-xs text-slate-400 mt-2 truncate">
                {company ? `${company.industry || 'Technology'} • ${company.location || 'Remote'}` : 'Create your company page'}
              </p>
              <Link to="/recruiter/company" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-4 inline-flex items-center gap-1">
                {company ? 'Manage Company' : 'Create Company'} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Active Jobs */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Jobs</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">0</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400">
                Coming Soon
              </span>
            </div>

            {/* Card 3: Total Applicants */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applicants</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">0</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400">
                Coming Soon
              </span>
            </div>

            {/* Card 4: Shortlisted Candidates */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortlisted</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mt-4">0</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400">
                Coming Soon
              </span>
            </div>

          </div>

          {/* Informational Feature Roadmap */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Recruiter Management Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Job Postings */}
              <button 
                onClick={() => navigate('/recruiter/jobs')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-indigo-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/recruiter_workspace_collaboration.png" alt="Job Posting Management" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300">Job Requisitions</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Publish job requisitions and configure required candidate skills.</p>
                </div>
              </button>

              {/* Card 2: Candidate Ranking */}
              <button 
                onClick={() => navigate('/recruiter/rankings')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-indigo-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/recruiter_talent_search.png" alt="Candidate Match Ranking" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300">AI Match Ranking</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Rank applicants automatically using TF-IDF and semantic AI match scores.</p>
                </div>
              </button>

              {/* Card 3: Recruitment Analytics */}
              <button 
                onClick={() => navigate('/recruiter/analytics')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-indigo-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/ai_analytics_dashboard.png" alt="Recruitment Analytics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300">Recruitment Analytics</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Track candidate conversion velocity and screening statistics.</p>
                </div>
              </button>

              {/* Card 4: Company Profile & Office */}
              <button 
                onClick={() => navigate('/recruiter/company')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-blue-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/company_office_building.png" alt="Company Workspace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-blue-300">Company Workspace</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Customize company branding, location, employee count, and story.</p>
                </div>
              </button>

              {/* Card 5: AI Match Sourcing Engine */}
              <button 
                onClick={() => navigate('/recruiter/applicants')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-purple-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/vibrant_ai_matching.png" alt="AI Match Sourcing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-purple-300">Applicant Pipeline</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Review incoming resume submissions, filter by score, and shortlist.</p>
                </div>
              </button>

              {/* Card 6: Talent Command Center */}
              <button 
                onClick={() => navigate('/recruiter/profile')}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-amber-500/40 transition-all group overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden relative">
                  <img src="./images/ai_command_center.jpg" alt="Talent Command Center" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono font-bold">Active</span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-amber-300">Recruiter Profile & Team</span>
                  <p className="text-xs text-slate-400 leading-relaxed">Configure recruiter profile credentials and team hiring permissions.</p>
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

            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{comingSoonModal}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Coming Soon. Available in the next development phase. Recruiter Profile and Company Management are active!
            </p>

            <button
              onClick={() => setComingSoonModal(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Close Notification
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterDashboard;
