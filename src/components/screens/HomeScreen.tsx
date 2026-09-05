import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile, SessionRecord, ScreenType, DrillItem } from '../../types';
import { mockRecentSessions, mockUsers, mockDrills } from '../../data/mockData';
import { mockSmartDrillsVault } from '../../data/smartDrillsVaultData';
import { mockMasterclasses } from '../../data/tacticsAndPlannerData';
import { playBeep } from '../../utils/audioFeedback';
import { ThemeMode, getStoredTheme, setStoredTheme } from '../../utils/themeManager';
import { ThemeToggle } from '../ThemeToggle';
import { PlayerHomeView } from '../home/PlayerHomeView';
import { JuniorPlayerHomeView } from '../home/JuniorPlayerHomeView';
import { CoachHomeView } from '../home/CoachHomeView';
import { ParentHomeView } from '../home/ParentHomeView';
import { AdminHomeView } from '../home/AdminHomeView';

interface HomeScreenProps {
  currentUser?: UserProfile;
  user?: UserProfile;
  theme?: ThemeMode;
  onToggleTheme?: (theme: ThemeMode) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectSession?: (session: SessionRecord) => void;
  onSelectDrill?: (drill: DrillItem) => void;
  onOpenGuardianPortal?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  user,
  theme,
  onToggleTheme,
  onNavigate,
  onSelectSession,
  onSelectDrill,
  onOpenGuardianPortal,
  onOpenRoleSwitcher
}) => {
  const activeUser = currentUser || user || mockUsers.player;
  const [internalTheme, setInternalTheme] = useState<ThemeMode>(getStoredTheme);
  const activeTheme = theme || internalTheme;

  const handleToggle = (newTheme: ThemeMode) => {
    setInternalTheme(newTheme);
    setStoredTheme(newTheme);
    onToggleTheme?.(newTheme);
  };

  const [sessions] = useState<SessionRecord[]>(mockRecentSessions);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'drills' | 'masterclasses' | 'sessions'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Deduplicated list of drills
  const allDrills: DrillItem[] = useMemo(() => {
    const map = new Map<string, DrillItem>();
    mockDrills.forEach((d) => map.set(d.id, d));
    mockSmartDrillsVault.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return { drills: [], masterclasses: [], sessions: [], total: 0 };
    }

    const matchedDrills = allDrills.filter((d) => {
      return (
        d.title.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.subCategory?.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.coach?.toLowerCase().includes(query) ||
        d.tags?.some((t) => t.toLowerCase().includes(query))
      );
    });

    const matchedMasterclasses = mockMasterclasses.filter((mc) => {
      return (
        mc.title.toLowerCase().includes(query) ||
        mc.coach.toLowerCase().includes(query) ||
        mc.coachRole?.toLowerCase().includes(query) ||
        mc.badge?.toLowerCase().includes(query) ||
        mc.overview?.toLowerCase().includes(query) ||
        mc.keyTactics?.some(
          (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
        )
      );
    });

    const matchedSessions = sessions.filter((s) => {
      return (
        s.title.toLowerCase().includes(query) ||
        s.type.toLowerCase().includes(query) ||
        s.date.toLowerCase().includes(query) ||
        s.insight?.toLowerCase().includes(query) ||
        s.timing?.toLowerCase().includes(query)
      );
    });

    return {
      drills: matchedDrills,
      masterclasses: matchedMasterclasses,
      sessions: matchedSessions,
      total: matchedDrills.length + matchedMasterclasses.length + matchedSessions.length
    };
  }, [searchQuery, allDrills, sessions]);

  // Determine role rendering
  const isCoach = activeUser.role === 'coach';
  const isParent = activeUser.role === 'parent';
  const isAdmin =
    activeUser.role === 'admin' ||
    activeUser.role === 'club_admin' ||
    activeUser.role === 'security_admin' ||
    activeUser.role === 'platform_admin';
  const isPlayer = !isCoach && !isParent && !isAdmin; // default to player

  const roleLabel = isCoach ? 'Coach' : isParent ? 'Parent' : isAdmin ? 'Admin' : 'Player';
  const roleBadgeColor = isCoach
    ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/40'
    : isParent
    ? 'bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/40'
    : isAdmin
    ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/40'
    : 'bg-[#e9c400]/20 text-[#e9c400] border-[#e9c400]/40';

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-4xl mx-auto gap-6 pt-3 pb-28">
      {/* Top Header Bar */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[#c4c9ac]">Welcome back,</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border ${roleBadgeColor}`}>
                {roleLabel} View
              </span>
            </div>
            <h1 className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              <span>{activeUser.name}</span>
              {activeUser.tier && (
                <span className="text-[10px] text-[#8e918f] font-normal border border-white/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  {activeUser.tier}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Role Switcher Action */}
            {onOpenRoleSwitcher && (
              <button
                type="button"
                onClick={() => {
                  playBeep(750, 0.05);
                  onOpenRoleSwitcher();
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                title="Switch Role View"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Switch Role</span>
              </button>
            )}

            {/* Day / Night Mode Toggle */}
            <ThemeToggle
              id="home-day-night-toggle"
              theme={activeTheme}
              onToggle={handleToggle}
              variant="pill"
            />
          </div>
        </div>

        {/* Global Search Bar (Compact & Responsive) */}
        <div ref={searchContainerRef} className="relative z-30">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#c4c9ac] group-focus-within:text-[#c3f400] transition-colors text-[18px]">
                search
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={
                isCoach
                  ? 'Search player footage, assigned drills, or squad protocols...'
                  : isParent
                  ? 'Search training bays, coach notes, or safety guides...'
                  : 'Search drills, masterclasses, or bowling techniques...'
              }
              className="w-full bg-[#1b1b1b] text-white text-xs sm:text-sm rounded-2xl pl-10 pr-20 py-2.5 sm:py-3 outline-none border border-white/10 focus:border-[#c3f400]/50 focus:bg-[#222222] transition-all shadow-inner placeholder:text-[#c4c9ac]/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#c4c9ac] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Search Dropdown Overlay */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1b1b] border border-[#c3f400]/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn backdrop-blur-xl max-h-80 overflow-y-auto divide-y divide-white/5">
              <div className="px-4 py-2 bg-black/40 flex justify-between items-center text-xs text-[#c4c9ac]">
                <span>
                  Found <strong className="text-white">{searchResults.total}</strong> results for &ldquo;
                  <span className="text-[#c3f400]">{searchQuery}</span>&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[11px] text-[#c4c9ac] hover:text-white underline cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Drills Match */}
              {searchResults.drills.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-[11px] font-mono font-bold text-[#c3f400] uppercase">
                    Drills ({searchResults.drills.length})
                  </div>
                  {searchResults.drills.slice(0, 4).map((drill) => (
                    <button
                      key={drill.id}
                      onClick={() => {
                        playBeep(700, 0.05);
                        onSelectDrill?.(drill);
                        onNavigate('drill-details');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-xs text-white group cursor-pointer"
                    >
                      <span className="font-bold group-hover:text-[#c3f400] truncate">{drill.title}</span>
                      <span className="text-[11px] text-[#8e918f]">{drill.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROLE-SPECIFIC TAILORED VIEW RENDERING */}
      {/* ========================================================================= */}
      {isCoach && (
        <CoachHomeView
          user={activeUser}
          onNavigate={onNavigate}
          onSelectDrill={onSelectDrill}
        />
      )}

      {isParent && (
        <ParentHomeView
          user={activeUser}
          onNavigate={onNavigate}
          onOpenGuardianPortal={onOpenGuardianPortal}
        />
      )}

      {isAdmin && (
        <AdminHomeView
          user={activeUser}
          onNavigate={onNavigate}
          onOpenRoleSwitcher={onOpenRoleSwitcher}
        />
      )}

      {isPlayer && activeUser.isJunior && (
        <JuniorPlayerHomeView
          user={activeUser}
          sessions={sessions}
          onNavigate={onNavigate}
          onSelectSession={onSelectSession}
          onSelectDrill={onSelectDrill}
        />
      )}

      {isPlayer && !activeUser.isJunior && (
        <PlayerHomeView
          user={activeUser}
          sessions={sessions}
          onNavigate={onNavigate}
          onSelectSession={onSelectSession}
          onSelectDrill={onSelectDrill}
        />
      )}
    </div>
  );
};
