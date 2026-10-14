import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  Lock,
} from 'lucide-react';

export default function AlertsSafeguardModal({
  isOpen,
  onClose,
  targetNode,
  onSendAlert,
  alertLogs,
  loading,
}) {
  const [isTestMode, setIsTestMode] = useState(true);
  const [customPhone, setCustomPhone] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['sms', 'whatsapp']);

  if (!isOpen) return null;

  const node = targetNode || {
    sensor_id: 'HYD-NALA-001',
    location_name: 'Koti Drain',
    water_depth_cm: 220.0,
    ml_risk_score_pct: 95.0,
    safe_zone: { name: 'GHMC Sultan Bazar Relief Center' },
  };

  const handleToggleChannel = (chan) => {
    if (selectedChannels.includes(chan)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== chan));
      }
    } else {
      setSelectedChannels([...selectedChannels, chan]);
    }
  };

  const handleDispatch = () => {
    onSendAlert({
      sensor_id: node.sensor_id,
      location_name: node.location_name,
      water_depth_cm: node.water_depth_cm,
      ml_risk_pct: node.ml_risk_score_pct,
      safe_zone_name: node.safe_zone?.name || 'Nearest Relief Center',
      is_test: isTestMode,
      custom_recipient: customPhone.trim() || null,
      channels: selectedChannels,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Twilio SMS & WhatsApp Dispatch Gateway</h3>
              <p className="text-[11px] text-slate-400">Rate-limited with duplicate alert suppression</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Test Mode Switcher Safeguard */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Safe Simulation / Test Mode</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isTestMode
                  ? 'Active: Prefixes message with [TEST DISPATCH] and avoids unwanted carrier fees.'
                  : '⚠️ LIVE MODE: Transmits live emergency messages to actual phones.'}
              </p>
            </div>
            <button
              onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isTestMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500 text-white shadow-md'
              }`}
            >
              {isTestMode ? 'TEST MODE' : 'LIVE DISPATCH'}
            </button>
          </div>

          {/* Target Location Card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{node.location_name} ({node.sensor_id})</span>
              <span className="text-red-400 font-mono font-bold">{node.water_depth_cm} cm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Evacuation Directive: Evacuate toward <strong>{node.safe_zone?.name || 'GHMC Relief Shelter'}</strong>
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Communication Channels
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleToggleChannel('sms')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition ${
                  selectedChannels.includes('sms')
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Phone className="w-4 h-4" /> Twilio SMS
              </button>

              <button
                type="button"
                onClick={() => handleToggleChannel('whatsapp')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition ${
                  selectedChannels.includes('whatsapp')
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Twilio WhatsApp Sandbox
              </button>
            </div>
          </div>

          {/* Optional Custom Phone Number Override */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 uppercase tracking-wider">
              Recipient Phone Number (Optional Override)
            </label>
            <input
              type="text"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="e.g. +919391461879 (defaults to .env configured phone)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Recent Audit Dispatch Logs */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              Recent Dispatch Audit Logs ({alertLogs?.length || 0})
            </span>
            <div className="max-h-28 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-2 text-[11px] font-mono space-y-1">
              {alertLogs && alertLogs.length > 0 ? (
                alertLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-400 py-0.5 border-b border-slate-900">
                    <span className="truncate">{log.timestamp} - {log.location}</span>
                    <span className={log.is_test ? 'text-amber-400' : 'text-emerald-400'}>
                      {log.is_test ? '[TEST]' : '[LIVE]'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 py-1 text-center">No dispatches logged yet this session.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
            Cancel
          </button>

          <button
            onClick={handleDispatch}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-600/30"
          >
            <Send className="w-4 h-4" />
            {isTestMode ? 'Execute Test Dispatch' : 'Transmit Live Sirens'}
          </button>
        </div>
      </div>
    </div>
  );
}
