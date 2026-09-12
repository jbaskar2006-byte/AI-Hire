import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const featureCards = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      title: "AI Resume Analysis",
      description: "Extract candidate skills, experience metrics, and education details automatically with NLP parsing."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
      title: "Smart Candidate Matching",
      description: "Match candidate qualifications against job requirements using semantic vector scoring."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      title: "Candidate Ranking",
      description: "Rank candidates dynamically based on job relevancy, weighted skills, and experience fit."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Skill Gap Analysis",
      description: "Identify missing key skills and recommend training recommendations or candidate fit adjustments."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 min-h-screen text-slate-100">
      {/* Background glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Intelligent Recruitment Powered by AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          HireAI <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Intelligent Recruitment Powered by AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Find the right talent faster with intelligent recruitment technology.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Backend Server</p>
            <p className="text-lg font-bold text-white font-mono mt-1">FastAPI + Python</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Health Status OK
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Database Layer</p>
            <p className="text-lg font-bold text-white font-mono mt-1">MySQL Database</p>
            <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3" /> SQLAlchemy ORM
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Security</p>
            <p className="text-lg font-bold text-white font-mono mt-1">JWT + Bcrypt</p>
            <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Role Authorization
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Frontend Stack</p>
            <p className="text-lg font-bold text-white font-mono mt-1">React + Vite</p>
            <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tailwind CSS
            </p>
          </div>
        </div>

        {/* Hero Visual Showcase Frame */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-indigo-500/30 p-2 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-slate-900/80 shadow-2xl shadow-purple-500/20 group relative">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
            <img 
              src="/images/hero_ai_recruitment.png" 
              alt="AI Recruitment Command Dashboard"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold font-mono">
                  AI Screening Command Center
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Automated Resume Parsing & Candidate Ranking</h3>
              </div>
              <Link 
                to="/register"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition shrink-0 flex items-center gap-1.5"
              >
                <span>Try HireAI Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workspaces Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Enterprise Talent Solutions</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Designed For Modern Recruitment Teams</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Experience dedicated portals engineered for recruiters, job seekers, and system administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Recruiters */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group shadow-xl flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="/images/recruiter_talent_search.png" 
                alt="Recruiter Team Sourcing Engine"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold shadow-md">
                Recruiter Portal
              </span>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-white">Smart Applicant Screening</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post job requisitions, view automated candidate ranking, compare required skill matrix fit, and streamline your ATS pipeline.
              </p>
            </div>
            <div className="p-6 pt-0">
              <Link 
                to="/register?role=recruiter"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Explore Recruiter Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Candidates */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group shadow-xl flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="/images/interview_practice_bot.png" 
                alt="AI Interview & Career Assistant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow-md">
                Job Seeker Portal
              </span>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-white">Career & Interview Prep</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload PDF resumes for NLP parsing, discover skill coverage gaps, receive AI recommendations, and practice customized interview questions.
              </p>
            </div>
            <div className="p-6 pt-0">
              <Link 
                to="/register?role=candidate"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Explore Candidate Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: AI Analytics & Command */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group shadow-xl flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="/images/ai_analytics_dashboard.png" 
                alt="AI Analytics Command Center"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-600/90 text-white text-[11px] font-bold shadow-md">
                Admin & Analytics
              </span>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-white">Real-Time Metrics & Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor system KPIs, analyze application volume per month with Recharts visual graphs, manage accounts, and audit active jobs.
              </p>
            </div>
            <div className="p-6 pt-0">
              <Link 
                to="/login"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Access System Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Image Feature Gallery Grid */}
        <div className="mt-12 pt-12 border-t border-slate-800/60 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Interactive AI Modules Gallery</h3>
            <p className="text-xs text-slate-400 mt-1">Explore our vibrant suite of AI recruitment engines</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800 group">
              <img src="/images/resume_builder_ai.png" alt="AI Resume Parser" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md">Resume Parser</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800 group">
              <img src="/images/skill_gap_analysis.png" alt="Skill Gap Analysis" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md">Skill Gap Radar</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800 group">
              <img src="/images/recommendations_job_feed.png" alt="Job Feed Match" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md">AI Matching</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800 group">
              <img src="/images/company_office_building.png" alt="Company Workspace" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md">Employer Hub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Next-Generation AI Recruitment Features</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Informational overview of features planned for full deployment in upcoming system phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, index) => (
            <div 
              key={index}
              className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Feature Preview</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Phase 9</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
