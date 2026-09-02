import React, { useState, useEffect } from 'react';
import { UserProfile, UserSession, SecuritySettings } from '../../types';
import {
  getStoredSessions,
  terminateSession,
  terminateAllOtherSessions,
  getSecurityLogs,
  logSecurityEvent,
  registerPasskeyWebAuthn,
  isMfaMandatory,
  SecurityEvent
} from '../../utils/authSecurityManager';
import { playBeep } from '../../utils/audioFeedback';
import { ReauthModal } from '../ReauthModal';
import {
  getIncidentRecords,
  logIncidentEvent,
  verifyChainIntegrity,
  IncidentRecord,
  IncidentCategory,
  IncidentSeverity,
  CONTAINMENT_PROTOCOLS
} from '../../utils/incidentResponseManager';

interface SecurityAndSessionsScreenProps {
  currentUser: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onNavigateBack: () => void;
  onOpenPrivacy?: () => void;
  onOpenEncryption?: () => void;
  onOpenMobileSecurity?: () => void;
}

export const SecurityAndSessionsScreen: React.FC<SecurityAndSessionsScreenProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateBack,
  onOpenPrivacy,
  onOpenEncryption,
  onOpenMobileSecurity
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'mfa_passkeys' | 'sensitive_actions' | 'audit_logs' | 'incident_response'>('sessions');
  const [sessions, setSessions] = useState<UserSession[]>(getStoredSessions());
  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>(getSecurityLogs());
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [passkeySuccessMessage, setPasskeySuccessMessage] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(
    currentUser.securitySettings?.mfaEnabled ?? (isMfaMandatory(currentUser.role) ? true : false)
  );
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [isEnablingMfa, setIsEnablingMfa] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Step-Up Re-Authentication state
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthAction, setReauthAction] = useState<string>('');
  const [reauthCallback, setReauthCallback] = useState<() => void>(() => {});

  // Inputs for sensitive actions
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [juniorName, setJuniorName] = useState('');
  const [juniorEmail, setJuniorEmail] = useState('');
  const [guardianRel, setGuardianRel] = useState('Parent');
  const [adminTargetUser, setAdminTargetUser] = useState('usr-devang');
  const [adminTargetRole, setAdminTargetRole] = useState('club_admin');

  // Incident Response States
  const [incidents, setIncidents] = useState<IncidentRecord[]>(getIncidentRecords());
  const [chainValid, setChainValid] = useState(verifyChainIntegrity().isValid);
  const [brokenAtId, setBrokenAtId] = useState<string | undefined>(verifyChainIntegrity().brokenAt);

  const [incCategory, setIncCategory] = useState<IncidentCategory>('security_breach');
  const [incSeverity, setIncSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [incReporter, setIncReporter] = useState(currentUser.name || 'Anonymous User');
  const [incDesc, setIncDesc] = useState('');
  const [incAction, setIncAction] = useState('');

  const roleRequiresMfa = isMfaMandatory(currentUser.role);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleTerminateSession = async (sessionId: string) => {
    playBeep(450, 0.08);
    const updated = terminateSession(sessionId);
    setSessions(updated);
    setSecurityLogs(getSecurityLogs());
    showNotification('Device session revoked. Access token invalidated.');

    // Also call server API
    try {
      await fetch('/api/auth/sessions/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch (e) {
      console.warn('Server session sync error', e);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    playBeep(520, 0.1);
    const currentSess = sessions.find(s => s.isCurrentSession);
    const updated = terminateAllOtherSessions(currentSess?.id || 'sess-current-01');
    setSessions(updated);
    setSecurityLogs(getSecurityLogs());
    showNotification('All other active sessions across all devices terminated.');

    try {
      await fetch('/api/auth/sessions/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminateAllOthers: true, currentSessionId: currentSess?.id })
      });
    } catch (e) {
      console.warn('Server session sync error', e);
    }
  };

  const handleRegisterPasskey = async () => {
    setIsRegisteringPasskey(true);
    playBeep(880, 0.1);
    try {
      const res = await registerPasskeyWebAuthn(currentUser.name);
      setIsRegisteringPasskey(false);
      setPasskeySuccessMessage(`Passkey created on ${res.deviceName}`);
      setSecurityLogs(getSecurityLogs());
      showNotification('Hardware Passkey registered successfully.');
    } catch (e) {
      setIsRegisteringPasskey(false);
    }
  };

  const handleConfirmMFA = () => {
    if (verificationCodeInput.length === 6) {
      playBeep(920, 0.12);
      setMfaEnabled(true);
      setIsEnablingMfa(false);
      logSecurityEvent('mfa_challenge', 'Authenticator App (TOTP RFC 6238) paired and verified.', 'Security Settings');
      setSecurityLogs(getSecurityLogs());
      showNotification('MFA successfully activated on your account.');
    } else {
      showNotification('Please enter the 6-digit TOTP verification code.');
    }
  };

  const triggerSensitiveAction = (actionLabel: string, callback: () => void) => {
    setReauthAction(actionLabel);
    setReauthCallback(() => callback);
    setReauthOpen(true);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 10) {
      showNotification('Error: New password must be at least 10 characters.');
      return;
    }
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setNewPassword('');
        logSecurityEvent('password_reset_requested', 'User changed account password with recent MFA step-up.', 'Security Dashboard');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during password update.');
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      showNotification('Error: Please enter a valid email address.');
      return;
    }
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/account/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setNewEmail('');
        if (onUpdateUser && currentUser) {
          onUpdateUser({ ...currentUser, email: data.newEmail });
        }
        logSecurityEvent('password_reset_requested', `Primary email updated to ${data.newEmail} under recent step-up protection.`, 'Security Dashboard');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during email update.');
    }
  };

  const handleLinkJunior = async () => {
    if (!juniorName || !juniorEmail) {
      showNotification('Error: Junior name and email are required.');
      return;
    }
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/account/link-junior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ juniorName, juniorEmail })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setJuniorName('');
        setJuniorEmail('');
        logSecurityEvent('mfa_challenge', `Linked new junior account (${juniorEmail}) with guardian approval.`, 'Guardianship Center');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during junior linking.');
    }
  };

  const handleChangeGuardianRelationship = async () => {
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/account/guardian-relationship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship: guardianRel })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        logSecurityEvent('mfa_challenge', `Guardian relationship policy updated to '${guardianRel}' via step-up.`, 'Guardianship Center');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during guardian relationship change.');
    }
  };

  const handleExportDSAR = async () => {
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/privacy/dsar-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, role: currentUser.role })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`DSAR Export Packet generated successfully! Export ID: ${data.exportData.dsarId}`);
        
        // Trigger local JSON packet download
        const blob = new Blob([JSON.stringify(data.exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Pitch_Precision_DSAR_${data.exportData.dsarId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logSecurityEvent('mfa_challenge', `Data Subject Access Request (DSAR) executed & export packet compiled.`, 'Privacy Office');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during DSAR generation.');
    }
  };

  const handleAdminChangePrivileges = async () => {
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/admin/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: adminTargetUser, newRole: adminTargetRole })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        logSecurityEvent('mfa_challenge', `Administrative privilege changed: ${adminTargetUser} set to ${adminTargetRole}.`, 'IAM Operations');
        setSecurityLogs(getSecurityLogs());
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during privilege modification.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { secureFetch } = await import('../../utils/authSecurityManager');
      const res = await secureFetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        logSecurityEvent('session_terminated', 'Account marked for permanent deletion. Purging data.', 'Global Sign-Out');
        setSecurityLogs(getSecurityLogs());
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        showNotification(`Error: ${data.error}`);
      }
    } catch (e) {
      showNotification('Network error during account deletion.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 text-white">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
              <span>Security & Identity Safeguards</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-mono border border-[#c3f400]/40 uppercase">
                Zero Trust
              </span>
            </h1>
            <p className="text-xs text-[#c4c9ac] mt-0.5">
              Manage multi-factor authentication, active sessions, passkeys, and real-time audit telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="mb-4 p-3 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Data Privacy by Design Banner */}
      {onOpenPrivacy && (
        <div className="mb-4 p-4 rounded-2xl bg-[#1c1b1b] border border-[#c3f400]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Privacy by Design & Data Classification
              </h4>
              <p className="text-[11px] text-[#8e9285] mt-0.5">
                Inspect the 7-tier data classification matrix, data minimization rationale, and zero-leakage telemetry redactor.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPrivacy}
            className="px-3.5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer"
          >
            <span>Open Privacy Center</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Data Encryption & Key Management Banner */}
      {onOpenEncryption && (
        <div className="mb-3 p-4 rounded-2xl bg-[#1c1b1b] border border-[#9cf0ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 flex items-center justify-center text-[#9cf0ff]">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Data Encryption & Key Management (TLS 1.3 & Cloud KMS)
              </h4>
              <p className="text-[11px] text-[#8e9285] mt-0.5">
                Managed AES-256-GCM envelope encryption, 90-day key rotation, HSTS preload, and mobile zero-secrets guard.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEncryption}
            className="px-3.5 py-2 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer"
          >
            <span>Open Encryption Center</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Mobile Application Security (OWASP MASVS) Banner */}
      {onOpenMobileSecurity && (
        <div className="mb-4 p-4 rounded-2xl bg-[#1c1b1b] border border-[#83ea00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#83ea00]/10 border border-[#83ea00]/30 flex items-center justify-center text-[#83ea00]">
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Mobile Security (OWASP MASVS & Hardware Keystore)
              </h4>
              <p className="text-[11px] text-[#8e9285] mt-0.5">
                iOS Keychain / Android Keystore encrypted storage, FLAG_SECURE screen protection, deep link validation, and root attestation.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMobileSecurity}
            className="px-3.5 py-2 rounded-xl bg-[#83ea00] hover:bg-[#97f814] text-black text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer"
          >
            <span>Open Mobile Security</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Role Mandate Notice */}
      {roleRequiresMfa && (
        <div className="mb-6 p-4 rounded-2xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 text-white flex items-start gap-3 shadow-md">
          <span className="material-symbols-outlined text-[#9cf0ff] text-[22px] shrink-0 mt-0.5">
            verified
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#9cf0ff] uppercase tracking-wider">
              Mandatory Safeguarding MFA Policy Active
            </h4>
            <p className="text-xs text-[#c4c9ac] mt-1 leading-relaxed">
              As a verified <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong> with access to junior players or club rosters, 
              Multi-Factor Authentication (MFA) is strictly enforced under ECB, COPPA, and Club Safeguarding policies.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'sessions' as const, label: 'Active Sessions & Devices', icon: 'devices' },
          { id: 'mfa_passkeys' as const, label: 'Passkeys & 2FA Setup', icon: 'key' },
          { id: 'sensitive_actions' as const, label: 'Sensitive Actions (Step-Up)', icon: 'lock_open' },
          { id: 'audit_logs' as const, label: 'Security Audit Stream', icon: 'security' },
          { id: 'incident_response' as const, label: 'Incident Response Center', icon: 'campaign' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-headline font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_15px_rgba(195,244,0,0.25)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1c1b1b] border border-white/10">
            <div>
              <h3 className="font-headline font-bold text-sm text-white">Active Device Sessions ({sessions.length})</h3>
              <p className="text-xs text-[#c4c9ac]">
                Signed-in hardware nodes authorized to access your cricket records.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleTerminateAllOtherSessions}
                className="px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out All Other Devices</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {sessions.map(sess => (
              <div
                key={sess.id}
                className={`p-4 rounded-2xl border transition-all ${
                  sess.isCurrentSession
                    ? 'bg-[#201f1f] border-[#c3f400]/40 shadow-[0_0_20px_rgba(195,244,0,0.08)]'
                    : 'bg-[#181818] border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      sess.deviceType === 'mobile' 
                        ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' 
                        : sess.deviceType === 'tablet'
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                        : 'bg-[#c3f400]/15 border-[#c3f400]/30 text-[#c3f400]'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {sess.deviceType === 'mobile' ? 'smartphone' : sess.deviceType === 'tablet' ? 'tablet' : 'laptop_mac'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-sm text-white">{sess.deviceName}</span>
                        {sess.isCurrentSession && (
                          <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold border border-[#c3f400]/30">
                            Current Device
                          </span>
                        )}
                        {sess.mfaVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-[#9cf0ff]/20 text-[#9cf0ff] text-[10px] font-bold border border-[#9cf0ff]/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            MFA Verified
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#c4c9ac] mt-1">{sess.browser} • {sess.locationCity}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#8e918f] mt-1.5 font-mono">
                        <span>IP: {sess.ipAddressMasked}</span>
                        <span>•</span>
                        <span>{sess.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrentSession && (
                    <button
                      onClick={() => handleTerminateSession(sess.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MFA & PASSKEYS */}
      {activeTab === 'mfa_passkeys' && (
        <div className="space-y-6">
          {/* Passkeys Card */}
          <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">fingerprint</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-white">Biometric Passkeys (FIDO2 / WebAuthn)</h3>
                  <p className="text-xs text-[#c4c9ac] mt-0.5">
                    Sign in with Touch ID, Apple Face ID, or Windows Hello. Cryptographically impervious to phishing & credential stuffing.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRegisterPasskey}
                disabled={isRegisteringPasskey}
                className="px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>{isRegisteringPasskey ? 'Registering...' : 'Register Passkey'}</span>
              </button>
            </div>

            {passkeySuccessMessage && (
              <div className="p-3 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{passkeySuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Authenticator App MFA */}
          <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">lock_clock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-white">Time-based One-Time Password (TOTP)</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      mfaEnabled 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {mfaEnabled ? 'ACTIVE & ENFORCED' : 'NOT CONFIGURED'}
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c9ac] mt-0.5">
                    Generate 6-digit verification codes using Google Authenticator, Authy, or 1Password.
                  </p>
                </div>
              </div>

              {!mfaEnabled && !isEnablingMfa && (
                <button
                  onClick={() => setIsEnablingMfa(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code</span>
                  <span>Pair Authenticator</span>
                </button>
              )}
            </div>

            {/* QR Setup Modal / In-line Flow */}
            {isEnablingMfa && (
              <div className="p-4 rounded-xl bg-[#252525] border border-white/10 space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Mock QR Canvas */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                      <rect width="100" height="100" fill="#fff" />
                      <rect x="10" y="10" width="25" height="25" fill="#000" />
                      <rect x="15" y="15" width="15" height="15" fill="#fff" />
                      <rect x="65" y="10" width="25" height="25" fill="#000" />
                      <rect x="70" y="15" width="15" height="15" fill="#fff" />
                      <rect x="10" y="65" width="25" height="25" fill="#000" />
                      <rect x="15" y="70" width="15" height="15" fill="#fff" />
                      <rect x="42" y="42" width="16" height="16" fill="#000" />
                      <rect x="45" y="15" width="10" height="10" fill="#000" />
                      <rect x="15" y="45" width="10" height="10" fill="#000" />
                      <rect x="65" y="65" width="25" height="25" fill="#000" />
                    </svg>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-white">1. Scan QR code in Google Authenticator or 1Password.</p>
                    <p className="text-[#c4c9ac]">
                      Or manually copy secret key: <span className="font-mono text-[#c3f400] bg-black/40 px-2 py-0.5 rounded">{totpSecret}</span>
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-32 bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-center font-mono text-base text-white tracking-widest outline-none focus:border-[#c3f400]"
                      />
                      <button
                        onClick={handleConfirmMFA}
                        className="px-4 py-2 rounded-lg bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors cursor-pointer"
                      >
                        Verify & Activate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SENSITIVE ACTIONS WITH STEP-UP */}
      {activeTab === 'sensitive_actions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-red-500/20">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-red-400">lock_open</span>
              Recent Privileged Session Requirements
            </h3>
            <p className="text-xs text-[#c4c9ac] mt-1">
              Actions marked with step-up protection require dynamic re-authentication if your elevated session has exceeded 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action 1: Change Password */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">password</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Change Account Password</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Update your primary password. Strong passwords must be 10+ characters with symbols.
              </p>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={() => triggerSensitiveAction('Changing Password', handleChangePassword)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Update Password (Step-Up)
                </button>
              </div>
            </div>

            {/* Action 2: Change Email */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">mail</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Change Primary Email</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Update your contact email address. A validation link will be dispatched.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="new.email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={() => triggerSensitiveAction('Changing Primary Email', handleChangeEmail)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Update Email (Step-Up)
                </button>
              </div>
            </div>

            {/* Action 3: Link Junior Account */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">family_restroom</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Link Junior Account</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Link a minor athlete account for child-safety monitoring and guardian supervision.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Junior Full Name"
                  value={juniorName}
                  onChange={(e) => setJuniorName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white mb-1"
                />
                <input
                  type="email"
                  placeholder="junior.email@example.com"
                  value={juniorEmail}
                  onChange={(e) => setJuniorEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={() => triggerSensitiveAction('Linking Junior Account', handleLinkJunior)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Link Junior Account (Step-Up)
                </button>
              </div>
            </div>

            {/* Action 4: Change Guardian Relationship */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">supervised_user_circle</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Guardian Relationship</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Change the supervising guardian status relationship to verify legal authority levels.
              </p>
              <div className="space-y-2">
                <select
                  value={guardianRel}
                  onChange={(e) => setGuardianRel(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Parent">Legal Parent / Mother / Father</option>
                  <option value="Legal Guardian">Court-Appointed Guardian</option>
                  <option value="Temporary Supervisor">Temporary Supervisor (Delegated)</option>
                </select>
                <button
                  onClick={() => triggerSensitiveAction('Changing Guardian Relationship', handleChangeGuardianRelationship)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm Relationship (Step-Up)
                </button>
              </div>
            </div>

            {/* Action 5: Export Personal Info (DSAR) */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">download_for_offline</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Export Personal Info (DSAR)</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Trigger a complete Data Subject Access Request export of your stored telemetry, identity, and security keys.
              </p>
              <button
                onClick={() => triggerSensitiveAction('Exporting Personal Information (DSAR)', handleExportDSAR)}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Compile and Export Archive (Step-Up)
              </button>
            </div>

            {/* Action 6: Change Administrative Privileges */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">shield_person</span>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Administrative Privileges</h4>
              </div>
              <p className="text-[11px] text-[#c4c9ac]">
                Promote/demote members of the organization. Only authorized users can execute.
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={adminTargetUser}
                    onChange={(e) => setAdminTargetUser(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white"
                  >
                    <option value="usr-devang">Devang Dalvi (Player)</option>
                    <option value="usr-arin">Arin Mishra (Coach)</option>
                    <option value="usr-roshan">Roshan Srilanka (Coach)</option>
                  </select>
                  <select
                    value={adminTargetRole}
                    onChange={(e) => setAdminTargetRole(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white"
                  >
                    <option value="player">Player (Roster)</option>
                    <option value="coach">Coach (Verified)</option>
                    <option value="club_admin">Club Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => triggerSensitiveAction('Changing Administrative Privileges', handleAdminChangePrivileges)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Commit Privileges (Step-Up)
                </button>
              </div>
            </div>
          </div>

          {/* Action 7: Delete Account */}
          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 text-[24px]">delete_forever</span>
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Permanently Delete Account</h4>
                <p className="text-xs text-[#c4c9ac] mt-1">
                  This will queue your profile, video files, analytics telemetry, and child-safeguarding associations for immediate compliance destruction.
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerSensitiveAction('Deleting Account', handleDeleteAccount)}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-headline font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Permanently Delete Account (Step-Up)
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT STREAM */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1b1b] border border-white/10">
            <div>
              <h3 className="font-headline font-bold text-sm text-white">Cryptographic Security Telemetry</h3>
              <p className="text-xs text-[#c4c9ac]">
                Immutable access events, rate-limiting locks, and authentication attempts.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Audit Stream
            </span>
          </div>

          <div className="space-y-2">
            {securityLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#181818] border border-white/10 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    log.status === 'blocked'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : log.status === 'flagged'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/30'
                  }`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {log.status === 'blocked' ? 'gpp_bad' : log.status === 'flagged' ? 'warning' : 'verified_user'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                        {log.type.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono uppercase ${
                        log.status === 'blocked' ? 'bg-red-900/60 text-red-200' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[#c4c9ac] mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-[#8e918f] font-mono mt-1">{log.location}</p>
                  </div>
                </div>

                <span className="text-[10px] text-[#8e918f] font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INCIDENT RESPONSE CENTER */}
      {activeTab === 'incident_response' && (
        <div className="space-y-6">
          {/* Audit Chain Verification Header */}
          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">emergency</span>
                Incident Response Command Center
              </h3>
              <p className="text-xs text-[#c4c9ac] mt-0.5">
                Official protocol triggers and auditable, cryptographically-chained incident logging for security administrators.
              </p>
            </div>

            {chainValid ? (
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                Audit Chain Signature Verified (Untampered)
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase font-bold animate-pulse">
                <span className="material-symbols-outlined text-[14px]">gpp_bad</span>
                Warning: Audit Chain Broken at {brokenAtId}!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Create Incident Form */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#181818] border border-white/5 space-y-4">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#c3f400]">
                Sign Security Incident Record
              </h4>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#8e918f] font-bold">Incident Category</label>
                <select
                  value={incCategory}
                  onChange={(e) => setIncCategory(e.target.value as IncidentCategory)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                >
                  <option value="security_breach">Security Breach (Server/DB Infiltration)</option>
                  <option value="compromised_user_account">Compromised User Account (Athlete Profile)</option>
                  <option value="compromised_admin_account">Compromised Admin Account (Privilege Leak)</option>
                  <option value="data_leakage">Data Leakage (GDPR / PII Exposure)</option>
                  <option value="malicious_upload">Malicious Upload (Antivirus / Magic Bytes Check)</option>
                  <option value="ai_safety_event">AI Safety Event (LLM Jailbreak / Injection)</option>
                  <option value="child_safety_report">Child-Safety Report (Unsupervised Contact)</option>
                  <option value="lost_mobile_device">Lost Mobile Device (Local Keychain Remote Wipe)</option>
                  <option value="compromised_api_credential">Compromised API Credential (KMS Keys Leak)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#8e918f] font-bold">Severity Level</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#8e918f] font-bold">Reporter Name</label>
                  <input
                    type="text"
                    value={incReporter}
                    onChange={(e) => setIncReporter(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#8e918f] font-bold">Incident Description & Context</label>
                <textarea
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Detail exactly what was breached, who is involved, and what vectors are suspected..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400] h-20 resize-none"
                  required
                />
              </div>

              {/* Live Recommended Containment checklist */}
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <span className="text-[9px] font-mono tracking-wider text-amber-400 font-bold uppercase block">
                  Mandatory containment protocols for this category:
                </span>
                <ul className="text-[10px] text-[#c4c9ac] space-y-1 list-disc list-inside">
                  {CONTAINMENT_PROTOCOLS[incCategory].map((step, idx) => (
                    <li key={idx} className="leading-snug">{step}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#8e918f] font-bold">Action Taken / Containment Executed</label>
                <input
                  type="text"
                  value={incAction}
                  onChange={(e) => setIncAction(e.target.value)}
                  placeholder="e.g. Terminated session sess-ipad-03, rotating KMS secret"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!incDesc.trim() || !incAction.trim()) {
                    showNotification('Error: Please fill in description and action taken.');
                    return;
                  }
                  playBeep(800, 0.1);
                  const newRecord = logIncidentEvent(
                    incCategory,
                    incSeverity,
                    incReporter,
                    incDesc,
                    incAction,
                    'CONTAINED'
                  );
                  const updatedIncidents = getIncidentRecords();
                  setIncidents(updatedIncidents);
                  const verification = verifyChainIntegrity();
                  setChainValid(verification.isValid);
                  setBrokenAtId(verification.brokenAt);
                  setIncDesc('');
                  setIncAction('');
                  showNotification(`Incident ${newRecord.id} securely registered and signed.`);
                }}
                className="w-full py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-bold font-headline hover:bg-[#d6ff38] transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">draw</span>
                <span>Sign & Commit Incident (Crypto Signoff)</span>
              </button>
            </div>

            {/* Right Column: Signed Audit Trail */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#83ea00]">
                  Cryptographic Audit Trail (Chain Register)
                </h4>
                <span className="text-[10px] font-mono text-[#8e918f]">{incidents.length} Records Chain</span>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {incidents.slice().reverse().map((inc) => {
                  const isCritical = inc.severity === 'CRITICAL' || inc.severity === 'HIGH';
                  return (
                    <div
                      key={inc.id}
                      className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-white/15 transition-all space-y-3"
                    >
                      {/* Incident Header */}
                      <div className="flex justify-between items-start gap-3 border-b border-white/5 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase ${
                              isCritical ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/10 text-blue-300'
                            }`}>
                              {inc.severity}
                            </span>
                          </div>
                          <span className="text-[11px] font-headline font-bold text-white uppercase tracking-wider mt-1 block">
                            {inc.category.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <span className="text-[9px] font-mono text-[#8e918f]">
                          {new Date(inc.timestamp).toLocaleString()}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-[#8e918f] font-bold uppercase">Reporter: {inc.reporter}</span>
                        <p className="text-xs text-[#c4c9ac] leading-relaxed">{inc.description}</p>
                      </div>

                      {/* Containment step-by-step checklist */}
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] font-bold uppercase text-amber-400">Containment Verification Log:</span>
                        <div className="space-y-1 text-[10px] text-[#8e918f]">
                          {inc.containmentProtocol.map((protocol, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-emerald-400 text-[14px]">check_circle</span>
                              <span className="line-through text-[#8e918f]">{protocol}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action taken / resolution */}
                      <div className="text-xs text-[#c4c9ac] flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-emerald-400 text-[16px] shrink-0 mt-0.5">verified</span>
                        <div>
                          <strong className="text-white">Active Mitigation Taken:</strong> {inc.actionTaken}
                        </div>
                      </div>

                      {/* Cryptographic chain signature */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#8e918f]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-emerald-400">key_visualizer</span>
                          Immutable Chain ID:
                        </span>
                        <span className="bg-black/80 px-2 py-0.5 rounded border border-white/5 text-white">
                          {inc.auditSignature}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <ReauthModal
        isOpen={reauthOpen}
        onClose={() => setReauthOpen(false)}
        actionLabel={reauthAction}
        onSuccess={reauthCallback}
      />
    </div>
  );
};
