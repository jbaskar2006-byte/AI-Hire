import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  MapPin, 
  Clock, 
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { getAdminJobs, updateJobStatus } from '../../services/adminService';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobsList();
  }, [statusFilter]);

  const fetchJobsList = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAdminJobs(search, statusFilter);
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
      const detail = err.response?.data?.detail || 'Failed to fetch job list.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobsList();
  };

  const handleToggleJobStatus = async (job, newStatus) => {
    setUpdatingId(job.id);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const updated = await updateJobStatus(job.id, newStatus);
      setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
      setSuccessMessage(`Job '${updated.title}' status updated to ${newStatus.toUpperCase()}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update job status:', err);
      const detail = err.response?.data?.detail || 'Failed to update job status.';
      setErrorMessage(detail);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-widest mb-1">
              <Briefcase className="w-4 h-4" /> Requisition Governance
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System Job Oversight</h1>
            <p className="text-xs text-slate-400 mt-1">
              Audit active job postings across employer accounts and close inappropriate or expired requisitions.
            </p>
          </div>

          <button
            onClick={fetchJobsList}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Job List
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
            />
          </form>

          <div className="flex items-center gap-2">
            {['all', 'active', 'closed', 'draft'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition border ${
                  statusFilter === st 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
            Loading job requisitions...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/30 text-center text-slate-400">
            No system jobs match the current filter or search criteria.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Job Title & ID</th>
                    <th className="p-4">Employer Company</th>
                    <th className="p-4">Type & Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Posted Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {jobs.map((j) => {
                    const isUpdating = updatingId === j.id;
                    const isActive = j.status.toLowerCase() === 'active';
                    return (
                      <tr key={j.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold">
                          <div className="text-white font-bold">{j.title}</div>
                          <div className="text-slate-400 text-[11px] font-mono">Job #{j.id}</div>
                        </td>

                        <td className="p-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-purple-400" />
                            <span>{j.company_name}</span>
                          </div>
                        </td>

                        <td className="p-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{j.location || 'Remote'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase mt-0.5">{j.job_type}</div>
                        </td>

                        <td className="p-4">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-extrabold capitalize">
                              {j.status}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-400 text-[11px] font-mono">
                          {new Date(j.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedJob(j)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isActive ? (
                            <button
                              onClick={() => handleToggleJobStatus(j, 'closed')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition disabled:opacity-50"
                            >
                              Close Job
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleJobStatus(j, 'active')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition disabled:opacity-50"
                            >
                              Re-Open
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Job Details #{selectedJob.id}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-purple-300 font-semibold mt-0.5">{selectedJob.company_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Location:</span>
                  <p className="font-bold text-white">{selectedJob.location}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Employment Type:</span>
                  <p className="font-bold text-white capitalize">{selectedJob.job_type}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <p className="font-bold text-emerald-400 capitalize">{selectedJob.status}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Posted On:</span>
                  <p className="font-bold text-white">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
