import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  LayoutDashboard,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'recruiter':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Briefcase className="w-3 h-3" /> HR / Recruiter
          </span>
        );
      case 'candidate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <UserCheck className="w-3 h-3" /> Job Seeker
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <ShieldCheck className="w-3 h-3" /> System Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Hire<span className="gradient-text">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Phase 1
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Intelligent Recruitment System</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link 
            to="/" 
            className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Overview
          </Link>
          
          {user && (
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-1.5 hover:text-white transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Workspace
            </Link>
          )}

          <a 
            href="#tech-specs" 
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <Layers className="w-4 h-4" /> Architecture
          </a>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1.5 sm:pr-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
              >
                <img
                  src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user.full_name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-indigo-500/30"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-2">
                    {user.full_name}
                  </div>
                  <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    <div className="mt-1.5">{getRoleBadge(user.role)}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600/10 hover:text-white rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Dashboard Workspace
                    </Link>
                    <Link
                      to={user.role === 'recruiter' ? '/recruiter/profile' : user.role === 'admin' ? '/admin/dashboard' : '/candidate/profile'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600/10 hover:text-white rounded-lg transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" /> Profile & Account Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span className={`h-0.5 w-5 bg-current transform transition duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transition duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transform transition duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

      </div>

      {/* Expandable Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-4 animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm font-semibold text-white flex items-center justify-between"
            >
              <span>Overview</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-sm font-bold text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Workspace Dashboard
                  </span>
                  {getRoleBadge(user.role)}
                </Link>

                <Link
                  to={user.role === 'recruiter' ? '/recruiter/profile' : user.role === 'admin' ? '/admin/dashboard' : '/candidate/profile'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm font-semibold text-slate-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-purple-400" /> Profile & Settings
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-400 flex items-center justify-between"
                >
                  <span>Sign Out ({user.email})</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
