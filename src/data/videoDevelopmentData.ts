import {
  CricketDiscipline,
  VideoKeyframe,
  CoachVideoComment,
  ComparisonPair,
  VideoProgressEntry,
  QuickUploadVideoPreset
} from '../types';

export const mockVideoDisciplines: {
  id: CricketDiscipline;
  label: string;
  icon: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'batting',
    label: 'Batting Mechanics',
    icon: 'sports_cricket',
    badge: 'Front-foot & Backlift',
    description: 'Slow-motion backlift path, head-over-the-ball alignment, high lead elbow, and contact point trajectory.'
  },
  {
    id: 'bowling',
    label: 'Bowling Biomechanics',
    icon: 'flare',
    badge: '120 FPS High-Speed',
    description: 'Crease gather, front-foot brace rigidity, hip-shoulder separation, and wrist seam angle release.'
  },
  {
    id: 'fielding',
    label: 'Fielding & Reflexes',
    icon: 'pan_tool',
    badge: 'Reaction & Pickup',
    description: 'Split-step reaction time, low-center-of-gravity slip catching, and direct hit throwing release speed.'
  }
];

export const mockQuickPresets: QuickUploadVideoPreset[] = [
  {
    id: 'preset-cover-drive',
    title: 'Cover Drive - Off-Stump Half-Volley',
    discipline: 'batting',
    duration: '3.6s',
    resolution: '1080p @ 120 FPS',
    fps: 120,
    techniqueTags: ['High Elbow', 'Head Alignment', 'Weight Transfer'],
    keyMoment: 'Impact Frame 72 (2.0s)',
    sourceType: 'sample_reel'
  },
  {
    id: 'preset-pull-shot',
    title: 'Short Ball Pull Shot - Hip Swivel',
    discipline: 'batting',
    duration: '3.2s',
    resolution: '1080p @ 120 FPS',
    fps: 120,
    techniqueTags: ['Back-Foot Transfer', 'Roll Wrists', 'Balance Base'],
    keyMoment: 'Swivel Frame 58 (1.6s)',
    sourceType: 'sample_reel'
  },
  {
    id: 'preset-outswing-142',
    title: '142.4 km/h Late Outswing Release',
    discipline: 'bowling',
    duration: '4.2s',
    resolution: '4K @ 240 FPS',
    fps: 240,
    techniqueTags: ['172° Front Leg Brace', 'Seam Cocked 22°', 'Deceleration'],
    keyMoment: 'Release Frame 96 (2.2s)',
    sourceType: 'sample_reel'
  },
  {
    id: 'preset-inswing-yorker',
    title: 'Inswing Blockhole Yorker - Death Overs',
    discipline: 'bowling',
    duration: '3.8s',
    resolution: '1080p @ 120 FPS',
    fps: 120,
    techniqueTags: ['Wrist Snap', 'Upright Seam', 'Toe-Crusher Line'],
    keyMoment: 'Release Frame 84 (1.9s)',
    sourceType: 'sample_reel'
  },
  {
    id: 'preset-slip-catch',
    title: '1st Slip Low Diving Reaction Catch',
    discipline: 'fielding',
    duration: '2.8s',
    resolution: '1080p @ 120 FPS',
    fps: 120,
    techniqueTags: ['0.28s Split-Step', 'Fingers Pointing Down', 'Soft Hands'],
    keyMoment: 'Catch Frame 46 (1.3s)',
    sourceType: 'sample_reel'
  },
  {
    id: 'preset-runout-throw',
    title: 'Cover Point Pick & Direct-Hit Release',
    discipline: 'fielding',
    duration: '3.4s',
    resolution: '1080p @ 120 FPS',
    fps: 120,
    techniqueTags: ['One-Hand Scoop', 'Crow-Hop Transfer', 'Stump Sightline'],
    keyMoment: 'Throw Frame 62 (1.8s)',
    sourceType: 'sample_reel'
  }
];

export const mockKeyframesByDiscipline: Record<CricketDiscipline, VideoKeyframe[]> = {
  batting: [
    {
      id: 'kf-bat-1',
      name: '1. Stance & Eye Level',
      timestampSec: 0.4,
      frameIndex: 24,
      discipline: 'batting',
      description: 'Relaxed tap, eyes parallel to horizon, head steady over middle stump.',
      optimalAngle: '0.0° head tilt',
      playerAngle: '0.4° tilt',
      status: 'optimal',
      highlightPoint: { x: 395, y: 125, label: 'Eye Line Steady' },
      biomechanicCue: 'Maintain level eyeline to judge length early.'
    },
    {
      id: 'kf-bat-2',
      name: '2. Backlift Peak & Trigger',
      timestampSec: 1.1,
      frameIndex: 66,
      discipline: 'batting',
      description: 'Bat pointing towards second slip, slight forward press initiation.',
      optimalAngle: '45° backlift arc',
      playerAngle: '42° arc',
      status: 'optimal',
      highlightPoint: { x: 440, y: 155, label: 'Backlift Apex' },
      biomechanicCue: 'Toe of the bat pointing towards gully/second slip.'
    },
    {
      id: 'kf-bat-3',
      name: '3. Front-Foot Plant & Knee Flex',
      timestampSec: 1.6,
      frameIndex: 96,
      discipline: 'batting',
      description: 'Long stride towards the pitch of the ball, toe pointing towards cover.',
      optimalAngle: '125° knee flexion',
      playerAngle: '118° knee flexion',
      status: 'warning',
      highlightPoint: { x: 445, y: 350, label: 'Stride Plant' },
      biomechanicCue: 'Stride close to ball pitch without over-reaching.'
    },
    {
      id: 'kf-bat-4',
      name: '4. Point of Impact (Sweet Spot)',
      timestampSec: 2.1,
      frameIndex: 126,
      discipline: 'batting',
      description: 'Ball struck directly under the eyes with full face presentation.',
      optimalAngle: '90.0° lead elbow',
      playerAngle: '92.4° lead elbow',
      status: 'optimal',
      highlightPoint: { x: 410, y: 345, label: 'Impact Point' },
      biomechanicCue: 'Lead shoulder dipping into ball line, head over contact.'
    },
    {
      id: 'kf-bat-5',
      name: '5. High Elbow Follow-Through',
      timestampSec: 2.9,
      frameIndex: 174,
      discipline: 'batting',
      description: 'High check finish, bat pointing towards mid-off, weight balanced on front foot.',
      optimalAngle: 'Full extension',
      playerAngle: '94% extension',
      status: 'optimal',
      highlightPoint: { x: 420, y: 210, label: 'High Check Finish' },
      biomechanicCue: 'Hold shape for 1.5 seconds to ensure total balance.'
    }
  ],
  bowling: [
    {
      id: 'kf-bowl-1',
      name: '1. Run-Up Gather & Bound',
      timestampSec: 0.5,
      frameIndex: 30,
      discipline: 'bowling',
      description: 'Upright torso gather into the pre-delivery leap.',
      optimalAngle: '15° forward lean',
      playerAngle: '14° forward lean',
      status: 'optimal',
      highlightPoint: { x: 360, y: 140, label: 'Gather Apex' },
      biomechanicCue: 'Build progressive linear momentum without stutter.'
    },
    {
      id: 'kf-bowl-2',
      name: '2. Back-Foot Contact & Alignment',
      timestampSec: 1.2,
      frameIndex: 72,
      discipline: 'bowling',
      description: 'Back foot parallel to return crease, hips coiled 35°.',
      optimalAngle: '35° hip rotation',
      playerAngle: '38° hip rotation',
      status: 'optimal',
      highlightPoint: { x: 350, y: 360, label: 'Back Foot Plant' },
      biomechanicCue: 'Lock the back ankle to transfer forward kinetic energy.'
    },
    {
      id: 'kf-bowl-3',
      name: '3. Front-Foot Brace & Plant',
      timestampSec: 1.8,
      frameIndex: 108,
      discipline: 'bowling',
      description: 'Rigid front knee lockout creates catapult fulcrum for pace.',
      optimalAngle: '175° locked knee',
      playerAngle: '172.4° braced',
      status: 'optimal',
      highlightPoint: { x: 450, y: 360, label: 'Front Leg Fulcrum' },
      biomechanicCue: 'Do not buckle front knee upon landing.'
    },
    {
      id: 'kf-bowl-4',
      name: '4. Release Point & Wrist Cock',
      timestampSec: 2.2,
      frameIndex: 132,
      discipline: 'bowling',
      description: 'High arm release point at 11:30 position with wrist cocked behind seam.',
      optimalAngle: '11:30 clock position',
      playerAngle: '11:15 position',
      status: 'warning',
      highlightPoint: { x: 440, y: 95, label: '142.4 kph Release' },
      biomechanicCue: 'Drive fingers down the back of the seam for late movement.'
    },
    {
      id: 'kf-bowl-5',
      name: '5. Follow-Through Deceleration',
      timestampSec: 3.2,
      frameIndex: 192,
      discipline: 'bowling',
      description: 'Right shoulder driving through towards target batsman off-stump.',
      optimalAngle: 'Smooth 4-stride decel',
      playerAngle: 'Decel on target',
      status: 'optimal',
      highlightPoint: { x: 410, y: 260, label: 'Follow-Through Drive' },
      biomechanicCue: 'Cross over landing line safely out of danger area.'
    }
  ],
  fielding: [
    {
      id: 'kf-field-1',
      name: '1. Split-Step Ready Position',
      timestampSec: 0.3,
      frameIndex: 18,
      discipline: 'fielding',
      description: 'Wide base, weight on balls of feet, hands relaxed below knees.',
      optimalAngle: '110° hip sink',
      playerAngle: '112° hip sink',
      status: 'optimal',
      highlightPoint: { x: 400, y: 280, label: 'Split-Step Base' },
      biomechanicCue: 'Hop on bowler release to preload explosive quads.'
    },
    {
      id: 'kf-field-2',
      name: '2. First Reaction & Foot Drive',
      timestampSec: 0.7,
      frameIndex: 42,
      discipline: 'fielding',
      description: '0.24s reaction to outside edge deflection towards right slip.',
      optimalAngle: '0.22s reaction time',
      playerAngle: '0.25s reaction time',
      status: 'optimal',
      highlightPoint: { x: 430, y: 230, label: 'Lateral Drive' },
      biomechanicCue: 'Push hard off the left instep across the slip cordon.'
    },
    {
      id: 'kf-field-3',
      name: '3. Full Diving Extension',
      timestampSec: 1.3,
      frameIndex: 78,
      discipline: 'fielding',
      description: 'Horizontal body alignment parallel to turf, arms extended fully.',
      optimalAngle: '180° horizontal extension',
      playerAngle: '174° extension',
      status: 'optimal',
      highlightPoint: { x: 470, y: 310, label: 'Airborne Extension' },
      biomechanicCue: 'Keep head still and track ball into palm pocket.'
    },
    {
      id: 'kf-field-4',
      name: '4. Soft Hands Cushion & Catch',
      timestampSec: 1.7,
      frameIndex: 102,
      discipline: 'fielding',
      description: 'Fingers pointing down, cupped pinkies interlocking, elbows yielding.',
      optimalAngle: 'Soft give (4cm decel)',
      playerAngle: 'Soft give verified',
      status: 'optimal',
      highlightPoint: { x: 500, y: 340, label: 'Clean Catch Lock' },
      biomechanicCue: 'Give with the ball speed to eliminate rebound drops.'
    },
    {
      id: 'kf-field-5',
      name: '5. Safe Slide & Instant Gather',
      timestampSec: 2.5,
      frameIndex: 150,
      discipline: 'fielding',
      description: 'Sliding on side-hip and chest, ball secured into throwing grip.',
      optimalAngle: 'Safe turf roll',
      playerAngle: 'Safe slide verified',
      status: 'optimal',
      highlightPoint: { x: 510, y: 360, label: 'Ball Secured' },
      biomechanicCue: 'Protect wrist and immediately sight the bowler/keeper.'
    }
  ]
};

export const mockCoachVideoComments: CoachVideoComment[] = [
  {
    id: 'comm-1',
    coachName: 'Coach Ryan Harris',
    coachAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    coachRole: 'Head Fast Bowling Coach',
    timestampSec: 1.8,
    frameIndex: 108,
    discipline: 'bowling',
    title: 'Outstanding Front-Foot Brace Fulcrum',
    textComment: 'Look at Frame 108: your front leg locked at 172.4°. This is a massive +15° improvement over 3 weeks ago and is directly creating the 142.4 kph speed bump.',
    voiceDurationSec: 18,
    voiceWaveform: [20, 35, 60, 85, 45, 90, 70, 40, 65, 80, 50, 30, 75, 95, 60, 40, 25, 10],
    priority: 'praise',
    isResolved: true
  },
  {
    id: 'comm-2',
    coachName: 'Coach Ryan Harris',
    coachAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    coachRole: 'Head Fast Bowling Coach',
    timestampSec: 2.2,
    frameIndex: 132,
    discipline: 'bowling',
    title: 'Wrist Angle Needs 5° More Cock',
    textComment: 'At release (2.2s), the wrist relaxes slightly by 4.2°. Keep index and middle finger locked firmly behind the seam for 2 extra revolutions of late away-swing.',
    voiceDurationSec: 24,
    voiceWaveform: [15, 40, 70, 95, 60, 85, 90, 65, 45, 80, 55, 35, 60, 40, 20, 10],
    priority: 'technique',
    isResolved: false,
    drawingCoordinates: [
      { x1: 440, y1: 95, x2: 460, y2: 75, color: '#c3f400', type: 'line' },
      { x1: 440, y1: 95, x2: 440, y2: 60, color: '#ffdb3c', type: 'angle' }
    ]
  },
  {
    id: 'comm-3',
    coachName: 'Coach Justin Langer',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    coachRole: 'Master Batting Specialist',
    timestampSec: 2.1,
    frameIndex: 126,
    discipline: 'batting',
    title: 'Head Position Directly Over Point of Impact',
    textComment: 'Frame 126 is textbook. Notice how your helmet visor is aligned squarely over the contact point with zero falling away to the off-side. Great transfer.',
    voiceDurationSec: 15,
    voiceWaveform: [30, 55, 80, 90, 75, 60, 85, 95, 70, 50, 40, 25, 15],
    priority: 'praise',
    isResolved: true
  },
  {
    id: 'comm-4',
    coachName: 'Coach Justin Langer',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    coachRole: 'Master Batting Specialist',
    timestampSec: 1.6,
    frameIndex: 96,
    discipline: 'batting',
    title: 'Front Knee Flexion: Avoid Over-Reaching',
    textComment: 'On the stride plant (Frame 96), your front foot lands 4 inches too far ahead of your center of gravity. Shorten stride slightly to hit on the rise.',
    voiceDurationSec: 22,
    voiceWaveform: [20, 45, 70, 85, 90, 60, 40, 75, 85, 65, 50, 30, 20, 10],
    priority: 'high',
    isResolved: false
  },
  {
    id: 'comm-5',
    coachName: 'Coach Jonty Rhodes',
    coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    coachRole: 'Elite Fielding Director',
    timestampSec: 0.7,
    frameIndex: 42,
    discipline: 'fielding',
    title: 'Split-Step Reaction Speed is Elite',
    textComment: 'Frame 42 shows a 0.24s first-step drive across 1st slip. The explosive lateral push gives you 35% more reach than static stance.',
    voiceDurationSec: 16,
    voiceWaveform: [25, 50, 75, 90, 85, 70, 60, 80, 90, 65, 40, 20, 10],
    priority: 'praise',
    isResolved: true
  }
];

export const mockComparisonPairs: ComparisonPair[] = [
  {
    id: 'comp-1',
    title: 'Front-Foot Brace & Velocity Evolution',
    discipline: 'bowling',
    category: 'before_after',
    clipA: {
      title: 'Week 1 Baseline (Buckled Knee)',
      date: 'Aug 12, 2026',
      label: 'BEFORE',
      speedOrMetric: '136.2 km/h',
      metricDetail: '144° Bent Knee Collapse',
      tag: 'Baseline Session',
      keyAngle: '144.0° Knee Collapse'
    },
    clipB: {
      title: 'Today Session (Rigid 172° Brace)',
      date: 'Sep 04, 2026',
      label: 'AFTER',
      speedOrMetric: '142.4 km/h (+6.2 km/h)',
      metricDetail: '172.4° Rigid Fulcrum',
      tag: 'Post-Drill Execution',
      keyAngle: '172.4° Locked Fulcrum'
    },
    deltaInsights: [
      {
        metric: 'Release Velocity',
        change: '+6.2 km/h',
        isImprovement: true,
        explanation: 'Rigid front leg prevents kinetic energy leak into the turf.'
      },
      {
        metric: 'Front Knee Angle',
        change: '+28.4° Straighter',
        isImprovement: true,
        explanation: 'True catapult effect created at bowling crease.'
      },
      {
        metric: 'Head Falling Away',
        change: '-7.2° Stable',
        isImprovement: true,
        explanation: 'Spine angle maintained vertically through ball release.'
      }
    ],
    recommendedDrillId: 'drill-brace-fulcrum',
    recommendedDrillTitle: 'Medicine Ball Catapult & Front-Leg Brace Holds'
  },
  {
    id: 'comp-2',
    title: 'Cover Drive: Player vs Virat Kohli Benchmark',
    discipline: 'batting',
    category: 'pro_benchmark',
    clipA: {
      title: 'Player Technique (Net Session)',
      date: 'Sep 02, 2026',
      label: 'YOUR TECHNIQUE',
      speedOrMetric: '118 km/h Exit Speed',
      metricDetail: '92.4° High Lead Elbow',
      tag: 'Player Attempt',
      keyAngle: '92.4° Elbow Angle'
    },
    clipB: {
      title: 'Virat Kohli Benchmark (Masterclass)',
      date: 'Pro Gold Standard',
      label: 'PRO BENCHMARK',
      speedOrMetric: '134 km/h Exit Speed',
      metricDetail: '89.0° High Elbow Arc',
      tag: 'Elite Gold Benchmark',
      keyAngle: '89.0° Perfect Dip'
    },
    deltaInsights: [
      {
        metric: 'High Elbow Matching',
        change: '96.2% Alignment',
        isImprovement: true,
        explanation: 'Lead elbow elevation matches the international benchmark.'
      },
      {
        metric: 'Head Over Contact',
        change: '98.0% Over Ball',
        isImprovement: true,
        explanation: 'Weight is cleanly balanced on the ball of the front foot.'
      },
      {
        metric: 'Wrist Roll on Follow-Through',
        change: '3.4° Open',
        isImprovement: false,
        explanation: 'Roll wrists slightly later to keep aerial risk to zero.'
      }
    ],
    recommendedDrillId: 'drill-cover-drive-tee',
    recommendedDrillTitle: 'Drop-Feed High Elbow Extension Series'
  },
  {
    id: 'comp-3',
    title: '1st Slip Diving Catch: Player vs Ravindra Jadeja',
    discipline: 'fielding',
    category: 'pro_benchmark',
    clipA: {
      title: 'Player 1st Slip Catch',
      date: 'Aug 28, 2026',
      label: 'YOUR REACTION',
      speedOrMetric: '0.25s First Step',
      metricDetail: '174° Diving Reach',
      tag: 'Player Net Reaction',
      keyAngle: '0.25s Split Reaction'
    },
    clipB: {
      title: 'Ravindra Jadeja World-Class Benchmark',
      date: 'Pro Gold Standard',
      label: 'PRO BENCHMARK',
      speedOrMetric: '0.21s First Step',
      metricDetail: '180° Full Extension',
      tag: 'World Record Benchmark',
      keyAngle: '0.21s Reflex Apex'
    },
    deltaInsights: [
      {
        metric: 'Split-Step Timing',
        change: '-0.04s Delta',
        isImprovement: true,
        explanation: 'Reaction time is within 0.04s of the world-best fielder.'
      },
      {
        metric: 'Hand Cushion Deceleration',
        change: '4.2 cm Soft Give',
        isImprovement: true,
        explanation: 'Eliminates edge rebound pops from the palm.'
      }
    ],
    recommendedDrillId: 'drill-slip-reaction',
    recommendedDrillTitle: 'Deflection Board Slip Catching Blast'
  }
];

export const mockVideoProgressTimeline: VideoProgressEntry[] = [
  {
    id: 'prog-1',
    date: 'Sep 04, 2026 (Today)',
    weekLabel: 'Week 4 Session 3',
    discipline: 'bowling',
    title: '142.4 km/h Outswing Late Movement',
    clipDuration: '4.2s',
    speedOrPace: '142.4 km/h',
    primaryMetric: '172.4° Front Brace',
    metricDelta: '+6.2 km/h',
    isPositiveDelta: true,
    coachRating: 9.4,
    coachNotesCount: 2,
    keyframeMilestone: 'Release Frame 132',
    thumbnailBg: 'from-[#1a2e16] to-[#0f1a0e]',
    tags: ['Brace Locked', 'Seam 22°', 'Career Fast']
  },
  {
    id: 'prog-2',
    date: 'Aug 28, 2026',
    weekLabel: 'Week 3 Session 2',
    discipline: 'batting',
    title: 'Cover Drive Head-Over-Ball Calibration',
    clipDuration: '3.6s',
    speedOrPace: '118 km/h Exit',
    primaryMetric: '92.4° High Elbow',
    metricDelta: '+14% Corridor Hit',
    isPositiveDelta: true,
    coachRating: 9.0,
    coachNotesCount: 2,
    keyframeMilestone: 'Impact Frame 126',
    thumbnailBg: 'from-[#1c2938] to-[#0f1722]',
    tags: ['High Elbow', 'Sweet Spot', 'No Aerial Risk']
  },
  {
    id: 'prog-3',
    date: 'Aug 21, 2026',
    weekLabel: 'Week 2 Session 1',
    discipline: 'fielding',
    title: '1st Slip Low Diving Reaction Catch',
    clipDuration: '2.8s',
    speedOrPace: '0.24s Reaction',
    primaryMetric: '174° Full Reach',
    metricDelta: '-0.08s Quicker',
    isPositiveDelta: true,
    coachRating: 8.8,
    coachNotesCount: 1,
    keyframeMilestone: 'Catch Frame 78',
    thumbnailBg: 'from-[#2e2616] to-[#1a150c]',
    tags: ['Soft Hands', 'Split Step', 'Low Cup']
  },
  {
    id: 'prog-4',
    date: 'Aug 14, 2026',
    weekLabel: 'Week 1 Baseline',
    discipline: 'bowling',
    title: 'Initial Pace & Knee Collapse Baseline',
    clipDuration: '4.5s',
    speedOrPace: '136.2 km/h',
    primaryMetric: '144.0° Knee Buckle',
    metricDelta: 'Baseline',
    isPositiveDelta: false,
    coachRating: 7.2,
    coachNotesCount: 3,
    keyframeMilestone: 'Gather Frame 68',
    thumbnailBg: 'from-[#261616] to-[#170d0d]',
    tags: ['Knee Buckling', 'Wrist Tilt', 'Energy Leak']
  }
];
