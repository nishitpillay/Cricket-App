import React, { useState } from 'react';
import { UserProfile, UserRole, ScreenType, DrillItem } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PrimaryJourneyHubProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drill: DrillItem) => void;
  onOpenGuardianPortal?: () => void;
  onOpenRoleSwitcher?: () => void;
}

type JourneyType = 'player' | 'coach' | 'parent' | 'admin';

export const PrimaryJourneyHub: React.FC<PrimaryJourneyHubProps> = ({
  currentUser,
  onNavigate,
  onOpenGuardianPortal,
  onOpenRoleSwitcher
}) => {
  // Determine default journey mode from active user role
  const getInitialJourney = (): JourneyType => {
    if (currentUser.role === 'coach') return 'coach';
    if (currentUser.role === 'parent') return 'parent';
    if (
      currentUser.role === 'admin' ||
      currentUser.role === 'club_admin' ||
      currentUser.role === 'security_admin' ||
      currentUser.role === 'platform_admin'
    ) {
      return 'admin';
    }
    return 'player';
  };

  const [activeJourney, setActiveJourney] = useState<JourneyType>(getInitialJourney());

  // Coach Quick Assign State
  const [assignedAthlete, setAssignedAthlete] = useState<string>('Liam Chen');
  const [selectedDrillToPrescribe, setSelectedDrillToPrescribe] = useState<string>('High Elbow Outswing Release');
  const [prescribeSent, setPrescribeSent] = useState<boolean>(false);

  // Quick Squad Roster Data for Coach
  const squadRoster = [
    {
      id: 'liam',
      name: 'Liam Chen',
      category: 'Junior players (U15)',
      tier: 'Rising Star',
      ballsBowled: 78,
      ballLimit: 120,
      status: 'Ready',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      lastPace: '118 kph',
      pendingReview: true
    },
    {
      id: 'aarav',
      name: 'Aarav Patel',
      category: 'Junior players (U13)',
      tier: 'Spin Pathway',
      ballsBowled: 92,
      ballLimit: 150,
      status: 'Rest Recommended',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      lastPace: '82 kph (Leg Break)',
      pendingReview: false
    },
    {
      id: 'devang',
      name: 'Devang Dalvi',
      category: 'Senior players',
      tier: 'Elite Pro',
      ballsBowled: 142,
      ballLimit: 210,
      status: 'Peak Form',
      statusColor: 'text-[#c3f400] bg-[#c3f400]/10 border-[#c3f400]/30',
      lastPace: '142 kph',
      pendingReview: true
    },
    {
      id: 'marcus',
      name: 'Marcus Thorne',
      category: 'Senior players',
      tier: 'First-Class',
      ballsBowled: 165,
      ballLimit: 210,
      status: 'Ready',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      lastPace: '146 kph',
      pendingReview: false
    }
  ];

  const handlePrescribeDrill = () => {
    playCelebration();
    setPrescribeSent(true);
    setTimeout(() => setPrescribeSent(false), 3500);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Journey Mode Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase font-bold text-[#c4c9ac] px-2 py-0.5 rounded-md bg-white/5">
            User Journey
          </span>
          <span className="text-xs text-[#8e918f] hidden sm:inline">Explore role workflows:</span>
        </div>

        {/* 4 Interactive Journey Pills */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(600, 0.04);
              setActiveJourney('player');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeJourney === 'player'
                ? 'bg-[#c3f400] text-[#111800] shadow-[0_0_12px_rgba(195,244,0,0.35)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sports_cricket</span>
            <span>Player</span>
          </button>

          <button
            onClick={() => {
              playBeep(650, 0.04);
              setActiveJourney('coach');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeJourney === 'coach'
                ? 'bg-[#00d2ff] text-[#002b36] shadow-[0_0_12px_rgba(0,210,255,0.35)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sports</span>
            <span>Coach</span>
          </button>

          <button
            onClick={() => {
              playBeep(700, 0.04);
              setActiveJourney('parent');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeJourney === 'parent'
                ? 'bg-[#4ade80] text-[#052e16] shadow-[0_0_12px_rgba(74,222,128,0.35)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
            <span>Parent</span>
          </button>

          <button
            onClick={() => {
              playBeep(750, 0.04);
              setActiveJourney('admin');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeJourney === 'admin'
                ? 'bg-purple-400 text-[#220738] shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Academy Admin</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PLAYER JOURNEY: Train better, understand weaknesses, improve technique, track progress */}
      {/* ========================================================================= */}
      {activeJourney === 'player' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          {/* Action Grid: Record Live Telemetry + Calibration Motion Lab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                playBeep(880, 0.08);
                onNavigate('record');
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c3f400] to-[#a8d300] text-[#161e00] p-4.5 shadow-[0_0_25px_rgba(195,244,0,0.25)] hover:shadow-[0_0_35px_rgba(195,244,0,0.4)] active:scale-[0.99] transition-all duration-200 text-left cursor-pointer border border-[#c3f400] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#161e00]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px] text-[#161e00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    videocam
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#161e00] text-[#c3f400] uppercase tracking-wider">
                  Live AI Slicing
                </span>
              </div>
              <h3 className="font-headline font-black text-lg sm:text-xl text-[#161e00] leading-tight">
                Start Live Net Recording
              </h3>
              <p className="text-xs text-[#161e00]/80 mt-1 font-medium">
                Auto-delivery pitch map, radar speed, release height & swing angle tracking.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#161e00] mt-3 group-hover:translate-x-1 transition-transform">
                <span>Launch Camera Tracker</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </button>

            <button
              onClick={() => {
                playBeep(750, 0.06);
                onNavigate('video-analysis');
              }}
              className="relative overflow-hidden rounded-2xl bg-[#1c1c1c] hover:bg-[#232323] text-white p-4.5 border border-white/10 hover:border-[#c3f400]/40 active:scale-[0.99] transition-all duration-200 text-left cursor-pointer shadow-lg group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#c3f400]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px] text-[#c3f400]">
                    analytics
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#c4c9ac] uppercase tracking-wider">
                  Motion Lab
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-white leading-tight">
                Biomechanics & Video Lab
              </h3>
              <p className="text-xs text-[#c4c9ac] mt-1">
                Upload video, slow-motion frame stepper, joint angle calibration & side-by-side pro comparison.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#c3f400] mt-3 group-hover:translate-x-1 transition-transform">
                <span>Analyze Technique</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </button>
          </div>

          {/* Diagnostic & Prescribed Focus Card */}
          <div className="p-4 rounded-2xl bg-[#171717] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-[22px]">target</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Weakness Diagnostic
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                    Release Wrist Tilt: 16° (Target 22°)
                  </span>
                </div>
                <h4 className="font-headline font-bold text-sm text-white mt-0.5">
                  Fix: High Elbow Upright Seam Extension
                </h4>
                <p className="text-xs text-[#c4c9ac]">
                  Recommended by Coach Brett Lee • 8 reps completed of 15 this week.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  playBeep(700, 0.05);
                  onNavigate('drills-vault');
                }}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">library_books</span>
                <span>Drills Vault</span>
              </button>
              <button
                onClick={() => {
                  playBeep(800, 0.05);
                  onNavigate('stats');
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#d4ff1f] text-[#111800] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.3)]"
              >
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COACH JOURNEY: Assess players, assign work, review progress, give feedback */}
      {/* ========================================================================= */}
      {activeJourney === 'coach' && (
        <div className="flex flex-col gap-3.5 animate-fadeIn">
          {/* Coach Quick Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#003847]/40 via-[#192226] to-[#141414] border border-[#00d2ff]/30 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff]">
                  <span className="material-symbols-outlined text-[22px]">sports</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-white">Squad Assessment & Roster Hub</h3>
                  <p className="text-xs text-[#c4c9ac]">
                    4 Assigned Academy Athletes • 2 Pending Video Reviews
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playBeep(700, 0.04);
                    onNavigate('video-analysis');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#00d2ff] hover:bg-[#38dfff] text-[#002b36] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                >
                  <span className="material-symbols-outlined text-[16px]">draw</span>
                  <span>Open Telestrator</span>
                </button>
                <button
                  onClick={() => {
                    playBeep(700, 0.04);
                    onNavigate('feedback');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  <span>Voice Note</span>
                </button>
              </div>
            </div>

            {/* Squad Roster Quick Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#8e918f] font-mono uppercase text-[10px]">
                    <th className="pb-2 font-semibold">Athlete</th>
                    <th className="pb-2 font-semibold">Category / Tier</th>
                    <th className="pb-2 font-semibold">Weekly Balls</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {squadRoster.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-bold text-white flex items-center gap-2">
                        <span>{athlete.name}</span>
                        {athlete.pendingReview && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30">
                            Review
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#c4c9ac]">
                        {athlete.category} • <span className="text-gray-300">{athlete.tier}</span>
                      </td>
                      <td className="py-2.5 font-mono">
                        <span className="text-white font-bold">{athlete.ballsBowled}</span> / {athlete.ballLimit}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${athlete.statusColor}`}>
                          {athlete.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setAssignedAthlete(athlete.name);
                            playBeep(800, 0.03);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            assignedAthlete === athlete.name
                              ? 'bg-[#00d2ff] text-[#002b36]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {assignedAthlete === athlete.name ? 'Selected' : 'Assign'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Prescribe Drill Dispatcher */}
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#00d2ff] text-[18px]">assignment_turned_in</span>
                <span className="text-xs font-headline font-bold text-white">
                  Prescribe Drill to <strong className="text-[#00d2ff]">{assignedAthlete}</strong>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  CC Guardian Safe
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[
                  'High Elbow Outswing Release',
                  'Wrist-Snap Yorker Calibration',
                  'Wrong-Un Deception Loop',
                  'Back-Foot Punch Balance'
                ].map((drill) => (
                  <button
                    key={drill}
                    onClick={() => {
                      setSelectedDrillToPrescribe(drill);
                      playBeep(700, 0.02);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      selectedDrillToPrescribe === drill
                        ? 'bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]'
                        : 'bg-white/5 text-[#c4c9ac] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {drill}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePrescribeDrill}
              disabled={prescribeSent}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                prescribeSent
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#00d2ff] hover:bg-[#43e3ff] text-[#002b36] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {prescribeSent ? 'done_all' : 'send'}
              </span>
              <span>{prescribeSent ? 'Dispatched (Parent CCed)' : 'Dispatch Drill'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PARENT JOURNEY: Understand development and safety without being overwhelmed */}
      {/* ========================================================================= */}
      {activeJourney === 'parent' && (
        <div className="flex flex-col gap-3.5 animate-fadeIn">
          {/* Jargon-Free Growth & Well-being Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d2a1a] via-[#14231b] to-[#141414] border border-[#4ade80]/30 shadow-lg flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4ade80]/20 flex items-center justify-center text-[#4ade80] border border-[#4ade80]/30">
                  <span className="material-symbols-outlined text-[24px]">child_care</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-white">Liam Chen</h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Age 14 • Junior Academy
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c9ac]">
                    Supervised by Sarah Chen (Mother & Verified Guardian)
                  </p>
                </div>
              </div>

              {onOpenGuardianPortal && (
                <button
                  onClick={onOpenGuardianPortal}
                  className="px-3 py-1.5 rounded-xl bg-[#4ade80] hover:bg-[#6ee7a0] text-[#052e16] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                >
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  <span>Open Guardian Portal</span>
                </button>
              )}
            </div>

            {/* 3 Simple, Jargon-Free Safety & Development Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Workload Safety */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#8e918f]">Weekly Workload</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    Safe Zone
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline font-black text-xl text-white">78</span>
                  <span className="text-xs text-[#c4c9ac]">/ 120 balls max</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-[10px] text-[#c4c9ac] mt-0.5">
                  Compliant with ECB/BCCI U15 Fast Bowling Safety Guidelines
                </span>
              </div>

              {/* Technique Consistency */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#8e918f]">Form Consistency</span>
                  <span className="text-[10px] font-bold text-[#c3f400] bg-[#c3f400]/10 px-1.5 py-0.2 rounded">
                    Excellent
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline font-black text-xl text-white">92%</span>
                  <span className="text-xs text-[#c4c9ac]">accuracy score</span>
                </div>
                <span className="text-[10px] text-[#c4c9ac] mt-1.5">
                  Upright delivery balance and landing knee alignment verified
                </span>
              </div>

              {/* Next Practice Schedule */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#8e918f]">Next Club Practice</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                    Scheduled
                  </span>
                </div>
                <div className="font-headline font-bold text-sm text-white mt-1">
                  Tomorrow • 4:30 PM
                </div>
                <span className="text-[10px] text-[#c4c9ac]">
                  Net Bay 3 • Supervised by Coach Brett & Coach Mike
                </span>
              </div>
            </div>

            {/* Coach Transparent Note to Parent */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0 mt-0.5">
                mark_chat_read
              </span>
              <div className="text-xs">
                <strong className="text-white font-semibold">Latest Coach Note from Brett: </strong>
                <span className="text-[#c4c9ac]">
                  &ldquo;Liam bowled with superb upright seam alignment today during target drills. Please ensure he gets 1 full rest day on Thursday before the Friday match simulation.&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACADEMY / CLUB ADMIN JOURNEY: Manage players & coaches, governance, macro stats */}
      {/* ========================================================================= */}
      {activeJourney === 'admin' && (
        <div className="flex flex-col gap-3.5 animate-fadeIn">
          {/* Admin Management Grid */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2c1338] via-[#1d1522] to-[#141414] border border-purple-500/30 shadow-lg flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                  <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-white">
                    Academy & Club Governance Hub
                  </h3>
                  <p className="text-xs text-[#c4c9ac]">
                    38 Active Athletes • 7 Specialized Coaches • 100% Consent Compliance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playBeep(700, 0.04);
                    onNavigate('profiles');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-[#220738] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                >
                  <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                  <span>Roster Directory</span>
                </button>
                <button
                  onClick={() => {
                    playBeep(700, 0.04);
                    onNavigate('privacy-governance');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                  <span>Safeguarding Audit</span>
                </button>
              </div>
            </div>

            {/* Macro Cohort & Governance Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-[#8e918f] uppercase">Senior Squad</span>
                <div className="font-headline font-black text-xl text-white mt-0.5">12</div>
                <span className="text-[10px] text-emerald-400">All Active</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-[#8e918f] uppercase">Junior Players</span>
                <div className="font-headline font-black text-xl text-white mt-0.5">18</div>
                <span className="text-[10px] text-emerald-400">100% Verified</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-[#8e918f] uppercase">Junior Premiere</span>
                <div className="font-headline font-black text-xl text-white mt-0.5">8</div>
                <span className="text-[10px] text-[#c3f400]">Elite Pathway</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-[#8e918f] uppercase">Coaching Staff</span>
                <div className="font-headline font-black text-xl text-white mt-0.5">7</div>
                <span className="text-[10px] text-purple-300">DBS Verified</span>
              </div>
            </div>

            {/* Quick Governance Audit Bar */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">verified</span>
                <span className="text-white font-medium">
                  Safeguarding Audit Status: <strong className="text-emerald-400">Pass (No Quarantined Incidents)</strong>
                </span>
              </div>
              <span className="text-[#c4c9ac] font-mono text-[11px]">
                Last Audit: Today 08:30 AM • DSL Devi Pillay
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
