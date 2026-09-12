import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import recruiterService from '../../services/recruiterService';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Briefcase, 
  Save, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Building2
} from 'lucide-react';

export const RecruiterProfile = () => {
  const { user, showToast } = useAuth();

  const [formData, setFormData] = useState({
    phone: '',
    designation: '',
  });

  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await recruiterService.getProfile();
        setFormData({
          phone: data.phone || '',
          designation: data.designation || '',
        });
        setCompanyInfo(data.company || null);
      } catch (err) {
        console.error('Failed to load recruiter profile:', err);
        setErrorMsg('Failed to load profile from server.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await recruiterService.updateProfile(formData);
      setSuccessMsg('Recruiter Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update recruiter profile.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading Recruiter Profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-indigo-400" /> Recruiter Profile Settings
          </h1>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
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
          
          {/* User Account Info Section (Read-only) */}
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

          {/* Recruiter Details Section */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Recruiter Designation & Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Designation / Role Title</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Talent Acquisition Manager"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 234-5678"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Company Link Preview */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Associated Company</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {companyInfo ? companyInfo.name : 'No Company Profile Created'}
                </p>
              </div>
            </div>

            <Link
              to="/recruiter/company"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-xs rounded-xl transition-all"
            >
              {companyInfo ? 'Edit Company' : 'Create Company'}
            </Link>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Details
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RecruiterProfile;
