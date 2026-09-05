/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, UserProfile, DrillItem } from './types';
import { mockUsers, mockDrills } from './data/mockData';
import { ThemeMode, getStoredTheme, setStoredTheme, applyTheme } from './utils/themeManager';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { RecordScreen } from './components/screens/RecordScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { DrillsScreen } from './components/screens/DrillsScreen';
import { DrillDetailsScreen } from './components/screens/DrillDetailsScreen';
import { DrillPracticeScreen } from './components/screens/DrillPracticeScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { AcademyScreen } from './components/screens/AcademyScreen';
import { AuthScreens } from './components/screens/AuthScreens';
import { SecurityAndSessionsScreen } from './components/screens/SecurityAndSessionsScreen';
import { DataPrivacyGovernanceScreen } from './components/privacy/DataPrivacyGovernanceScreen';
import { DataEncryptionGovernanceScreen } from './components/encryption/DataEncryptionGovernanceScreen';
import { MobileSecurityGovernanceScreen } from './components/screens/MobileSecurityGovernanceScreen';
import { SourceCodeSecurityScreen } from './components/screens/SourceCodeSecurityScreen';
import { MobileBridgeScreen } from './components/screens/MobileBridgeScreen';
import { SecurityGateOneScreen } from './components/screens/SecurityGateOneScreen';
import { CloudInfrastructureScreen } from './components/screens/CloudInfrastructureScreen';
import { SecurityGateTwoScreen } from './components/screens/SecurityGateTwoScreen';
import { StoreAssetsPrivacyScreen } from './components/screens/StoreAssetsPrivacyScreen';
import { TestFlightInternalTestingScreen } from './components/screens/TestFlightInternalTestingScreen';
import { WorkScreen } from './components/screens/WorkScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { UserProfilesScreen } from './components/screens/UserProfilesScreen';
import { SupportScreen } from './components/screens/SupportScreen';
import { PlaceholderScreen } from './components/screens/PlaceholderScreen';
import { VideoAnalysisTool } from './components/videoAnalysis/VideoAnalysisTool';
import { TacticalMasterclasses } from './components/tactics/TacticalMasterclasses';
import { ScenarioTraining } from './components/tactics/ScenarioTraining';
import { TrainingPlanner } from './components/planner/TrainingPlanner';
import { DigitalChalkboard } from './components/chalkboard/DigitalChalkboard';
import { SmartDrillsVault } from './components/drills/SmartDrillsVault';
import { GoogleIntegrationModal } from './components/GoogleIntegrationModal';
import { ProfileCreationWizardModal } from './components/profile/ProfileCreationWizardModal';
import { GuardianSupervisionPortal } from './components/safeguarding/GuardianSupervisionPortal';
import { SafeguardingReportModal } from './components/safeguarding/SafeguardingReportModal';
import { JuniorSafetyBanner } from './components/safeguarding/JuniorSafetyBanner';
import { GoogleFitnessData, GoogleCricketVenueLocation } from './types';
import { playBeep } from './utils/audioFeedback';
import { ErrorBoundary } from './components/ErrorBoundary';

const PARENT_SCREEN_MAP: Partial<Record<ScreenType, ScreenType>> = {
  'video-analysis': 'work',
  'record': 'work',
  'drills-vault': 'work',
  'scenarios': 'work',
  'stats': 'work',
  'planner': 'work',
  'drills': 'work',
  
  'drill-details': 'drills-vault',
  'drill-practice': 'drill-details',

  'masterclasses': 'scenarios',
  'chalkboard': 'scenarios',

  'academy': 'more',
  'profiles': 'more',
  'feedback': 'more',
  'support': 'more',
  'help': 'more',
  'terms': 'more',
  'security-settings': 'more',

  'privacy-governance': 'support',
  'encryption-governance': 'support',
  'mobile-security': 'support',
  'source-code-security': 'support',
  'mobile-bridge': 'support',
  'security-gate-1': 'support',
  'cloud-infrastructure': 'support',
  'security-gate-2': 'support',
  'store-assets-privacy': 'support',
  'testflight-internal-testing': 'support',

  'auth-player': 'home',
  'auth-coach': 'home',
  'auth-admin': 'home',
};

const buildHierarchy = (screen: ScreenType): ScreenType[] => {
  const stack: ScreenType[] = [screen];
  let current = screen;
  while (PARENT_SCREEN_MAP[current]) {
    current = PARENT_SCREEN_MAP[current]!;
    stack.unshift(current);
  }
  // Ensure 'home' is at the root if not already, to guarantee we can always back out to home
  if (stack[0] !== 'home' && screen !== 'home') {
    stack.unshift('home');
  }
  return stack;
};

export default function App() {
  const [historyStack, setHistoryStack] = useState<ScreenType[]>(['home']);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers.player);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isGuardianPortalOpen, setIsGuardianPortalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [syncedFitness, setSyncedFitness] = useState<GoogleFitnessData | null>(null);
  const [detectedVenue, setDetectedVenue] = useState<GoogleCricketVenueLocation | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<DrillItem>(mockDrills[0]);
  const [authMode, setAuthMode] = useState<'player' | 'coach' | 'admin'>('player');
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme && customEvent.detail.theme !== theme) {
        setTheme(customEvent.detail.theme);
      }
    };

    window.addEventListener('pitch_precision_theme_change', onThemeChange);
    return () => window.removeEventListener('pitch_precision_theme_change', onThemeChange);
  }, [theme]);

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleNavigate = (screen: ScreenType) => {
    playBeep(650, 0.06);
    const newStack = buildHierarchy(screen);
    setHistoryStack(newStack);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    playBeep(550, 0.05);
    setHistoryStack(prev => {
      if (prev.length <= 1) return prev;
      const newStack = prev.slice(0, -1);
      setCurrentScreen(newStack[newStack.length - 1]);
      return newStack;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: 'player' | 'coach' | 'admin') => {
    setCurrentUser(mockUsers[role]);
    setIsRoleModalOpen(false);
  };

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsRoleModalOpen(false);
  };

  // Compute header title and back button
  let headerTitle = '';
  let showBack = historyStack.length > 1;

  switch (currentScreen) {
    case 'home':
      headerTitle = '';
      showBack = false;
      break;
    case 'work':
      headerTitle = 'Workspace';
      showBack = false;
      break;
    case 'more':
      headerTitle = 'More Options';
      showBack = false;
      break;
    case 'support':
      headerTitle = 'Support & Security';
      break;
    case 'help':
      headerTitle = 'Help Center';
      break;
    case 'terms':
      headerTitle = 'Terms of Service';
      break;
    case 'record':
      headerTitle = 'Live Camera Record';
      break;
    case 'video-analysis':
      headerTitle = 'Video Analysis & Slow-Mo';
      break;
    case 'stats':
      headerTitle = 'Data & Wagon Wheels';
      break;
    case 'drills':
      headerTitle = 'Drills Library';
      break;
    case 'drills-vault':
      headerTitle = 'Smart Drills Vault';
      break;
    case 'scenarios':
      headerTitle = 'Scenario-Based Training';
      break;
    case 'masterclasses':
      headerTitle = 'Tactical Masterclasses';
      break;
    case 'planner':
      headerTitle = 'Training Planner';
      break;
    case 'chalkboard':
      headerTitle = 'Digital Chalkboard';
      break;
    case 'academy':
      headerTitle = 'Academy & Rules Breakdown';
      break;
    case 'drill-details':
      headerTitle = 'Drill Details';
      break;
    case 'drill-practice':
      headerTitle = 'Live Practice';
      break;
    case 'feedback':
      headerTitle = 'Session Feedback';
      break;
    case 'security-settings':
      headerTitle = 'Security & Sessions';
      break;
    case 'privacy-governance':
      headerTitle = 'Privacy & Classification';
      break;
    case 'encryption-governance':
      headerTitle = 'Data Encryption & KMS';
      break;
    case 'mobile-security':
      headerTitle = 'Mobile App Security';
      break;
    case 'auth-player':
    case 'auth-coach':
    case 'auth-admin':
      headerTitle = 'Sign In';
      break;
    default:
      headerTitle = '';
  }

  const isAuthScreen = currentScreen.startsWith('auth');
  const hideNavbar = currentScreen === 'record' || currentScreen === 'drill-practice' || isAuthScreen;

  return (
    <div className={`min-h-screen ${theme === 'day' ? 'bg-[#f8fafc] text-[#0f172a] day-mode' : 'bg-[#131313] text-[#e5e2e1]'} font-body antialiased flex flex-col selection:bg-[#c3f400] selection:text-[#161e00]`}>
      {/* Top Persistent Header */}
      <Header
        title={headerTitle}
        showBack={showBack}
        onBack={handleBack}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onProfileClick={() => setIsRoleModalOpen(true)}
        onGoogleSyncClick={() => setIsGoogleModalOpen(true)}
        onGuardianPortalClick={() => setIsGuardianPortalOpen(true)}
      />

      {/* Main Screen Content View */}
      <main className="flex-1 w-full flex flex-col relative pt-16">
        {/* Offline Ground Banner */}
        <OfflineBanner />

        {/* Junior Safeguarding Status Banner */}
        {currentUser.isJunior && (
          <div className="px-4 sm:px-6 pt-2">
            <JuniorSafetyBanner
              user={currentUser}
              onOpenPortal={() => setIsGuardianPortalOpen(true)}
              onReportConcern={() => setIsReportModalOpen(true)}
            />
          </div>
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onNavigate={handleNavigate}
            onSelectDrill={(drill) => {
              setSelectedDrill(drill);
              handleNavigate('drill-details');
            }}
            onOpenGuardianPortal={() => setIsGuardianPortalOpen(true)}
            onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
          />
        )}
        
        {currentScreen === 'work' && (
          <WorkScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenGuardianPortal={() => setIsGuardianPortalOpen(true)}
          />
        )}

        {currentScreen === 'more' && (
          <MoreScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'support' && (
          <SupportScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'help' && (
          <PlaceholderScreen title="Help Center" description="Access FAQs, support tickets, and contact information." />
        )}

        {currentScreen === 'terms' && (
          <PlaceholderScreen title="Terms of Service" description="Read our comprehensive legal agreements and usage terms." />
        )}

        {currentScreen === 'video-analysis' && (
          <VideoAnalysisTool onNavigate={handleNavigate} />
        )}

        {currentScreen === 'scenarios' && (
          <ScenarioTraining
            onNavigate={handleNavigate}
            onOpenChalkboard={() => handleNavigate('chalkboard')}
          />
        )}

        {currentScreen === 'masterclasses' && (
          <TacticalMasterclasses
            onNavigate={handleNavigate}
            onOpenScenario={() => handleNavigate('scenarios')}
          />
        )}

        {currentScreen === 'planner' && (
          <TrainingPlanner onNavigate={handleNavigate} />
        )}

        {currentScreen === 'chalkboard' && (
          <DigitalChalkboard onNavigate={handleNavigate} />
        )}

        {currentScreen === 'drills-vault' && (
          <SmartDrillsVault
            onNavigate={handleNavigate}
            onSelectDrill={(drill) => {
              setSelectedDrill(drill);
            }}
          />
        )}

        {currentScreen === 'record' && (
          <RecordScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'stats' && (
          <StatsScreen currentUser={currentUser} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'drills' && (
          <DrillsScreen
            onSelectDrill={(drill) => setSelectedDrill(drill)}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'academy' && (
          <AcademyScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'drill-details' && (
          <DrillDetailsScreen
            drill={selectedDrill}
            onBack={() => handleNavigate('drills-vault')}
            onStartPractice={() => handleNavigate('drill-practice')}
          />
        )}

        {currentScreen === 'drill-practice' && (
          <DrillPracticeScreen
            drill={selectedDrill}
            onBack={() => handleNavigate('drill-details')}
            onFinish={() => handleNavigate('feedback')}
          />
        )}

        {currentScreen === 'feedback' && (
          <FeedbackScreen
            onNavigate={handleNavigate}
            currentUser={currentUser}
            drill={selectedDrill}
          />
        )}

        {currentScreen === 'profiles' && (
          <UserProfilesScreen
            currentUser={currentUser}
            onSelectUser={(user) => {
              setCurrentUser(user);
              handleNavigate('home');
            }}
            onNavigate={handleNavigate}
            onOpenWizard={(role, profile) => {
              if (profile) setCurrentUser(profile);
              setIsWizardOpen(true);
            }}
            onOpenGuardianPortal={() => setIsGuardianPortalOpen(true)}
          />
        )}

        {currentScreen === 'security-settings' && (
          <ErrorBoundary fallbackTitle="Security & Sessions Management">
            <SecurityAndSessionsScreen
              currentUser={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onNavigateBack={() => handleNavigate('home')}
              onOpenPrivacy={() => handleNavigate('privacy-governance')}
              onOpenEncryption={() => handleNavigate('encryption-governance')}
              onOpenMobileSecurity={() => handleNavigate('mobile-security')}
              onOpenSourceCodeSecurity={() => handleNavigate('source-code-security')}
            />
          </ErrorBoundary>
        )}

        {currentScreen === 'privacy-governance' && (
          <DataPrivacyGovernanceScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'encryption-governance' && (
          <DataEncryptionGovernanceScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'mobile-security' && (
          <MobileSecurityGovernanceScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'source-code-security' && (
          <SourceCodeSecurityScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'mobile-bridge' && (
          <MobileBridgeScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'security-gate-1' && (
          <SecurityGateOneScreen
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'cloud-infrastructure' && (
          <CloudInfrastructureScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'security-gate-2' && (
          <SecurityGateTwoScreen
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'store-assets-privacy' && (
          <StoreAssetsPrivacyScreen
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'testflight-internal-testing' && (
          <TestFlightInternalTestingScreen
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}

        {isAuthScreen && (
          <AuthScreens
            authMode={authMode}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
            }}
            onSwitchAuthMode={(mode) => {
              setAuthMode(mode);
              if (mode === 'player') handleNavigate('auth-player');
              if (mode === 'coach') handleNavigate('auth-coach');
              if (mode === 'admin') handleNavigate('auth-admin');
            }}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      {!hideNavbar && (
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onBack={handleBack}
        />
      )}

      {/* Persona / Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        onSelectUser={handleSelectUser}
        onOpenGuardianPortal={() => setIsGuardianPortalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onNavigate={handleNavigate}
        onOpenWizard={() => {
          setIsWizardOpen(true);
        }}
        onOpenAuth={(mode) => {
          const mappedMode: 'player' | 'coach' | 'admin' =
            mode === 'coach' ? 'coach' : (mode === 'club_admin' || (mode as string) === 'admin') ? 'admin' : 'player';
          setAuthMode(mappedMode);
          if (mappedMode === 'player') handleNavigate('auth-player');
          if (mappedMode === 'coach') handleNavigate('auth-coach');
          if (mappedMode === 'admin') handleNavigate('auth-admin');
        }}
      />

      {/* Google Ecosystem Hub (OAuth, Fitness & Location) Modal */}
      <GoogleIntegrationModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onFitnessDataSynced={(data) => setSyncedFitness(data)}
        onLocationDetected={(venue) => setDetectedVenue(venue)}
      />

      {/* Standalone Questionnaire Wizard Modal */}
      <ProfileCreationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        role={currentUser.role === 'coach' ? 'coach' : 'player'}
        initialProfile={currentUser}
        onSaveProfile={(updated) => {
          setCurrentUser(updated);
        }}
      />

      {/* Guardian Supervision & Safeguarding Portal Modal */}
      <GuardianSupervisionPortal
        isOpen={isGuardianPortalOpen}
        onClose={() => setIsGuardianPortalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Comprehensive Safeguarding Incident Report & Block Modal */}
      <SafeguardingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentUser={currentUser}
        targetUserId="usr-coach-richardson"
        targetUserName="Coach Mark Richardson"
        onBlockUser={(blockedId) => {
          const currentBlocked = currentUser.blockedUserIds || [];
          if (!currentBlocked.includes(blockedId)) {
            setCurrentUser({
              ...currentUser,
              blockedUserIds: [...currentBlocked, blockedId]
            });
          }
        }}
      />
    </div>
  );
}
