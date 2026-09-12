import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import candidateService from '../../services/candidateService';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Globe, 
  Save, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const CandidateProfile = () => {
  const { user, showToast } = useAuth();

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    education: '',
    experience_years: 0,
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });

  const [completionScore, setCompletionScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await candidateService.getProfile();
        setFormData({
          phone: data.phone || '',
          location: data.location || '',
          education: data.education || '',
          experience_years: data.experience_years || 0,
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          portfolio_url: data.portfolio_url || '',
        });
        setCompletionScore(data.profile_completion || 0);
      } catch (err) {
        console.error('Failed to load candidate profile:', err);
        setErrorMsg('Failed to load profile details from server.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience_years' ? parseInt(value) || 0 : value,
    }));
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updatedProfile = await candidateService.updateProfile(formData);
      setCompletionScore(updatedProfile.profile_completion);
      setSuccessMsg('Candidate Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update candidate profile.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Loading Candidate Profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <Link to="/candidate/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-emerald-400" /> Candidate Profile Settings
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
              {completionScore}%
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Profile Completion</p>
              <div className="w-28 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${completionScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User Account Info Section (Read-only from User table) */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> User Account Details (Read-only)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={user?.name || user?.full_name || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Profile Details Section */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Candidate Resume & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2831"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Current Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Highest Education</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="B.S. Computer Science, Stanford University"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Years of Experience</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Social Links & Web Portfolios Section */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Portfolio & Social Profiles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">LinkedIn URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">GitHub URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Portfolio Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.dev"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Candidate Profile
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CandidateProfile;
