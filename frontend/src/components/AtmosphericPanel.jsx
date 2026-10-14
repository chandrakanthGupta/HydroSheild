import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Clock,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Compass,
} from 'lucide-react';

export default function AtmosphericPanel({ weatherData, onRefreshWeather, loadingWeather }) {
  const current = weatherData || {};
  const forecast = current.predictive_forecast || {};
  const mlRiskPct = current.ml_predictive_risk_pct || 22.5;

  const isHighRisk = mlRiskPct >= 70;
  const isModerateRisk = mlRiskPct >= 40 && mlRiskPct < 70;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              Atmospheric Meteorology & Predictive Inundation Intelligence
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Open-Meteo Live API
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atmospheric telemetry cross-referenced with synthetic random forest runoff physics for Hyderabad Metropolitan Area.
          </p>
        </div>

        <button
          onClick={onRefreshWeather}
          disabled={loadingWeather}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition self-end md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin text-cyan-400' : ''}`} />
          {loadingWeather ? 'Synchronizing...' : 'Refresh Meteorology'}
        </button>
      </div>

      {/* Atmospheric Weather Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Ambient Temperature
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-white">
                {current.temperature_c ?? 28.5}
              </span>
              <span className="text-sm font-semibold text-slate-400">°C</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Surface level 2m</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Thermometer className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Relative Humidity
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-cyan-400">
                {current.humidity_percent ?? 78}
              </span>
              <span className="text-sm font-semibold text-slate-400">%</span>
            </div>
            <span className="text-[11px] text-cyan-500/80 mt-1 block">Atmospheric Saturation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        {/* Precipitation Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Rainfall Intensity
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-sky-400">
                {current.precipitation_mm_hr ?? 0.0}
              </span>
              <span className="text-sm font-semibold text-slate-400">mm / hr</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Precipitation radar sensor</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <CloudRain className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Wind Velocity
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-slate-200">
                {current.wind_kmh ?? 12.0}
              </span>
              <span className="text-sm font-semibold text-slate-400">km / h</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Direction: South-West Gusts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Wind className="w-6 h-6 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Predictive ML Overflow Risk & Time-to-Overflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ML Risk Gauge Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Hybrid Machine Learning Predictive Inundation Model
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                RandomForestClassifier
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5">
              Evaluates multi-variable synthetic feature vectors: water depth + rain rate + humidity + drainage chokepoint ratings.
            </p>

            {/* Big Risk Bar */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Metropolitan Flood Risk Index
                </span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    isHighRisk ? 'text-red-400' : isModerateRisk ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {mlRiskPct}%
                </span>
              </div>

              <div className="w-full h-4 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isHighRisk
                      ? 'bg-gradient-to-r from-amber-500 via-red-500 to-red-600 shadow-md shadow-red-500/50'
                      : isModerateRisk
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md shadow-amber-500/50'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-md shadow-emerald-500/50'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, mlRiskPct))}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>0% Safe</span>
                <span>40% Advisory</span>
                <span>70% Emergency Overflow Alert</span>
                <span>100% Catastrophic</span>
              </div>
            </div>

            {/* Risk Factor Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Max Node Depth</span>
                <strong className="text-sm font-mono text-white mt-1 block">
                  {current.max_node_depth_cm ?? 0.0} cm
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Rain Intensity</span>
                <strong className="text-sm font-mono text-cyan-400 mt-1 block">
                  {current.precipitation_mm_hr ?? 0.0} mm/h
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Chokepoint Silt</span>
                <strong className="text-sm font-mono text-amber-400 mt-1 block">Moderate (65%)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Time to Overflow (5 Cols) */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border backdrop-blur-xl shadow-xl flex flex-col justify-between ${
            isHighRisk
              ? 'bg-red-950/30 border-red-500/50'
              : isModerateRisk
              ? 'bg-amber-950/30 border-amber-500/50'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" /> Overflow Countdown Forecast
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isHighRisk
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                    : isModerateRisk
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {forecast.risk_level || 'NORMAL'}
              </span>
            </div>

            <div className="mt-5">
              <h4 className="text-xs text-slate-400 font-semibold uppercase">Estimated Time to Spillover</h4>
              <p
                className={`text-2xl font-bold font-mono mt-1 ${
                  isHighRisk ? 'text-red-400 animate-pulse' : isModerateRisk ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {forecast.est_time_to_overflow || 'No Overflow Risk (> 3 Hours)'}
              </p>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-cyan-400" /> Municipal Disaster Directive
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {forecast.advisory ||
                  'Drainage channels operating within safe parameters. Normal monitoring active.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>City: Hyderabad (GHMC DRF)</span>
            <span>Refreshed: Auto every 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
