import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createJob } from '../../services/jobService';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Code, 
  Plus, 
  X, 
  ArrowLeft, 
  Save, 
  Send, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CreateJob = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full Time',
    min_experience: 0,
    salary_min: '',
    salary_max: '',
    deadline: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState('required');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (skills.some(s => s.skill_name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast('Skill already added', 'info');
      return;
    }

    setSkills(prev => [
      ...prev,
      { skill_name: newSkillName.trim(), skill_type: newSkillType }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove) => {
    setSkills(prev => prev.filter(s => s.skill_name !== skillNameToRemove));
  };

  const handleSubmit = async (e, targetStatus) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      showToast('Please fill in all required fields (Title, Location, Description)', 'error');
      return;
    }

    if (formData.salary_min && formData.salary_max) {
      if (parseFloat(formData.salary_max) < parseFloat(formData.salary_min)) {
        showToast('Maximum salary cannot be less than minimum salary', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        job_type: formData.job_type,
        min_experience: parseInt(formData.min_experience, 10) || 0,
        salary_min: formData.salary_min !== '' ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max !== '' ? parseFloat(formData.salary_max) : null,
        deadline: formData.deadline ? formData.deadline : null,
        status: targetStatus,
        skills: skills
      };

      await createJob(payload);
      showToast(`Job ${targetStatus === 'active' ? 'published' : 'saved as draft'} successfully!`, 'success');
      navigate('/recruiter/jobs');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create job posting';
      showToast(msg, 'error');
    } flex: {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter/jobs"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 p-8 border border-blue-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Job Creation Wizard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Post a New Career Opportunity
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Define job specifications, salary ranges, location requirements, and required skills for candidate screening.
          </p>
        </div>
      </div>

      {/* Main Job Form */}
      <form onSubmit={(e) => handleSubmit(e, 'active')} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl max-w-4xl mx-auto">
        
        {/* Basic Details Section */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Basic Job Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Job Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <input 
                type="text"
                name="title"
                required
                placeholder="e.g. Senior Full Stack Engineer (React & Python)"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Location <span className="text-rose-400">*</span>
              </label>
              <input 
                type="text"
                name="location"
                required
                placeholder="e.g. Chennai, TN or Remote"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Job Type <span className="text-rose-400">*</span>
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Experience & Deadline */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Minimum Experience (Years)
              </label>
              <input 
                type="number"
                name="min_experience"
                min="0"
                value={formData.min_experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Application Deadline
              </label>
              <input 
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Minimum Salary ($)
              </label>
              <input 
                type="number"
                name="salary_min"
                min="0"
                placeholder="e.g. 80000"
                value={formData.salary_min}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Maximum Salary ($)
              </label>
              <input 
                type="number"
                name="salary_max"
                min="0"
                placeholder="e.g. 120000"
                value={formData.salary_max}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Job Description & Overview <span className="text-rose-400">*</span>
              </label>
              <textarea 
                name="description"
                rows={6}
                required
                placeholder="Describe role responsibilities, key project scope, team environment..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Dynamic Skills Section */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            Job Skills Matrix
          </h3>

          {/* Add Skill Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              placeholder="Skill Name (e.g. FastAPI, PostgreSQL, Docker)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <select
              value={newSkillType}
              onChange={(e) => setNewSkillType(e.target.value)}
              className="px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="required">Required</option>
              <option value="preferred">Preferred</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Skills Display List */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    skill.skill_type === 'required'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  <span>{skill.skill_name}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-950/60 opacity-80 font-mono">
                    {skill.skill_type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.skill_name)}
                    className="hover:text-rose-400 transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-xs text-slate-500 italic">No skills added yet. Add key skills for accurate resume matching.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save as Draft</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Job Opening'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default CreateJob;
