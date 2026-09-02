import React from 'react';
import { UserProfile, UserRole, ScreenType } from '../types';
import { mockUsers } from '../data/mockData';

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

  const personas: { id: string; userObj: UserProfile; title: string; subtitle: string; tag: string; tagColor: string }[] = [
    {
      id: 'player',
      userObj: mockUsers.player,
      title: 'Senior Player Profile',
      subtitle: 'Devang Dalvi (Level 42, 23 yrs)',
      tag: 'ELITE PRO',
      tagColor: 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/30'
    },
    {
      id: 'kiyara',
      userObj: mockUsers.kiyara,
      title: 'Academy Junior Prodigy',
      subtitle: 'Kiyara Pillay (Age 15 • Supervised by Arin & Roshan)',
      tag: 'SAFEGUARDED',
      tagColor: 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30'
    },
    {
      id: 'junior',
      userObj: mockUsers.junior,
      title: 'Junior Player Profile',
      subtitle: 'Liam Chen (Age 14 • Supervised)',
      tag: 'SAFEGUARDED',
      tagColor: 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30'
    },
    {
      id: 'coach',
      userObj: mockUsers.coach,
      title: 'Lead Bowling Coach',
      subtitle: 'Arin Mishra (ECB Level 4)',
      tag: 'DBS CLEARED',
      tagColor: 'bg-[#9cf0ff]/20 text-[#9cf0ff] border-[#9cf0ff]/30'
    },
    {
      id: 'coach_roshan',
      userObj: mockUsers.coach_roshan,
      title: 'Master Batting & Spin Coach',
      subtitle: 'Roshan Srilanka (ICC Level 3)',
      tag: 'DBS CLEARED',
      tagColor: 'bg-[#ffdb3c]/20 text-[#ffdb3c] border-[#ffdb3c]/30'
    },
    {
      id: 'admin',
      userObj: mockUsers.admin,
      title: 'Safeguarding & Admin Root',
      subtitle: 'Telemetry Infrastructure & Incident DSL',
      tag: 'SYSTEM ROOT',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#201f1f] border border-white/10 rounded-2xl p-5 shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">account_circle</span>
            <h3 className="font-headline font-bold text-lg text-white">Profile & Roles</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current active user badge */}
        <div className="p-3 rounded-xl bg-white/5 border border-[#c3f400]/20 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-12 h-12 rounded-full object-cover border border-[#c3f400]"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-white">{activeUser.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#c3f400]/20 text-[#c3f400] uppercase">
                  Active
                </span>
                {activeUser.isJunior && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#4ade80]/20 text-[#4ade80] uppercase">
                    Junior Safe
                  </span>
                )}
              </div>
              <p className="text-xs text-[#c4c9ac]">{activeUser.specialty}</p>
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

        {/* Switch Persona */}
        <p className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold mb-2">Switch Active Persona</p>
        <div className="flex flex-col gap-2 mb-4">
          {personas.map((item) => {
            const isSelected = activeUser?.id === item.userObj.id || (activeUser.name === item.userObj.name);

            return (
              <button
                key={item.id}
                onClick={() => handleSwitchUser(item.userObj)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-[0_0_12px_rgba(195,244,0,0.15)]'
                    : 'bg-[#1c1b1b] border-white/5 text-[#c4c9ac] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.userObj.avatar}
                    alt={item.userObj.name}
                    className="w-9 h-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#c4c9ac]">{item.subtitle}</p>
                  </div>
                </div>
                {isSelected ? (
                  <span className="material-symbols-outlined text-[#c3f400] text-[20px]">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-gray-500 text-[18px]">chevron_right</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Safeguarding & Security Actions Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {onOpenGuardianPortal && (
            <button
              onClick={() => {
                onClose();
                onOpenGuardianPortal();
              }}
              className="p-2 rounded-xl bg-[#4ade80]/15 border border-[#4ade80]/30 hover:bg-[#4ade80]/25 text-[10px] font-bold text-[#4ade80] flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">family_restroom</span>
              <span>Guardian</span>
            </button>
          )}

          {onOpenReportModal && (
            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-[10px] font-bold text-red-300 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">flag</span>
              <span>Report</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate('security-settings');
              }}
              className="p-2 rounded-xl bg-[#9cf0ff]/15 border border-[#9cf0ff]/30 hover:bg-[#9cf0ff]/25 text-[10px] font-bold text-[#9cf0ff] flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>Security</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate('privacy-governance');
              }}
              className="p-2 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 hover:bg-[#c3f400]/25 text-[10px] font-bold text-[#c3f400] flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Privacy</span>
            </button>
          )}
        </div>

        {/* Auth Screens Preview Shortcuts */}
        <p className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold mb-2">Authentication Screens</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { role: 'player' as const, authScreen: 'auth-player' as const, label: 'PLAYER' },
            { role: 'coach' as const, authScreen: 'auth-coach' as const, label: 'COACH' },
            { role: 'admin' as const, authScreen: 'auth-admin' as const, label: 'ADMIN' }
          ].map((item) => (
            <button
              key={item.authScreen}
              onClick={() => handleOpenAuthView(item.role, item.authScreen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#c3f400]/50 hover:bg-white/10 text-center transition-all group cursor-pointer"
            >
              <span className="text-[11px] font-bold text-white group-hover:text-[#c3f400] block truncate">
                {item.label}
              </span>
              <span className="text-[9px] text-[#c4c9ac] block">Login View</span>
            </button>
          ))}
        </div>

        {/* Google Hub Integration Option */}
        <button
          onClick={() => {
            onClose();
            if (onOpenAuth) onOpenAuth('player');
            if (onNavigate) onNavigate('auth-player');
          }}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-green-500/10 to-yellow-500/10 border border-white/10 hover:border-white/30 text-xs font-headline font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google Account & Health Integration</span>
        </button>
      </div>
    </div>
  );
};
