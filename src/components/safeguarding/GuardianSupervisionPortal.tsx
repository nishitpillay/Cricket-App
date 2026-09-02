import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SafeguardingAuditLog,
  SafeguardingIncidentReport,
  CoachRelationshipType,
  CoachAuthorizationStatus,
  CoachAuthorization
} from '../../types';
import {
  getStoredAuditLogs,
  getStoredIncidentReports,
  getBlockedUsers,
  unblockUser,
  blockUser,
  getApprovedCoachesList,
  revokeCoach,
  approveCoach,
  logSafeguardingEvent,
  ExtendedCoachAuthorization
} from '../../utils/safeguardingManager';
import { SafeguardingReportModal } from './SafeguardingReportModal';
import { playBeep } from '../../utils/audioFeedback';

interface GuardianSupervisionPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const GuardianSupervisionPortal: React.FC<GuardianSupervisionPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'guardrails' | 'coaches' | 'audit' | 'incidents'>('guardrails');
  const [auditLogs, setAuditLogs] = useState<SafeguardingAuditLog[]>([]);
  const [incidentReports, setIncidentReports] = useState<SafeguardingIncidentReport[]>([]);
  const [blockedUsersList, setBlockedUsersList] = useState<{ id: string; name: string; date: string; reason: string }[]>([]);
  const [approvedCoaches, setApprovedCoaches] = useState<ExtendedCoachAuthorization[]>(getApprovedCoachesList());
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string>('');
  
  // New coach invite state
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachSpecialization, setNewCoachSpecialization] = useState('Fast Bowling Pace & Seam Mechanics');
  const [relationshipType, setRelationshipType] = useState<CoachRelationshipType>('Specialist Bowling Consultant');
  const [organizationName, setOrganizationName] = useState('London Cricket Youth Academy');
  const [expiryMonths, setExpiryMonths] = useState(12);

  const [permViewVideos, setPermViewVideos] = useState(true);
  const [permSubmitReviews, setPermSubmitReviews] = useState(true);
  const [permAssignDrills, setPermAssignDrills] = useState(true);
  const [permViewTelemetry, setPermViewTelemetry] = useState(false);

  const guardianInfo = currentUser.guardianInfo || {
    guardianName: 'Sarah Chen',
    guardianEmail: 'sarah.chen.parent@gmail.com',
    guardianPhone: '+44 7700 900821',
    relationship: 'Parent' as const,
    consentStatus: 'verified' as const,
    consentGrantedAt: '2026-08-15T10:00:00Z',
    consentVerificationToken: 'GV-UK-78912-VERIFIED',
    guardianPortalPin: '4821',
    supervisionEnabled: true,
    ccAllCoachCommunications: true,
    notifyOnSessionUpload: true
  };

  const juniorPrivacy = currentUser.juniorPrivacy || {
    isJunior: true,
    hideExactLocation: true,
    disablePublicDiscovery: true,
    allowOnlyAssignedCoaches: true,
    blockDirectMessaging: true,
    disablePublicComments: true,
    stripExifMetadata: true,
    videoPrivacyLevel: 'private-guardian-coach-only' as const,
    assignedCoachIds: ['coach-arin', 'coach-roshan']
  };

  const refreshData = () => {
    setAuditLogs(getStoredAuditLogs());
    setIncidentReports(getStoredIncidentReports());
    setBlockedUsersList(getBlockedUsers());
    setApprovedCoaches(getApprovedCoachesList());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleRevokeCoach = (coachId: string, coachName: string) => {
    playBeep(450, 0.06);
    revokeCoach(coachId, coachName);
    refreshData();
    showToast(`Revoked coaching authorization for ${coachName}.`);
  };

  const handleAddCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoachName.trim()) return;
    playBeep(750, 0.05);

    // Calculate expiry date based on selected months
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + expiryMonths);
    const expiryDateStr = expDate.toISOString().split('T')[0];

    const permissions: ('view_videos' | 'submit_reviews' | 'assign_drills' | 'view_telemetry')[] = [];
    if (permViewVideos) permissions.push('view_videos');
    if (permSubmitReviews) permissions.push('submit_reviews');
    if (permAssignDrills) permissions.push('assign_drills');
    if (permViewTelemetry) permissions.push('view_telemetry');

    const newCoach: ExtendedCoachAuthorization = {
      coachId: `coach-${Date.now()}`,
      coachName: newCoachName.trim(),
      playerId: currentUser.id || 'usr-liam-junior',
      organizationId: 'org-london-academy-01',
      organizationName: organizationName,
      relationshipType: relationshipType,
      authorizedDate: new Date().toISOString().split('T')[0],
      expiryDate: expiryDateStr,
      guardianApprovalRequired: true,
      guardianApproved: true,
      guardianApprovedBy: `${guardianInfo.guardianName} (Guardian)`,
      guardianApprovedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      accessPermissions: permissions,
      specialization: newCoachSpecialization,
      accreditation: 'DBS Cleared & Legal Safeguarding Authorized',
      approvedBy: `${guardianInfo.guardianName} (Guardian)`,
      approvedDate: new Date().toISOString().split('T')[0],
      dbsSafeguardingCleared: true
    };

    approveCoach(newCoach);
    setShowAddCoachModal(false);
    setNewCoachName('');
    refreshData();
    showToast(`Authorized ${newCoach.coachName} for junior player technical training.`);
  };


  const handleUnblockUser = (userId: string, userName: string) => {
    playBeep(600, 0.04);
    unblockUser(userId);
    refreshData();
    showToast(`Unblocked user ${userName}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#171717] border border-[#4ade80]/40 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#172b17] via-[#1b221b] to-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/40 flex items-center justify-center text-[#4ade80]">
              <span className="material-symbols-outlined text-[26px]">family_restroom</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-base sm:text-lg text-white">
                  Guardian Supervision & Safeguarding Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30 uppercase">
                  Active Protection
                </span>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Supervising: <span className="text-white font-bold">{currentUser.name}</span> • Guardian: <span className="text-white font-bold">{guardianInfo.guardianName}</span>
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

        {/* Success Toast */}
        {successToast && (
          <div className="bg-[#4ade80] text-[#0f240f] px-4 py-2 font-headline font-bold text-xs flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {successToast}
            </span>
            <button onClick={() => setSuccessToast('')} className="text-black font-bold">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              playBeep(600, 0.02);
              setActiveTab('guardrails');
            }}
            className={`px-3.5 py-2.5 rounded-t-xl font-headline font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'guardrails'
                ? 'bg-[#171717] text-[#4ade80] border-t-2 border-x border-[#4ade80]/40 -mb-[1px]'
                : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Safety Guardrails</span>
          </button>

          <button
            onClick={() => {
              playBeep(600, 0.02);
              setActiveTab('coaches');
            }}
            className={`px-3.5 py-2.5 rounded-t-xl font-headline font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'coaches'
                ? 'bg-[#171717] text-[#4ade80] border-t-2 border-x border-[#4ade80]/40 -mb-[1px]'
                : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sports</span>
            <span>Approved Coaches ({approvedCoaches.length})</span>
          </button>

          <button
            onClick={() => {
              playBeep(600, 0.02);
              setActiveTab('audit');
            }}
            className={`px-3.5 py-2.5 rounded-t-xl font-headline font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#171717] text-[#4ade80] border-t-2 border-x border-[#4ade80]/40 -mb-[1px]'
                : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history_edu</span>
            <span>Safeguarding Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => {
              playBeep(600, 0.02);
              setActiveTab('incidents');
            }}
            className={`px-3.5 py-2.5 rounded-t-xl font-headline font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'incidents'
                ? 'bg-[#171717] text-red-400 border-t-2 border-x border-red-500/40 -mb-[1px]'
                : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shield_lock</span>
            <span>Reports & Blocks ({incidentReports.length + blockedUsersList.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SAFETY GUARDRAILS */}
          {activeTab === 'guardrails' && (
            <div className="space-y-4 animate-fade-in">
              {/* Guardian Verification Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b261b] to-[#171f17] border border-[#4ade80]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4ade80] text-[22px]">assignment_turned_in</span>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-white">Parental Consent & Verification Token</h4>
                      <p className="text-[11px] text-[#c4c9ac]">
                        Legally verified under UK & Global Child Protection Standards
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#4ade80]/20 border border-[#4ade80]/40 text-[#4ade80] font-mono font-bold text-xs">
                    {guardianInfo.consentVerificationToken}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-white/10">
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-[9px] text-[#c4c9ac] uppercase block">Guardian Name</span>
                    <span className="text-white font-bold">{guardianInfo.guardianName} ({guardianInfo.relationship})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-[9px] text-[#c4c9ac] uppercase block">Supervision Email</span>
                    <span className="text-white font-bold truncate">{guardianInfo.guardianEmail}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40">
                    <span className="text-[9px] text-[#c4c9ac] uppercase block">Consent Granted</span>
                    <span className="text-white font-bold">{new Date(guardianInfo.consentGrantedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Guardrails Matrix */}
              <div className="space-y-2">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#c4c9ac]">
                  Active Child Protection Guardrails (Locked by System Policy)
                </h4>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  {/* Item 1 */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4ade80] text-[20px]">mark_email_read</span>
                      <div>
                        <span className="font-bold text-white block">Automatic 2-Way Guardian CC</span>
                        <span className="text-[11px] text-[#c4c9ac]">
                          Every coach feedback note, drill assignment, and video telestration is CC'd to <span className="text-[#4ade80]">{guardianInfo.guardianEmail}</span>.
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Enforced
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4ade80] text-[20px]">location_off</span>
                      <div>
                        <span className="font-bold text-white block">Strict GPS & Address Suppressed</span>
                        <span className="text-[11px] text-[#c4c9ac]">
                          Residential address, school details, and exact latitude/longitude are never exposed or stored.
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Enforced
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4ade80] text-[20px]">cleaning_services</span>
                      <div>
                        <span className="font-bold text-white block">Automated EXIF Media Stripping</span>
                        <span className="text-[11px] text-[#c4c9ac]">
                          Uploaded bowling/batting videos automatically have device serials, camera tags, and GPS coordinates purged.
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Active
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4ade80] text-[20px]">visibility_off</span>
                      <div>
                        <span className="font-bold text-white block">Public Discovery & Stranger Following Disabled</span>
                        <span className="text-[11px] text-[#c4c9ac]">
                          Junior profile cannot be searched by anonymous adults or followed by non-guardian approved members.
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Enforced
                    </span>
                  </div>

                  {/* Item 5 */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4ade80] text-[20px]">speaker_notes_off</span>
                      <div>
                        <span className="font-bold text-white block">No Open Direct Messaging & No Public Video Comments</span>
                        <span className="text-[11px] text-[#c4c9ac]">
                          Social-style unmonitored direct messages are blocked. Public comments on junior videos are disabled.
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                      Enforced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPROVED COACHES */}
          {activeTab === 'coaches' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-sm text-white">Authorized Coaching Staff</h4>
                  <p className="text-[11px] text-[#c4c9ac]">
                    Only approved, DBS-cleared coaches can send feedback or view uploaded practice footage.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCoachModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4ade80] text-[#0f240f] font-headline font-bold text-xs hover:bg-[#86efac] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Authorize Coach</span>
                </button>
              </div>

              {approvedCoaches.length === 0 ? (
                <div className="p-8 text-center bg-black/30 border border-white/10 rounded-2xl text-xs text-[#c4c9ac]">
                  No coaches currently authorized. Tap "Authorize Coach" above to grant technical review access.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {approvedCoaches.map((coach) => {
                    const isActive = coach.status === 'Active';
                    const isExpired = coach.status === 'Expired';
                    const isRevoked = coach.status === 'Revoked';

                    return (
                      <div
                        key={coach.coachId}
                        className={`p-5 rounded-2xl border transition-all ${
                          isActive 
                            ? 'bg-black/50 border-[#4ade80]/20 hover:border-[#4ade80]/40' 
                            : 'bg-black/25 border-white/5 opacity-65'
                        }`}
                      >
                        {/* Title & Actions Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-headline text-sm ${
                              isActive 
                                ? 'bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400]' 
                                : 'bg-white/5 border border-white/10 text-white/40'
                            }`}>
                              {coach.coachName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-white">{coach.coachName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border ${
                                  isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : isExpired
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                  {coach.status}
                                </span>
                              </div>
                              <span className="text-xs text-[#c4c9ac] block mt-0.5">
                                {coach.relationshipType} • {coach.specialization}
                              </span>
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsReportModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-red-500/20"
                            >
                              <span className="material-symbols-outlined text-[14px]">flag</span>
                              <span>Report</span>
                            </button>
                            {isActive && (
                              <button
                                onClick={() => handleRevokeCoach(coach.coachId, coach.coachName)}
                                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-red-500/30"
                              >
                                <span className="material-symbols-outlined text-[14px]">person_remove</span>
                                <span>Terminate relationship</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Guardrails Detailed Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-b border-white/5 text-[10px] font-mono text-[#a6ab9d]">
                          <div className="space-y-0.5">
                            <span className="text-[#8e918f] font-bold uppercase block text-[8px]">Coach / Player IDs</span>
                            <span className="text-white block font-semibold truncate">C: {coach.coachId}</span>
                            <span className="text-white/60 block truncate">P: {coach.playerId || 'usr-liam-junior'}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[#8e918f] font-bold uppercase block text-[8px]">Organisation</span>
                            <span className="text-white block font-semibold truncate" title={coach.organizationName}>
                              {coach.organizationName}
                            </span>
                            <span className="text-white/60 block text-[9px] truncate">ID: {coach.organizationId}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[#8e918f] font-bold uppercase block text-[8px]">Validity Period</span>
                            <span className="text-white block font-semibold">Auth: {coach.authorizedDate}</span>
                            <span className={`block font-semibold ${isExpired ? 'text-amber-400' : 'text-white/60'}`}>
                              Exp: {coach.expiryDate}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[#8e918f] font-bold uppercase block text-[8px]">Guardian Consent</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">verified</span> Approved
                            </span>
                            <span className="text-white/60 block text-[9px] truncate">By: {coach.approvedBy}</span>
                          </div>
                        </div>

                        {/* Allowed Access Permissions Checklist */}
                        <div className="pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="space-y-1">
                            <span className="text-[#8e918f] font-bold uppercase text-[8px] tracking-wider block">
                              Active Access Permissions
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { key: 'view_videos', label: 'View Videos', icon: 'videocam' },
                                { key: 'submit_reviews', label: 'Submit Reviews', icon: 'rate_review' },
                                { key: 'assign_drills', label: 'Assign Drills', icon: 'task' },
                                { key: 'view_telemetry', label: 'View Telemetry', icon: 'query_stats' }
                              ].map((perm) => {
                                const hasPerm = coach.accessPermissions.includes(perm.key as any) && isActive;
                                return (
                                  <span
                                    key={perm.key}
                                    className={`px-2 py-1 rounded-lg text-[9px] font-medium flex items-center gap-1 border ${
                                      hasPerm
                                        ? 'bg-[#c3f400]/10 text-[#c3f400] border-[#c3f400]/20'
                                        : 'bg-black/40 text-white/20 border-white/5 line-through'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[11px]">{perm.icon}</span>
                                    {perm.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {!isActive && (
                            <div className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[9px] font-mono border border-red-500/20 flex items-center gap-1 shrink-0">
                              <span className="material-symbols-outlined text-[12px]">gpp_maybe</span>
                              Access Expired / Token Invalid
                            </div>
                          )}
                        </div>

                        {/* Legal Retention Compliance Flag */}
                        {!isActive && (
                          <div className="mt-2.5 text-[9px] text-white/40 italic font-mono flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">info</span>
                            Safeguarding Retention Rule Active: Retained until {new Date(new Date(coach.expiryDate || coach.authorizedDate).getTime() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} for regulatory child safety records.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAFEGUARDING AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-sm text-white">Immutable Safeguarding Log</h4>
                  <p className="text-[11px] text-[#c4c9ac]">
                    Verifiable cryptographic-style audit trail of all coaching notes, video reviews, and privacy actions.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-[#4ade80]">
                  {auditLogs.length} Events Logged
                </span>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#4ade80]/20 text-[#4ade80] uppercase">
                          {log.actionType.replace(/_/g, ' ')}
                        </span>
                        <span className="font-bold text-white">{log.actorName} ({log.actorRole})</span>
                      </div>
                      <span className="text-[10px] text-[#c4c9ac] font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#c4c9ac] pl-1">{log.details}</p>

                    {log.guardianCcDelivered && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#4ade80] font-bold pt-1 border-t border-white/5">
                        <span className="material-symbols-outlined text-[13px]">mark_email_read</span>
                        <span>Encrypted Guardian CC Delivered to {guardianInfo.guardianEmail}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INCIDENTS & MODERATION */}
          {activeTab === 'incidents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-sm text-white">Safeguarding Incidents & Blocked Users</h4>
                  <p className="text-[11px] text-[#c4c9ac]">
                    Report boundary violations or manage quarantined and blocked contacts.
                  </p>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-headline font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Report Concern</span>
                </button>
              </div>

              {/* Reports List */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#c4c9ac]">Logged Incident Cases</h5>
                {incidentReports.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-[#c4c9ac]">
                    No open safeguarding incidents. All interactions operating under standard child safety policies.
                  </div>
                ) : (
                  incidentReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-red-400 font-bold">{report.caseReferenceNumber}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-300 uppercase">
                            {report.category.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-500/20 text-yellow-300">
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[#c4c9ac] text-[11px]">{report.description}</p>
                      <div className="text-[10px] text-red-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">shield</span>
                        <span>{report.actionTaken}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Blocked Users List */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#c4c9ac]">Blocked & Quarantined Contacts</h5>
                {blockedUsersList.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-[#c4c9ac]">
                    No blocked accounts currently.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {blockedUsersList.map((blocked) => (
                      <div
                        key={blocked.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-white text-xs block">{blocked.name}</span>
                          <span className="text-[10px] text-[#c4c9ac]">
                            Blocked on {new Date(blocked.date).toLocaleDateString()} • Reason: {blocked.reason}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnblockUser(blocked.id, blocked.name)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#c4c9ac]">
            <span className="material-symbols-outlined text-[#4ade80] text-[16px]">verified</span>
            <span>Pitch Precision Child Protection Standard v2.4</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#4ade80] text-[#0f240f] font-headline font-bold text-xs hover:bg-[#86efac] active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            Done
          </button>
        </div>

        {/* Authorize Coach Dialog */}
        {showAddCoachModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1f1f1f] border border-[#4ade80]/40 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-base text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4ade80]">person_add</span>
                  Authorize Certified Coach
                </h4>
                <button
                  onClick={() => setShowAddCoachModal(false)}
                  className="text-[#c4c9ac] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddCoach} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1 uppercase">Coach Full Name</label>
                  <input
                    type="text"
                    value={newCoachName}
                    onChange={(e) => setNewCoachName(e.target.value)}
                    placeholder="e.g. Coach David Warner"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#c4c9ac]/50 focus:outline-none focus:border-[#4ade80]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1 uppercase">Coaching Discipline</label>
                  <select
                    value={newCoachSpecialization}
                    onChange={(e) => setNewCoachSpecialization(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4ade80]"
                  >
                    <option value="Batting Masterclass & Biomechanics">Batting Masterclass & Biomechanics</option>
                    <option value="Fast Bowling Pace & Seam Mechanics">Fast Bowling Pace & Seam Mechanics</option>
                    <option value="Spin Bowling Artistry & Deception">Spin Bowling Artistry & Deception</option>
                    <option value="Fielding & Athleticism">Fielding & Athleticism</option>
                    <option value="Tactical Match Strategy & Analytics">Tactical Match Strategy & Analytics</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1 uppercase">Relationship Type</label>
                    <select
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(e.target.value as CoachRelationshipType)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4ade80]"
                    >
                      <option value="Head Coach">Head Coach</option>
                      <option value="Assistant Coach">Assistant Coach</option>
                      <option value="Specialist Bowling Consultant">Specialist Bowling Consultant</option>
                      <option value="Batting Specialist">Batting Specialist</option>
                      <option value="Personal Trainer">Personal Trainer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1 uppercase">Validity Duration</label>
                    <select
                      value={expiryMonths}
                      onChange={(e) => setExpiryMonths(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4ade80]"
                    >
                      <option value={1}>1 Month (Guest)</option>
                      <option value={3}>3 Months (Seasonal)</option>
                      <option value={6}>6 Months (Term)</option>
                      <option value={12}>12 Months (Full Cycle)</option>
                      <option value={24}>24 Months (Extended)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1 uppercase">Associated Organisation</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. London Cricket Youth Academy"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#c4c9ac]/50 focus:outline-none focus:border-[#4ade80]"
                  />
                </div>

                {/* Permissions Selector Checkboxes */}
                <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/5">
                  <label className="block text-xs font-bold text-[#c3f400] uppercase tracking-wider">
                    Authorised Access Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs text-[#c4c9ac] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permViewVideos}
                        onChange={(e) => setPermViewVideos(e.target.checked)}
                        className="rounded bg-black/50 border-white/10 text-[#4ade80] focus:ring-0"
                      />
                      <span>View Videos</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#c4c9ac] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permSubmitReviews}
                        onChange={(e) => setPermSubmitReviews(e.target.checked)}
                        className="rounded bg-black/50 border-white/10 text-[#4ade80] focus:ring-0"
                      />
                      <span>Submit Reviews</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#c4c9ac] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permAssignDrills}
                        onChange={(e) => setPermAssignDrills(e.target.checked)}
                        className="rounded bg-black/50 border-white/10 text-[#4ade80] focus:ring-0"
                      />
                      <span>Assign Drills</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#c4c9ac] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permViewTelemetry}
                        onChange={(e) => setPermViewTelemetry(e.target.checked)}
                        className="rounded bg-black/50 border-white/10 text-[#4ade80] focus:ring-0"
                      />
                      <span>View Telemetry</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#c4c9ac] space-y-1">
                  <div className="text-white font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#4ade80] text-[14px]">verified</span>
                    <span>Safety Verification Requirement</span>
                  </div>
                  <p>Coach must hold valid DBS/Safeguarding credential and will be bound by transparent 2-Way Guardian CC logging.</p>
                </div>


                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCoachModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#4ade80] text-[#0f240f] font-bold text-xs hover:bg-[#86efac] cursor-pointer"
                  >
                    Grant Authorization
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Safeguarding Report Modal */}
        <SafeguardingReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            refreshData();
          }}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
          targetUserName="Coach Mark Richardson"
          onReportSubmitted={() => {
            refreshData();
            showToast('Safeguarding report submitted & contact quarantined.');
          }}
        />
      </div>
    </div>
  );
};
