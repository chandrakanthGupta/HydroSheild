import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Droplets,
  Battery,
  Radio,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export default function TelemetryDashboard({
  nodes,
  selectedNode,
  onSelectNode,
  history,
  onGenerateAIProtocol,
  onTriggerCloudburst,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered nodes
  const filteredNodes = nodes.filter((n) => {
    const matchesSearch =
      n.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.drf_unit && n.drf_unit.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Fleet Averages
  const totalNodes = nodes.length || 1;
  const criticalCount = nodes.filter((n) => n.status === 'CRITICAL').length;
  const warningCount = nodes.filter((n) => n.status === 'WARNING').length;
  const avgDepth = (nodes.reduce((acc, n) => acc + (n.water_depth_cm || 0), 0) / totalNodes).toFixed(1);
  const avgClearance = (nodes.reduce((acc, n) => acc + (n.water_clearance_cm || 0), 0) / totalNodes).toFixed(1);
  const avgBattery = (nodes.reduce((acc, n) => acc + (n.battery_voltage || 3.8), 0) / totalNodes).toFixed(2);

  // Format history for Recharts
  const chartData = (history || []).map((item, idx) => ({
    time: item.iso_timestamp
      ? new Date(item.iso_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : `#${idx + 1}`,
    depth: item.water_depth_cm,
    clearance: item.water_clearance_cm,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Fleet KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Fleet Status</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{nodes.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Active IoT Nodes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            24/7 Live Asynchronous Ingestion
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Critical Bottlenecks</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${criticalCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {criticalCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">of {nodes.length} nodes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {warningCount} additional at Warning level
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Average Depth</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{avgDepth}</span>
            <span className="text-xs text-slate-400">cm</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 font-mono">
            Avg Clearance: {avgClearance} cm
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Node Battery</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{avgBattery}</span>
            <span className="text-xs text-slate-400">V (Li-Ion)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Solar trickle-charging active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Edge Fog Computing</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-300">42.5%</span>
            <span className="text-xs text-slate-400">Bandwidth Saved</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Lossless Delta IoT Compression
          </div>
        </div>
      </div>

      {/* Historical Water Level Depth Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Historical Water Depth Trajectory: {selectedNode ? selectedNode.location_name : 'Fleet Telemetry'}
              </h3>
              {selectedNode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {selectedNode.sensor_id}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rolling 20-sample telemetry stream showing water depth fluctuations and emergency trigger thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-1.5 rounded-full bg-cyan-400"></span> Water Depth (cm)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-400"></span> Warning (100cm)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-0.5 border-t border-dashed border-red-400"></span> Critical (180cm)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 260]} stroke="#64748b" fontSize={11} tickLine={false} unit="cm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'WARNING', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="depth"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#depthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Waiting for live telemetry readings...
            </div>
          )}
        </div>
      </div>

      {/* 10-Node Sensor Grid with Filtering & Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by drainage location, sensor ID, DRF unit..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setStatusFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'CRITICAL' ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10'
              }`}
            >
              Critical ({nodes.filter((n) => n.status === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setStatusFilter('WARNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'WARNING' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              Warning ({nodes.filter((n) => n.status === 'WARNING').length})
            </button>
            <button
              onClick={() => setStatusFilter('NORMAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'NORMAL' ? 'bg-emerald-500 text-white' : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              Normal ({nodes.filter((n) => n.status === 'NORMAL').length})
            </button>
          </div>
        </div>

        {/* Node Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode && selectedNode.sensor_id === node.sensor_id;
            const isCritical = node.status === 'CRITICAL';
            const isWarning = node.status === 'WARNING';

            return (
              <div
                key={node.sensor_id}
                onClick={() => onSelectNode(node)}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-900/95 ring-2 ring-cyan-500/20 shadow-xl'
                    : isCritical
                    ? 'border-red-500/40 bg-red-950/20 hover:border-red-500/80 shadow-md shadow-red-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{node.sensor_id}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2">{node.location_name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{node.drf_unit}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Water Depth</span>
                      <strong className="text-white font-mono text-sm">{node.water_depth_cm} cm</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Clearance</span>
                      <strong className="text-cyan-400 font-mono text-sm">{node.water_clearance_cm} cm</strong>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" /> {node.battery_voltage}V
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" /> {node.signal_rssi} dBm
                    </span>
                    <span
                      className={`font-mono font-bold text-[11px] ${
                        node.ml_risk_score_pct > 75
                          ? 'text-red-400'
                          : node.ml_risk_score_pct > 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      ML {node.ml_risk_score_pct}%
                    </span>
                  </div>
                </div>

                {/* Card Quick Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateAIProtocol(node);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Protocol
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerCloudburst(node.sensor_id);
                    }}
                    className="p-1.5 rounded-lg text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition"
                    title="Simulate Cloudburst Surge"
                  >
                    <Zap className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
