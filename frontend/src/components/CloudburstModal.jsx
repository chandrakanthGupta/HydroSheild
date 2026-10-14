import React, { useState } from 'react';
import {
  X,
  Zap,
  CloudLightning,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CloudburstModal({
  isOpen,
  onClose,
  nodes,
  onTriggerSurge,
  onResetSurge,
  loading,
}) {
  const [selectedSensorId, setSelectedSensorId] = useState(nodes[0]?.sensor_id || 'HYD-NALA-001');

  if (!isOpen) return null;

  const activeNode = nodes.find((n) => n.sensor_id === selectedSensorId) || nodes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-red-500/30 shadow-2xl overflow-hidden shadow-red-500/10">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-red-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <CloudLightning className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Cloudburst & Storm Surge Simulator
              </h3>
              <p className="text-xs text-red-300/80">
                Simulate catastrophic flash-flood deluge across Hyderabad chokepoints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-red-400 block mb-1">DISASTER SIMULATION PARAMETERS:</strong>
            Injects an instantaneous 100mm/hr rainfall deluge. Water level jumps to <strong>230+ cm</strong> (CRITICAL),
            drops clearance below <strong>20 cm</strong>, triggers ML overflow risk to <strong>96.8%</strong>, and initiates automated Gemini 2.5 emergency dispatch and Twilio sirens.
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
              Select Target Drainage Sector
            </label>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-red-500 transition"
            >
              {nodes.map((node) => (
                <option key={node.sensor_id} value={node.sensor_id}>
                  {node.sensor_id} — {node.location_name} ({node.drf_unit})
                </option>
              ))}
            </select>
          </div>

          {activeNode && (
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Current Status</span>
                <strong
                  className={
                    activeNode.status === 'CRITICAL'
                      ? 'text-red-400'
                      : activeNode.status === 'WARNING'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }
                >
                  {activeNode.status} ({activeNode.water_depth_cm} cm)
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Safe Evacuation Route</span>
                <span className="text-sky-400 font-semibold">{activeNode.safe_zone?.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onResetSurge(selectedSensorId)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset to Normal
          </button>

          <button
            onClick={() => onTriggerSurge(selectedSensorId)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
            Trigger Catastrophic Cloudburst Surge
          </button>
        </div>
      </div>
    </div>
  );
}
