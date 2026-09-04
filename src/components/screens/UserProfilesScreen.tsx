import React, { useState, useMemo } from 'react';
import {
  UserProfile,
  UserMainCategory,
  PlayerSubCategory,
  CoachSubCategory,
  AdminSubCategory,
  ScreenType
} from '../../types';
import { allMockUserProfiles } from '../../data/mockData';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface UserProfilesScreenProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenWizard: (role: 'player' | 'coach', profile?: UserProfile) => void;
  onOpenGuardianPortal?: () => void;
}

export const UserProfilesScreen: React.FC<UserProfilesScreenProps> = ({
  currentUser,
  onSelectUser,
  onNavigate,
  onOpenWizard,
  onOpenGuardianPortal
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<UserMainCategory>('Players');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);

  // Define the exact subcategories requested by user
  const playerSubCategories: PlayerSubCategory[] = [
    'Senior players',
    'Junior players',
    'Junior premiere'
  ];

  const coachSubCategories: CoachSubCategory[] = [
    'Batting coach',
    'Bowling coach',
    'Fielding coach',
    'Wicket-keeper coach',
    'Fitness training Coach',
    'All-rounder coach',
    'Physio coach',
    'Umpires'
  ];

  const adminSubCategories: AdminSubCategory[] = [
    'Platform Admin',
    'Club Admin',
    'Safeguarding Admin'
  ];

  // Helper to resolve main category for each user profile
  const resolveMainCategory = (user: UserProfile): UserMainCategory => {
    if (user.mainCategory) return user.mainCategory;
    if (user.role === 'coach') return 'Coach';
    if (user.role === 'admin' || user.role === 'club_admin' || user.role === 'security_admin' || user.role === 'platform_admin') return 'Admins';
    return 'Players';
  };

  // Helper to resolve sub category for each user profile
  const resolveSubCategory = (user: UserProfile): string => {
    if (user.playerSubCategory) return user.playerSubCategory;
    if (user.coachSubCategory) return user.coachSubCategory;
    if (user.adminSubCategory) return user.adminSubCategory;
    if (user.role === 'coach') return 'Bowling coach';
    if (user.isJunior) return 'Junior players';
    if (user.role === 'player') return 'Senior players';
    return 'Platform Admin';
  };

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return allMockUserProfiles.filter((user) => {
      const mainCat = resolveMainCategory(user);
      if (mainCat !== selectedMainCategory) return false;

      const subCat = resolveSubCategory(user);
      if (selectedSubCategory !== 'ALL' && subCat !== selectedSubCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = user.name.toLowerCase().includes(query);
        const matchSpecialty = user.specialty?.toLowerCase().includes(query);
        const matchSubCat = subCat.toLowerCase().includes(query);
        const matchTier = user.tier?.toLowerCase().includes(query);
        if (!matchName && !matchSpecialty && !matchSubCat && !matchTier) return false;
      }

      return true;
    });
  }, [selectedMainCategory, selectedSubCategory, searchQuery]);

  // Counts by main category
  const counts = useMemo(() => {
    const pCount = allMockUserProfiles.filter((u) => resolveMainCategory(u) === 'Players').length;
    const cCount = allMockUserProfiles.filter((u) => resolveMainCategory(u) === 'Coach').length;
    const aCount = allMockUserProfiles.filter((u) => resolveMainCategory(u) === 'Admins').length;
    return { Players: pCount, Coach: cCount, Admins: aCount };
  }, []);

  const handleCategorySwitch = (cat: UserMainCategory) => {
    playBeep(600, 0.04);
    setSelectedMainCategory(cat);
    setSelectedSubCategory('ALL');
  };

  const handleSubCategorySwitch = (subCat: string) => {
    playBeep(750, 0.03);
    setSelectedSubCategory(subCat);
  };

  const handleSwitchUser = (user: UserProfile) => {
    playCelebration();
    onSelectUser(user);
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#111111] text-white flex flex-col pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#171717]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              title="Return Home"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">badge</span>
                <h1 className="text-xl sm:text-2xl font-headline font-black tracking-tight text-white">
                  User Profiles & Accreditation
                </h1>
              </div>
              <p className="text-xs text-[#c4c9ac]">
                Structured directory across Players, Coach, and Admins sub-categories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search profiles or credentials..."
                className="w-full bg-[#201f1f] border border-white/15 focus:border-[#c3f400] text-xs text-white pl-9 pr-3 py-2 rounded-xl outline-none transition-all placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Create / Add Profile Button */}
            <button
              onClick={() => {
                const roleToOpen = selectedMainCategory === 'Coach' ? 'coach' : 'player';
                onOpenWizard(roleToOpen);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#abd600] text-[#111800] font-headline font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(195,244,0,0.25)] cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>New Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Active Profile Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1d2211] via-[#1a1b1a] to-[#1a1f22] border border-[#c3f400]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111] flex items-center justify-center text-[10px] text-white">
                <span className="material-symbols-outlined text-[12px]">check</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#c3f400]">
                  Active Session Profile
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
                  {currentUser.tier || 'ACTIVE'}
                </span>
              </div>
              <h2 className="text-lg font-headline font-extrabold text-white">{currentUser.name}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[#c4c9ac]">
                <span className="font-semibold text-white">
                  {resolveMainCategory(currentUser)} • {resolveSubCategory(currentUser)}
                </span>
                <span>•</span>
                <span>{currentUser.specialty}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentUser.isJunior && onOpenGuardianPortal && (
              <button
                onClick={onOpenGuardianPortal}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                <span>Guardian Portal</span>
              </button>
            )}
            <button
              onClick={() => {
                const role = currentUser.role === 'coach' ? 'coach' : 'player';
                onOpenWizard(role, currentUser);
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Edit My Profile</span>
            </button>
          </div>
        </div>

        {/* 1. Main Categories Navigation Tabs */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#8e918f] font-bold mb-2 block">
            Select Main Category
          </label>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {/* Players Tab */}
            <button
              onClick={() => handleCategorySwitch('Players')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                selectedMainCategory === 'Players'
                  ? 'bg-gradient-to-br from-[#c3f400]/20 to-transparent border-[#c3f400] text-white shadow-[0_0_20px_rgba(195,244,0,0.15)]'
                  : 'bg-[#1a1a1a] border-white/10 text-[#c4c9ac] hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`material-symbols-outlined text-[24px] ${
                  selectedMainCategory === 'Players' ? 'text-[#c3f400]' : 'text-gray-400'
                }`}>
                  sports_cricket
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedMainCategory === 'Players'
                    ? 'bg-[#c3f400] text-[#111800]'
                    : 'bg-white/10 text-gray-300'
                }`}>
                  {counts.Players} Profiles
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-headline font-bold text-white leading-tight">Players</h3>
              <p className="text-[11px] text-[#8e918f] mt-0.5 line-clamp-1">
                Senior players, Junior players, Junior premiere
              </p>
            </button>

            {/* Coach Tab */}
            <button
              onClick={() => handleCategorySwitch('Coach')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                selectedMainCategory === 'Coach'
                  ? 'bg-gradient-to-br from-[#00d2ff]/20 to-transparent border-[#00d2ff] text-white shadow-[0_0_20px_rgba(0,210,255,0.15)]'
                  : 'bg-[#1a1a1a] border-white/10 text-[#c4c9ac] hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`material-symbols-outlined text-[24px] ${
                  selectedMainCategory === 'Coach' ? 'text-[#00d2ff]' : 'text-gray-400'
                }`}>
                  sports
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedMainCategory === 'Coach'
                    ? 'bg-[#00d2ff] text-[#002b36]'
                    : 'bg-white/10 text-gray-300'
                }`}>
                  {counts.Coach} Profiles
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-headline font-bold text-white leading-tight">Coach</h3>
              <p className="text-[11px] text-[#8e918f] mt-0.5 line-clamp-1">
                Batting, Bowling, Fielding, Physio, Umpires & more
              </p>
            </button>

            {/* Admins Tab */}
            <button
              onClick={() => handleCategorySwitch('Admins')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                selectedMainCategory === 'Admins'
                  ? 'bg-gradient-to-br from-purple-500/20 to-transparent border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-[#1a1a1a] border-white/10 text-[#c4c9ac] hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`material-symbols-outlined text-[24px] ${
                  selectedMainCategory === 'Admins' ? 'text-purple-400' : 'text-gray-400'
                }`}>
                  admin_panel_settings
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedMainCategory === 'Admins'
                    ? 'bg-purple-400 text-[#220738]'
                    : 'bg-white/10 text-gray-300'
                }`}>
                  {counts.Admins} Profiles
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-headline font-bold text-white leading-tight">Admins</h3>
              <p className="text-[11px] text-[#8e918f] mt-0.5 line-clamp-1">
                Platform Admin, Club Admin, Safeguarding Admin
              </p>
            </button>
          </div>
        </div>

        {/* 2. Sub-Category Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8e918f] font-bold">
              In {selectedMainCategory} Sub-Category
            </label>
            <span className="text-xs text-[#c4c9ac]">
              Showing {filteredProfiles.length} of{' '}
              {allMockUserProfiles.filter((u) => resolveMainCategory(u) === selectedMainCategory).length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* "All" chip */}
            <button
              onClick={() => handleSubCategorySwitch('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedSubCategory === 'ALL'
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-[#1e1e1e] text-[#c4c9ac] border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              All {selectedMainCategory}
            </button>

            {/* Dynamic chips based on main category */}
            {selectedMainCategory === 'Players' &&
              playerSubCategories.map((subCat) => {
                const isSelected = selectedSubCategory === subCat;
                return (
                  <button
                    key={subCat}
                    onClick={() => handleSubCategorySwitch(subCat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#c3f400] text-[#111800] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                        : 'bg-[#1e1e1e] text-[#c4c9ac] border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {subCat === 'Senior players' && <span className="material-symbols-outlined text-[15px]">military_tech</span>}
                    {subCat === 'Junior players' && <span className="material-symbols-outlined text-[15px]">child_care</span>}
                    {subCat === 'Junior premiere' && <span className="material-symbols-outlined text-[15px]">diamond</span>}
                    <span>{subCat}</span>
                  </button>
                );
              })}

            {selectedMainCategory === 'Coach' &&
              coachSubCategories.map((subCat) => {
                const isSelected = selectedSubCategory === subCat;
                return (
                  <button
                    key={subCat}
                    onClick={() => handleSubCategorySwitch(subCat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#00d2ff] text-[#002b36] border-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                        : 'bg-[#1e1e1e] text-[#c4c9ac] border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {subCat === 'Batting coach' && <span className="material-symbols-outlined text-[15px]">sports_cricket</span>}
                    {subCat === 'Bowling coach' && <span className="material-symbols-outlined text-[15px]">sports_baseball</span>}
                    {subCat === 'Fielding coach' && <span className="material-symbols-outlined text-[15px]">sports_handball</span>}
                    {subCat === 'Wicket-keeper coach' && <span className="material-symbols-outlined text-[15px]">pan_tool</span>}
                    {subCat === 'Fitness training Coach' && <span className="material-symbols-outlined text-[15px]">fitness_center</span>}
                    {subCat === 'All-rounder coach' && <span className="material-symbols-outlined text-[15px]">sync_alt</span>}
                    {subCat === 'Physio coach' && <span className="material-symbols-outlined text-[15px]">medical_services</span>}
                    {subCat === 'Umpires' && <span className="material-symbols-outlined text-[15px]">gavel</span>}
                    <span>{subCat}</span>
                  </button>
                );
              })}

            {selectedMainCategory === 'Admins' &&
              adminSubCategories.map((subCat) => {
                const isSelected = selectedSubCategory === subCat;
                return (
                  <button
                    key={subCat}
                    onClick={() => handleSubCategorySwitch(subCat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-400 text-[#220738] border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-[#1e1e1e] text-[#c4c9ac] border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {subCat === 'Platform Admin' && <span className="material-symbols-outlined text-[15px]">terminal</span>}
                    {subCat === 'Club Admin' && <span className="material-symbols-outlined text-[15px]">domain</span>}
                    {subCat === 'Safeguarding Admin' && <span className="material-symbols-outlined text-[15px]">verified_user</span>}
                    <span>{subCat}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* 3. Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => {
            const isActive = currentUser.id === profile.id || currentUser.name === profile.name;
            const subCat = resolveSubCategory(profile);
            const mainCat = resolveMainCategory(profile);

            return (
              <div
                key={profile.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-[#1c2214] border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.15)]'
                    : 'bg-[#181818] border-white/10 hover:border-white/25 hover:bg-[#1f1f1f]'
                }`}
              >
                {/* Active Indicator Top-Right */}
                {isActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#c3f400] text-[#111800] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111800] animate-pulse" />
                    <span>Active Now</span>
                  </div>
                )}

                <div>
                  {/* Top Avatar & Core Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className={`w-14 h-14 rounded-full object-cover border-2 ${
                          mainCat === 'Players'
                            ? 'border-[#c3f400]'
                            : mainCat === 'Coach'
                            ? 'border-[#00d2ff]'
                            : 'border-purple-400'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {profile.isJunior && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-[#111] flex items-center justify-center text-[10px] text-white" title="Junior Safeguarded">
                          <span className="material-symbols-outlined text-[12px]">shield</span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 pr-14">
                      <h4 className="font-headline font-extrabold text-base text-white leading-tight">
                        {profile.name}
                      </h4>

                      {/* Sub-Category Badge */}
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                          subCat === 'Senior players'
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : subCat === 'Junior players'
                            ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                            : subCat === 'Junior premiere'
                            ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40'
                            : subCat === 'Umpires'
                            ? 'bg-rose-400/20 text-rose-300 border-rose-400/40'
                            : subCat === 'Physio coach'
                            ? 'bg-teal-400/20 text-teal-300 border-teal-400/40'
                            : 'bg-blue-400/20 text-blue-300 border-blue-400/40'
                        }`}>
                          {subCat}
                        </span>
                      </div>

                      <p className="text-xs text-[#c4c9ac] mt-1.5 line-clamp-2">
                        {profile.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Highlights / Bio / Stats Snippet */}
                  <div className="bg-[#121212] rounded-xl p-2.5 border border-white/5 mb-3 space-y-1.5">
                    {profile.coachProfile && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8e918f]">Specialization</span>
                        <span className="text-white font-semibold truncate max-w-[170px]">
                          {profile.coachProfile.specialization}
                        </span>
                      </div>
                    )}

                    {profile.coachProfile?.historicStats && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8e918f]">Track Record</span>
                        <span className="text-emerald-400 font-bold">
                          {profile.coachProfile.historicStats.winRatePct}% Win • {profile.coachProfile.historicStats.trophiesWon} Cups
                        </span>
                      </div>
                    )}

                    {profile.playerProfile && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8e918f]">Style & Order</span>
                        <span className="text-white font-semibold truncate max-w-[170px]">
                          {profile.playerProfile.playingStyle}
                        </span>
                      </div>
                    )}

                    {profile.playerProfile?.battingDetails && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8e918f]">Batting</span>
                        <span className="text-[#c3f400] font-semibold">
                          {profile.playerProfile.battingDetails.orderPosition}
                        </span>
                      </div>
                    )}

                    {profile.officialCertifications && profile.officialCertifications.length > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8e918f]">Accreditation</span>
                        <span className="text-amber-300 font-bold">
                          {profile.officialCertifications[0]}
                        </span>
                      </div>
                    )}

                    {profile.isJunior && profile.guardianInfo && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          Guardian Consent
                        </span>
                        <span className="text-gray-400 font-mono text-[10px]">
                          {profile.guardianInfo.relationship}: {profile.guardianInfo.guardianName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {!isActive ? (
                    <button
                      onClick={() => handleSwitchUser(profile)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-[#c3f400] hover:text-[#111800] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">switch_account</span>
                      <span>Switch Profile</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-2 px-3 rounded-xl bg-[#c3f400]/20 text-[#c3f400] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#c3f400]/30">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Current Active</span>
                    </div>
                  )}

                  <button
                    onClick={() => setInspectingUser(profile)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                    title="Inspect Profile Credentials"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>

                  <button
                    onClick={() => {
                      const r = profile.role === 'coach' ? 'coach' : 'player';
                      onOpenWizard(r, profile);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                    title="Edit Profile"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-white/10 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-gray-500 text-5xl mb-3">search_off</span>
            <h3 className="text-lg font-headline font-bold text-white mb-1">No profiles match filter</h3>
            <p className="text-xs text-[#8e918f] max-w-sm mb-4">
              We couldn't find any user profiles under "{selectedSubCategory}" with search term "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubCategory('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Inspecting Profile Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#1a1a1a] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">verified_user</span>
                <h3 className="font-headline font-bold text-lg text-white">Profile Credentials & Dossier</h3>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <img
                src={inspectingUser.avatar}
                alt={inspectingUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#c3f400]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-headline font-black text-lg text-white">{inspectingUser.name}</h4>
                <div className="flex items-center gap-2 text-xs text-[#c4c9ac] mt-0.5">
                  <span className="px-2 py-0.5 rounded font-bold bg-[#c3f400]/20 text-[#c3f400]">
                    {resolveMainCategory(inspectingUser)}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-white">{resolveSubCategory(inspectingUser)}</span>
                </div>
                <p className="text-xs text-[#8e918f] mt-1">{inspectingUser.tier || 'STANDARD ROSTER'}</p>
              </div>
            </div>

            {/* Coach Profile Details */}
            {inspectingUser.coachProfile && (
              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                  <p className="text-xs font-mono uppercase text-[#8e918f] font-bold mb-1">Coaching Bio</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{inspectingUser.coachProfile.bioSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-[10px] uppercase font-mono text-[#8e918f]">Experience</p>
                    <p className="text-base font-bold text-white">{inspectingUser.coachProfile.yearsOfExperience} Years</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-[10px] uppercase font-mono text-[#8e918f]">Win Rate</p>
                    <p className="text-base font-bold text-emerald-400">
                      {inspectingUser.coachProfile.historicStats?.winRatePct}%
                    </p>
                  </div>
                </div>

                {inspectingUser.coachProfile.accreditations && (
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-xs font-mono uppercase text-[#8e918f] font-bold mb-2">Accreditations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectingUser.coachProfile.accreditations.map((acc, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Player Profile Details */}
            {inspectingUser.playerProfile && (
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-[10px] uppercase font-mono text-[#8e918f]">Age & Style</p>
                    <p className="text-xs font-bold text-white">
                      {inspectingUser.playerProfile.age} yrs • {inspectingUser.playerProfile.playingStyle}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-[10px] uppercase font-mono text-[#8e918f]">Primary Role</p>
                    <p className="text-xs font-bold text-[#c3f400]">
                      {inspectingUser.playerProfile.primaryCategory}
                    </p>
                  </div>
                </div>

                {inspectingUser.playerProfile.battingDetails && (
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-xs font-mono uppercase text-[#8e918f] font-bold mb-1">Batting Profile</p>
                    <p className="text-xs text-white">
                      {inspectingUser.playerProfile.battingDetails.handedness} • {inspectingUser.playerProfile.battingDetails.orderPosition}
                    </p>
                    {inspectingUser.playerProfile.battingDetails.keyStrengths && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {inspectingUser.playerProfile.battingDetails.keyStrengths.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300 border border-white/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {inspectingUser.playerProfile.bowlingDetails && (
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                    <p className="text-xs font-mono uppercase text-[#8e918f] font-bold mb-1">Bowling Profile</p>
                    <p className="text-xs text-white">
                      {inspectingUser.playerProfile.bowlingDetails.techniqueStyle} ({inspectingUser.playerProfile.bowlingDetails.speedCategory})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Stock Delivery: {inspectingUser.playerProfile.bowlingDetails.stockDelivery}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Official Umpire / Admin Certifications */}
            {inspectingUser.officialCertifications && inspectingUser.officialCertifications.length > 0 && (
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 mb-4">
                <p className="text-xs font-mono uppercase text-[#8e918f] font-bold mb-2">Official Certifications</p>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingUser.officialCertifications.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">military_tech</span>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleSwitchUser(inspectingUser);
                  setInspectingUser(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#c3f400] text-[#111800] text-xs font-headline font-bold hover:bg-[#abd600] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">switch_account</span>
                <span>Select as Active Profile</span>
              </button>
              <button
                onClick={() => setInspectingUser(null)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
