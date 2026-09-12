import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Lock, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, updateProfile, showToast } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      full_name: fullName,
      company,
      headline,
      phone
    });
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to change password. Verify your current password.';
      setPasswordError(msg);
      showToast(msg, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.full_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Account Settings & Profile</h1>
            <p className="text-sm text-slate-400">Manage your credentials, role settings, and personal details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Edit Profile Form */}
          <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-400" /> Edit Profile Information
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address (Verified)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800/80 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Company / Org */}
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
                    placeholder="e.g. Apex Tech Corp"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Professional Headline / Bio
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Talent Lead | AI Specialist"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile Details
                  </>
                )}
              </button>

            </form>

            {/* Password Security Form */}
            <div className="pt-8 border-t border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-400" /> Security & Password
              </h3>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Update Password
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Side Info Box */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Security Status
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Auth Method</span>
                  <span className="font-bold text-white">JWT + Bcrypt</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Account Role</span>
                  <span className="font-bold text-indigo-400 uppercase">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Account ID</span>
                  <span className="font-mono text-emerald-400">#{user?.id}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Phase 1 Specs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All account changes are synchronized directly with your MySQL database record using FastAPI REST calls.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
