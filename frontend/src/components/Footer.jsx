import React from 'react';
import { Sparkles, Shield, Cpu, Database, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-800/80 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-mono">
                Hire<span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Intelligent AI Recruitment and Resume Screening System. Engineered as a high-performance final-year computer science project featuring FastAPI, React, Tailwind CSS, MySQL, and JWT Authentication.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Phase 1 Active
              </span>
              <span>•</span>
              <span>REST API v1.0</span>
              <span>•</span>
              <span>MySQL 8.0 Engine</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Tech Stack Spec</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-400"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Python 3.13 + FastAPI</li>
              <li className="flex items-center gap-2 text-slate-400"><Database className="w-3.5 h-3.5 text-cyan-400" /> MySQL + SQLAlchemy ORM</li>
              <li className="flex items-center gap-2 text-slate-400"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> React 18 + Vite + Tailwind</li>
              <li className="flex items-center gap-2 text-slate-400"><Lock className="w-3.5 h-3.5 text-emerald-400" /> JWT + Bcrypt Security</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Project Roadmap</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="text-indigo-400 font-semibold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Phase 1: Setup & Auth ✓</li>
              <li className="opacity-60">Phase 2: Resume Parser & AI AI Matching</li>
              <li className="opacity-60">Phase 3: Applicant Scoring Matrix</li>
              <li className="opacity-60">Phase 4: Analytics Dashboard</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 HireAI Project. Built for Engineering Final-Year Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">FastAPI REST Docs (/docs)</span>
            <span>•</span>
            <span className="hover:text-slate-300 font-mono">React + Vite SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
