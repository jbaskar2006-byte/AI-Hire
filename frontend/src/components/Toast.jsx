import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short transition-all">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            : isError
            ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
            : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
};
