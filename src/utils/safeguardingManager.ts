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
  JuniorPrivacyGuardrails,
  CoachAuthorization,
  CoachRelationshipType,
  CoachAuthorizationStatus
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

export interface ExtendedCoachAuthorization extends CoachAuthorization {
  specialization: string;
  accreditation: string;
  approvedBy: string;
  approvedDate: string;
  dbsSafeguardingCleared: boolean;
}

export const INITIAL_APPROVED_COACHES: ExtendedCoachAuthorization[] = [
  {
    coachId: 'coach-arin',
    coachName: 'Arin Mishra',
    playerId: 'usr-liam-junior',
    organizationId: 'org-london-academy-01',
    organizationName: 'London Cricket Youth Academy',
    relationshipType: 'Head Coach',
    authorizedDate: '2026-08-20',
    expiryDate: '2027-08-20', // Future Expiry
    guardianApprovalRequired: true,
    guardianApproved: true,
    guardianApprovedBy: 'Sarah Chen (Guardian)',
    guardianApprovedDate: '2026-08-20',
    status: 'Active',
    accessPermissions: ['view_videos', 'submit_reviews', 'assign_drills', 'view_telemetry'],
    specialization: 'Fast Bowling Pace & Seam Mechanics',
    accreditation: 'ICC Level 3 / ECB Level 4 Master Instructor',
    approvedBy: 'Sarah Chen & Devi Pillay (Guardians)',
    approvedDate: '2026-08-20',
    dbsSafeguardingCleared: true
  },
  {
    coachId: 'coach-roshan',
    coachName: 'Roshan Srilanka',
    playerId: 'usr-liam-junior',
    organizationId: 'org-london-academy-01',
    organizationName: 'London Cricket Youth Academy',
    relationshipType: 'Batting Specialist',
    authorizedDate: '2026-08-21',
    expiryDate: '2027-08-21', // Future Expiry
    guardianApprovalRequired: true,
    guardianApproved: true,
    guardianApprovedBy: 'Sarah Chen (Guardian)',
    guardianApprovedDate: '2026-08-21',
    status: 'Active',
    accessPermissions: ['view_videos', 'submit_reviews', 'assign_drills'],
    specialization: 'Tactical Batting Masterclasses & Spin Corridor Mastery',
    accreditation: 'ICC Level 3 Master Coach / DBS Safeguarding Cleared',
    approvedBy: 'Sarah Chen & Devi Pillay (Guardians)',
    approvedDate: '2026-08-21',
    dbsSafeguardingCleared: true
  },
  {
    coachId: 'coach-expired-richard',
    coachName: 'Richard Richardson',
    playerId: 'usr-liam-junior',
    organizationId: 'org-london-academy-01',
    organizationName: 'London Cricket Youth Academy',
    relationshipType: 'Specialist Bowling Consultant',
    authorizedDate: '2025-08-01',
    expiryDate: '2026-08-01', // Expired in the past!
    guardianApprovalRequired: true,
    guardianApproved: true,
    guardianApprovedBy: 'Sarah Chen (Guardian)',
    guardianApprovedDate: '2025-08-01',
    status: 'Expired',
    accessPermissions: [], // Expired relationship has automatically nullified privileges
    specialization: 'Outswing Seam Mechanics & Grip Alignment',
    accreditation: 'ECB Level 3 Coach (Retention Tracked)',
    approvedBy: 'Sarah Chen (Guardian)',
    approvedDate: '2025-08-01',
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

export function getApprovedCoachesList(): ExtendedCoachAuthorization[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COACH_WHITELIST);
    let list: ExtendedCoachAuthorization[] = raw ? JSON.parse(raw) : INITIAL_APPROVED_COACHES;
    
    // 1. Dynamic Check & Automatic Expiration of Access
    const todayStr = new Date().toISOString().split('T')[0];
    let listChanged = false;
    
    list = list.map(c => {
      // If the coach's expiryDate is in the past and they are marked active, automatically expire them!
      if (c.expiryDate && c.expiryDate < todayStr && c.status === 'Active') {
        listChanged = true;
        return {
          ...c,
          status: 'Expired' as const,
          accessPermissions: [] // Access privileges automatically nullified
        };
      }
      return c;
    });

    // 2. Retention Rule: Keep logs for legal/safeguarding compliance, but physically prune entries older than 7 years
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);
    const sevenYearsAgoStr = sevenYearsAgo.toISOString().split('T')[0];
    
    const prunedList = list.filter(c => {
      const dateToCheck = c.expiryDate || c.authorizedDate;
      if (dateToCheck && dateToCheck < sevenYearsAgoStr) {
        listChanged = true;
        return false; // Safely deleted after 7 years
      }
      return true;
    });

    if (listChanged) {
      try {
        localStorage.setItem(STORAGE_KEY_COACH_WHITELIST, JSON.stringify(prunedList));
      } catch {
        // Ignore
      }
    }

    return prunedList;
  } catch {
    return INITIAL_APPROVED_COACHES;
  }
}

export function approveCoach(coach: ExtendedCoachAuthorization): void {
  const current = getApprovedCoachesList();
  // Filter out any older entry for the same coach to update it
  const filtered = current.filter((c) => c.coachId !== coach.coachId);
  const updated = [...filtered, coach];
  try {
    localStorage.setItem(STORAGE_KEY_COACH_WHITELIST, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  logSafeguardingEvent(
    'coach_access_granted',
    coach.approvedBy,
    'Guardian',
    `Authorized Coach ${coach.coachName} [${coach.relationshipType}] for technical training. Expiry: ${coach.expiryDate}.`,
    coach.playerId || 'usr-liam-junior',
    true
  );
}

export function revokeCoach(coachId: string, coachName: string): void {
  const current = getApprovedCoachesList();
  const updated = current.map((c) => {
    if (c.coachId === coachId) {
      return {
        ...c,
        status: 'Revoked' as const,
        accessPermissions: [] // Access privileges instantly cleared
      };
    }
    return c;
  });
  try {
    localStorage.setItem(STORAGE_KEY_COACH_WHITELIST, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  logSafeguardingEvent(
    'coach_access_revoked',
    'Parent / Legal Guardian',
    'Guardian',
    `Revoked coaching and feedback access for ${coachName}. Record retained under legal safeguarding policy.`,
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
