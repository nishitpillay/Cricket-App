import React, { useState } from 'react';
import { UserProfile, UserRole, ScreenType, UserMainCategory } from '../types';
import { mockUsers, allMockUserProfiles } from '../data/mockData';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  user?: UserProfile;
  onSelectRole?: (role: UserRole) => void;
  onSelectUser?: (user: UserProfile) => void;
  onOpenAuth?: (mode: UserRole) => void;
  onNavigate?: (screen: ScreenType) => void;
  onOpenWizard?: () => void;
  onOpenGuardianPortal?: () => void;
  onOpenReportModal?: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  user,
  onSelectRole,
  onSelectUser,
  onOpenAuth,
  onNavigate,
  onOpenWizard,
  onOpenGuardianPortal,
  onOpenReportModal
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<UserMainCategory>('Players');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const activeUser = currentUser || user || mockUsers.player;

  const handleSwitchUser = (userObj: UserProfile) => {
    if (onSelectUser) onSelectUser(userObj);
    if (onSelectRole) onSelectRole(userObj.role);
    onClose();
  };

  const handleOpenAuthView = (role: UserRole, authScreen: ScreenType) => {
    if (onOpenAuth) onOpenAuth(role);
    if (onNavigate) onNavigate(authScreen);
    onClose();
  };

  // Helper to resolve main category
  const resolveMainCategory = (u: UserProfile): UserMainCategory => {
    if (u.mainCategory) return u.mainCategory;
    if (u.role === 'parent') return 'Parents';
    if (u.role === 'coach') return 'Coach';
    if (u.role === 'admin' || u.role === 'club_admin' || u.role === 'security_admin' || u.role === 'platform_admin') return 'Admins';
    return 'Players';
  };

  // Helper to resolve sub category
  const resolveSubCategory = (u: UserProfile): string => {
    if (u.playerSubCategory) return u.playerSubCategory;
    if (u.coachSubCategory) return u.coachSubCategory;
    if (u.parentSubCategory) return u.parentSubCategory;
    if (u.adminSubCategory) return u.adminSubCategory;
    if (u.role === 'parent') return 'Primary Guardian';
    if (u.role === 'coach') return 'Bowling coach';
    if (u.isJunior) return 'Junior players';
    if (u.role === 'player') return 'Senior players';
    return 'Platform Admin';
  };

  // Subcategories for current active tab
  const subCategoryOptions: Record<UserMainCategory, string[]> = {
    Players: ['Senior players', 'Junior players', 'Junior premiere'],
    Coach: [
      'Batting coach',
      'Bowling coach',
      'Fielding coach',
      'Wicket-keeper coach',
      'Fitness training Coach',
      'All-rounder coach',
      'Physio coach',
      'Umpires'
    ],
    Parents: ['Primary Guardian', 'Safeguarding Sponsor', 'Family Member'],
    Admins: ['Platform Admin', 'Club Admin', 'Safeguarding Admin']
  };

  // Filter users by selected main category and subcategory
  const categoryUsers = allMockUserProfiles.filter((u) => {
    const mainCat = resolveMainCategory(u);
    if (mainCat !== activeCategoryTab) return false;
    if (activeSubFilter !== 'ALL') {
      return resolveSubCategory(u) === activeSubFilter;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#201f1f] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">account_circle</span>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-white">User Profiles & Rosters</h3>
              <p className="text-[11px] text-[#c4c9ac]">Players, Coaches & Administrative Personas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current active user badge */}
        <div className="p-3 rounded-xl bg-white/5 border border-[#c3f400]/20 flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-11 h-11 rounded-full object-cover border border-[#c3f400]"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-white">{activeUser.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#c3f400]/20 text-[#c3f400] uppercase">
                  Active
                </span>
                {activeUser.isJunior && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#4ade80]/20 text-[#4ade80] uppercase">
                    Junior Safe
                  </span>
                )}
              </div>
              <p className="text-xs text-[#c4c9ac]">
                {resolveMainCategory(activeUser)} • {resolveSubCategory(activeUser)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeUser.isJunior && onOpenGuardianPortal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGuardianPortal();
                }}
                className="p-2 rounded-xl bg-[#4ade80]/20 hover:bg-[#4ade80]/30 text-[#4ade80] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Guardian Supervision Hub"
              >
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
              </button>
            )}

            {onOpenWizard && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWizard();
                }}
                className="p-2 rounded-xl bg-[#c3f400]/20 hover:bg-[#c3f400]/30 text-[#c3f400] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Edit Cricket Profile"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Main Category Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-[#141414] p-1 rounded-xl mb-2.5 shrink-0">
          {(['Players', 'Coach', 'Parents', 'Admins'] as UserMainCategory[]).map((cat) => {
            const isTabActive = activeCategoryTab === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategoryTab(cat);
                  setActiveSubFilter('ALL');
                }}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isTabActive
                    ? cat === 'Players'
                      ? 'bg-[#c3f400] text-[#111800] shadow'
                      : cat === 'Coach'
                      ? 'bg-[#00d2ff] text-[#002b36] shadow'
                      : cat === 'Parents'
                      ? 'bg-[#4ade80] text-[#052e16] shadow'
                      : 'bg-purple-400 text-[#220738] shadow'
                    : 'text-[#8e918f] hover:text-white'
                }`}
              >
                {cat === 'Players' && <span className="material-symbols-outlined text-[14px]">sports_cricket</span>}
                {cat === 'Coach' && <span className="material-symbols-outlined text-[14px]">sports</span>}
                {cat === 'Parents' && <span className="material-symbols-outlined text-[14px]">family_restroom</span>}
                {cat === 'Admins' && <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>}
                <span className="truncate">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Sub-Category Pills for Active Tab */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none shrink-0">
          <button
            onClick={() => setActiveSubFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all border cursor-pointer ${
              activeSubFilter === 'ALL'
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-[#8e918f] border-white/10 hover:text-white'
            }`}
          >
            All {activeCategoryTab}
          </button>
          {subCategoryOptions[activeCategoryTab].map((sub) => {
            const isFilterActive = activeSubFilter === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubFilter(sub)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all border cursor-pointer ${
                  isFilterActive
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-white/5 text-[#8e918f] border-white/10 hover:text-white'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* 3. Persona List (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 mb-3">
          {categoryUsers.map((item) => {
            const isSelected = activeUser?.id === item.id || activeUser.name === item.name;
            const subCategoryLabel = resolveSubCategory(item);

            return (
              <button
                key={item.id}
                onClick={() => handleSwitchUser(item)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-[0_0_12px_rgba(195,244,0,0.15)]'
                    : 'bg-[#1c1b1b] border-white/5 text-[#c4c9ac] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-white leading-tight truncate">{item.name}</p>
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase border bg-white/10 text-gray-200 border-white/20">
                        {subCategoryLabel}
                      </span>
                      {item.isJunior && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Junior
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8e918f] truncate mt-0.5">{item.specialty}</p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[#c3f400] text-[20px]">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-gray-500 text-[18px]">chevron_right</span>
                  )}
                </div>
              </button>
            );
          })}

          {categoryUsers.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500">
              No profiles found in this subcategory.
            </div>
          )}
        </div>

        {/* 4. Full Profiles Screen Shortcut */}
        {onNavigate && (
          <button
            onClick={() => {
              onClose();
              onNavigate('profiles');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#c3f400]/20 via-[#00d2ff]/20 to-purple-500/20 border border-white/15 hover:border-white/30 text-xs font-headline font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer mb-2.5 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">badge</span>
            <span>Open Full User Profiles & Roster Directory</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}

        {/* 5. Governance & Quick Actions */}
        <div className="grid grid-cols-5 gap-1.5 shrink-0">
          {onOpenGuardianPortal && (
            <button
              onClick={() => {
                onClose();
                onOpenGuardianPortal();
              }}
              className="p-1.5 rounded-xl bg-[#4ade80]/15 border border-[#4ade80]/30 hover:bg-[#4ade80]/25 text-[9px] font-bold text-[#4ade80] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">family_restroom</span>
              <span>Guardian</span>
            </button>
          )}

          {onOpenReportModal && (
            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="p-1.5 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-[9px] font-bold text-red-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">flag</span>
              <span>Report</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate('security-settings');
              }}
              className="p-1.5 rounded-xl bg-[#9cf0ff]/15 border border-[#9cf0ff]/30 hover:bg-[#9cf0ff]/25 text-[9px] font-bold text-[#9cf0ff] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">shield</span>
              <span>Security</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate('privacy-governance');
              }}
              className="p-1.5 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 hover:bg-[#c3f400]/25 text-[9px] font-bold text-[#c3f400] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>Privacy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
