import React from 'react';
import { UserProfile, ScreenType } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface ParentHomeViewProps {
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onOpenGuardianPortal?: () => void;
}

export const ParentHomeView: React.FC<ParentHomeViewProps> = ({
  user,
  onNavigate,
  onOpenGuardianPortal
}) => {
  const child = {
    name: 'Liam Chen',
    age: 14,
    tier: 'Junior Pace Academy (U-15)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    coachName: 'Coach Brett Lee',
    weeklyBallLimit: 120,
    currentBallsBowled: 78,
    complianceStatus: 'Safe & In-Regulation (ECB Directives)',
    nextSession: 'Today • 4:30 PM (Net Bay 3)',
    lastCoachNote: 'Liam bowled with superb upright seam alignment today. Advised light shoulder stretch and hydration before Friday match sim.'
  };

  const ballPercentage = Math.round((child.currentBallsBowled / child.weeklyBallLimit) * 100);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Guardian Header Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17201c] via-[#131b18] to-[#121414] border border-[#00d2ff]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/15 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shrink-0">
            <span className="material-symbols-outlined text-[24px]">family_restroom</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-wider">
                Parent &amp; Guardian Hub
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-white">
                Supervising: {child.name}
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-white">
              Junior Safety, Workload &amp; Progress Portal
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            playBeep(750, 0.05);
            if (onOpenGuardianPortal) {
              onOpenGuardianPortal();
            } else {
              onNavigate('profiles');
            }
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-[#002233] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>Guardian Verification Portal</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TODAY'S TRAINING & SCHEDULE FOR CHILD */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00d2ff] text-[22px]">event</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              {child.name}&rsquo;s Training Today
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8e918f]">Bay 3 • Turf</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={child.avatar}
                alt={child.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#00d2ff]/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-base text-white">{child.name}</h3>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                    {child.tier}
                  </span>
                </div>
                <p className="text-xs text-[#8e918f] mt-0.5">
                  Supervised by <strong className="text-white">{child.coachName}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                <span className="text-[#8e918f] block text-[10px]">Session Time</span>
                <span className="font-bold text-[#c3f400]">{child.nextSession}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/5 text-xs text-[#c4c9ac]">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">check_circle</span>
              <span>2 Drills Prescribed (Upright Seam &amp; Run-up Balance)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#00d2ff] text-[18px]">shield</span>
              <span>Pickup/Drop-off Bay: Gate 2 West Pavilion</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WORKLOAD & SAFETY GUARDRAIL METER (ECB/BCCI COMPLIANCE) */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px]">health_and_safety</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Workload &amp; Lumbar Safety Guardrails
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/30 px-2 py-0.5 rounded-full">
            ECB U15 Fast Bowling Directive
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs text-[#8e918f] block">Weekly Delivery Volume</span>
                <span className="font-headline font-black text-2xl text-white">
                  {child.currentBallsBowled}{' '}
                  <span className="text-sm font-normal text-[#8e918f]">/ {child.weeklyBallLimit} balls max</span>
                </span>
              </div>
              <span className="text-xs font-bold text-[#c3f400] bg-[#c3f400]/15 px-2.5 py-1 rounded-lg">
                {120 - child.currentBallsBowled} Balls Remaining
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c3f400] to-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${ballPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#8e918f] block text-[10px]">Workload Status</span>
              <span className="font-bold text-[#c3f400]">{child.complianceStatus}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#8e918f] block text-[10px]">Rest Day Requirement</span>
              <span className="font-bold text-white">Scheduled for Thursday</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#8e918f] block text-[10px]">Acute : Chronic Load Ratio</span>
              <span className="font-bold text-[#00d2ff]">1.08 (Sweet Spot)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COACH FEEDBACK & DIRECT NOTES TO GUARDIAN */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">chat</span>
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Coach Note to Guardian
            </h2>
          </div>
          <span className="text-[11px] text-[#8e918f]">Updated Today</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-amber-500/30 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              alt="Coach Brett Lee"
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
            />
            <div>
              <h3 className="font-headline font-bold text-sm text-white">Coach Brett Lee</h3>
              <p className="text-[11px] text-[#8e918f]">Lead Junior Pace Director</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
            &ldquo;{child.lastCoachNote}&rdquo;
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                playBeep(750, 0.05);
                onNavigate('feedback');
              }}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Feedback Log &amp; Video Clips</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CHILD'S DEVELOPMENT & WELL-BEING */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
          Development &amp; Well-Being Index
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Technique Consistency</span>
            <span className="font-headline font-black text-2xl text-[#c3f400]">92%</span>
            <span className="text-[10px] text-[#c3f400]">▲ Steady Progression</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Engagement &amp; Fun</span>
            <span className="font-headline font-black text-2xl text-[#00d2ff]">4.9 / 5</span>
            <span className="text-[10px] text-[#00d2ff]">High Motivation</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Avg Pace Growth</span>
            <span className="font-headline font-black text-2xl text-white">114 kph</span>
            <span className="text-[10px] text-gray-400">+4 kph this term</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Safeguarding Check</span>
            <span className="font-headline font-black text-2xl text-emerald-400">100%</span>
            <span className="text-[10px] text-emerald-400">DBS &amp; Video Protected</span>
          </div>
        </div>
      </section>
    </div>
  );
};
