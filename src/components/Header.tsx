import React from 'react';
import { Logo } from './Logo';
import { UserProfile, ScreenType } from '../types';
import { ThemeMode } from '../utils/themeManager';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title: string;
  currentUser?: UserProfile;
  user?: UserProfile;
  currentScreen?: ScreenType;
  theme?: ThemeMode;
  onToggleTheme?: (theme: ThemeMode) => void;
  onProfileClick?: () => void;
  onOpenProfile?: () => void;
  onGoogleSyncClick?: () => void;
  onGuardianPortalClick?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentUser,
  user,
  currentScreen,
  theme = 'night',
  onToggleTheme,
  onProfileClick,
  onOpenProfile,
  onGoogleSyncClick,
  onGuardianPortalClick,
  onBack,
  showBack = false
}) => {
  const activeUser = currentUser || user;
  const handleProfile = onProfileClick || onOpenProfile || (() => {});

  return (
    <header className="fixed top-0 w-full z-50 glass shadow-[0_1px_8px_rgba(0,0,0,0.3)] backdrop-blur-xl border-b border-white/5">
      <div className="h-16 px-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Back button"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <Logo size="sm" />
          )}

          <h1 className="font-headline font-semibold text-base sm:text-lg text-[#e5e2e1] tracking-tight truncate max-w-[200px] sm:max-w-md">
            {title}
          </h1>
        </div>

        {/* Right action: Google Integration + Theme Toggle + Role Pill + Avatar Trigger */}
        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <ThemeToggle
              id="header-day-night-toggle"
              theme={theme}
              onToggle={onToggleTheme}
              variant="compact"
            />
          )}

          {onGoogleSyncClick && (
            <button
              onClick={onGoogleSyncClick}
              title="Google Health & Location Hub"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#9cf0ff] hover:border-[#9cf0ff]/40 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">cloud_sync</span>
              <span className="hidden sm:inline">Google Sync</span>
            </button>
          )}

          {activeUser?.isJunior && (
            <button
              onClick={onGuardianPortalClick}
              title="Junior Safeguarded • Open Guardian Supervision Hub"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 hover:bg-[#4ade80]/25 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">shield_lock</span>
              <span className="hidden xs:inline">JUNIOR SAFEGUARDED</span>
            </button>
          )}

          {activeUser?.role === 'coach' && (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdb3c]/15 text-[#ffdb3c] border border-[#ffdb3c]/30">
              COACH MODE
            </span>
          )}
          {activeUser?.role === 'admin' && (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30">
              ADMIN
            </span>
          )}

          <button
            onClick={handleProfile}
            title="Profile & Role Switcher"
            className="relative p-0.5 rounded-full bg-[#c3f400] hover:ring-2 hover:ring-[#c3f400]/50 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#201f1f] flex items-center justify-center">
              {activeUser?.avatar ? (
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="material-symbols-outlined text-[#161e00] text-[18px]">person</span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#c3f400] ring-2 ring-[#131313]" />
          </button>
        </div>
      </div>
    </header>
  );
};

