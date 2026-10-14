import React, { useState } from 'react';
import { X, MapPin, Compass, AlertCircle, CheckCircle2, Crosshair } from 'lucide-react';

export default function GPSLocationModal({
  isOpen,
  onClose,
  currentLocation,
  onManualLocationSet,
  onRequestBrowserGPS,
  gpsStatus,
  gpsError,
}) {
  const [latInput, setLatInput] = useState(currentLocation?.lat ? String(currentLocation.lat) : '17.3850');
  const [lngInput, setLngInput] = useState(currentLocation?.lng ? String(currentLocation.lng) : '78.4867');

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onManualLocationSet({ lat, lng, accuracy: 50, source: 'MANUAL_COORDINATE_INPUT' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Browser GPS & Location Inspector</h3>
              <p className="text-[11px] text-slate-400">No third-party GPS API key required</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Browser Geolocation Trigger */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300">Option 1: Device Geolocation</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Uses the standard W3C <code>navigator.geolocation</code> browser API. Coordinates stay client-side and are not stored without permission.
            </p>
            <button
              onClick={() => {
                onRequestBrowserGPS();
              }}
              className="mt-1 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Crosshair className="w-4 h-4" />
              Request Device GPS Location
            </button>

            {gpsStatus === 'SUCCESS' && currentLocation && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Retrieved: {currentLocation.lat.toFixed(4)}°, {currentLocation.lng.toFixed(4)}° (±{Math.round(currentLocation.accuracy || 20)}m)
                </span>
              </div>
            )}

            {gpsStatus === 'ERROR' && gpsError && (
              <div className="mt-2 p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{gpsError}</span>
              </div>
            )}
          </div>

          {/* Manual Coordinate Selection Fallback */}
          <form onSubmit={handleManualSubmit} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300">Option 2: Manual Coordinate Fallback</span>
            <p className="text-[11px] text-slate-400">
              Enter specific coordinates if location permission is denied or device GPS is unavailable:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">Latitude</label>
                <input
                  type="text"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="e.g. 17.3850"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">Longitude</label>
                <input
                  type="text"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  placeholder="e.g. 78.4867"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setLatInput('17.3850');
                  setLngInput('78.4867');
                }}
                className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                Hyderabad Grid
              </button>
              <button
                type="button"
                onClick={() => {
                  setLatInput('27.6850');
                  setLngInput('85.3150');
                }}
                className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                Kathmandu Basin
              </button>
              <button
                type="submit"
                className="flex-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition"
              >
                Set Coordinates
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>Standard W3C Geolocation</span>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
