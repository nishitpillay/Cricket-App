import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface WorkScreenProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onOpenGuardianPortal?: () => void;
}

type WorkspaceCategory = 'all' | 'player' | 'junior' | 'coach' | 'parent' | 'academy_admin' | 'platform_admin';

export const WorkScreen: React.FC<WorkScreenProps> = ({ currentUser, onNavigate, onOpenGuardianPortal }) => {
  // Determine role default tab
  const getInitialCategory = (): WorkspaceCategory => {
    if (!currentUser) return 'all';
    if (currentUser.isJunior) return 'junior';
    if (currentUser.role === 'coach') return 'coach';
    if (currentUser.role === 'parent') return 'parent';
    if (
      currentUser.role === 'platform_admin' ||
      currentUser.role === 'security_admin' ||
      currentUser.adminSubCategory === 'Platform Admin'
    ) {
      return 'platform_admin';
    }
    if (currentUser.role === 'admin' || currentUser.role === 'club_admin') {
      return 'academy_admin';
    }
    return 'player';
  };

  const [activeTab, setActiveTab] = useState<WorkspaceCategory>(getInitialCategory());

  const tools = [
    // 0. UNIFIED FLAGSHIP HUBS
    {
      id: 'train',
      label: 'Train (All-In-One Hub)',
      categories: ['player', 'junior', 'coach', 'parent', 'all'],
      journeyBadge: 'Flagship Hub • Drills, Plan & Scenarios',
      icon: 'fitness_center',
      color: 'text-[#c3f400]',
      desc: 'Smart Drills Vault, weekly training planners, active practice rep counters & tactical match scenarios'
    },
    {
      id: 'video',
      label: 'Video Studio (All-In-One Hub)',
      categories: ['player', 'junior', 'coach', 'parent', 'all'],
      journeyBadge: 'Flagship Hub • Capture, Lab & Dual Sync',
      icon: 'slow_motion_video',
      color: 'text-blue-400',
      desc: '120-240 FPS Camera record, media vault, frame-by-frame biomechanical slow-motion & side-by-side comparison'
    },
    {
      id: 'progress',
      label: 'Progress & PDP (All-In-One Hub)',
      categories: ['player', 'junior', 'coach', 'parent', 'all'],
      journeyBadge: 'Flagship Hub • Goals, Stats & Evidence',
      icon: 'trending_up',
      color: 'text-emerald-400',
      desc: 'Active goals, performance radar stats, coach voice notes & verified before/after development evidence'
    },
    // 1. SENIOR PLAYER TOOLS
    {
      id: 'pdp',
      label: 'Player Development Plan (PDP)',
      categories: ['player', 'junior', 'coach', 'parent', 'all'],
      journeyBadge: 'Core Flagship • Evidence-Backed PDP',
      icon: 'assignment_ind',
      color: 'text-[#c3f400]',
      desc: 'Strengths, growth areas, active goals, assigned drills, coach voice notes, recent videos & before/after evidence'
    },
    {
      id: 'skill-tree',
      label: 'Cricket Skill Trees',
      categories: ['player', 'junior', 'coach', 'all'],
      journeyBadge: 'Core • Player / Coach',
      icon: 'account_tree',
      color: 'text-[#c3f400]',
      desc: 'Structured technical trees: stance, trigger, bat path, gather, front-arm, brace & release'
    },
    {
      id: 'record',
      label: 'Live AI Camera & Radar',
      categories: ['player', 'all'],
      journeyBadge: 'Core • Player',
      icon: 'videocam',
      color: 'text-[#c3f400]',
      desc: '120 FPS high-speed video capture, auto-delivery trimming & ball speed radar'
    },
    {
      id: 'video-analysis',
      label: 'Motion Lab & Biomechanics',
      categories: ['player', 'coach', 'all'],
      journeyBadge: 'Core • Player / Coach',
      icon: 'slow_motion_video',
      color: 'text-blue-400',
      desc: 'Slow-motion stepper, release angle calibration & side-by-side comparison'
    },
    {
      id: 'drills-vault',
      label: 'Smart Drills Vault',
      categories: ['player', 'all'],
      journeyBadge: 'Core • Player',
      icon: 'fitness_center',
      color: 'text-emerald-400',
      desc: 'Pace, spin, seam & batting skill development drills with rep counters'
    },
    {
      id: 'stats',
      label: 'Stats & Wagon Wheel',
      categories: ['player', 'all'],
      journeyBadge: 'Important • Player',
      icon: 'radar',
      color: 'text-amber-400',
      desc: 'Pitch corridor heatmaps, release angles & wagon wheel shot vectors'
    },
    {
      id: 'feedback',
      label: 'Coach Audio & Video Feedback',
      categories: ['player', 'all'],
      journeyBadge: 'Core • Player',
      icon: 'mic',
      color: 'text-cyan-400',
      desc: 'Listen to coach voice notes, view annotated key-frames & homework drills'
    },
    {
      id: 'masterclasses',
      label: 'Tactical Masterclasses',
      categories: ['player', 'coach', 'all'],
      journeyBadge: 'Advanced • Pro',
      icon: 'school',
      color: 'text-indigo-400',
      desc: 'Masterclass curriculum from Brett Lee, Ashwin & international directors'
    },
    {
      id: 'scenarios',
      label: 'Match Scenario Simulator',
      categories: ['player', 'all'],
      journeyBadge: 'Advanced • Player',
      icon: 'psychology',
      color: 'text-pink-400',
      desc: 'Death-overs tactical execution & situational pressure drills'
    },

    // 2. JUNIOR PLAYER TOOLS
    {
      id: 'drills-vault',
      label: 'Junior Assigned Drills',
      categories: ['junior'],
      journeyBadge: 'Core • Junior',
      icon: 'fitness_center',
      color: 'text-emerald-400',
      desc: 'Age-appropriate junior fast bowling and batting routines with coach targets'
    },
    {
      id: 'record',
      label: 'Supervised Video Capture',
      categories: ['junior'],
      journeyBadge: 'Core • Junior',
      icon: 'videocam',
      color: 'text-[#c3f400]',
      desc: 'Record bowling deliveries with guardian-protected cloud review'
    },
    {
      id: 'stats',
      label: 'My Growth & Progress',
      categories: ['junior'],
      journeyBadge: 'Important • Junior',
      icon: 'trending_up',
      color: 'text-[#00d2ff]',
      desc: 'Delivery counts, pace progression, and technique consistency scores'
    },
    {
      id: 'feedback',
      label: 'Coach Voice Notes',
      categories: ['junior'],
      journeyBadge: 'Core • Junior',
      icon: 'record_voice_over',
      color: 'text-amber-400',
      desc: 'Listen to encouragement and technique guidance directly from coach'
    },

    // 3. COACH JOURNEY TOOLS
    {
      id: 'video-analysis',
      label: 'Pro Telestrator Lab',
      categories: ['coach'],
      journeyBadge: 'Core • Coach',
      icon: 'draw',
      color: 'text-blue-400',
      desc: 'Slow-motion video drawing suite, angle rays & release markers'
    },
    {
      id: 'chalkboard',
      label: 'Tactics Chalkboard',
      categories: ['coach', 'all'],
      journeyBadge: 'Important • Coach',
      icon: 'gesture',
      color: 'text-yellow-400',
      desc: 'Interactive field placement board & tactical set-piece designer'
    },
    {
      id: 'planner',
      label: 'Training Planner & Schedule',
      categories: ['coach', 'all'],
      journeyBadge: 'Important • Coach',
      icon: 'calendar_month',
      color: 'text-teal-400',
      desc: 'Weekly squad calendar, session dispatch & load tracking'
    },
    {
      id: 'feedback',
      label: 'Review Queue & Voice Notes',
      categories: ['coach'],
      journeyBadge: 'Core • Coach',
      icon: 'rate_review',
      color: 'text-cyan-400',
      desc: 'Unreviewed athlete video queue, voice note recording & drill dispatch'
    },
    {
      id: 'profiles',
      label: 'Squad Rosters & Triage',
      categories: ['coach'],
      journeyBadge: 'Core • Coach',
      icon: 'badge',
      color: 'text-purple-400',
      desc: 'Manage squad athlete profiles, workload thresholds & performance tags'
    },

    // 4. PARENT JOURNEY TOOLS
    {
      id: 'guardian-portal',
      label: 'Guardian Safety Portal',
      categories: ['parent', 'all'],
      journeyBadge: 'Core • Parent',
      icon: 'family_restroom',
      color: 'text-green-400',
      desc: 'Supervision settings, verified consent, pickup bays & video quarantine',
      action: () => onOpenGuardianPortal?.()
    },
    {
      id: 'feedback',
      label: 'Coach Notes & Progress',
      categories: ['parent'],
      journeyBadge: 'Core • Parent',
      icon: 'chat',
      color: 'text-amber-400',
      desc: 'Direct communication from coaching staff and development indices'
    },
    {
      id: 'planner',
      label: 'Junior Session Schedule',
      categories: ['parent'],
      journeyBadge: 'Important • Parent',
      icon: 'event',
      color: 'text-teal-400',
      desc: 'Training bay locations, pickup times & net attendance RSVP'
    },
    {
      id: 'privacy-governance',
      label: 'Child Data Safeguards',
      categories: ['parent'],
      journeyBadge: 'Important • Parent',
      icon: 'shield',
      color: 'text-emerald-400',
      desc: 'DBS certified staff logs, restricted video access & privacy controls'
    },

    // 5. ACADEMY ADMIN TOOLS
    {
      id: 'profiles',
      label: 'Academy Roster Directory',
      categories: ['academy_admin'],
      journeyBadge: 'Admin-only',
      icon: 'badge',
      color: 'text-purple-400',
      desc: 'Manage Senior, Junior & Premiere squads, coaches and guardian links'
    },
    {
      id: 'planner',
      label: 'Facility Bay Allocations',
      categories: ['academy_admin'],
      journeyBadge: 'Admin-only',
      icon: 'stadium',
      color: 'text-teal-400',
      desc: 'Turf wicket, astro pitch, and indoor motion studio bay assignments'
    },
    {
      id: 'privacy-governance',
      label: 'Safeguarding & Incident Audits',
      categories: ['academy_admin'],
      journeyBadge: 'Admin-only',
      icon: 'gavel',
      color: 'text-red-400',
      desc: 'Junior data guardrails, DBS compliance tracking & incident logs'
    },

    // 6. PLATFORM ADMIN TOOLS
    {
      id: 'cloud-infrastructure',
      label: 'Cloud Infrastructure Telemetry',
      categories: ['platform_admin', 'all'],
      journeyBadge: 'Admin-only',
      icon: 'cloud_sync',
      color: 'text-orange-400',
      desc: 'AU-Southeast-1 data residency, Cloud Run health & video bucket telemetry'
    },
    {
      id: 'security-settings',
      label: 'Security Engine & Keystore',
      categories: ['platform_admin', 'all'],
      journeyBadge: 'Admin-only',
      icon: 'shield',
      color: 'text-red-400',
      desc: 'MASVS L1/L2 compliance, biometric keystore & KMS envelope encryption'
    },
    {
      id: 'encryption-governance',
      label: 'Data Encryption & KMS Keys',
      categories: ['platform_admin'],
      journeyBadge: 'Admin-only',
      icon: 'vpn_key',
      color: 'text-cyan-400',
      desc: 'AES-256-GCM hardware key versioning and rotation cycles'
    },
    {
      id: 'source-code-security',
      label: 'DevSecOps & Source Security',
      categories: ['platform_admin'],
      journeyBadge: 'Admin-only',
      icon: 'terminal',
      color: 'text-amber-400',
      desc: 'Dependency vulnerability audits, static code analysis & build sign-offs'
    }
  ];

  const filteredTools =
    activeTab === 'all'
      ? tools.filter((t, idx, arr) => arr.findIndex((x) => x.id === t.id && x.label === t.label) === idx)
      : tools.filter((t) => t.categories.includes(activeTab));

  const roleLabels: { id: WorkspaceCategory; label: string }[] = [
    { id: 'player', label: 'Senior Player' },
    { id: 'junior', label: 'Junior Player' },
    { id: 'coach', label: 'Coach' },
    { id: 'parent', label: 'Parent' },
    { id: 'academy_admin', label: 'Academy Admin' },
    { id: 'platform_admin', label: 'Platform Admin' },
    { id: 'all', label: 'All Tools' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 w-full pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-black text-white tracking-tight">
            Workspace Tools &amp; Features
          </h2>
          <p className="text-[#c4c9ac] text-xs sm:text-sm">
            Role-scoped feature suite adhering to the academy feature governance matrix.
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          {roleLabels.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playBeep(650, 0.03);
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#c3f400] text-[#111800] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTools.map((tool, index) => (
          <button
            key={`${tool.id}-${index}`}
            onClick={() => {
              playBeep(750, 0.04);
              if (tool.action) {
                tool.action();
              } else {
                onNavigate(tool.id as ScreenType);
              }
            }}
            className="flex flex-col text-left p-4 bg-[#181818] hover:bg-[#202020] border border-white/10 hover:border-white/20 rounded-2xl transition-all cursor-pointer group shadow-md relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className={`material-symbols-outlined text-[26px] ${tool.color}`}>
                  {tool.icon}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/5 text-[#c4c9ac] uppercase">
                {tool.journeyBadge}
              </span>
            </div>
            <h3 className="text-white text-sm font-headline font-bold group-hover:text-[#c3f400] transition-colors">
              {tool.label}
            </h3>
            <p className="text-xs text-[#8e918f] mt-1 line-clamp-2">
              {tool.desc}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#c4c9ac] group-hover:text-white transition-colors">
              <span>Launch Feature</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
