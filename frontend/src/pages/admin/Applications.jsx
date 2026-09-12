import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Search, 
  RefreshCw, 
  User, 
  Briefcase, 
  Award, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { getAdminApplications } from '../../services/adminService';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchApplicationsList();
  }, [statusFilter]);

  const fetchApplicationsList = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAdminApplications(search, statusFilter);
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load admin applications:', err);
      const detail = err.response?.data?.detail || 'Failed to fetch application records.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplicationsList();
  };

  const getScoreBadge = (score) => {
    if (score === null || score === undefined) return 'bg-slate-800 text-slate-400 border-slate-700';
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-widest mb-1">
              <FileCheck2 className="w-4 h-4" /> Application Monitoring
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System Applications Oversight</h1>
            <p className="text-xs text-slate-400 mt-1">
              Global overview of submitted candidate applications, match scores, and recruitment statuses.
            </p>
          </div>

          <button
            onClick={fetchApplicationsList}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {['all', 'applied', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition border ${
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

        {/* Applications Table */}
        {loading ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
            Loading application records...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/30 text-center text-slate-400">
            No job application records match the current filter or search criteria.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Target Job</th>
                    <th className="p-4">AI Match Score</th>
                    <th className="p-4">Pipeline Status</th>
                    <th className="p-4 text-right">Applied Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-white font-bold">{app.candidate_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono ml-5">Candidate #{app.candidate_id}</div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-white font-bold">{app.job_title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono ml-5">Job #{app.job_id}</div>
                      </td>

                      <td className="p-4">
                        {app.match_score !== null && app.match_score !== undefined ? (
                          <span className={`px-2.5 py-1 rounded-xl text-xs border ${getScoreBadge(app.match_score)}`}>
                            {Math.round(app.match_score)}% Match Score
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Not Computed</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold uppercase text-[10px]">
                          {app.status}
                        </span>
                      </td>

                      <td className="p-4 text-right text-slate-400 text-[11px] font-mono">
                        {new Date(app.applied_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
