import React, { useState } from 'react';
import { BeehiveDelivery, HawkEyeHitVerdict } from '../../types';
import { mockBeehiveDeliveries } from '../../data/beehiveData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface BeehiveVisualizerProps {
  deliveries?: BeehiveDelivery[];
  selectedDeliveryId?: string;
  onSelectDelivery?: (delivery: BeehiveDelivery) => void;
  compact?: boolean;
}

export const BeehiveVisualizer: React.FC<BeehiveVisualizerProps> = ({
  deliveries = mockBeehiveDeliveries,
  selectedDeliveryId,
  onSelectDelivery,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'beehive' | 'trajectory'>('beehive');
  const [filterType, setFilterType] = useState<'all' | 'wickets' | 'hitting' | 'dots' | 'fast'>('all');
  const [currentDelivery, setCurrentDelivery] = useState<BeehiveDelivery>(
    deliveries.find((d) => d.id === selectedDeliveryId) || deliveries[0]
  );
  const [cameraAngle, setCameraAngle] = useState<'bowler_pov' | 'side_elevation' | 'batter_pov'>('bowler_pov');
  const [isSimulatingFlight, setIsSimulatingFlight] = useState(false);
  const [flightProgress, setFlightProgress] = useState(100);

  const filteredDeliveries = deliveries.filter((del) => {
    if (filterType === 'wickets') return del.outcome === 'Wicket';
    if (filterType === 'hitting') return del.isStumpHit;
    if (filterType === 'dots') return del.outcome === 'Dot' || del.outcome === 'Play and Miss';
    if (filterType === 'fast') return del.speedKmh >= 142;
    return true;
  });

  const handleDeliveryClick = (del: BeehiveDelivery) => {
    playBeep(750, 0.06);
    setCurrentDelivery(del);
    if (onSelectDelivery) onSelectDelivery(del);
  };

  const handleAnimateFlight = () => {
    playBallImpact();
    setIsSimulatingFlight(true);
    setFlightProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 4;
      if (step >= 100) {
        clearInterval(interval);
        setFlightProgress(100);
        setIsSimulatingFlight(false);
        playBeep(980, 0.1);
      } else {
        setFlightProgress(step);
      }
    }, 25);
  };

  // Stumps Hit Statistics
  const totalBalls = deliveries.length;
  const hittingCount = deliveries.filter((d) => d.isStumpHit).length;
  const wicketCount = deliveries.filter((d) => d.outcome === 'Wicket').length;
  const hittingPct = totalBalls > 0 ? Math.round((hittingCount / totalBalls) * 100) : 0;
  const avgReleaseSpeed =
    totalBalls > 0
      ? (deliveries.reduce((sum, d) => sum + d.speedKmh, 0) / totalBalls).toFixed(1)
      : '0.0';
  const avgBounceSpeed =
    totalBalls > 0
      ? (deliveries.reduce((sum, d) => sum + d.postBounceSpeedKmh, 0) / totalBalls).toFixed(1)
      : '0.0';

  // Coordinate mapping for 2D Beehive (Canvas bounds: X -60cm to +60cm, Y 0cm to 150cm)
  // Maps X cm (-60 to +60) to SVG percentage (0 to 100)
  const mapXToSvg = (xCm: number) => {
    return ((xCm + 60) / 120) * 100;
  };

  // Maps Y cm (0 to 150) to SVG percentage (100 to 0) -> 0 is ground (SVG 100%), 150 is top (SVG 0%)
  const mapYToSvg = (yCm: number) => {
    return 100 - (yCm / 150) * 100;
  };

  const getVerdictBadge = (verdict: HawkEyeHitVerdict) => {
    switch (verdict) {
      case 'HITTING_MIDDLE':
      case 'HITTING_OFF':
      case 'HITTING_LEG':
        return {
          label: 'HITTING WICKETS',
          color: 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
          icon: 'gavel',
        };
      case 'CLIPPING_BAILS_UMPIRES_CALL':
        return {
          label: "UMPIRE'S CALL",
          color: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          icon: 'priority_high',
        };
      case 'MISSING_OVER':
        return {
          label: 'MISSING (HEIGHT)',
          color: 'bg-blue-400/20 text-blue-300 border-blue-400/40',
          icon: 'north',
        };
      case 'MISSING_OFF':
        return {
          label: 'MISSING OFF',
          color: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
          icon: 'west',
        };
      case 'MISSING_LEG':
        return {
          label: 'MISSING LEG',
          color: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
          icon: 'east',
        };
    }
  };

  const currentVerdict = getVerdictBadge(currentDelivery.hawkEyeVerdict);

  return (
    <div className="flex flex-col w-full gap-4 rounded-2xl bg-[#1a1919] border border-white/10 p-4 sm:p-5 shadow-2xl glass select-none">
      {/* 1. Header Bar: Title, Mode Tabs & Filter Chips */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]" />
            <h3 className="text-base sm:text-lg font-headline font-black text-white uppercase tracking-wider">
              Fulltrack AI Stumps Beehive & 3D Flight Arc
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
              HAWK-EYE PRO
            </span>
          </div>
          <p className="text-xs text-[#c4c9ac] mt-0.5">
            Vertical impact strike plane at batter crease & aerodynamic ball flight vectors.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-[#252424] p-1 rounded-xl border border-white/10 self-stretch sm:self-auto">
          <button
            onClick={() => {
              playBeep(650, 0.04);
              setActiveTab('beehive');
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'beehive'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
            <span>Stumps Beehive</span>
          </button>

          <button
            onClick={() => {
              playBeep(650, 0.04);
              setActiveTab('trajectory');
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'trajectory'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">timeline</span>
            <span>3D Flight Arc</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#c4c9ac] tracking-wider">
            Stump Hit Ratio
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-headline font-extrabold text-[#c3f400]">
              {hittingPct}%
            </span>
            <span className="text-[10px] text-gray-400">
              ({hittingCount}/{totalBalls} Balls)
            </span>
          </div>
          <span className="text-[10px] text-[#4ade80] font-medium mt-0.5">
            {wicketCount} Direct Wickets
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#c4c9ac] tracking-wider">
            Release vs Bounce
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-headline font-extrabold text-white">
              {avgReleaseSpeed}
            </span>
            <span className="text-[10px] text-gray-400">$\rightarrow$</span>
            <span className="text-xl font-headline font-extrabold text-white">
              {avgBounceSpeed}
            </span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">Avg Drop: 12.2% Skid</span>
        </div>

        <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#c4c9ac] tracking-wider">
            Corridor of Uncertainty
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-headline font-extrabold text-[#ffdb3c]">38.5%</span>
            <span className="text-[10px] text-gray-400">4th Stump</span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">3 Edges Induced</span>
        </div>

        <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#c4c9ac] tracking-wider">
            Selected Ball #{currentDelivery.ballNumber}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-headline font-extrabold text-[#c3f400]">
              {currentDelivery.speedKmh}
            </span>
            <span className="text-[10px] text-gray-400">km/h</span>
          </div>
          <span className="text-[10px] text-white font-medium truncate">
            {currentDelivery.lengthCategory} • {currentDelivery.lineCategory}
          </span>
        </div>
      </div>

      {/* 3. Deliveries Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-bold text-[#c4c9ac] mr-1 whitespace-nowrap">
          Filter:
        </span>
        {(
          [
            { key: 'all', label: `All Balls (${totalBalls})` },
            { key: 'wickets', label: `Wickets (${wicketCount})` },
            { key: 'hitting', label: `Hitting Wickets (${hittingCount})` },
            { key: 'dots', label: 'Dots & Misses' },
            { key: 'fast', label: '142+ km/h Express' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playBeep(600, 0.03);
              setFilterType(tab.key);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              filterType === tab.key
                ? 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. MAIN VISUALIZER CANVAS AREA */}
      {activeTab === 'beehive' ? (
        /* ================= 2D STUMPS BEEHIVE IMPACT GRID ================= */
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#121212] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-4">
          {/* Background Turf Surface Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2612] via-[#121212] to-[#0a0a0a]" />

          {/* SVG Canvas for Regulation Stumps & Strike Zones */}
          <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beehiveStumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              <pattern id="beehiveGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#ffffff" strokeWidth="0.1" opacity="0.1" />
              </pattern>
            </defs>

            {/* Faint Background Grid Lines */}
            <rect width="100" height="100" fill="url(#beehiveGrid)" />

            {/* Pitch Ground Base Line (Y=100cm / 0cm ground height in our scale) */}
            <line x1="0" y1="99" x2="100" y2="99" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

            {/* Wide Return Crease Lines (Left & Right) */}
            {/* Standard pitch wide lines: ±45cm from middle stump */}
            <line
              x1={mapXToSvg(-45)}
              y1="40"
              x2={mapXToSvg(-45)}
              y2="100"
              stroke="#ef4444"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.6"
            />
            <line
              x1={mapXToSvg(45)}
              y1="40"
              x2={mapXToSvg(45)}
              y2="100"
              stroke="#ef4444"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.6"
            />
            <text
              x={mapXToSvg(-45)}
              y="38"
              fill="#ef4444"
              fontSize="2.2"
              fontFamily="monospace"
              textAnchor="middle"
            >
              WIDE OFF
            </text>
            <text
              x={mapXToSvg(45)}
              y="38"
              fill="#ef4444"
              fontSize="2.2"
              fontFamily="monospace"
              textAnchor="middle"
            >
              WIDE LEG
            </text>

            {/* Bail Level Line (71.12 cm height) */}
            <line
              x1="10"
              y1={mapYToSvg(71.12)}
              x2="90"
              y2={mapYToSvg(71.12)}
              stroke="#fde047"
              strokeWidth="0.4"
              strokeDasharray="1,2"
              opacity="0.7"
            />
            <text
              x="92"
              y={mapYToSvg(71.12) + 1}
              fill="#fde047"
              fontSize="2.2"
              fontFamily="monospace"
            >
              BAILS (71cm)
            </text>

            {/* Knee Roll Height Line (approx 45cm) */}
            <line
              x1="20"
              y1={mapYToSvg(45)}
              x2="80"
              y2={mapYToSvg(45)}
              stroke="#60a5fa"
              strokeWidth="0.3"
              strokeDasharray="1,2"
              opacity="0.5"
            />
            <text
              x="82"
              y={mapYToSvg(45) + 1}
              fill="#60a5fa"
              fontSize="2"
              fontFamily="monospace"
            >
              KNEE ROLL (45cm)
            </text>

            {/* Stumps Hit Target Zone Highlight Box */}
            <rect
              x={mapXToSvg(-11.43)}
              y={mapYToSvg(71.12)}
              width={mapXToSvg(11.43) - mapXToSvg(-11.43)}
              height={mapYToSvg(0) - mapYToSvg(71.12)}
              fill="#c3f400"
              fillOpacity="0.06"
              stroke="#c3f400"
              strokeWidth="0.4"
              strokeDasharray="2,2"
            />

            {/* THE THREE REGULATION WICKETS */}
            {/* OFF STUMP (RHB: X = -7.6cm to -11.4cm) */}
            <rect
              x={mapXToSvg(-9.5) - 0.9}
              y={mapYToSvg(71.12)}
              width="1.8"
              height={mapYToSvg(0) - mapYToSvg(71.12)}
              rx="0.4"
              fill="url(#beehiveStumpWood)"
              stroke="#000"
              strokeWidth="0.2"
            />
            {/* MIDDLE STUMP (X = 0cm) */}
            <rect
              x={mapXToSvg(0) - 0.9}
              y={mapYToSvg(71.12)}
              width="1.8"
              height={mapYToSvg(0) - mapYToSvg(71.12)}
              rx="0.4"
              fill="url(#beehiveStumpWood)"
              stroke="#000"
              strokeWidth="0.2"
            />
            {/* LEG STUMP (RHB: X = +9.5cm) */}
            <rect
              x={mapXToSvg(9.5) - 0.9}
              y={mapYToSvg(71.12)}
              width="1.8"
              height={mapYToSvg(0) - mapYToSvg(71.12)}
              rx="0.4"
              fill="url(#beehiveStumpWood)"
              stroke="#000"
              strokeWidth="0.2"
            />
            {/* BAILS */}
            <rect
              x={mapXToSvg(-10.5)}
              y={mapYToSvg(73.5)}
              width={mapXToSvg(0.5) - mapXToSvg(-10.5)}
              height="1.2"
              rx="0.4"
              fill="#fef08a"
              stroke="#000"
              strokeWidth="0.2"
            />
            <rect
              x={mapXToSvg(-0.5)}
              y={mapYToSvg(73.5)}
              width={mapXToSvg(10.5) - mapXToSvg(-0.5)}
              height="1.2"
              rx="0.4"
              fill="#fef08a"
              stroke="#000"
              strokeWidth="0.2"
            />

            {/* Labels on Stumps */}
            <text
              x={mapXToSvg(-9.5)}
              y={mapYToSvg(12)}
              fill="#ffffff"
              fontSize="2.2"
              fontFamily="sans-serif"
              textAnchor="middle"
              fontWeight="bold"
            >
              OFF
            </text>
            <text
              x={mapXToSvg(0)}
              y={mapYToSvg(12)}
              fill="#ffffff"
              fontSize="2.2"
              fontFamily="sans-serif"
              textAnchor="middle"
              fontWeight="bold"
            >
              MID
            </text>
            <text
              x={mapXToSvg(9.5)}
              y={mapYToSvg(12)}
              fill="#ffffff"
              fontSize="2.2"
              fontFamily="sans-serif"
              textAnchor="middle"
              fontWeight="bold"
            >
              LEG
            </text>

            {/* DELIVERY IMPACT DOTS PLOTTED ON BEEHIVE */}
            {filteredDeliveries.map((del) => {
              const cx = mapXToSvg(del.impactXCm);
              const cy = mapYToSvg(del.impactYCm);
              const isSelected = del.id === currentDelivery.id;

              let dotColor = '#c3f400'; // dot ball lime
              if (del.outcome === 'Wicket') dotColor = '#ef4444'; // wicket red
              else if (del.outcome === 'Boundary') dotColor = '#f59e0b'; // boundary amber
              else if (del.outcome === 'Single') dotColor = '#38bdf8'; // single blue

              return (
                <g
                  key={del.id}
                  onClick={() => handleDeliveryClick(del)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer selection ring if active */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="none"
                      stroke={dotColor}
                      strokeWidth="0.6"
                      strokeDasharray="1,1"
                      className="animate-spin"
                    />
                  )}

                  {/* Delivery Impact Marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 3.0 : 2.2}
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth="0.4"
                    className="drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                  />

                  {/* Ball Number Inside Dot */}
                  <text
                    x={cx}
                    y={cy + 0.8}
                    fill="#111111"
                    fontSize="1.8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {del.ballNumber}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Overlaid Selected Ball Spotlight Card */}
          <div className="absolute top-3 left-3 z-20 glass bg-black/75 border border-white/10 rounded-xl p-2.5 max-w-xs text-xs backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                <span className="font-headline font-bold text-white">
                  Ball #{currentDelivery.ballNumber} ({currentDelivery.overNumber} ov)
                </span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${currentVerdict.color}`}
              >
                {currentVerdict.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-[#c4c9ac] mt-1.5">
              <div>
                <span>Speed: </span>
                <span className="text-white font-bold">{currentDelivery.speedKmh} km/h</span>
              </div>
              <div>
                <span>Height: </span>
                <span className="text-white font-bold">{currentDelivery.impactYCm} cm</span>
              </div>
              <div>
                <span>Line: </span>
                <span className="text-white font-bold">{currentDelivery.lineCategory}</span>
              </div>
              <div>
                <span>LBW Prob: </span>
                <span className="text-[#c3f400] font-bold">
                  {currentDelivery.lbwProbabilityPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 3D BALL FLIGHT TRAJECTORY ARC ================= */
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#121212] rounded-2xl border border-white/10 overflow-hidden flex flex-col p-4">
          {/* Top Camera Angle Selector */}
          <div className="flex items-center justify-between gap-2 mb-2 z-20">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                View Angle:
              </span>
              {(
                [
                  { key: 'bowler_pov', label: 'Bowler POV (Perspective)' },
                  { key: 'side_elevation', label: 'Side Elevation (Bounce Arc)' },
                  { key: 'batter_pov', label: 'Batter Face-On' },
                ] as const
              ).map((angle) => (
                <button
                  key={angle.key}
                  onClick={() => {
                    playBeep(600, 0.03);
                    setCameraAngle(angle.key);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    cameraAngle === angle.key
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-white/5 text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnimateFlight}
              disabled={isSimulatingFlight}
              className="px-3 py-1 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-headline font-black flex items-center gap-1 shadow-[0_0_10px_rgba(195,244,0,0.3)] active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Animate Flight</span>
            </button>
          </div>

          {/* 3D Pitch Arc Visualizer Canvas */}
          <div className="relative flex-1 rounded-xl bg-[#0d0d0d] overflow-hidden border border-white/5 flex items-center justify-center">
            {/* Perspective Pitch Wireframe */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flightTrail" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#c3f400" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Pitch Surface depending on camera view */}
              {cameraAngle === 'bowler_pov' && (
                <>
                  {/* Perspective Pitch Corridor */}
                  <polygon
                    points="25,95 40,30 60,30 75,95"
                    fill="#182210"
                    stroke="#c3f400"
                    strokeWidth="0.6"
                  />
                  {/* Popping Creases */}
                  <line x1="22" y1="88" x2="78" y2="88" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" />
                  <line x1="38" y1="32" x2="62" y2="32" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />

                  {/* Flight Arc: Bowler Release (near bottom) -> Pitch Bounce -> Batter Stumps */}
                  {/* Path coordinates:
                      Release: 50, 85
                      Apex: 48, 50
                      Bounce: 49, 40
                      Stumps: 50 + offset, 30
                  */}
                  <path
                    d={`M 52,85 Q 47,55 49,42 Q 50,35 ${50 + currentDelivery.impactXCm * 0.4},30`}
                    fill="none"
                    stroke="url(#flightTrail)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* Projected continuation line behind stumps (Hawk-Eye LBW path) */}
                  <line
                    x1={50 + currentDelivery.impactXCm * 0.4}
                    y1="30"
                    x2={50 + currentDelivery.impactXCm * 0.55}
                    y2="24"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />

                  {/* Bounce Point Marker */}
                  <ellipse cx="49" cy="42" rx="2" ry="0.8" fill="#c3f400" opacity="0.8" />
                  <text x="52" y="43" fill="#c3f400" fontSize="2" fontFamily="monospace">
                    BOUNCE (15.2m)
                  </text>

                  {/* Moving Ball Animation */}
                  {isSimulatingFlight && (
                    <circle
                      cx={52 - (flightProgress / 100) * 3}
                      cy={85 - (flightProgress / 100) * 55}
                      r="2"
                      fill="#ffffff"
                      stroke="#c3f400"
                      strokeWidth="0.5"
                    />
                  )}
                </>
              )}

              {cameraAngle === 'side_elevation' && (
                <>
                  {/* Ground Level Line */}
                  <line x1="5" y1="85" x2="95" y2="85" stroke="#ffffff" strokeWidth="0.8" />

                  {/* Distance Markers */}
                  <text x="10" y="92" fill="#c4c9ac" fontSize="2.2" fontFamily="monospace">
                    BOWLER (0m)
                  </text>
                  <text x="65" y="92" fill="#c4c9ac" fontSize="2.2" fontFamily="monospace">
                    BOUNCE (15m)
                  </text>
                  <text x="90" y="92" fill="#c4c9ac" fontSize="2.2" fontFamily="monospace">
                    STUMPS (20.1m)
                  </text>

                  {/* Side Parabolic Elevation Curve */}
                  <path
                    d="M 12,30 Q 38,20 66,85 Q 78,55 90,52"
                    fill="none"
                    stroke="url(#flightTrail)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />

                  {/* Projected Path through stumps */}
                  <line x1="90" y1="52" x2="98" y2="48" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="2,2" />

                  {/* Stumps vertical pole at x=90 */}
                  <rect x="89.5" y="50" width="1" height="35" fill="#fde047" />
                  <line x1="88.5" y1="50" x2="91.5" y2="50" stroke="#fde047" strokeWidth="0.8" />
                </>
              )}

              {cameraAngle === 'batter_pov' && (
                <>
                  {/* Face-on delivery swing view */}
                  <line x1="10" y1="85" x2="90" y2="85" stroke="#ffffff" strokeWidth="0.8" />
                  {/* 3 Stumps in center */}
                  <rect x="47" y="55" width="1.2" height="30" fill="#fde047" />
                  <rect x="49.4" y="55" width="1.2" height="30" fill="#fde047" />
                  <rect x="51.8" y="55" width="1.2" height="30" fill="#fde047" />

                  {/* In-swinger / Out-swinger Deviation S-Curve */}
                  <path
                    d={`M 60,35 Q 52,60 50,75 Q 49,80 ${50 + currentDelivery.impactXCm * 0.5},${mapYToSvg(currentDelivery.impactYCm)}`}
                    fill="none"
                    stroke="url(#flightTrail)"
                    strokeWidth="1.4"
                  />
                </>
              )}
            </svg>

            {/* Flight Metrics Legend Pill */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span className="text-[#c4c9ac]">Air Swing: </span>
                <span className="text-white font-bold">{currentDelivery.swingDeg}°</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                <span className="text-[#c4c9ac]">Pitch Seam Cut: </span>
                <span className="text-white font-bold">{currentDelivery.seamCutDeg}°</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-[#c4c9ac]">Impact Height: </span>
                <span className="text-white font-bold">{currentDelivery.impactYCm} cm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Deliveries Scrub List (Spell Feed) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Spell Delivery Feed (12 Balls)
          </span>
          <span className="text-[10px] text-[#c4c9ac]">
            Click any ball to inspect impact trajectory & LBW probability
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {filteredDeliveries.map((del) => {
            const isSelected = del.id === currentDelivery.id;
            return (
              <button
                key={del.id}
                onClick={() => handleDeliveryClick(del)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c3f400]/15 border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.2)]'
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-white">
                    #{del.ballNumber} ({del.overNumber})
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      del.outcome === 'Wicket'
                        ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                        : del.isStumpHit
                        ? 'bg-[#c3f400]'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-mono font-bold text-[#c3f400]">
                  {del.speedKmh} km/h
                </div>
                <div className="text-[10px] text-[#c4c9ac] truncate">
                  {del.lengthCategory}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
