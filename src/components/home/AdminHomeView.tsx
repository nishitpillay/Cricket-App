import React from 'react';
import { UserProfile, ScreenType } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface AdminHomeViewProps {
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onOpenRoleSwitcher?: () => void;
}

export const AdminHomeView: React.FC<AdminHomeViewProps> = ({
  user,
  onNavigate,
  onOpenRoleSwitcher
}) => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Admin Header Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#22171c] via-[#1a1215] to-[#141214] border border-[#ffb4ab]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] shrink-0">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#ffb4ab] uppercase tracking-wider">
                Academy Admin &amp; Governance
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-white">
                Platform Root
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-white">
              Academy Operations &amp; Safeguarding Hub
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('profiles');
            }}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Roster Directory</span>
          </button>
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('security-settings');
            }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#ffb4ab] hover:bg-[#ff897d] text-[#410002] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>Security Engine</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ACADEMY COHORT MATRIX */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
            Academy Cohorts &amp; Active Rosters
          </h2>
          <button
            onClick={() => onNavigate('profiles')}
            className="text-xs font-bold text-[#ffb4ab] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Users</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Senior Players</span>
            <span className="font-headline font-black text-2xl text-white">12 Athletes</span>
            <span className="text-[10px] text-[#c3f400]">100% Active in Nets</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Junior Players (U15)</span>
            <span className="font-headline font-black text-2xl text-[#00d2ff]">18 Athletes</span>
            <span className="text-[10px] text-[#00d2ff]">All Guardians Verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Junior Premiere</span>
            <span className="font-headline font-black text-2xl text-amber-400">8 Athletes</span>
            <span className="text-[10px] text-amber-400">Rep Squad Pathway</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-[#8e918f]">Coaching Staff</span>
            <span className="font-headline font-black text-2xl text-[#ffb4ab]">7 Specialists</span>
            <span className="text-[10px] text-emerald-400">DBS Vetted &amp; Certified</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SAFEGUARDING & COMPLIANCE AUDIT STATUS */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
            Safeguarding &amp; Incident Audits
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
            Zero Incidents Flagged
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[#8e918f] font-mono text-[10px]">Junior Video Access</span>
              <span className="font-bold text-white text-sm">Quarantine Mode Active</span>
              <span className="text-[11px] text-[#8e918f]">Restricted strictly to guardian &amp; assigned coaches.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[#8e918f] font-mono text-[10px]">Data Residency</span>
              <span className="font-bold text-[#c3f400] text-sm">AU-Southeast-1 Pinned</span>
              <span className="text-[11px] text-[#8e918f]">Privacy Act 1988 &amp; APP 8 Compliant.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[#8e918f] font-mono text-[10px]">Staff DBS Expiry</span>
              <span className="font-bold text-emerald-400 text-sm">All Clean &gt; 180 Days</span>
              <span className="text-[11px] text-[#8e918f]">Automated renewal alerts configured.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FACILITY & BAY UTILIZATION */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
          Academy Bay Utilization Today
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">Net Bay 1 (Turf Wicket)</span>
                <span className="text-[10px] bg-[#c3f400]/20 text-[#c3f400] px-2 py-0.5 rounded font-bold">Occupied</span>
              </div>
              <p className="text-xs text-[#8e918f]">Senior Express Pace Cohort</p>
            </div>
            <span className="text-[11px] text-[#c4c9ac] font-mono">Radar Speed: 142.4 kph peak</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">Net Bay 2 (Astro Pitch)</span>
                <span className="text-[10px] bg-[#00d2ff]/20 text-[#00d2ff] px-2 py-0.5 rounded font-bold">Booked 4:30 PM</span>
              </div>
              <p className="text-xs text-[#8e918f]">Junior Pace Academy (U-15)</p>
            </div>
            <span className="text-[11px] text-[#c4c9ac] font-mono">Coach Brett Lee presiding</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">Indoor Motion Studio</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">120 FPS Active</span>
              </div>
              <p className="text-xs text-[#8e918f]">Biomechanics Calibration</p>
            </div>
            <span className="text-[11px] text-[#c4c9ac] font-mono">Camera Sync: 4 Angles</span>
          </div>
        </div>
      </section>
    </div>
  );
};
