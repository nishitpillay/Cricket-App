import { Request, Response, NextFunction } from 'express';

export type UserRole = 'player_adult' | 'player_junior' | 'guardian' | 'coach' | 'club_admin' | 'system_admin';

export type ConsentStatus = 'NOT_REQUIRED' | 'PENDING_GUARDIAN' | 'ACTIVE_CONSENT_VERIFIED' | 'REVOKED' | 'EXPIRED';

export interface AuthContextUser {
  id: string;
  email: string;
  role: UserRole;
  age?: number;
  guardianId?: string;
  consentStatus: ConsentStatus;
  consentExpiresAt?: string;
  authorizedCoachIds: string[];
  clubId?: string;
  tokenFamilyId: string;
  issuedAt: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthContextUser;
}

// In-Memory Simulation Store for Relationships & Grants (In Production: Postgres with RLS)
export interface CoachPlayerGrant {
  id: string;
  coachId: string;
  playerId: string;
  guardianId?: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  canViewBiometrics: boolean;
  canViewVideos: boolean;
  canAssignDrills: boolean;
  grantedAt: string;
  expiresAt: string;
  approvedByGuardian: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  targetUserId?: string;
  action: string;
  resource: string;
  result: 'ALLOW' | 'DENY' | 'ERROR';
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
}

// Mock Database Tables for Gate 1 Verification
export const mockCoachGrants: CoachPlayerGrant[] = [
  {
    id: 'grant_001',
    coachId: 'usr_coach_shane',
    playerId: 'usr_junior_sam',
    guardianId: 'usr_parent_eleanor',
    status: 'ACTIVE',
    canViewBiometrics: true,
    canViewVideos: true,
    canAssignDrills: true,
    grantedAt: '2026-08-01T00:00:00Z',
    expiresAt: '2027-08-01T00:00:00Z',
    approvedByGuardian: true
  },
  {
    id: 'grant_002',
    coachId: 'usr_coach_shane',
    playerId: 'usr_junior_leo',
    guardianId: 'usr_parent_david',
    status: 'PENDING_APPROVAL',
    canViewBiometrics: false,
    canViewVideos: false,
    canAssignDrills: false,
    grantedAt: '2026-09-01T10:00:00Z',
    expiresAt: '2027-09-01T10:00:00Z',
    approvedByGuardian: false
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit_init_001',
    timestamp: new Date().toISOString(),
    actorId: 'usr_system',
    actorRole: 'system_admin',
    action: 'SECURITY_GATE_1_INITIALIZED',
    resource: 'AUTH_SUBSYSTEM',
    result: 'ALLOW',
    ipAddress: '127.0.0.1',
    userAgent: 'PitchPrecision-Server/1.0',
    details: { version: '2026.09.GATE_1', rulesEngine: 'ReBAC_Enforced' }
  }
];

export function logSecurityEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newEntry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  mockAuditLogs.unshift(newEntry);
  if (mockAuditLogs.length > 500) {
    mockAuditLogs.pop();
  }
  return newEntry;
}

/**
 * Middleware: Verify Guardian Consent for Junior Players (<16)
 * In accordance with COPPA, GDPR-K, and Apple Guideline 5.1.4
 */
export function requireGuardianConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Adults and non-junior accounts pass immediately
  if (user.role !== 'player_junior') {
    return next();
  }

  if (user.consentStatus !== 'ACTIVE_CONSENT_VERIFIED') {
    logSecurityEvent({
      actorId: user.id,
      actorRole: user.role,
      targetUserId: user.id,
      action: 'JUNIOR_RESTRICTED_ACTION_ATTEMPT',
      resource: req.originalUrl,
      result: 'DENY',
      ipAddress: req.ip || '0.0.0.0',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: { consentStatus: user.consentStatus, reason: 'Lacks verified parent/guardian consent' }
    });

    return res.status(403).json({
      error: 'Guardian Consent Required',
      code: 'COPPA_CONSENT_MISSING',
      message: 'This action is restricted for junior athletes until verified parental consent is confirmed.',
      guardianId: user.guardianId,
      consentStatus: user.consentStatus
    });
  }

  next();
}

/**
 * Middleware: Coach-to-Player Authorization Guard (ReBAC)
 * Verifies that a coach is explicitly authorized by the player or guardian.
 */
export function authorizeCoachToPlayer(permissionType: 'view_biometrics' | 'view_videos' | 'assign_drills') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const targetPlayerId = req.params.playerId || req.body.playerId || req.query.playerId;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 1. Players can access their own data
    if (user.id === targetPlayerId) {
      return next();
    }

    // 2. Guardians can access their linked wards
    if (user.role === 'guardian') {
      // In production check database ward link
      return next();
    }

    // 3. System Admins (Audit/Support with break-glass)
    if (user.role === 'system_admin') {
      logSecurityEvent({
        actorId: user.id,
        actorRole: user.role,
        targetUserId: targetPlayerId,
        action: 'ADMIN_ELEVATED_DATA_ACCESS',
        resource: req.originalUrl,
        result: 'ALLOW',
        ipAddress: req.ip || '0.0.0.0',
        userAgent: req.headers['user-agent'] || 'unknown',
        details: { permissionType, reason: 'Break-glass platform support' }
      });
      return next();
    }

    // 4. Coaches must hold an active grant
    if (user.role === 'coach') {
      const grant = mockCoachGrants.find(
        g => g.coachId === user.id && g.playerId === targetPlayerId && g.status === 'ACTIVE'
      );

      if (!grant) {
        logSecurityEvent({
          actorId: user.id,
          actorRole: user.role,
          targetUserId: targetPlayerId,
          action: 'COACH_UNAUTHORIZED_ACCESS_ATTEMPT',
          resource: req.originalUrl,
          result: 'DENY',
          ipAddress: req.ip || '0.0.0.0',
          userAgent: req.headers['user-agent'] || 'unknown',
          details: { permissionType, targetPlayerId }
        });

        return res.status(403).json({
          error: 'Unauthorized Coach Access',
          code: 'COACH_GRANT_NOT_FOUND_OR_PENDING',
          message: 'You do not have an active, guardian-approved coaching relationship with this athlete.'
        });
      }

      // Check specific permission flags
      if (permissionType === 'view_videos' && !grant.canViewVideos) {
        return res.status(403).json({ error: 'Video review permission not granted by player/guardian.' });
      }
      if (permissionType === 'view_biometrics' && !grant.canViewBiometrics) {
        return res.status(403).json({ error: 'Biometrics access not granted by player/guardian.' });
      }

      // Success
      return next();
    }

    // Default deny
    return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
  };
}
