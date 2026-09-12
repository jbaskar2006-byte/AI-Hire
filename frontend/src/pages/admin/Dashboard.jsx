import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Building2, 
  Briefcase, 
  FileCheck2, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { getAdminStats } from '../../services/adminService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      const detail = err.response?.data?.detail || 'Failed to connect to Admin API.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users ?? 0,
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      description: 'Registered platform users'
    },
    {
      title: 'Total Candidates',
      value: stats?.total_candidates ?? 0,
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      description: 'Job seekers & applicants'
    },
    {
      title: 'Total Recruiters',
      value: stats?.total_recruiters ?? 0,
      icon: <Briefcase className="w-5 h-5 text-purple-400" />,
      bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      description: 'Hiring managers & talent heads'
    },
    {
      title: 'Total Companies',
      value: stats?.total_companies ?? 0,
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      description: 'Registered employer profiles'
    },
    {
      title: 'Active Jobs',
      value: stats?.active_jobs ?? 0,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      description: 'Open job requisitions'
    },
    {
      title: 'Total Applications',
      value: stats?.total_applications ?? 0,
      icon: <FileCheck2 className="w-5 h-5 text-teal-400" />,
      bg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      description: 'Submitted job applications'
    },
    {
      title: 'Resumes Processed',
      value: stats?.resumes_processed ?? 0,
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      description: 'Parsed by AI PDF engine'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-slate-950 p-8 border border-purple-500/20 shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-25">
            <img 
              src="/images/ai_command_center.jpg" 
              alt="AI Command Center" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4" /> HireAI System Administration
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Overview Dashboard</h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time platform statistics, user metrics, job requisitions, and analytics controls.
              </p>
            </div>

            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Metrics
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* 7 KPI Metric Cards Grid */}
        {loading ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
            Loading real-time system administration metrics...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {statCards.map((card, idx) => (
              <div 
                key={idx}
                className="p-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl hover:border-purple-500/40 transition-all duration-200 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2.5 rounded-2xl border ${card.bg}`}>
                    {card.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Management Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-white">Management Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-3xl text-left transition-all group space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300">User Management</h3>
                <p className="text-xs text-slate-400 mt-1">View candidates & recruiters, filter by role, search, and toggle active/inactive accounts.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/jobs')}
              className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-3xl text-left transition-all group space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-purple-300">Job Oversight</h3>
                <p className="text-xs text-slate-400 mt-1">Audit active job requisitions across companies and close expired or inappropriate postings.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-3xl text-left transition-all group space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300">Platform Analytics</h3>
                <p className="text-xs text-slate-400 mt-1">Interactive Recharts visual analytics covering applications, match scores, job types, and skills.</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Diagnostics Card */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            System Infrastructure Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-slate-400">Database Engine</span>
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> MySQL (hireai_db)
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-slate-400">API Server</span>
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> FastAPI v1.0.0
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-slate-400">AI Matching Engine</span>
              <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Scikit-learn TF-IDF
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-slate-400">PDF Parsing</span>
              <p className="font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> PyPDF2 Local Engine
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
