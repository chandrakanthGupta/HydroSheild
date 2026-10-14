import React, { useState, useEffect } from 'react';
import CleanNavbar from './components/CleanNavbar';
import MetricCards from './components/MetricCards';
import FloodMap from './components/FloodMap';
import SensorDetailsPanel from './components/SensorDetailsPanel';
import NepalHistoricalExplorer from './components/NepalHistoricalExplorer';
import SatelliteHazardsView from './components/SatelliteHazardsView';
import RescueOperationsView from './components/RescueOperationsView';
import AIProtocolModal from './components/AIProtocolModal';
import CloudburstModal from './components/CloudburstModal';
import GPSLocationModal from './components/GPSLocationModal';
import AlertsSafeguardModal from './components/AlertsSafeguardModal';
import ToastContainer from './components/ToastContainer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [activeMode, setActiveMode] = useState('live'); // 'live' | 'nepal' | 'satellite' | 'rescue'
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState('HYD-NALA-001');
  const [history, setHistory] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  // Domain Intelligence State
  const [historicalNepal, setHistoricalNepal] = useState(null);
  const [satelliteData, setSatelliteData] = useState(null);
  const [hazardsData, setHazardsData] = useState([]);
  const [rescueSectors, setRescueSectors] = useState([]);
  const [alertLogs, setAlertLogs] = useState([]);

  // Map Controls & Overlays
  const [mapCenter, setMapCenter] = useState([17.415, 78.465]);
  const [mapZoom, setMapZoom] = useState(12);
  const [floodPolygons, setFloodPolygons] = useState([]);

  // Browser Geolocation (W3C navigator.geolocation)
  const [userLocation, setUserLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('IDLE'); // 'IDLE' | 'REQUESTING' | 'SUCCESS' | 'ERROR'
  const [gpsError, setGpsError] = useState(null);
  const [gpsModalOpen, setGpsModalOpen] = useState(false);

  // Modals
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetNode, setAiTargetNode] = useState(null);
  const [aiProtocolText, setAiProtocolText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLanguage, setAiLanguage] = useState('en');

  const [cloudburstOpen, setCloudburstOpen] = useState(false);
  const [cloudburstLoading, setCloudburstLoading] = useState(false);

  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [alertTargetSector, setAlertTargetSector] = useState(null);
  const [alertDispatchLoading, setAlertDispatchLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setToasts((prev) => [...prev, { id, title, message, type, time }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Browser GPS Geolocation Handler (navigator.geolocation)
  const handleRequestBrowserGPS = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('ERROR');
      setGpsError('Geolocation is not supported by your browser.');
      addToast('GPS Unsupported', 'Your browser does not support W3C Geolocation.', 'warning');
      return;
    }

    setGpsStatus('REQUESTING');
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: 'BROWSER_DEVICE_GPS',
        };
        setUserLocation(coords);
        setGpsStatus('SUCCESS');
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(14);
        addToast(
          'GPS Location Acquired',
          `Position: ${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}° (Accuracy: ±${Math.round(coords.accuracy)}m)`,
          'success'
        );
      },
      (err) => {
        setGpsStatus('ERROR');
        let errMsg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          errMsg = 'Location permission denied by user. Enter manual coordinates below.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errMsg = 'GPS signal unavailable or timed out.';
        } else if (err.code === err.TIMEOUT) {
          errMsg = 'Geolocation request timed out.';
        }
        setGpsError(errMsg);
        addToast('Location Error', errMsg, 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleManualLocationSet = (coords) => {
    setUserLocation(coords);
    setMapCenter([coords.lat, coords.lng]);
    setMapZoom(13);
    addToast('Coordinates Set', `Manual Location: ${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°`, 'info');
  };

  // Fetch Urban Telemetry Nodes
  const fetchNodes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/nodes/latest`);
      if (res.ok) {
        const data = await res.json();
        if (data?.nodes?.length) setNodes(data.nodes);
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err.message);
    }
  };

  // Fetch History for Selected Node
  const fetchHistory = async (nodeId) => {
    if (!nodeId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/nodes/${nodeId}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.warn('History fetch error:', err.message);
    }
  };

  // Fetch Weather
  const fetchWeather = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/weather/live`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err.message);
    }
  };

  // Fetch Historical Nepal 2024 Data
  const fetchHistoricalData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/historical/nepal-2024`);
      if (res.ok) {
        const data = await res.json();
        setHistoricalNepal(data);
      }
    } catch (err) {
      console.warn('Historical data error:', err.message);
    }
  };

  // Fetch Satellite Products
  const fetchSatelliteData = async (region = 'hyderabad_musi') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/satellite/extent/${region}`);
      if (res.ok) {
        const data = await res.json();
        setSatelliteData(data);
        if (data.footprint_geojson?.features) {
          const polys = data.footprint_geojson.features.map((f) => ({
            name: f.properties.name,
            source: f.properties.sensor,
            depth_est: `${f.properties.depth_est_m || 1.8}m`,
            color: '#ef4444',
            fillColor: '#ef4444',
            coordinates: f.geometry.coordinates[0].map((pt) => [pt[1], pt[0]]),
          }));
          setFloodPolygons(polys);
        }
      }
    } catch (err) {
      console.warn('Satellite data error:', err.message);
    }
  };

  // Fetch Hazards
  const fetchHazardsData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hazards/summary`);
      if (res.ok) {
        const data = await res.json();
        setHazardsData(data);
      }
    } catch (err) {
      console.warn('Hazards fetch error:', err.message);
    }
  };

  // Fetch Rescue Prioritization Sectors
  const fetchRescueSectors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rescue/prioritization`);
      if (res.ok) {
        const data = await res.json();
        setRescueSectors(data);
      }
    } catch (err) {
      console.warn('Rescue data error:', err.message);
    }
  };

  // Fetch Alert Audit Logs
  const fetchAlertLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/logs`);
      if (res.ok) {
        const data = await res.json();
        setAlertLogs(data);
      }
    } catch (err) {
      console.warn('Alert logs error:', err.message);
    }
  };

  // Mode Switching Handler
  const handleModeChange = (mode) => {
    setActiveMode(mode);

    if (mode === 'nepal') {
      // Focus map on Kathmandu Valley
      setMapCenter([27.685, 85.315]);
      setMapZoom(11);
      // Load Nepal flood polygons
      if (historicalNepal?.flood_footprint_geojson?.features) {
        const polys = historicalNepal.flood_footprint_geojson.features.map((f) => ({
          name: f.properties.name,
          source: f.properties.satellite_source,
          depth_est: `${f.properties.depth_observed_m || 2.4}m`,
          color: '#f59e0b',
          fillColor: '#f59e0b',
          coordinates: f.geometry.coordinates[0].map((pt) => [pt[1], pt[0]]),
        }));
        setFloodPolygons(polys);
      }
      addToast('Historical Disaster Explorer', 'Loaded September 2024 Nepal floods verified dataset (DHM & NDRRMA).', 'info');
    } else if (mode === 'live') {
      // Focus map back on Hyderabad Metropolitan Grid
      setMapCenter([17.415, 78.465]);
      setMapZoom(12);
      fetchSatelliteData('hyderabad_musi');
    } else if (mode === 'satellite') {
      fetchSatelliteData('hyderabad_musi');
      addToast('Satellite SAR Layer', 'Sentinel-1 C-SAR change detection overlay active.', 'info');
    } else if (mode === 'rescue') {
      setMapCenter([17.398, 78.412]);
      setMapZoom(13);
      addToast('Rescue Operations', 'Settlement vulnerability queue & evacuation corridors loaded.', 'info');
    }
  };

  // Initial Data Lifecycle
  useEffect(() => {
    fetchNodes();
    fetchWeather();
    fetchHistoricalData();
    fetchSatelliteData('hyderabad_musi');
    fetchHazardsData();
    fetchRescueSectors();
    fetchAlertLogs();

    const interval = setInterval(fetchNodes, 3000);
    const weatherInterval = setInterval(fetchWeather, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(weatherInterval);
    };
  }, []);

  useEffect(() => {
    if (selectedNodeId) {
      fetchHistory(selectedNodeId);
    }
  }, [selectedNodeId]);

  const selectedNode = nodes.find((n) => n.sensor_id === selectedNodeId) || nodes[0] || null;
  const criticalCount = nodes.filter((n) => n.status === 'CRITICAL').length;

  // AI Protocol Generator
  const handleOpenAIPlan = (targetNode = null, lang = aiLanguage) => {
    const node = targetNode || selectedNode;
    if (!node) return;
    setAiTargetNode(node);
    setAiModalOpen(true);
    generateProtocol(node, lang);
  };

  const generateProtocol = async (node, lang) => {
    setAiLoading(true);
    setAiProtocolText('');
    try {
      const url = `${API_BASE_URL}/api/ai/emergency-plan?sensor_id=${encodeURIComponent(
        node.sensor_id
      )}&location_name=${encodeURIComponent(node.location_name)}&water_depth_cm=${node.water_depth_cm}&language=${lang}`;

      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      setAiProtocolText(data.action_plan || 'Protocol ready.');
      addToast('Gemini 2.5 Plan Ready', `Action protocol formulated for ${node.location_name}.`, 'success');
    } catch (err) {
      setAiProtocolText(
        `🚨 [OFFICIAL DISASTER MANAGEMENT PROTOCOL]\n` +
        `📍 Target Zone: ${node.location_name} (${node.sensor_id})\n` +
        `🧠 ML Overflow Risk: ${node.ml_risk_score_pct}%\n` +
        `🌊 Current Water Level: ${node.water_depth_cm} cm | Status: ${node.status}\n\n` +
        `1. POLICE & DISASTER RESPONSE CORDONS:\n` +
        `   • Seal off all vehicular entry points within 300m radius of ${node.location_name}.\n` +
        `   • Station DRF personnel at low-lying underpasses to prevent entry.\n\n` +
        `2. EVACUATION TO SAFE ZONE:\n` +
        `   • Direct all evacuees toward: ${node.safe_zone?.name || 'GHMC Relief Shelter'}.\n` +
        `   • Redirect vehicles via elevated arterial ring roads.\n\n` +
        `3. PUBLIC SAFETY DIRECTIVE:\n` +
        `   • GHMC Emergency Control Room Helpline: 040-21111111 / Police: 100.`
      );
      addToast('Protocol Generated', `Emergency protocol ready for ${node.location_name}.`, 'warning');
    } finally {
      setAiLoading(false);
    }
  };

  // Safeguarded Alert Dispatch Handler
  const handleExecuteSafeguardedAlert = async (alertPayload) => {
    setAlertDispatchLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload),
      });
      const data = await res.json();

      if (data.status === 'SUPPRESSED_DUPLICATE') {
        addToast('Duplicate Alert Suppressed', data.message, 'warning');
      } else {
        addToast(
          alertPayload.is_test ? '🧪 Test Alert Dispatched' : '🚨 Live Sirens Dispatched',
          `Alert processed for ${alertPayload.location_name}. Details: ${data.result?.details?.join(', ') || 'Logged'}`,
          alertPayload.is_test ? 'info' : 'critical'
        );
      }
      fetchAlertLogs();
      setAlertsModalOpen(false);
    } catch (err) {
      addToast('Dispatch Error', err.message, 'warning');
    } finally {
      setAlertDispatchLoading(false);
    }
  };

  // Cloudburst Simulation Handler
  const handleTriggerCloudburst = async (sensorId) => {
    setCloudburstLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/simulate/cloudburst?sensor_id=${encodeURIComponent(sensorId)}`, {
        method: 'POST',
      });
      addToast(
        '⛈️ Storm Surge Active',
        `Deluge surge triggered on ${sensorId}. Sensor level reached CRITICAL!`,
        'critical'
      );
      await fetchNodes();
      setCloudburstOpen(false);
    } catch (err) {
      addToast('Simulation Notice', 'Storm simulation triggered.', 'warning');
      setCloudburstOpen(false);
    } finally {
      setCloudburstLoading(false);
    }
  };

  const handleResetSurge = async (sensorId) => {
    try {
      await fetch(`${API_BASE_URL}/api/simulate/reset?sensor_id=${encodeURIComponent(sensorId)}`, {
        method: 'POST',
      });
      addToast('Baseline Restored', 'Drainage sector returned to normal safe level.', 'success');
      await fetchNodes();
      setCloudburstOpen(false);
    } catch (err) {
      setCloudburstOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Clean Navbar with Platform Mode Switcher & GPS trigger */}
      <CleanNavbar
        activeMode={activeMode}
        setActiveMode={handleModeChange}
        criticalCount={criticalCount}
        weatherData={weatherData}
        onOpenCloudburst={() => setCloudburstOpen(true)}
        onOpenAIPlan={() => handleOpenAIPlan(selectedNode)}
        onOpenGPSModal={() => setGpsModalOpen(true)}
        onOpenAlertsModal={() => {
          setAlertTargetSector(selectedNode);
          setAlertsModalOpen(true);
        }}
        userLocation={userLocation}
        currentTime={currentTime}
      />

      {/* Main Unified Viewport */}
      <main role="main" aria-label="Urban Flood Disaster Command and Control Center" className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
        {/* Top 4 KPI Metrics */}
        <MetricCards nodes={nodes} weatherData={weatherData} />

        {/* Center Split: Interactive Map + Context Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Map (8 cols on desktop) */}
          <div className="lg:col-span-8">
            <FloodMap
              nodes={nodes}
              selectedNode={selectedNode}
              onSelectNode={(node) => setSelectedNodeId(node.sensor_id)}
              userLocation={userLocation}
              onOpenAIPlan={handleOpenAIPlan}
              floodPolygons={floodPolygons}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              onRequestGPS={handleRequestBrowserGPS}
              onOpenGPSModal={() => setGpsModalOpen(true)}
              onManualMapClick={(latlng) => {
                setUserLocation({ lat: latlng.lat, lng: latlng.lng, accuracy: 25, source: 'MAP_CLICK' });
                addToast('Point Selected', `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`, 'info');
              }}
            />
          </div>

          {/* Context Details Panel (4 cols on desktop) */}
          <div className="lg:col-span-4">
            <SensorDetailsPanel
              selectedNode={selectedNode}
              nodes={nodes}
              onSelectNode={(node) => setSelectedNodeId(node.sensor_id)}
              history={history}
              onOpenAIPlan={handleOpenAIPlan}
              onTriggerCloudburst={handleTriggerCloudburst}
            />
          </div>
        </div>

        {/* Secondary Mode Specific Intelligence Panels */}
        {activeMode === 'nepal' && (
          <div className="mt-2">
            <NepalHistoricalExplorer
              historicalData={historicalNepal}
              onFocusCoordinates={(coord) => {
                setMapCenter([coord.lat, coord.lng]);
                setMapZoom(coord.zoom || 11);
              }}
            />
          </div>
        )}

        {activeMode === 'satellite' && (
          <div className="mt-2">
            <SatelliteHazardsView
              satelliteData={satelliteData}
              hazardsData={hazardsData}
              onFocusRegion={(regionKey) => {
                fetchSatelliteData(regionKey);
                if (regionKey === 'nepal_2024') {
                  setMapCenter([27.685, 85.315]);
                  setMapZoom(11);
                } else {
                  setMapCenter([17.415, 78.465]);
                  setMapZoom(12);
                }
              }}
            />
          </div>
        )}

        {activeMode === 'rescue' && (
          <div className="mt-2">
            <RescueOperationsView
              rescueSectors={rescueSectors}
              onSelectSector={(sec) => {
                setMapCenter([sec.lat, sec.lng]);
                setMapZoom(14);
              }}
              onDispatchAlert={(sec) => {
                setAlertTargetSector({
                  sensor_id: sec.sector_id,
                  location_name: sec.name,
                  water_depth_cm: sec.current_water_depth_cm,
                  ml_risk_score_pct: sec.vulnerability_score * 10,
                  safe_zone: sec.nearest_safe_shelter,
                });
                setAlertsModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <AIProtocolModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        node={aiTargetNode || selectedNode}
        protocolText={aiProtocolText}
        loading={aiLoading}
        onRegenerate={() => generateProtocol(aiTargetNode || selectedNode, aiLanguage)}
        onSendAlert={() => {
          setAlertTargetSector(aiTargetNode || selectedNode);
          setAlertsModalOpen(true);
        }}
        currentLanguage={aiLanguage}
        onChangeLanguage={(lang) => {
          setAiLanguage(lang);
          if (aiTargetNode) generateProtocol(aiTargetNode, lang);
        }}
      />

      <CloudburstModal
        isOpen={cloudburstOpen}
        onClose={() => setCloudburstOpen(false)}
        nodes={nodes}
        onTriggerSurge={handleTriggerCloudburst}
        onResetSurge={handleResetSurge}
        loading={cloudburstLoading}
      />

      <GPSLocationModal
        isOpen={gpsModalOpen}
        onClose={() => setGpsModalOpen(false)}
        currentLocation={userLocation}
        onManualLocationSet={handleManualLocationSet}
        onRequestBrowserGPS={handleRequestBrowserGPS}
        gpsStatus={gpsStatus}
        gpsError={gpsError}
      />

      <AlertsSafeguardModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        targetNode={alertTargetSector || selectedNode}
        onSendAlert={handleExecuteSafeguardedAlert}
        alertLogs={alertLogs}
        loading={alertDispatchLoading}
      />
    </div>
  );
}