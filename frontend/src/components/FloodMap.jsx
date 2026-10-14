import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Circle,
  useMap,
  useMapEvents,
  Tooltip as LeafletTooltip,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Shield,
  Navigation,
  Crosshair,
  Layers,
  MapPin,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

// Controller component to programmatically pan/zoom map
function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Map Click Listener for Manual Coordinate Selection
function MapClickListener({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Custom Clean Markers
const createSensorIcon = (status, isSelected) => {
  let bg = '#10b981';
  let pulse = '';

  if (status === 'CRITICAL') {
    bg = '#ef4444';
    pulse = 'marker-critical';
  } else if (status === 'WARNING') {
    bg = '#f59e0b';
    pulse = 'marker-warning';
  }

  const size = isSelected ? 26 : 20;

  return new L.DivIcon({
    className: 'custom-sensor-marker',
    html: `
      <div class="${pulse}" style="
        background: ${bg};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      ">
        <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const safeZoneIcon = new L.DivIcon({
  className: 'custom-safezone-marker',
  html: `
    <div style="
      background: #2563eb;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
    ">
      🛡️
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const userGpsIcon = new L.DivIcon({
  className: 'custom-user-gps-marker',
  html: `
    <div style="
      background: #0ea5e9;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 12px #0ea5e9;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11],
});

export default function FloodMap({
  nodes,
  selectedNode,
  onSelectNode,
  userLocation,
  onOpenAIPlan,
  floodPolygons,
  mapCenter,
  mapZoom,
  onRequestGPS,
  onOpenGPSModal,
  onManualMapClick,
}) {
  const [showRoutes, setShowRoutes] = useState(true);
  const [showSatFootprint, setShowSatFootprint] = useState(true);
  const [tileError, setTileError] = useState(false);

  // Standard OpenStreetMap Tile URL with zero CARTO API keys
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const centerCoord = mapCenter || (selectedNode ? [selectedNode.lat, selectedNode.lng] : [17.415, 78.465]);
  const currentZoom = mapZoom || 12;

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-sm flex flex-col">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md text-xs text-slate-300">
          <span className="px-2.5 py-1 font-semibold text-white">GIS Map</span>
          <span className="text-slate-600">|</span>

          {/* Toggle Evacuation Routes */}
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
              showRoutes ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            {showRoutes ? 'Routes' : 'Hide Routes'}
          </button>

          {/* Toggle Satellite Flood Overlay */}
          {floodPolygons && floodPolygons.length > 0 && (
            <button
              onClick={() => setShowSatFootprint(!showSatFootprint)}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                showSatFootprint ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {showSatFootprint ? 'SAR Footprint' : 'Hide SAR'}
            </button>
          )}
        </div>

        {/* GPS Control Group */}
        <div className="pointer-events-auto flex items-center gap-2">
          {userLocation ? (
            <button
              onClick={() => {
                if (onRequestGPS) onRequestGPS();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-semibold backdrop-blur-md shadow-md"
              title="Center on My GPS Location"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Centered on GPS (±{Math.round(userLocation.accuracy || 20)}m)</span>
            </button>
          ) : (
            <button
              onClick={onOpenGPSModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold backdrop-blur-md shadow-md transition"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Use My Location (GPS)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tile Error Warning Banner if offline */}
      {tileError && (
        <div className="absolute bottom-12 left-4 z-[500] px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Notice: Re-fetching map tiles from standard OpenStreetMap cache.</span>
        </div>
      )}

      {/* Leaflet Map */}
      <div className="w-full flex-1 relative">
        <MapContainer
          center={centerCoord}
          zoom={currentZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Map Center & Pan Controller */}
          <MapCenterController center={centerCoord} zoom={currentZoom} />

          {/* Map Click Listener */}
          <MapClickListener onMapClick={onManualMapClick} />

          {/* Standard OpenStreetMap TileLayer with zero CARTO dependencies */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
            eventHandlers={{
              tileerror: () => setTileError(true),
              tileload: () => setTileError(false),
            }}
          />

          {/* User's Browser GPS Location Pin & Accuracy Circle */}
          {userLocation && (
            <>
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userGpsIcon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <strong className="text-sky-400 block mb-0.5">Your Current Location</strong>
                    <span className="font-mono text-slate-300 block">
                      {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Accuracy: &plusmn;{Math.round(userLocation.accuracy || 20)} meters (W3C Geolocation)
                    </span>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy || 80}
                pathOptions={{
                  color: '#0ea5e9',
                  fillColor: '#0ea5e9',
                  fillOpacity: 0.12,
                  weight: 1,
                }}
              />
            </>
          )}

          {/* Satellite Detected Flood Polygons (Sentinel-1 SAR / Nepal Flood Footprints) */}
          {showSatFootprint &&
            floodPolygons &&
            floodPolygons.map((poly, idx) => (
              <Polygon
                key={`sat-flood-${idx}`}
                positions={poly.coordinates}
                pathOptions={{
                  color: poly.color || '#ef4444',
                  fillColor: poly.fillColor || '#ef4444',
                  fillOpacity: 0.28,
                  weight: 2,
                  dashArray: '4, 4',
                }}
              >
                <LeafletTooltip sticky>
                  <div className="text-xs font-sans">
                    <strong className="text-red-400 block">{poly.name || 'Satellite Detected Flood Zone'}</strong>
                    <span className="text-slate-300 block">{poly.source || 'Sentinel-1 SAR Change Detection'}</span>
                    <span className="text-[10px] text-slate-400 block">Depth est: {poly.depth_est || '1.8m'}</span>
                  </div>
                </LeafletTooltip>
              </Polygon>
            ))}

          {/* Safe Zone Routes (Polylines) */}
          {showRoutes &&
            nodes.map((node) => {
              if (!node.safe_zone?.lat) return null;
              const isCrit = node.status === 'CRITICAL';
              return (
                <Polyline
                  key={`route-${node.sensor_id}`}
                  positions={[
                    [node.lat, node.lng],
                    [node.safe_zone.lat, node.safe_zone.lng],
                  ]}
                  pathOptions={{
                    color: isCrit ? '#ef4444' : '#38bdf8',
                    weight: isCrit ? 2.5 : 1.5,
                    dashArray: '5, 8',
                    opacity: isCrit ? 0.9 : 0.6,
                  }}
                >
                  <LeafletTooltip sticky>
                    <span className="text-xs font-sans">
                      Evacuation Corridor: {node.location_name} &rarr; {node.safe_zone.name}
                    </span>
                  </LeafletTooltip>
                </Polyline>
              );
            })}

          {/* Safe Zone Shelters */}
          {showRoutes &&
            nodes.map((node) => {
              if (!node.safe_zone?.lat) return null;
              return (
                <Marker
                  key={`safe-${node.sensor_id}`}
                  position={[node.safe_zone.lat, node.safe_zone.lng]}
                  icon={safeZoneIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="flex items-center gap-1 text-blue-400 text-xs font-bold uppercase">
                        <Shield className="w-3.5 h-3.5" /> High-Ground Safe Haven
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{node.safe_zone.name}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Designated relief shelter for {node.location_name}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Sensor Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.sensor_id === node.sensor_id;
            return (
              <Marker
                key={node.sensor_id}
                position={[node.lat, node.lng]}
                icon={createSensorIcon(node.status, isSelected)}
                eventHandlers={{
                  click: () => onSelectNode(node),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-xs font-bold text-white">{node.sensor_id}</span>
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

                    <h4 className="text-xs font-semibold text-slate-200">{node.location_name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{node.drf_unit}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Depth</span>
                        <strong className="text-white font-mono">{node.water_depth_cm} cm</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Clearance</span>
                        <strong className="text-sky-400 font-mono">{node.water_clearance_cm} cm</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectNode(node)}
                      className="w-full mt-2.5 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                    >
                      Inspect Chokepoint
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="px-4 py-2 bg-[#0d1322] border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Normal Level (&lt; 100 cm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Warning Level (100 - 180 cm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span> Critical Overflow (&gt; 180 cm)
          </span>
          <span className="flex items-center gap-1.5">
            <span>🛡️</span> High-Ground Shelter
          </span>
          {userLocation && (
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> You (GPS)
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-500">
          Standard OpenStreetMap Tiles (No API Key Required)
        </div>
      </div>
    </div>
  );
}
