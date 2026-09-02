import React, { useState } from 'react';
import { playBeep, playBallImpact } from '../utils/audioFeedback';

interface ReauthModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionLabel: string; // e.g. "Changing Password", "Deleting Account"
  onSuccess: () => void;
}

export const ReauthModal: React.FC<ReauthModalProps> = ({
  isOpen,
  onClose,
  actionLabel,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required for step-up verification.');
      return;
    }

    setIsLoading(true);
    setError(null);
    playBeep(750, 0.08);

    try {
      // Import secureFetch to authenticate step-up
      const { secureFetch } = await import('../utils/authSecurityManager');
      const res = await secureFetch('/api/auth/reauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        playBallImpact();
        setPassword('');
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Incorrect password. Identity verification failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Failed to contact authentication gateway.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171717] border border-red-500/40 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <span className="material-symbols-outlined text-[24px]">lock_person</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-white">Step-Up Verification</h3>
            <p className="text-[11px] text-[#c4c9ac]">Confirm ownership before execution</p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
          <p className="text-[#e5e2e1]">
            You are attempting a restricted operation: <span className="text-[#c3f400] font-bold">{actionLabel}</span>.
          </p>
          <p className="text-[#c4c9ac] text-[11px]">
            Please enter your password to elevate your administrative privileges for the next 5 minutes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider mb-1">
              Account Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/60 transition-all font-mono"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] font-mono">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                playBeep(600, 0.04);
                onClose();
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-[#c4c9ac] hover:text-white hover:bg-white/5 text-xs font-bold font-headline transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 font-headline font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Confirm Identity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
