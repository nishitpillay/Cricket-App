import React, { useState } from 'react';
import { SafeguardingReportCategory, UserRole, UserProfile } from '../../types';
import { submitSafeguardingReport, blockUser } from '../../utils/safeguardingManager';
import { playBeep } from '../../utils/audioFeedback';

interface SafeguardingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  currentUserId?: string;
  currentUserRole?: UserRole | 'guardian';
  targetUserId?: string;
  targetUserName?: string;
  targetUserRole?: UserRole;
  contextNote?: string;
  onReportSubmitted?: (caseRef: string) => void;
  onBlockUser?: (targetUserId: string) => void;
}

const REPORT_CATEGORIES: { id: SafeguardingReportCategory; label: string; icon: string; desc: string; highRisk?: boolean }[] = [
  {
    id: 'inappropriate_coaching_communication',
    label: 'Inappropriate Coaching Communication',
    icon: 'record_voice_over',
    desc: 'Unprofessional language, unauthorized 1-on-1 contact outside guardian supervision, or boundary violations.'
  },
  {
    id: 'grooming_concern',
    label: 'Grooming or Boundary Violation Concern',
    icon: 'shield_lock',
    desc: 'Requests for personal contact, private unmonitored messaging, gifts, or inappropriate attention.',
    highRisk: true
  },
  {
    id: 'bullying',
    label: 'Bullying or Intimidation',
    icon: 'sentiment_very_dissatisfied',
    desc: 'Persistent negative comments, humiliation, peer harassment, or exclusionary conduct.'
  },
  {
    id: 'harassment',
    label: 'Harassment or Offensive Conduct',
    icon: 'report',
    desc: 'Targeted hostility, abusive remarks, sexualized commentary, or threatening behavior.',
    highRisk: true
  },
  {
    id: 'suspicious_account_activity',
    label: 'Suspicious Account or Unauthorised Contact',
    icon: 'person_alert',
    desc: 'Unverified adults attempting contact, unlinked coach invitations, or profile impersonation.'
  },
  {
    id: 'inappropriate_behaviour',
    label: 'Other Inappropriate Behaviour',
    icon: 'warning',
    desc: 'Any other conduct breaching the Academy Code of Conduct or Child Protection Policy.'
  }
];

export const SafeguardingReportModal: React.FC<SafeguardingReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentUserId,
  currentUserRole,
  targetUserId = 'usr-coach-richardson',
  targetUserName = 'Coach Mark Richardson',
  targetUserRole = 'coach',
  contextNote,
  onReportSubmitted,
  onBlockUser
}) => {
  const reporterId = currentUser?.id || currentUserId || 'usr-liam-junior';
  const reporterRole: UserRole | 'guardian' = currentUser?.role || currentUserRole || 'player';
  const assignedTargetRole: UserRole = targetUserRole;

  const [selectedCategory, setSelectedCategory] = useState<SafeguardingReportCategory>('inappropriate_coaching_communication');
  const [description, setDescription] = useState<string>('');
  const [blockUserImmediately, setBlockUserImmediately] = useState(true);
  const [isEmergencyEscalated, setIsEmergencyEscalated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseRef, setSubmittedCaseRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !contextNote) return;

    setIsSubmitting(true);
    playBeep(440, 0.08);

    setTimeout(() => {
      const fullDescription = contextNote 
        ? `[Context: ${contextNote}]\n\n${description}`
        : description;

      const report = submitSafeguardingReport({
        reportedByUserId: reporterId,
        reportedByRole: reporterRole,
        targetUserId,
        targetUserName,
        targetUserRole: assignedTargetRole,
        category: selectedCategory,
        description: fullDescription,
        emergencyEscalated: isEmergencyEscalated
      });

      if (blockUserImmediately && targetUserId) {
        blockUser(reporterId, targetUserId);
        if (onBlockUser) {
          onBlockUser(targetUserId);
        }
      }

      setIsSubmitting(false);
      setSubmittedCaseRef(report.caseReferenceNumber);
      if (onReportSubmitted) {
        onReportSubmitted(report.caseReferenceNumber);
      }
    }, 600);
  };

  const handleDone = () => {
    setSubmittedCaseRef(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1a1a1a] border border-red-500/40 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-red-950/40 via-[#201f1f] to-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
                Safeguarding & Child Safety Report
              </h3>
              <p className="text-[11px] text-[#c4c9ac]">
                Confidential • Encrypted • Escalated to Designated Safeguarding Lead & Guardian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#c4c9ac] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {submittedCaseRef ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 text-red-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">shield_with_heart</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline font-bold text-lg text-white">Safeguarding Report Lodged</h4>
                <p className="text-xs text-[#c4c9ac]">Case Reference Number:</p>
                <div className="inline-block px-3 py-1.5 rounded-xl bg-black/60 border border-red-500/40 font-mono text-sm text-[#ff7171] font-bold">
                  {submittedCaseRef}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2.5 text-xs text-[#c4c9ac]">
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
                  <span>Protective Actions Implemented:</span>
                </div>
                <p className="flex items-start gap-2">
                  <span className="text-[#c3f400]">✓</span>
                  <span>Target account quarantined from junior contact and blocked from messaging/feed.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#c3f400]">✓</span>
                  <span>Automated confidential notification delivered to registered Parent/Guardian.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#c3f400]">✓</span>
                  <span>Encrypted incident file dispatched to the Club Designated Safeguarding Lead (DSL).</span>
                </p>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-all cursor-pointer shadow-lg"
              >
                Close Safeguarding Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Entity Warning Banner */}
              <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-red-400 text-[20px]">person_cancel</span>
                  <div>
                    <span className="text-[10px] text-[#c4c9ac] uppercase block font-bold">Report Target</span>
                    <span className="text-xs font-bold text-white">
                      {targetUserName} ({targetUserRole.toUpperCase()})
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  Direct Guardrail Protection
                </span>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                  Select Concern Category *
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {REPORT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        playBeep(600, 0.03);
                        setSelectedCategory(cat.id);
                        if (cat.highRisk) setIsEmergencyEscalated(true);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        selectedCategory === cat.id
                          ? 'bg-red-950/40 border-red-400 text-white'
                          : 'bg-black/30 border-white/10 text-[#c4c9ac] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${selectedCategory === cat.id ? 'text-red-400' : 'text-[#c4c9ac]'}`}>
                        {cat.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs block truncate">{cat.label}</span>
                          {cat.highRisk && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/30 text-red-300">
                              High Risk
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#c4c9ac] line-clamp-1 mt-0.5">{cat.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context, dates, words used, or specific boundary violations observed. This report is treated with strict confidentiality."
                  rows={3}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-[#c4c9ac]/50 focus:outline-none focus:border-red-400 transition-colors"
                />
              </div>

              {/* Guardrail Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-white/10 text-xs">
                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockUserImmediately}
                    onChange={(e) => setBlockUserImmediately(e.target.checked)}
                    className="accent-red-500 w-4 h-4 rounded"
                  />
                  <span className="text-white font-medium">
                    Immediately block & quarantine this user from contacting or viewing this junior profile
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergencyEscalated}
                    onChange={(e) => setIsEmergencyEscalated(e.target.checked)}
                    className="accent-red-500 w-4 h-4 rounded"
                  />
                  <span className="text-white font-medium">
                    Urgent priority escalation to Club Welfare & Child Protection Lead
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-headline font-bold text-xs hover:bg-white/15 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!description.trim() && !contextNote)}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-headline font-bold text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span className="animate-spin material-symbols-outlined text-[16px]">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">shield</span>
                      <span>Submit Safeguarding Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
