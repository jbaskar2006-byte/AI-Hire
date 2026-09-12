import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  AlertCircle,
  Power
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { getAdminUsers, updateUserStatus } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsersList();
  }, [roleFilter]);

  const fetchUsersList = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAdminUsers(search, roleFilter);
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load system users:', err);
      const detail = err.response?.data?.detail || 'Failed to fetch user list.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsersList();
  };

  const handleToggleStatus = async (userToToggle) => {
    if (userToToggle.id === currentAdmin?.id && userToToggle.is_active) {
      setErrorMessage("You cannot deactivate your own currently active admin session account.");
      return;
    }

    const newStatus = !userToToggle.is_active;
    setUpdatingId(userToToggle.id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedUser = await updateUserStatus(userToToggle.id, newStatus);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setSuccessMessage(`User '${updatedUser.name}' account status updated to ${newStatus ? 'Active' : 'Deactivated'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update user status:', err);
      const detail = err.response?.data?.detail || 'Failed to update user status.';
      setErrorMessage(detail);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/50';
      case 'recruiter':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50';
      case 'candidate':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
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
              <UsersIcon className="w-4 h-4" /> Account Governance
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System User Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              View candidates & recruiters, filter by role, search credentials, and deactivate accounts safely.
            </p>
          </div>

          <button
            onClick={fetchUsersList}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh User List
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

        {/* Search & Role Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
            />
          </form>

          <div className="flex items-center gap-2">
            {['all', 'candidate', 'recruiter', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition border ${
                  roleFilter === r 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/40 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
            Loading system user accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 border border-slate-800 rounded-3xl bg-slate-900/30 text-center text-slate-400">
            No system user accounts match the current filter or search criteria.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Company / Info</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users.map((u) => {
                    const isUpdating = updatingId === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold">
                          <div className="text-white font-bold">{u.name}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="p-4 text-slate-400">
                          {u.company || 'N/A'}
                        </td>

                        <td className="p-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-extrabold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Deactivated
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-400 text-[11px] font-mono">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                              u.is_active 
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            <Power className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
