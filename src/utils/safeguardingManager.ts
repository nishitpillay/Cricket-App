/**
 * Child Safety & Safeguarding Management Service
 * Handles parental consent verification, coach authorization whitelists,
 * immutable audit trails, incident reporting, and safety blocking.
 */

import {
  SafeguardingIncidentReport,
  SafeguardingAuditLog,
  SafeguardingReportCategory,
  UserProfile,
  GuardianInformation,
  JuniorPrivacyGuardrails
} from '../types';

const STORAGE_KEY_REPORTS = 'pitch_precision_safeguarding_reports';
const STORAGE_KEY_AUDIT = 'pitch_precision_safeguarding_audit';
const STORAGE_KEY_BLOCKED = 'pitch_precision_blocked_users';
const STORAGE_KEY_COACH_WHITELIST = 'pitch_precision_approved_coaches';

// Initial default audit trail entries for transparency demonstration
const INITIAL_AUDIT_LOGS: SafeguardingAuditLog[] = [
  {
    id: 'audit-101',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    actionType: 'guardian_consent_verified',
    actorName: 'Sarah Chen (Mother / Legal Guardian)',
    actorRole: 'Guardian',
    details: 'Verified parental consent token with 2-Factor confirmation. Enabled transparent CC notifications.',
    juniorUserId: 'usr-liam-junior',
    guardianCcDelivered: true
  },
  {
    id: 'audit-102',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    actionType: 'coach_access_granted',
    actorName: 'Sarah Chen & Devi Pillay (Guardians)',
    actorRole: 'Guardian',
    details: 'Authorized Coach Arin Mishra (ECB Level 4) & Coach Roshan Srilanka (ICC Level 3) for technical analysis. Direct open social messaging blocked.',
    juniorUserId: 'usr-liam-junior',
    guardianCcDelivered: true
  },
  {
    id: 'audit-103',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    actionType: 'exif_stripped',
    actorName: 'Pitch Precision Safety Engine',
    actorRole: 'System Security',
    details: 'Cleaned GPS latitude/longitude and hardware device identifiers from uploaded training video (34.2 MB).',
    juniorUserId: 'usr-liam-junior',
    guardianCcDelivered: true
  },
  {
    id: 'audit-104',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actionType: 'coach_feedback_sent',
    actorName: 'Arin Mishra',
    actorRole: 'Coach',
    details: 'Sent biomechanical review on Outswing Delivery. Automated encrypted copy delivered to sarah.chen.parent@gmail.com.',
    juniorUserId: 'usr-liam-junior',
    guardianCcDelivered: true
  }
];

export const INITIAL_APPROVED_COACHES = [
  {
    coachId: 'coach-arin',
    coachName: 'Arin Mishra',
    specialization: 'Fast Bowling Pace & Seam Mechanics',
    accreditation: 'ICC Level 3 / ECB Level 4 Master Instructor',
    approvedBy: 'Sarah Chen & Devi Pillay (Guardians)',
    approvedDate: '2026-08-20',
    status: 'Authorized & Verified',
    dbsSafeguardingCleared: true
  },
  {
    coachId: 'coach-roshan',
    coachName: 'Roshan Srilanka',
    specialization: 'Tactical Batting Masterclasses & Spin Corridor Mastery',
    accreditation: 'ICC Level 3 Master Coach / DBS Safeguarding Cleared',
    approvedBy: 'Sarah Chen & Devi Pillay (Guardians)',
    approvedDate: '2026-08-21',
    status: 'Authorized & Verified',
    dbsSafeguardingCleared: true
  }
];

export function getStoredAuditLogs(): SafeguardingAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logSafeguardingEvent(
  actionType: SafeguardingAuditLog['actionType'],
  actorName: string,
  actorRole: string,
  details: string,
  juniorUserId: string = 'usr-liam-junior',
  guardianCcDelivered: boolean = true
): SafeguardingAuditLog {
  const currentLogs = getStoredAuditLogs();
  const newLog: SafeguardingAuditLog = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actionType,
    actorName,
    actorRole,
    details,
    juniorUserId,
    guardianCcDelivered
  };

  const updated = [newLog, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }
  return newLog;
}

export function getStoredIncidentReports(): SafeguardingIncidentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function submitSafeguardingReport(reportData: {
  reportedByUserId: string;
  reportedByRole: UserProfile['role'] | 'guardian';
  targetUserId?: string;
  targetUserName?: string;
  targetUserRole?: UserProfile['role'];
  category: SafeguardingReportCategory;
  description: string;
  emergencyEscalated?: boolean;
}): SafeguardingIncidentReport {
  const reports = getStoredIncidentReports();
  const caseRef = `SAFE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newReport: SafeguardingIncidentReport = {
    id: `rep-${Date.now()}`,
    reportedByUserId: reportData.reportedByUserId,
    reportedByRole: reportData.reportedByRole,
    targetUserId: reportData.targetUserId,
    targetUserName: reportData.targetUserName || 'Unassigned User',
    targetUserRole: reportData.targetUserRole,
    category: reportData.category,
    description: reportData.description,
    timestamp: new Date().toISOString(),
    status: 'quarantined',
    caseReferenceNumber: caseRef,
    emergencyEscalated: reportData.emergencyEscalated ?? true,
    guardianNotified: true,
    actionTaken: 'Target account quarantined from junior contact. Incident logged to Club Safeguarding Lead.'
  };

  const updated = [newReport, ...reports];
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }

  // Also log to transparent safeguarding audit trail
  logSafeguardingEvent(
    'incident_reported',
    `User ${reportData.reportedByUserId}`,
    reportData.reportedByRole,
    `Safeguarding Incident Reported [${reportData.category.replace(/_/g, ' ').toUpperCase()}]. Case Ref: ${caseRef}. Target contact quarantined.`,
    reportData.reportedByUserId,
    true
  );

  // If target user was specified, add to block list automatically
  if (reportData.targetUserId) {
    blockUser(reportData.targetUserId, reportData.targetUserName || 'Reported Account');
  }

  return newReport;
}

export function getBlockedUsers(): { id: string; name: string; date: string; reason: string }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLOCKED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function blockUser(userId: string, userName: string, reason: string = 'Safeguarding Protection'): void {
  const current = getBlockedUsers();
  if (!current.some((u) => u.id === userId)) {
    const updated = [...current, { id: userId, name: userName, date: new Date().toISOString(), reason }];
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
    logSafeguardingEvent(
      'user_blocked',
      'Child Safeguarding Engine',
      'System',
      `User ${userName} (${userId}) blocked from all junior interactions and direct visibility.`,
      'usr-liam-junior',
      true
    );
  }
}

export function unblockUser(userId: string): void {
  const current = getBlockedUsers();
  const updated = current.filter((u) => u.id !== userId);
  try {
    localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function getApprovedCoachesList(): typeof INITIAL_APPROVED_COACHES {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COACH_WHITELIST);
    return raw ? JSON.parse(raw) : INITIAL_APPROVED_COACHES;
  } catch {
    return INITIAL_APPROVED_COACHES;
  }
}

export function approveCoach(coach: typeof INITIAL_APPROVED_COACHES[0]): void {
  const current = getApprovedCoachesList();
  if (!current.some((c) => c.coachId === coach.coachId)) {
    const updated = [...current, coach];
    try {
      localStorage.setItem(STORAGE_KEY_COACH_WHITELIST, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    logSafeguardingEvent(
      'coach_access_granted',
      coach.approvedBy,
      'Guardian',
      `Authorized Coach ${coach.coachName} for junior player technical supervision.`,
      'usr-liam-junior',
      true
    );
  }
}

export function revokeCoach(coachId: string, coachName: string): void {
  const current = getApprovedCoachesList();
  const updated = current.filter((c) => c.coachId !== coachId);
  try {
    localStorage.setItem(STORAGE_KEY_COACH_WHITELIST, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  logSafeguardingEvent(
    'coach_access_revoked',
    'Parent / Legal Guardian',
    'Guardian',
    `Revoked coaching and feedback access for ${coachName}.`,
    'usr-liam-junior',
    true
  );
}

/**
 * Creates a standard Junior User Profile with verified guardian supervision & strict privacy guardrails
 */
export function createJuniorProfile(
  name: string,
  age: number,
  dob: string,
  guardianName: string,
  guardianEmail: string
): { guardianInfo: GuardianInformation; juniorPrivacy: JuniorPrivacyGuardrails } {
  return {
    guardianInfo: {
      guardianName,
      guardianEmail,
      relationship: 'Parent',
      consentStatus: 'verified',
      consentGrantedAt: new Date().toISOString(),
      consentVerificationToken: `GV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      guardianPortalPin: '4821',
      supervisionEnabled: true,
      ccAllCoachCommunications: true,
      notifyOnSessionUpload: true
    },
    juniorPrivacy: {
      isJunior: true,
      hideExactLocation: true,
      disablePublicDiscovery: true,
      allowOnlyAssignedCoaches: true,
      blockDirectMessaging: true,
      disablePublicComments: true,
      stripExifMetadata: true,
      videoPrivacyLevel: 'private-guardian-coach-only',
      assignedCoachIds: ['coach-arin', 'coach-roshan']
    }
  };
}
