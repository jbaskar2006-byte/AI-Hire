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
  UserCheck,
  Building
} from 'lucide-react';

export const BrowseJobs = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
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
      const params = {
        page,
        size: 9,
        status: 'active'
      };
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
    setPage(1);
    setTimeout(fetchJobs, 50);
  };

  const handleQuickApply = async (e, jobId) => {
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

    setApplyingId(jobId);
    try {
      await submitApplication(jobId);
      showToast('Application submitted successfully!', 'success');
      // Update local status
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, has_applied: true } : j));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 p-8 border border-emerald-500/20 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="/images/team_collaboration.jpg" 
            alt="Career Opportunities & Hiring Teams" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Job Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Career Opportunities
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Discover active job openings aligned with your skills and career aspirations. Filter by tech stack, location, or experience level.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search title, description, company..."
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
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
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
              placeholder="Required Skill (e.g. React, Python)"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

        </div>

        {/* Second Filter Row & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Max Min-Exp:</span>
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
              <span>Filter Jobs ({totalJobs})</span>
            </button>
          </div>
        </div>
      </form>

      {/* Main Jobs Listing */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading active job listings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Jobs Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            There are currently no job openings matching your search criteria. Try relaxing your filters or resetting search parameters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const reqSkills = job.skills?.filter(s => s.skill_type === 'required') || [];
              const prefSkills = job.skills?.filter(s => s.skill_type === 'preferred') || [];
              
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
                            {job.company?.name || 'Company'}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                        {job.job_type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
                      {job.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {/* Key Attributes Pills */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-800/80 mb-4 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">
                          {job.salary_min && job.salary_max
                            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                            : 'Salary Negotiable'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{job.min_experience}+ Yrs Exp</span>
                      </div>
                    </div>

                    {/* Skills Pills */}
                    <div className="space-y-2 mb-6">
                      {reqSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {reqSkills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                              {s.skill_name}
                            </span>
                          ))}
                          {reqSkills.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                              +{reqSkills.length - 3} req
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Link
                      to={`/candidate/jobs/${job.id}`}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {job.has_applied ? (
                      <span className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleQuickApply(e, job.id)}
                        disabled={applyingId === job.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {applyingId === job.id ? (
                          <span>Applying...</span>
                        ) : (
                          <>
                            <span>Apply Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default BrowseJobs;
