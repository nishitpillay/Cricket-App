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
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  user,
  onSelectRole,
  onSelectUser,
  onOpenAuth,
  onNavigate
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

  const roles: { role: UserRole; title: string; subtitle: string; authScreen: ScreenType }[] = [
    {
      role: 'player',
      title: 'Player Profile',
      subtitle: 'Alex Mercer (Level 42)',
      authScreen: 'auth-player'
    },
    {
      role: 'coach',
      title: 'Coach Profile',
      subtitle: 'Coach Mark Richardson',
      authScreen: 'auth-coach'
    },
    {
      role: 'admin',
      title: 'Admin Portal',
      subtitle: 'Telemetry Infrastructure & Node Monitor',
      authScreen: 'auth-admin'
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
        <div className="p-3 rounded-xl bg-white/5 border border-[#c3f400]/20 flex items-center gap-3 mb-4">
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
            </div>
            <p className="text-xs text-[#c4c9ac]">{activeUser.specialty}</p>
          </div>
        </div>

        {/* Switch Persona */}
        <p className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold mb-2">Switch Active Persona</p>
        <div className="flex flex-col gap-2 mb-5">
          {roles.map((item) => {
            const userObj = mockUsers[item.role];
            const isSelected = activeUser?.role === item.role;

            return (
              <button
                key={item.role}
                onClick={() => handleSwitchUser(userObj)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-[0_0_12px_rgba(195,244,0,0.15)]'
                    : 'bg-[#1c1b1b] border-white/5 text-[#c4c9ac] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={userObj.avatar}
                    alt={userObj.name}
                    className="w-9 h-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
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

        {/* Auth Screens Preview Shortcuts */}
        <p className="text-xs uppercase tracking-wider text-[#c4c9ac] font-bold mb-2">Authentication Screens</p>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((item) => (
            <button
              key={item.authScreen}
              onClick={() => handleOpenAuthView(item.role, item.authScreen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#c3f400]/50 hover:bg-white/10 text-center transition-all group"
            >
              <span className="text-[11px] font-bold text-white group-hover:text-[#c3f400] block truncate">
                {item.role.toUpperCase()}
              </span>
              <span className="text-[9px] text-[#c4c9ac] block">Login View</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
