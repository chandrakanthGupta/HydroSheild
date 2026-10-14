import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, Zap } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isCritical = toast.type === 'critical';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderColor = 'border-sky-500/30';
        let bgColor = 'bg-slate-900/90';
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

        if (isCritical) {
          borderColor = 'border-red-500/50 shadow-lg shadow-red-500/20';
          bgColor = 'bg-red-950/90';
          icon = <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />;
        } else if (isWarning) {
          borderColor = 'border-amber-500/50 shadow-lg shadow-amber-500/20';
          bgColor = 'bg-amber-950/90';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (isSuccess) {
          borderColor = 'border-emerald-500/50 shadow-lg shadow-emerald-500/20';
          bgColor = 'bg-emerald-950/90';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${bgColor} ${borderColor} transition-all duration-300 transform translate-y-0 opacity-100 shadow-2xl`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-100 truncate">{toast.title}</h4>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  {toast.time || 'JUST NOW'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
