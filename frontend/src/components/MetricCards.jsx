import React from 'react';
import { ShieldCheck, AlertTriangle, Droplets, CloudRain, Activity, Clock } from 'lucide-react';

export default function MetricCards({ nodes, weatherData }) {
  // Peak node
  const highestNode = (nodes || []).reduce(
    (max, n) => (n.water_depth_cm > (max?.water_depth_cm || 0) ? n : max),
    nodes[0]
  );

  const criticalCount = nodes.filter((n) => n.status === 'CRITICAL').length;
  const warningCount = nodes.filter((n) => n.status === 'WARNING').length;
  const normalCount = nodes.filter((n) => n.status === 'NORMAL').length;

  const mlRiskPct = weatherData?.ml_predictive_risk_pct ?? (highestNode?.ml_risk_score_pct || 14.5);
  const timeToOverflow = weatherData?.predictive_forecast?.est_time_to_overflow || 'Safe (> 3 Hours)';
  const rain = weatherData?.precipitation_mm_hr ?? 0.0;
  const humidity = weatherData?.humidity_percent ?? 78;

  const isRiskHigh = mlRiskPct >= 70;
  const isRiskMed = mlRiskPct >= 40 && mlRiskPct < 70;

  return (
    <div role="region" aria-label="Key Flood Performance Indicators" aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Overall Risk */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Overall City Flood Risk</span>
          {isRiskHigh ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span
            className={`text-2xl font-bold ${
              isRiskHigh ? 'text-red-400' : isRiskMed ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {mlRiskPct}%
          </span>
          <span className="text-xs text-slate-400">
            {isRiskHigh ? 'Critical Danger' : isRiskMed ? 'Moderate Inundation' : 'Normal Capacity'}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isRiskHigh ? 'bg-red-500' : isRiskMed ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, mlRiskPct))}%` }}
          ></div>
        </div>
      </div>

      {/* 2. Peak Water Level */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Peak Water Depth</span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {highestNode?.water_depth_cm ?? 0} <span className="text-sm font-normal text-slate-400">cm</span>
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              highestNode?.status === 'CRITICAL'
                ? 'bg-red-500/20 text-red-300'
                : highestNode?.status === 'WARNING'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {highestNode?.status || 'NORMAL'}
          </span>
        </div>

        <div className="text-xs text-slate-400 mt-2 truncate">
          Sector: <strong className="text-slate-200">{highestNode?.location_name || 'All Sectors Stable'}</strong>
        </div>
      </div>

      {/* 3. Drainage Sensor Fleet */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Telemetry Fleet (10 Nodes)</span>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">{normalCount}</span> Normal
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-semibold text-white">{warningCount}</span> Warning
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="font-semibold text-white">{criticalCount}</span> Critical
          </div>
        </div>

        <div className="text-xs text-slate-400 mt-2">
          Ingestion cycle: <span className="text-emerald-400 font-medium">Live every 3 sec</span>
        </div>
      </div>

      {/* 4. Weather & Overflow Forecast */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Atmospheric Rain & Forecast</span>
          <CloudRain className="w-4 h-4 text-sky-400" />
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-white">
            {rain} <span className="text-sm font-normal text-slate-400">mm/h</span>
          </span>
          <span className="text-xs text-slate-400">Humidity: {humidity}%</span>
        </div>

        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 truncate">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Overflow estimate: <strong className="text-slate-200">{timeToOverflow}</strong></span>
        </div>
      </div>
    </div>
  );
}
