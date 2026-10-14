import React from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Truck,
  PhoneCall,
} from 'lucide-react';

export default function RescueOperationsView({
  rescueSectors,
  onSelectSector,
  onDispatchAlert,
}) {
  const sectors = rescueSectors || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
              MUNICIPAL DISASTER RESPONSE GRID
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Prioritized Evacuation & Resource Allocation
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Settlement Vulnerability & Rescue Prioritization Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by multi-factor risk: water depth + rate of rise + population density + road accessibility.
          </p>
        </div>

        <div className="text-xs text-slate-300 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono shrink-0">
          Total Queue: {sectors.length} Priority Sectors
        </div>
      </div>

      {/* Priority Sectors Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sectors.map((sec) => {
          const isRank1 = sec.priority_rank === 1;
          const isRank2 = sec.priority_rank === 2;

          return (
            <div
              key={sec.sector_id}
              className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition ${
                isRank1
                  ? 'bg-red-950/20 border-red-500/40'
                  : isRank2
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-[#0f172a] border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isRank1
                          ? 'bg-red-500 text-white'
                          : isRank2
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {sec.priority_rank}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {sec.sector_id}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isRank1
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : isRank2
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {sec.urgency.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{sec.name}</h3>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>
                    Depth: <strong className="text-white font-mono">{sec.current_water_depth_cm} cm</strong>
                  </span>
                  <span>
                    Trend: <strong className="text-amber-400 font-mono">{sec.water_trend}</strong>
                  </span>
                  <span>
                    Vulnerability: <strong className="text-red-400 font-mono">{sec.vulnerability_score}/10</strong>
                  </span>
                </div>

                {/* Population Exposure */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> Exposed Population
                    </span>
                    <strong className="text-white font-mono">{sec.estimated_population_exposed.toLocaleString()} citizens</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1 pt-1 border-t border-slate-800/60">
                    <span>Infants & Elderly: <strong className="text-slate-200">{sec.high_risk_groups.infants_and_elderly}</strong></span>
                    <span>Mobility Impaired: <strong className="text-amber-400">{sec.high_risk_groups.mobility_impaired}</strong></span>
                  </div>
                </div>

                {/* Road Corridor Status */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-start gap-1.5 text-red-300 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span><strong>Blocked Corridor:</strong> {sec.road_network_status.blocked_corridor}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-emerald-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Safe Evacuation Route:</strong> {sec.road_network_status.safe_evacuation_corridor}</span>
                  </div>
                </div>

                {/* Shelter & Emergency Hospital */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[9px] font-semibold">Nearest Shelter</span>
                    <strong className="text-white truncate block">{sec.nearest_safe_shelter.name}</strong>
                    <span className="text-slate-400 text-[10px]">
                      Capacity: {sec.nearest_safe_shelter.capacity} ({sec.nearest_safe_shelter.current_occupancy} used)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block uppercase text-[9px] font-semibold">Trauma Hospital</span>
                    <strong className="text-white truncate block">{sec.nearest_emergency_hospital.name}</strong>
                    <span className="text-emerald-400 text-[10px]">
                      {sec.nearest_emergency_hospital.ambulances_available} Ambulances Stationed
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 truncate">
                  Team: <strong className="text-slate-300">{sec.recommended_drf_team}</strong>
                </div>
                <button
                  onClick={() => onDispatchAlert(sec)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Alert First Responders
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
