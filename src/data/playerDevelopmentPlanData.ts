import { PlayerDevelopmentPlan } from '../types';

export const mockPlayerDevelopmentPlans: Record<string, PlayerDevelopmentPlan> = {
  // =========================================================================
  // 1. DEVANG DALVI (Senior Pro All-Rounder: 142 kph & No. 3 Bat)
  // =========================================================================
  'usr-devang': {
    id: 'pdp-devang-2026',
    playerId: 'usr-devang',
    playerName: 'Devang Dalvi',
    playerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
    playerRoleTitle: 'Senior All-Rounder • 1st XI Captain',
    primaryDiscipline: 'all-rounder',
    coachInCharge: 'Ryan Harris (High Performance Bowling) & Justin Langer (Technical Batting)',
    coachAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planCycle: '2026 Q3/Q4 State Championship & Premier League',
    lastReviewDate: '28 Aug 2026',
    nextScheduledReview: '18 Sep 2026',
    executiveSummary:
      'Devang demonstrates elite kinetic transfer on his front-leg brace (172.4°) yielding effortless 140+ kph pace and exceptional high-elbow front-foot drive mechanics. Current PDP cycle concentrates on: (1) arresting the 4° backward wrist collapse at delivery release to guarantee upright seam presentation, (2) improving 4th-stump channel consistency from 58% to >80% under fatigue, and (3) refining short-ball swivel rotation against express bouncers.',
    
    // -----------------------------------------------------------------------
    // STRENGTHS
    // -----------------------------------------------------------------------
    strengths: [
      {
        id: 'str-1',
        category: 'bowling',
        title: 'Rigid Front-Knee Brace & Kinetic Catapult',
        description: 'Elite deceleration mechanics with 172.4° lockout angle at release. Converts linear run-up momentum into rotational torque without spinal hyperextension.',
        evidenceMetric: '172.4° lockout angle • 142.4 km/h release speed • Zero knee flexion drop',
        videoMilestoneRef: 'v-fast-brace-01',
        coachEndorsement: 'Ryan Harris: "Among the top 2% of domestic bowlers for knee lockout stiffness."',
        icon: 'sports_cricket'
      },
      {
        id: 'str-2',
        category: 'batting',
        title: 'Lead Elbow Extension on Off-Drive',
        description: 'High lead elbow (92.4°) with neutral head alignment over ball contact line. Generates clean ball presentation and 112 km/h exit speed through extra cover.',
        evidenceMetric: '92.4° lead elbow alignment • 112 km/h ball exit speed • 0.04s pre-impact stillness',
        videoMilestoneRef: 'v-drive-04',
        coachEndorsement: 'Justin Langer: "Head is perfectly still at release, visor locked to ball plane."',
        icon: 'sports_baseball'
      },
      {
        id: 'str-3',
        category: 'fielding',
        title: 'Slip Cordon Reaction & Soft Hands Catching',
        description: 'Explosive 0.24s split-step reaction time at 2nd slip with downward-pointing fingers and deceleration cushioning into chest cavity.',
        evidenceMetric: '0.24s reaction hop • 94% slip cordon catch conversion rate across 12 innings',
        coachEndorsement: 'Fielding Coach: "Exceptional soft hands that cushion ball momentum upon impact."',
        icon: 'pan_tool'
      },
      {
        id: 'str-4',
        category: 'mental',
        title: 'Death-Overs Calm & Tactical Execution',
        description: 'Maintains sub-110 bpm heart rate variability under 18-runs-needed match simulations; executes planned field-setting traps without panic.',
        evidenceMetric: 'HRV score 78 ms in death overs • 6.4 econ rate in final 4 overs of T20 fixtures',
        coachEndorsement: 'Performance Psychologist: "Rare composure and cognitive clarity under pressure."',
        icon: 'psychology'
      }
    ],

    // -----------------------------------------------------------------------
    // DEVELOPMENT AREAS
    // -----------------------------------------------------------------------
    developmentAreas: [
      {
        id: 'dev-1',
        category: 'bowling',
        priority: 'HIGH',
        title: 'Wrist Cock Angle & Upright Seam Stability',
        biomechanicalTarget: 'Lock wrist at 20°-24° backward cock angle through release window with index & middle finger seam grip pressure ratio 52:48.',
        currentFlaw: 'Wrist drops 4.2° backward and rotates 3° inward at gather-to-release transition, causing wobble seam and 6 km/h loss of outswing carry.',
        rootCause: 'Over-gripping ball with thumb knuckle placed too far up the seam under delivery bound impact.',
        targetCompletionDate: '15 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 68,
        linkedDrillIds: ['drill-wrist-snap-01', 'drill-target-channel-02']
      },
      {
        id: 'dev-2',
        category: 'bowling',
        priority: 'HIGH',
        title: '4th-Stump Channel Corridor Consistency',
        biomechanicalTarget: 'Maintain 75%+ ball occupancy in 6.0m-7.5m length band on 4th-stump channel over 4-over spells.',
        currentFlaw: 'Length drifts 45cm fuller (overpitched) on 4th and 5th balls of overs as fatigue sets in.',
        rootCause: 'Front-foot landing stride shortens by 6cm in balls 18-24, pulling torso over the crease prematurely.',
        targetCompletionDate: '22 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 74,
        linkedDrillIds: ['drill-channel-blitz-03']
      },
      {
        id: 'dev-3',
        category: 'batting',
        priority: 'MEDIUM',
        title: 'Short-Ball Swivel Pull Shot Footwork',
        biomechanicalTarget: 'Transfer 85% weight to back hip, drop lead shoulder slightly to roll wrists over the bounce rather than lifting.',
        currentFlaw: 'Weight remains 40% on front foot when ball rises above chest, forcing an aerial top-edge through mid-wicket.',
        rootCause: 'Delayed trigger movement back-and-across when facing pace above 138 km/h.',
        targetCompletionDate: '30 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 52,
        linkedDrillIds: ['drill-swivel-pull-04']
      }
    ],

    // -----------------------------------------------------------------------
    // ACTIVE GOALS
    // -----------------------------------------------------------------------
    activeGoals: [
      {
        id: 'goal-1',
        title: 'Seam Upright Presentation: Achieve 85%+ Rotational True Seam',
        category: 'bowling',
        linkedDevelopmentAreaId: 'dev-1',
        targetMetric: 'True Seam Alignment Index',
        baselineValue: '62% true seam (high wobble)',
        currentValue: '79% true seam',
        targetValue: '85% true seam',
        deadline: '18 Sep 2026',
        status: 'ON_TRACK',
        progressPct: 79,
        coachNotes: 'Superb improvement since introducing the weighted leather ball snap routine. Seam is standing bolt upright.',
        milestones: [
          { id: 'm-1', title: '100 ball release snap drill against soft net', completed: true, targetDate: '01 Sep' },
          { id: 'm-2', title: 'High-speed camera telemetry check (120 FPS)', completed: true, targetDate: '08 Sep' },
          { id: 'm-3', title: 'Match simulation: 4 overs with zero wobble deliveries', completed: false, targetDate: '18 Sep' }
        ]
      },
      {
        id: 'goal-2',
        title: 'Corridor Accuracy: Hit 4th-Stump Target Zone 18/24 Balls',
        category: 'bowling',
        linkedDevelopmentAreaId: 'dev-2',
        targetMetric: 'Corridor Hit Frequency',
        baselineValue: '13 / 24 balls (54%)',
        currentValue: '18 / 24 balls (75%)',
        targetValue: '20 / 24 balls (83%)',
        deadline: '25 Sep 2026',
        status: 'ON_TRACK',
        progressPct: 75,
        coachNotes: 'Stride calibration markers at crease have resolved the stride shortening issue.',
        milestones: [
          { id: 'm-4', title: 'Crease chalk marker run-up audit', completed: true, targetDate: '03 Sep' },
          { id: 'm-5', title: 'Target mat scoring: 75%+ across 2 consecutive sessions', completed: true, targetDate: '10 Sep' },
          { id: 'm-6', title: 'Live net session vs senior opening batters', completed: false, targetDate: '22 Sep' }
        ]
      },
      {
        id: 'goal-3',
        title: 'Front-Knee Catapult Brace: Hold 170°+ across 100% Match Deliveries',
        category: 'biomechanics',
        targetMetric: 'Knee Extension Lockout Angle',
        baselineValue: '162.0° (occasional give under fatigue)',
        currentValue: '172.4° (consistent)',
        targetValue: '172.0°+ sustained',
        deadline: '12 Sep 2026',
        status: 'ACHIEVED',
        progressPct: 100,
        coachNotes: 'Goal achieved ahead of schedule! Front leg is an absolute steel rod on release.',
        milestones: [
          { id: 'm-7', title: 'Isometric single-leg eccentric drop landings', completed: true, targetDate: '25 Aug' },
          { id: 'm-8', title: 'Force-plate velocity test with Ryan Harris', completed: true, targetDate: '02 Sep' },
          { id: 'm-9', title: 'Official coach biomechanical sign-off', completed: true, targetDate: '04 Sep' }
        ]
      },
      {
        id: 'goal-4',
        title: 'Back-Foot Swivel Pull Control: Roll Wrists Below Eye-Line',
        category: 'batting',
        linkedDevelopmentAreaId: 'dev-3',
        targetMetric: 'Ground Control Ratio on Short Balls',
        baselineValue: '48% kept along turf',
        currentValue: '66% kept along turf',
        targetValue: '80% kept along turf',
        deadline: '30 Sep 2026',
        status: 'ACTIVE',
        progressPct: 66,
        coachNotes: 'Focusing on chin-down position and letting the ball arrive rather than lunging.',
        milestones: [
          { id: 'm-10', title: 'Tennis ball racket bounce drill (50 reps)', completed: true, targetDate: '05 Sep' },
          { id: 'm-11', title: 'Side-arm bowling machine at 135 kph', completed: false, targetDate: '19 Sep' },
          { id: 'm-12', title: 'Match scenario pull-shot zone test', completed: false, targetDate: '28 Sep' }
        ]
      }
    ],

    // -----------------------------------------------------------------------
    // ASSIGNED DRILLS
    // -----------------------------------------------------------------------
    assignedDrills: [
      {
        id: 'drill-pdp-1',
        drillId: 'drill-wrist-snap-01',
        drillTitle: 'Weighted Ball Seam Snap & Upright Wrist Series',
        category: 'bowling',
        focusArea: 'Seam position & wrist cock stabilization',
        weeklyPrescription: '3x sessions / week • 20 minutes',
        setsReps: '4 sets of 8 deliveries (280g weighted seam ball)',
        coachInstructions: 'Keep index and middle fingers straddling the seam. Snap downward through the fingertip pads. Do not let the wrist collapse backwards.',
        status: 'IN_PROGRESS',
        completedSessions: 8,
        targetSessions: 12,
        lastCompletedDate: '03 Sep 2026'
      },
      {
        id: 'drill-pdp-2',
        drillId: 'drill-channel-blitz-03',
        drillTitle: '4th-Stump Target Mat Corridor Blitz',
        category: 'bowling',
        focusArea: 'Good length 6.5m-7.2m corridor accuracy',
        weeklyPrescription: '2x sessions / week • 30 minutes',
        setsReps: '6 overs (36 deliveries) aiming for neon target zone',
        coachInstructions: 'Maintain your 16-stride approach rhythm. Eye on the top of off-stump target marker until front-foot impact.',
        status: 'IN_PROGRESS',
        completedSessions: 5,
        targetSessions: 8,
        lastCompletedDate: '02 Sep 2026'
      },
      {
        id: 'drill-pdp-3',
        drillId: 'drill-swivel-pull-04',
        drillTitle: 'Hip Swivel Pull Shot & Wrist Roll Mastery',
        category: 'batting',
        focusArea: 'Short ball control and evasion',
        weeklyPrescription: '2x sessions / week • 25 minutes',
        setsReps: '5 sets of 10 pull shots with side-arm thrower',
        coachInstructions: 'Get back and across early. Top hand guides the bat down; roll the wrists so ball stays below knee height.',
        status: 'IN_PROGRESS',
        completedSessions: 4,
        targetSessions: 8,
        lastCompletedDate: '01 Sep 2026'
      },
      {
        id: 'drill-pdp-4',
        drillId: 'drill-brace-lock-05',
        drillTitle: 'Isometric Front Knee Lockout & Plyo Catapult',
        category: 'fitness',
        focusArea: 'Knee brace stability and single-leg deceleration',
        weeklyPrescription: '3x sessions / week • 15 minutes',
        setsReps: '3 sets of 5 drop landings from 30cm box into 172° freeze',
        coachInstructions: 'Absorb the impact through the glute and hamstring while keeping the knee joint firm and locked.',
        status: 'COMPLETED',
        completedSessions: 12,
        targetSessions: 12,
        lastCompletedDate: '04 Sep 2026'
      }
    ],

    // -----------------------------------------------------------------------
    // COACH OBSERVATIONS
    // -----------------------------------------------------------------------
    coachObservations: [
      {
        id: 'obs-1',
        coachName: 'Ryan Harris',
        coachRole: 'High Performance Pace Bowling Coach',
        coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: '03 Sep 2026',
        primaryDiscipline: 'bowling',
        technicalDiagnostic:
          'High-speed capture from Thursday net session shows Devang has rectified his front knee collapse. His brace is now measuring 172.4° at delivery stride. However, his wrist flick at ball release is still tilting 3° toward leg-slip, which turns an outswinger into a flat wobble ball.',
        praisePoint: 'The front-knee lockout is world class. Ball speed touched 142.4 km/h with zero lumbar strain.',
        correctiveAction: 'Incorporate 15 minutes of weighted-ball wrist-release drill before every bowling session. Focus on snapping both seam fingers cleanly forward.',
        audioVoiceNoteUrl: '/audio/coach-ryan-wrist-snap.mp3',
        audioDurationSec: 42,
        linkedKeyframe: 'Keyframe #148 (Release Point)',
        verifiedBadge: true
      },
      {
        id: 'obs-2',
        coachName: 'Justin Langer',
        coachRole: 'Senior Batting Specialist & Tactical Mentor',
        coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        date: '28 Aug 2026',
        primaryDiscipline: 'batting',
        technicalDiagnostic:
          'Against express pace (140+ km/h), Devang is occasionally committing his weight forward before deciphering the length. When the short ball comes, he gets trapped on the front foot and has to improvise an awkward swivel pull.',
        praisePoint: 'His straight drive and extra cover loft are textbook. The high lead elbow gives him complete aerial safety.',
        correctiveAction: 'Keep the trigger movement crisp and compact: back and across, but eyes dead still. Do not commit front foot until ball is 8m out.',
        audioVoiceNoteUrl: '/audio/coach-jl-pull-trigger.mp3',
        audioDurationSec: 55,
        linkedKeyframe: 'Keyframe #84 (Trigger Movement)',
        verifiedBadge: true
      },
      {
        id: 'obs-3',
        coachName: 'Michael Di Venuto',
        coachRole: 'Assistant Head Coach & Lead Fielding Analyst',
        coachAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        date: '22 Aug 2026',
        primaryDiscipline: 'fielding',
        technicalDiagnostic:
          'Slip cordon agility is top tier. Devang took 4 out of 4 edges in the 2nd slip scenario test. Hand positioning is low with soft pinkies linked.',
        praisePoint: 'Superb 0.24s split-step timing. He reads the edge off the bat face before the bowler has even finished follow-through.',
        correctiveAction: 'Maintain this routine. Continue reflex ball drills against the board.',
        verifiedBadge: true
      }
    ],

    // -----------------------------------------------------------------------
    // RECENT VIDEOS
    // -----------------------------------------------------------------------
    recentVideos: [
      {
        id: 'vid-pdp-1',
        title: 'Express Delivery Stride & Knee Brace Telemetry',
        date: '03 Sep 2026',
        discipline: 'bowling',
        fps: 120,
        duration: '0:14',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: '172.4° Brace • 142.4 km/h',
        analysisVerdict: 'OPTIMAL',
        biomechanicalNote: 'Catapult effect verified. Clean kinetic chain through ankle, knee, hip, and shoulder.',
        comparisonReady: true
      },
      {
        id: 'vid-pdp-2',
        title: 'Front-Foot Cover Drive vs Full Toss & Good Length',
        date: '31 Aug 2026',
        discipline: 'batting',
        fps: 60,
        duration: '0:22',
        thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: '92.4° Elbow • 112 km/h Exit',
        analysisVerdict: 'OPTIMAL',
        biomechanicalNote: 'Head leading directly over the contact point with soft hands presentation.',
        comparisonReady: true
      },
      {
        id: 'vid-pdp-3',
        title: 'Short Ball Pull Shot vs 138 km/h Bowling Machine',
        date: '28 Aug 2026',
        discipline: 'batting',
        fps: 120,
        duration: '0:18',
        thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: 'Wrist Roll Check • Aerial Flaw',
        analysisVerdict: 'NEEDS_WORK',
        biomechanicalNote: 'Weight stayed 38% on front foot, leading to high ball exit trajectory.',
        comparisonReady: false
      },
      {
        id: 'vid-pdp-4',
        title: 'Seam Release Snap Close-Up (Ultra High-Speed)',
        date: '25 Aug 2026',
        discipline: 'bowling',
        fps: 240,
        duration: '0:09',
        thumbnail: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: 'Wrist Tilt -4.2° Wobble',
        analysisVerdict: 'GOOD',
        biomechanicalNote: 'Seam angle improved +12% since 15 Aug baseline session.',
        comparisonReady: true
      }
    ],

    // -----------------------------------------------------------------------
    // PROGRESS EVIDENCE (Not just stats! Concrete before-vs-after evidence)
    // -----------------------------------------------------------------------
    progressEvidence: [
      {
        id: 'ev-1',
        metricTitle: 'Front-Knee Brace Lockout Angle at Ball Release',
        category: 'biomechanics',
        baselineState: {
          date: '12 Jul 2026',
          value: '144.2° Flexed (Buckling)',
          description: 'Knee was giving way by 35° under footstrike impact, dissipating energy and putting strain on lower back.',
          visualAngle: '144.2°'
        },
        currentState: {
          date: '03 Sep 2026',
          value: '172.4° Rigid Lockout (+28.2°)',
          description: 'Absolute steel brace. Full kinetic energy catapults into the bowling shoulder, increasing top speed from 136.0 to 142.4 km/h.',
          visualAngle: '172.4°'
        },
        deltaImprovement: '+28.2° knee stiffness • +6.4 km/h release velocity',
        coachVerdict: 'VERIFIED & CERTIFIED: Biomechanical transformation completed. Risk of spinal stress fracture dramatically mitigated.',
        signOffDate: '04 Sep 2026',
        coachSignature: 'Ryan Harris (Accredited High-Performance Biomechanist)',
        status: 'VERIFIED'
      },
      {
        id: 'ev-2',
        metricTitle: '4th-Stump Channel Corridor Consistency (6.0m - 7.5m Length)',
        category: 'bowling',
        baselineState: {
          date: '05 Aug 2026',
          value: '54.2% in corridor (13/24 balls)',
          description: 'High variance on balls 4-6 in spell; overpitching by 40cm or spraying down leg under fatigue.',
          visualAngle: 'Corridor spread: 82cm'
        },
        currentState: {
          date: '02 Sep 2026',
          value: '79.2% in corridor (19/24 balls)',
          description: 'Laser-guided consistency. 19 out of 24 balls pitched directly on the target mat on 4th-stump line.',
          visualAngle: 'Corridor spread: 31cm (-51cm tighter)'
        },
        deltaImprovement: '+25.0% corridor accuracy • 51cm tighter cluster',
        coachVerdict: 'VERIFIED: Stride length consistency has eliminated the overpitching tendency under match load.',
        signOffDate: '03 Sep 2026',
        coachSignature: 'Ryan Harris & Justin Langer',
        status: 'VERIFIED'
      },
      {
        id: 'ev-3',
        metricTitle: 'Seam Upright Presentation vs Wobble Seam',
        category: 'bowling',
        baselineState: {
          date: '18 Aug 2026',
          value: '52% true seam (wobble on 48%)',
          description: 'Backward wrist collapse at ball release caused ball to wobble through air with reduced late swing.',
          visualAngle: '-4.2° tilt'
        },
        currentState: {
          date: '03 Sep 2026',
          value: '79% true seam (+27% increase)',
          description: 'Wrist cock remains locked at 21.5° through release window; seam upright with 32 RPS spin rate.',
          visualAngle: '+21.5° true'
        },
        deltaImprovement: '+27% true seam upright rotation • +18cm late movement',
        coachVerdict: 'IN PROGRESS (Target 85%): Excellent progression. Retest scheduled after 3 more weighted-ball sessions.',
        signOffDate: 'Pending 18 Sep Retest',
        coachSignature: 'Ryan Harris',
        status: 'PENDING_RETEST'
      }
    ]
  },

  // =========================================================================
  // 2. LIAM CHEN (Junior Player: Age 15, U16 Fast-Bowling All-Rounder)
  // =========================================================================
  'usr-liam-junior': {
    id: 'pdp-liam-junior-2026',
    playerId: 'usr-liam-junior',
    playerName: 'Liam Chen',
    playerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    playerRoleTitle: 'Junior Premiere • U16 Representative Seamer',
    primaryDiscipline: 'bowling',
    coachInCharge: 'David Saker (Academy Fast Bowling Coach)',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    planCycle: '2026 Junior Development & Pathway Progression',
    lastReviewDate: '26 Aug 2026',
    nextScheduledReview: '16 Sep 2026',
    executiveSummary:
      'Liam is an exceptionally gifted 15-year-old right-arm fast bowler bowling in the 124-128 kph range. Under Cricket Australia safeguarding & youth workload directives, his weekly volume is capped at 30 balls per session and 90 balls per week. His PDP priorities focus on non-bowling arm pull-down to protect spinal alignment, rhythm calibration of his 15-stride approach, and soft hands forward defensive fundamentals.',
    
    strengths: [
      {
        id: 'lj-str-1',
        category: 'bowling',
        title: 'Natural Wrist Snap & Ball seam presentation',
        description: 'Naturally gifted loose wrist snap that generates rapid upright seam rotation without forced effort.',
        evidenceMetric: '28 RPS seam spin rate • 126.8 kph top speed at age 15',
        coachEndorsement: 'David Saker: "Has the natural seam position that many bowlers take years to develop."',
        icon: 'sports_cricket'
      },
      {
        id: 'lj-str-2',
        category: 'fitness',
        title: 'Aerobic Base & Workload Discipline',
        description: 'Strict adherence to junior workload logs. High mobility in hips and thoracic spine.',
        evidenceMetric: 'Beep test 12.8 • Zero missed sessions • Flawless workload logging',
        coachEndorsement: 'Youth Physio: "Growth plates and lumbar spine are healthy and well-managed."',
        icon: 'favorite'
      }
    ],

    developmentAreas: [
      {
        id: 'lj-dev-1',
        category: 'bowling',
        priority: 'HIGH',
        title: 'Non-Bowling Front Arm Pull-Down Alignment',
        biomechanicalTarget: 'Reach high with left glove towards batter, then pull vertically down into the left ribcage pocket.',
        currentFlaw: 'Left arm drops away horizontally towards point, pulling head to the off-side and straining the right side of lower back.',
        rootCause: 'Rushing delivery bound without full vertical extension.',
        targetCompletionDate: '20 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 70,
        linkedDrillIds: ['drill-front-arm-01']
      },
      {
        id: 'lj-dev-2',
        category: 'batting',
        priority: 'MEDIUM',
        title: 'Front-Foot Defensive Head Positioning',
        biomechanicalTarget: 'Lead with head and nose over the ball; keep hands soft so ball drops dead at feet.',
        currentFlaw: 'Hands push out away from body towards ball, resulting in edges ballooning to gully.',
        rootCause: 'Tension in shoulders when facing faster bowling machine settings.',
        targetCompletionDate: '28 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 58,
        linkedDrillIds: ['drill-soft-hands-02']
      }
    ],

    activeGoals: [
      {
        id: 'lj-goal-1',
        title: 'Front-Arm Vertical Sightline: 85% Alignment in Drills',
        category: 'bowling',
        targetMetric: 'Front Arm Vertical Angle',
        baselineValue: '48° horizontal drop',
        currentValue: '72° vertical alignment',
        targetValue: '85° vertical alignment',
        deadline: '20 Sep 2026',
        status: 'ON_TRACK',
        progressPct: 72,
        coachNotes: 'Liam is responding very well to the visual cue of "reaching for the apple and putting it in your pocket".',
        milestones: [
          { id: 'lj-m-1', title: 'Mirror gather and reach drill (100 reps)', completed: true, targetDate: '01 Sep' },
          { id: 'lj-m-2', title: 'Slow-motion video review with parent CC', completed: true, targetDate: '06 Sep' },
          { id: 'lj-m-3', title: 'Target mat bowling session with vertical pole cue', completed: false, targetDate: '18 Sep' }
        ]
      },
      {
        id: 'lj-goal-2',
        title: 'Junior Workload Safety: Strictly Zero Session Exceedance',
        category: 'fitness',
        targetMetric: 'Weekly Ball Count Limit (Max 90)',
        baselineValue: 'Compliant (84/90)',
        currentValue: 'Compliant (78/90)',
        targetValue: '<90 balls with 48h rest',
        deadline: 'Ongoing',
        status: 'ACHIEVED',
        progressPct: 100,
        coachNotes: 'Parent and coach have verified all logs. Zero overuse symptoms.',
        milestones: [
          { id: 'lj-m-4', title: 'Parent Portal sync verification', completed: true, targetDate: '28 Aug' },
          { id: 'lj-m-5', title: 'Physio monthly spinal screening', completed: true, targetDate: '03 Sep' }
        ]
      }
    ],

    assignedDrills: [
      {
        id: 'lj-drill-1',
        drillId: 'drill-front-arm-01',
        drillTitle: 'High-Reach Front Arm & Pocket Tuck Routine',
        category: 'bowling',
        focusArea: 'Non-bowling arm vertical pull and head stability',
        weeklyPrescription: '3x sessions / week • 15 minutes',
        setsReps: '3 sets of 8 delivery strides (focus on form, walk-through)',
        coachInstructions: 'Reach up to the imaginary target, hold sightline for 0.5 seconds, then pull elbow tightly into your left hip.',
        status: 'IN_PROGRESS',
        completedSessions: 7,
        targetSessions: 10,
        lastCompletedDate: '03 Sep 2026'
      },
      {
        id: 'lj-drill-2',
        drillId: 'drill-soft-hands-02',
        drillTitle: 'Soft Hands Front-Foot Defensive Cushioning',
        category: 'batting',
        focusArea: 'Absorbing pace and keeping ball on ground',
        weeklyPrescription: '2x sessions / week • 20 minutes',
        setsReps: '4 sets of 10 balls from tennis-ball sidearm thrower',
        coachInstructions: 'Relax top wrist. Catch the ball with the bat face right under your eyes. Do not push at it.',
        status: 'IN_PROGRESS',
        completedSessions: 4,
        targetSessions: 8,
        lastCompletedDate: '02 Sep 2026'
      }
    ],

    coachObservations: [
      {
        id: 'lj-obs-1',
        coachName: 'David Saker',
        coachRole: 'Academy Pace Bowling Mentor',
        coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: '02 Sep 2026',
        primaryDiscipline: 'bowling',
        technicalDiagnostic:
          'Liam made excellent progress on his run-up tempo. The stride markers showed identical 15-stride foot placements over all 18 test deliveries. His non-bowling arm is now reaching 20cm higher, giving him a steeper bounce angle.',
        praisePoint: 'Great discipline and coachability. His focus during the walk-through drills is outstanding.',
        correctiveAction: 'Keep reminding him to pull the elbow down into the pocket rather than letting it swing wide.',
        audioVoiceNoteUrl: '/audio/coach-saker-liam-pdp.mp3',
        audioDurationSec: 38,
        linkedKeyframe: 'Keyframe #92 (Front Arm Apex)',
        verifiedBadge: true
      }
    ],

    recentVideos: [
      {
        id: 'lj-vid-1',
        title: 'Non-Bowling Arm Reach & Run-Up Consistency Test',
        date: '02 Sep 2026',
        discipline: 'bowling',
        fps: 120,
        duration: '0:12',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: '126.8 kph • 72° Front Arm',
        analysisVerdict: 'GOOD',
        biomechanicalNote: 'Safe spinal posture confirmed by youth biomechanics protocol.',
        comparisonReady: true
      }
    ],

    progressEvidence: [
      {
        id: 'lj-ev-1',
        metricTitle: 'Non-Bowling Arm Vertical Elevation at Gather',
        category: 'biomechanics',
        baselineState: {
          date: '02 Aug 2026',
          value: '48° (Dropped Arm)',
          description: 'Arm was dropping early, causing head to fall over and pulling balls down the leg side.',
          visualAngle: '48°'
        },
        currentState: {
          date: '02 Sep 2026',
          value: '72° (+24° Improvement)',
          description: 'Arm stays high through gather, aligning shoulders and eyes directly down the pitch.',
          visualAngle: '72°'
        },
        deltaImprovement: '+24° vertical elevation • 62% reduction in leg-side wides',
        coachVerdict: 'VERIFIED: Massive technical stride forward for Liam. Significantly safer for lumbar spine.',
        signOffDate: '03 Sep 2026',
        coachSignature: 'David Saker (Youth High-Performance Lead)',
        status: 'VERIFIED'
      }
    ]
  },

  // =========================================================================
  // 3. MARCUS THORNE (Senior Express Strike Bowler: 146 kph)
  // =========================================================================
  'usr-marcus': {
    id: 'pdp-marcus-2026',
    playerId: 'usr-marcus',
    playerName: 'Marcus Thorne',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    playerRoleTitle: 'Senior Express Strike Bowler (146 kph)',
    primaryDiscipline: 'bowling',
    coachInCharge: 'Ryan Harris & Brett Lee',
    coachAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planCycle: '2026 First-Class Domestic Campaign',
    lastReviewDate: '24 Aug 2026',
    nextScheduledReview: '14 Sep 2026',
    executiveSummary:
      'Marcus possesses raw express pace clocking consistently above 144 kph. His PDP targets: (1) perfecting his blockhole yorker execution in death overs from 62% to 85%, (2) developing a disguised back-of-the-hand knuckle ball with zero change in arm speed, and (3) improving second-spell recovery through heart rate variability training.',
    
    strengths: [
      {
        id: 'mt-str-1',
        category: 'bowling',
        title: 'Explosive Run-Up Cadence & High Release Velocity',
        description: 'Generates 8.4 m/s approach speed with an aggressive pre-delivery bound, translating into heavy bounce off a good length.',
        evidenceMetric: '146.2 kph peak velocity • 8.4 m/s run-up cadence • 2.12m release height',
        coachEndorsement: 'Brett Lee: "One of the most naturally explosive run-up engines in state cricket."',
        icon: 'bolt'
      }
    ],

    developmentAreas: [
      {
        id: 'mt-dev-1',
        category: 'bowling',
        priority: 'HIGH',
        title: 'Death-Overs Blockhole Yorker Execution',
        biomechanicalTarget: 'Release ball 10cm further out in front with locked wrist to nail base of stumps.',
        currentFlaw: 'Releases 5cm too early when aiming for yorkers, turning into half-volleys punished over long-on.',
        rootCause: 'Torso dropping back slightly in anticipation of power hitter stepping out.',
        targetCompletionDate: '15 Sep 2026',
        status: 'IN_PROGRESS',
        progressPct: 76,
        linkedDrillIds: ['drill-yorker-blitz-01']
      }
    ],

    activeGoals: [
      {
        id: 'mt-goal-1',
        title: 'Blockhole Yorker Accuracy: 10 / 12 Balls in Target Ring',
        category: 'bowling',
        targetMetric: 'Yorker Target Accuracy',
        baselineValue: '6 / 12 balls (50%)',
        currentValue: '9 / 12 balls (75%)',
        targetValue: '10 / 12 balls (83%)',
        deadline: '15 Sep 2026',
        status: 'ON_TRACK',
        progressPct: 75,
        coachNotes: 'Target ring drill with shoe at base of off-stump is working miracles.',
        milestones: [
          { id: 'mt-m-1', title: 'Target shoe drill 50 balls', completed: true, targetDate: '28 Aug' },
          { id: 'mt-m-2', title: 'Live net scenario with power hitter', completed: true, targetDate: '02 Sep' }
        ]
      }
    ],

    assignedDrills: [
      {
        id: 'mt-drill-1',
        drillId: 'drill-yorker-blitz-01',
        drillTitle: 'Shoe-Base Yorker Precision Under Pressure',
        category: 'bowling',
        focusArea: 'Yorker release point and follow-through dive',
        weeklyPrescription: '3x sessions / week • 25 minutes',
        setsReps: '4 sets of 6 balls targeting 30cm zone at base of off-stump',
        coachInstructions: 'Sight the base of off stump. Keep wrist stiff and push ball through the crease window.',
        status: 'IN_PROGRESS',
        completedSessions: 8,
        targetSessions: 12,
        lastCompletedDate: '03 Sep 2026'
      }
    ],

    coachObservations: [
      {
        id: 'mt-obs-1',
        coachName: 'Ryan Harris',
        coachRole: 'Bowling Mentor',
        coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: '01 Sep 2026',
        primaryDiscipline: 'bowling',
        technicalDiagnostic:
          'Marcus nailed 9 out of 12 yorkers in Tuesdays simulation. His release point variance narrowed to under 3.5cm, which is elite for 145+ kph bowling.',
        praisePoint: 'He is trusting his release point and not trying to muscle the ball into the turf.',
        correctiveAction: 'Keep practicing against left-handed stance targets to ensure same line control.',
        audioVoiceNoteUrl: '/audio/coach-ryan-marcus-yorker.mp3',
        audioDurationSec: 45,
        linkedKeyframe: 'Keyframe #112 (Yorker Release)',
        verifiedBadge: true
      }
    ],

    recentVideos: [
      {
        id: 'mt-vid-1',
        title: '146.2 kph Yorker Stump-Cam Analysis',
        date: '01 Sep 2026',
        discipline: 'bowling',
        fps: 240,
        duration: '0:15',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
        keyMetricBadge: '146.2 kph • Base of Off Stump',
        analysisVerdict: 'OPTIMAL',
        biomechanicalNote: 'Release height 2.12m with late dip trajectory.',
        comparisonReady: true
      }
    ],

    progressEvidence: [
      {
        id: 'mt-ev-1',
        metricTitle: 'Death Overs Yorker Hit Rate at Base of Stumps',
        category: 'bowling',
        baselineState: {
          date: '10 Jul 2026',
          value: '45% Hit Rate',
          description: 'High rate of juicy half-volleys and full tosses in death overs.',
          visualAngle: 'Scatter: 65cm'
        },
        currentState: {
          date: '01 Sep 2026',
          value: '75% Hit Rate (+30%)',
          description: '9 out of 12 balls directly in the blockhole. Clean stump-rattling execution.',
          visualAngle: 'Scatter: 18cm (-47cm)'
        },
        deltaImprovement: '+30% yorker accuracy • Economy rate in overs 18-20 reduced by 2.8 RPO',
        coachVerdict: 'VERIFIED: Significant weapon unlocked for death bowling in upcoming state tournament.',
        signOffDate: '02 Sep 2026',
        coachSignature: 'Ryan Harris',
        status: 'VERIFIED'
      }
    ]
  }
};
