import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  CloudRain,
  ExternalLink,
  ShieldAlert,
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function NepalHistoricalExplorer({
  historicalData,
  onFocusCoordinates,
}) {
  const data = historicalData || {};
  const timeline = data.timeline_steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timeline animation
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeline.length]);

  const currentStep = timeline[currentStepIndex] || {};

  return (
    <div className="flex flex-col gap-5">
      {/* Event Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              VERIFIED HISTORICAL CASE STUDY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Event Window: {data.date_range || 'Sep 26 - Sep 29, 2024'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">
            {data.title || 'September 2024 Nepal Catastrophic Inundation'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {data.summary}
          </p>
        </div>

        <button
          onClick={() => onFocusCoordinates({ lat: 27.6850, lng: 85.3150, zoom: 11 })}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4" /> Focus Map on Kathmandu Basin
        </button>
      </div>

      {/* Chronological Replay Player */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-blue-900/40 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Chronological Event Replay
            </span>
            <span className="text-xs font-mono text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              {currentStep.timestamp}
            </span>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Replay' : 'Play Timeline'}
            </button>

            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(timeline.length - 1, prev + 1))}
              disabled={currentStepIndex === timeline.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {timeline.map((step, idx) => (
            <button
              key={step.step_id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`p-2 rounded-xl text-left border transition ${
                idx === currentStepIndex
                  ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-sm'
                  : idx < currentStepIndex
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400">Step {idx + 1}</div>
              <div className="text-xs font-semibold truncate mt-0.5">{step.stage}</div>
            </button>
          ))}
        </div>

        {/* Current Active Step Breakdown */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase">{currentStep.stage}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentStep.risk_level === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : currentStep.risk_level === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}
              >
                {currentStep.risk_level}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentStep.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Rainfall</span>
              <strong className="text-sky-400">{currentStep.average_rainfall_mm} mm</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Hydrological Crest</span>
              <strong className="text-red-400 truncate max-w-[150px] block">{currentStep.river_status}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Data Grid: Rainfall Stations & River Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rainfall Telemetry Table (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-400" />
                Verified 24h Station Rainfall
              </span>
              <span className="text-[11px] font-mono text-slate-500">Source: DHM Nepal</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                    <th className="py-2">Station Location</th>
                    <th className="py-2">24h Rainfall</th>
                    <th className="py-2">Impact Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(data.rainfall_records || []).map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-900/60">
                      <td className="py-2 font-medium text-white">{rec.station}</td>
                      <td className="py-2 font-mono font-bold text-sky-400">{rec.rainfall_24h_mm} mm</td>
                      <td className="py-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>24h Record: Lele, Lalitpur (311 mm)</span>
            <span>Historical percentile: &gt; 99.8%</span>
          </div>
        </div>

        {/* River Hydrology Gauges & Discharge (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" />
                Key River Gauges & Discharge Telemetry
              </span>
              <span className="text-[11px] font-mono text-slate-500">Peak Crest Data</span>
            </div>

            <div className="flex flex-col gap-3">
              {(data.river_gauges || []).map((gauge, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs">{gauge.river} — {gauge.station}</strong>
                    <span className="text-[10px] font-mono text-red-400 font-bold">
                      {gauge.surge_delta_m || gauge.surge_delta_cusecs}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Warning Mark</span>
                      <span className="text-slate-300 font-mono">
                        {gauge.warning_level_m ? `${gauge.warning_level_m} m` : `${gauge.warning_level_cusecs?.toLocaleString()} cusecs`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Danger Mark</span>
                      <span className="text-amber-400 font-mono">
                        {gauge.danger_level_m ? `${gauge.danger_level_m} m` : `${gauge.danger_level_cusecs?.toLocaleString()} cusecs`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Peak Recorded</span>
                      <span className="text-red-400 font-mono font-bold">
                        {gauge.peak_level_m ? `${gauge.peak_level_m} m` : `${gauge.peak_level_cusecs?.toLocaleString()} cusecs`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citations & Source Links */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-300">Verified Sources:</span>
            <div className="flex items-center gap-3">
              {(data.sources || []).map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  {src.agency} <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
