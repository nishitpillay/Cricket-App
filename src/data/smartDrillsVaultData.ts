import { DrillItem } from '../types';

export const mockSmartDrillsVault: DrillItem[] = [
  // -------------------------
  // SPIN BOWLING
  // -------------------------
  {
    id: 'drill-spin-revs-snap',
    title: 'Index-Finger Revs & Seam Revolution Drill',
    category: 'Bowling',
    subCategory: 'Spin Bowling',
    level: 'Pro',
    duration: '15 Min',
    durationMinutes: 15,
    coach: 'Coach Mark Richardson',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAocjwhFczAJ0873KBgxVtPB2QzVMDnGWqHE1UwEqdjBvwtn6H_rVdzMOWTmNFuUD5hYusLaRNX6VFIs8eQe6Vl85mj4gPL2mZPGFwEonLodOgJC_ETiZSSP5A13Pwz-pyGJ_26CWzcYD3KHWKKlbxv0dnCQZBLPSHDJ2BmudVl2rGH4wJv7oLTyqB-lGtn4cVRMRsZfflYki_RhdND-_zLYHFCVNXWdsGp6VwuY8VJBIxtBNOn86rp',
    isNew: true,
    isOfflineCached: true,
    equipment: ['Two-Tone Spinning Ball', 'Target Cone'],
    tags: ['Revs', 'Drift', 'Finger Spin', 'Off Spin'],
    description: 'Develop maximum revolutions per minute (RPM) by isolating index-finger torque at the top of the delivery arc.',
    focusAreas: [
      { title: 'Revs RPM Rate', description: 'Target 2200+ RPM seam rotation', icon: 'sync' },
      { title: 'Arm Speed', description: 'Maintain snappy whip without dropping elbow', icon: 'speed' },
      { title: 'Flight Loop', description: 'Release above eye line to initiate aerodynamic drift', icon: 'air' }
    ],
    steps: [
      { number: 1, title: 'Kneeling Finger Snap', description: 'Kneel on front knee. Toss two-tone ball vertically focusing on clockwise rip with index knuckle.' },
      { number: 2, title: '3-Step Delivery Loop', description: 'Walk through crease in slow motion, ensuring chest faces batsman at point of release.' },
      { number: 3, title: 'Target Cone Bullseye', description: 'Bowl 18 balls into a 30cm circle on good length 4th stump line.' }
    ],
    coachTip: '"Hear the seam sizzle in the air. If the seam wobbles, your index finger is sliding off the leather instead of cutting through it."'
  },
  {
    id: 'drill-spin-carrom-variation',
    title: 'The Carrom Flick & Mystery Drift',
    category: 'Bowling',
    subCategory: 'Spin Bowling',
    level: 'Elite',
    duration: '20 Min',
    durationMinutes: 20,
    coach: 'Coach Mark Richardson',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkB5N0TTbKi9jRtbbTpMmF5v7Xd_UV2tFgR8HcGjhjz1kMWaEtDdqcBHoz4skX1kJU9DNtg-jA8OOnRZfkXkSo9n0udxxT9Va20LTCGD2wIApRUizg7o8sWD_DrzxgaSMjvYxn3m9BMIsLzmTCTUpxDVG-tYffANutnuEPWrLdsplqektJOaOJcqPo_MkpoXgdsdkROHZZFCHKKvpnxyJU4Wn9wh5Aubu_TbjBD5SmVG2t_6U819TN',
    isOfflineCached: true,
    equipment: ['Leather Balls', 'Target Discs'],
    tags: ['Carrom Ball', 'Mystery Spin', 'Middle Finger Flick'],
    description: 'Master the middle-finger carrom release to turn the ball away from right-handers with zero telltale change in action.',
    focusAreas: [
      { title: 'Finger Cocking', description: 'Middle finger bent behind seam', icon: 'touch_app' },
      { title: 'Disguised Action', description: 'Same high-arm trajectory as traditional off-break', icon: 'visibility_off' }
    ],
    steps: [
      { number: 1, title: 'Carrom Grip Setup', description: 'Hold ball between thumb and index; cock middle finger firmly under the seam.' },
      { number: 2, title: 'Flick Release', description: 'Snap middle finger forward forcefully at ear height like carrom striker.' },
      { number: 3, title: 'Leg-Stump Line Targeting', description: 'Pitch on middle/leg and allow the carrom ball to straighten past off-stump.' }
    ],
    coachTip: '"Do not change your run-up cadence. The batsman reads arm speed; keep it 100% identical to your stock off-break."'
  },

  // -------------------------
  // SLIP FIELDING
  // -------------------------
  {
    id: 'drill-slip-reflex-ramp',
    title: 'Katchet Ramp Low Slip Reflex Catcher',
    category: 'Fielding',
    subCategory: 'Slip Fielding',
    level: 'Pro',
    duration: '12 Min',
    durationMinutes: 12,
    coach: 'Coach Carter',
    coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF2zkt7HiJBkOubcIhEyE9evYb6SNXruUycT4ZXOlv_ujVyqjEIkunsEspRZeXwBK7coke_mYqjAbs4v-d3uM8P2W8EfX9vOA3PYzI2LesZ1rAQ03FgiIDFwkU4VMffqRBWOBeCMbVzdOH00wHbare88_nrKVDisHI5lYs9hULdCzv7VkuNZJC01ueMNRFBmNVj_CspRxg1kKBMHmQYe-VzK_hIatzqi4B79kYWMlJvTxiqxhmRfsZ',
    isDrillOfDay: true,
    isOfflineCached: true,
    equipment: ['Katchet Deflection Ramp', 'Reaction Balls', 'Catching Mitts'],
    tags: ['Slip Cordon', 'Soft Hands', 'Reaction Speed', 'Deflection'],
    description: 'Sharpen split-second reactions for edges flying at shin-to-chest height with variable bounce and speed.',
    focusAreas: [
      { title: 'Soft Cupped Hands', description: 'Absorb ball momentum into waist', icon: 'sports_handball' },
      { title: 'Low Stance Base', description: 'Weight on balls of feet, head still', icon: 'accessibility' },
      { title: 'Eye Tracking', description: 'Track ball directly into the webbing of palms', icon: 'visibility' }
    ],
    steps: [
      { number: 1, title: 'Set Ready Stance', description: 'Knees flexed at 110°, fingers pointing downward below knee height.' },
      { number: 2, title: 'Randomized Deflection', description: 'Partner throws 30 balls at varying speeds into the Katchet ramp.' },
      { number: 3, title: 'One-Handed Diving Reach', description: 'Take 10 diving catches on both dominant and non-dominant sides onto crash mats.' }
    ],
    coachTip: '"Let the ball come to you. Reach out with rigid fingers and it will bounce out every time. Soft elbows absorb fast edges."'
  },
  {
    id: 'drill-slip-first-step-burst',
    title: 'First-Step Lateral Cordon Explosion',
    category: 'Fielding',
    subCategory: 'Slip Fielding',
    level: 'Int/Pro',
    duration: '10 Min',
    durationMinutes: 10,
    coach: 'Coach Samantha Ray',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUhRX49VlsH8nMtvYrYR6jIqwrPVjIbe72z4ZzXbtfKRuvmO_mNIQOLg2nRiHHvYrSsnldqFsRhzwlEHkcFSbsEBm0RfAF3SoWKD8s6IBueHFTV9utstjjnuEPxIPN6wBelpLs5QDqUGW8j4vISoo62nNrAjWG_ELjTGOGPvS89yAeHzBQ5c3I4NCoVyGjhh9BNLb07UmTfhB_g3zyk_DgVwHdryYBVF6No2EmBvstoK1GZSoFnXr5',
    isOfflineCached: true,
    equipment: ['Agility Ladders', 'Tennis Balls'],
    tags: ['Lateral Quickness', 'First Step', 'Gully'],
    description: 'Eliminate false steps when an outside edge flies wide between 1st slip and keeper or 2nd slip and gully.',
    focusAreas: [
      { title: 'Crossover Step', description: 'Direct lateral drive without hopping', icon: 'directions_run' },
      { title: 'Core Deceleration', description: 'Ground contact landing control', icon: 'shield' }
    ],
    steps: [
      { number: 1, title: 'Agility Ladder Lateral Bound', description: 'Perform 4 sets of double-tap lateral bounds into ready position.' },
      { number: 2, title: 'Auditory Reactivity', description: 'On whistle call (Left/Right), explode 2 meters to grab deflected ball.' }
    ],
    coachTip: '"Never jump upward when the bowler delivers. Stay low and glide across the turf."'
  },

  // -------------------------
  // POWER HITTING
  // -------------------------
  {
    id: 'drill-power-kinetic-base',
    title: 'Stable Base & Rotational Range Hitting',
    category: 'Batting',
    subCategory: 'Power Hitting',
    level: 'Pro',
    duration: '18 Min',
    durationMinutes: 18,
    coach: 'Coach Carter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJVDX-zodRM4YwMd0rpZ4hVC-Z3vygxizWjg9wiOmuFXPBenmoBqWNCwzezGwDO9z5T5jQd__bxuB-F_dy5sPulq1a_z_7IovpKFzkXnbBCKeNbtl94aNzJxvk6_vzmqN1LSQk81o38WPgKyxLZTLWwmNjHbJCfaxYPQmSCe5ed9eYkAU67UH0z7AbabPm38qtFNEI_VhIBk2s3e1S_rGT7-WN9bp2Tuw8T2MAyB4WoT5Rr4DP8dGl',
    isOfflineCached: true,
    equipment: ['Batting Tee', 'Heavy Balls', 'Full Bat'],
    tags: ['Power Hitting', 'Boundary Clearance', 'Torque', 'Bat Speed'],
    description: 'Generate effortless 85-meter maximums by utilizing hip-shoulder separation and an unshakeable grounded base.',
    focusAreas: [
      { title: 'Wide Grounded Base', description: 'Feet planted wider than shoulder width', icon: 'accessibility' },
      { title: 'Full Extension', description: 'Arms extended through the line of the ball', icon: 'straighten' },
      { title: 'Back-Foot Pivot', description: 'Rear heel lifts while toe screws into turf', icon: 'cached' }
    ],
    steps: [
      { number: 1, title: 'Tee Setup at Slot Height', description: 'Place ball on tee at knee height 1 foot in front of front foot.' },
      { number: 2, title: 'Hip Clear Drill', description: 'Swing from hip torque without lunging forward; clear ball over long-on cone.' },
      { number: 3, title: 'Underhand Full Tosses', description: 'Hit 20 consecutive full tosses attempting to clear 70-meter boundary marker.' }
    ],
    coachTip: '"Power does not come from swinging harder with your arms. Power comes from planting your feet and rotating your hips with violent speed."'
  },
  {
    id: 'drill-power-bottom-hand-punch',
    title: 'Bottom-Hand Forearm Snap (Cow Corner Arc)',
    category: 'Batting',
    subCategory: 'Power Hitting',
    level: 'Elite',
    duration: '15 Min',
    durationMinutes: 15,
    coach: 'Coach Carter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfXyhMV5uHOA_fblbsF46zKg8Rg6Ir1qRco2kfsFtmgltnSPNRpd_dHpL1KRY7kFbHO6kG1ya0Ux9Eald0k3TCl7fevPytRtQ9-iglJchxhL0XdAdRXyqnHwWK2kpaisSgxyqoQLkPa-pEvlu0ihLHh1XuF_XaP8SbtBwVSxHZnb7sEZ4a4vu0VV7vNgPT5MyL7XEFxOOKkqlPRFhTiWOTzcmJdDEtwcw5V2RYNe9BS1qJCrPz2s_a',
    isOfflineCached: true,
    equipment: ['Heavy Bat', 'Leather Balls'],
    tags: ['Bottom Hand', 'Death Overs', 'Slog Sweep'],
    description: 'Learn the modern T20 bottom-hand wrist snap to access mid-wicket from balls bowled outside off stump.',
    focusAreas: [
      { title: 'V-Grip Leverage', description: 'Bottom hand V pointing down back ridge', icon: 'pan_tool' },
      { title: 'Follow-Through Lift', description: 'High arc finish over front shoulder', icon: 'north_east' }
    ],
    steps: [
      { number: 1, title: 'One-Handed Bat Swings', description: '15 swings using bottom hand alone with heavy bat.' },
      { number: 2, title: 'Wide Ball Drag', description: 'Hit full balls outside off-stump into deep mid-wicket.' }
    ],
    coachTip: '"Keep your head stationary. As soon as your head swivels to watch the shot before contact, you slice the ball."'
  },

  // -------------------------
  // FAST BOWLING
  // -------------------------
  {
    id: 'drill-pace-yorker-target-shoes',
    title: 'Shoe-Box Yorker Precision Challenge',
    category: 'Bowling',
    subCategory: 'Fast Bowling',
    level: 'Pro',
    duration: '20 Min',
    durationMinutes: 20,
    coach: 'Coach Mark Richardson',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAocjwhFczAJ0873KBgxVtPB2QzVMDnGWqHE1UwEqdjBvwtn6H_rVdzMOWTmNFuUD5hYusLaRNX6VFIs8eQe6Vl85mj4gPL2mZPGFwEonLodOgJC_ETiZSSP5A13Pwz-pyGJ_26CWzcYD3KHWKKlbxv0dnCQZBLPSHDJ2BmudVl2rGH4wJv7oLTyqB-lGtn4cVRMRsZfflYki_RhdND-_zLYHFCVNXWdsGp6VwuY8VJBIxtBNOn86rp',
    isOfflineCached: true,
    equipment: ['Shoe Box / Cones', '6 Leather Balls', 'Crease Markers'],
    tags: ['Yorker', 'Death Bowling', 'Pace', 'Precision'],
    description: 'Lock in millimeter execution on the popping crease to eliminate full tosses and half-volleys at the death.',
    focusAreas: [
      { title: 'Front Knee Lock', description: 'Solid braced front leg at release', icon: 'lock' },
      { title: 'Eye Focal Point', description: 'Stare at the bottom 2 inches of off stump', icon: 'center_focus_strong' },
      { title: 'Wrist Snap Through Crease', description: 'Flick fingers directly into the base target', icon: 'touch_app' }
    ],
    steps: [
      { number: 1, title: 'Target Placement', description: 'Place a shoe box directly on the popping crease in line with base of off stump.' },
      { number: 2, title: '4-Step Rhythm Approach', description: 'Deliver 12 balls from a shortened 4-step run-up aiming for direct hit.' },
      { number: 3, title: 'Full Run-up Under Pressure', description: 'Bowl 12 balls at 100% match intensity. Score 10 points for direct hit, 5 for inside 6 inches.' }
    ],
    coachTip: '"Do not look at the batsman. Lock your eyes on the base of off-stump from the 3rd step of your run-up until release."'
  },

  // -------------------------
  // WICKETKEEPING
  // -------------------------
  {
    id: 'drill-keeping-spin-standing-up',
    title: 'Standing Up to Spin: Glove Presentation & Quick Stumping',
    category: 'Fielding',
    subCategory: 'Wicketkeeping',
    level: 'Pro',
    duration: '15 Min',
    durationMinutes: 15,
    coach: 'Coach Samantha Ray',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkB5N0TTbKi9jRtbbTpMmF5v7Xd_UV2tFgR8HcGjhjz1kMWaEtDdqcBHoz4skX1kJU9DNtg-jA8OOnRZfkXkSo9n0udxxT9Va20LTCGD2wIApRUizg7o8sWD_DrzxgaSMjvYxn3m9BMIsLzmTCTUpxDVG-tYffANutnuEPWrLdsplqektJOaOJcqPo_MkpoXgdsdkROHZZFCHKKvpnxyJU4Wn9wh5Aubu_TbjBD5SmVG2t_6U819TN',
    isOfflineCached: true,
    equipment: ['Wicketkeeping Gloves & Inners', 'Stumps', 'Tennis Balls'],
    tags: ['Wicketkeeping', 'Stumping', 'Spin', 'Glovework'],
    description: 'Zero delay between ball collection and whipping off the bails while batsman over-balances.',
    focusAreas: [
      { title: 'Head Alignment with Off-Stump', description: 'Sight the ball through the batsman\'s hips', icon: 'visibility' },
      { title: 'Hands Giving Back to Stumps', description: 'Catch with soft hands and redirect backwards in one fluid motion', icon: 'pan_tool' }
    ],
    steps: [
      { number: 1, title: 'Blind Feed Collection', description: 'Coach feeds ball past a dummy batter board; collect and break stumps in < 0.4 seconds.' },
      { number: 2, title: 'Leg-Side Wide Collection', description: 'Dive laterally down leg side while keeping gloves low to the ground.' }
    ],
    coachTip: '"Stay down with the bounce of the ball. Rising too early leads to fumbles when the ball stays low."'
  },

  // -------------------------
  // GROUND FIELDING
  // -------------------------
  {
    id: 'drill-fielding-sliding-pickup',
    title: 'Boundary Slide & Pick-Up Relay',
    category: 'Fielding',
    subCategory: 'Ground Fielding',
    level: 'Int/Pro',
    duration: '12 Min',
    durationMinutes: 12,
    coach: 'Coach Samantha Ray',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUhRX49VlsH8nMtvYrYR6jIqwrPVjIbe72z4ZzXbtfKRuvmO_mNIQOLg2nRiHHvYrSsnldqFsRhzwlEHkcFSbsEBm0RfAF3SoWKD8s6IBueHFTV9utstjjnuEPxIPN6wBelpLs5QDqUGW8j4vISoo62nNrAjWG_ELjTGOGPvS89yAeHzBQ5c3I4NCoVyGjhh9BNLb07UmTfhB_g3zyk_DgVwHdryYBVF6No2EmBvstoK1GZSoFnXr5',
    isOfflineCached: true,
    equipment: ['Boundary Cones', 'Cricket Balls'],
    tags: ['Ground Fielding', 'Sliding', 'Relay Throw', 'Direct Hit'],
    description: 'Safe turf slide technique to stop boundaries and transition into an instantaneous rocket return.',
    focusAreas: [
      { title: 'Side-Thigh Slide', description: 'Tuck bottom leg to avoid spike snagging in turf', icon: 'sports_gymnastics' },
      { title: 'Transfer to Throwing Arm', description: 'Scoop ball into dominant hand during slide deceleration', icon: 'send' }
    ],
    steps: [
      { number: 1, title: 'Dry Sliding Technique', description: 'Practice 6 sliding entries on wet turf or grass with knees bent.' },
      { number: 2, title: 'Sprint, Slide, and Return', description: 'Chase bouncing ball 25 meters, slide inside rope, and hit keeper target.' }
    ],
    coachTip: '"Never slide with your knee pointing down. Always slide on the outside fleshy part of your thigh to prevent ACL injuries."'
  }
];
