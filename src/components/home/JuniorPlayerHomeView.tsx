import React, { useState } from 'react';
import { UserProfile, SessionRecord, ScreenType, DrillItem } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';
import { CoreCricketLoopStepper } from '../loop/CoreCricketLoopStepper';

interface JuniorPlayerHomeViewProps {
  user: UserProfile;
  sessions: SessionRecord[];
  onNavigate: (screen: ScreenType) => void;
  onSelectSession?: (session: SessionRecord) => void;
  onSelectDrill?: (drill: DrillItem) => void;
}

export const JuniorPlayerHomeView: React.FC<JuniorPlayerHomeViewProps> = ({
  user,
  sessions,
  onNavigate,
  onSelectSession,
  onSelectDrill
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Junior Today's Training Checklist
  const [juniorDrills, setJuniorDrills] = useState([
    {
      id: 'jdrill-1',
      title: 'Upright Seam & Wrist Hold',
      duration: '10 mins',
      reps: '15 releases into soft catch net',
      focus: 'Keep wrist upright and follow through down side',
      completed: true,
      category: 'Seam Release'
    },
    {
      id: 'jdrill-2',
      title: 'Target Cone Good-Length Challenge',
      duration: '12 mins',
      reps: '12 deliveries aiming for yellow cone',
      focus: 'Smooth run-up rhythm and balance',
      completed: false,
      category: 'Accuracy'
    }
  ]);

  // Junior Goals
  const [goals, setGoals] = useState([
    {
      id: 'jgoal-1',
      title: 'Run-up Balance Index',
      metric: 'Smooth non-bowling arm pull',
      current: '88%',
      target: 90,
      percent: 88,
      status: 'On Track',
      color: 'from-emerald-400 to-teal-500',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'jgoal-2',
      title: 'Good Length Cone Hits',
      metric: '8 of 12 balls on target',
      current: '7 / 12',
      target: 8,
      percent: 87,
      status: 'Great Effort',
      color: 'from-[#00d2ff] to-blue-500',
      badgeColor: 'text-[#00d2ff] bg-[#00d2ff]/10 border-[#00d2ff]/30'
    }
  ]);

  const toggleDrill = (id: string) => {
    playCelebration();
    setJuniorDrills((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const toggleAudio = () => {
    if (!isPlayingAudio) {
      playBeep(880, 0.1);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3500);
    } else {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Junior Guardian Safeguarding Status Strip */}
      <div className="p-3.5 rounded-2xl bg-[#16201a] border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">verified_user</span>
          <div>
            <span className="font-bold text-white">Junior Safe Mode Active</span>
            <span className="text-[#8e918f] block text-[11px]">
              Guardian (Sarah Chen) linked • Supervised by Coach Brett Lee
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          U15 Verified
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 0. CORE CRICKET MASTERY LOOP */}
      {/* ========================================================================= */}
      <CoreCricketLoopStepper
        currentUser={user}
        onNavigate={onNavigate}
      />

      {/* ========================================================================= */}
      {/* 1. TODAY'S TRAINING */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">calendar_today</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Today&rsquo;s Junior Training
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/25 px-2.5 py-1 rounded-full">
            {juniorDrills.filter((d) => d.completed).length} of {juniorDrills.length} Completed
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#c3f400] uppercase tracking-wider">
                Junior Fast Bowling Skill Set
              </span>
              <h3 className="font-headline font-bold text-base text-white mt-0.5">
                Upright Seam &amp; Target Pitching
              </h3>
            </div>
            <span className="text-xs text-[#c4c9ac] font-mono bg-white/5 px-2.5 py-1 rounded-lg">
              Session Limit: 24 Deliveries
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {juniorDrills.map((drill) => (
              <div
                key={drill.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  drill.completed
                    ? 'bg-black/40 border-emerald-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleDrill(drill.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      drill.completed
                        ? 'bg-emerald-400 text-[#002b11] shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                        : 'border-2 border-white/30 text-transparent hover:border-emerald-400'
                    }`}
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
                      {drill.reps} • {drill.duration} • <span className="text-[#c4c9ac]">{drill.focus}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playBeep(700, 0.04);
                    onNavigate('drills-vault');
                  }}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#c4c9ac] hover:text-white transition-all cursor-pointer hidden sm:block"
                >
                  View Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RECORD A VIDEO (SUPERVISED) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 text-[#002411] p-5 sm:p-6 shadow-xl border border-emerald-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-lg">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#002411] text-emerald-300 uppercase tracking-wider w-fit">
                Junior Safe Video Capture
              </span>
              <h3 className="font-headline font-black text-xl sm:text-2xl text-[#002411] leading-tight mt-1">
                Record Delivery Practice
              </h3>
              <p className="text-xs sm:text-sm text-[#002411]/90 font-medium">
                Auto-slow motion capture with coach and parent verified cloud review.
              </p>
            </div>

            <button
              onClick={() => {
                playBeep(880, 0.1);
                onNavigate('record');
              }}
              className="px-5 py-3.5 rounded-xl bg-[#002411] hover:bg-[#00381b] text-emerald-300 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[22px]">videocam</span>
              <span>Start Recording</span>
            </button>
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
              My Goals &amp; Badges
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-bold">2 Active Goals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col justify-between gap-3 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${g.badgeColor}`}>
                    {g.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{g.percent}%</span>
                </div>
                <h3 className="font-headline font-bold text-sm text-white">{g.title}</h3>
                <span className="text-xs text-[#8e918f]">{g.metric}</span>
              </div>

              <div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${g.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${g.percent}%` }}
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
              Coach Brett&rsquo;s Voice Note
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-amber-500/30 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                alt="Coach Brett Lee"
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
              />
              <div>
                <h3 className="font-headline font-bold text-sm text-white">Coach Brett Lee</h3>
                <span className="text-[11px] text-[#8e918f]">Sent 2 hours ago</span>
              </div>
            </div>

            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-[#291700] shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlayingAudio ? 'Playing' : 'Listen (0:28)'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
            &ldquo;Brilliant effort in net session 3 today, Liam! Your wrist stayed locked upright and the ball had great seam presentation. Remember to keep your eyes fixed on the target cone all the way through release.&rdquo;
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RECENT PROGRESS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
          Recent Progress &amp; Workload
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Balls This Week</span>
            <span className="font-headline font-black text-2xl text-emerald-400">78</span>
            <span className="text-[10px] text-[#8e918f]">Max limit 120</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Target Hits</span>
            <span className="font-headline font-black text-2xl text-[#00d2ff]">84%</span>
            <span className="text-[10px] text-emerald-400">▲ +6% this month</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Drills Done</span>
            <span className="font-headline font-black text-2xl text-[#c3f400]">12</span>
            <span className="text-[10px] text-[#c3f400]">Great consistency</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Recovery Status</span>
            <span className="font-headline font-black text-2xl text-purple-400">Rest Day</span>
            <span className="text-[10px] text-purple-300">Thursday scheduled</span>
          </div>
        </div>
      </section>
    </div>
  );
};
