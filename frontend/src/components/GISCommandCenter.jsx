import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip as LeafletTooltip,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Shield,
  AlertTriangle,
  Radio,
  Battery,
  Navigation,
  Sparkles,
  Zap,
  Layers,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// Custom Map Pins
const createSensorPin = (status) => {
  let color = '#10b981'; // Green
  let pulseClass = '';
  let shadow = '0 0 14px rgba(16, 185, 129, 0.6)';

  if (status === 'CRITICAL') {
    color = '#ef4444'; // Red
    pulseClass = 'pulse-critical';
    shadow = '0 0 20px rgba(239, 68, 68, 0.9)';
  } else if (status === 'WARNING') {
    color = '#f59e0b'; // Amber
    pulseClass = 'pulse-warning';
    shadow = '0 0 16px rgba(245, 158, 11, 0.7)';
  }

  return new L.DivIcon({
    className: 'custom-sensor-icon',
    html: `
      <div class="${pulseClass}" style="
        background-color: ${color};
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
};

const safeZoneIcon = new L.DivIcon({
  className: 'custom-safezone-icon',
  html: `
    <div style="
      background: linear-gradient(135deg, #0284c7, #2563eb);
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 2px solid #ffffff;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    ">
      🛡️
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

export default function GISCommandCenter({
  nodes,
  selectedNode,
  onSelectNode,
  onGenerateAIProtocol,
  onTriggerCloudburst,
}) {
  const [showRoutes, setShowRoutes] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredNodes = nodes.filter((n) => {
    if (filterSeverity === 'ALL') return true;
    return n.status === filterSeverity;
  });

  const centerPosition = selectedNode
    ? [selectedNode.lat, selectedNode.lng]
    : [17.415, 78.465];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full min-h-[750px]">
      {/* Map Column (8 Cols on XL) */}
      <div className="xl:col-span-8 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden relative shadow-2xl">
        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterSeverity === 'ALL'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setFilterSeverity('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filterSeverity === 'CRITICAL'
                  ? 'bg-red-500 text-white'
                  : 'text-red-400 hover:bg-red-500/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Critical ({nodes.filter((n) => n.status === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setFilterSeverity('WARNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filterSeverity === 'WARNING'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              Warning ({nodes.filter((n) => n.status === 'WARNING').length})
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-xl border transition shadow-xl ${
                showRoutes
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {showRoutes ? 'Evacuation Routes Active' : 'Show Routes'}
            </button>
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="w-full h-full min-h-[580px] relative z-10">
          <MapContainer
            center={centerPosition}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', minHeight: '580px' }}
          >
            {/* Dark Matter Tiles from CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Evacuation Polylines */}
            {showRoutes &&
              filteredNodes.map((node) => {
                if (!node.safe_zone || !node.safe_zone.lat) return null;
                const isCritical = node.status === 'CRITICAL';
                return (
                  <Polyline
                    key={`route-${node.sensor_id}`}
                    positions={[
                      [node.lat, node.lng],
                      [node.safe_zone.lat, node.safe_zone.lng],
                    ]}
                    pathOptions={{
                      color: isCritical ? '#ef4444' : '#38bdf8',
                      weight: isCritical ? 3.5 : 2,
                      dashArray: isCritical ? '6, 6' : '4, 8',
                      opacity: isCritical ? 0.9 : 0.65,
                    }}
                  >
                    <LeafletTooltip sticky>
                      <div className="text-xs">
                        <strong className="text-sky-400">Evacuation Route:</strong> {node.location_name} &rarr; {node.safe_zone.name}
                      </div>
                    </LeafletTooltip>
                  </Polyline>
                );
              })}

            {/* Safe Zone Markers */}
            {showRoutes &&
              filteredNodes.map((node) => {
                if (!node.safe_zone || !node.safe_zone.lat) return null;
                return (
                  <Marker
                    key={`safe-${node.sensor_id}`}
                    position={[node.safe_zone.lat, node.safe_zone.lng]}
                    icon={safeZoneIcon}
                  >
                    <Popup>
                      <div className="p-1">
                        <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider">
                          <Shield className="w-4 h-4" /> Designated Safe Zone
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{node.safe_zone.name}</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Primary relief shelter for <strong className="text-slate-100">{node.location_name}</strong> evacuees.
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Sensor Chokepoint Markers */}
            {filteredNodes.map((node) => (
              <Marker
                key={node.sensor_id}
                position={[node.lat, node.lng]}
                icon={createSensorPin(node.status)}
                eventHandlers={{
                  click: () => onSelectNode(node),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{node.sensor_id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          node.status === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : node.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{node.location_name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{node.drf_unit}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Water Depth</span>
                        <strong className="text-white font-mono">{node.water_depth_cm} cm</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Clearance</span>
                        <strong className="text-cyan-400 font-mono">{node.water_clearance_cm} cm</strong>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-1.5">
                      <button
                        onClick={() => onSelectNode(node)}
                        className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onGenerateAIProtocol(node)}
                        className="flex-1 py-1.5 px-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Protocol
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Map Footer Legend */}
        <div className="p-3 bg-slate-900/95 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              Normal Level
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
              Warning Level
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse"></span>
              Critical Overflow
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-sm">🛡️</span> High-Ground Safe Zone
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Coordinates: 17.3850° N, 78.4867° E | Live GIS Engine
          </div>
        </div>
      </div>

      {/* Node Inspector Side Panel (4 Cols on XL) */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        {selectedNode ? (
          <div
            className={`rounded-2xl border backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${
              selectedNode.status === 'CRITICAL'
                ? 'bg-red-950/30 border-red-500/40'
                : 'bg-slate-900/70 border-slate-800'
            }`}
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                  {selectedNode.sensor_id}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                    selectedNode.status === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
                      : selectedNode.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedNode.status === 'CRITICAL'
                        ? 'bg-red-400'
                        : selectedNode.status === 'WARNING'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                  {selectedNode.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mt-3">{selectedNode.location_name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedNode.drf_unit}</p>
              <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                <span>Risk Bottleneck:</span>
                <span className="text-amber-400 font-semibold">{selectedNode.chokepoint_rating}</span>
              </div>

              {/* Depth Visual Gauge */}
              <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Water Depth vs Drain Height</span>
                  <span className="text-white font-mono font-bold">{selectedNode.water_depth_cm} cm / 250 cm</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedNode.status === 'CRITICAL'
                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                        : selectedNode.status === 'WARNING'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(5, (selectedNode.water_depth_cm / 250) * 100))}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0 cm (Dry)</span>
                  <span>100 cm (Warning)</span>
                  <span>180 cm (Critical)</span>
                  <span>250 cm (Overflow)</span>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Water Clearance
                  </span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {selectedNode.water_clearance_cm} cm
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    ML Overflow Risk
                  </span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      selectedNode.ml_risk_score_pct > 75
                        ? 'text-red-400'
                        : selectedNode.ml_risk_score_pct > 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedNode.ml_risk_score_pct}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Battery
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-200">
                      {selectedNode.battery_voltage} V
                    </span>
                  </div>
                  <Battery className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Signal RSSI
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-200">
                      {selectedNode.signal_rssi} dBm
                    </span>
                  </div>
                  <Radio className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              {/* Designated Safe Zone Card */}
              {selectedNode.safe_zone && (
                <div className="mt-4 p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <Shield className="w-4 h-4" /> Designated Safe Zone & Shelter
                  </div>
                  <p className="text-sm font-semibold text-slate-100 mt-1">
                    {selectedNode.safe_zone.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target evacuation center connected via active routing.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-6">
              <button
                onClick={() => onGenerateAIProtocol(selectedNode)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                Generate Gemini 2.5 Emergency Protocol
              </button>

              <button
                onClick={() => onTriggerCloudburst(selectedNode.sensor_id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-red-400" />
                Simulate Cloudburst on {selectedNode.location_name}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 flex flex-col items-center justify-center text-center">
            <Layers className="w-10 h-10 text-slate-600 mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No Chokepoint Selected</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click any colored sensor pin on the GIS map to inspect live water clearance metrics and emergency safe zones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
