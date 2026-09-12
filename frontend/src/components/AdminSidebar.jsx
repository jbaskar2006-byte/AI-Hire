import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileCheck2, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  X,
  Menu 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Jobs', path: '/admin/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', path: '/admin/applications', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Header Toggle */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-sm">Admin Console</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside className={`w-full md:w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0 font-sans ${mobileOpen ? 'block' : 'hidden md:flex'}`}>
        <div>
          {/* Logo & Admin Badge */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-white text-base tracking-tight leading-none">HireAI</h2>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full inline-block mt-1">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-extrabold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@hireai.com'}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-extrabold transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Settings className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">System Settings</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white">Platform Version:</span>
                <p className="text-slate-400">HireAI v1.0.0 (Production Release)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white">Database Engine:</span>
                <p className="text-slate-400">MySQL Server (hireai_db)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white">Security Policy:</span>
                <p className="text-slate-400">Role-Based Access Control (RBAC) & User Deactivation Enforcement</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
