import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listJobs } from '../../services/jobService';
import { applyForJob as submitApplication } from '../../services/applicationService';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Code, 
  Filter, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Building,
  Send,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

export const BrowseJobs = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
  // Interactive Modal State for Applying
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  
  // Category Pill Filters
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Internship' | 'Full-Time' | 'Remote' | 'Chennai'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minExpFilter, setMinExpFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12, status: 'active' };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (locationFilter.trim()) params.location = locationFilter.trim();
      if (jobTypeFilter) params.job_type = jobTypeFilter;
      if (skillFilter.trim()) params.skill = skillFilter.trim();
      if (minExpFilter !== '') params.min_experience = parseInt(minExpFilter, 10);

      const res = await listJobs(params);
      setJobs(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalJobs(res.total || 0);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      showToast('Failed to load job listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSkillFilter('');
    setMinExpFilter('');
    setActiveTab('All');
    setPage(1);
    setTimeout(fetchJobs, 50);
  };

  const openApplyModal = (e, job) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      showToast('Only candidate accounts can apply for jobs', 'error');
      return;
    }
    setApplyModalJob(job);
    setCoverNote(`I am excited to apply for the ${job.title} position at ${job.company_name}. My technical stack and background align strongly with your requisition requirements.`);
  };

  const handleConfirmApply = async () => {
    if (!applyModalJob) return;
    const jobId = applyModalJob.id;
    setApplyingId(jobId);
    try {
      await submitApplication(jobId);
      showToast(`Application for '${applyModalJob.title}' submitted successfully!`, 'success');
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, has_applied: true } : j));
      setApplyModalJob(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setApplyingId(null);
    }
  };

  // Filter jobs by Pill Category
  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'Internship') return job.job_type === 'Internship';
    if (activeTab === 'Full-Time') return job.job_type === 'Full-Time';
    if (activeTab === 'Remote') return job.location.toLowerCase().includes('remote');
    if (activeTab === 'Chennai') return job.location.toLowerCase().includes('chennai');
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 p-8 border border-emerald-500/20 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="./images/team_collaboration.jpg" 
            alt="Career Opportunities & Hiring Teams" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Career & Internship Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Opportunities ({jobs.length} Active Positions)
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Discover active job and internship openings matched specifically to your skill matrix. Filter by tech stack, location, or requisition type.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { label: 'All Positions', tab: 'All' },
          { label: 'Internships', tab: 'Internship' },
          { label: 'Full-Time Roles', tab: 'Full-Time' },
          { label: 'Remote Opportunities', tab: 'Remote' },
          { label: 'Chennai / Hybrid', tab: 'Chennai' }
        ].map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isActive 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search title, tech stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Location (e.g. Chennai, Remote)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Job Type */}
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <Code className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Required Skill (e.g. Python, React)"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

        </div>

        {/* Second Filter Row & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Max Exp Years:</span>
            <input 
              type="number"
              min="0"
              placeholder="Years"
              value={minExpFilter}
              onChange={(e) => setMinExpFilter(e.target.value)}
              className="w-24 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters ({filteredJobs.length})</span>
            </button>
          </div>
        </div>
      </form>

      {/* Main Jobs Listing */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading active job and internship positions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            There are currently no job openings matching your search criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-all"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const reqSkills = job.skills?.filter(s => s.skill_type === 'required') || [];
              
              return (
                <div 
                  key={job.id}
                  className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Header: Company & Job Type */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                          {job.company?.name ? job.company.name.charAt(0).toUpperCase() : <Building className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 truncate max-w-[160px]">
                            {job.company_name || job.company?.name || 'Company'}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        job.job_type === 'Internship' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {job.job_type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
                      {job.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-800/80 mb-4 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{job.salary_range || 'Negotiable'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{job.min_experience > 0 ? `${job.min_experience}+ Yrs Exp` : 'Fresher / Intern'}</span>
                      </div>
                    </div>

                    {/* Skills Pills */}
                    <div className="space-y-2 mb-6">
                      {reqSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {reqSkills.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                              {s.skill_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Link
                      to={`/candidate/jobs/${job.id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1"
                    >
                      <span>View Specs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {job.has_applied ? (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={(e) => openApplyModal(e, job)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Interactive Quick Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Submit Application</h3>
                <p className="text-xs text-slate-400">{applyModalJob.title} • {applyModalJob.company_name}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>Auto-Attached Resume Profile:</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <p className="text-xs text-slate-400">
                Your extracted skills (*Python, React, Node, MySQL, REST API*) will be evaluated automatically by recruiter scoring algorithms.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Cover Note (Optional):
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                disabled={applyingId === applyModalJob.id}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {applyingId === applyModalJob.id ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Confirm & Apply
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BrowseJobs;
