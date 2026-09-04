import React, { useState } from 'react';
import { MatchStat, TechniqueScores, ScreenType, WagonWheelShot, PitchMapDelivery, UserProfile } from '../../types';
import { mockMatches, mockTrainingHistory, mockTechniqueScores, mockUsers } from '../../data/mockData';
import { mockWagonWheelShots, mockPitchMapDeliveries } from '../../data/tacticsAndPlannerData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';
import { PlayerHealthDashboard } from '../health/PlayerHealthDashboard';
import { BeehiveVisualizer } from '../telemetry/BeehiveVisualizer';
import { NetSessionPlaylistFeed } from '../telemetry/NetSessionPlaylistFeed';

interface StatsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  currentUser?: UserProfile;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate, currentUser }) => {
  const activeUser = currentUser || mockUsers.player;
  const [statsView, setStatsView] = useState<'dashboard' | 'health' | 'wagon-wheel' | 'pitch-map' | 'beehive' | 'playlist' | 'history'>('dashboard');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'matches' | 'training'>('matches');
  const [techniqueScores, setTechniqueScores] = useState<TechniqueScores>(mockTechniqueScores);
  const [selectedMatch, setSelectedMatch] = useState<MatchStat | null>(null);

  // Wagon Wheel state
  const [wagonShots, setWagonShots] = useState<WagonWheelShot[]>(mockWagonWheelShots);
  const [wagonFilter, setWagonFilter] = useState<'all' | 'boundaries' | 'singles'>('all');
  const [hoveredShot, setHoveredShot] = useState<WagonWheelShot | null>(null);

  // Pitch Map state
  const [pitchDeliveries, setPitchDeliveries] = useState<PitchMapDelivery[]>(mockPitchMapDeliveries);
  const [pitchFilter, setPitchFilter] = useState<'all' | 'wickets' | 'dots' | 'boundaries'>('all');
  const [hoveredDelivery, setHoveredDelivery] = useState<PitchMapDelivery | null>(null);

  const currentList = activeHistoryTab === 'matches' ? mockMatches : mockTrainingHistory;

  // Radar chart polygon points calculation (Center at 50,50, Radius ~40)
  const maxR = 38;
  const powerY = 50 - (maxR * techniqueScores.power) / 100;
  const timingX = 50 + (maxR * techniqueScores.timing) / 100;
  const placementY = 50 + (maxR * techniqueScores.placement) / 100;
  const footworkX = 50 - (maxR * techniqueScores.footwork) / 100;
  const radarPolygonPoints = `50,${powerY} ${timingX},50 50,${placementY} ${footworkX},50`;

  // Filter Wagon Wheel
  const filteredWagonShots = wagonShots.filter((shot) => {
    if (wagonFilter === 'boundaries') return shot.runs === 4 || shot.runs === 6;
    if (wagonFilter === 'singles') return shot.runs === 1 || shot.runs === 2;
    return true;
  });

  // Filter Pitch Map
  const filteredPitchDeliveries = pitchDeliveries.filter((del) => {
    if (pitchFilter === 'wickets') return del.outcome === 'Wicket';
    if (pitchFilter === 'dots') return del.outcome === 'Dot';
    if (pitchFilter === 'boundaries') return del.outcome === 'Boundary';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 px-4 sm:px-6 max-w-5xl mx-auto pt-3 pb-28 animate-fadeIn">
      {/* Top Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#201f1f] border border-white/10 glass overflow-x-auto">
        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('dashboard');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'dashboard'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Performance Matrix</span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('health');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'health'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          <span>Health & Readiness</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
            statsView === 'health' ? 'bg-[#161e00] text-[#c3f400]' : 'bg-[#c3f400]/20 text-[#c3f400]'
          }`}>
            AI PRO
          </span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('wagon-wheel');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'wagon-wheel'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">radar</span>
          <span>Wagon Wheel (360°)</span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('pitch-map');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'pitch-map'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">scatter_plot</span>
          <span>Bowling Pitch Maps</span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('beehive');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'beehive'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">grid_4x4</span>
          <span>Stumps Beehive & 3D Arc</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
            statsView === 'beehive' ? 'bg-[#161e00] text-[#c3f400]' : 'bg-[#c3f400]/20 text-[#c3f400]'
          }`}>
            PRO
          </span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('playlist');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'playlist'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">video_library</span>
          <span>Net Playlist Feed</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
            statsView === 'playlist' ? 'bg-[#161e00] text-[#c3f400]' : 'bg-[#c3f400]/20 text-[#c3f400]'
          }`}>
            AUTO-SLICER
          </span>
        </button>

        <button
          onClick={() => {
            playBeep(700, 0.04);
            setStatsView('history');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            statsView === 'history'
              ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Match & Log History</span>
        </button>
      </div>

      {/* VIEW 0: PLAYER HEALTH & READINESS (NEW DEDICATED TAB) */}
      {statsView === 'health' && (
        <PlayerHealthDashboard onNavigate={onNavigate} />
      )}

      {/* VIEW 1: PERFORMANCE MATRIX DASHBOARD */}
      {statsView === 'dashboard' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* Health & Readiness Quick Card Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c240d] via-[#201f1f] to-[#122126] glass p-5 border border-[#c3f400]/30 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.3)]">
                  <span className="material-symbols-outlined text-[28px]">favorite</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-white">Player Health & Readiness: 88 / 100</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 font-headline font-bold text-[9px] uppercase tracking-wider">
                      OPTIMAL TIER
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c9ac] mt-0.5">
                    Resting HR: 49 bpm • Sleep: 8.2h (91%) • Workload ACWR: 1.14 (Safe Sweet Spot)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playBeep(800, 0.05);
                  setStatsView('health');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <span>Launch Health Dashboard</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
          {/* Top Player Profile Card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#201f1f] glass p-6 border border-white/10 shadow-xl">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#c3f400]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    className="w-16 h-16 rounded-full object-cover shadow-[0_0_15px_rgba(195,244,0,0.35)] border-2 border-[#c3f400]/30"
                    alt={activeUser.name}
                    src={activeUser.avatar}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#c3f400] rounded-full border-2 border-[#201f1f] shadow-[0_0_8px_#c3f400]" />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline font-bold text-xl text-white truncate">{activeUser.name}</h2>
                    {activeUser.isJunior && (
                      <span className="px-2 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30 text-[9px] font-bold uppercase">
                        Safeguarded
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#c4c9ac] font-medium">{activeUser.specialty}</span>
                  {activeUser.juniorPrivacy?.assignedCoachIds && (
                    <span className="text-[10px] text-[#9cf0ff] font-bold mt-0.5">
                      Coached by: Arin Mishra & Roshan Srilanka
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="bg-[#ffdb3c]/15 text-[#ffdb3c] border border-[#ffdb3c]/30 px-3 py-1 rounded-full font-headline font-bold text-[10px] tracking-wider uppercase shadow-sm">
                    {activeUser.tier || 'ELITE TIER (10,400+ RUNS)'}
                  </span>
                </div>
              </div>

              {/* 4 Circular Metric Gauges: AVG, SR, CONTROL %, ECON */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 text-center">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center">
                  <span className="font-headline font-black text-2xl text-white">62.5</span>
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider mt-0.5">SEASON AVG</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center">
                  <span className="font-headline font-black text-2xl text-[#c3f400]">142.8</span>
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider mt-0.5">STRIKE RATE</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center">
                  <span className="font-headline font-black text-2xl text-[#9cf0ff]">89.2%</span>
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider mt-0.5">CONTROL RATIO</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center">
                  <span className="font-headline font-black text-2xl text-[#ffdb3c]">5.82</span>
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider mt-0.5">BOWLING ECON</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technique Radar Card */}
          <div className="bg-[#201f1f] glass rounded-3xl p-6 flex flex-col gap-4 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-white">Biomechanics & Technique Matrix</h3>
                <span className="text-xs text-[#c4c9ac] hidden sm:inline">(Radar Scoring)</span>
              </div>
              <span className="material-symbols-outlined text-[#c3f400] text-[22px]">insights</span>
            </div>

            <div className="relative w-full aspect-square max-w-[280px] mx-auto my-2">
              <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(195,244,0,0.25)] overflow-visible" viewBox="0 0 100 100">
                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#353534" strokeWidth="1" />
                <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#353534" strokeWidth="1" />
                <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="#353534" strokeWidth="1" />

                <line x1="50" y1="10" x2="50" y2="90" stroke="#353534" strokeWidth="1" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="#353534" strokeWidth="1" />

                <polygon
                  points={radarPolygonPoints}
                  fill="rgba(195, 244, 0, 0.2)"
                  stroke="#c3f400"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                <circle cx="50" cy={powerY} r="3" fill="#c3f400" className="animate-pulse" />
                <circle cx={timingX} cy="50" r="3" fill="#c3f400" className="animate-pulse" />
                <circle cx="50" cy={placementY} r="3" fill="#c3f400" className="animate-pulse" />
                <circle cx={footworkX} cy="50" r="3" fill="#c3f400" className="animate-pulse" />

                <text x="50" y="4" textAnchor="middle" fill="#e5e2e1" fontFamily="Inter" fontSize="6.5" fontWeight="bold">
                  Power ({techniqueScores.power})
                </text>
                <text x="96" y="52" textAnchor="start" fill="#e5e2e1" fontFamily="Inter" fontSize="6.5" fontWeight="bold">
                  Timing ({techniqueScores.timing})
                </text>
                <text x="50" y="99" textAnchor="middle" fill="#e5e2e1" fontFamily="Inter" fontSize="6.5" fontWeight="bold">
                  Placement ({techniqueScores.placement})
                </text>
                <text x="4" y="52" textAnchor="end" fill="#e5e2e1" fontFamily="Inter" fontSize="6.5" fontWeight="bold">
                  Footwork ({techniqueScores.footwork})
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
              {(['power', 'timing', 'placement', 'footwork'] as (keyof TechniqueScores)[]).map((metric) => (
                <div key={metric} className="flex flex-col gap-1 p-2 rounded-xl bg-black/20">
                  <span className="text-[10px] uppercase font-bold text-[#c4c9ac]">{metric}</span>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={techniqueScores[metric]}
                    onChange={(e) => {
                      setTechniqueScores({
                        ...techniqueScores,
                        [metric]: Number(e.target.value)
                      });
                    }}
                    className="w-full accent-[#c3f400] h-1 bg-[#353534] rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE WAGON WHEEL */}
      {statsView === 'wagon-wheel' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#201f1f] p-4 rounded-2xl border border-white/10 glass">
            <div>
              <h2 className="font-headline font-bold text-lg text-white">Interactive Wagon Wheel</h2>
              <p className="text-xs text-[#c4c9ac]">360° Field Scoring Trajectories & Boundary Dispersion</p>
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'boundaries', 'singles'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setWagonFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold uppercase transition-all cursor-pointer ${
                    wagonFilter === filter
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Wagon Wheel SVG Oval */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative aspect-[4/3] bg-[#0c160c] rounded-3xl overflow-hidden border border-[#c3f400]/20 shadow-2xl flex items-center justify-center p-4">
              <svg viewBox="0 0 600 500" className="w-full h-full select-none">
                {/* Boundary */}
                <ellipse cx="300" cy="250" rx="270" ry="210" fill="#132313" stroke="#c3f400" strokeWidth="2.5" />
                {/* 30-Yard Circle */}
                <ellipse cx="300" cy="250" rx="150" ry="115" fill="none" stroke="rgba(195,244,0,0.2)" strokeDasharray="4,4" strokeWidth="1.5" />
                {/* Pitch */}
                <rect x="288" y="210" width="24" height="80" rx="2" fill="#8f7a5b" />
                {/* Batting Crease Point */}
                <circle cx="300" cy="235" r="4" fill="#ffffff" />

                {/* Zone Radial Lines & Labels */}
                <text x="300" y="35" textAnchor="middle" fill="#c4c9ac" fontSize="9" fontFamily="monospace">LONG-OFF / LONG-ON</text>
                <text x="50" y="255" textAnchor="middle" fill="#c4c9ac" fontSize="9" fontFamily="monospace">MID-WICKET</text>
                <text x="550" y="255" textAnchor="middle" fill="#c4c9ac" fontSize="9" fontFamily="monospace">COVER POINT</text>
                <text x="300" y="480" textAnchor="middle" fill="#c4c9ac" fontSize="9" fontFamily="monospace">THIRD MAN / FINE LEG</text>

                {/* Shot Vector Lines from (300, 235) */}
                {filteredWagonShots.map((shot) => {
                  // Angle to radian (0 is straight up -90 deg)
                  const rad = ((shot.angle - 90) * Math.PI) / 180;
                  const length = (shot.distanceMeters / 90) * 200;
                  const endX = 300 + Math.cos(rad) * length;
                  const endY = 235 + Math.sin(rad) * length;

                  const color = shot.runs === 6 ? '#ffdb3c' : shot.runs === 4 ? '#c3f400' : shot.runs >= 2 ? '#9cf0ff' : '#ffffff';

                  return (
                    <g
                      key={shot.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredShot(shot)}
                      onMouseLeave={() => setHoveredShot(null)}
                    >
                      <line
                        x1="300"
                        y1="235"
                        x2={endX}
                        y2={endY}
                        stroke={color}
                        strokeWidth={shot.runs === 6 ? 3.5 : shot.runs === 4 ? 2.5 : 1.5}
                        strokeLinecap="round"
                        className="transition-all hover:opacity-100 opacity-80"
                      />
                      <circle
                        cx={endX}
                        cy={endY}
                        r={shot.runs === 6 ? 5 : shot.runs === 4 ? 4 : 3}
                        fill={color}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hovered Shot Tooltip */}
              {hoveredShot && (
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-[#c3f400] text-xs flex flex-col gap-0.5">
                  <span className="font-headline font-bold text-white">{hoveredShot.shotType}</span>
                  <span className="text-[#c3f400] font-bold">{hoveredShot.runs} Runs • {hoveredShot.zone}</span>
                  <span className="text-[10px] text-[#c4c9ac] font-mono">{hoveredShot.distanceMeters}m ({hoveredShot.exitSpeedKph} kph)</span>
                </div>
              )}
            </div>

            {/* Zone Breakdown Stats */}
            <div className="p-5 rounded-3xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-4">
              <h3 className="font-headline font-bold text-sm text-white">Scoring Zone Breakdown</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { zone: 'Extra Cover & Off Side', pct: 36, runs: 48, color: '#c3f400' },
                  { zone: 'Mid-Wicket & Cow Corner', pct: 32, runs: 42, color: '#ffdb3c' },
                  { zone: 'Straight & Long-On', pct: 20, runs: 28, color: '#9cf0ff' },
                  { zone: 'Behind Square & Third Man', pct: 12, runs: 16, color: '#ffffff' }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-bold">{item.zone}</span>
                      <span className="font-mono text-[#c3f400] font-bold">{item.pct}% ({item.runs}r)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: BOWLING PITCH MAPS */}
      {statsView === 'pitch-map' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#201f1f] p-4 rounded-2xl border border-white/10 glass">
            <div>
              <h2 className="font-headline font-bold text-lg text-white">Bowling Pitch Heatmap & Dispersion</h2>
              <p className="text-xs text-[#c4c9ac]">22-Yard Length Zones & Corridor of Uncertainty</p>
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'wickets', 'dots', 'boundaries'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPitchFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold uppercase transition-all cursor-pointer ${
                    pitchFilter === filter
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pitch Strip Vertical SVG */}
            <div className="lg:col-span-2 relative aspect-[3/4] max-h-[500px] bg-[#0e160e] rounded-3xl overflow-hidden border border-[#c3f400]/20 shadow-2xl flex items-center justify-center p-4">
              <svg viewBox="0 0 320 540" className="w-full h-full select-none">
                {/* Pitch Strip */}
                <rect x="50" y="30" width="220" height="480" rx="6" fill="#8f7a5b" stroke="#ffffff" strokeWidth="2" />

                {/* Length Zones Bands */}
                {/* Bouncer / Short: 30 to 130 */}
                <rect x="50" y="30" width="220" height="100" fill="rgba(255,180,171,0.15)" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
                <text x="60" y="85" fill="#ffb4ab" fontSize="9" fontFamily="monospace" fontWeight="bold">SHORT / BOUNCER (8-10m)</text>

                {/* Back of a length: 130 to 240 */}
                <rect x="50" y="130" width="220" height="110" fill="rgba(255,219,60,0.12)" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
                <text x="60" y="190" fill="#ffdb3c" fontSize="9" fontFamily="monospace" fontWeight="bold">BACK OF LENGTH (6-8m)</text>

                {/* Good Length: 240 to 370 */}
                <rect x="50" y="240" width="220" height="130" fill="rgba(195,244,0,0.15)" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
                <text x="60" y="310" fill="#c3f400" fontSize="9" fontFamily="monospace" fontWeight="bold">GOOD LENGTH (4-6m)</text>

                {/* Full / Yorker: 370 to 480 */}
                <rect x="50" y="370" width="220" height="110" fill="rgba(156,240,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
                <text x="60" y="430" fill="#9cf0ff" fontSize="9" fontFamily="monospace" fontWeight="bold">FULL / YORKER (0-4m)</text>

                {/* 3 Stumps at Batting End (y=490) */}
                <circle cx="150" cy="490" r="3" fill="#ffffff" />
                <circle cx="160" cy="490" r="3" fill="#ffffff" />
                <circle cx="170" cy="490" r="3" fill="#ffffff" />
                <line x1="100" y1="490" x2="220" y2="490" stroke="#ffffff" strokeWidth="2" />

                {/* 4th Stump Channel */}
                <rect x="175" y="240" width="35" height="130" fill="rgba(195,244,0,0.2)" stroke="#c3f400" strokeWidth="1" strokeDasharray="2,2" />

                {/* Deliveries Dots */}
                {filteredPitchDeliveries.map((del) => {
                  const pixelX = 50 + (del.x / 100) * 220;
                  const pixelY = 30 + (del.y / 100) * 450;
                  const dotColor = del.outcome === 'Wicket' ? '#ffb4ab' : del.outcome === 'Dot' ? '#c3f400' : '#ffdb3c';

                  return (
                    <g
                      key={del.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredDelivery(del)}
                      onMouseLeave={() => setHoveredDelivery(null)}
                    >
                      <circle
                        cx={pixelX}
                        cy={pixelY}
                        r="6"
                        fill={dotColor}
                        stroke="#161e00"
                        strokeWidth="1.5"
                        className="hover:scale-150 transition-transform"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hovered Delivery Tooltip */}
              {hoveredDelivery && (
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-[#c3f400] text-xs flex flex-col gap-0.5">
                  <span className="font-headline font-bold text-white">{hoveredDelivery.deliveryType} ({hoveredDelivery.speedKph} kph)</span>
                  <span className="text-[#c3f400] font-bold">{hoveredDelivery.length} • {hoveredDelivery.line}</span>
                  <span className="text-[10px] text-[#ffdb3c] font-mono">Outcome: {hoveredDelivery.outcome}</span>
                </div>
              )}
            </div>

            {/* Bowling Length Accuracy Cards */}
            <div className="p-5 rounded-3xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-4">
              <h3 className="font-headline font-bold text-sm text-white">Length Distribution</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { length: 'Good Length (4-6m)', pct: 54, color: '#c3f400' },
                  { length: 'Full / Yorker', pct: 24, color: '#9cf0ff' },
                  { length: 'Back of Length', pct: 16, color: '#ffdb3c' },
                  { length: 'Bouncer / Short', pct: 6, color: '#ffb4ab' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-bold">{item.length}</span>
                      <span className="font-mono text-[#c3f400] font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: STUMPS BEEHIVE & 3D FLIGHT ARC (FULLTRACK AI) */}
      {statsView === 'beehive' && (
        <div className="flex flex-col w-full animate-fadeIn">
          <BeehiveVisualizer />
        </div>
      )}

      {/* VIEW 5: AUTO-SLICED NET SESSION PLAYLIST FEED (FULLTRACK AI) */}
      {statsView === 'playlist' && (
        <div className="flex flex-col w-full animate-fadeIn">
          <NetSessionPlaylistFeed onOpenBeehive={() => setStatsView('beehive')} />
        </div>
      )}

      {/* VIEW 6: MATCH & TRAINING HISTORY */}
      {statsView === 'history' && (
        <div className="bg-[#201f1f] glass rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-xl animate-fadeIn">
          <div className="flex px-4 pt-4 gap-2 border-b border-white/5">
            <button
              onClick={() => {
                playBeep(700, 0.08);
                setActiveHistoryTab('matches');
              }}
              className={`px-4 py-2 font-headline font-bold text-sm tracking-tight border-b-2 transition-all cursor-pointer ${
                activeHistoryTab === 'matches'
                  ? 'text-[#c3f400] border-[#c3f400]'
                  : 'text-[#c4c9ac] border-transparent hover:text-white'
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => {
                playBeep(700, 0.08);
                setActiveHistoryTab('training');
              }}
              className={`px-4 py-2 font-headline font-bold text-sm tracking-tight border-b-2 transition-all cursor-pointer ${
                activeHistoryTab === 'training'
                  ? 'text-[#c3f400] border-[#c3f400]'
                  : 'text-[#c4c9ac] border-transparent hover:text-white'
              }`}
            >
              Training Sessions
            </button>
          </div>

          <div className="flex flex-col p-3 divide-y divide-white/5">
            {currentList.map((item, idx) => {
              const pts = item.sparkline
                .map((val, i) => {
                  const x = (i / (item.sparkline.length - 1)) * 60;
                  return `${x},${val}`;
                })
                .join(' ');

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedMatch(item)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors">
                      {item.opponent}
                    </span>
                    <span className="text-xs text-[#c4c9ac]">{item.dateLocation}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-headline font-bold text-xl text-white">
                      {item.score}
                    </span>
                    <svg className="w-16 h-6 overflow-visible" viewBox="0 0 60 20">
                      <polyline
                        fill="none"
                        points={pts}
                        stroke={item.isPositive ? '#c3f400' : '#ffb4ab'}
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="material-symbols-outlined text-gray-500 group-hover:text-[#c3f400] text-[18px]">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Match Breakdown Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#201f1f] border border-white/15 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-start pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded">
                  Match Telemetry Drilldown
                </span>
                <h3 className="font-headline font-bold text-xl text-white mt-1">
                  {selectedMatch.opponent}
                </h3>
                <p className="text-xs text-[#c4c9ac]">{selectedMatch.dateLocation}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#c4c9ac] block">RUNS</span>
                <span className="font-headline font-extrabold text-2xl text-white">{selectedMatch.score}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#c4c9ac] block">BALLS</span>
                <span className="font-headline font-extrabold text-2xl text-[#c3f400]">{selectedMatch.ballsFaced}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#c4c9ac] block">STRIKE RATE</span>
                <span className="font-headline font-extrabold text-2xl text-[#ffdb3c]">{selectedMatch.strikeRate}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedMatch(null);
                onNavigate('feedback');
              }}
              className="w-full py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-sm hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              View Coach Video Telestration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
