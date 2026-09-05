import React, { useState } from 'react';
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
  const isPlatformAdmin =
    user.role === 'platform_admin' ||
    user.role === 'security_admin' ||
    user.name?.includes('Elena') ||
    user.adminSubCategory === 'Platform Admin';

  const [adminTab, setAdminTab] = useState<'academy' | 'platform'>(
    isPlatformAdmin ? 'platform' : 'academy'
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Admin Header Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#22171c] via-[#1a1215] to-[#141214] border border-[#ffb4ab]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              {adminTab === 'academy' ? 'admin_panel_settings' : 'cloud_sync'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#ffb4ab] uppercase tracking-wider">
                {adminTab === 'academy' ? 'Academy Admin & Governance' : 'Platform & Security Telemetry'}
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-white">
                {adminTab === 'academy' ? 'Club Level' : 'Root Infrastructure'}
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-white">
              {adminTab === 'academy'
                ? 'Academy Operations & Safeguarding Hub'
                : 'Cloud Infrastructure & Security Engine'}
            </h2>
          </div>
        </div>

        {/* Tab switch between Academy Admin and Platform Admin */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(700, 0.04);
              setAdminTab('academy');
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'academy'
                ? 'bg-[#ffb4ab] text-[#410002] shadow-sm'
                : 'text-[#8e918f] hover:text-white'
            }`}
          >
            Academy Ops
          </button>
          <button
            onClick={() => {
              playBeep(700, 0.04);
              setAdminTab('platform');
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'platform'
                ? 'bg-[#ffb4ab] text-[#410002] shadow-sm'
                : 'text-[#8e918f] hover:text-white'
            }`}
          >
            Platform Infra
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ACADEMY OPS VIEW (ACADEMY ADMIN) */}
      {/* ========================================================================= */}
      {adminTab === 'academy' && (
        <div className="flex flex-col gap-6">
          {/* Cohorts */}
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

          {/* Safeguarding */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
                Safeguarding &amp; Incident Governance
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

          {/* Facility Utilization */}
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
      )}

      {/* ========================================================================= */}
      {/* 2. PLATFORM INFRA & SECURITY VIEW (PLATFORM ADMIN) */}
      {/* ========================================================================= */}
      {adminTab === 'platform' && (
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                playBeep(700, 0.05);
                onNavigate('cloud-infrastructure');
              }}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-[#ffb4ab]/40 flex flex-col gap-2 text-left cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[#ffb4ab] text-[24px]">cloud_sync</span>
              <div>
                <h4 className="font-bold text-sm text-white">Cloud Infra</h4>
                <span className="text-[11px] text-[#8e918f]">Storage &amp; Video Buckets</span>
              </div>
            </button>

            <button
              onClick={() => {
                playBeep(700, 0.05);
                onNavigate('security-settings');
              }}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-[#ffb4ab]/40 flex flex-col gap-2 text-left cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-emerald-400 text-[24px]">shield</span>
              <div>
                <h4 className="font-bold text-sm text-white">Security Engine</h4>
                <span className="text-[11px] text-[#8e918f]">2FA &amp; Keystore</span>
              </div>
            </button>

            <button
              onClick={() => {
                playBeep(700, 0.05);
                onNavigate('encryption-governance');
              }}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-[#ffb4ab]/40 flex flex-col gap-2 text-left cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[#00d2ff] text-[24px]">vpn_key</span>
              <div>
                <h4 className="font-bold text-sm text-white">KMS Keystore</h4>
                <span className="text-[11px] text-[#8e918f]">AES-256-GCM Rotations</span>
              </div>
            </button>

            <button
              onClick={() => {
                playBeep(700, 0.05);
                onNavigate('source-code-security');
              }}
              className="p-4 rounded-2xl bg-[#191919] border border-white/10 hover:border-[#ffb4ab]/40 flex flex-col gap-2 text-left cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-amber-400 text-[24px]">terminal</span>
              <div>
                <h4 className="font-bold text-sm text-white">DevSecOps</h4>
                <span className="text-[11px] text-[#8e918f]">MASVS Audit Pass</span>
              </div>
            </button>
          </div>

          {/* Infrastructure Health Status */}
          <section className="flex flex-col gap-3">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-white tracking-tight">
              Root Infrastructure &amp; Security Telemetry
            </h2>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 shadow-lg flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                  <span className="text-[#8e918f] font-mono text-[10px]">Cloud Run Ingress</span>
                  <span className="font-bold text-emerald-400 text-sm">Healthy (99.99%)</span>
                  <span className="text-[11px] text-[#8e918f]">Port 3000 mapped, zero crash loops.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                  <span className="text-[#8e918f] font-mono text-[10px]">KMS Envelope Key</span>
                  <span className="font-bold text-[#c3f400] text-sm">KeyVersion: v4 Active</span>
                  <span className="text-[11px] text-[#8e918f]">Auto-rotates every 90 days.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                  <span className="text-[#8e918f] font-mono text-[10px]">MASVS L1/L2 Score</span>
                  <span className="font-bold text-[#00d2ff] text-sm">100% Pass (0 Findings)</span>
                  <span className="text-[11px] text-[#8e918f]">OWASP Mobile Verification compliant.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
