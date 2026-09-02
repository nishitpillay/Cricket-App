import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  PlayerCricketProfile,
  CoachCricketProfile,
  CoachHistoricalRecord,
  GoogleAuthSession
} from '../../types';
import { getStoredGoogleSession } from '../../utils/googleService';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface ProfileCreationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'player' | 'coach';
  initialProfile?: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileCreationWizardModal: React.FC<ProfileCreationWizardModalProps> = ({
  isOpen,
  onClose,
  role,
  initialProfile,
  onSaveProfile
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [googleSession, setGoogleSession] = useState<GoogleAuthSession | null>(null);

  // --- PLAYER STATE ---
  const [playerName, setPlayerName] = useState('Devang Dalvi');
  const [playerDob, setPlayerDob] = useState('2003-05-14');
  const [playerAge, setPlayerAge] = useState(23);
  const [playerStyle, setPlayerStyle] = useState<PlayerCricketProfile['playingStyle']>('Aggressive / Dominant');
  const [playerCategory, setPlayerCategory] = useState<PlayerCricketProfile['primaryCategory']>('All-Rounder');

  // Junior Safeguarding State
  const [guardianName, setGuardianName] = useState('Sarah Chen');
  const [guardianEmail, setGuardianEmail] = useState('sarah.chen.parent@gmail.com');
  const [guardianRelationship, setGuardianRelationship] = useState<'Parent' | 'Legal Guardian' | 'Club Safeguarding Lead'>('Parent');
  const [parentConsentChecked, setParentConsentChecked] = useState(true);
  const [playerHandedness, setPlayerHandedness] = useState<'Right-Hand Bat' | 'Left-Hand Bat'>('Right-Hand Bat');
  const [playerOrderPos, setPlayerOrderPos] = useState<PlayerCricketProfile['battingDetails']['orderPosition']>('Top-Order (No. 3)');
  const [selectedBattingStrengths, setSelectedBattingStrengths] = useState<string[]>([
    'Cover Drive & High Elbow Loft',
    'Pull vs Short Ball'
  ]);
  const [playerFavoriteShots, setPlayerFavoriteShots] = useState('Extra Cover Drive & Pull');
  
  // Bowling
  const [bowlingSpeedCat, setBowlingSpeedCat] = useState<NonNullable<PlayerCricketProfile['bowlingDetails']>['speedCategory']>('Fast Bowler (140+ kph)');
  const [bowlingTechnique, setBowlingTechnique] = useState<NonNullable<PlayerCricketProfile['bowlingDetails']>['techniqueStyle']>('Right-Arm Fast / Express');
  const [bowlingTacticalRole, setBowlingTacticalRole] = useState<NonNullable<PlayerCricketProfile['bowlingDetails']>['tacticalRole']>('New Ball Strike Bowler');
  const [bowlingStockDelivery, setBowlingStockDelivery] = useState('High-Release Outswinger');
  const [fieldingPos, setFieldingPos] = useState('Slips / Gully');

  // --- COACH STATE ---
  const [coachName, setCoachName] = useState('Arin Mishra');
  const [coachSpecialization, setCoachSpecialization] = useState<CoachCricketProfile['specialization']>('Fast Bowling Pace & Seam Mechanics');
  const [coachBio, setCoachBio] = useState(
    'Former international fast bowler and ECB Level 4 High Performance Director with 16+ years developing express pacers and technical top-order batsmen through real-time telemetry.'
  );
  const [coachExperience, setCoachExperience] = useState(16);
  const [selectedAccreditations, setSelectedAccreditations] = useState<string[]>([
    'ICC Level 3 Master Instructor',
    'ECB High Performance Specialist',
    'Biomechanical Motion Analysis Certified'
  ]);
  const [coachingHistory, setCoachingHistory] = useState<CoachHistoricalRecord[]>([
    {
      organizationOrTeam: 'Surrey County High Performance Academy',
      role: 'Head Bowling & Pace Director',
      years: '2021 - Present',
      notableAchievements: 'Produced 4 First-Class debutants, Championship Finalists'
    },
    {
      organizationOrTeam: 'National U-19 Development Squad',
      role: 'Assistant Coach & Pace Lead',
      years: '2017 - 2021',
      notableAchievements: 'World Cup Semi-Finals, Average pace increased by 6.2 kph'
    }
  ]);
  const [newOrg, setNewOrg] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newYears, setNewYears] = useState('');
  const [newAchieve, setNewAchieve] = useState('');
  const [showAddHistory, setShowAddHistory] = useState(false);

  const [coachWinRate, setCoachWinRate] = useState(74.5);
  const [coachTrophies, setCoachTrophies] = useState(6);
  const [coachProsDeveloped, setCoachProsDeveloped] = useState(28);
  const [coachMatches, setCoachMatches] = useState(342);

  // Initialize from existing profile or Google session
  useEffect(() => {
    if (isOpen) {
      const gSession = getStoredGoogleSession();
      setGoogleSession(gSession);

      if (initialProfile) {
        if (role === 'player' && initialProfile.playerProfile) {
          const p = initialProfile.playerProfile;
          setPlayerName(p.name || initialProfile.name);
          setPlayerDob(p.dateOfBirth || '2003-05-14');
          setPlayerAge(p.age || 23);
          setPlayerStyle(p.playingStyle || 'Aggressive / Dominant');
          setPlayerCategory(p.primaryCategory || 'All-Rounder');
          setPlayerHandedness(p.battingDetails?.handedness || 'Right-Hand Bat');
          setPlayerOrderPos(p.battingDetails?.orderPosition || 'Top-Order (No. 3)');
          setSelectedBattingStrengths(p.battingDetails?.keyStrengths || ['Cover Drive & High Elbow Loft']);
          setPlayerFavoriteShots(p.battingDetails?.favoriteShots || 'Extra Cover Drive & Pull');
          if (p.bowlingDetails) {
            setBowlingSpeedCat(p.bowlingDetails.speedCategory);
            setBowlingTechnique(p.bowlingDetails.techniqueStyle);
            setBowlingTacticalRole(p.bowlingDetails.tacticalRole);
            setBowlingStockDelivery(p.bowlingDetails.stockDelivery || 'Outswinger');
          }
          if (p.fieldingPosition) setFieldingPos(p.fieldingPosition);
        } else if (role === 'coach' && initialProfile.coachProfile) {
          const c = initialProfile.coachProfile;
          setCoachName(c.name || initialProfile.name);
          setCoachSpecialization(c.specialization || 'Fast Bowling Pace & Seam Mechanics');
          setCoachBio(c.bioSummary || '');
          setCoachExperience(c.yearsOfExperience || 16);
          setSelectedAccreditations(c.accreditations || ['ICC Level 3 Master Instructor']);
          setCoachingHistory(c.coachingHistory || []);
          if (c.historicStats) {
            setCoachWinRate(c.historicStats.winRatePct || 74.5);
            setCoachTrophies(c.historicStats.trophiesWon || 6);
            setCoachProsDeveloped(c.historicStats.proPlayersDeveloped || 28);
            setCoachMatches(c.historicStats.matchesCoached || 342);
          }
        }
      } else if (gSession?.user?.name) {
        if (role === 'player') setPlayerName(gSession.user.name);
        if (role === 'coach') setCoachName(gSession.user.name);
      }
    }
  }, [isOpen, initialProfile, role]);

  // Recalculate age from DOB
  const handleDobChange = (dobStr: string) => {
    setPlayerDob(dobStr);
    try {
      const birthDate = new Date(dobStr);
      const diffMs = Date.now() - birthDate.getTime();
      const ageDt = new Date(diffMs);
      const calculatedAge = Math.abs(ageDt.getUTCFullYear() - 1970);
      if (!isNaN(calculatedAge) && calculatedAge > 5 && calculatedAge < 90) {
        setPlayerAge(calculatedAge);
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleBattingStrength = (strength: string) => {
    playBeep(700, 0.03);
    if (selectedBattingStrengths.includes(strength)) {
      setSelectedBattingStrengths(selectedBattingStrengths.filter((s) => s !== strength));
    } else {
      setSelectedBattingStrengths([...selectedBattingStrengths, strength]);
    }
  };

  const toggleAccreditation = (acc: string) => {
    playBeep(700, 0.03);
    if (selectedAccreditations.includes(acc)) {
      setSelectedAccreditations(selectedAccreditations.filter((a) => a !== acc));
    } else {
      setSelectedAccreditations([...selectedAccreditations, acc]);
    }
  };

  const handleAddCoachingHistory = () => {
    if (!newOrg || !newRole) return;
    playBeep(850, 0.06);
    setCoachingHistory([
      ...coachingHistory,
      {
        organizationOrTeam: newOrg,
        role: newRole,
        years: newYears || '2022 - 2024',
        notableAchievements: newAchieve || 'Team championship and high performance development'
      }
    ]);
    setNewOrg('');
    setNewRole('');
    setNewYears('');
    setNewAchieve('');
    setShowAddHistory(false);
  };

  const handleSave = () => {
    playCelebration();

    if (role === 'player') {
      const updatedPlayerProfile: PlayerCricketProfile = {
        name: playerName,
        age: playerAge,
        dateOfBirth: playerDob,
        playingStyle: playerStyle,
        primaryCategory: playerCategory,
        battingDetails: {
          handedness: playerHandedness,
          orderPosition: playerOrderPos,
          keyStrengths: selectedBattingStrengths,
          favoriteShots: playerFavoriteShots
        },
        bowlingDetails:
          playerCategory !== 'Batter'
            ? {
                speedCategory: bowlingSpeedCat,
                techniqueStyle: bowlingTechnique,
                tacticalRole: bowlingTacticalRole,
                stockDelivery: bowlingStockDelivery
              }
            : undefined,
        fieldingPosition: fieldingPos,
        googleConnected: !!googleSession
      };

      const specialtyLabel = `${playerHandedness === 'Right-Hand Bat' ? 'RHB' : 'LHB'} • ${
        playerCategory === 'Batter'
          ? playerOrderPos
          : playerCategory === 'Bowler'
          ? bowlingTechnique
          : `${playerOrderPos} / ${bowlingSpeedCat.split(' ')[0]}`
      }`;

      const isJuniorPlayer = playerAge < 18;

      const updatedUser: UserProfile = {
        id: initialProfile?.id || 'usr-player-' + Date.now(),
        name: playerName,
        role: 'player',
        avatar:
          googleSession?.user.picture ||
          initialProfile?.avatar ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
        level: initialProfile?.level || (isJuniorPlayer ? 14 : 42),
        xpProgress: initialProfile?.xpProgress || 75,
        tier: isJuniorPlayer ? 'U-15 JUNIOR ACADEMY' : 'ELITE PROSPECT',
        specialty: specialtyLabel,
        isJunior: isJuniorPlayer,
        guardianInfo: isJuniorPlayer
          ? {
              guardianName: guardianName.trim() || 'Sarah Chen',
              guardianEmail: guardianEmail.trim() || 'sarah.chen.parent@gmail.com',
              relationship: guardianRelationship,
              consentStatus: parentConsentChecked ? 'verified' : 'pending',
              consentGrantedAt: new Date().toISOString(),
              consentVerificationToken: `GV-${Math.random().toString(36).substring(2, 9).toUpperCase()}-VERIFIED`,
              guardianPortalPin: '4821',
              supervisionEnabled: true,
              ccAllCoachCommunications: true,
              notifyOnSessionUpload: true
            }
          : undefined,
        juniorPrivacy: isJuniorPlayer
          ? {
              isJunior: true,
              hideExactLocation: true,
              disablePublicDiscovery: true,
              allowOnlyAssignedCoaches: true,
              blockDirectMessaging: true,
              disablePublicComments: true,
              stripExifMetadata: true,
              videoPrivacyLevel: 'private-guardian-coach-only',
              assignedCoachIds: ['coach-mark']
            }
          : undefined,
        playerProfile: {
          ...updatedPlayerProfile,
          isJunior: isJuniorPlayer
        }
      };

      onSaveProfile(updatedUser);
    } else {
      const updatedCoachProfile: CoachCricketProfile = {
        name: coachName,
        specialization: coachSpecialization,
        bioSummary: coachBio,
        yearsOfExperience: coachExperience,
        accreditations: selectedAccreditations,
        coachingHistory: coachingHistory,
        historicStats: {
          winRatePct: coachWinRate,
          trophiesWon: coachTrophies,
          proPlayersDeveloped: coachProsDeveloped,
          matchesCoached: coachMatches
        },
        googleConnected: !!googleSession
      };

      const updatedUser: UserProfile = {
        id: initialProfile?.id || 'coach-' + Date.now(),
        name: coachName,
        role: 'coach',
        avatar:
          googleSession?.user.picture ||
          initialProfile?.avatar ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
        level: initialProfile?.level || 88,
        xpProgress: initialProfile?.xpProgress || 90,
        tier: 'HIGH PERFORMANCE COACH',
        specialty: `${coachSpecialization} (${coachExperience}y Exp)`,
        coachProfile: updatedCoachProfile
      };

      onSaveProfile(updatedUser);
    }

    onClose();
  };

  if (!isOpen) return null;

  const totalSteps = role === 'player' ? (playerCategory === 'Batter' ? 3 : 4) : 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#1c1b1b] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-[#c3f400]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header & Stepper */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#282727] border border-[#c3f400]/30 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[#c3f400] text-[22px]">
                {role === 'player' ? 'sports_cricket' : 'psychology'}
              </span>
            </div>
            <div>
              <h3 className="font-headline font-black text-lg text-white">
                {role === 'player' ? 'Complete Player Cricket Profile' : 'High Performance Coach Profile'}
              </h3>
              <p className="text-xs text-[#c4c9ac]">
                Telemetry Questionnaire • Google Biometrics & Style Calibration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between gap-2 mb-5 px-1">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <button
                key={stepNum}
                onClick={() => {
                  playBeep(600, 0.02);
                  setCurrentStep(stepNum);
                }}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#c3f400] shadow-[0_0_10px_#c3f400]'
                    : isCompleted
                    ? 'bg-[#c3f400]/50'
                    : 'bg-white/10'
                }`}
                title={`Step ${stepNum}`}
              />
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* PLAYER QUESTIONNAIRE WIZARD */}
        {/* ============================================================ */}
        {role === 'player' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
            {/* STEP 1: IDENTITY & STYLE */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">badge</span>
                    Player Identity & Birth Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Full Player Name
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="e.g. Alex Mercer"
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Date of Birth & Age
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={playerDob}
                          onChange={(e) => handleDobChange(e.target.value)}
                          className="flex-1 bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3 py-2 text-sm text-white outline-none"
                        />
                        <div className="px-3 py-2 rounded-xl bg-[#2b2a2a] border border-white/10 text-xs font-mono font-bold text-[#c3f400]">
                          {playerAge} yrs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Junior Player Safeguarding & Parental Consent Card */}
                  {playerAge < 18 && (
                    <div className="p-3.5 rounded-2xl bg-[#1a2c1a] border border-[#4ade80]/40 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80] text-[20px]">shield_lock</span>
                          <div>
                            <span className="font-headline font-bold text-xs text-white block">
                              Junior Player Safeguarding & Guardian Supervision Required
                            </span>
                            <span className="text-[10px] text-[#c4c9ac]">
                              Player is under 18. Mandatory COPPA & ECB safeguarding guardrails will apply.
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                          Junior U-{playerAge + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-[#c4c9ac] uppercase block mb-1">
                            Parent / Guardian Name *
                          </label>
                          <input
                            type="text"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            placeholder="e.g. Sarah Chen"
                            className="w-full bg-[#121c12] border border-[#4ade80]/30 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#4ade80]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#c4c9ac] uppercase block mb-1">
                            Guardian Email (for 2-Way CC) *
                          </label>
                          <input
                            type="email"
                            value={guardianEmail}
                            onChange={(e) => setGuardianEmail(e.target.value)}
                            placeholder="e.g. parent@gmail.com"
                            className="w-full bg-[#121c12] border border-[#4ade80]/30 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#4ade80]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#c4c9ac] uppercase block mb-1">
                            Relationship
                          </label>
                          <select
                            value={guardianRelationship}
                            onChange={(e) => setGuardianRelationship(e.target.value as any)}
                            className="w-full bg-[#121c12] border border-[#4ade80]/30 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#4ade80]"
                          >
                            <option value="Parent">Parent</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                            <option value="Club Safeguarding Lead">Club Safeguarding Lead</option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#4ade80]/20 cursor-pointer text-xs text-white">
                        <input
                          type="checkbox"
                          checked={parentConsentChecked}
                          onChange={(e) => setParentConsentChecked(e.target.checked)}
                          className="accent-[#4ade80] w-4 h-4 rounded"
                        />
                        <span className="text-[11px] leading-snug">
                          Parent/Guardian grants verified consent for junior technical coaching. GPS coordinates, personal phone, address, and school details are permanently suppressed.
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Playing Style Archetype */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">electric_bolt</span>
                    Style of Playing (Tactical Archetype)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      {
                        style: 'Aggressive / Dominant',
                        desc: 'Attacks early, imposes high run-rate pressure, dominant front-foot strokeplay'
                      },
                      {
                        style: 'Classical & Technical',
                        desc: 'Pristine balance, textbook defense, high percentage shot selection'
                      },
                      {
                        style: 'Anchor / Accumulator',
                        desc: 'Calculated strike rotation, builds long match-defining innings'
                      },
                      {
                        style: 'Power Hitter / Finisher',
                        desc: 'Explosive bat speed, high boundary percentage in death overs'
                      },
                      {
                        style: 'Innovative / 360-Degree',
                        desc: 'Ramp shots, reverse scoops, unorthodox wrist manipulations'
                      }
                    ].map((item) => (
                      <button
                        key={item.style}
                        onClick={() => {
                          playBeep(750, 0.03);
                          setPlayerStyle(item.style as any);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          playerStyle === item.style
                            ? 'bg-[#c3f400]/15 border-[#c3f400] text-white shadow-md'
                            : 'bg-[#201f1f] border-white/5 text-[#c4c9ac] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item.style}</span>
                          {playerStyle === item.style && (
                            <span className="material-symbols-outlined text-[#c3f400] text-[16px]">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#888] mt-1 leading-snug">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CATEGORY & BATTING DEEP DIVE */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                {/* Playing Category Selector */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider">
                    Primary Cricket Category:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { cat: 'Batter', icon: 'sports_cricket' },
                      { cat: 'Bowler', icon: 'sports_baseball' },
                      { cat: 'All-Rounder', icon: 'all_inclusive' },
                      { cat: 'Fielder / Wicket-Keeper', icon: 'front_hand' }
                    ].map((c) => (
                      <button
                        key={c.cat}
                        onClick={() => {
                          playBeep(700, 0.03);
                          setPlayerCategory(c.cat as any);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          playerCategory === c.cat
                            ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] font-bold shadow-md'
                            : 'bg-[#201f1f] text-[#c4c9ac] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                        <span className="text-xs">{c.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batting Hand & Position */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">straighten</span>
                    Batting Anatomical Stance & Lineup Slot
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Batting Handedness
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Right-Hand Bat', 'Left-Hand Bat'].map((hand) => (
                          <button
                            key={hand}
                            onClick={() => {
                              playBeep(650, 0.03);
                              setPlayerHandedness(hand as any);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              playerHandedness === hand
                                ? 'bg-[#c3f400]/20 border-[#c3f400] text-[#c3f400]'
                                : 'bg-[#201f1f] border-white/5 text-[#c4c9ac]'
                            }`}
                          >
                            {hand}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Batting Order Position
                      </label>
                      <select
                        value={playerOrderPos}
                        onChange={(e) => setPlayerOrderPos(e.target.value as any)}
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                      >
                        <option value="Opening Batsman (1-2)">Opening Batsman (1-2)</option>
                        <option value="Top-Order (No. 3)">Top-Order (No. 3)</option>
                        <option value="Middle-Order (4-5)">Middle-Order (4-5)</option>
                        <option value="Lower-Middle / Finisher (6-7)">Lower-Middle / Finisher (6-7)</option>
                        <option value="Tail-Ender (8-11)">Tail-Ender (8-11)</option>
                      </select>
                    </div>
                  </div>

                  {/* Key Batting Strengths Chips */}
                  <div>
                    <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1.5">
                      Key Batting Strengths & Weaponry:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Cover Drive & High Elbow Loft',
                        'Pull vs Short Ball',
                        'Cut & Upper Cut',
                        'Sweep / Reverse Sweep vs Spin',
                        'Straight Loft Down Ground',
                        'Death Overs Power Hitting',
                        'Late Dab / Glide to Third Man',
                        'Flick off Pads'
                      ].map((strength) => (
                        <button
                          key={strength}
                          onClick={() => toggleBattingStrength(strength)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedBattingStrengths.includes(strength)
                              ? 'bg-[#c3f400]/20 border-[#c3f400] text-[#c3f400]'
                              : 'bg-[#201f1f] border-white/5 text-[#888] hover:text-white'
                          }`}
                        >
                          {strength}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BOWLING DEEP DIVE (if Bowler, All-Rounder, or Fielder who bowls) */}
            {currentStep === 3 && playerCategory !== 'Batter' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">speed</span>
                    Bowling Speed Category & Release Tier
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Fast Bowler (140+ kph)',
                      'Fast-Medium Pacer (125-140 kph)',
                      'Medium Pacer & Seamer (110-125 kph)',
                      'Spin Bowler'
                    ].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          playBeep(700, 0.03);
                          setBowlingSpeedCat(speed as any);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          bowlingSpeedCat === speed
                            ? 'bg-[#c3f400]/20 border-[#c3f400] text-[#c3f400] font-bold'
                            : 'bg-[#201f1f] border-white/5 text-[#c4c9ac]'
                        }`}
                      >
                        <span className="text-xs block">{speed}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Spin / Seam Technique & Arm Breakdown */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">sync</span>
                    Detailed Bowling Technique & Sub-Category
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      {
                        tech: 'Right-Arm Fast / Express',
                        sub: 'High release arm action, hit the deck hard, bounce extraction'
                      },
                      {
                        tech: 'Left-Arm Fast / Inswing Seam',
                        sub: 'Angles into right-handers, sharp late swinging yorkers'
                      },
                      {
                        tech: 'Right-Arm Fast-Medium Outswing',
                        sub: 'Upright seam, corridors of uncertainty away from right-hand bat'
                      },
                      {
                        tech: 'Left-Arm Medium-Fast Swing',
                        sub: 'Skiddy pace variation, cutters, natural angle away from lefties'
                      },
                      {
                        tech: 'Right-Arm Off-Spin (Finger Spin & Doosra)',
                        sub: 'Finger spin, drift into right-hander, sharp turn towards leg'
                      },
                      {
                        tech: 'Right-Arm Leg-Spin (Wrist Spin & Googly)',
                        sub: 'Wrist spin, big turn away from RHB, wrong-un / flipper deception'
                      },
                      {
                        tech: 'Left-Arm Orthodox (Finger Spin & Arm Ball)',
                        sub: 'Tight trajectory, natural drift, arm-ball skidding straight on'
                      },
                      {
                        tech: 'Left-Arm Unorthodox / Chinaman (Wrist Spin)',
                        sub: 'Rare wrist spin turning back into right-handers, wrong-uns'
                      }
                    ].map((item) => (
                      <button
                        key={item.tech}
                        onClick={() => {
                          playBeep(700, 0.03);
                          setBowlingTechnique(item.tech as any);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          bowlingTechnique === item.tech
                            ? 'bg-[#c3f400]/15 border-[#c3f400] text-white shadow-sm'
                            : 'bg-[#201f1f] border-white/5 text-[#c4c9ac] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold text-white block">{item.tech}</span>
                        <span className="text-[10px] text-[#888] block mt-0.5">{item.sub}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Tactical Bowling Role
                      </label>
                      <select
                        value={bowlingTacticalRole}
                        onChange={(e) => setBowlingTacticalRole(e.target.value as any)}
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                      >
                        <option value="New Ball Strike Bowler">New Ball Strike Bowler</option>
                        <option value="First Change Seamer">First Change Seamer</option>
                        <option value="Middle Overs Strangler">Middle Overs Strangler</option>
                        <option value="Death Overs Yorker Specialist">Death Overs Yorker Specialist</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Primary Stock Delivery
                      </label>
                      <input
                        type="text"
                        value={bowlingStockDelivery}
                        onChange={(e) => setBowlingStockDelivery(e.target.value)}
                        placeholder="e.g. Outswinger / Leg-break"
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINAL STEP: GOOGLE HUB & CONFIRMATION */}
            {((currentStep === 3 && playerCategory === 'Batter') || currentStep === 4) && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-black/40 border border-[#c3f400]/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#2b2a2a] border border-[#c3f400] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#c3f400] text-[28px]">
                          verified
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline font-black text-base text-white">{playerName}</h4>
                        <p className="text-xs text-[#c3f400] font-mono">
                          {playerHandedness} • {playerCategory} ({playerAge} yrs)
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
                      CALIBRATED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block">BATTING ROLE</span>
                      <span className="font-bold text-white">{playerOrderPos}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block">PLAYING STYLE</span>
                      <span className="font-bold text-white">{playerStyle}</span>
                    </div>
                    {playerCategory !== 'Batter' && (
                      <div className="col-span-2 p-2.5 rounded-xl bg-[#201f1f]">
                        <span className="text-[10px] text-[#c4c9ac] block">BOWLING ARSENAL</span>
                        <span className="font-bold text-[#c3f400]">{bowlingTechnique} ({bowlingSpeedCat})</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/20 text-xs text-[#9cf0ff] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                    <span>Google Health & Venue GPS synced with AI Biomechanical Tracking.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* COACH QUESTIONNAIRE WIZARD */}
        {/* ============================================================ */}
        {role === 'coach' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
            {/* STEP 1: IDENTITY & SPECIALIZATION */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">psychology</span>
                    Coach Identity & Experience
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Coach Full Name
                      </label>
                      <input
                        type="text"
                        value={coachName}
                        onChange={(e) => setCoachName(e.target.value)}
                        placeholder="e.g. Coach Mark Richardson"
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-1">
                        Years of Coaching Experience
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={coachExperience}
                        onChange={(e) => setCoachExperience(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Specialization Selection */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">school</span>
                    What is the Coach Specialized In?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      {
                        spec: 'Batting Masterclass & Biomechanics',
                        desc: 'Stance stability, elbow elevation, high-speed trigger movements'
                      },
                      {
                        spec: 'Fast Bowling Pace & Seam Mechanics',
                        desc: 'Front-foot braking impulse, rotational torque, express pace acceleration'
                      },
                      {
                        spec: 'Spin Bowling Artistry & Deception',
                        desc: 'Revolutions per minute, trajectory drift, googly & arm ball deception'
                      },
                      {
                        spec: 'Wicket-Keeping & Fielding Elite',
                        desc: 'Glovework reaction time, agility footwork, direct-hit throwing mechanics'
                      },
                      {
                        spec: 'Tactical Match Strategy & Analytics',
                        desc: 'Field placements, match simulation plans, opponent vulnerability analysis'
                      },
                      {
                        spec: 'Head Coach / High Performance Director',
                        desc: 'Comprehensive squad development, multi-format coaching leadership'
                      }
                    ].map((item) => (
                      <button
                        key={item.spec}
                        onClick={() => {
                          playBeep(750, 0.03);
                          setCoachSpecialization(item.spec as any);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          coachSpecialization === item.spec
                            ? 'bg-[#c3f400]/15 border-[#c3f400] text-white shadow-md'
                            : 'bg-[#201f1f] border-white/5 text-[#c4c9ac] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item.spec}</span>
                          {coachSpecialization === item.spec && (
                            <span className="material-symbols-outlined text-[#c3f400] text-[16px]">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#888] mt-1 leading-snug">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: COACHING PHILOSOPHY & SUMMARY */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">description</span>
                    About the Coach (Bio & Coaching Philosophy)
                  </h4>
                  <p className="text-xs text-[#c4c9ac]">
                    Write a short summary detailing your core philosophy, coaching methodology, and athlete development approach.
                  </p>

                  <textarea
                    rows={5}
                    value={coachBio}
                    onChange={(e) => setCoachBio(e.target.value)}
                    placeholder="Enter short summary..."
                    className="w-full bg-[#201f1f] border border-white/10 focus:border-[#c3f400] rounded-xl p-3.5 text-xs text-white leading-relaxed outline-none resize-none"
                  />
                </div>

                {/* Accreditations */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider">
                    Certifications & Accreditations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'ICC Level 3 Master Instructor',
                      'ECB High Performance Specialist',
                      'BCCI Level 2 Coach',
                      'Cricket Australia High Performance',
                      'Biomechanical Motion Analysis Certified',
                      'Strength & Conditioning Specialist (CSCS)'
                    ].map((acc) => (
                      <button
                        key={acc}
                        onClick={() => toggleAccreditation(acc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          selectedAccreditations.includes(acc)
                            ? 'bg-[#c3f400]/20 border-[#c3f400] text-[#c3f400]'
                            : 'bg-[#201f1f] border-white/5 text-[#888] hover:text-white'
                        }`}
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: HISTORIC STATS & PREVIOUS ASSIGNMENTS */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                {/* Historic Career Statistics */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">query_stats</span>
                    Historic Coaching Track Record
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block uppercase">Win Rate %</span>
                      <input
                        type="number"
                        step="0.1"
                        value={coachWinRate}
                        onChange={(e) => setCoachWinRate(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-headline font-black text-xl text-[#c3f400] outline-none"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block uppercase">Trophies Won</span>
                      <input
                        type="number"
                        value={coachTrophies}
                        onChange={(e) => setCoachTrophies(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-headline font-black text-xl text-[#ffdb3c] outline-none"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block uppercase">Pros Produced</span>
                      <input
                        type="number"
                        value={coachProsDeveloped}
                        onChange={(e) => setCoachProsDeveloped(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-headline font-black text-xl text-[#9cf0ff] outline-none"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-[#201f1f]">
                      <span className="text-[10px] text-[#c4c9ac] block uppercase">Matches</span>
                      <input
                        type="number"
                        value={coachMatches}
                        onChange={(e) => setCoachMatches(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-headline font-black text-xl text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Historic Assignments List */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#c3f400]">history_edu</span>
                      Previous Coaching Assignments
                    </h4>
                    <button
                      onClick={() => setShowAddHistory(!showAddHistory)}
                      className="px-2.5 py-1 rounded-lg bg-[#c3f400]/20 text-[#c3f400] text-xs font-bold hover:bg-[#c3f400]/30 transition-all cursor-pointer"
                    >
                      {showAddHistory ? 'Cancel' : '+ Add Stint'}
                    </button>
                  </div>

                  {showAddHistory && (
                    <div className="p-3 rounded-xl bg-[#201f1f] border border-[#c3f400]/30 flex flex-col gap-2 animate-fadeIn">
                      <input
                        type="text"
                        placeholder="Team / Academy / Club"
                        value={newOrg}
                        onChange={(e) => setNewOrg(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Role (e.g. Head Coach)"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Years (e.g. 2020-2023)"
                          value={newYears}
                          onChange={(e) => setNewYears(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Key Accomplishment / Trophy won"
                        value={newAchieve}
                        onChange={(e) => setNewAchieve(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      />
                      <button
                        onClick={handleAddCoachingHistory}
                        className="w-full py-2 bg-[#c3f400] text-[#161e00] font-bold text-xs rounded-lg hover:bg-[#abd600] transition-colors cursor-pointer"
                      >
                        Save Assignment
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {coachingHistory.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#201f1f] border border-white/5 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-white">{item.organizationOrTeam}</span>
                          <span className="text-[10px] font-mono text-[#c4c9ac]">{item.years}</span>
                        </div>
                        <span className="text-xs text-[#c3f400] font-medium">{item.role}</span>
                        <p className="text-[11px] text-[#888]">{item.notableAchievements}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & CLOUD SYNC */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-black/40 border border-[#c3f400]/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#2b2a2a] border border-[#c3f400] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#c3f400] text-[28px]">
                          psychology
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline font-black text-base text-white">{coachName}</h4>
                        <p className="text-xs text-[#c3f400] font-mono">
                          {coachSpecialization} • {coachExperience} Years Experience
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
                      ACCREDITED
                    </span>
                  </div>

                  <p className="text-xs text-[#c4c9ac] italic bg-[#201f1f] p-3 rounded-xl border border-white/5">
                    "{coachBio}"
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#201f1f]">
                      <span className="text-[9px] text-[#c4c9ac] block">WIN RATE</span>
                      <span className="font-mono text-sm text-[#c3f400] font-bold">{coachWinRate}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#201f1f]">
                      <span className="text-[9px] text-[#c4c9ac] block">TROPHIES</span>
                      <span className="font-mono text-sm text-[#ffdb3c] font-bold">{coachTrophies}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#201f1f]">
                      <span className="text-[9px] text-[#c4c9ac] block">PRO PLAYERS</span>
                      <span className="font-mono text-sm text-[#9cf0ff] font-bold">{coachProsDeveloped}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#201f1f]">
                      <span className="text-[9px] text-[#c4c9ac] block">MATCHES</span>
                      <span className="font-mono text-sm text-white font-bold">{coachMatches}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 1) {
                playBeep(600, 0.02);
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#c4c9ac] hover:text-white font-headline font-bold text-xs transition-colors cursor-pointer"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <button
                onClick={() => {
                  playBeep(750, 0.04);
                  setCurrentStep(currentStep + 1);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-xs hover:bg-[#abd600] active:scale-95 transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] cursor-pointer"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-7 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-black text-xs hover:bg-[#abd600] active:scale-95 transition-all shadow-[0_0_20px_rgba(195,244,0,0.4)] cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Save & Activate Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
