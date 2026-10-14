import React from 'react';
import {
  Waves,
  Zap,
  Sparkles,
  CloudRain,
  ShieldAlert,
  Radio,
  MapPin,
  Calendar,
  Satellite,
  Users,
  Send,
  Compass,
} from 'lucide-react';

export default function CleanNavbar({
  activeMode,
  setActiveMode,
  criticalCount,
  weatherData,
  onOpenCloudburst,
  onOpenAIPlan,
  onOpenGPSModal,
  onOpenAlertsModal,
  userLocation,
  currentTime,
}) {
  const rain = weatherData?.precipitation_mm_hr ?? 0.0;
  const temp = weatherData?.temperature_c ?? 28;

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">HydroSheild</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                PROD v3.5 AI Grid
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Enterprise Flood Intelligence, Historical Disaster Analytics & Rescue Operations
            </p>
          </div>
        </div>

        {/* Platform Mode Switcher */}
        <nav role="navigation" aria-label="Disaster Intelligence Mode Switcher" className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-stretch xl:self-auto overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveMode('live')}
            aria-label="Switch to live flood telemetry monitoring"
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === 'live'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Monitoring
            {criticalCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMode('nepal')}
            aria-label="Switch to 2024 Nepal flood historical disaster explorer"
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === 'nepal'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            2024 Nepal Flood Explorer
          </button>

          <button
            onClick={() => setActiveMode('satellite')}
            aria-label="Switch to satellite radar and hazard footprint view"
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === 'satellite'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            Satellite & Hazards
          </button>

          <button
            onClick={() => setActiveMode('rescue')}
            aria-label="Switch to rescue operations and safe shelter prioritization"
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === 'rescue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Rescue Operations
          </button>
        </nav>

        {/* Global Controls & Actions */}
        <div role="toolbar" aria-label="Global Emergency Controls" className="flex items-center gap-2 self-end xl:self-auto">
          {/* Geolocation Button */}
          <button
            onClick={onOpenGPSModal}
            aria-label="View or update GPS coordinates"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              userLocation
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Browser GPS Location"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{userLocation ? 'GPS Active' : 'My Location'}</span>
          </button>

          {/* Twilio SMS/WhatsApp Gateway */}
          <button
            onClick={onOpenAlertsModal}
            aria-label="Open emergency Twilio alert dispatch gateway"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Twilio Alert Dispatches"
          >
            <Send className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Alert Gateway</span>
          </button>

          {/* Cloudburst Simulation */}
          <button
            onClick={onOpenCloudburst}
            aria-label="Trigger simulated cloudburst storm surge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            Simulate Surge
          </button>

          {/* Gemini AI Protocol */}
          <button
            onClick={onOpenAIPlan}
            aria-label="Generate Google Gemini AI emergency action plan"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Protocol
          </button>
        </div>
      </div>
    </header>
  );
}
