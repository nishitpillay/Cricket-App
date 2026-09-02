/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, UserProfile, DrillItem } from './types';
import { mockUsers, mockDrills } from './data/mockData';
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

export default function App() {
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

  const handleNavigate = (screen: ScreenType) => {
    playBeep(650, 0.06);
    setCurrentScreen(screen);
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
  let showBack = false;
  let onBack: (() => void) | undefined = undefined;

  switch (currentScreen) {
    case 'home':
      headerTitle = '';
      break;
    case 'record':
      headerTitle = 'Live Camera Record';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'video-analysis':
      headerTitle = 'Video Analysis & Slow-Mo';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'stats':
      headerTitle = 'Data & Wagon Wheels';
      break;
    case 'drills':
      headerTitle = 'Drills Library';
      break;
    case 'drills-vault':
      headerTitle = 'Smart Drills Vault';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'scenarios':
      headerTitle = 'Scenario-Based Training';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'masterclasses':
      headerTitle = 'Tactical Masterclasses';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'planner':
      headerTitle = 'Training Planner';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'chalkboard':
      headerTitle = 'Digital Chalkboard';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'academy':
      headerTitle = 'Academy & Rules Breakdown';
      break;
    case 'drill-details':
      headerTitle = 'Drill Details';
      showBack = true;
      onBack = () => handleNavigate('drills-vault');
      break;
    case 'drill-practice':
      headerTitle = 'Live Practice';
      showBack = true;
      onBack = () => handleNavigate('drill-details');
      break;
    case 'feedback':
      headerTitle = 'Session Feedback';
      break;
    case 'security-settings':
      headerTitle = 'Security & Sessions';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'privacy-governance':
      headerTitle = 'Privacy & Classification';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    case 'auth-player':
    case 'auth-coach':
    case 'auth-admin':
      headerTitle = 'Sign In';
      showBack = true;
      onBack = () => handleNavigate('home');
      break;
    default:
      headerTitle = '';
  }

  const isAuthScreen = currentScreen.startsWith('auth');
  const hideNavbar = currentScreen === 'record' || currentScreen === 'drill-practice' || isAuthScreen;

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-body antialiased flex flex-col selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Top Persistent Header */}
      <Header
        title={headerTitle}
        showBack={showBack}
        onBack={onBack}
        currentUser={currentUser}
        onProfileClick={() => setIsRoleModalOpen(true)}
        onGoogleSyncClick={() => setIsGoogleModalOpen(true)}
        onGuardianPortalClick={() => setIsGuardianPortalOpen(true)}
        onSecurityClick={() => handleNavigate('security-settings')}
        onPrivacyClick={() => handleNavigate('privacy-governance')}
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
            onNavigate={handleNavigate}
            onSelectDrill={(drill) => {
              setSelectedDrill(drill);
              handleNavigate('drill-details');
            }}
          />
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

        {currentScreen === 'security-settings' && (
          <SecurityAndSessionsScreen
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onNavigateBack={() => handleNavigate('home')}
            onOpenPrivacy={() => handleNavigate('privacy-governance')}
          />
        )}

        {currentScreen === 'privacy-governance' && (
          <DataPrivacyGovernanceScreen
            currentUser={currentUser}
            onNavigate={handleNavigate}
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
          setAuthMode(mode);
          if (mode === 'player') handleNavigate('auth-player');
          if (mode === 'coach') handleNavigate('auth-coach');
          if (mode === 'admin') handleNavigate('auth-admin');
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
