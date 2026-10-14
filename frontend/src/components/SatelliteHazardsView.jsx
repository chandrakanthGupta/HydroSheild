import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  ShieldAlert,
  Mountain,
  Eye,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function SatelliteHazardsView({
  satelliteData,
  hazardsData,
  onFocusRegion,
}) {
  const [selectedRegion, setSelectedRegion] = useState('hyderabad_musi');

  const activeSat = satelliteData || {};
  const pre = activeSat.pre_event || {};
  const post = activeSat.post_event || {};
  const hazards = hazardsData || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Satellite Header Bar */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" /> COPERNICUS SENTINEL-1 SAR & SENTINEL-2
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Bitemporal Change Detection Analysis
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1.5">
            Synthetic Aperture Radar (SAR) Flood Extent Delineation
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Active C-Band Microwave Radar (5.405 GHz) penetrates monsoon clouds to map open surface water expansion.
            Thresholded backscatter drop (&Delta;&sigma;&deg; &lt; -3.2 dB) delineates flood boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedRegion('hyderabad_musi');
              onFocusRegion('hyderabad_musi');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedRegion === 'hyderabad_musi'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Hyderabad Musi Grid
          </button>
          <button
            onClick={() => {
              setSelectedRegion('nepal_2024');
              onFocusRegion('nepal_2024');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedRegion === 'nepal_2024'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Nepal 2024 Satellite Footprint
          </button>
        </div>
      </div>

      {/* Pre-Event vs Post-Event Satellite Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pre-Event Baseline */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pre-Event Reference Baseline
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                Dry Season Baseline
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Satellite Mission</span>
                <strong className="text-white font-mono">{pre.mission || 'Sentinel-2A MSI'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Acquisition Timestamp</span>
                <strong className="text-white font-mono">{pre.acquisition_date || '2024-08-25'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Spatial Resolution</span>
                <strong className="text-cyan-400 font-mono">{pre.resolution_m || 10.0} meters / pixel</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Cloud Cover Ratio</span>
                <strong className="text-slate-300 font-mono">{pre.cloud_cover_pct || 8.0}% (Optical)</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Permanent Normal Water Surface Area
              </span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {pre.baseline_water_area_sqkm || 18.2} km²
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Source: {pre.source || 'Copernicus Data Space Ecosystem'}
          </div>
        </div>

        {/* Post-Event Deluge Detection */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-blue-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" /> Post-Event Delineation [OBSERVED]
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Latency: {post.latency_hours || 3.4} hrs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Sensor Platform</span>
                <strong className="text-white font-mono">{post.mission || 'Sentinel-1A IW C-SAR'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Acquisition Timestamp</span>
                <strong className="text-white font-mono">{post.acquisition_date || '2024-09-28'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Cloud Penetration</span>
                <strong className="text-emerald-400 font-mono">100% (Radar Microwave)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Delineation Confidence</span>
                <strong className="text-cyan-400 font-mono">{post.confidence_pct || 91.4}% Verified</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Total Detected Flood Surface
                  </span>
                  <span className="text-xl font-bold font-mono text-red-400 mt-1 block">
                    {post.detected_inundated_area_sqkm || 34.6} km²
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Net Water Expansion
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                    +{post.net_flood_expansion_sqkm || 16.4} km²
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Algorithm: {post.processing_method || 'SAR Backscatter Difference'}</span>
          </div>
        </div>
      </div>

      {/* Upstream Terrain, Landslides & GLOF Hazards */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Flash Floods, Steep Terrain & Upstream Catchment Hazard Propagation
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Tagged by verified observation status
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hazards.map((haz) => (
            <div
              key={haz.hazard_id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{haz.hazard_id}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      haz.data_status.includes('OBSERVED')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : haz.data_status.includes('ESTIMATED')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    [{haz.data_status.replace(/_/g, ' ')}]
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{haz.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{haz.region}</p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Slope Angle:</span>
                    <strong className="text-white font-mono">{haz.metrics.slope_angle_deg}°</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Rainfall Accum:</span>
                    <strong className="text-sky-400 font-mono">{haz.metrics.accumulated_rainfall_mm_24h} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Landslide Hazard:</span>
                    <strong className="text-amber-400 text-[10px]">{haz.metrics.landslide_susceptibility_index}</strong>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-300">
                  <strong className="text-slate-400 block text-[10px] uppercase font-semibold">Downstream Impact:</strong>
                  {haz.downstream_exposure}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                Action: <strong className="text-slate-200">{haz.recommended_action}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
