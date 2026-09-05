import {
  UserProfile,
  SessionRecord,
  MatchStat,
  TechniqueScores,
  DrillItem,
  TelestrationFeedback,
  UserMainCategory,
  PlayerSubCategory,
  CoachSubCategory,
  AdminSubCategory
} from '../types';

export const mockUsers: Record<string, UserProfile> = {
  // ==========================================
  // PLAYERS: Senior players
  // ==========================================
  player: {
    id: 'usr-devang',
    name: 'Devang Dalvi',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Senior players',
    subCategoryTitle: 'Senior All-Rounder',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
    level: 42,
    xpProgress: 75,
    tier: 'ELITE SENIOR PRO',
    specialty: 'Right-Arm Fast / Top-Order Bat (142 kph)',
    isJunior: false,
    playerProfile: {
      name: 'Devang Dalvi',
      age: 23,
      dateOfBirth: '2003-05-14',
      playingStyle: 'Aggressive / Dominant',
      primaryCategory: 'All-Rounder',
      playerSubCategory: 'Senior players',
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Top-Order (No. 3)',
        keyStrengths: ['Cover Drive & High Elbow Loft', 'Pull vs Express Short Ball', 'Spin Counter-Attack'],
        favoriteShots: 'Extra Cover Drive & Pull'
      },
      bowlingDetails: {
        speedCategory: 'Fast Bowler (140+ kph)',
        techniqueStyle: 'Right-Arm Fast / Express',
        tacticalRole: 'New Ball Strike Bowler',
        stockDelivery: 'High-Release Outswinger (142 kph)'
      },
      fieldingPosition: 'Slips / Gully',
      googleConnected: true
    }
  },

  senior_marcus: {
    id: 'usr-marcus',
    name: 'Marcus Thorne',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Senior players',
    subCategoryTitle: 'Senior Express Strike Bowler',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    level: 48,
    xpProgress: 88,
    tier: 'FIRST-CLASS VETERAN',
    specialty: 'Right-Arm Express Pacer (146 kph)',
    isJunior: false,
    playerProfile: {
      name: 'Marcus Thorne',
      age: 28,
      dateOfBirth: '1998-02-11',
      playingStyle: 'Aggressive / Dominant',
      primaryCategory: 'Bowler',
      playerSubCategory: 'Senior players',
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Tail-Ender (8-11)',
        keyStrengths: ['Lower Order Slogging', 'Fast Running'],
        favoriteShots: 'Lofted Straight Drive'
      },
      bowlingDetails: {
        speedCategory: 'Fast Bowler (140+ kph)',
        techniqueStyle: 'Right-Arm Fast / Express',
        tacticalRole: 'New Ball Strike Bowler',
        stockDelivery: 'Heavy Ball Seam-Up (146 kph)'
      },
      fieldingPosition: 'Fine Leg / Third Man',
      googleConnected: true
    }
  },

  // ==========================================
  // PLAYERS: Junior players
  // ==========================================
  junior: {
    id: 'usr-liam-junior',
    name: 'Liam Chen',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Junior players',
    subCategoryTitle: 'U-15 Junior Academy Bowler',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    level: 14,
    xpProgress: 60,
    tier: 'U-15 JUNIOR ACADEMY',
    specialty: 'Right-Arm Fast-Medium Pacer (Age 14)',
    isJunior: true,
    guardianInfo: {
      guardianName: 'Sarah Chen',
      guardianEmail: 'sarah.chen.parent@gmail.com',
      guardianPhone: '+44 7700 900821',
      relationship: 'Parent',
      consentStatus: 'verified',
      consentGrantedAt: '2026-08-15T10:00:00Z',
      consentVerificationToken: 'GV-UK-78912-VERIFIED',
      guardianPortalPin: '4821',
      supervisionEnabled: true,
      ccAllCoachCommunications: true,
      notifyOnSessionUpload: true
    },
    juniorPrivacy: {
      isJunior: true,
      hideExactLocation: true,
      disablePublicDiscovery: true,
      allowOnlyAssignedCoaches: true,
      blockDirectMessaging: true,
      disablePublicComments: true,
      stripExifMetadata: true,
      videoPrivacyLevel: 'private-guardian-coach-only',
      assignedCoachIds: ['coach-arin', 'coach-roshan']
    },
    playerProfile: {
      name: 'Liam Chen',
      age: 14,
      dateOfBirth: '2012-04-18',
      playingStyle: 'Classical & Technical',
      primaryCategory: 'Bowler',
      playerSubCategory: 'Junior players',
      isJunior: true,
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Tail-Ender (8-11)',
        keyStrengths: ['Straight Defense', 'Forward Block', 'Running Between Wickets'],
        favoriteShots: 'Forward Defensive & Late Cut'
      },
      bowlingDetails: {
        speedCategory: 'Fast-Medium Pacer (125-140 kph)',
        techniqueStyle: 'Right-Arm Fast-Medium Outswing',
        tacticalRole: 'New Ball Strike Bowler',
        stockDelivery: 'Good-Length Seam Up Delivery'
      },
      fieldingPosition: 'Cover / Mid-Off',
      googleConnected: true
    }
  },

  junior_maya: {
    id: 'usr-maya-junior',
    name: 'Maya Patel',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Junior players',
    subCategoryTitle: 'U-14 Junior Wrist Spin Prodigy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    level: 12,
    xpProgress: 52,
    tier: 'U-14 JUNIOR DEVELOPMENT',
    specialty: 'Right-Arm Leg-Spin & Googly (Age 13)',
    isJunior: true,
    guardianInfo: {
      guardianName: 'Anita Patel',
      guardianEmail: 'anita.patel.parent@gmail.com',
      guardianPhone: '+44 7700 900612',
      relationship: 'Parent',
      consentStatus: 'verified',
      consentGrantedAt: '2026-08-20T11:00:00Z',
      consentVerificationToken: 'GV-UK-55319-VERIFIED',
      guardianPortalPin: '7104',
      supervisionEnabled: true,
      ccAllCoachCommunications: true,
      notifyOnSessionUpload: true
    },
    juniorPrivacy: {
      isJunior: true,
      hideExactLocation: true,
      disablePublicDiscovery: true,
      allowOnlyAssignedCoaches: true,
      blockDirectMessaging: true,
      disablePublicComments: true,
      stripExifMetadata: true,
      videoPrivacyLevel: 'private-guardian-coach-only',
      assignedCoachIds: ['coach-roshan']
    },
    playerProfile: {
      name: 'Maya Patel',
      age: 13,
      dateOfBirth: '2013-09-05',
      playingStyle: 'Classical & Technical',
      primaryCategory: 'Bowler',
      playerSubCategory: 'Junior players',
      isJunior: true,
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Middle-Order (4-5)',
        keyStrengths: ['Solid Front Foot Defense', 'Back-foot Glide'],
        favoriteShots: 'Square Cut & Sweep'
      },
      bowlingDetails: {
        speedCategory: 'Spin Bowler',
        techniqueStyle: 'Right-Arm Leg-Spin (Wrist Spin & Googly)',
        tacticalRole: 'Middle Overs Strangler',
        stockDelivery: 'Looping Leg-Break with Sharp Turn'
      },
      fieldingPosition: 'Short Mid-Wicket',
      googleConnected: true
    }
  },

  // ==========================================
  // PLAYERS: Junior premiere
  // ==========================================
  kiyara: {
    id: 'usr-kiyara-junior',
    name: 'Kiyara Pillay',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Junior premiere',
    subCategoryTitle: 'U-16 Premier League Rising Star',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level: 16,
    xpProgress: 80,
    tier: 'JUNIOR PREMIERE ELITE',
    specialty: 'Top-Order Classical Bat / Off-Spin (Age 15)',
    isJunior: true,
    guardianInfo: {
      guardianName: 'Devi Pillay',
      guardianEmail: 'devi.pillay.parent@gmail.com',
      guardianPhone: '+44 7700 900543',
      relationship: 'Parent',
      consentStatus: 'verified',
      consentGrantedAt: '2026-08-18T09:30:00Z',
      consentVerificationToken: 'GV-UK-94218-VERIFIED',
      guardianPortalPin: '5932',
      supervisionEnabled: true,
      ccAllCoachCommunications: true,
      notifyOnSessionUpload: true
    },
    juniorPrivacy: {
      isJunior: true,
      hideExactLocation: true,
      disablePublicDiscovery: true,
      allowOnlyAssignedCoaches: true,
      blockDirectMessaging: true,
      disablePublicComments: true,
      stripExifMetadata: true,
      videoPrivacyLevel: 'private-guardian-coach-only',
      assignedCoachIds: ['coach-arin', 'coach-roshan']
    },
    playerProfile: {
      name: 'Kiyara Pillay',
      age: 15,
      dateOfBirth: '2011-06-22',
      playingStyle: 'Classical & Technical',
      primaryCategory: 'All-Rounder',
      playerSubCategory: 'Junior premiere',
      isJunior: true,
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Top-Order (No. 3)',
        keyStrengths: ['Cover Drive & High Elbow', 'Back-foot Punch', 'Wristy On-Drive'],
        favoriteShots: 'Classic Cover Drive & Straight Punch'
      },
      bowlingDetails: {
        speedCategory: 'Spin Bowler',
        techniqueStyle: 'Right-Arm Off-Spin (Finger Spin & Doosra)',
        tacticalRole: 'Middle Overs Strangler',
        stockDelivery: 'Drifting Off-Break on Good Length'
      },
      fieldingPosition: 'Cover / Slips',
      googleConnected: true
    }
  },

  junior_prem_ryan: {
    id: 'usr-ryan-prem',
    name: 'Ryan Walsh',
    role: 'player',
    mainCategory: 'Players',
    playerSubCategory: 'Junior premiere',
    subCategoryTitle: 'Junior Premier Captain & Top-Order Opener',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    level: 19,
    xpProgress: 88,
    tier: 'JUNIOR PREMIERE CAPTAIN',
    specialty: 'Aggressive Opening Bat / Wicket-Keeper (Age 16)',
    isJunior: true,
    guardianInfo: {
      guardianName: 'Mark Walsh',
      guardianEmail: 'mark.walsh@cricketfamily.org',
      guardianPhone: '+44 7700 900228',
      relationship: 'Parent',
      consentStatus: 'verified',
      consentGrantedAt: '2026-08-10T14:20:00Z',
      consentVerificationToken: 'GV-UK-88410-VERIFIED',
      guardianPortalPin: '3310',
      supervisionEnabled: true,
      ccAllCoachCommunications: true,
      notifyOnSessionUpload: true
    },
    juniorPrivacy: {
      isJunior: true,
      hideExactLocation: true,
      disablePublicDiscovery: true,
      allowOnlyAssignedCoaches: true,
      blockDirectMessaging: true,
      disablePublicComments: true,
      stripExifMetadata: true,
      videoPrivacyLevel: 'private-guardian-coach-only',
      assignedCoachIds: ['coach-roshan', 'coach-keeper']
    },
    playerProfile: {
      name: 'Ryan Walsh',
      age: 16,
      dateOfBirth: '2010-03-14',
      playingStyle: 'Innovative / 360-Degree',
      primaryCategory: 'Fielder / Wicket-Keeper',
      playerSubCategory: 'Junior premiere',
      isJunior: true,
      battingDetails: {
        handedness: 'Right-Hand Bat',
        orderPosition: 'Opening Batsman (1-2)',
        keyStrengths: ['Ramp Shot & Upper Cut', 'Pull Shot Over Mid-Wicket', 'Quick Singles'],
        favoriteShots: 'Sweep & Inside-Out Loft'
      },
      fieldingPosition: 'Wicket-Keeper / High Reflex Ring',
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Batting coach
  // ==========================================
  coach_roshan: {
    id: 'coach-roshan',
    name: 'Roshan Srilanka',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Batting coach',
    subCategoryTitle: 'Master Batting & Spin Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    level: 92,
    xpProgress: 95,
    tier: 'ICC MASTER BATTING COACH',
    specialty: 'ICC Level 3 Batting & Spin Specialist (18y Exp)',
    coachProfile: {
      name: 'Roshan Srilanka',
      coachSubCategory: 'Batting coach',
      specialization: 'Batting Masterclass & Biomechanics',
      bioSummary: 'Elite cricket coach and former First-Class veteran with 18+ years developing world-class spin bowlers, top-order stroke-makers, and junior academy prodigies.',
      yearsOfExperience: 18,
      accreditations: ['ICC Level 3 Master Coach', 'SLC Advanced Coaching Accreditation', 'Safeguarding & DBS Cleared Lead'],
      coachingHistory: [
        {
          organizationOrTeam: 'Colombo Premier High Performance Center',
          role: 'Head of Technical Development',
          years: '2020 - Present',
          notableAchievements: 'Mentored 12 national age-group representatives and academy champions'
        },
        {
          organizationOrTeam: 'Sri Lanka U-17 Academy Squad',
          role: 'Lead Batting & Spin Mentor',
          years: '2015 - 2020',
          notableAchievements: 'Guided youth squad to international bilateral championship wins'
        },
        {
          organizationOrTeam: 'Southern Province Cricket Association',
          role: 'Academy Director',
          years: '2010 - 2015',
          notableAchievements: 'Established state-of-the-art telemetry and video analysis program'
        }
      ],
      historicStats: {
        winRatePct: 78.2,
        trophiesWon: 9,
        proPlayersDeveloped: 34,
        matchesCoached: 410
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Bowling coach
  // ==========================================
  coach: {
    id: 'coach-arin',
    name: 'Arin Mishra',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Bowling coach',
    subCategoryTitle: 'Lead Bowling & Pace Director',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
    level: 88,
    xpProgress: 90,
    tier: 'ECB LEVEL 4 PACE SPECIALIST',
    specialty: 'ECB Level 4 High Performance Director (16y Exp)',
    coachProfile: {
      name: 'Arin Mishra',
      coachSubCategory: 'Bowling coach',
      specialization: 'Fast Bowling Pace & Seam Mechanics',
      bioSummary: 'Former international fast bowler and ECB Level 4 High Performance Director with 16+ years developing express pacers, spin technique, and top-order batsmen through real-time telemetry.',
      yearsOfExperience: 16,
      accreditations: ['ICC Level 3 Master Instructor', 'ECB High Performance Specialist', 'Biomechanical Motion Analysis Certified'],
      coachingHistory: [
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
          notableAchievements: 'World Cup Semi-Finals, Average pace increased by 6.2 kph across squad'
        },
        {
          organizationOrTeam: 'Melbourne Elite Cricket Academy',
          role: 'Technical Batting & Bowling Specialist',
          years: '2012 - 2017',
          notableAchievements: 'Developed 7 franchise draft picks'
        }
      ],
      historicStats: {
        winRatePct: 74.5,
        trophiesWon: 6,
        proPlayersDeveloped: 28,
        matchesCoached: 342
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Fielding coach
  // ==========================================
  coach_fielding: {
    id: 'coach-fielding',
    name: 'Callum Vance',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Fielding coach',
    subCategoryTitle: 'High-Performance Fielding & Reflex Coach',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    level: 84,
    xpProgress: 78,
    tier: 'ELITE FIELDING MASTER',
    specialty: 'Reflex Acceleration, Direct Hits & Slip Catching (12y Exp)',
    coachProfile: {
      name: 'Callum Vance',
      coachSubCategory: 'Fielding coach',
      specialization: 'Fielding coach',
      bioSummary: 'Specialist fielding architect integrating vision-tracking drills, diving biomechanics, high-catch radar training, and pressure throwing angles for elite domestic squads.',
      yearsOfExperience: 12,
      accreditations: ['Cricket Australia Level 3 High Performance', 'Visual Reaction Latency Master Trainer'],
      coachingHistory: [
        {
          organizationOrTeam: 'Brisbane Premier League Academy',
          role: 'Lead Fielding & Ground Movement Coach',
          years: '2022 - Present',
          notableAchievements: 'Squad catch conversion increased to 89.4%'
        }
      ],
      historicStats: {
        winRatePct: 71.0,
        trophiesWon: 4,
        proPlayersDeveloped: 19,
        matchesCoached: 220
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Wicket-keeper coach
  // ==========================================
  coach_keeper: {
    id: 'coach-keeper',
    name: 'Alex Stewart-Smith',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Wicket-keeper coach',
    subCategoryTitle: 'Master Glovework & Standing-Up Coach',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    level: 86,
    xpProgress: 82,
    tier: 'SPECIALIST GLOVEWORK MASTER',
    specialty: 'Spin Anticipation, Stumping Speed & Standing Up (15y Exp)',
    coachProfile: {
      name: 'Alex Stewart-Smith',
      coachSubCategory: 'Wicket-keeper coach',
      specialization: 'Wicket-keeping & Fielding Elite',
      bioSummary: 'Dedicated wicket-keeper coach focusing on low center-of-gravity lateral shifts, soft hands, clean takes against mystery spinners, and sub-second stumping execution.',
      yearsOfExperience: 15,
      accreditations: ['ECB Level 3 Wicket-Keeping Specialist', 'Reaction Time Biomechanics Lead'],
      coachingHistory: [
        {
          organizationOrTeam: 'Middlesex County Academy',
          role: 'Lead Wicket-Keeping Consultant',
          years: '2019 - Present',
          notableAchievements: 'Trained 3 county first-team keepers'
        }
      ],
      historicStats: {
        winRatePct: 73.2,
        trophiesWon: 5,
        proPlayersDeveloped: 14,
        matchesCoached: 275
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Fitness training Coach
  // ==========================================
  coach_fitness: {
    id: 'coach-fitness',
    name: 'Dr. Priya Sharma',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Fitness training Coach',
    subCategoryTitle: 'Head of Athletic Performance & S&C',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    level: 90,
    xpProgress: 88,
    tier: 'S&C PERFORMANCE DIRECTOR',
    specialty: 'Bowling Load Management, Sprint Mechanics & ACWR (14y Exp)',
    coachProfile: {
      name: 'Dr. Priya Sharma',
      coachSubCategory: 'Fitness training Coach',
      specialization: 'Fitness training Coach',
      bioSummary: 'Doctorate in Sports Biomechanics and CSCS lead. Specializes in fast bowler lumbar spine protection, rotation power generation, and GPS wearable workload balance.',
      yearsOfExperience: 14,
      accreditations: ['CSCS Certified Strength & Conditioning Specialist', 'BCCI High Performance Conditioning Lead'],
      coachingHistory: [
        {
          organizationOrTeam: 'National Cricket Academy Conditioning Wing',
          role: 'Senior S&C Lead',
          years: '2020 - Present',
          notableAchievements: 'Fast bowling non-contact stress injury rate dropped by 42%'
        }
      ],
      historicStats: {
        winRatePct: 76.8,
        trophiesWon: 7,
        proPlayersDeveloped: 31,
        matchesCoached: 310
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: All-rounder coach
  // ==========================================
  coach_allrounder: {
    id: 'coach-allrounder',
    name: 'David Miller-Ross',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'All-rounder coach',
    subCategoryTitle: 'Dual-Craft Synergy & Match-Tactics Coach',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    level: 87,
    xpProgress: 84,
    tier: 'ALL-ROUNDER SPECIALIST',
    specialty: 'Death Overs Hitting + Yorker Execution (16y Exp)',
    coachProfile: {
      name: 'David Miller-Ross',
      coachSubCategory: 'All-rounder coach',
      specialization: 'All-rounder coach',
      bioSummary: 'Former international all-rounder with expertise in rapid cognitive role transitions between bowling spells and high-pressure finishing batting innings.',
      yearsOfExperience: 16,
      accreditations: ['ICC Level 3 All-Rounder Specialist', 'Tactical Matchplay Director'],
      coachingHistory: [
        {
          organizationOrTeam: 'Cape Town Cricket Institute',
          role: 'Head of All-Rounder Development',
          years: '2018 - Present',
          notableAchievements: 'Graduated 6 franchise all-rounders'
        }
      ],
      historicStats: {
        winRatePct: 75.0,
        trophiesWon: 6,
        proPlayersDeveloped: 22,
        matchesCoached: 290
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Physio coach
  // ==========================================
  coach_physio: {
    id: 'coach-physio',
    name: 'Dr. Alistair Finch',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Physio coach',
    subCategoryTitle: 'Lead Sports Physiotherapist & Rehab Director',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    level: 91,
    xpProgress: 92,
    tier: 'LEAD SPORTS PHYSIO',
    specialty: 'Shoulder Impingement, Lumbar Stress & Return-To-Play (17y Exp)',
    coachProfile: {
      name: 'Dr. Alistair Finch',
      coachSubCategory: 'Physio coach',
      specialization: 'Physio coach',
      bioSummary: 'Chartered Musculoskeletal Physiotherapist with 17+ years treating elite pacers and batsmen. Directs pitch-side emergency medical response and gradual bowling volume rebuilds.',
      yearsOfExperience: 17,
      accreditations: ['MSc Sports Physiotherapy', 'HCPC Registered', 'ICC Pitch-side Trauma Certified'],
      coachingHistory: [
        {
          organizationOrTeam: 'Lancashire High Performance Center',
          role: 'Chief Medical & Physiotherapy Director',
          years: '2019 - Present',
          notableAchievements: 'Pioneered 6-phase stress fracture return protocol'
        }
      ],
      historicStats: {
        winRatePct: 79.0,
        trophiesWon: 8,
        proPlayersDeveloped: 40,
        matchesCoached: 360
      },
      googleConnected: true
    }
  },

  // ==========================================
  // COACH: Umpires
  // ==========================================
  official_umpire: {
    id: 'official-nigel',
    name: 'Nigel Llewellyn',
    role: 'coach',
    mainCategory: 'Coach',
    coachSubCategory: 'Umpires',
    subCategoryTitle: 'Elite Panel Match Official & DRS Assessor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    level: 95,
    xpProgress: 98,
    tier: 'ICC ELITE PANEL OFFICIAL',
    specialty: 'MCC Laws of Cricket (Law 42), DRS Ball-Tracking & Match Adjudication',
    officialCertifications: [
      'ICC Elite Panel of Umpires',
      'MCC Law 42 Code of Conduct Certified',
      'Hawkeye DRS Ball-Tracking Accredited',
      'Pitch & Ground Condition Safety Assessor'
    ],
    coachProfile: {
      name: 'Nigel Llewellyn',
      coachSubCategory: 'Umpires',
      specialization: 'Umpires',
      bioSummary: 'Veteran international umpire with 22+ years officiating over 200 Test, ODI, and T20 matches. Provides player education on LBW trajectory, soft signals, and DRS review strategy.',
      yearsOfExperience: 22,
      accreditations: ['ICC Elite Panel Member', 'MCC Laws of Cricket Master Educator', 'DRS Telemetry Operator'],
      coachingHistory: [
        {
          organizationOrTeam: 'ICC International Panel',
          role: 'Senior Match Official & Umpire Educator',
          years: '2014 - Present',
          notableAchievements: 'Officiated 3 ICC World Cup Finals, DRS accuracy rating 98.4%'
        }
      ],
      historicStats: {
        winRatePct: 98.4,
        trophiesWon: 0,
        proPlayersDeveloped: 65,
        matchesCoached: 450
      },
      googleConnected: true
    }
  },

  // ==========================================
  // ADMINS: Platform Admin
  // ==========================================
  admin: {
    id: 'admin-root',
    name: 'Pitch Precision Admin',
    role: 'admin',
    mainCategory: 'Admins',
    adminSubCategory: 'Platform Admin',
    subCategoryTitle: 'System Root & Infrastructure Director',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UbOGjtoAVNWMuSmdspfUFQ9TOmi-V716igZMEwTyi6-WPgWD4cPt-jArIzDSHDdIwTxt6ohu0CS2Zt10MNda5mBcxL0yxj-lzvgKFADO0z7IbW6vYrkzFbhkKh_Up-IOLnyMtHdlbgmkUiFe2rZmNEY5TZFlHNjIEwV04zGOPmCTU1y-mkWEWuTE_JSf7SRVH1yiLjNCvNFGQya-o3HtLMyXl8y8IPWFMsnc8g1tgzYTK4FX4n8ROGBuY',
    level: 99,
    xpProgress: 100,
    tier: 'SYSTEM ROOT',
    specialty: 'Telemetry & Biometrics Infrastructure Node'
  },

  // ==========================================
  // PARENTS & GUARDIANS: Primary Guardians
  // ==========================================
  parent: {
    id: 'usr-parent-sarah',
    name: 'Sarah Chen',
    role: 'parent',
    mainCategory: 'Parents',
    parentSubCategory: 'Primary Guardian',
    subCategoryTitle: 'Parent of Liam Chen (Junior Fast Bowler)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    level: 18,
    xpProgress: 60,
    tier: 'VERIFIED GUARDIAN',
    specialty: 'Junior Athlete Supervision & Workload Safeguarding',
    parentProfile: {
      childUserId: 'usr-liam-junior',
      childName: 'Liam Chen',
      childAge: 14,
      childTier: 'JUNIOR ACADEMY RISING STAR',
      relationship: 'Mother & Legal Guardian',
      weeklyVolumeLimitBalls: 120,
      currentWeekBallsBowled: 78,
      safeguardingStatus: 'Verified & Active',
      lastCoachNote: 'Liam bowled with superb upright seam alignment today. Keep hydration high for Friday match sim.',
      nextSessionTime: 'Tomorrow • 4:30 PM (Net Bay 3)'
    }
  },

  parent_anita: {
    id: 'usr-parent-anita',
    name: 'Anita Patel',
    role: 'parent',
    mainCategory: 'Parents',
    parentSubCategory: 'Primary Guardian',
    subCategoryTitle: 'Parent of Aarav Patel (Junior Leg-Spinner)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    level: 22,
    xpProgress: 70,
    tier: 'VERIFIED GUARDIAN',
    specialty: 'Spin Development & School-Club Balance',
    parentProfile: {
      childUserId: 'usr-aarav-junior',
      childName: 'Aarav Patel',
      childAge: 12,
      childTier: 'JUNIOR TALENT PATHWAY',
      relationship: 'Mother & Legal Guardian',
      weeklyVolumeLimitBalls: 150,
      currentWeekBallsBowled: 92,
      safeguardingStatus: 'Verified & Active',
      lastCoachNote: 'Great wrist rotation on the wrong-un drill. Ensure 1 rest day before Sunday league fixture.',
      nextSessionTime: 'Thursday • 5:00 PM (Spin Nets)'
    }
  },

  // ==========================================
  // ADMINS: Club Admin
  // ==========================================
  admin_club: {
    id: 'admin-club',
    name: 'Heather Bell',
    role: 'club_admin',
    mainCategory: 'Admins',
    adminSubCategory: 'Club Admin',
    subCategoryTitle: 'Club General Manager & Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    level: 89,
    xpProgress: 90,
    tier: 'CLUB DIRECTOR',
    specialty: 'Roster Allocation, Turf Maintenance & Facility Scheduling'
  },

  // ==========================================
  // ADMINS: Safeguarding Admin
  // ==========================================
  admin_safeguard: {
    id: 'admin-safeguard',
    name: 'Devi Pillay',
    role: 'security_admin',
    mainCategory: 'Admins',
    adminSubCategory: 'Safeguarding Admin',
    subCategoryTitle: 'Designated Safeguarding Lead (DSL) & Compliance Officer',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    level: 96,
    xpProgress: 99,
    tier: 'CHIEF SAFEGUARDING LEAD',
    specialty: 'Child Welfare, DBS / Vetting Verification & Incident Quarantine'
  }
};

export const allMockUserProfiles: UserProfile[] = Object.values(mockUsers);

export const mockRecentSessions: SessionRecord[] = [
  {
    id: 'sess-1',
    title: 'Fast Bowling',
    type: 'Net Session',
    date: 'Today',
    deliveriesCount: 36,
    score: 85,
    topSpeed: 142,
    insight: 'Masterclass Insight +'
  },
  {
    id: 'sess-2',
    title: 'Batting',
    type: 'Match Sim',
    date: '2 days ago',
    duration: '45 mins',
    score: 72,
    timing: 'Timing: Good'
  },
  {
    id: 'sess-3',
    title: 'Seam & Swing Control',
    type: 'Net Session',
    date: '4 days ago',
    deliveriesCount: 48,
    score: 91,
    topSpeed: 144,
    insight: 'Seam release optimal'
  },
  {
    id: 'sess-4',
    title: 'Short Ball Execution',
    type: 'Live Match',
    date: 'Last week',
    deliveriesCount: 24,
    score: 79,
    topSpeed: 139,
    timing: 'Height: Sharp'
  }
];

export const mockTechniqueScores: TechniqueScores = {
  power: 88,
  timing: 92,
  placement: 78,
  footwork: 84
};

export const mockMatches: MatchStat[] = [
  {
    opponent: 'vs AUS',
    dateLocation: 'Nov 12, MCG',
    score: 84,
    sparkline: [15, 18, 10, 12, 5, 8, 2],
    isPositive: true,
    ballsFaced: 58,
    fours: 9,
    sixes: 2,
    strikeRate: 144.8
  },
  {
    opponent: 'vs IND',
    dateLocation: 'Nov 08, SCG',
    score: 112,
    sparkline: [20, 15, 18, 10, 12, 4, 2],
    isPositive: true,
    ballsFaced: 78,
    fours: 12,
    sixes: 4,
    strikeRate: 143.6
  },
  {
    opponent: 'vs SA',
    dateLocation: 'Nov 02, Optus',
    score: 45,
    sparkline: [5, 8, 15, 12, 18, 15, 10],
    isPositive: false,
    ballsFaced: 36,
    fours: 5,
    sixes: 1,
    strikeRate: 125.0
  },
  {
    opponent: 'vs ENG',
    dateLocation: 'Oct 28, Adelaide',
    score: 96,
    sparkline: [12, 14, 8, 10, 6, 3, 1],
    isPositive: true,
    ballsFaced: 64,
    fours: 11,
    sixes: 3,
    strikeRate: 150.0
  }
];

export const mockTrainingHistory: MatchStat[] = [
  {
    opponent: 'Net Pace Sim #4',
    dateLocation: 'Nov 14, High Performance Center',
    score: 94,
    sparkline: [18, 15, 12, 8, 5, 4, 1],
    isPositive: true,
    ballsFaced: 60,
    fours: 14,
    sixes: 5,
    strikeRate: 156.6
  },
  {
    opponent: 'Spin Corridor Drill',
    dateLocation: 'Nov 10, Indoor Turf',
    score: 88,
    sparkline: [10, 12, 9, 6, 4, 2, 2],
    isPositive: true,
    ballsFaced: 45,
    fours: 8,
    sixes: 2,
    strikeRate: 140.0
  },
  {
    opponent: 'Short Ball Defense',
    dateLocation: 'Nov 05, Bouncer Track',
    score: 64,
    sparkline: [4, 6, 12, 14, 16, 12, 8],
    isPositive: false,
    ballsFaced: 30,
    fours: 4,
    sixes: 0,
    strikeRate: 110.0
  }
];

export const mockDrills: DrillItem[] = [
  {
    id: 'drill-cover-drive',
    title: 'Perfecting the Cover Drive',
    category: 'Batting',
    level: 'Pro',
    duration: '15 Min',
    durationMinutes: 15,
    coach: 'Coach Carter',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUhRX49VlsH8nMtvYrYR6jIqwrPVjIbe72z4ZzXbtfKRuvmO_mNIQOLg2nRiHHvYrSsnldqFsRhzwlEHkcFSbsEBm0RfAF3SoWKD8s6IBueHFTV9utstjjnuEPxIPN6wBelpLs5QDqUGW8j4vISoo62nNrAjWG_ELjTGOGPvS89yAeHzBQ5c3I4NCoVyGjhh9BNLb07UmTfhB_g3zyk_DgVwHdryYBVF6No2EmBvstoK1GZSoFnXr5',
    isDrillOfDay: true,
    description: 'Master the weight transfer and head position required for a technically sound cover drive.',
    focusAreas: [
      {
        title: 'Head Stillness',
        description: 'Keep head over ball',
        icon: 'accessibility_new'
      },
      {
        title: 'High Elbow',
        description: 'Full extension',
        icon: 'straighten'
      }
    ],
    steps: [
      {
        number: 1,
        title: 'Stance & Balance',
        description: 'Focus on a stable base with knees slightly flexed.'
      },
      {
        number: 2,
        title: 'Initial Movement',
        description: 'Front foot movement towards the line of the pitch.'
      },
      {
        number: 3,
        title: 'Head Position',
        description: 'Keeping head positioned directly over the ball at contact.'
      },
      {
        number: 4,
        title: 'The Swing',
        description: 'High elbow, top-hand dominance, and full fluid follow through.'
      }
    ],
    coachTip: '"Focus on the red circle tracking your head; any dip here will lose you power."'
  },
  {
    id: 'drill-crease-movement',
    title: 'Dynamic Crease Movement',
    category: 'Batting',
    level: 'Int/Pro',
    duration: '8m',
    durationMinutes: 8,
    coach: 'Coach Mark Richardson',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkB5N0TTbKi9jRtbbTpMmF5v7Xd_UV2tFgR8HcGjhjz1kMWaEtDdqcBHoz4skX1kJU9DNtg-jA8OOnRZfkXkSo9n0udxxT9Va20LTCGD2wIApRUizg7o8sWD_DrzxgaSMjvYxn3m9BMIsLzmTCTUpxDVG-tYffANutnuEPWrLdsplqektJOaOJcqPo_MkpoXgdsdkROHZZFCHKKvpnxyJU4Wn9wh5Aubu_TbjBD5SmVG2t_6U819TN',
    progressPercent: 30,
    description: 'Rapid foot repositioning against swinging and seaming deliveries.',
    focusAreas: [
      {
        title: 'Weight Shifting',
        description: 'Fast toe-pivot transfer',
        icon: 'directions_run'
      },
      {
        title: 'Crease Depth',
        description: 'Adjusting strike point',
        icon: 'straighten'
      }
    ],
    steps: [
      { number: 1, title: 'Base Alignment', description: 'Align back toe with popping crease.' },
      { number: 2, title: 'Press & Trigger', description: 'Short back-and-across trigger movement.' },
      { number: 3, title: 'Adjustment Drive', description: 'Transfer center of mass smoothly.' }
    ],
    coachTip: '"Stay light on balls of your feet to react to unexpected bounce."'
  },
  {
    id: 'drill-wrist-position',
    title: 'Wrist Position Basics',
    category: 'Bowling',
    level: 'Beginner',
    duration: '12m',
    durationMinutes: 12,
    coach: 'Coach Mark Richardson',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAocjwhFczAJ0873KBgxVtPB2QzVMDnGWqHE1UwEqdjBvwtn6H_rVdzMOWTmNFuUD5hYusLaRNX6VFIs8eQe6Vl85mj4gPL2mZPGFwEonLodOgJC_ETiZSSP5A13Pwz-pyGJ_26CWzcYD3KHWKKlbxv0dnCQZBLPSHDJ2BmudVl2rGH4wJv7oLTyqB-lGtn4cVRMRsZfflYki_RhdND-_zLYHFCVNXWdsGp6VwuY8VJBIxtBNOn86rp',
    isNew: true,
    description: 'Lock in seam alignment and upright release angles for enhanced seam movement.',
    focusAreas: [
      {
        title: 'Seam Upright',
        description: 'Point seam towards first slip',
        icon: 'sports_cricket'
      },
      {
        title: 'Wrist Snap',
        description: 'Crisp release snap',
        icon: 'touch_app'
      }
    ],
    steps: [
      { number: 1, title: 'Grip Setup', description: 'Index and middle finger spanning seam.' },
      { number: 2, title: 'Cocked Wrist', description: 'Maintain locked wrist until ear height.' },
      { number: 3, title: 'Downward Snap', description: 'Flick fingers behind the ball.' }
    ],
    coachTip: '"Think of pulling down a window shade at release point."'
  },
  {
    id: 'drill-explosive-core',
    title: 'Explosive Core Rotation',
    category: 'Fitness',
    level: 'Int/Pro',
    duration: '20m',
    durationMinutes: 20,
    coach: 'Coach Samantha Ray',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJVDX-zodRM4YwMd0rpZ4hVC-Z3vygxizWjg9wiOmuFXPBenmoBqWNCwzezGwDO9z5T5jQd__bxuB-F_dy5sPulq1a_z_7IovpKFzkXnbBCKeNbtl94aNzJxvk6_vzmqN1LSQk81o38WPgKyxLZTLWwmNjHbJCfaxYPQmSCe5ed9eYkAU67UH0z7AbabPm38qtFNEI_VhIBk2s3e1S_rGT7-WN9bp2Tuw8T2MAyB4WoT5Rr4DP8dGl',
    description: 'Build rotational kinetic chain torque for boundary clearing power and faster arm speed.',
    focusAreas: [
      {
        title: 'Torque Building',
        description: 'Hip-to-shoulder separation',
        icon: 'bolt'
      },
      {
        title: 'Deceleration',
        description: 'Core stability brace',
        icon: 'shield'
      }
    ],
    steps: [
      { number: 1, title: 'Medicine Ball Slam', description: '3 sets of 10 explosive diagonal rotations.' },
      { number: 2, title: 'Cable Chop Press', description: 'Low to high kinetic drives.' },
      { number: 3, title: 'Isometric Brace', description: 'Hold finish posture for 3 seconds.' }
    ],
    coachTip: '"Power is generated from your hips, not your arms alone."'
  },
  {
    id: 'drill-heavy-bat',
    title: 'Heavy Bat Swings',
    category: 'Batting',
    level: 'Pro',
    duration: '10m',
    durationMinutes: 10,
    coach: 'Coach Carter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfXyhMV5uHOA_fblbsF46zKg8Rg6Ir1qRco2kfsFtmgltnSPNRpd_dHpL1KRY7kFbHO6kG1ya0Ux9Eald0k3TCl7fevPytRtQ9-iglJchxhL0XdAdRXyqnHwWK2kpaisSgxyqoQLkPa-pEvlu0ihLHh1XuF_XaP8SbtBwVSxHZnb7sEZ4a4vu0VV7vNgPT5MyL7XEFxOOKkqlPRFhTiWOTzcmJdDEtwcw5V2RYNe9BS1qJCrPz2s_a',
    description: 'Overload training designed to amplify bat path acceleration and fast muscle twitch response.',
    focusAreas: [
      {
        title: 'Bat Speed',
        description: 'Overload-underload method',
        icon: 'speed'
      },
      {
        title: 'Path Consistency',
        description: 'Grooved swing mechanics',
        icon: 'timeline'
      }
    ],
    steps: [
      { number: 1, title: 'Weighted Tee Drives', description: '20 dry swings focusing on high elbow.' },
      { number: 2, title: 'Standard Bat Contrast', description: '10 explosive full power drives.' },
      { number: 3, title: 'Speed Tracking Check', description: 'Log exit velocity telemetry.' }
    ],
    coachTip: '"Don’t let the weight drag your back shoulder down."'
  }
];

export const mockTelestration: TelestrationFeedback = {
  id: 'fb-cover-drive-01',
  sessionTitle: 'Cover Drive Mechanics',
  sessionDate: 'Session: May 24, 2024',
  videoDuration: '0:28',
  videoCurrentTime: '0:12',
  videoProgress: 45,
  frameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF2zkt7HiJBkOubcIhEyE9evYb6SNXruUycT4ZXOlv_ujVyqjEIkunsEspRZeXwBK7coke_mYqjAbs4v-d3uM8P2W8EfX9vOA3PYzI2LesZ1rAQ03FgiIDFwkU4VMffqRBWOBeCMbVzdOH00wHbare88_nrKVDisHI5lYs9hULdCzv7VkuNZJC01ueMNRFBmNVj_CspRxg1kKBMHmQYe-VzK_hIatzqi4B79kYWMlJvTxiqxhmRfsZ',
  coachName: 'Arin Mishra',
  coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
  coreFocus: '"Keep your head absolutely still through the drive. Your weight is transferring well, but the slight head bob at contact is causing inconsistent timing. Watch the red circle in the video."',
  strengths: [
    'Strong base setup',
    'High elbow on backswing',
    'Fluid initial front stride'
  ],
  adjustments: [
    'Head drops 2cm pre-impact',
    'Front foot slightly closed'
  ],
  assignedDrillId: 'drill-cover-drive',
  assignedDrillTitle: 'Cone Touch & Drive',
  assignedDrillSets: '(3 Sets)'
};
