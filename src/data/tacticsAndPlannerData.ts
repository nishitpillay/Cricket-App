import {
  TacticalMasterclass,
  ScenarioItem,
  TrainingPlan,
  FieldPlacementPreset,
  WagonWheelShot,
  PitchMapDelivery
} from '../types';

// ==========================================
// TACTICAL MASTERCLASSES (Elite Coaches & Pros)
// ==========================================
export const mockMasterclasses: TacticalMasterclass[] = [
  {
    id: 'mc-malinga-death-overs',
    title: 'Mastering the 20th Over: Death Bowling Geometry',
    coach: 'Lasith Malinga & Brett Lee',
    coachRole: 'Legendary Death Pace Specialists',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
    badge: 'T20 Match Awareness',
    duration: '18 min Breakdown',
    overview: 'How to defend fewer than 10 runs in the final over using wide yorkers, dipping slower balls, and off-side boundary protection traps.',
    videoThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF2zkt7HiJBkOubcIhEyE9evYb6SNXruUycT4ZXOlv_ujVyqjEIkunsEspRZeXwBK7coke_mYqjAbs4v-d3uM8P2W8EfX9vOA3PYzI2LesZ1rAQ03FgiIDFwkU4VMffqRBWOBeCMbVzdOH00wHbare88_nrKVDisHI5lYs9hULdCzv7VkuNZJC01ueMNRFBmNVj_CspRxg1kKBMHmQYe-VzK_hIatzqi4B79kYWMlJvTxiqxhmRfsZ',
    keyTactics: [
      {
        title: 'The "Ghost" 5th Stump Channel',
        description: 'Aiming 6 inches inside the return crease prevents leg-side swing arcs without conceding wide balls.',
        icon: 'gps_fixed'
      },
      {
        title: 'Deep Point & Deep Cover Squeeze',
        description: 'Stacking the off-side boundary forces right-handers into uncomfortable aerial slice shots.',
        icon: 'shield'
      },
      {
        title: 'Back-of-Hand Disguise',
        description: 'Releasing with no drop in arm speed causes 18kph deceleration, inducing mistimed toe-ends.',
        icon: 'visibility_off'
      }
    ],
    chapters: [
      { timestamp: '0:00', title: 'Reading the Batsman\'s Stance Depth', summary: 'Identifying if the batsman is backing away or walking across the stumps.' },
      { timestamp: '4:20', title: 'Wide Yorker vs Stumps Yorker Risk Matrix', summary: 'When to attack base of off stump vs taking the ball away from the power hitting zone.' },
      { timestamp: '9:45', title: 'Mid-Wicket Sweeper Placement', summary: 'Positioning fielders 3 yards inside the rope to catch high-hang flatter mishits.' },
      { timestamp: '14:10', title: 'Mental Composure Under Clamour', summary: 'Breathing rhythm between balls 1-6 when defending a low target.' }
    ],
    whiteboardTakeaway: 'Always bowl to your field. If your captain gives you 5 men on the off side, bowling a single ball on the leg stump is a tactical surrender.'
  },
  {
    id: 'mc-ponting-field-chess',
    title: 'Captaincy Chess: Setting In-Out Rings for Power Hitters',
    coach: 'Ricky Ponting & Brendon McCullum',
    coachRole: 'World Cup Winning Strategists',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
    badge: 'Tactical Leadership',
    duration: '22 min Analysis',
    overview: 'Deconstructing modern boundary-riding setups, dummy ring fielders, and suffocating singles to force risky aerial strokes.',
    videoThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUhRX49VlsH8nMtvYrYR6jIqwrPVjIbe72z4ZzXbtfKRuvmO_mNIQOLg2nRiHHvYrSsnldqFsRhzwlEHkcFSbsEBm0RfAF3SoWKD8s6IBueHFTV9utstjjnuEPxIPN6wBelpLs5QDqUGW8j4vISoo62nNrAjWG_ELjTGOGPvS89yAeHzBQ5c3I4NCoVyGjhh9BNLb07UmTfhB_g3zyk_DgVwHdryYBVF6No2EmBvstoK1GZSoFnXr5',
    keyTactics: [
      {
        title: 'The Umbrella Choke (Overs 7-15)',
        description: 'Placing extra cover and mid-wicket up inside the circle to cut off easy 1s and 2s.',
        icon: 'grid_view'
      },
      {
        title: 'Targeting Boundary Wind Vectors',
        description: 'Using the longer ground boundary to tempt batters to pull against the breeze into waiting fielders.',
        icon: 'air'
      },
      {
        title: 'Reverse Sweep Trap with Short 45°',
        description: 'Moving backward point 5 paces finer creates an irresistible gap that leads to top-edged catches.',
        icon: 'sports_baseball'
      }
    ],
    chapters: [
      { timestamp: '0:00', title: 'The Psychology of Dot-Ball Pressure', summary: 'How three consecutive dots lower batsman decision accuracy by 60%.' },
      { timestamp: '6:15', title: 'Setting the Trap Before Bowling the Ball', summary: 'Making a deliberate fielding change to plant a false sense of security.' },
      { timestamp: '12:30', title: 'Managing Spin Bowling Rings', summary: 'Protecting straight boundaries while inviting the aerial inside-out drive.' },
      { timestamp: '18:00', title: 'Post-Wicket Consolidation', summary: 'Attacking the new batsman on balls 1 to 3 with catchers in front of the wicket.' }
    ],
    whiteboardTakeaway: 'Great captains do not merely save runs; they dictate where the batsman is permitted to try to score.'
  },
  {
    id: 'mc-warne-spin-traps',
    title: 'Spin Web: Setting Traps on Day 4 & 5 Surfaces',
    coach: 'Shane Warne & Anil Kumble Tribute',
    coachRole: 'Spin Bowling Masterminds',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkB5N0TTbKi9jRtbbTpMmF5v7Xd_UV2tFgR8HcGjhjz1kMWaEtDdqcBHoz4skX1kJU9DNtg-jA8OOnRZfkXkSo9n0udxxT9Va20LTCGD2wIApRUizg7o8sWD_DrzxgaSMjvYxn3m9BMIsLzmTCTUpxDVG-tYffANutnuEPWrLdsplqektJOaOJcqPo_MkpoXgdsdkROHZZFCHKKvpnxyJU4Wn9wh5Aubu_TbjBD5SmVG2t_6U819TN',
    badge: 'Red Ball & Subcontinent',
    duration: '25 min Masterclass',
    overview: 'Exploiting footmarks, subtle variations in flight speeds (82kph vs 92kph), and bat-pad catchers to dismantle solid defenses.',
    videoThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAocjwhFczAJ0873KBgxVtPB2QzVMDnGWqHE1UwEqdjBvwtn6H_rVdzMOWTmNFuUD5hYusLaRNX6VFIs8eQe6Vl85mj4gPL2mZPGFwEonLodOgJC_ETiZSSP5A13Pwz-pyGJ_26CWzcYD3KHWKKlbxv0dnCQZBLPSHDJ2BmudVl2rGH4wJv7oLTyqB-lGtn4cVRMRsZfflYki_RhdND-_zLYHFCVNXWdsGp6VwuY8VJBIxtBNOn86rp',
    keyTactics: [
      {
        title: 'The "Overspin Dip" Illusion',
        description: 'Top-spin releases cause the ball to dive 12cm shorter than the batsman expects, inducing premature lunges.',
        icon: 'swap_calls'
      },
      {
        title: 'Forward Short-Leg Helmet Placement',
        description: 'Positioning short-leg 4 paces at 45 degrees to capture bat-pad pops and reflex glove deflections.',
        icon: 'sports_cricket'
      },
      {
        title: 'Under-Cutting the Slider',
        description: 'Using backspin with the seam upright keeps the delivery skid-low to strike the front pad below knee-roll.',
        icon: 'trending_down'
      }
    ],
    chapters: [
      { timestamp: '0:00', title: 'Mapping the Scuffed Rough Zones', summary: 'Using the bowler\'s follow-through marks to generate sharp unpredictable turn.' },
      { timestamp: '7:40', title: 'The 3-Ball Setup for the Googly / Arm Ball', summary: 'Two sharp turners pushing the batsman onto the back foot, followed by the straight skidding dart.' },
      { timestamp: '15:20', title: 'Slip Angle Positioning for Slow Turn', summary: 'Widening 1st slip and dropping 2nd slip 1 yard deeper for delayed edges.' },
      { timestamp: '21:10', title: 'Patience & Economy', summary: 'Building the dot-ball dam until the batsman attempts a low-percentage loft.' }
    ],
    whiteboardTakeaway: 'The turn does not dismiss the batsman; the fear of the turn does.'
  }
];

// ==========================================
// SCENARIO-BASED TRAINING (Interactive Decision Engine)
// ==========================================
export const mockScenarios: ScenarioItem[] = [
  {
    id: 'scen-death-over-14',
    title: 'Defend 14 Runs in the 20th Over (3 Wickets in Hand)',
    badge: 'T20 High Pressure',
    format: 'T20 Death Overs',
    matchContext: {
      requiredRuns: 14,
      oversRemaining: 1,
      wicketsLeft: 3,
      pitchCondition: 'Dry, hard surface with slight reverse swing available',
      weatherCondition: 'Warm evening, 12 km/h cross breeze towards mid-wicket'
    },
    targetBatsman: {
      name: 'Marcus "The Hulk" Stoinis',
      style: 'Right-hand power striker, bottom-hand dominant',
      strengths: ['Massive arc from straight to cow corner', 'Exceptional against slot balls and full tosses'],
      weaknesses: ['Vulnerable to wide yorkers outside off stump', 'Struggles with sharp 138kph chest-high bouncers with fine leg back']
    },
    problemStatement: 'You are the frontline death bowler. The opposition needs 14 off 6 balls. Marcus is on strike having smashed 38 off 18 balls. You have 5 fielders allowed outside the 30-yard circle. What is your bowling and field strategy for Ball 1?',
    choices: [
      {
        id: 'opt-wide-yorker',
        title: 'Wide Yorker Strategy (Outside Off Channel)',
        description: 'Bowl 136kph wide yorker 4 inches inside the tramline. Pack off-side with Deep Point, Deep Cover, Long-Off, and Deep Third. Fine Leg on boundary.',
        fieldSetup: 'Off-Side Heavy: Deep Point, Deep Cover, Long-Off, Long-On, Deep Fine Leg. Extra Cover in the ring.',
        deliveryType: 'Wide Toe-Crusher Yorker at 136 kph',
        riskReward: 'Safe',
        scoreImpact: 95,
        isOptimal: true,
        coachVerdict: 'Masterclass Execution! By taking the ball away from his bottom-hand arc, you deny him access to leg-side. He can only score a single or squeeze an edge.',
        simulatedOutcome: {
          result: 'Squeezed to Deep Point for a Single (1 Run)',
          runsConcededOrScored: 1,
          wicketChance: '45% (Play & Miss or Toe Edge)',
          visualAnimation: 'ball-wide-yorker-jam'
        }
      },
      {
        id: 'opt-stump-yorker',
        title: 'Attack Middle & Leg Stump Yorker',
        description: 'Aim directly for base of leg stump at maximum pace (143 kph) to blow through his flick stroke.',
        fieldSetup: 'Leg-Side Heavy: Deep Mid-Wicket, Long-On, Deep Square Leg, Fine Leg, Long-Off.',
        deliveryType: 'Pitched at base of leg stump at 143 kph',
        riskReward: 'Aggressive',
        scoreImpact: 68,
        isOptimal: false,
        coachVerdict: 'High Risk! If your execution is off by even 2 inches, it turns into a leg-stump half-volley which Marcus easily whips over cow corner for 6.',
        simulatedOutcome: {
          result: 'Batter clears front leg and whips over Mid-Wicket for 4 Runs',
          runsConcededOrScored: 4,
          wicketChance: '30% (Bowled if millimeter perfect)',
          visualAnimation: 'ball-leg-stump-whip'
        }
      },
      {
        id: 'opt-slower-bouncer',
        title: 'Off-Cutter Back-of-Length Bouncer',
        description: 'Disguised back-of-the-hand slower ball (114 kph) climbing to rib height. Mid-wicket and deep square leg back.',
        fieldSetup: 'Boundary Catching Ring: Deep Mid-Wicket, Deep Square, Deep Fine Leg, Long-On, Long-Off.',
        deliveryType: '114 kph Off-Cutter Short Ball',
        riskReward: 'Tactical Gamble',
        scoreImpact: 82,
        isOptimal: false,
        coachVerdict: 'Good Tactical Trap! If the batsman swings early, the lack of pace produces a skyer to mid-wicket. However, on a true bounce pitch, there is a risk of a wide over the head.',
        simulatedOutcome: {
          result: 'Top edge skies high to Deep Mid-Wicket — CAUGHT & OUT!',
          runsConcededOrScored: 0,
          wicketChance: '70% (Top Edge Mistimed Pull)',
          visualAnimation: 'ball-top-edge-catch'
        }
      }
    ]
  },
  {
    id: 'scen-powerplay-swing',
    title: 'Facing 145 kph Outswing in Over 2 (Chasing 185)',
    badge: 'Batting Decision Engine',
    format: 'Powerplay Blast',
    matchContext: {
      requiredRuns: 172,
      oversRemaining: 18.2,
      wicketsLeft: 9,
      pitchCondition: 'Green seam tinge with 2.8° lateral movement under lights',
      weatherCondition: 'Humid, breezy'
    },
    targetBatsman: {
      name: 'Mitchell Starc / Trent Boult',
      style: 'Left-arm fast bowler bowling thunderbolts at the corridor',
      strengths: ['Late banana swing into right-handers and shaping away from off-stump', 'Lethal toe-crusher first ball'],
      weaknesses: ['Overpitches seeking swing; punishable if driven straight under the eyes']
    },
    problemStatement: 'You are on 6 off 7 balls. The ball is hooping late. Starc has 2 slips, a gully, and a catching mid-wicket. The field inside the ring is packed. How do you construct your response for the upcoming 6-ball over?',
    choices: [
      {
        id: 'opt-stand-outside-crease',
        title: 'Step 1 Foot Outside the Crease & Play Under the Eyes',
        description: 'Shorten the swing arc by taking stance outside the popping crease. Play purely with soft hands into the gap between point and cover.',
        fieldSetup: '2 Slips, Gully, Point, Cover, Mid-Off, Mid-On, Square Leg, Fine Leg.',
        deliveryType: '144 kph Full Delivery Shaping Away',
        riskReward: 'Safe',
        scoreImpact: 92,
        isOptimal: true,
        coachVerdict: 'Brilliant Technique! Stepping outside the crease cuts off 30% of the late deviation before it bends, and soft hands ensure edges drop short of the slips.',
        simulatedOutcome: {
          result: 'Controlled push through extra-cover gap for 2 Runs',
          runsConcededOrScored: 2,
          wicketChance: '15%',
          visualAnimation: 'bat-cover-push'
        }
      },
      {
        id: 'opt-charge-loft-midon',
        title: 'Charge Down the Pitch & Loft Over Mid-On',
        description: 'Attack the bowler aggressively to disrupt his line and clear the 30-yard circle over mid-on.',
        fieldSetup: 'Attacking Ring with 2 Slips and Mid-On at 30 yards.',
        deliveryType: '146 kph Full Length Swinging Delivery',
        riskReward: 'Tactical Gamble',
        scoreImpact: 42,
        isOptimal: false,
        coachVerdict: 'Reckless! Coming down the track against 145kph lateral swing causes head detachment. A faint outside edge carries straight into the keeper\'s gloves.',
        simulatedOutcome: {
          result: 'Outside Edge through to Wicketkeeper — CAUGHT BEHIND!',
          runsConcededOrScored: 0,
          wicketChance: '85% (Outswing Edge)',
          visualAnimation: 'bat-edge-keeper'
        }
      }
    ]
  },
  {
    id: 'scen-spin-batpad-trap',
    title: 'Setting the Bat-Pad Trap on a Day 4 Turner',
    badge: 'Red-Ball Test Match',
    format: 'Spin Web',
    matchContext: {
      requiredRuns: 88,
      oversRemaining: 34,
      wicketsLeft: 4,
      pitchCondition: 'Puffing dust from leg-side rough, heavy cracks outside right-hander off-stump'
    },
    targetBatsman: {
      name: 'Defensive Anchor (0 off 22 balls)',
      style: 'Rock solid forward defense, trusts pads with soft hands',
      strengths: ['Very disciplined, leaves outside off stump consistently'],
      weaknesses: ['Hangs bat behind front pad when lunging forward against sharp turners']
    },
    problemStatement: 'You are bowling off-spin into the rough outside off stump. The batsman is lunging forward smothering the spin with pad and bat together. How do you create the breakthrough?',
    choices: [
      {
        id: 'opt-arm-ball-drift',
        title: 'Set Short-Leg & Silly Point, Then Fire the Arm Ball on Middle',
        description: 'Pack fielders 2 yards away. Bowl 3 sharp turners into the rough, then deliver the faster 94kph arm ball that angles in without turning.',
        fieldSetup: 'Silly Point, Forward Short Leg, Slip 1, Slip 2, Leg Slip, Mid-Wicket, Cover.',
        deliveryType: '94 kph Skidding Arm Ball In-Line with Off/Middle',
        riskReward: 'Aggressive',
        scoreImpact: 98,
        isOptimal: true,
        coachVerdict: 'Classic Master Setup! The batsman anticipates the big turn from the rough and plays inside the line. The ball skids straight on and traps him plumb LBW or takes the inside edge to short leg.',
        simulatedOutcome: {
          result: 'Inside edge onto pad pops softly to Forward Short-Leg — WICKET!',
          runsConcededOrScored: 0,
          wicketChance: '90%',
          visualAnimation: 'spin-batpad-catch'
        }
      },
      {
        id: 'opt-bowl-flat-outside-off',
        title: 'Bowl Flat and Fast 6 Inches Outside Off Stump',
        description: 'Speed up to 98kph and fire flat darts outside off to save runs.',
        fieldSetup: 'Sweeper Cover, Deep Point, Long-Off, Long-On, Mid-Wicket.',
        deliveryType: '98 kph Flat Spin Delivery',
        riskReward: 'Safe',
        scoreImpact: 50,
        isOptimal: false,
        coachVerdict: 'Defensive Failure. You are playing Test cricket with 4 wickets remaining. Bowling flat outside off allows the batsman to pad away with zero risk of dismissal.',
        simulatedOutcome: {
          result: 'Padded away harmlessly for a Dot Ball (0 Runs)',
          runsConcededOrScored: 0,
          wicketChance: '5%',
          visualAnimation: 'spin-pad-leave'
        }
      }
    ]
  }
];

// ==========================================
// TRAINING PLANNER TEMPLATES & GENERATOR
// ==========================================
export const mockTrainingPlans: TrainingPlan[] = [
  {
    id: 'plan-30-power-death',
    title: '30-Minute Rapid Net Blast (Powerplay & Death Execution)',
    targetDurationMinutes: 30,
    skillFocus: 'Batting',
    intensity: 'High',
    summary: 'High-octane session designed for quick pitch-side net access. Focuses on boundary clearing power and pin-point death over yorker response.',
    blocks: [
      {
        id: 'b1',
        durationMinutes: 5,
        phaseName: 'Dynamic Warm-up',
        activityTitle: 'Rotational Elastic Bands & Crease Footwork',
        description: 'Activate kinetic chain with 20 diagonal band chops and shadow stance pivots.',
        equipment: ['Resistance Band', 'Bat'],
        intensity: 'Low',
        icon: 'fitness_center'
      },
      {
        id: 'b2',
        durationMinutes: 10,
        phaseName: 'Biomechanics Focus',
        activityTitle: 'High-Elbow Drop Feed Drives',
        description: 'Coach/partner drops ball from shoulder height. Drive along the ground through 2 target cones.',
        equipment: ['6 Leather Balls', '2 Target Cones'],
        intensity: 'Medium',
        icon: 'straighten'
      },
      {
        id: 'b3',
        durationMinutes: 12,
        phaseName: 'Match Pressure Scenario',
        activityTitle: 'Death Overs 12-Ball Challenge',
        description: 'Target: Score 24 runs off 12 balls against full pace with 5-fielder boundary restrictions.',
        equipment: ['Full Pads & Helmet', 'Ball Tracking App'],
        intensity: 'Max',
        icon: 'sports_cricket'
      },
      {
        id: 'b4',
        durationMinutes: 3,
        phaseName: 'Cool Down & Recovery',
        activityTitle: 'Forearm Stretch & Breathing Deceleration',
        description: 'Wrist extensor holds and heart-rate normalization breathing.',
        equipment: ['None'],
        intensity: 'Low',
        icon: 'self_improvement'
      }
    ]
  },
  {
    id: 'plan-45-red-ball-seam',
    title: '45-Minute Red-Ball Discipline & Slip Cordon Protocol',
    targetDurationMinutes: 45,
    skillFocus: 'All-Rounder Match Prep',
    intensity: 'High',
    summary: 'Comprehensive multi-skill routine covering upright seam bowling channels and reaction-time slip catching drills.',
    blocks: [
      {
        id: 'b1',
        durationMinutes: 8,
        phaseName: 'Dynamic Warm-up',
        activityTitle: 'Crawl Stride & Shoulder Mobilization',
        description: 'Thoracic rotations, hamstring sweeps, and 4x20m accelerating strides.',
        equipment: ['Agility Cones'],
        intensity: 'Medium',
        icon: 'directions_run'
      },
      {
        id: 'b2',
        durationMinutes: 15,
        phaseName: 'Biomechanics Focus',
        activityTitle: 'Target Pitch Sheet (Corridor of Uncertainty)',
        description: 'Bowl 24 deliveries aiming for a 2ft x 2ft target zone on 4th stump line at 5.5m distance.',
        equipment: ['Pitch Target Sheet', 'Cricket Balls'],
        intensity: 'High',
        icon: 'gps_fixed'
      },
      {
        id: 'b3',
        durationMinutes: 15,
        phaseName: 'Net Execution',
        activityTitle: 'Slip Cordon Reflex Reactivity',
        description: 'Coach nicks ball off Katchet training board. Field 30 low diving catches at 1st and 2nd slip.',
        equipment: ['Katchet Board / Ramp', 'Catching Gloves'],
        intensity: 'High',
        icon: 'sports_handball'
      },
      {
        id: 'b4',
        durationMinutes: 7,
        phaseName: 'Cool Down & Recovery',
        activityTitle: 'Spinal Decompression & Video Review',
        description: 'Child\'s pose stretches while reviewing session pitch map telemetry.',
        equipment: ['Phone / PitchPrecision App'],
        intensity: 'Low',
        icon: 'analytics'
      }
    ]
  },
  {
    id: 'plan-60-elite-mastery',
    title: '60-Minute Complete Elite High-Performance Master Plan',
    targetDurationMinutes: 60,
    skillFocus: 'Fast Bowling',
    intensity: 'Elite',
    summary: 'Full professional academy session spanning strength activation, seam alignment, live bowling spells, and tactical situational simulations.',
    blocks: [
      {
        id: 'b1',
        durationMinutes: 10,
        phaseName: 'Dynamic Warm-up',
        activityTitle: 'Full Body Activation & Hurdle Bounds',
        description: 'Ankle stiffness hops, hurdle jumps, and rotator cuff band activations.',
        equipment: ['Mini Hurdles', 'Mobility Bands'],
        intensity: 'Medium',
        icon: 'bolt'
      },
      {
        id: 'b2',
        durationMinutes: 15,
        phaseName: 'Biomechanics Focus',
        activityTitle: 'Front-Arm Pull & Head Stillness Mechanics',
        description: '18 walk-through releases focusing on vertical seam release and head alignment over front foot.',
        equipment: ['High-speed Video Camera / Phone'],
        intensity: 'Medium',
        icon: 'videocam'
      },
      {
        id: 'b3',
        durationMinutes: 20,
        phaseName: 'Net Execution',
        activityTitle: '3-Spell Match Simulation (3 x 6-Ball Overs)',
        description: 'Spell 1: Outswing test length. Spell 2: Reverse yorker channel. Spell 3: Sharp bumper follow-up.',
        equipment: ['Speed Radar Gun', 'Full Leather Balls'],
        intensity: 'Max',
        icon: 'speed'
      },
      {
        id: 'b4',
        durationMinutes: 10,
        phaseName: 'Match Pressure Scenario',
        activityTitle: 'Scenario Simulator: Defend 8 Off 6',
        description: 'Live field setting and bowling against live partner under 1-run penalty rules.',
        equipment: ['Stumps', 'Target Cones'],
        intensity: 'High',
        icon: 'psychology'
      },
      {
        id: 'b5',
        durationMinutes: 5,
        phaseName: 'Cool Down & Recovery',
        activityTitle: 'Ice Towel & Rotator Cuff Release',
        description: 'Controlled diaphragmatic breathing and upper limb static stretches.',
        equipment: ['Foam Roller / Mat'],
        intensity: 'Low',
        icon: 'spa'
      }
    ]
  }
];

// ==========================================
// PRESET FIELD PLACEMENTS FOR CHALKBOARD
// ==========================================
export const mockFieldPresets: FieldPlacementPreset[] = [
  {
    id: 'field-t20-death',
    name: 'T20 Death Overs (Wide Yorker Field)',
    format: 'T20 / 20th Over',
    description: '5 men on off-side boundary (Deep Point, Deep Cover, Long-Off, Long-On, Deep Fine Leg) to support wide yorker bowling.',
    positions: [
      { id: 'pos-bowler', label: 'Bowler', x: 50, y: 76, role: 'Bowler' },
      { id: 'pos-keeper', label: 'Wkt Keeper', x: 50, y: 18, role: 'Keeper' },
      { id: 'pos-deep-point', label: 'Deep Point', x: 88, y: 36, role: 'Boundary' },
      { id: 'pos-deep-cover', label: 'Deep Cover', x: 86, y: 55, role: 'Boundary' },
      { id: 'pos-long-off', label: 'Long-Off', x: 68, y: 92, role: 'Boundary' },
      { id: 'pos-long-on', label: 'Long-On', x: 32, y: 92, role: 'Boundary' },
      { id: 'pos-deep-fine-leg', label: 'Deep Fine Leg', x: 14, y: 25, role: 'Boundary' },
      { id: 'pos-extra-cover', label: 'Extra Cover (Ring)', x: 74, y: 48, role: 'Ring' },
      { id: 'pos-mid-wicket', label: 'Mid-Wicket (Ring)', x: 26, y: 55, role: 'Ring' },
      { id: 'pos-point-ring', label: 'Point (Ring)', x: 76, y: 32, role: 'Ring' },
      { id: 'pos-short-third', label: 'Short Third', x: 72, y: 20, role: 'Ring' }
    ]
  },
  {
    id: 'field-test-attacking',
    name: 'Test Match Attacking (3 Slips & Gully)',
    format: 'Test Match / Red Ball',
    description: 'Ultra-aggressive slip cordon with gully and catching short mid-wicket to capitalize on the new swinging ball.',
    positions: [
      { id: 'pos-bowler', label: 'Bowler', x: 50, y: 78, role: 'Bowler' },
      { id: 'pos-keeper', label: 'Keeper', x: 50, y: 16, role: 'Keeper' },
      { id: 'pos-slip-1', label: '1st Slip', x: 58, y: 15, role: 'Slip' },
      { id: 'pos-slip-2', label: '2nd Slip', x: 64, y: 16, role: 'Slip' },
      { id: 'pos-slip-3', label: '3rd Slip', x: 70, y: 18, role: 'Slip' },
      { id: 'pos-gully', label: 'Gully', x: 78, y: 24, role: 'Close In' },
      { id: 'pos-point', label: 'Point', x: 82, y: 38, role: 'Ring' },
      { id: 'pos-cover', label: 'Cover', x: 76, y: 56, role: 'Ring' },
      { id: 'pos-mid-off', label: 'Mid-Off', x: 62, y: 72, role: 'Ring' },
      { id: 'pos-mid-on', label: 'Mid-On', x: 38, y: 72, role: 'Ring' },
      { id: 'pos-square-leg', label: 'Square Leg', x: 20, y: 38, role: 'Ring' }
    ]
  },
  {
    id: 'field-spin-batpad',
    name: 'Day 5 Spin Trap (Bat-Pad & Silly Point)',
    format: 'Test Match / Spin',
    description: 'Dense ring of close catchers surrounding the batsman to capitalize on glove and inside-edge deflections.',
    positions: [
      { id: 'pos-bowler', label: 'Spinner', x: 50, y: 74, role: 'Bowler' },
      { id: 'pos-keeper', label: 'Keeper (Standing Up)', x: 50, y: 20, role: 'Keeper' },
      { id: 'pos-slip-1', label: '1st Slip', x: 57, y: 19, role: 'Slip' },
      { id: 'pos-leg-slip', label: 'Leg Slip', x: 42, y: 19, role: 'Close In' },
      { id: 'pos-silly-point', label: 'Silly Point', x: 62, y: 28, role: 'Close In' },
      { id: 'pos-short-leg', label: 'Forward Short Leg', x: 38, y: 28, role: 'Close In' },
      { id: 'pos-cover', label: 'Cover (Ring)', x: 75, y: 48, role: 'Ring' },
      { id: 'pos-mid-wicket', label: 'Mid-Wicket (Ring)', x: 25, y: 48, role: 'Ring' },
      { id: 'pos-mid-off', label: 'Mid-Off', x: 60, y: 68, role: 'Ring' },
      { id: 'pos-mid-on', label: 'Mid-On', x: 40, y: 68, role: 'Ring' },
      { id: 'pos-deep-midwicket', label: 'Deep Mid-Wicket', x: 15, y: 65, role: 'Boundary' }
    ]
  }
];

// ==========================================
// WAGON WHEEL INITIAL SHOTS
// ==========================================
export const mockWagonWheelShots: WagonWheelShot[] = [
  { id: 'w1', angle: 42, distance: 92, runs: 4, shotType: 'Cover Drive', sector: 'Cover', ballLength: 'Full', date: 'Innings vs AUS' },
  { id: 'w2', angle: 50, distance: 98, runs: 4, shotType: 'Cover Drive', sector: 'Cover', ballLength: 'Good', date: 'Innings vs AUS' },
  { id: 'w3', angle: 12, distance: 95, runs: 4, shotType: 'Straight Drive', sector: 'Long Off', ballLength: 'Full', date: 'Innings vs AUS' },
  { id: 'w4', angle: 348, distance: 90, runs: 4, shotType: 'Straight Drive', sector: 'Long On', ballLength: 'Full', date: 'Innings vs AUS' },
  { id: 'w5', angle: 310, distance: 100, runs: 6, shotType: 'Pull Shot', sector: 'Mid Wicket', ballLength: 'Short', date: 'Innings vs AUS' },
  { id: 'w6', angle: 295, distance: 100, runs: 6, shotType: 'Pull Shot', sector: 'Mid Wicket', ballLength: 'Short', date: 'Innings vs AUS' },
  { id: 'w7', angle: 260, distance: 92, runs: 4, shotType: 'Pull Shot', sector: 'Square Leg', ballLength: 'Good', date: 'Innings vs AUS' },
  { id: 'w8', angle: 220, distance: 88, runs: 4, shotType: 'Sweep', sector: 'Fine Leg', ballLength: 'Full', date: 'Innings vs AUS' },
  { id: 'w9', angle: 80, distance: 85, runs: 4, shotType: 'Cut Shot', sector: 'Point', ballLength: 'Short', date: 'Innings vs AUS' },
  { id: 'w10', angle: 110, distance: 75, runs: 2, shotType: 'Upper Cut', sector: 'Third Man', ballLength: 'Short', date: 'Innings vs AUS' },
  { id: 'w11', angle: 45, distance: 40, runs: 1, shotType: 'Cover Drive', sector: 'Cover', ballLength: 'Good', date: 'Innings vs AUS' },
  { id: 'w12', angle: 330, distance: 45, runs: 1, shotType: 'Flick', sector: 'Mid Wicket', ballLength: 'Good', date: 'Innings vs AUS' },
  { id: 'w13', angle: 300, distance: 50, runs: 2, shotType: 'Flick', sector: 'Mid Wicket', ballLength: 'Full', date: 'Innings vs AUS' }
];

// ==========================================
// BOWLING PITCH MAP DELIVERIES
// ==========================================
export const mockPitchMapDeliveries: PitchMapDelivery[] = [
  { id: 'p1', x: 42, y: 12, length: 'Yorker', line: 'Off Stump', speedKph: 144.2, outcome: 'Dot', isWicket: false },
  { id: 'p2', x: 48, y: 8, length: 'Yorker', line: 'Middle Stump', speedKph: 145.8, outcome: 'Wicket', isWicket: true },
  { id: 'p3', x: 30, y: 48, length: 'Good Length', line: '4th Stump', speedKph: 141.0, outcome: 'Edge', seamDeviationDeg: 2.1 },
  { id: 'p4', x: 28, y: 52, length: 'Good Length', line: '4th Stump', speedKph: 142.6, outcome: 'Play & Miss', seamDeviationDeg: 2.4 },
  { id: 'p5', x: 32, y: 55, length: 'Good Length', line: 'Off Stump', speedKph: 140.5, outcome: 'Dot' },
  { id: 'p6', x: 18, y: 15, length: 'Yorker', line: 'Outside Off', speedKph: 138.2, outcome: 'Single' },
  { id: 'p7', x: 50, y: 25, length: 'Full', line: 'Middle Stump', speedKph: 139.0, outcome: 'Boundary' },
  { id: 'p8', x: 35, y: 78, length: 'Short', line: 'Off Stump', speedKph: 143.5, outcome: 'Dot' },
  { id: 'p9', x: 46, y: 84, length: 'Bouncer', line: 'Middle Stump', speedKph: 146.1, outcome: 'Play & Miss' },
  { id: 'p10', x: 33, y: 50, length: 'Good Length', line: '4th Stump', speedKph: 142.0, outcome: 'Wicket', isWicket: true }
];
