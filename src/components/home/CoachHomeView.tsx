import React, { useState } from 'react';
import { UserProfile, ScreenType, DrillItem } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';
import { CoreCricketLoopStepper } from '../loop/CoreCricketLoopStepper';

interface CoachHomeViewProps {
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drill: DrillItem) => void;
}

export const CoachHomeView: React.FC<CoachHomeViewProps> = ({
  user,
  onNavigate,
  onSelectDrill
}) => {
  const [activeAttentionFilter, setActiveAttentionFilter] = useState<'all' | 'workload' | 'technique'>('all');
  const [prescribeModalOpen, setPrescribeModalOpen] = useState(false);
  const [selectedPlayerForDrill, setSelectedPlayerForDrill] = useState('Liam Chen');
  const [selectedDrillName, setSelectedDrillName] = useState('High Elbow Upright Seam Extension');

  // Players Needing Attention State
  const [attentionPlayers, setAttentionPlayers] = useState([
    {
      id: 'att-1',
      name: 'Liam Chen',
      category: 'Junior Fast Bowler (Age 14)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      type: 'workload',
      severity: 'warning',
      badge: 'Workload Warning',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      issue: '78 of 120 weekly ball limit reached (65%). 2 weekend fixtures scheduled.',
      recommendation: 'Enforce active recovery / rest day on Thursday before Friday match sim.',
      resolved: false
    },
    {
      id: 'att-2',
      name: 'Aarav Patel',
      category: 'Junior Leg-Spinner (Age 12)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      type: 'technique',
      severity: 'critical',
      badge: 'Technique Deviation',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      issue: 'Release angle dropped 4.2° in last 12 overs; non-bowling arm collapsing early.',
      recommendation: 'Prescribe "Still Head & High Front Arm Release" drill sequence.',
      resolved: false
    },
    {
      id: 'att-3',
      name: 'Devang Dalvi',
      category: 'Senior Express Pacer (Age 23)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
      type: 'technique',
      severity: 'milestone',
      badge: 'Peak Milestone',
      badgeColor: 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/30',
      issue: 'Clocked 142.4 kph top speed in Net Bay 2. Seam presentation score 94/100.',
      recommendation: 'Advance to Phase 3 Death Overs & Wide Yorker target simulation.',
      resolved: false
    }
  ]);

  // Videos Awaiting Review Queue
  const [videoQueue, setVideoQueue] = useState([
    {
      id: 'vid-1',
      athleteName: 'Liam Chen',
      athleteRole: 'U14 Junior Bowler',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      deliveryType: 'High Seam Outswinger Set (3 clips)',
      timestamp: 'Uploaded 45m ago',
      fps: '120 FPS Slow-Mo',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
      status: 'pending'
    },
    {
      id: 'vid-2',
      athleteName: 'Maya Patel',
      athleteRole: 'U14 Wrist Spinner',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      deliveryType: 'Googly & Flight Drift (2 clips)',
      timestamp: 'Uploaded 2h ago',
      fps: '60 FPS Full HD',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b1c5f53ec?w=300&auto=format&fit=crop&q=80',
      status: 'pending'
    },
    {
      id: 'vid-3',
      athleteName: 'Ryan Walsh',
      athleteRole: 'U16 Junior Premiere',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      deliveryType: 'Powerplay Pull Shot vs Short Ball',
      timestamp: 'Uploaded 3h ago',
      fps: '120 FPS Slow-Mo',
      thumbnail: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=300&auto=format&fit=crop&q=80',
      status: 'pending'
    }
  ]);

  // Assigned Drills Tracker
  const [assignedDrillsList, setAssignedDrillsList] = useState([
    {
      id: 'asgn-1',
      athlete: 'Liam Chen',
      drill: 'High Elbow Upright Seam Extension',
      category: 'Pace & Seam',
      completedReps: 12,
      totalReps: 15,
      percent: 80,
      dueDate: 'Today'
    },
    {
      id: 'asgn-2',
      athlete: 'Aarav Patel',
      drill: 'Googly Wrist Snap & Top-Spin Arc',
      category: 'Spin Precision',
      completedReps: 18,
      totalReps: 20,
      percent: 90,
      dueDate: 'Today'
    },
    {
      id: 'asgn-3',
      athlete: 'Devang Dalvi',
      drill: 'Blockhole Yorker Target Practice',
      category: 'Death Overs',
      completedReps: 15,
      totalReps: 20,
      percent: 75,
      dueDate: 'Tomorrow'
    },
    {
      id: 'asgn-4',
      athlete: 'Maya Patel',
      drill: 'Front-Foot Balance & Defense Stability',
      category: 'Batting Technique',
      completedReps: 16,
      totalReps: 20,
      percent: 80,
      dueDate: 'Friday'
    }
  ]);

  // Upcoming Sessions Calendar
  const upcomingSessions = [
    {
      id: 'sess-1',
      title: 'Junior Fast Bowling Academy Cohort',
      location: 'Net Bay 3 • Turf Wicket',
      time: 'Today • 4:30 PM - 5:45 PM',
      athletesCount: 4,
      athletes: ['Liam Chen', 'Maya Patel', 'Ryan Walsh', 'Aarav Patel'],
      type: 'Group Pace Lab',
      badgeColor: 'bg-[#c3f400]/15 text-[#c3f400] border-[#c3f400]/30'
    },
    {
      id: 'sess-2',
      title: 'Senior Match Simulation: Death Overs',
      location: 'Net Bay 1 & Center Wicket',
      time: 'Today • 6:00 PM - 7:30 PM',
      athletesCount: 6,
      athletes: ['Devang Dalvi', 'Marcus Thorne', 'Alex S.'],
      type: 'High Pressure Sim',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'sess-3',
      title: '1-on-1 Biomechanics & Radar Review',
      location: 'Indoor Motion Studio',
      time: 'Tomorrow • 9:30 AM - 10:30 AM',
      athletesCount: 1,
      athletes: ['Devang Dalvi'],
      type: 'Private Telemetry',
      badgeColor: 'bg-[#00d2ff]/15 text-[#00d2ff] border-[#00d2ff]/30'
    }
  ];

  const handlePrescribeDrill = (e: React.FormEvent) => {
    e.preventDefault();
    playCelebration();
    setAssignedDrillsList((prev) => [
      {
        id: `asgn-${Date.now()}`,
        athlete: selectedPlayerForDrill,
        drill: selectedDrillName,
        category: 'Coach Custom',
        completedReps: 0,
        totalReps: 15,
        percent: 0,
        dueDate: 'Tomorrow'
      },
      ...prev
    ]);
    setPrescribeModalOpen(false);
  };

  const filteredAttentionPlayers = attentionPlayers.filter((p) => {
    if (activeAttentionFilter === 'all') return true;
    return p.type === activeAttentionFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Coach Header Summary Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b2505] via-[#161c0a] to-[#121411] border border-[#c3f400]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shrink-0">
            <span className="material-symbols-outlined text-[24px]">sports</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#c3f400] uppercase tracking-wider">
                Coach Command Center
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-white">
                Surrey High Performance
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-white">
              Squad Telemetry &amp; Review Dashboard
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('chalkboard');
            }}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">draw</span>
            <span>Chalkboard</span>
          </button>
          <button
            onClick={() => {
              playBeep(880, 0.08);
              setPrescribeModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0de00] text-[#111800] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Prescribe Drill</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 0. CORE CRICKET MASTERY LOOP (Squad Review & Feedback Flywheel) */}
      {/* ========================================================================= */}
      <CoreCricketLoopStepper
        currentUser={user}
        onNavigate={onNavigate}
      />

      {/* ========================================================================= */}
      {/* 1. PLAYERS NEEDING ATTENTION */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">notification_important</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Players Needing Attention
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-[#201f1f] p-1 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => setActiveAttentionFilter('all')}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                activeAttentionFilter === 'all' ? 'bg-white/20 text-white' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              All ({attentionPlayers.length})
            </button>
            <button
              onClick={() => setActiveAttentionFilter('workload')}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                activeAttentionFilter === 'workload' ? 'bg-amber-500/30 text-amber-300' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              Workload
            </button>
            <button
              onClick={() => setActiveAttentionFilter('technique')}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                activeAttentionFilter === 'technique' ? 'bg-[#c3f400]/20 text-[#c3f400]' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              Technique
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {filteredAttentionPlayers.map((player) => (
            <div
              key={player.id}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-white/20 transition-all shadow-md flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${player.badgeColor}`}>
                    {player.badge}
                  </span>
                  <span className="text-[10px] text-[#8e918f]">Live Flag</span>
                </div>

                <div className="flex items-center gap-2.5 mb-2.5">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                  />
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-sm text-white truncate">{player.name}</h3>
                    <p className="text-[11px] text-[#8e918f] truncate">{player.category}</p>
                  </div>
                </div>

                <p className="text-xs text-[#e5e2e1] bg-black/30 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  {player.issue}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[11px] text-[#8e918f] truncate max-w-[170px]">
                  {player.recommendation}
                </span>
                <button
                  onClick={() => {
                    playBeep(750, 0.05);
                    if (player.type === 'workload') {
                      onNavigate('planner');
                    } else {
                      onNavigate('video-analysis');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <span>Action</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VIDEOS AWAITING REVIEW */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">video_library</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Videos Awaiting Review ({videoQueue.length})
            </h2>
          </div>
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('video-analysis');
            }}
            className="text-xs font-bold text-[#c3f400] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Telestrator Lab</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {videoQueue.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#191919] border border-white/10 hover:border-[#c3f400]/40 transition-all overflow-hidden shadow-lg flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative h-32 w-full bg-black overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.deliveryType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-[#c3f400] border border-[#c3f400]/30">
                  {item.fps}
                </span>

                <span className="absolute bottom-2.5 right-2.5 text-[10px] text-white/90 bg-black/70 px-2 py-0.5 rounded font-mono">
                  {item.timestamp}
                </span>
              </div>

              {/* Body */}
              <div className="p-3.5 flex flex-col gap-2.5 flex-1 justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.avatar}
                    alt={item.athleteName}
                    className="w-8 h-8 rounded-lg object-cover border border-white/10"
                  />
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-sm text-white truncate">{item.athleteName}</h4>
                    <p className="text-[11px] text-[#8e918f] truncate">{item.deliveryType}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playBeep(880, 0.08);
                    onNavigate('video-analysis');
                  }}
                  className="w-full py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0de00] text-[#111800] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">draw</span>
                  <span>Review in Telestrator</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ASSIGNED DRILLS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00d2ff] text-[22px]">assignment</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Assigned Drills &amp; Squad Compliance
            </h2>
          </div>
          <button
            onClick={() => setPrescribeModalOpen(true)}
            className="text-xs font-bold text-[#00d2ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Assign New Drill</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assignedDrillsList.map((asgn) => (
              <div
                key={asgn.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#c3f400] uppercase tracking-wider block mb-0.5">
                      {asgn.athlete} • {asgn.category}
                    </span>
                    <h4 className="font-headline font-bold text-sm text-white">{asgn.drill}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {asgn.completedReps}/{asgn.totalReps}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[#8e918f] mb-1">
                    <span>Progress</span>
                    <span>{asgn.percent}% Done</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c3f400] to-[#00d2ff] h-full rounded-full transition-all duration-500"
                      style={{ width: `${asgn.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLAYER PROGRESS (MACRO SQUAD TELEMETRY) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">analytics</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Player Progress &amp; Squad Velocity
            </h2>
          </div>
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('stats');
            }}
            className="text-xs font-bold text-[#c3f400] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Squad Analytics</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Squad Avg Pace</span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-black text-2xl text-[#c3f400]">128.4</span>
              <span className="text-xs text-[#8e918f]">km/h</span>
            </div>
            <span className="text-[10px] text-[#c3f400] font-bold">▲ +3.2 kph vs last month</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Good Length %</span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-black text-2xl text-[#00d2ff]">84.1%</span>
            </div>
            <span className="text-[10px] text-[#00d2ff] font-bold">▲ +5% in corridor</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Weekly Balls Bowled</span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-black text-2xl text-white">642</span>
              <span className="text-xs text-[#8e918f]">deliveries</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold">ACWR Load: 1.14 (Safe)</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Active Drills Done</span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-black text-2xl text-amber-400">92%</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold">High Squad Engagement</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. UPCOMING SESSIONS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-[22px]">event_available</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Upcoming Coaching Sessions
            </h2>
          </div>
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('planner');
            }}
            className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Bay Schedule</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-purple-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${session.badgeColor}`}>
                      {session.type}
                    </span>
                    <span className="text-xs text-[#8e918f] font-mono">{session.time}</span>
                  </div>
                  <h3 className="font-headline font-bold text-sm sm:text-base text-white mt-0.5">
                    {session.title}
                  </h3>
                  <p className="text-xs text-[#8e918f]">
                    {session.location} • <strong className="text-[#c4c9ac]">{session.athletesCount} Athletes</strong> ({session.athletes.join(', ')})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    playBeep(750, 0.05);
                    onNavigate('planner');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">checklist</span>
                  <span>Session Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL: PRESCRIBE NEW DRILL */}
      {/* ========================================================================= */}
      {prescribeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#191919] border border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[22px]">assignment_turned_in</span>
                <h3 className="font-headline font-bold text-lg text-white">Prescribe Drill to Athlete</h3>
              </div>
              <button
                type="button"
                onClick={() => setPrescribeModalOpen(false)}
                className="p-1 rounded-lg text-[#8e918f] hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePrescribeDrill} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#c4c9ac] block mb-1">Select Athlete</label>
                <select
                  value={selectedPlayerForDrill}
                  onChange={(e) => setSelectedPlayerForDrill(e.target.value)}
                  className="w-full bg-[#252525] text-white text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-[#c3f400] outline-none"
                >
                  <option value="Liam Chen">Liam Chen (Junior Fast Bowler)</option>
                  <option value="Aarav Patel">Aarav Patel (Junior Leg-Spinner)</option>
                  <option value="Devang Dalvi">Devang Dalvi (Senior Express Pacer)</option>
                  <option value="Maya Patel">Maya Patel (Junior Leg-Spin Prodigy)</option>
                  <option value="Ryan Walsh">Ryan Walsh (Junior Premiere Opener)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#c4c9ac] block mb-1">Drill Protocol</label>
                <select
                  value={selectedDrillName}
                  onChange={(e) => setSelectedDrillName(e.target.value)}
                  className="w-full bg-[#252525] text-white text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-[#c3f400] outline-none"
                >
                  <option value="High Elbow Upright Seam Extension">High Elbow Upright Seam Extension (Pace)</option>
                  <option value="Wrist Snap Yorker Target Calibration">Wrist Snap Yorker Target Calibration (Death Overs)</option>
                  <option value="Googly Wrist Snap & Top-Spin Arc">Googly Wrist Snap & Top-Spin Arc (Spin)</option>
                  <option value="Still Head Front-Foot Defense">Still Head Front-Foot Defense (Batting)</option>
                  <option value="Powerplay Upper Cut vs Bouncer">Powerplay Upper Cut vs Bouncer (Tactics)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPrescribeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#8e918f] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#c3f400] text-[#111800] hover:bg-[#b0de00] transition-colors shadow-md"
                >
                  Dispatch Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
