import { UserProfile, SessionRecord, MatchStat, TechniqueScores, DrillItem, TelestrationFeedback } from '../types';

export const mockUsers: Record<'player' | 'coach' | 'admin', UserProfile> = {
  player: {
    id: 'usr-alex',
    name: 'Alex Mercer',
    role: 'player',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
    level: 42,
    xpProgress: 75,
    tier: 'ELITE TIER',
    specialty: 'Right-Arm Fast / Top-Order Bat'
  },
  coach: {
    id: 'coach-mark',
    name: 'Coach Mark Richardson',
    role: 'coach',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
    level: 88,
    xpProgress: 90,
    tier: 'HIGH PERFORMANCE COACH',
    specialty: 'ICC Level 3 Master Instructor'
  },
  admin: {
    id: 'admin-root',
    name: 'Pitch Precision Admin',
    role: 'admin',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UbOGjtoAVNWMuSmdspfUFQ9TOmi-V716igZMEwTyi6-WPgWD4cPt-jArIzDSHDdIwTxt6ohu0CS2Zt10MNda5mBcxL0yxj-lzvgKFADO0z7IbW6vYrkzFbhkKh_Up-IOLnyMtHdlbgmkUiFe2rZmNEY5TZFlHNjIEwV04zGOPmCTU1y-mkWEWuTE_JSf7SRVH1yiLjNCvNFGQya-o3HtLMyXl8y8IPWFMsnc8g1tgzYTK4FX4n8ROGBuY',
    level: 99,
    xpProgress: 100,
    tier: 'SYSTEM ROOT',
    specialty: 'Telemetry & Biometrics Infrastructure'
  }
};

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
  coachName: 'Coach Mark Richardson',
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
