import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 skeleton-shimmer"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[580px]">
        <div className="xl:col-span-8 rounded-2xl bg-slate-900/60 border border-slate-800 skeleton-shimmer"></div>
        <div className="xl:col-span-4 rounded-2xl bg-slate-900/60 border border-slate-800 skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export function EmptyState({ message, onRetry }) {
  return (
    <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3 text-lg">
        📡
      </div>
      <h3 className="text-base font-semibold text-slate-200">No Telemetry Stream</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        {message || 'Unable to connect to live HydroSheild telemetry stream. Ensure the backend server is running.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
