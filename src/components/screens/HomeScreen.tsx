import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile, SessionRecord, ScreenType, DrillItem, TacticalMasterclass } from '../../types';
import { mockRecentSessions, mockUsers, mockDrills } from '../../data/mockData';
import { mockSmartDrillsVault } from '../../data/smartDrillsVaultData';
import { mockMasterclasses } from '../../data/tacticsAndPlannerData';
import { playBeep } from '../../utils/audioFeedback';
import { ThemeMode, getStoredTheme, setStoredTheme } from '../../utils/themeManager';
import { ThemeToggle } from '../ThemeToggle';

interface HomeScreenProps {
  currentUser?: UserProfile;
  user?: UserProfile;
  theme?: ThemeMode;
  onToggleTheme?: (theme: ThemeMode) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectSession?: (session: SessionRecord) => void;
  onSelectDrill?: (drill: DrillItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  user,
  theme,
  onToggleTheme,
  onNavigate,
  onSelectSession,
  onSelectDrill
}) => {
  const activeUser = currentUser || user || mockUsers.player;
  const [internalTheme, setInternalTheme] = useState<ThemeMode>(getStoredTheme);
  const activeTheme = theme || internalTheme;

  const handleToggle = (newTheme: ThemeMode) => {
    setInternalTheme(newTheme);
    setStoredTheme(newTheme);
    onToggleTheme?.(newTheme);
  };

  const [activeSpeedTab, setActiveSpeedTab] = useState<'week' | 'month'>('week');
  const [sessions, setSessions] = useState<SessionRecord[]>(mockRecentSessions);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'drills' | 'masterclasses' | 'sessions'>('all');
  const [showFilterPills, setShowFilterPills] = useState(false);
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

  const popularSuggestions = ['Cover Drive', 'Yorker', 'Death Overs', 'Spin Drift', 'Net Session'];

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-4xl mx-auto gap-6 pt-3 pb-28">
      {/* Welcome / Progress Overview */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <span className="text-xs sm:text-sm font-medium text-[#c4c9ac] block">
              Welcome back,
            </span>
            <h1 className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight">
              {activeUser.name}
            </h1>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Day / Night Mode Toggle Button at top right of Home Screen */}
            <ThemeToggle
              id="home-day-night-toggle"
              theme={activeTheme}
              onToggle={handleToggle}
              variant="pill"
            />

            <div className="flex flex-col items-end">
              <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#e9c400] mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
                LEVEL {activeUser.level}
              </span>
              <div className="h-1.5 w-20 bg-[#353534] rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#e9c400] to-[#ffdb3c] rounded-full shadow-[0_0_8px_#ffdb3c]"
                  style={{ width: `${activeUser.xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div ref={searchContainerRef} className="relative z-30">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#c4c9ac] group-focus-within:text-[#c3f400] transition-colors text-[20px]">
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
              placeholder="Search drills, masterclasses, or sessions..."
              className="w-full bg-[#1f1e1e] text-white text-sm rounded-2xl pl-12 pr-24 py-3.5 outline-none border border-white/10 focus:border-[#c3f400]/50 focus:bg-[#282727] focus:shadow-[0_0_15px_rgba(195,244,0,0.1)] transition-all shadow-inner placeholder:text-[#c4c9ac]/70"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilterPills(!showFilterPills)}
                className={`p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
                  showFilterPills || activeFilter !== 'all'
                    ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_8px_rgba(195,244,0,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-[#c4c9ac] hover:text-[#c3f400]'
                }`}
                title="Filter categories"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Category Pills */}
          {showFilterPills && (
            <div className="flex items-center gap-1.5 pt-2 px-1 overflow-x-auto hide-scrollbar animate-fadeIn">
              {(
                [
                  { id: 'all', label: 'All', count: searchResults.total },
                  { id: 'drills', label: 'Drills', count: searchResults.drills.length },
                  { id: 'masterclasses', label: 'Masterclasses', count: searchResults.masterclasses.length },
                  { id: 'sessions', label: 'Sessions', count: searchResults.sessions.length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-sm'
                      : 'bg-[#282727] text-[#c4c9ac] hover:text-white border border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {searchQuery && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeFilter === tab.id
                          ? 'bg-[#161e00]/20 text-[#161e00] font-mono'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Dropdown Results Overlay */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f1e1e] border border-[#c3f400]/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn backdrop-blur-xl">
              {searchQuery.trim().length > 0 ? (
                <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                  {/* Results Count Banner */}
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

                  {/* 1. Drills Section */}
                  {(activeFilter === 'all' || activeFilter === 'drills') &&
                    searchResults.drills.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#c3f400] flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[15px]">sports_cricket</span>
                          Drills ({searchResults.drills.length})
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          {searchResults.drills.slice(0, 5).map((drill) => (
                            <button
                              key={drill.id}
                              type="button"
                              onClick={() => {
                                playBeep(700, 0.05);
                                onSelectDrill?.(drill);
                                onNavigate('drill-details');
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors truncate">
                                    {drill.title}
                                  </div>
                                  <div className="text-[11px] text-[#c4c9ac] truncate">
                                    {drill.category} {drill.subCategory ? `• ${drill.subCategory}` : ''} • {drill.duration} • {drill.level}
                                  </div>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-0.5 transition-all text-[18px] shrink-0 ml-2">
                                arrow_forward
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 2. Tactical Masterclasses Section */}
                  {(activeFilter === 'all' || activeFilter === 'masterclasses') &&
                    searchResults.masterclasses.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#ffdb3c] flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[15px]">smart_display</span>
                          Masterclasses ({searchResults.masterclasses.length})
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          {searchResults.masterclasses.slice(0, 5).map((mc) => (
                            <button
                              key={mc.id}
                              type="button"
                              onClick={() => {
                                playBeep(700, 0.05);
                                onNavigate('masterclasses');
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#ffdb3c]/10 flex items-center justify-center text-[#ffdb3c] shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-headline font-bold text-sm text-white group-hover:text-[#ffdb3c] transition-colors truncate">
                                    {mc.title}
                                  </div>
                                  <div className="text-[11px] text-[#c4c9ac] truncate">
                                    {mc.coach} • {mc.badge || mc.duration}
                                  </div>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#ffdb3c] group-hover:translate-x-0.5 transition-all text-[18px] shrink-0 ml-2">
                                arrow_forward
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 3. Saved Sessions Section */}
                  {(activeFilter === 'all' || activeFilter === 'sessions') &&
                    searchResults.sessions.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#9cf0ff] flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[15px]">history</span>
                          Saved Sessions ({searchResults.sessions.length})
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          {searchResults.sessions.slice(0, 5).map((sess) => (
                            <button
                              key={sess.id}
                              type="button"
                              onClick={() => {
                                playBeep(700, 0.05);
                                onSelectSession?.(sess);
                                if (sess.title.toLowerCase().includes('batting')) {
                                  onNavigate('feedback');
                                } else {
                                  onNavigate('stats');
                                }
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#9cf0ff]/10 flex items-center justify-center text-[#9cf0ff] shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">sports</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-headline font-bold text-sm text-white group-hover:text-[#9cf0ff] transition-colors truncate">
                                    {sess.title}
                                  </div>
                                  <div className="text-[11px] text-[#c4c9ac] truncate">
                                    {sess.type} • Score: {sess.score} • {sess.date}
                                  </div>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#9cf0ff] group-hover:translate-x-0.5 transition-all text-[18px] shrink-0 ml-2">
                                arrow_forward
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* No Results Found */}
                  {searchResults.total === 0 && (
                    <div className="p-6 text-center flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c4c9ac]/50">
                        search_off
                      </span>
                      <p className="text-sm font-semibold text-white">
                        No matches found for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-[#c4c9ac] max-w-xs">
                        Try searching for a drill technique, masterclass, or session type.
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                        {popularSuggestions.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setSearchQuery(term)}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#c3f400] border border-white/10 transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state / Search Suggestions when focused without query */
                <div className="p-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#c4c9ac] mb-2 font-semibold flex items-center justify-between">
                    <span>Popular Searches</span>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[11px] text-[#c4c9ac] hover:text-white underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSuggestions.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          setIsSearchOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#c3f400]/10 text-xs text-[#e5e2e1] hover:text-[#c3f400] border border-white/10 hover:border-[#c3f400]/30 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Grid: Start Live Recording + Google Health & Venue Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              playBeep(880, 0.1);
              onNavigate('record');
            }}
            className="sm:col-span-2 relative overflow-hidden rounded-2xl bg-[#c3f400] text-[#161e00] shadow-[0_0_24px_rgba(195,244,0,0.35)] active:scale-[0.98] transition-all duration-200 group cursor-pointer border border-[#c3f400]"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            
            <div className="py-4 px-5 flex items-center justify-between relative z-10">
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-headline font-bold text-lg sm:text-xl tracking-tight leading-tight">
                  Start Live Recording
                </span>
                <span className="text-xs sm:text-sm font-medium opacity-85">
                  AI Camera Tracking & Telemetry
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#161e00]/12 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-[28px] text-[#161e00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  videocam
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              playBeep(750, 0.05);
              onNavigate('stats');
            }}
            className="relative overflow-hidden rounded-2xl bg-[#1f1e1e] hover:bg-[#282727] text-white border border-[#9cf0ff]/20 hover:border-[#9cf0ff]/50 active:scale-[0.98] transition-all duration-200 group cursor-pointer p-4 flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9cf0ff] uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#c3f400]">cloud_done</span>
                Google Fit Sync
              </div>
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-headline font-black text-2xl text-white">48</span>
                <span className="text-xs text-[#c4c9ac]">bpm RHR</span>
              </div>
              <span className="text-[10px] text-[#c4c9ac] block">8.3h Sleep • 10,420 Steps</span>
            </div>
          </button>
        </div>
      </section>

      {/* Weekly Progress Chart Widget */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg text-white">Weekly Progress</h3>
          <div className="flex items-center gap-1 bg-[#201f1f] p-1 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => setActiveSpeedTab('week')}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                activeSpeedTab === 'week' ? 'bg-[#c3f400] text-[#161e00]' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setActiveSpeedTab('month')}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                activeSpeedTab === 'month' ? 'bg-[#c3f400] text-[#161e00]' : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              30D
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-xl border border-white/10">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#c3f400]/10 rounded-full blur-[35px] -mt-10 -mr-10 pointer-events-none" />

          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#c3f400]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c3f400] text-[18px]">speed</span>
              </div>
              <span className="font-bold text-sm text-[#e5e2e1]">Avg Bowling Speed</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-extrabold text-2xl text-[#c3f400] drop-shadow-[0_0_8px_rgba(195,244,0,0.5)]">
                {activeSpeedTab === 'week' ? '138' : '136.4'}
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">km/h</span>
            </div>
          </div>

          {/* Glowing Vector Trajectory Chart */}
          <div className="h-28 w-full flex items-end justify-between gap-1 mt-1 z-10 relative">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Area gradient under curve */}
              <defs>
                <linearGradient id="speedArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c3f400" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c3f400" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={
                  activeSpeedTab === 'week'
                    ? 'M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z'
                    : 'M0,75 Q25,70 45,55 T80,50 T100,25 L100,100 L0,100 Z'
                }
                fill="url(#speedArea)"
              />
              <path
                d={
                  activeSpeedTab === 'week'
                    ? 'M0,80 Q20,60 40,70 T80,40 T100,20'
                    : 'M0,75 Q25,70 45,55 T80,50 T100,25'
                }
                fill="none"
                stroke="#c3f400"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(195,244,0,0.7)] transition-all duration-500"
              />
              {/* Data points */}
              <circle cx="40" cy={activeSpeedTab === 'week' ? "70" : "55"} r="4.5" fill="#131313" stroke="#c3f400" strokeWidth="2.5" className="animate-pulse" />
              <circle cx="80" cy={activeSpeedTab === 'week' ? "40" : "50"} r="4.5" fill="#131313" stroke="#c3f400" strokeWidth="2.5" className="animate-pulse" />
              <circle cx="100" cy={activeSpeedTab === 'week' ? "20" : "25"} r="5" fill="#c3f400" stroke="#131313" strokeWidth="2" className="animate-ping" />
            </svg>

            {/* Vertical grid lines */}
            <div className="h-full w-px bg-white/5" />
            <div className="h-full w-px bg-white/5" />
            <div className="h-full w-px bg-white/5" />
            <div className="h-full w-px bg-white/5" />
            <div className="h-full w-px bg-white/5" />
          </div>

          <div className="flex justify-between text-[#c4c9ac] text-xs font-semibold z-10 px-1">
            <span>Mon (134)</span>
            <span>Wed (136)</span>
            <span>Fri (139)</span>
            <span>Sun (142)</span>
          </div>
        </div>
      </section>

      {/* Recent Matches Scroll */}
      <section className="flex flex-col gap-3 -mx-4 sm:-mx-6">
        <div className="px-4 sm:px-6 flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg text-white">Recent Sessions</h3>
          <button
            onClick={() => onNavigate('stats')}
            className="text-xs font-bold text-[#c3f400] flex items-center gap-1 hover:underline underline-offset-4"
          >
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 px-4 sm:px-6 pb-2 snap-x snap-mandatory hide-scrollbar">
          {sessions.map((sess, idx) => (
            <div
              key={sess.id}
              onClick={() => {
                if (onSelectSession) onSelectSession(sess);
                if (sess.title.includes('Batting')) {
                  onNavigate('feedback');
                } else {
                  onNavigate('stats');
                }
              }}
              className="snap-center shrink-0 w-[290px] glass rounded-2xl overflow-hidden flex flex-col relative group cursor-pointer hover:border-[#c3f400]/40 transition-all border border-white/10 shadow-lg"
            >
              {/* Highlight bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  idx === 0 ? 'bg-[#c3f400]' : 'bg-[#c4c9ac]/40'
                }`}
              />

              <div className="p-4 flex flex-col gap-3 pl-5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {sess.type}
                  </span>
                  <span className="text-xs text-[#c4c9ac]">{sess.date}</span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-headline font-bold text-base text-white mb-0.5 group-hover:text-[#c3f400] transition-colors">
                      {sess.title}
                    </h4>
                    <p className="text-xs text-[#c4c9ac]">
                      {sess.deliveriesCount ? `${sess.deliveriesCount} deliveries` : sess.duration}
                    </p>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="w-11 h-11 rounded-full bg-[#201f1f] flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-[#c3f400]/20 relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
                      <path
                        className="text-[#353534]"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="100, 100"
                        strokeWidth="2.5"
                      />
                      <path
                        className={idx === 0 ? "text-[#c3f400] drop-shadow-[0_0_4px_rgba(195,244,0,0.8)]" : "text-white"}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={`${sess.score}, 100`}
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                    </svg>
                    <span className={`font-headline font-bold text-xs ${idx === 0 ? 'text-[#c3f400]' : 'text-white'}`}>
                      {sess.score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom footer strip */}
              <div className="bg-black/30 px-5 py-2 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-[#c4c9ac] font-medium">
                  {sess.topSpeed ? `Top Speed: ${sess.topSpeed} km/h` : sess.timing}
                </span>
                {sess.insight && (
                  <span className="text-[#e9c400] font-bold flex items-center gap-0.5">
                    {sess.insight}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Match Lab & Tactics Hub */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">psychology</span>
            <h3 className="font-headline font-bold text-lg text-white">Tactics & Motion Lab</h3>
          </div>
          <span className="text-[10px] font-mono text-[#ffdb3c] bg-[#ffdb3c]/10 px-2 py-0.5 rounded font-bold">
            PRO SUITE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* 1. Video Analysis Tools */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('video-analysis');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">slow_motion_video</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Slow-Mo Analysis
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Ghost Overlays & Ball Arc</p>
            </div>
          </button>

          {/* 2. Tactical Masterclasses */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('masterclasses');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ffdb3c]/10 flex items-center justify-center text-[#ffdb3c] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">smart_display</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#ffdb3c] transition-colors">
                Masterclasses
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Elite Coach Whiteboards</p>
            </div>
          </button>

          {/* 3. Scenario-Based Training */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('scenarios');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 flex items-center justify-center text-[#9cf0ff] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#9cf0ff] transition-colors">
                Match Scenarios
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Death Overs & Pitch Traps</p>
            </div>
          </button>

          {/* 4. Training Planner */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('planner');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Practice Planner
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">30 & 60-Min Protocols</p>
            </div>
          </button>

          {/* 5. Smart Drills Vault */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('drills-vault');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">fitness_center</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Drills Vault
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Search & Filter on Pitch</p>
            </div>
          </button>

          {/* 6. Digital Chalkboard */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('chalkboard');
            }}
            className="p-4 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ffb4ab]/10 flex items-center justify-center text-[#ffb4ab] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">draw</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#ffb4ab] transition-colors">
                Chalkboard
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Drag Fielders & Tactics</p>
            </div>
          </button>
        </div>
      </section>

      {/* Academy & Rules Quick Access Showcase */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">school</span>
            <h3 className="font-headline font-bold text-lg text-white">Academy & Guides</h3>
          </div>
          <button
            onClick={() => onNavigate('academy')}
            className="text-xs font-bold text-[#c3f400] hover:underline flex items-center gap-0.5"
          >
            <span>Explore All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('academy');
            }}
            className="p-3.5 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Rule Breakdowns
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">LBW, Powerplay, DLS</p>
            </div>
          </button>

          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('academy');
            }}
            className="p-3.5 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">translate</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Jargon Translator
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">360° Field & Terms</p>
            </div>
          </button>

          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('academy');
            }}
            className="p-3.5 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">sports_cricket</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Basic Drills
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Still Head Mechanics</p>
            </div>
          </button>

          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('academy');
            }}
            className="p-3.5 rounded-2xl bg-[#202020] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-white group-hover:text-[#c3f400] transition-colors">
                Gear Guides
              </h4>
              <p className="text-[10px] text-[#c4c9ac] line-clamp-1">Bat Sizer & Helmets</p>
            </div>
          </button>
        </div>
      </section>

      {/* Detailed Stats Prompt */}
      <section>
        <button
          onClick={() => onNavigate('stats')}
          className="w-full glass rounded-2xl p-4 flex items-center justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-r from-[#201f1f]/80 to-[#201f1f] border border-white/10 hover:border-[#c3f400]/40 transition-all text-left"
        >
          <div className="absolute inset-0 bg-[#c3f400]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#353534] flex items-center justify-center group-hover:bg-[#c3f400]/20 transition-colors">
              <span className="material-symbols-outlined text-[24px] text-[#c3f400]">analytics</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-base text-white">View Detailed Stats</span>
              <span className="text-xs text-[#c4c9ac]">Analyze biomechanics & zones</span>
            </div>
          </div>

          <span className="material-symbols-outlined text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-1 transition-all relative z-10">
            chevron_right
          </span>
        </button>
      </section>
    </div>
  );
};
