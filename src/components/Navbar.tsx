import React from 'react';
import { ScreenType, UserProfile } from '../types';
import { playBeep } from '../utils/audioFeedback';

interface NavbarProps {
  currentScreen: ScreenType;
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onBack?: () => void;
  showBack?: boolean;
}

interface NavItemConfig {
  id: ScreenType;
  label: string;
  icon: string;
  aliases?: ScreenType[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  currentUser,
  onNavigate,
  onBack,
  showBack
}) => {
  // Determine role classification
  const isCoach = currentUser?.role === 'coach';
  const isParent = currentUser?.role === 'parent';
  const isJunior = currentUser?.isJunior;
  const isPlatformAdmin =
    currentUser?.role === 'platform_admin' ||
    currentUser?.role === 'security_admin' ||
    currentUser?.adminSubCategory === 'Platform Admin';
  const isAcademyAdmin =
    (currentUser?.role === 'admin' || currentUser?.role === 'club_admin') && !isPlatformAdmin;

  // Generate role-specific navigation items adhering to the Role-to-Feature Matrix
  const getNavItems = (): NavItemConfig[] => {
    if (isPlatformAdmin) {
      return [
        { id: 'home', label: 'HOME', icon: 'home' },
        {
          id: 'profiles',
          label: 'USERS',
          icon: 'badge',
          aliases: ['profiles']
        },
        {
          id: 'security-settings',
          label: 'SECURITY',
          icon: 'shield',
          aliases: ['security-settings', 'encryption-governance', 'mobile-security']
        },
        {
          id: 'cloud-infrastructure',
          label: 'INFRA',
          icon: 'cloud_sync',
          aliases: ['cloud-infrastructure', 'source-code-security', 'mobile-bridge']
        },
        {
          id: 'work',
          label: 'MORE',
          icon: 'apps',
          aliases: ['work', 'more', 'support', 'help', 'terms']
        }
      ];
    }

    if (isAcademyAdmin) {
      return [
        { id: 'home', label: 'HOME', icon: 'home' },
        {
          id: 'profiles',
          label: 'ROSTERS',
          icon: 'badge',
          aliases: ['profiles']
        },
        {
          id: 'planner',
          label: 'BAYS',
          icon: 'calendar_month',
          aliases: ['planner']
        },
        {
          id: 'privacy-governance',
          label: 'AUDITS',
          icon: 'verified_user',
          aliases: ['privacy-governance', 'security-gate-1', 'security-gate-2']
        },
        {
          id: 'work',
          label: 'MORE',
          icon: 'apps',
          aliases: ['work', 'more', 'support', 'help', 'terms']
        }
      ];
    }

    if (isCoach) {
      return [
        { id: 'home', label: 'HOME', icon: 'home' },
        {
          id: 'video-analysis',
          label: 'MOTION LAB',
          icon: 'slow_motion_video',
          aliases: ['video-analysis', 'record']
        },
        {
          id: 'drills-vault',
          label: 'DRILLS',
          icon: 'fitness_center',
          aliases: ['drills-vault', 'drills', 'drill-details', 'drill-practice']
        },
        {
          id: 'chalkboard',
          label: 'TACTICS',
          icon: 'gesture',
          aliases: ['chalkboard', 'scenarios', 'masterclasses']
        },
        {
          id: 'work',
          label: 'MORE',
          icon: 'apps',
          aliases: ['work', 'more', 'planner', 'feedback', 'profiles']
        }
      ];
    }

    if (isParent) {
      return [
        { id: 'home', label: 'HOME', icon: 'home' },
        {
          id: 'feedback',
          label: 'COACH NOTES',
          icon: 'rate_review',
          aliases: ['feedback']
        },
        {
          id: 'planner',
          label: 'SCHEDULE',
          icon: 'calendar_month',
          aliases: ['planner']
        },
        {
          id: 'privacy-governance',
          label: 'SAFETY',
          icon: 'shield',
          aliases: ['privacy-governance']
        },
        {
          id: 'work',
          label: 'MORE',
          icon: 'apps',
          aliases: ['work', 'more', 'profiles', 'support', 'help']
        }
      ];
    }

    if (isJunior) {
      return [
        { id: 'home', label: 'HOME', icon: 'home' },
        {
          id: 'drills-vault',
          label: 'MY DRILLS',
          icon: 'fitness_center',
          aliases: ['drills-vault', 'drills', 'drill-details', 'drill-practice']
        },
        {
          id: 'record',
          label: 'RECORD',
          icon: 'videocam',
          aliases: ['record']
        },
        {
          id: 'stats',
          label: 'MY STATS',
          icon: 'radar',
          aliases: ['stats']
        },
        {
          id: 'work',
          label: 'MORE',
          icon: 'apps',
          aliases: ['work', 'more', 'feedback', 'scenarios']
        }
      ];
    }

    // Default: Senior Player
    return [
      { id: 'home', label: 'HOME', icon: 'home' },
      {
        id: 'record',
        label: 'CAMERA',
        icon: 'videocam',
        aliases: ['record']
      },
      {
        id: 'video-analysis',
        label: 'MOTION LAB',
        icon: 'slow_motion_video',
        aliases: ['video-analysis']
      },
      {
        id: 'drills-vault',
        label: 'DRILLS',
        icon: 'fitness_center',
        aliases: ['drills-vault', 'drills', 'drill-details', 'drill-practice']
      },
      {
        id: 'work',
        label: 'MORE',
        icon: 'apps',
        aliases: ['work', 'more', 'stats', 'feedback', 'masterclasses', 'scenarios', 'planner', 'chalkboard']
      }
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 w-full z-50 glass pb-safe border-t border-[#c3f400]/15 backdrop-blur-2xl">
      <div className="h-16 max-w-lg mx-auto flex justify-around items-center px-1">
        {/* Back button when stack has history and not at home */}
        {showBack && (
          <button
            onClick={() => {
              playBeep(550, 0.04);
              onBack?.();
            }}
            className="flex flex-col items-center justify-center gap-0.5 w-12 sm:w-14 py-1 text-[#c4c9ac] hover:text-white transition-all cursor-pointer"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-[9px] tracking-wider uppercase leading-none font-medium">BACK</span>
          </button>
        )}

        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.aliases && item.aliases.includes(currentScreen));

          return (
            <button
              key={item.id}
              onClick={() => {
                playBeep(650, 0.04);
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 sm:w-16 py-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#c3f400] font-bold scale-105'
                  : 'text-[#c4c9ac] hover:text-[#e5e2e1]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px] transition-transform duration-200"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400"
                  }}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]" />
                )}
              </div>
              <span className="text-[9px] tracking-wider uppercase leading-none font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
