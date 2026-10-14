import React from 'react';
import {
  Waves,
  MapPin,
  Activity,
  CloudRain,
  ShieldAlert,
  Zap,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenCloudburst,
  onOpenAIProtocol,
  systemStatus,
  criticalCount,
  demoMode,
  setDemoMode,
  currentTime,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Group */}
        <div className="flex items-center gap-3.5 self-start md:self-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Waves className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HydroSheild
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold">
                  v3.0 AI Grid
                </span>
              </h1>
              {demoMode && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  DEMO SIMULATION
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Autonomous Urban Flood Monitoring & Emergency Dispatch System
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-stretch md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('gis')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'gis'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            GIS Command Center
            {criticalCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Live Telemetry & IoT Fleet
          </button>

          <button
            onClick={() => setActiveTab('atmospheric')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'atmospheric'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Atmospheric Intelligence
          </button>
        </nav>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Real-time Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime}</span>
          </div>

          {/* Cloudburst Simulator Quick Button */}
          <button
            onClick={onOpenCloudburst}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 shadow-sm shadow-red-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Simulate Flash Flood / Cloudburst Surge"
          >
            <Zap className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Simulate</span> Cloudburst
          </button>

          {/* AI Emergency Protocol Button */}
          <button
            onClick={onOpenAIProtocol}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
            AI Protocol
          </button>
        </div>
      </div>
    </header>
  );
}
