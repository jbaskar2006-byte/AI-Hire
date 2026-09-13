import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, withdrawApplication } from '../../services/applicationService';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trash2, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const MyApplications = () => {
  const { showToast } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [confirmModalId, setConfirmModalId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
      showToast('Failed to load your applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    setWithdrawingId(applicationId);
    try {
      await withdrawApplication(applicationId);
      showToast('Application withdrawn successfully', 'success');
      setApplications(prev => prev.filter(a => a.id !== applicationId));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to withdraw application';
      showToast(msg, 'error');
    } finally {
      setWithdrawingId(null);
      setConfirmModalId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-xs">Applied</span>;
      case 'Under Review':
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">Under Review</span>;
      case 'Shortlisted':
        return <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs">Shortlisted</span>;
      case 'Interview':
        return <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs">Interview</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs">Rejected</span>;
      case 'Selected':
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs">Selected</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 p-8 border border-emerald-500/20 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="./images/ai_command_center.jpg" 
            alt="Application Tracking Center" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Application Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Submitted Applications
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Track real-time candidate application status, view job specifications, or withdraw applications.
          </p>
        </div>
      </div>

      {/* Main Applications Table / Card Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Loading your job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't submitted any job applications yet. Browse open career opportunities and submit your profile today.
          </p>
          <Link
            to="/candidate/jobs"
            className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Browse Active Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => {
              const job = app.job;
              return (
                <div 
                  key={app.id}
                  className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-base flex items-center justify-center shrink-0">
                        {job?.company?.name ? job.company.name.charAt(0).toUpperCase() : <Building className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white hover:text-emerald-300 transition-colors">
                          {job?.title || 'Job Title'}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                          <span>{job?.company?.name || 'Company'}</span>
                          <span>•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {job?.location}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                        Type: {job?.job_type || 'Full Time'}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      {job && (
                        <Link
                          to={`/candidate/jobs/${job.id}`}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Job</span>
                        </Link>
                      )}

                      <button
                        onClick={() => setConfirmModalId(app.id)}
                        disabled={withdrawingId === app.id}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1"
                        title="Withdraw application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Withdraw Application?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to withdraw your application? This action will remove your application record from the recruiter's system.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWithdraw(confirmModalId)}
                disabled={withdrawingId === confirmModalId}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-500/20 transition-all"
              >
                {withdrawingId === confirmModalId ? 'Withdrawing...' : 'Confirm Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyApplications;
