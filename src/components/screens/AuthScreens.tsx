import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../../types';
import { mockUsers } from '../../data/mockData';
import { playBeep } from '../../utils/audioFeedback';

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
  const [adminId, setAdminId] = useState('admin@pitchprecision.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (role: 'player' | 'coach' | 'admin') => {
    setIsLoading(true);
    playBeep(880, 0.12);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(mockUsers[role]);
      onNavigate('home');
    }, 600);
  };

  // ==========================================
  // 1. PLAYER AUTH SCREEN (Image 24.png)
  // ==========================================
  if (authMode === 'player') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="authGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(195, 244, 0, 0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#authGrid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#201f1f] border border-white/10 flex items-center justify-center mb-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c3f400]/20 to-transparent opacity-100" />
            <span className="material-symbols-outlined text-[#c3f400] text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_cricket
            </span>
          </div>

          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Elevate Your <br />
            <span className="text-[#c3f400]">Game.</span>
          </h1>
          <p className="text-sm text-[#c4c9ac] max-w-xs mx-auto leading-relaxed">
            Precision analytics for professional cricketers. Master every pitch, analyze every swing.
          </p>
        </div>

        {/* Action Form */}
        <div className="relative z-10 w-full flex flex-col gap-3">
          <button
            onClick={() => handleAuth('player')}
            disabled={isLoading}
            className="w-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-[#abd600] transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)] active:scale-95 cursor-pointer border border-[#c3f400]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" />
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.1H2.15V16.94C3.96 20.53 7.69 23 12 23Z" />
              <path d="M5.82 14.1C5.59 13.43 5.46 12.73 5.46 12C5.46 11.27 5.59 10.57 5.82 9.9V7.06H2.15C1.41 8.54 1 10.22 1 12C1 13.78 1.41 15.46 2.15 16.94L5.82 14.1Z" />
              <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.03L19.36 3.87C17.46 2.1 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.9C6.7 7.31 9.13 5.38 12 5.38Z" />
            </svg>
            Sign in with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink-0 mx-3 text-[#c4c9ac] text-[11px] font-bold uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth('player');
            }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-[#201f1f]/70 border-b-2 border-white/15 focus:border-[#c3f400] text-white text-sm px-4 pt-4 pb-2 rounded-t-xl outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2a2a2a] text-white font-headline font-bold text-sm py-3.5 px-6 rounded-xl border border-white/10 hover:bg-[#353534] transition-colors cursor-pointer"
            >
              Continue with Email
            </button>
          </form>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-8 text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1c1b1b] border border-white/10 shadow-sm">
            <div className="flex -space-x-2">
              <img
                className="w-7 h-7 rounded-full border-2 border-[#131313] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZJTE7hpkKwzx0bhgmeOK_KHFUcAk1Y4mh__NlgWKb1wyZsdXJgo5ECE0bmGhf8mWLKG_xkNStzDfGrjqBN8mDF2e7YUYOTcDjPNM3iHeFQtyL-FeCA6HHeY2t3GpayzXxR9OYnpIgARfHTXjuDXGzUkS2Zon1AyaoQvlaL0oOvjoueSq6bcAQbFjgqJY5PeviU7WcOnatLg_c3H39RWAZY8schSZPx433bIexd1UiOs6Jf_WpyoGZ"
                alt="Player"
                referrerPolicy="no-referrer"
              />
              <img
                className="w-7 h-7 rounded-full border-2 border-[#131313] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwlzgv7q8_6UmCiMwI3NAO7wg1KIG1wEwRT-rLYEx2v3lS7ykVrf_38NKCJDtgA5qavl2Dlsr4K2v36yYt6m6OrA9ej92tjHZRNTHU4e4KnBI7Mz0rKDqw3-zbr-LyXD5yqrUSea8bfG-2Yse9M0lt_3duoYArOBGMYrFHv_JJ-tUpFh6c140Fq0wbIrcP8eKcgwfXzbtUOQ43fi8DLtmvhgAyFzXV8PCiZiQr8uMRwQd2-hOvlX7k"
                alt="Player"
                referrerPolicy="no-referrer"
              />
              <img
                className="w-7 h-7 rounded-full border-2 border-[#131313] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiECofbx3bs-0WbvlKeTvy-6NbLwKLvZ_hNqGk3UpjcNLB_DTw5r3sCtQcgKc31xs3MBFN-tLI6Jl5DWHm-f1jPaD4_FRG_xjkShEz-J7uyvLSl2_8Fps2yKkrSy8bXTTtMV3YDdKNIQjmut6d0M-d0_meuuz6WWYiHdh0vauhXxX28wv5-SI3YtM5RR6jYZAJ7P4dfizW1wGlopNTNOKIqc5lGZM8N4sV-WADN29GQpqSYPktOq_i"
                alt="Player"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs text-[#c4c9ac]">
              Join <span className="text-[#c3f400] font-bold">10,000+</span> players refining their pitch.
            </span>
          </div>
        </div>

        {/* Switch Role Links */}
        <div className="mt-6 flex justify-center gap-3 text-xs text-[#c4c9ac] relative z-10">
          <button
            onClick={() => onSwitchAuthMode('coach')}
            className="hover:text-[#c3f400] underline underline-offset-4"
          >
            Coach Login
          </button>
          <span>•</span>
          <button
            onClick={() => onSwitchAuthMode('admin')}
            className="hover:text-[#c3f400] underline underline-offset-4"
          >
            Admin Portal
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. COACH AUTH SCREEN (Image 20.png)
  // ==========================================
  if (authMode === 'coach') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[#201f1f] rounded-2xl flex items-center justify-center mb-3 border border-white/10 shadow-lg relative">
            <span className="material-symbols-outlined text-3xl text-[#c3f400]" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl text-white mb-1 tracking-tight">
            Pitch Precision
          </h1>
          <p className="text-xs text-[#c4c9ac] max-w-[260px]">
            High-stakes analysis for elite performance.
          </p>
        </div>

        {/* Coach Card */}
        <div className="bg-[#201f1f]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl relative">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c3f400] p-1 shadow-[0_0_20px_rgba(195,244,0,0.3)]">
                <img
                  alt="Coach Avatar"
                  className="w-full h-full object-cover rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#131313] rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#c3f400] rounded-full shadow-[0_0_6px_#c3f400]" />
              </div>
            </div>

            <h2 className="font-headline font-bold text-xl text-white mb-0.5">Welcome Back, Coach</h2>
            <p className="text-xs text-[#c4c9ac] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] inline-block" />
              Ready to review team data
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => handleAuth('coach')}
              className="w-full bg-white text-black font-headline font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gray-100 transition-colors cursor-pointer shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink-0 mx-3 text-[10px] uppercase font-bold text-[#c4c9ac]">Or</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <button
              onClick={() => handleAuth('coach')}
              className="w-full bg-[#353534]/60 border border-white/10 text-white font-headline font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#353534] transition-colors cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Continue with Email
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex flex-col items-center gap-3 relative z-10 text-xs text-[#c4c9ac]">
          <button className="hover:text-white underline underline-offset-4">
            Forgot your password?
          </button>
          <button
            onClick={() => onSwitchAuthMode('player')}
            className="px-4 py-2 rounded-full bg-[#201f1f] border border-white/10 hover:border-[#c3f400] text-[#c4c9ac] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
            Not a coach? Switch roles
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. ADMIN PORTAL AUTH SCREEN (Image 22.png)
  // ==========================================
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center px-4 sm:px-6 py-8 relative overflow-hidden max-w-md mx-auto">
      <div className="relative z-10 flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 mb-3 rounded-2xl bg-[#201f1f] flex items-center justify-center p-3 shadow-[0_0_30px_rgba(195,244,0,0.2)] border border-[#c3f400]/40 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#c3f400]" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="14" stroke="#c3f400" strokeWidth="6" />
            <path d="M68 22 L76 30 L42 74 L30 74 L30 62 Z" fill="#ffffff" />
            <path d="M72 18 L80 26 L76 30 L68 22 Z" fill="#c3f400" stroke="#c3f400" strokeWidth="2" />
            <path d="M10 50 L32 50 L38 32 L46 68 L54 44 L60 56 L72 56 L88 50" stroke="#c3f400" strokeWidth="7" strokeLinecap="round" />
            <circle cx="76" cy="62" r="7" fill="#c3f400" />
          </svg>
        </div>
        <h1 className="font-headline font-extrabold text-2xl text-white tracking-tight">
          PITCH <span className="text-[#c3f400]">PRECISION</span>
        </h1>
        <h2 className="text-xs font-bold text-[#c4c9ac] tracking-widest uppercase mt-0.5">
          ADMIN PORTAL
        </h2>
      </div>

      {/* Admin Login Glass Card */}
      <div className="w-full bg-[#1c1b1b]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="p-5 sm:p-6">
          <button
            onClick={() => handleAuth('admin')}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-xl font-headline font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm mb-4 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-[#c4c9ac] uppercase font-bold tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth('admin');
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-xs text-[#c4c9ac] font-semibold block mb-1">Admin ID</label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-[#131313]/60 border-b-2 border-white/10 rounded-t-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c3f400] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-[#c4c9ac] font-semibold block mb-1">Security Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131313]/60 border-b-2 border-white/10 rounded-t-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c3f400] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c9ac] hover:text-[#c3f400]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1 pb-2">
              <button type="button" className="text-xs text-[#c3f400] hover:underline">
                Emergency Access?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c3f400] text-[#161e00] py-3.5 px-4 rounded-xl font-headline font-extrabold text-sm hover:bg-[#abd600] transition-colors shadow-[0_0_15px_rgba(195,244,0,0.3)] flex items-center justify-center gap-2 cursor-pointer border border-[#c3f400]"
            >
              Authenticate
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Security Warning Footer */}
        <div className="bg-[#201f1f]/90 px-4 py-3 border-t border-white/5 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">
            warning
          </span>
          <p className="text-[11px] text-[#c4c9ac] leading-relaxed">
            Authorized access only. Technical monitoring and telemetry logging are active on this node.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => onSwitchAuthMode('player')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c4c9ac] hover:text-[#c3f400] py-2 px-4 rounded-full border border-white/10 bg-[#201f1f]/50 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">sports_cricket</span>
          Switch to Player / Coach Login
        </button>
      </div>
    </div>
  );
};
