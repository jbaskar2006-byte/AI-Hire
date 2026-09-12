import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  FileCheck2,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-grid-pattern min-h-screen">
      
      {/* Glow Effects Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        
        {/* Phase Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Final Year Engineering Project • Phase 1 Core Setup & Auth Active</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Intelligent AI Recruitment & <br />
          <span className="gradient-text">Resume Screening System</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Accelerating hiring decisions with multi-role candidate evaluation, Python FastAPI microservices, and secure JWT-encrypted user access.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Enter System Workspace <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" /> 1-Click Demo Login
              </Link>
            </>
          )}
        </div>

        {/* Key Feature Stats Pills */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Backend Server</p>
            <p className="text-lg font-bold text-white font-mono mt-1">FastAPI + Uvicorn</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> REST API v1
            </p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Database Layer</p>
            <p className="text-lg font-bold text-white font-mono mt-1">MySQL 8.0</p>
            <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3" /> SQLAlchemy ORM
            </p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Security Standard</p>
            <p className="text-lg font-bold text-white font-mono mt-1">JWT + Bcrypt</p>
            <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit Enforced
            </p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">UI Architecture</p>
            <p className="text-lg font-bold text-white font-mono mt-1">React 18 + Vite</p>
            <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tailwind CSS
            </p>
          </div>
        </div>

      </section>

      {/* Role Selection Breakdown Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Multi-Role System Architecture</h2>
          <p className="text-slate-400 text-sm mt-2">HireAI delivers dedicated workflows tailored for Recruiters and Job Seekers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Recruiter Card */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Role Option 1
            </span>
            <h3 className="text-xl font-bold text-white mt-4 mb-2">Recruiter / HR Manager</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowers HR teams to publish job descriptions, manage screening pipelines, inspect AI match scores, and shortlist top talent efficiently.
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Multi-candidate pipeline dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> AI Resume parsing & skill extraction (Phase 2)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Instant applicant ranking matrix
              </li>
            </ul>
            <div className="mt-8">
              <Link
                to="/register?role=recruiter"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                Register as Recruiter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Candidate Card */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Role Option 2
            </span>
            <h3 className="text-xl font-bold text-white mt-4 mb-2">Candidate / Job Seeker</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Allows applicants to build dynamic engineering profiles, upload resumes for automated analysis, and track application status.
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Candidate profile & portfolio manager
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automated resume ATS formatting feedback
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time application status tracker
              </li>
            </ul>
            <div className="mt-8">
              <Link
                to="/register?role=candidate"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Register as Job Seeker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Technology & Architecture Spec Section */}
      <section id="tech-specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">System Architecture</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Built with Industry Standard Tech Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">FastAPI + Uvicorn</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Asynchronous Python web framework delivering sub-millisecond response times, OpenAPI documentation, and Pydantic validation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">MySQL + SQLAlchemy</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Relational data storage using SQLAlchemy ORM for clean entity mappings, indexing, and persistent user credentials.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">JWT + Bcrypt Auth</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Stateless security tokens with 12-round bcrypt password hashing protecting all endpoints and user workspace sessions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
