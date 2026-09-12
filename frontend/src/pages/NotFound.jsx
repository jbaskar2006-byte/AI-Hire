import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          The requested URL path does not exist on the HireAI recruitment platform workspace.
        </p>

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
