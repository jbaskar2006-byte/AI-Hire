import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listJobs, updateJob, deleteJob } from '../../services/jobService';
import recruiterService from '../../services/recruiterService';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Building,
  Eye
} from 'lucide-react';

export const Jobs = () => {
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecruiterJobs = async () => {
    setLoading(true);
    try {
      const prof = await recruiterService.getProfile();
      setRecruiterProfile(prof);

      if (prof?.id) {
        const res = await listJobs({ recruiter_id: prof.id, size: 50 });
        setJobs(res.items || []);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
      showToast('Failed to load your posted jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleCloseJob = async (jobId) => {
    try {
      await updateJob(jobId, { status: 'closed' });
      showToast('Job status updated to closed', 'success');
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'closed' } : j));
    } catch (err) {
      showToast('Failed to close job', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    setDeleting(true);
    try {
      await deleteJob(jobId);
      showToast('Job posting deleted successfully', 'success');
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      showToast('Failed to delete job', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 p-8 border border-blue-500/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Recruiter Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Job Management
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Create, update, monitor, and manage active job listings and candidate applications.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading recruiter jobs...</p>
        </div>
      ) : !recruiterProfile?.company_id ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-amber-500/30 space-y-4">
          <Building className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Company Profile Required</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You must register your Company information before you can create and manage job postings.
          </p>
          <Link
            to="/recruiter/company"
            className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            Create Company Profile
          </Link>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Jobs Posted Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Get started by posting your first job opening to reach qualified software candidates.
          </p>
          <Link
            to="/recruiter/jobs/create"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            Post a Job Opening
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id}
              className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    job.status === 'active' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : job.status === 'draft'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    {job.status}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Applicants</span>
                    <strong className="text-sm font-bold text-blue-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      {job.applications_count || 0}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Created</span>
                    <strong className="text-xs font-semibold text-slate-300 block mt-1">
                      {new Date(job.created_at).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-2">
                <Link
                  to={`/recruiter/applicants?jobId=${job.id}`}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Applicants ({job.applications_count || 0})</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/recruiter/jobs/edit/${job.id}`}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {job.status === 'active' && (
                    <button
                      onClick={() => handleCloseJob(job.id)}
                      className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs rounded-xl transition-all"
                      title="Close job posting"
                    >
                      Close
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteModalId(job.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Delete Job Posting?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this job position? All candidate application records associated with this job will also be removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteModalId)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-500/20 transition-all"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Jobs;
