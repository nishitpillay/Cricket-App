export type ScreenType = 
  | 'home' 
  | 'record' 
  | 'video-analysis'
  | 'stats' 
  | 'drills' 
  | 'drills-vault'
  | 'academy'
  | 'scenarios'
  | 'masterclasses'
  | 'planner'
  | 'chalkboard'
  | 'feedback' 
  | 'drill-details' 
  | 'drill-practice' 
  | 'auth-player' 
  | 'auth-coach' 
  | 'auth-admin';

export type UserRole = 'player' | 'coach' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  level: number;
  xpProgress: number; // 0 - 100
  tier: string;
  specialty: string;
}

export interface SessionRecord {
  id: string;
  title: string;
  type: 'Net Session' | 'Match Sim' | 'Live Match' | 'Masterclass';
  date: string;
  deliveriesCount?: number;
  duration?: string;
  score: number;
  topSpeed?: number;
  insight?: string;
  timing?: string;
  tagColor?: string;
}

export interface MatchStat {
  opponent: string;
  dateLocation: string;
  score: number;
  sparkline: number[];
  isPositive: boolean;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
}

export interface TechniqueScores {
  power: number;
  timing: number;
  placement: number;
  footwork: number;
}

export interface DrillItem {
  id: string;
  title: string;
  category: 'Batting' | 'Bowling' | 'Fielding' | 'Fitness' | 'Masterclass';
  subCategory?: 'Spin Bowling' | 'Fast Bowling' | 'Slip Fielding' | 'Power Hitting' | 'Wicketkeeping' | 'Ground Fielding';
  level: 'Beginner' | 'Int/Pro' | 'Pro' | 'Elite';
  duration: string;
  durationMinutes: number;
  coach: string;
  coachAvatar?: string;
  image: string;
  isDrillOfDay?: boolean;
  isNew?: boolean;
  isOfflineCached?: boolean;
  equipment?: string[];
  tags?: string[];
  progressPercent?: number;
  description: string;
  focusAreas: {
    title: string;
    description: string;
    icon: string;
  }[];
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  coachTip: string;
}

export interface TelestrationFeedback {
  id: string;
  sessionTitle: string;
  sessionDate: string;
  videoDuration: string;
  videoCurrentTime: string;
  videoProgress: number; // 0 - 100
  frameImage: string;
  coachName: string;
  coachAvatar: string;
  coreFocus: string;
  strengths: string[];
  adjustments: string[];
  assignedDrillId: string;
  assignedDrillTitle: string;
  assignedDrillSets: string;
}

// ----------------------
// NEW TYPES FOR REQUESTED FEATURES
// ----------------------

export interface WagonWheelShot {
  id: string;
  angle: number; // 0 - 360 degrees (0 = straight down ground, 90 = cover/point offside, 270 = square leg/midwicket legside)
  distance: number; // 0 - 100% of boundary
  runs: 0 | 1 | 2 | 3 | 4 | 6;
  shotType: 'Cover Drive' | 'Straight Drive' | 'Pull Shot' | 'Cut Shot' | 'Sweep' | 'Flick' | 'Upper Cut' | 'Slog Sweep' | 'Defensive';
  sector: 'Fine Leg' | 'Square Leg' | 'Mid Wicket' | 'Long On' | 'Long Off' | 'Cover' | 'Point' | 'Third Man';
  ballLength?: 'Full' | 'Good' | 'Short' | 'Yorker';
  date: string;
}

export interface PitchMapDelivery {
  id: string;
  x: number; // 0 to 100 (horizontal line across wickets: 0 = far outside off, 50 = middle stump, 100 = down leg)
  y: number; // 0 to 100 (vertical length: 0 = batting crease / yorker, 25 = full, 55 = good length, 80 = short, 100 = bouncer)
  length: 'Yorker' | 'Full' | 'Good Length' | 'Short' | 'Bouncer';
  line: 'Outside Off' | '4th Stump' | 'Off Stump' | 'Middle Stump' | 'Leg Stump' | 'Down Leg';
  speedKph: number;
  seamDeviationDeg?: number; // e.g. +2.4 deg outswing
  outcome: 'Dot' | 'Wicket' | 'Single' | 'Boundary' | 'Play & Miss' | 'Edge';
  isWicket?: boolean;
}

export interface ScenarioChoice {
  id: string;
  title: string;
  description: string;
  fieldSetup: string;
  deliveryType: string;
  riskReward: 'Safe' | 'Aggressive' | 'Tactical Gamble';
  scoreImpact: number; // out of 100
  coachVerdict: string;
  isOptimal: boolean;
  simulatedOutcome: {
    result: string;
    runsConcededOrScored: number;
    wicketChance: string;
    visualAnimation: string;
  };
}

export interface ScenarioItem {
  id: string;
  title: string;
  badge: string;
  format: 'T20 Death Overs' | 'Powerplay Blast' | 'Test Match Grunt' | 'Spin Web' | 'DLS Chase';
  matchContext: {
    requiredRuns?: number;
    oversRemaining?: number;
    wicketsLeft?: number;
    pitchCondition: string;
    weatherCondition?: string;
  };
  targetBatsman: {
    name: string;
    style: string;
    strengths: string[];
    weaknesses: string[];
  };
  problemStatement: string;
  choices: ScenarioChoice[];
}

export interface TacticalMasterclass {
  id: string;
  title: string;
  coach: string;
  coachRole: string;
  coachAvatar: string;
  badge: string;
  duration: string;
  overview: string;
  videoThumbnail: string;
  videoEmbedUrl?: string;
  keyTactics: {
    title: string;
    description: string;
    icon: string;
  }[];
  chapters: {
    timestamp: string;
    title: string;
    summary: string;
  }[];
  whiteboardTakeaway: string;
}

export interface TrainingPlanBlock {
  id: string;
  durationMinutes: number;
  phaseName: 'Dynamic Warm-up' | 'Biomechanics Focus' | 'Net Execution' | 'Match Pressure Scenario' | 'Cool Down & Recovery';
  activityTitle: string;
  description: string;
  equipment: string[];
  intensity: 'Low' | 'Medium' | 'High' | 'Max';
  icon: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  targetDurationMinutes: 30 | 45 | 60 | 90;
  skillFocus: 'Batting' | 'Fast Bowling' | 'Spin Bowling' | 'Fielding & Reflexes' | 'All-Rounder Match Prep';
  intensity: 'Medium' | 'High' | 'Elite';
  summary: string;
  blocks: TrainingPlanBlock[];
}

export interface FieldPlacementPreset {
  id: string;
  name: string;
  format: string;
  description: string;
  positions: {
    id: string;
    label: string;
    x: number; // 0 - 100 on 2D oval
    y: number; // 0 - 100 on 2D oval
    role: 'Slip' | 'Keeper' | 'Ring' | 'Boundary' | 'Close In' | 'Bowler';
  }[];
}
