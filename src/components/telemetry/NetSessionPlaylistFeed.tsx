import React, { useState } from 'react';
import {
  AutoSlicedDeliveryClip,
  NetSessionPlaylist,
  AutoSlicerConfig,
} from '../../types';
import {
  getStoredPlaylists,
  saveStoredPlaylists,
  getStoredAutoSlicerConfig,
  saveAutoSlicerConfig,
} from '../../data/autoSlicerPlaylistData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface NetSessionPlaylistFeedProps {
  onClose?: () => void;
  onOpenBeehive?: () => void;
}

export const NetSessionPlaylistFeed: React.FC<NetSessionPlaylistFeedProps> = ({
  onClose,
  onOpenBeehive,
}) => {
  const [playlists, setPlaylists] = useState<NetSessionPlaylist[]>(getStoredPlaylists);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(playlists[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'wickets' | 'fast' | 'yorkers' | 'good_length' | 'bookmarked'>('all');
  const [activeClip, setActiveClip] = useState<AutoSlicedDeliveryClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<0.25 | 0.5 | 1 | 2>(1);
  const [scrubberProgress, setScrubberProgress] = useState(40);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [slicerConfig, setSlicerConfig] = useState<AutoSlicerConfig>(getStoredAutoSlicerConfig);
  const [coachNoteInput, setCoachNoteInput] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);

  const activePlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];

  const filteredClips = (activePlaylist?.clips || []).filter((clip) => {
    if (filter === 'wickets') return clip.delivery.outcome === 'Wicket';
    if (filter === 'fast') return clip.delivery.speedKmh >= 143;
    if (filter === 'yorkers') return clip.delivery.lengthCategory === 'Yorker';
    if (filter === 'good_length') return clip.delivery.lengthCategory === 'Good Length';
    if (filter === 'bookmarked') return clip.isBookmarked;
    return true;
  });

  const handleToggleBookmark = (clipId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playBeep(850, 0.05);
    const updatedPlaylists = playlists.map((p) => {
      if (p.id !== activePlaylist.id) return p;
      return {
        ...p,
        clips: p.clips.map((c) => (c.id === clipId ? { ...c, isBookmarked: !c.isBookmarked } : c)),
      };
    });
    setPlaylists(updatedPlaylists);
    saveStoredPlaylists(updatedPlaylists);
    if (activeClip && activeClip.id === clipId) {
      setActiveClip({ ...activeClip, isBookmarked: !activeClip.isBookmarked });
    }
  };

  const handleSaveNote = () => {
    if (!activeClip || !coachNoteInput.trim()) return;
    playBeep(900, 0.06);
    const updatedPlaylists = playlists.map((p) => {
      if (p.id !== activePlaylist.id) return p;
      return {
        ...p,
        clips: p.clips.map((c) => (c.id === activeClip.id ? { ...c, coachNotes: coachNoteInput } : c)),
      };
    });
    setPlaylists(updatedPlaylists);
    saveStoredPlaylists(updatedPlaylists);
    setActiveClip({ ...activeClip, coachNotes: coachNoteInput });
    setCoachNoteInput('');
  };

  const handleShareClip = () => {
    playBallImpact();
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2800);
  };

  return (
    <div className="flex flex-col w-full gap-4 text-white select-none">
      {/* 1. Header Bar: Session Selector, Auto-Slicer Badge & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400] animate-pulse" />
            <h2 className="text-lg sm:text-xl font-headline font-black tracking-wider uppercase text-white">
              Ball-by-Ball Auto-Slicer & Playlist
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
              HANDS-FREE AI
            </span>
          </div>
          <p className="text-xs text-[#c4c9ac] mt-0.5">
            Continuous recording buffer automatically segmenting deliveries into 4-5s slow-mo clips.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          {/* Slicer Settings Button */}
          <button
            onClick={() => {
              playBeep(650, 0.04);
              setShowSettingsModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 text-[#c4c9ac] hover:text-white transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Slicer Settings</span>
          </button>

          {/* Close Button if opened in modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Session Selector & Aggregate Metrics Card */}
      <div className="p-4 rounded-2xl bg-[#1b1b1b] border border-white/10 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">video_library</span>
            <select
              value={selectedPlaylistId}
              onChange={(e) => {
                playBeep(650, 0.04);
                setSelectedPlaylistId(e.target.value);
              }}
              className="bg-[#242424] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-white/10 outline-none cursor-pointer"
            >
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id} className="bg-[#1f1f1f]">
                  {pl.title} ({pl.totalDeliveries} Balls)
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-[#c4c9ac] flex items-center gap-2">
            <span>{activePlaylist?.venue}</span>
            <span>•</span>
            <span className="text-[#c3f400] font-medium">{activePlaylist?.pitchCondition}</span>
          </div>
        </div>

        {/* Aggregated Session Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-white/5">
          <div className="p-2 rounded-xl bg-white/5 flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#c4c9ac]">Total Deliveries</span>
            <span className="text-base font-headline font-extrabold text-white mt-0.5">
              {activePlaylist?.totalDeliveries} Clips
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#c4c9ac]">Top Release Speed</span>
            <span className="text-base font-headline font-extrabold text-[#c3f400] mt-0.5">
              {activePlaylist?.topSpeedKmh} km/h
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#c4c9ac]">Average Speed</span>
            <span className="text-base font-headline font-extrabold text-white mt-0.5">
              {activePlaylist?.avgSpeedKmh} km/h
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#c4c9ac]">Stumps Hit %</span>
            <span className="text-base font-headline font-extrabold text-[#4ade80] mt-0.5">
              {activePlaylist?.stumpHitPct}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase font-bold text-[#c4c9ac]">Dot Ball %</span>
            <span className="text-base font-headline font-extrabold text-[#38bdf8] mt-0.5">
              {activePlaylist?.dotBallPct}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-bold text-[#c4c9ac] mr-1 whitespace-nowrap">
          Filter Clips:
        </span>
        {(
          [
            { key: 'all', label: `All Deliveries (${activePlaylist?.clips.length || 0})` },
            {
              key: 'wickets',
              label: `Wickets (${
                activePlaylist?.clips.filter((c) => c.delivery.outcome === 'Wicket').length || 0
              })`,
            },
            {
              key: 'fast',
              label: `143+ km/h Express (${
                activePlaylist?.clips.filter((c) => c.delivery.speedKmh >= 143).length || 0
              })`,
            },
            {
              key: 'yorkers',
              label: `Yorkers (${
                activePlaylist?.clips.filter((c) => c.delivery.lengthCategory === 'Yorker').length || 0
              })`,
            },
            {
              key: 'good_length',
              label: `Good Length (${
                activePlaylist?.clips.filter((c) => c.delivery.lengthCategory === 'Good Length')
                  .length || 0
              })`,
            },
            {
              key: 'bookmarked',
              label: `Starred (${
                activePlaylist?.clips.filter((c) => c.isBookmarked).length || 0
              })`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playBeep(600, 0.03);
              setFilter(tab.key);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              filter === tab.key
                ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border border-white/5'
            }`}
          >
            {tab.key === 'bookmarked' && (
              <span className="material-symbols-outlined text-[14px]">star</span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Auto-Sliced Clips Grid Feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredClips.map((clip) => {
          const isWicket = clip.delivery.outcome === 'Wicket';

          return (
            <div
              key={clip.id}
              onClick={() => {
                playBeep(700, 0.04);
                setActiveClip(clip);
                setIsPlaying(true);
                setScrubberProgress(45);
              }}
              className="group relative rounded-2xl bg-[#1d1d1d] border border-white/10 hover:border-[#c3f400]/50 overflow-hidden flex flex-col transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(195,244,0,0.15)]"
            >
              {/* Thumbnail Container with Media Overlays */}
              <div className="relative aspect-video w-full bg-[#121212] overflow-hidden">
                <img
                  src={clip.thumbnailUrl}
                  alt={`Ball #${clip.ballNumber}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Top Left: Ball # & Over */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-black bg-black/80 text-white border border-white/20 backdrop-blur-md">
                    Ball #{clip.ballNumber} ({clip.overNumber} ov)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 backdrop-blur-md">
                    {clip.durationSeconds}s
                  </span>
                </div>

                {/* Top Right: Bookmark Star */}
                <button
                  onClick={(e) => handleToggleBookmark(clip.id, e)}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-md ${
                    clip.isBookmarked
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-black/60 text-white/70 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {clip.isBookmarked ? 'star' : 'star_border'}
                  </span>
                </button>

                {/* Center Play Button Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center shadow-2xl">
                    <span className="material-symbols-outlined text-[28px] ml-0.5">play_arrow</span>
                  </div>
                </div>

                {/* Bottom Bar on Thumbnail: Speed & Trigger Confidence */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-headline font-black text-[#c3f400] drop-shadow-md">
                      {clip.delivery.speedKmh} km/h
                    </span>
                    <span className="text-[10px] text-gray-300">
                      ({clip.delivery.lengthCategory})
                    </span>
                  </div>

                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white/90 border border-white/10 backdrop-blur-sm">
                    ⚡ {clip.detectionConfidencePct}% AI
                  </span>
                </div>
              </div>

              {/* Bottom Card Body: Delivery Summary & Tags */}
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">
                    {clip.delivery.lineCategory}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                      isWicket
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : clip.delivery.isStumpHit
                        ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/30'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {isWicket ? `WICKET (${clip.delivery.wicketType || 'Bowled'})` : clip.delivery.outcome}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 flex-wrap">
                  {clip.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-[#c4c9ac] border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                  {clip.coachNotes && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">edit_note</span>
                      Coach Note
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Interactive Video Player Modal with Slow-Mo & Hawk-Eye Telemetry */}
      {activeClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" />
                <h3 className="text-base sm:text-lg font-headline font-black text-white">
                  Ball #{activeClip.ballNumber} Slow-Mo Review ({activeClip.overNumber} ov)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400]">
                  {activeClip.durationSeconds}s Auto-Slice
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleBookmark(activeClip.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                    activeClip.isBookmarked
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {activeClip.isBookmarked ? 'star' : 'star_border'}
                  </span>
                </button>

                <button
                  onClick={handleShareClip}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  title="Share Delivery Clip"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>

                <button
                  onClick={() => setActiveClip(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/10 flex items-center justify-center">
              <img
                src={activeClip.thumbnailUrl}
                alt="Delivery playback frame"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Overlaid Telemetry HUD */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                <div className="flex items-center gap-2 bg-black/80 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
                  <span className="text-xl font-headline font-black text-[#c3f400]">
                    {activeClip.delivery.speedKmh}
                  </span>
                  <span className="text-[10px] text-gray-300 uppercase font-mono">km/h Release</span>
                </div>
                <div className="bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-[10px] text-white flex items-center gap-2 backdrop-blur-md">
                  <span>Air Swing: {activeClip.delivery.swingDeg}°</span>
                  <span>•</span>
                  <span>Pitch Seam: {activeClip.delivery.seamCutDeg}°</span>
                </div>
              </div>

              {/* Overlaid Stumps Impact Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 text-right backdrop-blur-md">
                  <div className="text-[10px] text-[#c4c9ac] uppercase font-bold">Hawk-Eye Verdict</div>
                  <div className="text-xs font-mono font-bold text-[#c3f400]">
                    {activeClip.delivery.hawkEyeVerdict.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Center Play/Pause Trigger */}
              <button
                onClick={() => {
                  playBallImpact();
                  setIsPlaying(!isPlaying);
                }}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-[#c3f400] text-white hover:text-[#161e00] flex items-center justify-center transition-all cursor-pointer shadow-2xl border border-white/20"
              >
                <span className="material-symbols-outlined text-[36px] ml-1">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              {/* Timeline Scrubber & Frame Controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 flex flex-col gap-2 z-20">
                {/* Scrub Bar with Keyframe Markers */}
                <div className="relative w-full flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scrubberProgress}
                    onChange={(e) => setScrubberProgress(Number(e.target.value))}
                    className="w-full accent-[#c3f400] cursor-pointer"
                  />
                </div>

                {/* Playback Controls & Speed Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setScrubberProgress(Math.max(0, scrubberProgress - 5))}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-mono text-[10px]"
                    >
                      -1 Frame
                    </button>
                    <button
                      onClick={() => setScrubberProgress(Math.min(100, scrubberProgress + 5))}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-mono text-[10px]"
                    >
                      +1 Frame
                    </button>
                  </div>

                  {/* Slow-Mo Rate Chips */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                    {([0.25, 0.5, 1, 2] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          playBeep(650, 0.03);
                          setPlaySpeed(spd);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                          playSpeed === spd
                            ? 'bg-[#c3f400] text-[#161e00]'
                            : 'text-[#c4c9ac] hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Notes & Annotation Box */}
            <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#c3f400]">comment</span>
                  Coach Telemetry & Technical Notes
                </span>
                {activeClip.coachNotes && (
                  <span className="text-[10px] text-[#4ade80] font-medium">Note Saved</span>
                )}
              </div>

              {activeClip.coachNotes ? (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#c4c9ac]">
                  "{activeClip.coachNotes}"
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add coaching note for this delivery (e.g. wrist cock, release seam angle)..."
                    value={coachNoteInput}
                    onChange={(e) => setCoachNoteInput(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c3f400]"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-bold text-xs cursor-pointer active:scale-95"
                  >
                    Save Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Slicer Settings Configuration Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#161616] border border-white/15 p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">tune</span>
                <h3 className="text-base font-headline font-black text-white uppercase">
                  Auto-Slicer Trigger & Buffer Setup
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Pre-Roll Buffer Slider */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between font-bold">
                  <span>Pre-Release Buffer</span>
                  <span className="text-[#c3f400]">{slicerConfig.preRollSeconds} seconds</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={slicerConfig.preRollSeconds}
                  onChange={(e) =>
                    setSlicerConfig({ ...slicerConfig, preRollSeconds: parseFloat(e.target.value) })
                  }
                  className="accent-[#c3f400] cursor-pointer"
                />
                <span className="text-[10px] text-[#c4c9ac]">
                  Seconds captured before bowler release point to inspect run-up & gather.
                </span>
              </div>

              {/* Post-Roll Buffer Slider */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between font-bold">
                  <span>Post-Impact Follow-Through Buffer</span>
                  <span className="text-[#c3f400]">{slicerConfig.postRollSeconds} seconds</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={slicerConfig.postRollSeconds}
                  onChange={(e) =>
                    setSlicerConfig({ ...slicerConfig, postRollSeconds: parseFloat(e.target.value) })
                  }
                  className="accent-[#c3f400] cursor-pointer"
                />
                <span className="text-[10px] text-[#c4c9ac]">
                  Seconds captured after pitch impact or bat contact for shot evaluation.
                </span>
              </div>

              {/* Acoustic Snick Threshold */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between font-bold">
                  <span>Acoustic Snick & Bat Impact Trigger</span>
                  <span className="text-[#c3f400]">{slicerConfig.soundThresholdDb} dB</span>
                </div>
                <input
                  type="range"
                  min="-28"
                  max="-8"
                  step="1"
                  value={slicerConfig.soundThresholdDb}
                  onChange={(e) =>
                    setSlicerConfig({ ...slicerConfig, soundThresholdDb: parseInt(e.target.value, 10) })
                  }
                  className="accent-[#c3f400] cursor-pointer"
                />
                <span className="text-[10px] text-[#c4c9ac]">
                  Microphone trigger sensitivity to detect willow-on-leather or ball-on-stumps impact.
                </span>
              </div>

              {/* Auto-Bookmark Wickets Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-bold text-white">Auto-Star Wicket Deliveries</div>
                  <div className="text-[10px] text-[#c4c9ac]">
                    Automatically bookmarks any bowled, LBW, or edge dismissals to the reel.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={slicerConfig.autoBookmarkWickets}
                  onChange={(e) =>
                    setSlicerConfig({ ...slicerConfig, autoBookmarkWickets: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#c3f400] cursor-pointer"
                />
              </div>

              {/* Slow-Mo FPS */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-bold text-white">Slow-Mo Export Camera FPS</div>
                  <div className="text-[10px] text-[#c4c9ac]">High-frame rate sensor capture rate</div>
                </div>
                <div className="flex items-center gap-1">
                  {([60, 120, 240] as const).map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setSlicerConfig({ ...slicerConfig, slowMoFrameRateFps: fps })}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs cursor-pointer ${
                        slicerConfig.slowMoFrameRateFps === fps
                          ? 'bg-[#c3f400] text-[#161e00]'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {fps}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  playBeep(950, 0.08);
                  saveAutoSlicerConfig(slicerConfig);
                  setShowSettingsModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-black text-xs cursor-pointer active:scale-95"
              >
                Save Slicer Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#c3f400] text-[#161e00] font-bold text-xs shadow-2xl animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Delivery slow-mo clip exported & ready to share!</span>
        </div>
      )}
    </div>
  );
};
