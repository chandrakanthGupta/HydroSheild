import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Sparkles,
  Zap,
  Shield,
  Battery,
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function SensorDetailsPanel({
  selectedNode,
  nodes,
  onSelectNode,
  history,
  onOpenAIPlan,
  onTriggerCloudburst,
}) {
  const [tab, setTab] = useState('selected'); // 'selected' | 'fleet'
  const [search, setSearch] = useState('');

  // Prepare chart data
  const chartData = (history || []).map((item, idx) => ({
    time: item.iso_timestamp
      ? new Date(item.iso_timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
      : `#${idx + 1}`,
    depth: item.water_depth_cm,
  }));

  const filteredNodes = nodes.filter((n) =>
    n.location_name.toLowerCase().includes(search.toLowerCase()) ||
    n.sensor_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-[620px] rounded-2xl border border-slate-800 bg-[#0f172a] shadow-sm flex flex-col overflow-hidden">
      {/* Panel Tab Header */}
      <div className="p-3 border-b border-slate-800 bg-[#0d1322] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setTab('selected')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              tab === 'selected' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chokepoint Inspector
          </button>
          <button
            onClick={() => setTab('fleet')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              tab === 'fleet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fleet List ({nodes.length})
          </button>
        </div>

        {selectedNode && tab === 'selected' && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold border border-slate-700 truncate max-w-[140px]">
            {selectedNode.sensor_id}
          </span>
        )}
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {tab === 'selected' && selectedNode ? (
          <>
            {/* Sensor Header Card */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {selectedNode.sensor_id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedNode.status === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : selectedNode.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-1">
                {selectedNode.location_name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedNode.drf_unit}</p>
            </div>

            {/* Depth Visual Bar */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="text-slate-400">Water Depth Level</span>
                <span className="text-white font-mono font-bold">
                  {selectedNode.water_depth_cm} cm <span className="text-slate-500 font-normal">/ 250 cm</span>
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedNode.status === 'CRITICAL'
                      ? 'bg-red-500'
                      : selectedNode.status === 'WARNING'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(5, (selectedNode.water_depth_cm / 250) * 100))}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 cm (Safe)</span>
                <span>100 cm (Warning)</span>
                <span>180 cm (Critical)</span>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Clearance</span>
                <strong className="text-sm font-mono text-sky-400">
                  {selectedNode.water_clearance_cm} cm
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">ML Risk Probability</span>
                <strong
                  className={`text-sm font-mono ${
                    selectedNode.ml_risk_score_pct > 75
                      ? 'text-red-400'
                      : selectedNode.ml_risk_score_pct > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedNode.ml_risk_score_pct}%
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Battery</span>
                  <span className="font-mono text-white text-xs font-semibold">
                    {selectedNode.battery_voltage}V
                  </span>
                </div>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Signal</span>
                  <span className="font-mono text-white text-xs font-semibold">
                    {selectedNode.signal_rssi} dBm
                  </span>
                </div>
                <Radio className="w-4 h-4 text-sky-400" />
              </div>
            </div>

            {/* Safe Evacuation Shelter */}
            {selectedNode.safe_zone && (
              <div className="p-3 rounded-xl bg-blue-950/25 border border-blue-800/40 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px] uppercase">
                  <Shield className="w-3.5 h-3.5" /> Designated Safe Shelter
                </div>
                <div className="text-white font-semibold mt-1">
                  {selectedNode.safe_zone.name}
                </div>
              </div>
            )}

            {/* Historical Trend Chart */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Water Depth Trend (Last 20 Readings)
              </span>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cleanDepth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 250]} stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" />
                    <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="depth" stroke="#3b82f6" strokeWidth={2} fill="url(#cleanDepth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onOpenAIPlan(selectedNode)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gemini AI Protocol
              </button>

              <button
                onClick={() => onTriggerCloudburst(selectedNode.sensor_id)}
                className="py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                title="Simulate Flood Surge on this Node"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                Surge
              </button>
            </div>
          </>
        ) : (
          /* Fleet List Tab */
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chokepoint..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.sensor_id === node.sensor_id;
                return (
                  <div
                    key={node.sensor_id}
                    onClick={() => {
                      onSelectNode(node);
                      setTab('selected');
                    }}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/60'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-xs">{node.location_name}</strong>
                        <span className="text-[10px] font-mono text-slate-400">({node.sensor_id})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Depth: <span className="font-mono text-white">{node.water_depth_cm} cm</span> | ML: {node.ml_risk_score_pct}%
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        node.status === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300'
                          : node.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
