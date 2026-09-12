import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building2, 
  FileText, 
  ArrowRight, 
  Loader2, 
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'candidate';

  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password Strength Indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, text: 'Moderate', color: 'bg-amber-500' };
    return { score, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setSubmitting(true);
    const result = await register({
      name: fullName,
      full_name: fullName,
      email,
      password,
      role,
      company: role === 'recruiter' ? company : undefined,
      headline: headline || (role === 'recruiter' ? 'HR Recruiter' : 'Engineering Applicant')
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-grid-pattern relative">
      
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Visual Showcase Panel */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src={role === 'recruiter' ? '/images/team_collaboration.jpg' : '/images/tech_workspace.jpg'} 
              alt="HireAI Portal Visual" 
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" /> {role === 'recruiter' ? 'Enterprise HR Portal' : 'AI Job Seeker Workspace'}
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              {role === 'recruiter' 
                ? 'Empower Your Talent Acquisition Team' 
                : 'Accelerate Your Software Career with AI'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {role === 'recruiter'
                ? 'Automate resume screening, calculate TF-IDF candidate match scores, and streamline your recruitment pipeline.'
                : 'Upload PDF resumes for NLP skill extraction, receive job recommendations, and practice customized AI interview questions.'}
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="font-bold text-white">HireAI Intelligent Platform</p>
              <p className="text-[11px] text-purple-400">AI Screening • NLP Parser • Matching Engine</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          
          <div className="text-center lg:text-left mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-4 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create your HireAI Account</h1>
            <p className="text-sm text-slate-400 mt-1">Select your account role to get started</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            
            {/* Role Selector Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Recruiter Selector */}
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    role === 'recruiter'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {role === 'recruiter' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <Briefcase className={`w-6 h-6 mb-2 ${role === 'recruiter' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <p className="text-sm font-bold text-white">Recruiter / HR</p>
                  <p className="text-[11px] text-slate-400 mt-1">Post jobs & screen candidates</p>
                </button>

                {/* Candidate Selector */}
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    role === 'candidate'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {role === 'candidate' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <UserCheck className={`w-6 h-6 mb-2 ${role === 'candidate' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <p className="text-sm font-bold text-white">Job Seeker</p>
                  <p className="text-[11px] text-slate-400 mt-1">Upload resumes & track applications</p>
                </button>

              </div>
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Work or Personal Email
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
                    placeholder="alex@hireai.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Password with Strength Meter */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-12 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Strength: <strong className="text-white">{strength.text}</strong></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full transition-all duration-300 ${strength.score > 0 ? strength.color : 'opacity-0'} w-1/3 rounded-full`} />
                      <div className={`h-full transition-all duration-300 ${strength.score > 2 ? strength.color : 'opacity-0'} w-1/3 rounded-full`} />
                      <div className={`h-full transition-all duration-300 ${strength.score > 4 ? strength.color : 'opacity-0'} w-1/3 rounded-full`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Role Specific Additional Field */}
              {role === 'recruiter' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Global Technologies"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Professional Headline / Role Title
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Full Stack Developer | React & Python"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Already registered? &nbsp;
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
                Sign in to your account
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
