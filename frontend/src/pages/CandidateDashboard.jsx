import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award, 
  Building2, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-grid-pattern pb-16">
      
      {/* Candidate Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.full_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{user?.full_name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Job Seeker Portal
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {user?.headline || "Software Engineer | Full Stack & AI Enthusiast"}
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 flex items-center gap-2 self-start md:self-auto"
            >
              <UserIcon className="w-4 h-4 text-purple-400" /> Edit Candidate Profile
            </Link>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Phase 1 Auth Status Pill */}
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Candidate Authentication Active</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
                JWT Session Valid
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Your candidate account profile is registered in MySQL and authenticated. Resume submission & AI match analysis will be enabled in Phase 2.
            </p>
          </div>
        </div>

        {/* Candidate Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400">Applications Submitted</span>
            <p className="text-2xl font-extrabold text-white mt-2 font-mono">4 Positions</p>
            <p className="text-[11px] text-emerald-400 mt-1">2 Under Active Review</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400">Profile Completeness</span>
            <p className="text-2xl font-extrabold text-white mt-2 font-mono">92% Complete</p>
            <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400">Average ATS Score</span>
            <p className="text-2xl font-extrabold text-white mt-2 font-mono">88 / 100</p>
            <p className="text-[11px] text-indigo-400 mt-1">High Compatibility Band</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Phase 2 Resume Upload Preview */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Resume & Skills Upload
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phase 2 module: Automated resume parsing engine extracts skills, experience, and project metrics.
              </p>
            </div>

            {/* Dropzone Placeholder */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 text-center hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">Upload PDF or DOCX Resume</p>
              <p className="text-xs text-slate-400 mt-1">Resume AI parser will process file in Phase 2</p>
              <button
                disabled
                className="mt-4 px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded-xl cursor-not-allowed"
              >
                Upload Disabled (Phase 1 Active)
              </button>
            </div>

            {/* Application History Shell */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Application History</h4>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Senior Software Engineer</p>
                      <p className="text-xs text-slate-400">Apex Global Technologies</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    Screening Pending (Phase 2)
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Account Profile Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-emerald-400" /> Account Summary
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">Name:</span>
                <span className="font-semibold text-white">{user?.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-white">{user?.phone || "Not specified"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Headline:</span>
                <span className="font-semibold text-slate-200">{user?.headline || "Job Seeker"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/profile"
                className="w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors block text-center"
              >
                Edit Account Details
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
