import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DemoLoginBadges } from '../components/DemoLoginBadges';

export const LoginPage = () => {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoSelect = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    const result = await login(demoEmail, demoPassword);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-grid-pattern relative">
      
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Visual Showcase Panel */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl min-h-[540px]">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="/images/team_collaboration.jpg" 
              alt="Recruitment Team Collaboration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Talent Portal
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Intelligent Automated Screening & Candidate Matching
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Empower your recruitment workflow with natural language resume parsing, candidate scoring, and visual analytics.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="font-bold text-white">HireAI Enterprise Platform</p>
              <p className="text-[11px] text-indigo-400">FastAPI • React • MySQL • Recharts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          
          {/* Header Branding */}
          <div className="text-center lg:text-left mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to HireAI</h1>
            <p className="text-sm text-slate-400 mt-1">Access your recruitment or candidate portal</p>
          </div>

          {/* Main Form Card */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            
            {authError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium leading-relaxed">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="recruiter@hireai.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Login Badges */}
            <DemoLoginBadges onSelect={handleDemoSelect} />

            {/* Switch to Register */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                Register now
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
