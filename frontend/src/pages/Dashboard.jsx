import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Briefcase, 
  UserCheck, 
  Sparkles, 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  TrendingUp,
  X
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [comingSoonFeature, setComingSoonFeature] = useState(null);

  const handleSidebarClick = (itemKey, itemName) => {
    if (itemKey === 'logout') {
      logout();
      return;
    }
    if (itemKey === 'dashboard') {
      setActiveTab('dashboard');
      return;
    }
    // For Profile & Settings and other items, show Coming Soon message
    setActiveTab(itemKey);
    setComingSoonFeature(itemName);
  };

  const closeComingSoon = () => {
    setComingSoonFeature(null);
    setActiveTab('dashboard');
  };

  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Candidate';
  const userName = user?.name || user?.full_name || 'User';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">HireAI</h1>
                <span className="text-[10px] font-semibold text-indigo-400">Recruitment Portal</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => handleSidebarClick('dashboard', 'Dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleSidebarClick('profile', 'Profile Management')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">Soon</span>
            </button>

            <button
              onClick={() => handleSidebarClick('settings', 'System Settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">Soon</span>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() => handleSidebarClick('logout', 'Logout')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 m-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-300">HireAI SaaS Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-medium">
              Phase 1 Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => showToast('No new notifications', 'info')}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5" />
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

        {/* Dashboard Body */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-8 border border-indigo-500/20 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Authenticated Session</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {userName}!
                </h1>
                <p className="text-sm text-slate-300 mt-2 max-w-xl">
                  You are logged into HireAI Recruitment Platform with role authorization.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  {user?.role === 'recruiter' ? <Briefcase className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Assigned Role</p>
                  <p className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>Role: {userRole}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Authentication Token</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active JWT</span>
              </div>
              <p className="text-xl font-mono font-bold text-white mt-3 truncate">
                Bearer Secured
              </p>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 256-bit HS256 Standard
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Email</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Verified</span>
              </div>
              <p className="text-lg font-mono font-bold text-white mt-3 truncate">
                {user?.email}
              </p>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> MySQL User ID #{user?.id}
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Status</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Phase 1</span>
              </div>
              <p className="text-lg font-bold text-white mt-3">
                Foundation Ready
              </p>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> AI Modules Coming in Phase 2
              </p>
            </div>
          </div>

          {/* Informational Feature Modules */}
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Recruitment Workspace Feature Roadmap
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button 
                onClick={() => setComingSoonFeature('AI Resume Screening')}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300">AI Resume Screening</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Coming Soon</span>
                </div>
                <p className="text-xs text-slate-400">Automated NLP candidate parsing and skill indexing module.</p>
              </button>

              <button 
                onClick={() => setComingSoonFeature('Candidate Ranking Matrix')}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300">Candidate Ranking Matrix</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Coming Soon</span>
                </div>
                <p className="text-xs text-slate-400">Dynamic weighted matching scores for applicant pools.</p>
              </button>

            </div>
          </div>

        </main>
      </div>

      {/* Coming Soon Modal */}
      {comingSoonFeature && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in">
            <button
              onClick={closeComingSoon}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{comingSoonFeature}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              This module will be fully implemented in upcoming project phases. The Phase 1 foundation, user registration, JWT security, and MySQL database connection are fully operational.
            </p>

            <button
              onClick={closeComingSoon}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Return to Workspace
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
