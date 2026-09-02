import { UserProfile, UserRole, UserSession, SecuritySettings } from '../types';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  activeSessions: UserSession[];
  securitySettings: SecuritySettings;
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutExpiresAt: number | null;
  botScore: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_success' | 'mfa_challenge' | 'failed_login_lockout' | 'password_reset_requested' | 'session_terminated' | 'passkey_registered';
  details: string;
  location: string;
  status: 'success' | 'flagged' | 'blocked';
}

const STORAGE_KEY_SESSIONS = 'pitch_precision_sessions_v1';
const STORAGE_KEY_LOCKOUT = 'pitch_precision_lockout_v1';
const STORAGE_KEY_SECURITY_LOG = 'pitch_precision_sec_log_v1';

// Initial default sessions for demonstration
const defaultSessions: UserSession[] = [
  {
    id: 'sess-current-01',
    userId: 'usr-alex',
    deviceName: 'MacBook Pro (16-inch, 2025)',
    deviceType: 'desktop',
    browser: 'Chrome 128 (macOS)',
    ipAddressMasked: '194.223.**.**',
    locationCity: 'London, United Kingdom',
    lastActive: 'Active right now',
    isCurrentSession: true,
    createdAt: new Date().toISOString(),
    mfaVerified: true,
  },
  {
    id: 'sess-mobile-02',
    userId: 'usr-alex',
    deviceName: 'iPhone 16 Pro Max',
    deviceType: 'mobile',
    browser: 'Pitch Precision Mobile iOS',
    ipAddressMasked: '82.165.**.**',
    locationCity: 'Southampton, UK (Lord\'s Ground Net Area)',
    lastActive: '34 minutes ago',
    isCurrentSession: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    mfaVerified: true,
  },
  {
    id: 'sess-ipad-03',
    userId: 'usr-alex',
    deviceName: 'iPad Air (Field Cam Rig)',
    deviceType: 'tablet',
    browser: 'Pitch Precision Telemetry App',
    ipAddressMasked: '148.252.**.**',
    locationCity: 'The Oval Cricket Ground, London',
    lastActive: 'Yesterday at 17:45',
    isCurrentSession: false,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    mfaVerified: true,
  }
];

export const isMfaMandatory = (role: UserRole): boolean => {
  const mandatoryRoles: UserRole[] = ['coach', 'club_admin', 'platform_admin', 'security_admin', 'admin'];
  return mandatoryRoles.includes(role);
};

export const getStoredSessions = (): UserSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read stored sessions', e);
  }
  return defaultSessions;
};

export const saveStoredSessions = (sessions: UserSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Failed to persist sessions', e);
  }
};

export const terminateSession = (sessionId: string): UserSession[] => {
  const current = getStoredSessions();
  const updated = current.filter(s => s.id !== sessionId);
  saveStoredSessions(updated);
  logSecurityEvent('session_terminated', `Session ${sessionId} terminated by user.`, 'Manual Revocation', 'success');
  return updated;
};

export const terminateAllOtherSessions = (currentSessionId: string): UserSession[] => {
  const current = getStoredSessions();
  const updated = current.filter(s => s.id === currentSessionId || s.isCurrentSession);
  saveStoredSessions(updated);
  logSecurityEvent('session_terminated', 'All other active sessions revoked across all devices.', 'Global Sign-Out', 'success');
  return updated;
};

export const getSecurityLogs = (): SecurityEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECURITY_LOG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read security logs', e);
  }
  return [
    {
      id: 'sec-01',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: 'login_success',
      details: 'Passkey biometric hardware token verified (FIDO2/WebAuthn)',
      location: 'London, UK',
      status: 'success'
    },
    {
      id: 'sec-02',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: 'mfa_challenge',
      details: 'MFA TOTP Authenticator code verified (RFC 6238)',
      location: 'London, UK',
      status: 'success'
    },
    {
      id: 'sec-03',
      timestamp: new Date(Date.now() - 1000 * 3600 * 6).toISOString(),
      type: 'failed_login_lockout',
      details: 'Credential stuffing defense: Rate-limiting tripped after 3 rapid failures from unrecognized ASN.',
      location: 'Frankfurt, Germany (Blocked IP 45.154.**.**)',
      status: 'blocked'
    }
  ];
};

export const logSecurityEvent = (
  type: SecurityEvent['type'],
  details: string,
  location: string = 'Current Client Node',
  status: 'success' | 'flagged' | 'blocked' = 'success'
): void => {
  const logs = getSecurityLogs();
  const newEntry: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    details,
    location,
    status
  };
  const updated = [newEntry, ...logs.slice(0, 24)];
  try {
    localStorage.setItem(STORAGE_KEY_SECURITY_LOG, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save security log', e);
  }
};

/**
 * Validates password against high-security standard:
 * - Minimum 10 characters
 * - Uppercase, lowercase, number, symbol
 * - No common dictionary word phrases
 */
export const evaluatePasswordStrength = (password: string): {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 10) score += 25;
  else feedback.push('Must be at least 10 characters long');

  if (password.length >= 14) score += 15;

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Include at least one uppercase letter');

  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Include at least one lowercase letter');

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push('Include at least one number');

  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  else feedback.push('Include a special symbol (!@#$%^&*)');

  // Common pattern check
  if (/password|cricket|123456|admin|coach|qwerty/i.test(password)) {
    score = Math.min(score, 30);
    feedback.push('Avoid easily guessable cricket or dictionary phrases');
  }

  score = Math.min(100, score);

  let label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong' = 'Very Weak';
  if (score >= 85) label = 'Very Strong';
  else if (score >= 70) label = 'Strong';
  else if (score >= 50) label = 'Fair';
  else if (score >= 30) label = 'Weak';

  return { score, label, feedback };
};

/**
 * Simulated WebAuthn Passkey Registration
 */
export const registerPasskeyWebAuthn = async (
  userName: string
): Promise<{ success: boolean; credentialId: string; deviceName: string }> => {
  // Simulate WebAuthn biometric challenge
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `passkey-${Date.now()}`;
      const device = 'Touch ID / Apple Face ID (Biometric Secure Enclave)';
      logSecurityEvent('passkey_registered', `FIDO2 Hardware Credential registered for ${userName}`, 'Local Secure Enclave', 'success');
      resolve({
        success: true,
        credentialId: id,
        deviceName: device
      });
    }, 1000);
  });
};

// In-Memory Access Token Storage (Never persisted in localStorage/sessionStorage to mitigate XSS)
let memoryAccessToken: string | null = null;
let onSessionExpiredCallback: (() => void) | null = null;

export const getAccessToken = (): string | null => memoryAccessToken;
export const setAccessToken = (token: string | null): void => {
  memoryAccessToken = token;
};

export const registerSessionExpiredHandler = (callback: () => void): void => {
  onSessionExpiredCallback = callback;
};

// Silent Refresh: Automatically fetches a new short-lived access token using HttpOnly rotate cookie
export const performSilentRefresh = async (): Promise<string | null> => {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Fallback if environment doesn't allow cookie-based transfer, but express cookie is primary
        refreshToken: localStorage.getItem('pitch_precision_rf_fallback') || undefined
      })
    });

    if (!res.ok) {
      // Refresh token is expired or invalid
      setAccessToken(null);
      localStorage.removeItem('pitch_precision_rf_fallback');
      localStorage.removeItem('pitch_precision_session_active');
      if (onSessionExpiredCallback) {
        onSessionExpiredCallback();
      }
      return null;
    }

    const data = await res.json();
    if (data.success && data.accessToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem('pitch_precision_session_active', 'true');
      return data.accessToken;
    }
  } catch (err) {
    console.error('Silent token refresh failed', err);
  }
  return null;
};

// secureFetch: Automatically attaches Authorization Bearer and handles automatic token renewal/rotation
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = getAccessToken();

  // If no token but a session is active, try a silent refresh first
  if (!token && localStorage.getItem('pitch_precision_session_active') === 'true') {
    token = await performSilentRefresh();
  }

  // Set authorization header
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  } as Record<string, string>;

  const mergedOptions = { ...options, headers };
  let response = await fetch(url, mergedOptions);

  // If 401 with ACCESS_TOKEN_EXPIRED error, attempt silent refresh once and retry
  if (response.status === 401) {
    try {
      const clone = response.clone();
      const body = await clone.json();
      if (body.error === 'ACCESS_TOKEN_EXPIRED' || body.tokenExpired) {
        console.log('[SECURITY] Access token expired, attempting transparent silent refresh rotation...');
        const renewedToken = await performSilentRefresh();
        if (renewedToken) {
          headers['Authorization'] = `Bearer ${renewedToken}`;
          response = await fetch(url, { ...options, headers });
        }
      } else if (body.error === 'SESSION_EXPIRED' || body.sessionExpired) {
        console.warn('[SECURITY] Session expired or revoked. Logging out user.');
        setAccessToken(null);
        localStorage.removeItem('pitch_precision_session_active');
        if (onSessionExpiredCallback) {
          onSessionExpiredCallback();
        }
      }
    } catch (e) {
      // Not JSON or parsing failed
    }
  }

  return response;
};
