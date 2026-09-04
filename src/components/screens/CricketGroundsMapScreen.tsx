// Source: Google Maps Platform Code Assist
// Internal Usage Attribution: gmp_mcp_codeassist_v1_aistudio
import React, { useState, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { ScreenType, CricketGroundVenue, VenueCategory } from '../../types';
import { mockCricketVenues, calculateDistanceKm } from '../../data/cricketVenuesData';

interface CricketGroundsMapScreenProps {
  onNavigate: (screen: ScreenType, initialContext?: any) => void;
  onBack?: () => void;
}

export const CricketGroundsMapScreen: React.FC<CricketGroundsMapScreenProps> = ({
  onNavigate,
  onBack
}) => {
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [userCustomKey, setUserCustomKey] = useState<string>(() => {
    try {
      return localStorage.getItem('pitch_precision_gmp_key') || '';
    } catch {
      return '';
    }
  });

  const activeApiKey = userCustomKey.trim() || envKey.trim();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>('venue-lords-mcc');
  const [activeCenter, setActiveCenter] = useState<{ lat: number; lng: number }>({
    lat: 51.529972,
    lng: -0.172556
  });
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [showKeyConfigModal, setShowKeyConfigModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');

  // InfoWindow anchor marker ref
  const [selectedMarkerRef, selectedMarker] = useAdvancedMarkerRef();

  // Filtered venues
  const filteredVenues = useMemo(() => {
    return mockCricketVenues.filter((venue) => {
      const matchesCategory =
        selectedCategory === 'All' || venue.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        venue.name.toLowerCase().includes(q) ||
        venue.city.toLowerCase().includes(q) ||
        venue.country.toLowerCase().includes(q) ||
        venue.pitchSurface.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedVenue = useMemo(() => {
    return mockCricketVenues.find((v) => v.id === selectedVenueId) || null;
  }, [selectedVenueId]);

  // Categories list
  const categories = ['All', 'High Performance Academy', 'International Stadium', 'Indoor Cricket Centre', 'Club Practice Nets'];

  // Handle locate user
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Acquiring GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setActiveCenter(coords);
        setZoomLevel(13);
        setIsLocating(false);
        setLocationStatus('Centered to your GPS position.');
        setTimeout(() => setLocationStatus(null), 3000);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`Location error: ${err.message}`);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Save API Key
  const handleSaveApiKey = () => {
    try {
      localStorage.setItem('pitch_precision_gmp_key', tempKeyInput.trim());
    } catch {
      // safe fallback
    }
    setUserCustomKey(tempKeyInput.trim());
    setShowKeyConfigModal(false);
  };

  const handleClearApiKey = () => {
    try {
      localStorage.removeItem('pitch_precision_gmp_key');
    } catch {
      // safe fallback
    }
    setUserCustomKey('');
    setTempKeyInput('');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#0b0f19] overflow-hidden">
      {/* Top Controls Bar */}
      <header className="z-20 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#c3f400]/20 p-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 max-w-7xl mx-auto">
          {/* Title & Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack || (() => onNavigate('work'))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
              title="Return"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[22px]">stadium</span>
                <h1 className="text-base sm:text-lg font-bold font-headline text-white tracking-wide">
                  Grounds & Nets Locator
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 rounded-full">
                  Google Maps Platform
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Locate certified practice turf nets, high-performance academies, and match venues
              </p>
            </div>
          </div>

          {/* Quick Action Badges / API Key Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isLocating ? 'sync' : 'my_location'}
              </span>
              <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isDrawerOpen ? 'map' : 'view_list'}
              </span>
              <span>{isDrawerOpen ? 'Hide List' : 'Show List'}</span>
            </button>

            <button
              onClick={() => setShowKeyConfigModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeApiKey
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {activeApiKey ? 'key' : 'key_off'}
              </span>
              <span>{activeApiKey ? 'API Key Active' : 'Configure Key'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center max-w-7xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search ground, city, or turf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#c3f400]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c3f400] text-black font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {locationStatus && (
          <div className="mt-2 text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded max-w-7xl mx-auto flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>{locationStatus}</span>
          </div>
        )}
      </header>

      {/* Main Content Area (Map + Side Drawer) */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Google Map Container */}
        <div className="relative flex-1 w-full h-full bg-[#111827]">
          {activeApiKey ? (
            <APIProvider apiKey={activeApiKey} libraries={['marker', 'places']}>
              <Map
                id="cricket-grounds-map"
                mapId="DEMO_MAP_ID"
                center={activeCenter}
                zoom={zoomLevel}
                onCameraChanged={(ev) => {
                  setActiveCenter(ev.detail.center);
                  setZoomLevel(ev.detail.zoom);
                }}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Advanced Markers for Venues */}
                {filteredVenues.map((venue) => {
                  const isSelected = selectedVenueId === venue.id;

                  return (
                    <AdvancedMarker
                      key={venue.id}
                      position={{ lat: venue.lat, lng: venue.lng }}
                      title={venue.name}
                      ref={isSelected ? selectedMarkerRef : undefined}
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setActiveCenter({ lat: venue.lat, lng: venue.lng });
                      }}
                    >
                      <Pin
                        background={isSelected ? '#c3f400' : '#1e293b'}
                        borderColor={isSelected ? '#a3e635' : '#475569'}
                        glyphColor={isSelected ? '#020617' : '#c3f400'}
                        scale={isSelected ? 1.25 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* User GPS Marker */}
                {userLocation && (
                  <AdvancedMarker position={userLocation} title="Your Current Location">
                    <div className="relative flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_12px_#3b82f6] animate-pulse" />
                      <div className="absolute -bottom-4 text-[9px] font-bold text-white bg-blue-900/90 px-1.5 py-0.5 rounded shadow">
                        You
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* InfoWindow for Selected Venue */}
                {selectedVenue && selectedMarker && (
                  <InfoWindow
                    anchor={selectedMarker}
                    onCloseClick={() => setSelectedVenueId(null)}
                  >
                    <div className="p-1 max-w-[280px] sm:max-w-[320px] text-slate-900">
                      <div className="flex items-start justify-between gap-2 border-b pb-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {selectedVenue.category}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 mt-1 leading-tight">
                            {selectedVenue.name}
                          </h3>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {selectedVenue.city}, {selectedVenue.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                          <span>★</span>
                          <span>{selectedVenue.rating}</span>
                        </div>
                      </div>

                      {/* Technical Specs */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded border border-slate-200 mb-2">
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Surface</span>
                          <span className="font-semibold text-slate-800">{selectedVenue.pitchSurface}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Bounce Profile</span>
                          <span className="font-semibold text-slate-800">{selectedVenue.pitchPaceRating}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Practice Bays</span>
                          <span className="font-semibold text-slate-800">{selectedVenue.netBaysCount} Lanes</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Telemetry</span>
                          <span className="font-semibold text-slate-800">
                            {selectedVenue.hasSpeedGunRadar ? 'Radar Active' : 'Manual'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 italic mb-2 line-clamp-2">
                        "{selectedVenue.notes}"
                      </p>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            `${selectedVenue.lat},${selectedVenue.lng}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">directions</span>
                          <span>Directions</span>
                        </a>

                        <button
                          onClick={() => {
                            onNavigate('record');
                          }}
                          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">sports_cricket</span>
                          <span>Log Session</span>
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* Elegant Fallback Visualizer when API Key is pending */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19]">
              <div className="max-w-md p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#c3f400]/15 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[32px]">map</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-headline">
                    Google Maps Platform Integration
                  </h2>
                  <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                    Pitch Precision integrates certified cricket practice venues and high-performance academies via the modern Google Maps JavaScript API with AdvancedMarkerElement.
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-xs text-amber-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Ready for your API Key or Maps Demo Key</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    Set <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">VITE_GOOGLE_MAPS_API_KEY</code> in your environment, or enter your key directly to activate the live interactive Google Map tile engine.
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setShowKeyConfigModal(true)}
                    className="px-4 py-2 bg-[#c3f400] text-black font-bold text-xs rounded-xl hover:bg-[#b0dc00] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>Enter API Key</span>
                  </button>
                  <button
                    onClick={() => {
                      // Demo key link instructions
                      window.open('https://mapsplatform.google.com/maps-demo-key', '_blank');
                    }}
                    className="px-4 py-2 bg-white/10 text-white font-semibold text-xs rounded-xl hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    <span>Get Maps Demo Key</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Map Zoom/Re-center HUD */}
          {activeApiKey && (
            <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/20 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 1, 2))}
                className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/20 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <button
                onClick={() => {
                  setActiveCenter({ lat: 51.529972, lng: -0.172556 });
                  setZoomLevel(12);
                  setSelectedVenueId('venue-lords-mcc');
                }}
                className="w-10 h-10 rounded-xl bg-slate-900/90 border border-[#c3f400]/40 text-[#c3f400] flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                title="Reset to Lord's"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
            </div>
          )}
        </div>

        {/* Side Drawer with Venues List */}
        {isDrawerOpen && (
          <aside className="w-full sm:w-80 md:w-96 h-full bg-[#0d1424] border-l border-white/10 flex flex-col z-20 shadow-2xl">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#c3f400] text-[18px]">domain</span>
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  Venues & Academies ({filteredVenues.length})
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredVenues.map((venue) => {
                const isSelected = selectedVenueId === venue.id;
                const distance = userLocation
                  ? calculateDistanceKm(userLocation.lat, userLocation.lng, venue.lat, venue.lng)
                  : null;

                return (
                  <div
                    key={venue.id}
                    onClick={() => {
                      setSelectedVenueId(venue.id);
                      setActiveCenter({ lat: venue.lat, lng: venue.lng });
                      setZoomLevel(14);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#c3f400]/10 border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isSelected ? 'text-[#c3f400]' : 'text-white'
                        }`}
                      >
                        {venue.name}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-400 shrink-0">
                        ★ {venue.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{venue.city}, {venue.country}</span>
                      {distance !== null && (
                        <span className="text-blue-400 font-medium">· {distance} km away</span>
                      )}
                    </div>

                    {/* Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">
                        {venue.pitchSurface}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {venue.netBaysCount} Net Lanes
                      </span>
                      {venue.hasSpeedGunRadar && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          Radar Speed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 truncate">{venue.address}</span>
                      <span className="text-[11px] font-bold text-[#c3f400] shrink-0">View on Map →</span>
                    </div>
                  </div>
                );
              })}

              {filteredVenues.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No venues found matching your filter criteria.
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* API Key Modal */}
      {showKeyConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[24px]">key</span>
                <h3 className="font-bold text-white text-base">Google Maps Platform Key</h3>
              </div>
              <button
                onClick={() => setShowKeyConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Google Maps Platform API Key (or free Maps Demo Key) to enable interactive map rendering, satellite imagery, and navigation.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                API Key
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#c3f400]"
              />
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-[11px] text-blue-300 space-y-1">
              <span className="font-bold block">Testing without a Cloud Billing account?</span>
              <span>
                Use the Google Maps Demo Key for instant prototyping across popular APIs. Visit{' '}
                <a
                  href="https://mapsplatform.google.com/maps-demo-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-blue-200"
                >
                  mapsplatform.google.com/maps-demo-key
                </a>
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {userCustomKey && (
                <button
                  onClick={handleClearApiKey}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  Clear Stored Key
                </button>
              )}
              <button
                onClick={() => setShowKeyConfigModal(false)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 text-xs font-bold bg-[#c3f400] text-black rounded-lg hover:bg-[#b0dc00] transition-colors cursor-pointer"
              >
                Save & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
