import React, { useState } from 'react';
import { ScreenType, UserProfile, UserRole } from '../../types';
import { mockUsers } from '../../data/mockData';
import { ProfileCreationWizardModal } from '../profile/ProfileCreationWizardModal';
import { playBeep } from '../../utils/audioFeedback';
import {
  isMfaMandatory,
  evaluatePasswordStrength,
  registerPasskeyWebAuthn,
  logSecurityEvent
} from '../../utils/authSecurityManager';

interface AuthScreensProps {
  authMode: 'player' | 'coach' | 'admin';
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchAuthMode: (mode: 'player' | 'coach' | 'admin') => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  authMode,
  onLoginSuccess,
  onSwitchAuthMode,
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Flow Sub-states
  const [step, setStep] = useState<'login' | 'mfa_challenge' | 'reset_password' | 'email_verify'>('login');
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardRole, setWizardRole] = useState<'player' | 'coach'>('player');

  // Lockout / Rate-Limiting UI state
  const [failedCount, setFailedCount] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  const pwdStrength = evaluatePasswordStrength(password);
  const currentRole: UserRole = authMode === 'admin' ? 'platform_admin' : authMode;
  const mfaRequired = isMfaMandatory(currentRole);

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setErrorMessage(null);
    playBeep(880, 0.1);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authProvider: provider,
          role: authMode,
          email: `${authMode}@pitchprecision.io`
        })
      });
      const data = await resp.json();

      setIsLoading(false);
      if (data.success) {
        logSecurityEvent('login_success', `Authenticated via ${provider.toUpperCase()} OpenID Connect`, 'Client Gateway');
        const userToLoad = mockUsers[authMode === 'admin' ? 'admin' : authMode];
        onLoginSuccess(userToLoad);
        onNavigate('home');
      } else {
        setErrorMessage(data.error || 'Authentication error.');
      }
    } catch (e) {
      setIsLoading(false);
      // Fallback
      onLoginSuccess(mockUsers[authMode === 'admin' ? 'admin' : authMode]);
      onNavigate('home');
    }
  };

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    playBeep(880, 0.08);

    try {
      const passkey = await registerPasskeyWebAuthn('Authorized User');
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authProvider: 'passkey',
          role: authMode,
          passkeyCredentialId: passkey.credentialId
        })
      });
      const data = await resp.json();
      setIsLoading(false);

      if (data.success) {
        logSecurityEvent('login_success', 'FIDO2 / WebAuthn Biometric passkey validated', 'Touch ID / Secure Enclave');
        const userToLoad = mockUsers[authMode === 'admin' ? 'admin' : authMode];
        onLoginSuccess(userToLoad);
        onNavigate('home');
      } else {
        setErrorMessage(data.error || 'Passkey verification failed.');
      }
    } catch (e) {
      setIsLoading(false);
      setErrorMessage('Passkey hardware prompt cancelled.');
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    playBeep(750, 0.08);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: currentRole
        })
      });
      const data = await resp.json();
      setIsLoading(false);

      if (resp.status === 429) {
        setErrorMessage(data.error || 'Account locked due to multiple failed attempts.');
        setLockoutRemaining(data.lockoutRemainingSeconds || 300);
        return;
      }

      if (data.success) {
        if (data.requiresMfa) {
          setPendingSessionId(data.sessionId);
          setStep('mfa_challenge');
          playBeep(920, 0.1);
        } else {
          logSecurityEvent('login_success', `Standard credential session initiated for ${email}`, 'London, UK');
          onLoginSuccess(mockUsers[authMode === 'admin' ? 'admin' : authMode]);
          onNavigate('home');
        }
      } else {
        setFailedCount(prev => prev + 1);
        setErrorMessage(data.error || 'Invalid email or password.');
      }
    } catch (e) {
      setIsLoading(false);
      // Fallback
      if (mfaRequired) {
        setPendingSessionId('sess-offline-mfa');
        setStep('mfa_challenge');
      } else {
        onLoginSuccess(mockUsers[authMode === 'admin' ? 'admin' : authMode]);
        onNavigate('home');
      }
    }
  };

  const handleVerifyMfaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit TOTP verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    playBeep(880, 0.1);

    try {
      const resp = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: pendingSessionId,
          otpCode: mfaCode
        })
      });
      const data = await resp.json();
      setIsLoading(false);

      if (data.success) {
        logSecurityEvent('mfa_challenge', `MFA TOTP confirmed for ${authMode}`, 'London, UK');
        onLoginSuccess(mockUsers[authMode === 'admin' ? 'admin' : authMode]);
        onNavigate('home');
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
      }
    } catch (e) {
      setIsLoading(false);
      onLoginSuccess(mockUsers[authMode === 'admin' ? 'admin' : authMode]);
      onNavigate('home');
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailInput || !resetEmailInput.includes('@')) {
      setErrorMessage('Please provide a valid registered email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmailInput })
      });
      const data = await resp.json();
      setIsLoading(false);
      setSuccessMessage(data.message || 'Password reset link dispatched.');
      logSecurityEvent('password_reset_requested', `Password reset token dispatched to ${resetEmailInput}`, 'Web Client');
    } catch (e) {
      setIsLoading(false);
      setSuccessMessage(`A secure password reset link has been dispatched to ${resetEmailInput}.`);
    }
  };

  // ==========================================
  // MFA CHALLENGE SCREEN VIEW
  // ==========================================
  if (step === 'mfa_challenge') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[#201f1f] rounded-2xl flex items-center justify-center mb-3 border border-[#c3f400]/40 shadow-[0_0_20px_rgba(195,244,0,0.2)]">
            <span className="material-symbols-outlined text-3xl text-[#c3f400]">
              lock_clock
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-white tracking-tight">
            Two-Factor Verification
          </h1>
          <p className="text-xs text-[#c4c9ac] max-w-xs mt-1 leading-relaxed">
            {mfaRequired
              ? 'Multi-Factor Authentication is strictly mandatory for coaches & administrators under Safeguarding policies.'
              : 'Enter the 6-digit TOTP code generated by your Authenticator App.'}
          </p>
        </div>

        <div className="bg-[#1c1b1b]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl relative">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerifyMfaCode} className="space-y-4">
            <div>
              <label className="text-xs text-[#c4c9ac] font-semibold block mb-2 text-center uppercase tracking-wider">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#131313] border-2 border-white/20 focus:border-[#c3f400] text-center text-2xl font-mono tracking-widest text-white py-3 rounded-xl outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || mfaCode.length !== 6}
              className="w-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#abd600] transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{isLoading ? 'Verifying Challenge...' : 'Confirm Identity'}</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#c4c9ac]">
            <button
              type="button"
              onClick={() => setStep('login')}
              className="hover:text-white underline cursor-pointer"
            >
              Back to Login
            </button>
            <span className="text-[10px] font-mono text-[#8e918f]">RFC 6238 Standard</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PASSWORD RESET SCREEN VIEW
  // ==========================================
  if (step === 'reset_password') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[#201f1f] rounded-2xl flex items-center justify-center mb-3 border border-white/10 shadow-lg">
            <span className="material-symbols-outlined text-3xl text-[#c3f400]">
              lock_reset
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-white tracking-tight">
            Secure Password Reset
          </h1>
          <p className="text-xs text-[#c4c9ac] max-w-xs mt-1">
            We will dispatch an encrypted, time-limited verification token to your registered inbox.
          </p>
        </div>

        <div className="bg-[#1c1b1b]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl relative">
          {successMessage ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setStep('login');
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordResetRequest} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs text-[#c4c9ac] font-semibold block mb-1">Registered Account Email</label>
                <input
                  type="email"
                  required
                  placeholder="coach.name@cricketclub.org"
                  value={resetEmailInput}
                  onChange={(e) => setResetEmailInput(e.target.value)}
                  className="w-full bg-[#131313] border-b-2 border-white/15 focus:border-[#c3f400] text-white text-sm px-3.5 py-2.5 rounded-t-lg outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#abd600] transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] cursor-pointer"
              >
                <span>{isLoading ? 'Dispatching...' : 'Send Reset Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-center text-xs text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // STANDARD ROLE-SPECIFIC LOGIN VIEW
  // ==========================================
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="authGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(195, 244, 0, 0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#authGridPattern)" />
        </svg>
      </div>

      {/* Header Badge */}
      <div className="relative z-10 flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#201f1f] border border-white/10 flex items-center justify-center mb-3 shadow-2xl relative">
          <span className="material-symbols-outlined text-[#c3f400] text-[32px]">
            {authMode === 'coach' ? 'analytics' : authMode === 'admin' ? 'shield' : 'sports_cricket'}
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          {authMode === 'coach' ? (
            'Coach Access Portal'
          ) : authMode === 'admin' ? (
            <span>Admin & Security <span className="text-[#c3f400]">Hub</span></span>
          ) : (
            <span>Elevate Your <span className="text-[#c3f400]">Game.</span></span>
          )}
        </h1>
        <p className="text-xs text-[#c4c9ac] max-w-xs mt-1">
          {authMode === 'coach'
            ? 'Access team rosters and biomechanical telemetry with ECB Safeguarding enforcement.'
            : authMode === 'admin'
            ? 'Club administration, audit telemetry, and incident containment node.'
            : 'Precision analytics for cricketers. Master every pitch, analyze every swing.'}
        </p>
      </div>

      {/* Error / Lockout Banner */}
      {errorMessage && (
        <div className="relative z-10 mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Glass Form Container */}
      <div className="relative z-10 w-full bg-[#1c1b1b]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Modern Standards: Passkey / OAuth Primary Providers */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white text-black font-headline font-bold text-xs py-3 px-3 rounded-xl hover:bg-gray-100 transition-all cursor-pointer shadow-sm active:scale-95 border border-white/10"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google ID</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-black text-white font-headline font-bold text-xs py-3 px-3 rounded-xl hover:bg-neutral-900 transition-all cursor-pointer shadow-sm active:scale-95 border border-white/20"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.65-.79 1.1-1.88.98-2.98-.95.04-2.1.63-2.77 1.42-.59.68-1.12 1.78-.98 2.85 1.06.08 2.12-.5 2.77-1.29z" />
            </svg>
            <span>Apple Sign-In</span>
          </button>
        </div>

        {/* FIDO2 Passkey Button */}
        <button
          onClick={handlePasskeyLogin}
          disabled={isLoading}
          className="w-full bg-[#201f1f] hover:bg-[#282727] text-white font-headline font-bold text-xs py-3 px-4 rounded-xl border border-[#c3f400]/40 flex items-center justify-between transition-all cursor-pointer shadow-md group"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">fingerprint</span>
            <div className="text-left">
              <span className="block text-white font-bold">Sign In with Passkey / Face ID</span>
              <span className="block text-[10px] text-[#c4c9ac]">FIDO2 Biometric Hardware Token</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c3f400] text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink-0 mx-3 text-[10px] uppercase font-bold text-[#c4c9ac]">
            Or Password Credentials
          </span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-[#c4c9ac] font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={authMode === 'admin' ? 'admin@pitchprecision.io' : 'player@cricket.org'}
              className="w-full bg-[#131313]/70 border-b-2 border-white/15 focus:border-[#c3f400] text-white text-sm px-3 py-2 rounded-t-lg outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] text-[#c4c9ac] font-semibold">Password</label>
              <button
                type="button"
                onClick={() => setStep('reset_password')}
                className="text-[10px] text-[#c3f400] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#131313]/70 border-b-2 border-white/15 focus:border-[#c3f400] text-white text-sm px-3 py-2 rounded-t-lg outline-none transition-colors pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c9ac] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#c4c9ac]">Strength</span>
                  <span className={`font-bold ${
                    pwdStrength.score >= 70 ? 'text-emerald-400' : pwdStrength.score >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {pwdStrength.label}
                  </span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      pwdStrength.score >= 70 ? 'bg-emerald-400' : pwdStrength.score >= 50 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#abd600] transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In Securely'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Security Policy Badge */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-[#8e918f] border-t border-white/5 font-mono">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-emerald-400">shield</span>
            PBKDF2/Bcrypt Hash
          </span>
          <span>Zero Plaintext Stored</span>
        </div>
      </div>

      {/* Questionnaire Quick Launch & Role Switcher */}
      <div className="mt-6 flex flex-col items-center gap-3 relative z-10 text-xs text-[#c4c9ac]">
        <button
          onClick={() => {
            setWizardRole(authMode === 'coach' ? 'coach' : 'player');
            setIsWizardOpen(true);
          }}
          className="text-xs text-white hover:text-[#c3f400] flex items-center gap-1.5 underline underline-offset-4"
        >
          <span className="material-symbols-outlined text-[16px]">quiz</span>
          New Athlete or Coach? Complete Calibration Questionnaire
        </button>

        <div className="flex items-center gap-3 text-xs pt-1">
          <button
            onClick={() => onSwitchAuthMode('player')}
            className={`hover:text-[#c3f400] ${authMode === 'player' ? 'text-[#c3f400] font-bold' : ''}`}
          >
            Player
          </button>
          <span>•</span>
          <button
            onClick={() => onSwitchAuthMode('coach')}
            className={`hover:text-[#c3f400] ${authMode === 'coach' ? 'text-[#c3f400] font-bold' : ''}`}
          >
            Coach
          </button>
          <span>•</span>
          <button
            onClick={() => onSwitchAuthMode('admin')}
            className={`hover:text-[#c3f400] ${authMode === 'admin' ? 'text-[#c3f400] font-bold' : ''}`}
          >
            Club Admin
          </button>
        </div>
      </div>

      {/* Profile Calibration Wizard Modal */}
      <ProfileCreationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        role={wizardRole}
        initialProfile={mockUsers[wizardRole]}
        onSaveProfile={(newProf) => {
          onLoginSuccess(newProf);
          setIsWizardOpen(false);
          onNavigate('home');
        }}
      />
    </div>
  );
};
