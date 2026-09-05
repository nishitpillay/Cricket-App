import { CricketSkillTreeBranch, CricketSkillNode } from '../types';

export const mockBattingSkillTree: CricketSkillTreeBranch[] = [
  {
    id: 'branch-bat-stance',
    discipline: 'batting',
    categoryKey: 'stance',
    categoryLabel: 'Stance & Setup',
    icon: 'accessibility_new',
    description: 'Foundation base: foot width, relaxed grip pressure, shoulder alignment, and level head stillness.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bat-stance-1',
        discipline: 'batting',
        categoryKey: 'stance',
        categoryLabel: 'Stance & Setup',
        title: 'Neutral Shoulder & Hip Alignment',
        tierLevel: 1,
        masteryLevel: 'L1_FUNDAMENTALS',
        status: 'MASTERED',
        progressPct: 100,
        shortSummary: 'Side-on stance with feet shoulder-width apart and relaxed knees.',
        biomarkers: ['Feet 38-42cm apart', 'Weight 50/50 on balls of feet', 'Shoulders aligned with mid-off'],
        commonFaults: ['Standing too open chest to bowler', 'Weight leaning back on heels'],
        coachDiagnostic: 'Solid foundation. Perfectly balanced over the balls of the feet.',
        assignedDrillId: 'drill-stance-mirror',
        assignedDrillTitle: 'Mirror Stance & Balance Alignment Check',
        drillCategory: 'Batting Basics',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Aug 24, 2026',
        prerequisites: [],
        checkpoints: [
          { id: 'cp-1', label: 'Feet parallel and shoulder-width apart', targetCriteria: '38-42cm base', completed: true, coachSignOff: true },
          { id: 'cp-2', label: 'Relaxed bottom hand grip (V pointing to back of bat)', targetCriteria: 'Light grip pressure', completed: true, coachSignOff: true },
          { id: 'cp-3', label: 'Tap behind feet without lowering head', targetCriteria: 'Head still on tap', completed: true, coachSignOff: true }
        ],
        coachTips: ['Keep bottom-hand thumb and index finger light to prevent rigid bat face closing.']
      },
      {
        id: 'skill-bat-stance-2',
        discipline: 'batting',
        categoryKey: 'stance',
        categoryLabel: 'Stance & Setup',
        title: 'Two-Eyed Level Stance Under Pressure',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 100,
        shortSummary: 'Head turned so both pupils have an unobstructed view of the bowler release point.',
        biomarkers: ['Binocular sightline active', '0.0° head tilt at bowler gather'],
        commonFaults: ['Monocular vision (back eye hidden behind nose)', 'Tilted visor falling to off-side'],
        coachDiagnostic: 'Binocular vision is locked in. Clean tracking from release hand.',
        assignedDrillId: 'drill-eye-track',
        assignedDrillTitle: 'Two-Eyed Sightline Calibration Series',
        drillCategory: 'Vision & Tracking',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Aug 28, 2026',
        prerequisites: ['skill-bat-stance-1'],
        checkpoints: [
          { id: 'cp-4', label: 'Both eyes parallel to the pitch horizon', targetCriteria: '<1° tilt', completed: true, coachSignOff: true },
          { id: 'cp-5', label: 'Visor angle level on bowler leap', targetCriteria: 'Hold level through bound', completed: true, coachSignOff: true }
        ],
        coachTips: ['Turn your chin slightly over your front shoulder so your dominant eye gets a direct sightline.']
      }
    ]
  },
  {
    id: 'branch-bat-trigger',
    discipline: 'batting',
    categoryKey: 'trigger_movement',
    categoryLabel: 'Trigger Movement',
    icon: 'directions_walk',
    description: 'Rhythmic pre-delivery movement: back-and-across, forward press, or neutral tap to initiate weight transfer.',
    totalSkills: 3,
    masteredSkills: 2,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bat-trigger-1',
        discipline: 'batting',
        categoryKey: 'trigger_movement',
        categoryLabel: 'Trigger Movement',
        title: 'Back-and-Across Depth & Balance',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'IN_TRAINING',
        progressPct: 75,
        shortSummary: 'Back foot moves back and across to off-stump without committing weight prematurely.',
        biomarkers: ['Back foot stops moving before ball release', 'Head stays inside line of off stump'],
        commonFaults: ['Triggering too late (still moving as ball releases)', 'Planting back foot outside off line'],
        coachDiagnostic: 'Timing is improving. Ensure back foot lands 0.15s before bowler release point.',
        assignedDrillId: 'drill-trigger-tempo',
        assignedDrillTitle: 'Side-Arm Trigger Movement Metronome',
        drillCategory: 'Trigger & Rhythm',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Sep 02, 2026',
        prerequisites: ['skill-bat-stance-2'],
        checkpoints: [
          { id: 'cp-6', label: 'Trigger complete before bowler release', targetCriteria: 'Still base at release', completed: true, coachSignOff: true },
          { id: 'cp-7', label: 'Head remains perfectly vertical during stride', targetCriteria: 'Zero sideways sway', completed: false, coachSignOff: false },
          { id: 'cp-8', label: 'Back heel elevated ready to push forward', targetCriteria: 'Loaded calf muscle', completed: true, coachSignOff: true }
        ],
        coachTips: ['Think of trigger as establishing an explosive spring, not committing to front or back foot yet.']
      }
    ]
  },
  {
    id: 'branch-bat-head',
    discipline: 'batting',
    categoryKey: 'head_position',
    categoryLabel: 'Head Position & Eye Plane',
    icon: 'visibility',
    description: 'Leading with the head over the ball trajectory, maintaining absolute stillness at point of impact.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bat-head-1',
        discipline: 'batting',
        categoryKey: 'head_position',
        categoryLabel: 'Head Position & Eye Plane',
        title: 'Head-Leading Weight Transfer',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'MASTERED',
        progressPct: 95,
        shortSummary: 'Head moves in line with the pitch of the ball before hands and bat descend.',
        biomarkers: ['Head directly over impact zone', 'Chin tucked over front shoulder'],
        commonFaults: ['Reaching with hands while head stays back', 'Head falling over towards mid-off'],
        coachDiagnostic: 'Superb head stillness at Frame 126 in cover drive analysis.',
        assignedDrillId: 'drill-head-ball-lead',
        assignedDrillTitle: 'Drop-Feed Head-Over-Ball Impact Control',
        drillCategory: 'Head Alignment',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Sep 03, 2026',
        prerequisites: ['skill-bat-trigger-1'],
        checkpoints: [
          { id: 'cp-9', label: 'Nose over front toe on front-foot drive', targetCriteria: 'Plumb vertical alignment', completed: true, coachSignOff: true },
          { id: 'cp-10', label: 'Eyes remain fixed on contact point for 0.5s', targetCriteria: 'Hold vision post-strike', completed: true, coachSignOff: true }
        ],
        coachTips: ['Where the head goes, the body follows. Lead with the nose into the corridor.']
      }
    ]
  },
  {
    id: 'branch-bat-batpath',
    discipline: 'batting',
    categoryKey: 'bat_path',
    categoryLabel: 'Bat Path & Downswing Plane',
    icon: 'architecture',
    description: 'Clean high backlift towards second slip with straight downswing and full face presentation.',
    totalSkills: 4,
    masteredSkills: 2,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-bat-path-1',
        discipline: 'batting',
        categoryKey: 'bat_path',
        categoryLabel: 'Bat Path & Downswing Plane',
        title: 'High Elbow & Straight Downswing',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'IN_TRAINING',
        progressPct: 82,
        shortSummary: 'High lead elbow guides straight bat path from gully towards bowler.',
        biomarkers: ['90° - 95° lead elbow angle at impact', 'Bat face perpendicular to target'],
        commonFaults: ['Bottom hand taking over causing looping swing', 'Playing around front pad'],
        coachDiagnostic: 'Lead elbow at 92.4° in current reel. Avoid snapping bottom wrist too early.',
        assignedDrillId: 'drill-high-elbow-tee',
        assignedDrillTitle: 'High Lead Elbow Straight Bat Extension',
        drillCategory: 'Bat Path',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Sep 02, 2026',
        prerequisites: ['skill-bat-head-1'],
        checkpoints: [
          { id: 'cp-11', label: 'Backlift points towards second slip / gully', targetCriteria: '45° backlift path', completed: true, coachSignOff: true },
          { id: 'cp-12', label: 'Lead elbow elevated at impact', targetCriteria: '90-95° elbow angle', completed: true, coachSignOff: true },
          { id: 'cp-13', label: 'Follow-through holds shape for 1.5 seconds', targetCriteria: 'Balance check', completed: false, coachSignOff: false }
        ],
        coachTips: ['The lead elbow is your steering wheel. Guide it directly down the target ground line.']
      }
    ]
  },
  {
    id: 'branch-bat-frontfoot',
    discipline: 'batting',
    categoryKey: 'front_foot_defence',
    categoryLabel: 'Front-Foot Defence',
    icon: 'shield',
    description: 'The bedrock of test match batting: soft hands, playing under eyes, bat tucked next to front pad.',
    totalSkills: 3,
    masteredSkills: 3,
    inTrainingSkills: 0,
    nodes: [
      {
        id: 'skill-bat-ff-1',
        discipline: 'batting',
        categoryKey: 'front_foot_defence',
        categoryLabel: 'Front-Foot Defence',
        title: 'Soft Hands & Pad Proximity',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 100,
        shortSummary: 'Bat angled downwards with light bottom hand grip so edge drops at your feet.',
        biomarkers: ['Zero gap between bat and front pad', 'Bat face angled 30° downwards'],
        commonFaults: ['Hard hands thrusting at ball away from body', 'Gap between bat and pad'],
        coachDiagnostic: 'Mastered. Ball consistently drops dead within 1 meter of crease.',
        assignedDrillId: 'drill-soft-hands-deadball',
        assignedDrillTitle: 'Heavy Ball Soft Hands Defensive Wall',
        drillCategory: 'Defensive Craft',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Aug 30, 2026',
        prerequisites: ['skill-bat-path-1'],
        checkpoints: [
          { id: 'cp-14', label: 'Bat meets ball directly under the eyes', targetCriteria: 'Impact <10cm from eye plane', completed: true, coachSignOff: true },
          { id: 'cp-15', label: 'Defended ball stays within 1.5m radius', targetCriteria: 'Zero rebound pop', completed: true, coachSignOff: true }
        ],
        coachTips: ['Loosen the bottom three fingers of your bottom hand as impact occurs.']
      }
    ]
  },
  {
    id: 'branch-bat-shortball',
    discipline: 'batting',
    categoryKey: 'short_ball_play',
    categoryLabel: 'Short-Ball Play',
    icon: 'sports_baseball',
    description: 'Handling bouncers and short-pitched bowling: swivel pull shot, roll-the-wrists hook, sway and duck.',
    totalSkills: 4,
    masteredSkills: 1,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-bat-short-1',
        discipline: 'batting',
        categoryKey: 'short_ball_play',
        categoryLabel: 'Short-Ball Play',
        title: 'Hip Swivel Pull Shot & Wrist Roll',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'NEEDS_WORK',
        progressPct: 50,
        shortSummary: 'Back foot steps back and inside the line, hips rotate 90°, wrists roll over contact.',
        biomarkers: ['Weight back on right hip', 'Rolled wrists keep ball along the ground'],
        commonFaults: ['Back leg backing away to square leg', 'Top edge from open bat face'],
        coachDiagnostic: 'Opening hips too early. Needs dedicated swivel work on the bowling machine.',
        assignedDrillId: 'drill-pull-shot-swivel',
        assignedDrillTitle: 'Tennis Ball Rapid Swivel Pull Series',
        drillCategory: 'Short Ball',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Sep 01, 2026',
        prerequisites: ['skill-bat-trigger-1'],
        checkpoints: [
          { id: 'cp-16', label: 'Get head in line with ball bounce before swiveling', targetCriteria: 'Inside line of delivery', completed: true, coachSignOff: true },
          { id: 'cp-17', label: 'Roll wrists at contact to hit groundwards', targetCriteria: 'Ball travels along turf', completed: false, coachSignOff: false },
          { id: 'cp-18', label: 'Maintain balanced base without falling over', targetCriteria: 'Hold finish pose', completed: false, coachSignOff: false }
        ],
        coachTips: ['Get on top of the bounce by keeping your top hand dominant and rolling your forearms.']
      }
    ]
  },
  {
    id: 'branch-bat-strike',
    discipline: 'batting',
    categoryKey: 'strike_rotation',
    categoryLabel: 'Strike Rotation & Gaps',
    icon: 'sync_alt',
    description: 'Nudging into pockets, soft-hands drop-and-run, manipulation of fielders with wrist angles.',
    totalSkills: 3,
    masteredSkills: 2,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bat-rot-1',
        discipline: 'batting',
        categoryKey: 'strike_rotation',
        categoryLabel: 'Strike Rotation & Gaps',
        title: 'Mid-Wicket & Backward Point Soft-Touch Dabs',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 90,
        shortSummary: 'Angling bat face late towards third man or rolling wrists through mid-wicket for easy singles.',
        biomarkers: ['Late wrist adjustment 0.05s before contact', 'Exit velocity <40 km/h for drop & run'],
        commonFaults: ['Pushing too hard directly to infielders', 'Calling without securing ground placement'],
        coachDiagnostic: 'Great manipulation of cover and point fielders in match sims.',
        assignedDrillId: 'drill-single-rot-zones',
        assignedDrillTitle: 'Target Ring Strike Rotation Net Challenge',
        drillCategory: 'Game Awareness',
        verifiedByCoach: 'Coach Justin Langer',
        lastAssessedDate: 'Aug 26, 2026',
        prerequisites: ['skill-bat-ff-1'],
        checkpoints: [
          { id: 'cp-19', label: 'Drop ball within 2m circle for fast single', targetCriteria: '8/10 target executions', completed: true, coachSignOff: true },
          { id: 'cp-20', label: 'Instant sprint acceleration off the mark', targetCriteria: '<1.2s to crease halfway', completed: true, coachSignOff: true }
        ],
        coachTips: ['Read the field before bowler runs in. Soften your hands to exploit deep backward point.']
      }
    ]
  }
];

export const mockBowlingSkillTree: CricketSkillTreeBranch[] = [
  {
    id: 'branch-bowl-runup',
    discipline: 'bowling',
    categoryKey: 'run_up_consistency',
    categoryLabel: 'Run-up Consistency & Rhythm',
    icon: 'sprint',
    description: 'Smooth progressive acceleration, repeatable stride marks, and upright running posture.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bowl-run-1',
        discipline: 'bowling',
        categoryKey: 'run_up_consistency',
        categoryLabel: 'Run-up Consistency & Rhythm',
        title: 'Calibrated 18-Yard Acceleration Curve',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 95,
        shortSummary: 'Progressive stride build-up reaching 85% sprint speed at crease gather without stutter.',
        biomarkers: ['16-stride cadence exact within ±5cm', 'Smooth torso forward lean 12-15°'],
        commonFaults: ['Stuttering in final 3 strides', 'Sprinting at 100% early and tiring at crease'],
        coachDiagnostic: 'Rock-solid run-up. Stride variance is under 3cm across 24 balls.',
        assignedDrillId: 'drill-runup-cones',
        assignedDrillTitle: 'Cone Cadence & Rhythmic Run-up Check',
        drillCategory: 'Bowling Run-Up',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Aug 29, 2026',
        prerequisites: [],
        checkpoints: [
          { id: 'cp-21', label: 'Consistent jump point on marked crease tape', targetCriteria: '±5cm tolerance across 12 deliveries', completed: true, coachSignOff: true },
          { id: 'cp-22', label: 'Zero no-balls across full 4-over spell', targetCriteria: '100% legal front foot', completed: true, coachSignOff: true }
        ],
        coachTips: ['Run like a sprinter with relaxed jaw and high knees. Build speed smoothly to the jump.']
      }
    ]
  },
  {
    id: 'branch-bowl-gather',
    discipline: 'bowling',
    categoryKey: 'gather',
    categoryLabel: 'Gather & Pre-Delivery Bound',
    icon: 'flight_takeoff',
    description: 'The transition from horizontal run-up to vertical delivery bound with aligned hips and torso.',
    totalSkills: 3,
    masteredSkills: 3,
    inTrainingSkills: 0,
    nodes: [
      {
        id: 'skill-bowl-gather-1',
        discipline: 'bowling',
        categoryKey: 'gather',
        categoryLabel: 'Gather & Pre-Delivery Bound',
        title: 'Explosive Back-Foot Landing Alignment',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 100,
        shortSummary: 'Back foot lands parallel to return crease with hips coiled 35° ready to uncoil.',
        biomarkers: ['Back foot parallel to bowling crease', 'Ball tucked close to chin in gather'],
        commonFaults: ['Back foot pointing towards fine leg (over-rotation)', 'Collapsing back knee on landing'],
        coachDiagnostic: 'Back foot parallel position provides a rigid launching base.',
        assignedDrillId: 'drill-gather-box',
        assignedDrillTitle: 'Single-Leg Bound & Coil Stabilization',
        drillCategory: 'Biomechanics',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Aug 31, 2026',
        prerequisites: ['skill-bowl-run-1'],
        checkpoints: [
          { id: 'cp-23', label: 'Back ankle stiff and responsive on contact', targetCriteria: 'Immediate kinetic transfer', completed: true, coachSignOff: true },
          { id: 'cp-24', label: 'Torso coiling aligned with target line', targetCriteria: '35° hip angle', completed: true, coachSignOff: true }
        ],
        coachTips: ['Keep the ball tucked under your chin until your front foot begins driving downwards.']
      }
    ]
  },
  {
    id: 'branch-bowl-frontarm',
    discipline: 'bowling',
    categoryKey: 'front_arm_use',
    categoryLabel: 'Front-Arm Use & Pull-Down',
    icon: 'fitness_center',
    description: 'Reaching high with the non-bowling arm and pulling down forcefully into the ribcage to generate torque.',
    totalSkills: 4,
    masteredSkills: 2,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-bowl-fa-1',
        discipline: 'bowling',
        categoryKey: 'front_arm_use',
        categoryLabel: 'Front-Arm Use & Pull-Down',
        title: 'Vertical Sightline & Powerful Pull-Down',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'IN_TRAINING',
        progressPct: 80,
        shortSummary: 'Left arm points towards batsman helmet, then pulls tight against ribs as bowling arm fires.',
        biomarkers: ['Front elbow pulls down past left hip', 'Torso remains tall without sideways collapse'],
        commonFaults: ['Front arm falling away to off-side (causes bowling arm to drop)', 'Lazy short front arm reach'],
        coachDiagnostic: 'Front arm pulling well. Make sure elbow locks tight into left pocket.',
        assignedDrillId: 'drill-front-arm-punch',
        assignedDrillTitle: 'Resistance Band Front-Arm Torque Pull',
        drillCategory: 'Bowling Biomechanics',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Sep 02, 2026',
        prerequisites: ['skill-bowl-gather-1'],
        checkpoints: [
          { id: 'cp-25', label: 'Front hand sights the target off-stump', targetCriteria: 'High reach at eye line', completed: true, coachSignOff: true },
          { id: 'cp-26', label: 'Elbow drives down vertically into hip', targetCriteria: 'Zero lateral elbow drift', completed: false, coachSignOff: false }
        ],
        coachTips: ['Imagine grabbing a high rope and pulling it down into your pocket with maximum force.']
      }
    ]
  },
  {
    id: 'branch-bowl-brace',
    discipline: 'bowling',
    categoryKey: 'pace',
    categoryLabel: 'Pace & Front-Foot Brace',
    icon: 'bolt',
    description: 'The catapult fulcrum: rigid front knee lockout upon landing converts forward speed into release pace.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bowl-brace-1',
        discipline: 'bowling',
        categoryKey: 'pace',
        categoryLabel: 'Pace & Front-Foot Brace',
        title: '170°+ Rigid Front-Leg Fulcrum Lockout',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'MASTERED',
        progressPct: 98,
        shortSummary: 'Front knee stays braced at 172.4° on landing, transferring full momentum to the ball.',
        biomarkers: ['170-175° knee brace angle', 'Zero knee buckling on impact (prevents pace leak)'],
        commonFaults: ['Front knee collapsing to 140° (wastes 6-8 km/h of speed)', 'Landing with front foot turned inwards'],
        coachDiagnostic: 'Outstanding! Front leg brace at 172.4° produced your record 142.4 km/h release.',
        assignedDrillId: 'drill-brace-fulcrum',
        assignedDrillTitle: 'Medicine Ball Catapult & Front-Leg Brace Holds',
        drillCategory: 'Express Pace',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Sep 04, 2026',
        prerequisites: ['skill-bowl-fa-1'],
        checkpoints: [
          { id: 'cp-27', label: 'Front knee locked on heel strike', targetCriteria: '>170° knee angle on video', completed: true, coachSignOff: true },
          { id: 'cp-28', label: 'Release speed consistently >140 km/h', targetCriteria: '142.4 km/h verified on radar', completed: true, coachSignOff: true }
        ],
        coachTips: ['Lock the front quad like a steel vault door upon impact. Let your upper body whip over it.']
      }
    ]
  },
  {
    id: 'branch-bowl-wrist',
    discipline: 'bowling',
    categoryKey: 'wrist_position',
    categoryLabel: 'Wrist Position & Seam Cock',
    icon: 'pan_tool_alt',
    description: 'Cocked upright wrist behind the ball seam, snapping down at release for maximum revolution and late swing.',
    totalSkills: 3,
    masteredSkills: 1,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-bowl-wrist-1',
        discipline: 'bowling',
        categoryKey: 'wrist_position',
        categoryLabel: 'Wrist Position & Seam Cock',
        title: 'Upright 22° Seam Cock & Finger Snap',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'NEEDS_WORK',
        progressPct: 60,
        shortSummary: 'Wrist remains firmly cocked backwards 22° until release, then snaps forward over the index finger.',
        biomarkers: ['22° backward wrist angle', 'Index and middle finger drive straight down seam'],
        commonFaults: ['Wrist relaxing prematurely causing wobbly seam', 'Fingers cutting across ball inadvertently'],
        coachDiagnostic: 'Wrist relaxes slightly by 4° at release. Keep wrist locked behind ball for 2 extra revs.',
        assignedDrillId: 'drill-wrist-snap-seam',
        assignedDrillTitle: 'Weighted Ball Seam Snap & Upright Wrist Series',
        drillCategory: 'Seam & Swing',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Sep 04, 2026',
        prerequisites: ['skill-bowl-brace-1'],
        checkpoints: [
          { id: 'cp-29', label: 'Seam stays upright through flight without wobble', targetCriteria: 'Seam upright on slow-mo', completed: false, coachSignOff: false },
          { id: 'cp-30', label: 'Wrist locked behind ball until final 0.05s', targetCriteria: '22° cocked angle', completed: true, coachSignOff: true }
        ],
        coachTips: ['Feel the seam bite against your index and middle fingerprints as you snap down at release.']
      }
    ]
  },
  {
    id: 'branch-bowl-accuracy',
    discipline: 'bowling',
    categoryKey: 'accuracy',
    categoryLabel: 'Accuracy & Channel Corridor',
    icon: 'track_changes',
    description: 'Landing 80%+ of deliveries in the 6-8 meter good-length zone in the 4th-stump corridor.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-bowl-acc-1',
        discipline: 'bowling',
        categoryKey: 'accuracy',
        categoryLabel: 'Accuracy & Channel Corridor',
        title: 'Corridor of Uncertainty Consistency',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'MASTERED',
        progressPct: 92,
        shortSummary: 'Targeting 4th stump line on a good length to force front-foot hesitation.',
        biomarkers: ['82% balls in target 1.5m corridor box', 'Release point height consistent within ±4cm'],
        commonFaults: ['Drifting onto pads (too straight)', 'Bowling too wide outside off'],
        coachDiagnostic: 'High consistency. 19 of 24 balls on target in yesterday net session.',
        assignedDrillId: 'drill-corridor-cone-grid',
        assignedDrillTitle: 'Stump Target Corridor & Pressure Grid',
        drillCategory: 'Accuracy',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Sep 03, 2026',
        prerequisites: ['skill-bowl-wrist-1'],
        checkpoints: [
          { id: 'cp-31', label: 'Hit target mat corridor 18/24 balls', targetCriteria: '75%+ accuracy threshold', completed: true, coachSignOff: true },
          { id: 'cp-32', label: 'Zero deliveries short of half-way pitch', targetCriteria: '100% full/good length', completed: true, coachSignOff: true }
        ],
        coachTips: ['Pick a specific patch of turf 6 paces from the batsman and lock your eyes on it.']
      }
    ]
  },
  {
    id: 'branch-bowl-variations',
    discipline: 'bowling',
    categoryKey: 'variations',
    categoryLabel: 'Tactical Variations',
    icon: 'auto_fix_high',
    description: 'Inswing yorkers, cross-seam bounce, back-of-the-hand slower balls, and bouncers.',
    totalSkills: 5,
    masteredSkills: 2,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-bowl-var-1',
        discipline: 'bowling',
        categoryKey: 'variations',
        categoryLabel: 'Tactical Variations',
        title: 'Death-Overs Blockhole Inswing Yorker',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'IN_TRAINING',
        progressPct: 78,
        shortSummary: 'Dipping late onto base of middle and leg stump at 138+ km/h.',
        biomarkers: ['Full wrist push forward at base of stumps', 'Trajectory dips sharply under bat'],
        commonFaults: ['Overpitching into full toss', 'Dropping short into a slot ball'],
        coachDiagnostic: 'Pace is great. Just needs 2 inches fuller on death overs drill.',
        assignedDrillId: 'drill-yorker-blockhole',
        assignedDrillTitle: 'Base-of-Stump Blockhole Yorker Challenge',
        drillCategory: 'Death Bowling',
        verifiedByCoach: 'Coach Ryan Harris',
        lastAssessedDate: 'Sep 02, 2026',
        prerequisites: ['skill-bowl-acc-1'],
        checkpoints: [
          { id: 'cp-33', label: 'Hit base of middle stump mat 6 times in an over', targetCriteria: '6/12 blockhole hits', completed: true, coachSignOff: true },
          { id: 'cp-34', label: 'Zero beamers / waist-high full tosses', targetCriteria: '100% safe height', completed: true, coachSignOff: true }
        ],
        coachTips: ['Look at the batsman front shoe laces and drive the seam straight into that point.']
      }
    ]
  }
];

export const mockFieldingSkillTree: CricketSkillTreeBranch[] = [
  {
    id: 'branch-field-split',
    discipline: 'fielding',
    categoryKey: 'split_step',
    categoryLabel: 'Split-Step & Reflexes',
    icon: 'flash_on',
    description: 'Pre-hop timing as bowler releases ball to prime explosive multidirectional foot drive.',
    totalSkills: 3,
    masteredSkills: 3,
    inTrainingSkills: 0,
    nodes: [
      {
        id: 'skill-field-split-1',
        discipline: 'fielding',
        categoryKey: 'split_step',
        categoryLabel: 'Split-Step & Reflexes',
        title: '0.24s Split-Step Reaction Drive',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'MASTERED',
        progressPct: 96,
        shortSummary: 'Hop lands on balls of feet exactly as bat strikes ball, enabling 0.24s explosive lateral dive.',
        biomarkers: ['Reaction time 0.24s (Pro standard: 0.21s)', 'Wide dynamic base with soft knees'],
        commonFaults: ['Flat-footed standing waiting for ball', 'Jumping too high in the air (stuck airborne)'],
        coachDiagnostic: 'International tier reaction speed in slip and inner ring.',
        assignedDrillId: 'drill-split-reaction-reflex',
        assignedDrillTitle: 'Deflection Board Split-Step Reaction Blast',
        drillCategory: 'Fielding Reflexes',
        verifiedByCoach: 'Coach Jonty Rhodes',
        lastAssessedDate: 'Aug 30, 2026',
        prerequisites: [],
        checkpoints: [
          { id: 'cp-35', label: 'Split-step landing synchronous with bat impact', targetCriteria: 'Frame-perfect timing', completed: true, coachSignOff: true },
          { id: 'cp-36', label: 'Explosive lateral push off instep', targetCriteria: 'Instant push without false step', completed: true, coachSignOff: true }
        ],
        coachTips: ['Stay light on your toes. The split-step loads your calves and quads like coiled springs.']
      }
    ]
  },
  {
    id: 'branch-field-lowcatch',
    discipline: 'fielding',
    categoryKey: 'low_catching',
    categoryLabel: 'Low Catching & Slip Cordon',
    icon: 'pan_tool',
    description: 'Low center of gravity, soft interlocking pinkies, fingers pointing down, giving with ball velocity.',
    totalSkills: 4,
    masteredSkills: 3,
    inTrainingSkills: 1,
    nodes: [
      {
        id: 'skill-field-slip-1',
        discipline: 'fielding',
        categoryKey: 'low_catching',
        categoryLabel: 'Low Catching & Slip Cordon',
        title: 'Soft Hands Ankle-Height Cordon Catch',
        tierLevel: 2,
        masteryLevel: 'L2_CLUB_ACADEMY',
        status: 'MASTERED',
        progressPct: 92,
        shortSummary: 'Fingers pointing straight down, pinkies cupped together, arms yielding 4cm on contact.',
        biomarkers: ['Fingers pointing directly down to turf', 'Soft give (4cm decel distance) prevents rebound'],
        commonFaults: ['Snatching at ball with rigid fingers', 'Fingers pointing forward (causes broken fingers/drops)'],
        coachDiagnostic: 'Soft hands technique verified in slow-mo analysis. No rebound pops.',
        assignedDrillId: 'drill-slip-cradle-low',
        assignedDrillTitle: 'Slip Cradle Ankle-Height Soft Hands Series',
        drillCategory: 'Catching Mastery',
        verifiedByCoach: 'Coach Jonty Rhodes',
        lastAssessedDate: 'Aug 28, 2026',
        prerequisites: ['skill-field-split-1'],
        checkpoints: [
          { id: 'cp-37', label: 'Catch 18/20 slip deflection balls cleanly', targetCriteria: '90%+ catch success rate', completed: true, coachSignOff: true },
          { id: 'cp-38', label: 'Fingers pointed down on all catches below waist', targetCriteria: '100% textbook form', completed: true, coachSignOff: true }
        ],
        coachTips: ['Let the ball come into the deep pocket of your palms. Soften elbows as it hits.']
      }
    ]
  },
  {
    id: 'branch-field-throw',
    discipline: 'fielding',
    categoryKey: 'direct_hit',
    categoryLabel: 'Direct-Hit Run-Outs',
    icon: 'sports_score',
    description: 'Aggressive scoop pickup with crow-hop transfer and rapid sidearm or overhand throw to 1 stump.',
    totalSkills: 4,
    masteredSkills: 2,
    inTrainingSkills: 2,
    nodes: [
      {
        id: 'skill-field-throw-1',
        discipline: 'fielding',
        categoryKey: 'direct_hit',
        categoryLabel: 'Direct-Hit Run-Outs',
        title: 'Under-Arm & Over-Arm 1-Stump Sniper Hit',
        tierLevel: 3,
        masteryLevel: 'L3_REPRESENTATIVE',
        status: 'IN_TRAINING',
        progressPct: 75,
        shortSummary: 'Scooping ball outside right foot on full sprint and releasing to stumps in under 0.8 seconds.',
        biomarkers: ['Transfer time from scoop to release <0.8s', 'Throw velocity 125+ km/h'],
        commonFaults: ['Double-taking after pickup', 'Aiming high over the bails instead of base of stumps'],
        coachDiagnostic: 'Rapid pickup. Focus on releasing to the base of the middle stump.',
        assignedDrillId: 'drill-direct-hit-sniper',
        assignedDrillTitle: 'Single Stump Direct Hit Run-Out Blitz',
        drillCategory: 'Throwing Accuracy',
        verifiedByCoach: 'Coach Jonty Rhodes',
        lastAssessedDate: 'Sep 02, 2026',
        prerequisites: ['skill-field-split-1'],
        checkpoints: [
          { id: 'cp-39', label: 'Hit 1-stump target 5/10 times from 25 yards', targetCriteria: '50% direct hit rate at pace', completed: true, coachSignOff: true },
          { id: 'cp-40', label: 'Release ball in <0.75 seconds from touch', targetCriteria: '<0.75s transfer time', completed: false, coachSignOff: false }
        ],
        coachTips: ['Look at the base of the middle stump and throw through the target, not at it.']
      }
    ]
  }
];

export const mockAllSkillTrees = {
  batting: mockBattingSkillTree,
  bowling: mockBowlingSkillTree,
  fielding: mockFieldingSkillTree
};
