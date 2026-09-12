import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import recruiterService from '../../services/recruiterService';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase, 
  FileText, 
  Save, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const CompanyPage = () => {
  const { showToast } = useAuth();

  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    company_size: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await recruiterService.getCompany();
        if (data) {
          setCompany(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            website: data.website || '',
            location: data.location || '',
            industry: data.industry || '',
            company_size: data.company_size || '',
          });
        }
      } catch (err) {
        console.error('Failed to load company profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (company) {
        const updated = await recruiterService.updateCompany(formData);
        setCompany(updated);
        setSuccessMsg('Company details updated successfully!');
        showToast('Company details updated successfully!', 'success');
      } else {
        const created = await recruiterService.createCompany(formData);
        setCompany(created);
        setSuccessMsg('Company profile created successfully!');
        showToast('Company profile created successfully!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save company profile.';
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
        <span>Loading Company Profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-400" /> Company Profile Management
            </h1>
          </div>

          {company && (
            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold font-mono">
              Company ID #{company.id}
            </div>
          )}
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
          
          {/* Basic Company Info */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> General Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Company Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Apex Global Technologies"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Company Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a brief overview of your company, product offerings, and mission statement..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Industry & Location */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Industry & Operational Scope
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Industry Sector</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Information Technology & Software"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Company Size</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10 employees">1-10 employees (Startup)</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Headquarters Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Austin, TX / Remote"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Official Website URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://apexglobal.tech"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Company...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {company ? 'Update Company Details' : 'Create Company Profile'}
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CompanyPage;
