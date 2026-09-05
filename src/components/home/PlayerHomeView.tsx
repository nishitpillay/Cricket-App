import React, { useState } from 'react';
import { UserProfile, SessionRecord, ScreenType, DrillItem } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PlayerHomeViewProps {
  user: UserProfile;
  sessions: SessionRecord[];
  onNavigate: (screen: ScreenType) => void;
  onSelectSession?: (session: SessionRecord) => void;
  onSelectDrill?: (drill: DrillItem) => void;
}

export const PlayerHomeView: React.FC<PlayerHomeViewProps> = ({
  user,
  sessions,
  onNavigate,
  onSelectSession,
  onSelectDrill
}) => {
  const [activeSpeedTab, setActiveSpeedTab] = useState<'week' | 'month'>('week');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Today's training checklist state
  const [todayDrills, setTodayDrills] = useState([
    {
      id: 'drill-1',
      title: 'High Elbow Upright Seam Extension',
      duration: '12 mins',
      sets: '3 sets × 5 reps',
      focus: 'Release biomechanics & upright wrist angle',
      completed: true,
      category: 'Pace & Seam'
    },
    {
      id: 'drill-2',
      title: 'Wrist-Snap Yorker Calibration',
      duration: '15 mins',
      sets: '20 balls on target cone',
      focus: 'Death-overs execution & blockhole accuracy',
      completed: false,
      category: 'Accuracy'
    },
    {
      id: 'drill-3',
      title: 'Back-Foot Landing & Hip Alignment',
      duration: '10 mins',
      sets: '2 sets × 8 run-ups',
      focus: 'Non-bowling arm pull down & spine stability',
      completed: false,
      category: 'Biomechanics'
    }
  ]);

  // Player active goals state
  const [goals, setGoals] = useState([
    {
      id: 'goal-speed',
      title: 'Express Pace Milestone',
      metric: '140+ km/h',
      current: '138.2 km/h',
      target: 140,
      currentVal: 138.2,
      percent: 98,
      status: 'On Track',
      color: 'from-[#c3f400] to-[#84cc16]',
      badgeColor: 'text-[#c3f400] bg-[#c3f400]/10 border-[#c3f400]/30'
    },
    {
      id: 'goal-length',
      title: 'Good Length Consistency',
      metric: '85% in target corridor',
      current: '78%',
      target: 85,
      currentVal: 78,
      percent: 91,
      status: 'Improving',
      color: 'from-[#00d2ff] to-[#0284c7]',
      badgeColor: 'text-[#00d2ff] bg-[#00d2ff]/10 border-[#00d2ff]/30'
    },
    {
      id: 'goal-wrist',
      title: 'Release Wrist Tilt Alignment',
      metric: '22° optimal angle',
      current: '18°',
      target: 22,
      currentVal: 18,
      percent: 82,
      status: 'Coach Prescribed',
      color: 'from-amber-400 to-amber-600',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    }
  ]);

  const toggleDrillComplete = (drillId: string) => {
    playCelebration();
    setTodayDrills((prev) =>
      prev.map((d) => (d.id === drillId ? { ...d, completed: !d.completed } : d))
    );
  };

  const toggleAudioFeedback = () => {
    if (!isPlayingAudio) {
      playBeep(880, 0.1);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4500);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const completedCount = todayDrills.filter((d) => d.completed).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. TODAY'S TRAINING */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">calendar_today</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Today&rsquo;s Training
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/25 px-2.5 py-1 rounded-full">
            {completedCount} of {todayDrills.length} Completed
          </span>
        </div>

        {/* Training Protocol Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1f280a] via-[#1a1f12] to-[#141414] border border-[#c3f400]/30 shadow-lg flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#c3f400] uppercase tracking-wider">
                  Day 3 • Pace &amp; Seam Protocol
                </span>
                <span className="text-[10px] bg-white/10 text-[#c4c9ac] px-2 py-0.2 rounded font-medium">
                  37 Mins Total
                </span>
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-white mt-0.5">
                Upright Seam Release &amp; Death Overs Execution
              </h3>
            </div>
            <button
              onClick={() => {
                playBeep(750, 0.05);
                onNavigate('planner');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Full Schedule</span>
            </button>
          </div>

          {/* Drill Checklist Items */}
          <div className="flex flex-col gap-2.5">
            {todayDrills.map((drill) => (
              <div
                key={drill.id}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  drill.completed
                    ? 'bg-black/40 border-[#c3f400]/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleDrillComplete(drill.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      drill.completed
                        ? 'bg-[#c3f400] text-[#111800] shadow-[0_0_10px_rgba(195,244,0,0.4)]'
                        : 'border-2 border-white/30 text-transparent hover:border-[#c3f400]'
                    }`}
                    title={drill.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-headline font-bold truncate ${
                        drill.completed ? 'text-gray-400 line-through' : 'text-white'
                      }`}
                    >
                      {drill.title}
                    </h4>
                    <p className="text-xs text-[#8e918f] truncate">
                      {drill.sets} • {drill.duration} • <span className="text-[#c4c9ac]">{drill.focus}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      playBeep(700, 0.04);
                      onNavigate('drills-vault');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#c4c9ac] hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1"
                  >
                    <span>View Drill</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RECORD A VIDEO (HERO PROMINENT ACTION) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c3f400] via-[#b6e400] to-[#8fb800] text-[#161e00] p-5 sm:p-6 shadow-[0_0_30px_rgba(195,244,0,0.3)] border border-[#c3f400] group">
          {/* Subtle shimmer sweep */}
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col gap-1 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#161e00] text-[#c3f400] uppercase tracking-wider">
                  Live AI Camera
                </span>
                <span className="text-xs font-bold text-[#161e00]/80">
                  120 FPS High-Speed Tracking
                </span>
              </div>
              <h3 className="font-headline font-black text-xl sm:text-2xl text-[#161e00] leading-tight mt-1">
                Record a Video Delivery
              </h3>
              <p className="text-xs sm:text-sm text-[#161e00]/85 font-medium leading-snug">
                Auto-delivery slicing, pitch landing heatmap, radar ball speed &amp; release angle.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  playBeep(880, 0.1);
                  onNavigate('record');
                }}
                className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-[#161e00] hover:bg-[#253000] text-[#c3f400] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  videocam
                </span>
                <span>Launch Camera</span>
              </button>

              <button
                onClick={() => {
                  playBeep(750, 0.05);
                  onNavigate('video-analysis');
                }}
                className="px-4 py-3.5 rounded-xl bg-[#161e00]/15 hover:bg-[#161e00]/25 text-[#161e00] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#161e00]/20"
                title="Open Video Analysis Lab"
              >
                <span className="material-symbols-outlined text-[20px]">slow_motion_video</span>
                <span className="hidden sm:inline">Motion Lab</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MY GOALS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00d2ff] text-[22px]">flag</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              My Goals &amp; Milestones
            </h2>
          </div>
          <button
            onClick={() => {
              playCelebration();
              setGoals((prev) => [
                ...prev,
                {
                  id: `goal-${Date.now()}`,
                  title: 'Back-Foot Stability Index',
                  metric: '90%+ balance hold',
                  current: '84%',
                  target: 90,
                  currentVal: 84,
                  percent: 88,
                  status: 'Active Goal',
                  color: 'from-purple-400 to-purple-600',
                  badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                }
              ]);
            }}
            className="text-xs font-bold text-[#c3f400] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-[#1b1b1b] border border-white/10 hover:border-white/20 transition-all shadow-md flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${g.badgeColor}`}>
                    {g.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{g.percent}%</span>
                </div>
                <h3 className="font-headline font-bold text-sm text-white">{g.title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs text-[#8e918f]">Target:</span>
                  <span className="text-xs font-semibold text-[#c4c9ac]">{g.metric}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#8e918f] mb-1 font-mono">
                  <span>Current: {g.current}</span>
                  <span>Goal: {g.target}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${g.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, g.percent)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COACH FEEDBACK */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">record_voice_over</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Coach Feedback &amp; Audio Notes
            </h2>
          </div>
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('feedback');
            }}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Feedback History</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1a1917] border border-amber-500/30 shadow-lg flex flex-col gap-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                alt="Coach Brett Lee"
                className="w-11 h-11 rounded-xl object-cover border border-amber-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-sm sm:text-base text-white">
                    Coach Brett Lee
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    Lead Pace Director
                  </span>
                </div>
                <span className="text-[11px] text-[#8e918f]">
                  Reviewed Yesterday&rsquo;s Net Bay 2 Footage • 2h ago
                </span>
              </div>
            </div>

            {/* Interactive Audio Note Button */}
            <button
              onClick={toggleAudioFeedback}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-[#291700] shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlayingAudio ? 'Playing (0:34)' : 'Listen (0:34)'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
            &ldquo;Great upright seam orientation on delivery #14 today, Devang. Top speed reached 142.4 kph with solid wrist snap. For your death-overs drill tomorrow, keep your front elbow locked 0.2s longer before snap to prevent the ball pulling down leg-side.&rdquo;
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8e918f]">Prescribed Focus:</span>
              <button
                onClick={() => {
                  playBeep(700, 0.05);
                  onNavigate('drills-vault');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] font-bold flex items-center gap-1 hover:bg-[#c3f400]/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">fitness_center</span>
                <span>High Elbow Outswing Release</span>
              </button>
            </div>

            <button
              onClick={() => {
                playBeep(750, 0.05);
                onNavigate('video-analysis');
              }}
              className="text-xs font-bold text-white hover:text-[#c3f400] flex items-center gap-1 cursor-pointer"
            >
              <span>View Annotated Video Frame</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RECENT PROGRESS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">trending_up</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Recent Progress &amp; Bowling Velocity
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-[#201f1f] p-1 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => setActiveSpeedTab('week')}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                activeSpeedTab === 'week' ? 'bg-[#c3f400] text-[#161e00]' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setActiveSpeedTab('month')}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                activeSpeedTab === 'month' ? 'bg-[#c3f400] text-[#161e00]' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              30D
            </button>
          </div>
        </div>

        {/* Speed Chart Box */}
        <div className="rounded-2xl p-5 bg-[#1a1a1a] flex flex-col gap-4 relative overflow-hidden shadow-xl border border-white/10">
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
              <span className="font-bold text-sm text-white">Average Release Velocity</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-black text-2xl text-[#c3f400] drop-shadow-[0_0_8px_rgba(195,244,0,0.4)]">
                {activeSpeedTab === 'week' ? '138.4' : '136.8'}
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">km/h</span>
            </div>
          </div>

          {/* Glowing Vector Trajectory Chart */}
          <div className="h-24 w-full flex items-end justify-between gap-1 mt-1 z-10 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="speedAreaPlayer" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c3f400" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c3f400" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={
                  activeSpeedTab === 'week'
                    ? 'M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z'
                    : 'M0,75 Q25,70 45,55 T80,50 T100,25 L100,100 L0,100 Z'
                }
                fill="url(#speedAreaPlayer)"
              />
              <path
                d={
                  activeSpeedTab === 'week'
                    ? 'M0,80 Q20,60 40,70 T80,40 T100,20'
                    : 'M0,75 Q25,70 45,55 T80,50 T100,25'
                }
                fill="none"
                stroke="#c3f400"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy={activeSpeedTab === 'week' ? '70' : '55'} r="4" fill="#131313" stroke="#c3f400" strokeWidth="2.5" />
              <circle cx="80" cy={activeSpeedTab === 'week' ? '40' : '50'} r="4" fill="#131313" stroke="#c3f400" strokeWidth="2.5" />
              <circle cx="100" cy={activeSpeedTab === 'week' ? '20' : '25'} r="4.5" fill="#c3f400" stroke="#131313" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[#8e918f] text-xs font-mono z-10">
            <span>Mon: 134 kph</span>
            <span>Wed: 136 kph</span>
            <span>Fri: 139 kph</span>
            <span className="text-[#c3f400] font-bold">Sun: 142 kph (Peak)</span>
          </div>
        </div>

        {/* Recent Session Log Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sessions.slice(0, 3).map((sess) => (
            <div
              key={sess.id}
              onClick={() => {
                playBeep(700, 0.04);
                onSelectSession?.(sess);
                if (sess.title.toLowerCase().includes('batting')) {
                  onNavigate('feedback');
                } else {
                  onNavigate('stats');
                }
              }}
              className="p-3.5 rounded-xl bg-[#191919] hover:bg-[#222222] border border-white/10 hover:border-[#c3f400]/40 transition-all cursor-pointer shadow-md group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded">
                  {sess.type}
                </span>
                <span className="text-[11px] text-[#8e918f] font-mono">{sess.date}</span>
              </div>
              <h4 className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors truncate">
                {sess.title}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-[#c4c9ac]">
                <span>Score: <strong className="text-white">{sess.score}/100</strong></span>
                <span className="text-[11px] text-[#8e918f]">{sess.topSpeed ? `${sess.topSpeed} km/h` : sess.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
