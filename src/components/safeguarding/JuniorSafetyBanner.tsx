import React from 'react';

import { UserProfile } from '../../types';

interface JuniorSafetyBannerProps {
  user?: UserProfile;
  onOpenPortal?: () => void;
  onOpenGuardianPortal?: () => void;
  onOpenReportModal?: () => void;
  onReportConcern?: () => void;
  guardianEmail?: string;
  className?: string;
  variant?: 'compact' | 'full';
}

export const JuniorSafetyBanner: React.FC<JuniorSafetyBannerProps> = ({
  user,
  onOpenPortal,
  onOpenGuardianPortal,
  onOpenReportModal,
  onReportConcern,
  guardianEmail = 'sarah.chen.parent@gmail.com',
  className = '',
  variant = 'compact'
}) => {
  const handleOpenPortal = onOpenPortal || onOpenGuardianPortal;
  const handleReport = onReportConcern || onOpenReportModal;
  if (variant === 'compact') {
    return (
      <div className={`px-4 py-2 bg-gradient-to-r from-[#1c2e1c] via-[#141f14] to-[#121a12] border border-[#4ade80]/30 rounded-2xl flex items-center justify-between shadow-md ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#4ade80]/20 flex items-center justify-center text-[#4ade80]">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
          </div>
          <div>
            <span className="text-white text-xs font-bold font-headline flex items-center gap-1.5">
              Junior Safeguarding Guardrails Active
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#4ade80]/20 text-[#4ade80] font-bold border border-[#4ade80]/30">
                Supervised
              </span>
            </span>
            <span className="text-[10px] text-[#c4c9ac] block">
              GPS Suppressed • EXIF Scrubbed • Guardian CC: <span className="text-white font-mono">{guardianEmail}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {handleOpenPortal && (
            <button
              onClick={handleOpenPortal}
              className="px-2.5 py-1 rounded-lg bg-[#4ade80]/20 hover:bg-[#4ade80]/30 text-[#4ade80] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">family_restroom</span>
              <span className="hidden sm:inline">Guardian Hub</span>
            </button>
          )}

          {handleReport && (
            <button
              onClick={handleReport}
              className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Report Safeguarding Issue"
            >
              <span className="material-symbols-outlined text-[14px]">flag</span>
              <span className="hidden sm:inline">Report</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gradient-to-br from-[#1b261b] via-[#141b14] to-[#0f140f] border border-[#4ade80]/40 rounded-3xl shadow-xl space-y-3 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/40 flex items-center justify-center text-[#4ade80]">
            <span className="material-symbols-outlined text-[22px]">shield_lock</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
              Junior Player Child-Safety Protected
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] font-bold border border-[#4ade80]/30">
                Consent Verified
              </span>
            </h4>
            <p className="text-[11px] text-[#c4c9ac]">
              COPPA & Child Safeguarding Policy Active • Supervised by Guardian
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          {handleOpenPortal && (
            <button
              onClick={handleOpenPortal}
              className="px-3 py-1.5 rounded-xl bg-[#4ade80] text-[#0f240f] font-headline font-bold text-xs hover:bg-[#86efac] transition-all cursor-pointer flex items-center gap-1 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">family_restroom</span>
              <span>Guardian Portal</span>
            </button>
          )}
          {handleReport && (
            <button
              onClick={handleReport}
              className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all cursor-pointer"
              title="Report Concern"
            >
              <span className="material-symbols-outlined text-[18px]">flag</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[11px]">
        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-[9px] text-[#c4c9ac] block font-bold uppercase">LOCATION PRIVACY</span>
          <span className="font-bold text-[#4ade80] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">location_off</span>
            GPS Coordinates Scrubbed
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-[9px] text-[#c4c9ac] block font-bold uppercase">MEDIA METADATA</span>
          <span className="font-bold text-[#4ade80] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">cleaning_services</span>
            EXIF Tags Cleaned
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-[9px] text-[#c4c9ac] block font-bold uppercase">COMMUNICATIONS</span>
          <span className="font-bold text-[#9cf0ff] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">mark_email_read</span>
            Guardian 2-Way CC
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-[9px] text-[#c4c9ac] block font-bold uppercase">DISCOVERABILITY</span>
          <span className="font-bold text-[#ffdb3c] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">visibility_off</span>
            Search Hidden
          </span>
        </div>
      </div>
    </div>
  );
};
