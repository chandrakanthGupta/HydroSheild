import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  Languages,
  Send,
  Printer,
  AlertTriangle,
  Building2,
  Navigation,
  PhoneCall,
  Loader2,
} from 'lucide-react';

export default function AIProtocolModal({
  isOpen,
  onClose,
  node,
  protocolText,
  loading,
  onRegenerate,
  onSendAlert,
  currentLanguage,
  onChangeLanguage,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !node) return null;

  const handleCopy = () => {
    if (!protocolText) return;
    navigator.clipboard.writeText(protocolText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gemini 2.5 Flash Emergency Action Plan</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Autonomous Municipal Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Zone: <strong className="text-slate-200">{node.location_name}</strong> ({node.sensor_id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700">
              <button
                onClick={() => onChangeLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  currentLanguage === 'en'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onChangeLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  currentLanguage === 'hi'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Chokepoint Summary Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Water Level</span>
              <span className="text-white font-mono font-bold text-sm">
                {node.water_depth_cm} cm (Clearance: {node.water_clearance_cm} cm)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">ML Overflow Risk</span>
              <span
                className={`font-mono font-bold text-sm ${
                  node.ml_risk_score_pct > 75 ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {node.ml_risk_score_pct}% Probability
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Evacuation Shelter</span>
              <span className="text-sky-400 font-semibold text-sm">
                {node.safe_zone?.name || 'Nearest Relief Center'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">DRF Unit</span>
              <span className="text-slate-300 font-medium text-xs">{node.drf_unit}</span>
            </div>
          </div>

          {/* Protocol Content */}
          <div className="relative">
            {loading ? (
              <div className="min-h-[280px] rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <h4 className="text-sm font-semibold text-white">
                  Querying Google Gemini 2.5 Flash...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Synthesizing real-time hydrology depth metrics, GIS street networks, and designated relief shelter coordinates.
                </p>
              </div>
            ) : protocolText ? (
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line shadow-inner max-h-[380px] overflow-y-auto">
                {protocolText}
              </div>
            ) : (
              <div className="min-h-[220px] rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-xs text-slate-400">
                  Click generate below to invoke Gemini 2.5 Flash for this drainage sector.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!protocolText || loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy Protocol'}
            </button>

            <button
              onClick={handlePrint}
              disabled={!protocolText || loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> Print Directive
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Regenerate Plan
            </button>

            <button
              onClick={() => onSendAlert(node)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Dispatch SMS & WhatsApp Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
