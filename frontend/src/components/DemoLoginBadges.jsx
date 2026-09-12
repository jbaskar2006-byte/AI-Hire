import React from 'react';
import { Briefcase, UserCheck, ShieldCheck, Zap } from 'lucide-react';

export const DemoLoginBadges = ({ onSelect }) => {
  const presets = [
    {
      role: 'Recruiter',
      email: 'recruiter@hireai.com',
      password: 'password123',
      icon: Briefcase,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20',
      label: 'Sarah Connor (HR Lead)'
    },
    {
      role: 'Candidate',
      email: 'candidate@hireai.com',
      password: 'password123',
      icon: UserCheck,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      label: 'David Miller (Engineer)'
    },
    {
      role: 'Admin',
      email: 'admin@hireai.com',
      password: 'admin123',
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
      label: 'System Admin'
    }
  ];

  return (
    <div className="space-y-3 pt-4 border-t border-slate-800">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>1-Click Demo Testing Credentials</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.role}
              type="button"
              onClick={() => onSelect(p.email, p.password)}
              className={`p-2.5 rounded-xl border text-left transition-all ${p.color} flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" /> {p.role}
                </span>
                <span className="text-[10px] opacity-60 group-hover:opacity-100">Click to fill</span>
              </div>
              <p className="text-[11px] font-medium truncate">{p.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
