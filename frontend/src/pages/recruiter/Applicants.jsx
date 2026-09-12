import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listJobs } from '../../services/jobService';
import { getJobApplications, updateApplicationStatus } from '../../services/applicationService';
import recruiterService from '../../services/recruiterService';
import { 
  Users, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Globe, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';

export const Applicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId');

  const { showToast } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || '');
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      setLoadingJobs(true);
      try {
        const prof = await recruiterService.getProfile();
        if (prof?.id) {
          const res = await listJobs({ recruiter_id: prof.id, size: 100 });
          const items = res.items || [];
          setJobs(items);

          if (!selectedJobId && items.length > 0) {
            setSelectedJobId(items[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to load recruiter jobs:', err);
        showToast('Failed to load your jobs list', 'error');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchRecruiterJobs();
  }, []);

  useEffect(() => {
    const fetchApps = async () => {
      if (!selectedJobId) {
        setApplications([]);
        return;
      }

      setLoadingApps(true);
      try {
        const data = await getJobApplications(selectedJobId);
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to fetch job applications:', err);
        showToast('Failed to load applicant records', 'error');
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, [selectedJobId]);

  const handleJobSelectChange = (e) => {
    const jId = e.target.value;
    setSelectedJobId(jId);
    setSearchParams(jId ? { jobId: jId } : {});
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatusId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      showToast(`Application status updated to ${newStatus}`, 'success');
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: updated.status } : a));
    } catch (err) {
      showToast('Failed to update application status', 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const statusOptions = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Rejected',
    'Selected'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'Under Review':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'Shortlisted':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
      case 'Interview':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300';
      case 'Rejected':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
      case 'Selected':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const selectedJob = jobs.find(j => j.id.toString() === selectedJobId?.toString());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 p-8 border border-blue-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Applicant Screening Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Candidate Applicants
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Review applicant profiles, education, experience, and update application evaluation status.
          </p>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-300 whitespace-nowrap">Select Job:</label>
          {loadingJobs ? (
            <span className="text-xs text-slate-500">Loading jobs list...</span>
          ) : (
            <select
              value={selectedJobId}
              onChange={handleJobSelectChange}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {jobs.length === 0 ? (
                <option value="">No posted jobs</option>
              ) : (
                jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.applications_count || 0} applicants)
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {selectedJob && (
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>Location: <strong className="text-white">{selectedJob.location}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-400 capitalize">{selectedJob.status}</strong></span>
          </div>
        )}
      </div>

      {/* Main Applicants List */}
      {loadingApps ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading candidate applicants...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Applicants Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {selectedJobId 
              ? "There are currently no candidates who have applied for this specific job position."
              : "Please select a job opening from the dropdown above to view applicant profiles."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => {
              const cand = app.candidate;

              return (
                <div 
                  key={app.id}
                  className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg"
                >
                  {/* Candidate Overview */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                          {cand?.name ? cand.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {cand?.name || 'Candidate Name'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-blue-400" />
                              {cand?.email}
                            </span>
                            {cand?.phone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                  {cand.phone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Date */}
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Qualifications Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 font-medium block">Education</span>
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-1 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          {cand?.education || 'Not specified'}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 font-medium block">Experience</span>
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          {cand?.experience_years || 0} Years
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 font-medium block">Location</span>
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {cand?.location || 'Not specified'}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Skills Pills */}
                    {cand?.skills && cand.skills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-400 font-semibold block mb-1">Technical Stack:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.skills.map((sk, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-2 text-xs">
                      {cand?.linkedin_url && (
                        <a
                          href={cand.linkedin_url.startsWith('http') ? cand.linkedin_url : `https://${cand.linkedin_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {cand?.github_url && (
                        <a
                          href={cand.github_url.startsWith('http') ? cand.github_url : `https://${cand.github_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {cand?.portfolio_url && (
                        <a
                          href={cand.portfolio_url.startsWith('http') ? cand.portfolio_url : `https://${cand.portfolio_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Portfolio</span>
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Status Dropdown */}
                  <div className="lg:w-56 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-3 shrink-0">
                    <span className="text-xs font-bold text-slate-400">Application Status</span>
                    
                    <div className="space-y-2">
                      <span className={`inline-block w-full text-center px-3 py-1.5 rounded-xl border text-xs font-extrabold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>

                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingStatusId === app.id}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {updatingStatusId === app.id && (
                      <span className="text-[10px] text-blue-400 animate-pulse text-center">Updating status...</span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default Applicants;
