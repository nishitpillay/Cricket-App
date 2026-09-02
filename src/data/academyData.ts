export interface RuleBreakdown {
  id: string;
  title: string;
  shortDescription: string;
  category: 'Dismissals' | 'Match Formats' | 'Match Calculations' | 'Field Restrictions';
  keyTakeaway: string;
  lawsNumber: string;
  sections: {
    title: string;
    description: string;
    diagramType?: 'pitch-map' | 'radar-field' | 'dls-calculator' | 'infographic';
    points: string[];
  }[];
}

export interface JargonTerm {
  id: string;
  term: string;
  pronunciation?: string;
  category: 'Fielding' | 'Bowling' | 'Batting' | 'Slang & Tactics';
  definition: string;
  originOrContext: string;
  exampleSentence: string;
  tag: string;
  coordinates?: { x: number; y: number }; // For field positions (0-100% of oval)
  ballFlight?: 'spin-in' | 'spin-out' | 'yorker-base' | 'bouncer-head' | 'seam-wobble';
}

export interface BasicDrillGuide {
  id: string;
  title: string;
  focus: string;
  difficulty: 'Beginner' | 'Foundational' | 'Intermediate';
  duration: string;
  targetArea: 'Head Position' | 'Elbow & Bat Flow' | 'Seam Release' | 'Balance & Base' | 'Grip & Stance';
  overview: string;
  keyCheckpoints: string[];
  commonFaults: {
    fault: string;
    fix: string;
  }[];
  coachCue: string;
  videoPoster: string;
  stepByStep: {
    stepNumber: number;
    title: string;
    instructions: string;
    visualCue: string;
  }[];
  drillIdToPractice?: string;
}

export interface GearGuideSection {
  id: string;
  category: 'Bat Sizing & Willow' | 'Pads & Protection' | 'Helmet Safety (BS 7928)' | 'Gloves & Spikes';
  title: string;
  summary: string;
  checklist: string[];
  specsTable?: {
    header: string[];
    rows: string[][];
  };
  proTip: string;
  safetyAlert?: string;
}

export const mockRules: RuleBreakdown[] = [
  {
    id: 'rule-lbw',
    title: 'Leg Before Wicket (LBW) Demystified',
    shortDescription: 'The 3 critical conditions required for a batter to be given out LBW under Law 36.',
    category: 'Dismissals',
    keyTakeaway: 'Pitching, Impact, and Wicket trajectory must all satisfy Law 36 before an umpire raises their finger.',
    lawsNumber: 'MCC Law 36',
    sections: [
      {
        title: '1. The Pitching Zone',
        description: 'Where did the ball land on the pitch?',
        diagramType: 'pitch-map',
        points: [
          'In-Line with Wickets: Valid for LBW.',
          'Outside Off-Stump: Valid for LBW.',
          'Outside Leg-Stump: AUTOMATIC NOT OUT. A ball pitching outside leg can NEVER be LBW.'
        ]
      },
      {
        title: '2. The Impact Point',
        description: 'Where did the ball strike the batter’s pad/body?',
        diagramType: 'pitch-map',
        points: [
          'In-Line with Wickets: Valid for LBW whether a shot is offered or not.',
          'Outside Off-Stump with No Shot: OUT if hitting the stumps.',
          'Outside Off-Stump with Shot Played: NOT OUT (batter has offered a genuine stroke).'
        ]
      },
      {
        title: '3. Wickets Trajectory (Hitting)',
        description: 'Would the ball have gone on to hit the stumps?',
        diagramType: 'pitch-map',
        points: [
          'Hawk-Eye / Ball Tracking predicts if >50% of the ball hits the stumps/bails.',
          'Umpire’s Call applies if trimming edge of stump (<50% ball overlap).'
        ]
      }
    ]
  },
  {
    id: 'rule-powerplays',
    title: 'Powerplays & Fielding Circles Explained',
    shortDescription: 'How field restriction zones change between T20 and ODI cricket formats.',
    category: 'Field Restrictions',
    keyTakeaway: 'The 30-yard inner circle dictates how many fielders can be stationed at the boundary rope.',
    lawsNumber: 'ICC Playing Conditions 28.1',
    sections: [
      {
        title: 'T20 Powerplay (Overs 1 to 6)',
        description: 'Maximum of 2 fielders outside the 30-yard circle. From Over 7 onwards, maximum 5 fielders outside.',
        diagramType: 'radar-field',
        points: [
          'Overs 1-6: Only 2 fielders outside the 30-yard circle (batters target boundaries).',
          'Overs 7-20: Maximum 5 fielders outside the 30-yard circle.',
          'Must have at least 4 fielders inside the ring at all times.'
        ]
      },
      {
        title: 'ODI 50-Over Powerplay Structure',
        description: 'Split into three distinct phases: Mandatory, Middle, and Death overs.',
        diagramType: 'radar-field',
        points: [
          'P1 (Overs 1-10): Mandatory Powerplay — max 2 fielders outside the circle.',
          'P2 (Overs 11-40): Middle Phase — max 4 fielders outside the circle.',
          'P3 (Overs 41-50): Death Overs — max 5 fielders outside the circle.'
        ]
      }
    ]
  },
  {
    id: 'rule-dls',
    title: 'Duckworth-Lewis-Stern (DLS) Method',
    shortDescription: 'How target scores and resource percentages are mathematically adjusted during rain delays.',
    category: 'Match Calculations',
    keyTakeaway: 'Teams possess two resources: Overs Remaining and Wickets in Hand. DLS calculates resource balance.',
    lawsNumber: 'ICC DLS Appendix',
    sections: [
      {
        title: 'The Resource Matrix Concept',
        description: 'A team starting 50 overs with 10 wickets possesses 100% resources. If rain cuts the match to 20 overs, remaining resource tables recalculate the target.',
        diagramType: 'dls-calculator',
        points: [
          'Resource = f(Overs Left, Wickets Lost).',
          'Losing wickets early dramatically decreases your remaining resource percentage.',
          'Par Score is the target a chasing team must exceed if match ends abruptly.'
        ]
      }
    ]
  },
  {
    id: 'rule-short-ball',
    title: 'Bouncers, Beamers & Free Hit Rules',
    shortDescription: 'Safety limits on ball heights, waist-high no balls, and penalty deliveries.',
    category: 'Dismissals',
    keyTakeaway: 'Dangerous short-pitched deliveries have strict limits per over in all recognized formats.',
    lawsNumber: 'MCC Law 41 & 21',
    sections: [
      {
        title: 'Bouncer Limits per Over',
        description: 'A ball passing above shoulder height when standing upright is deemed a bouncer.',
        points: [
          'T20 Internationals: Max 1 bouncer per over above shoulder (2nd is called No Ball).',
          'ODIs: Max 2 bouncers per over above shoulder height.',
          'Over Head Height: Immediate Wide Ball call.'
        ]
      },
      {
        title: 'Beamer & Free Hit Consequences',
        description: 'Any delivery passing the batter on the full above waist height is an automatic No Ball and Free Hit.',
        points: [
          'Batter cannot be dismissed bowled, caught, LBW, or stumped on a Free Hit.',
          'Field settings cannot be changed during a Free Hit unless the batters crossed.'
        ]
      }
    ]
  }
];

export const mockJargon: JargonTerm[] = [
  {
    id: 'jargon-silly-mid-on',
    term: 'Silly Mid-On',
    pronunciation: '/ˈsɪli mɪd ɒn/',
    category: 'Fielding',
    definition: 'A close-in fielding position located on the leg side, roughly 2-3 meters from the batter’s bat.',
    originOrContext: 'Named "silly" because standing that close to a hard-struck cricket ball was historically considered suicidal.',
    exampleSentence: 'The captain brought in a silly mid-on and silly point to create intense pressure against the off-spinner.',
    tag: 'Close Cordon',
    coordinates: { x: 44, y: 47 }
  },
  {
    id: 'jargon-doosra',
    term: 'Doosra',
    pronunciation: '/ˈduːsrɑː/',
    category: 'Bowling',
    definition: 'A mystery delivery bowled by an off-spinner that spins from leg to off (the opposite direction of a standard off-break) without a change in action.',
    originOrContext: 'Urdu for "the second one" or "the other one," popularized by Saqlain Mushtaq and Muttiah Muralitharan.',
    exampleSentence: 'He disguised the doosra with high wrist rotation, taking the outside edge to first slip.',
    tag: 'Mystery Spin',
    ballFlight: 'spin-out'
  },
  {
    id: 'jargon-yorker',
    term: 'Yorker',
    pronunciation: '/ˈjɔːrkər/',
    category: 'Bowling',
    definition: 'A delivery pitched right at the batter’s toes or popping crease, making it nearly impossible to hit with backlift.',
    originOrContext: 'Originated in Yorkshire, England during the 19th century, renowned as the ultimate death-overs weapon.',
    exampleSentence: 'Bumrah executed a pinpoint 145 km/h toe-crushing yorker to clean bowl the middle stump.',
    tag: 'Pace Weapon',
    ballFlight: 'yorker-base'
  },
  {
    id: 'jargon-googly',
    term: 'Googly (Wrong’un)',
    pronunciation: '/ˈɡuːɡli/',
    category: 'Bowling',
    definition: 'A delivery bowled by a right-arm wrist spinner (leg-spinner) that turns back into the right-handed batter instead of away.',
    originOrContext: 'Invented by Bernard Bosanquet in the 1900s; bowled out of the back of the hand with the back of the wrist facing mid-wicket.',
    exampleSentence: 'The batter didn’t pick the googly out of the hand and was trapped dead in front for LBW.',
    tag: 'Leg Spin',
    ballFlight: 'spin-in'
  },
  {
    id: 'jargon-cow-corner',
    term: 'Cow Corner',
    pronunciation: '/kaʊ ˈkɔːrnər/',
    category: 'Fielding',
    definition: 'The deep fielding region situated between deep mid-wicket and long-on.',
    originOrContext: 'Originated from English village grounds where a cow pasture was often located in that direction, where rustic batters loved to slog unrefined cross-bat shots.',
    exampleSentence: 'With 12 needed off 3 balls, the batter launched a massive six directly over cow corner.',
    tag: 'Boundary',
    coordinates: { x: 22, y: 68 }
  },
  {
    id: 'jargon-chinaman',
    term: 'Chinaman (Left-Arm Wrist Spin)',
    pronunciation: '/ˈtʃaɪnəmən/',
    category: 'Bowling',
    definition: 'A left-arm unorthodox wrist spinner who spins the ball from off to leg for a right-handed batter (e.g. Kuldeep Yadav).',
    originOrContext: 'Historical cricket term coined after Ellis Achong in 1933; modern commentary often uses "Left-Arm Wrist Spinner".',
    exampleSentence: 'The left-arm wrist spinner deceived the batter with sharp drift and turn through the gate.',
    tag: 'Wrist Spin',
    ballFlight: 'spin-in'
  },
  {
    id: 'jargon-corridor-uncertainty',
    term: 'Corridor of Uncertainty',
    pronunciation: '/ˈkɒrɪdɔːr əv ʌnˈsɜːtənti/',
    category: 'Bowling',
    definition: 'The narrow channel just outside off-stump where the batter is unsure whether to play forward, defend, or leave the ball.',
    originOrContext: 'Coined by legendary batsman Geoffrey Boycott to describe Glenn McGrath’s lethal precision line.',
    exampleSentence: 'He bowled 6 consecutive deliveries in the corridor of uncertainty until finding the outside edge.',
    tag: 'Tactical Line',
    ballFlight: 'seam-wobble'
  },
  {
    id: 'jargon-gully',
    term: 'Gully',
    pronunciation: '/ˈɡʌli/',
    category: 'Fielding',
    definition: 'A close catching position behind the wicket on the off-side, squarer than the slip cordon, designed to catch thick edges and deflected cuts.',
    originOrContext: 'Old English for a narrow ravine; positioned where angled slices and squirted edges fly.',
    exampleSentence: 'A diving one-handed catch at backward gully broke the opening partnership.',
    tag: 'Catching Ring',
    coordinates: { x: 68, y: 25 }
  },
  {
    id: 'jargon-carrom-ball',
    term: 'Carrom Ball',
    pronunciation: '/ˈkærəm bɔːl/',
    category: 'Bowling',
    definition: 'A delivery flicked with the middle finger like a carrom striker piece, capable of spinning both ways without elbow bend.',
    originOrContext: 'Re-popularized by Ajantha Mendis and Ravichandran Ashwin in subcontinent conditions.',
    exampleSentence: 'Ashwin gripped the ball between his thumb and index finger, flicking the carrom ball past the outside edge.',
    tag: 'Finger Spin',
    ballFlight: 'spin-out'
  },
  {
    id: 'jargon-knuckleball',
    term: 'Knuckle Ball',
    pronunciation: '/ˈnʌkəl bɔːl/',
    category: 'Bowling',
    definition: 'A deception delivery held on the knuckles rather than fingertips, drastically dropping pace without reducing arm speed.',
    originOrContext: 'Adapted from baseball pitching into cricket death bowling by Zaheer Khan and Bhuvneshwar Kumar.',
    exampleSentence: 'The knuckle ball dipped late, leaving the batter way through their shot early.',
    tag: 'Pace Deception',
    ballFlight: 'seam-wobble'
  },
  {
    id: 'jargon-sweeper-cover',
    term: 'Sweeper Cover (Deep Cover)',
    pronunciation: '/ˈswiːpər ˈkʌvər/',
    category: 'Fielding',
    definition: 'A boundary rider stationed on the off-side boundary between point and cover to stop boundaries and turn fours into singles.',
    originOrContext: 'Sweeps across the deep outfield during limited overs powerplay endings.',
    exampleSentence: 'The captain pushed point back to sweeper cover to protect against the lofted drive.',
    tag: 'Boundary Defense',
    coordinates: { x: 82, y: 48 }
  },
  {
    id: 'jargon-mankad',
    term: 'Non-Striker Run Out (Mankad)',
    pronunciation: '/mænˈkæd/',
    category: 'Slang & Tactics',
    definition: 'Running out the non-striking batter if they leave their crease before the bowler’s arm reaches release point.',
    originOrContext: 'Named after Indian legend Vinoo Mankad in 1947; officially categorized under ICC Law 38.3 (Run Out).',
    exampleSentence: 'The bowler noticed the non-striker stealing two meters and whipped off the bails.',
    tag: 'Laws & Dismissals'
  }
];

export const mockBasicDrills: BasicDrillGuide[] = [
  {
    id: 'basic-still-head',
    title: 'Still Head & Eye-Line Stance Balance',
    focus: 'Eliminating head tilt and lateral swaying during the downswing.',
    difficulty: 'Beginner',
    duration: '10 Mins',
    targetArea: 'Head Position',
    overview: 'The human head weighs approximately 5kg. If your head tilts even 3 degrees off-axis during your trigger movement, your visual depth perception of the incoming ball drops by up to 30%.',
    keyCheckpoints: [
      'Eyes remain strictly parallel to the horizon at bowler release.',
      'Lead ear drops toward lead shoulder smoothly without jerking.',
      'Head stays directly positioned over the front knee on impact.',
      'Zero head recoil backwards until the follow-through completes.'
    ],
    commonFaults: [
      {
        fault: 'Looking up too early to see where the shot went (peeking).',
        fix: 'Lock your eyes on the turf where the ball bounced for a full 1 second after contact.'
      },
      {
        fault: 'Head tilting toward off-side during backlift.',
        fix: 'Practice shadow batting in front of a mirror or using PitchPrecision AI skeleton alignment.'
      }
    ],
    coachCue: '“Take your nose to the ball and keep your chin pinned to your lead shoulder.”',
    videoPoster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Neutral Stance Check',
        instructions: 'Feet shoulder-width apart, weight balanced 50/50 on balls of feet with eyes level toward non-striker umpire.',
        visualCue: 'Check vertical laser line from nose down to middle stump crease.'
      },
      {
        stepNumber: 2,
        title: 'Controlled Trigger Press',
        instructions: 'Initiate back-and-across movement without letting your head bob up or down.',
        visualCue: 'Top of helmet should not rise or dip more than 2 centimeters.'
      },
      {
        stepNumber: 3,
        title: 'Forward Stride Alignment',
        instructions: 'Transfer lead knee forward toward the line of the ball, leading with the forehead.',
        visualCue: 'Head reaches front-foot crease before bat begins downswing.'
      },
      {
        stepNumber: 4,
        title: 'Impact Lock & Hold',
        instructions: 'Make contact directly under the eyes and hold the silhouette pose for 3 seconds.',
        visualCue: 'Both eyes locked onto the bat face sweet spot.'
      }
    ],
    drillIdToPractice: 'drill-cover-drive'
  },
  {
    id: 'basic-high-elbow',
    title: 'High Elbow & Straight Bat Flow (The V)',
    focus: 'Guiding the bat straight through the line of off-stump with soft hands.',
    difficulty: 'Foundational',
    duration: '12 Mins',
    targetArea: 'Elbow & Bat Flow',
    overview: 'A dominant top hand and high front elbow ensure the bat blade travels straight down the ground, eliminating cross-bat edges in the corridor of uncertainty.',
    keyCheckpoints: [
      'Top hand (left hand for right-handers) grips firmly; bottom hand acts merely as a guide.',
      'Lead elbow points straight at mid-off/cover during the forward stride.',
      'Full face of the bat presented to the incoming delivery.',
      'Bat finishes high over the shoulder with open chest.'
    ],
    commonFaults: [
      {
        fault: 'Bottom hand overpowering and closing the bat face into mid-wicket.',
        fix: 'Hold the bat using only two fingers (thumb & index) with the bottom hand for 15 drop-ball reps.'
      },
      {
        fault: 'Chicken-winging lead elbow tucked into ribcage.',
        fix: 'Push lead elbow toward bowler before opening wrists.'
      }
    ],
    coachCue: '“Lead with the elbow like a flashlight beam pointing at the ball.”',
    videoPoster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Grip Top-Hand Dominance',
        instructions: 'Ensure the "V" between your thumb and index finger points down the spine of the bat.',
        visualCue: 'Relax bottom hand grip pressure by 40%.'
      },
      {
        stepNumber: 2,
        title: 'Backlift Cocking',
        instructions: 'Lift the bat toward second slip with lead wrist unbent and elbow flexing upward.',
        visualCue: 'Toe of bat points directly toward the wicketkeeper.'
      },
      {
        stepNumber: 3,
        title: 'Downswing Path',
        instructions: 'Drive the front elbow forward, swinging the bat smoothly inside "the V" through mid-off.',
        visualCue: 'Bat blade stays perpendicular to the pitch surface.'
      },
      {
        stepNumber: 4,
        title: 'High Extension Finish',
        instructions: 'Follow through with the front elbow reaching ear height without collapsing.',
        visualCue: 'Bat sticker clearly visible to bowler after contact.'
      }
    ],
    drillIdToPractice: 'drill-spin-footwork'
  },
  {
    id: 'basic-seam-presentation',
    title: 'Upright Seam & Wrist Lock Bowling Mechanics',
    focus: 'Maintaining a 12 o’clock seam orientation for late swing and bounce.',
    difficulty: 'Intermediate',
    duration: '15 Mins',
    targetArea: 'Seam Release',
    overview: 'The seam of a cricket ball is its aerodynamic rudder. Keeping the wrist locked behind the ball at release creates gyroscopic stability, maximizing outswing or inswing drift.',
    keyCheckpoints: [
      'Index and middle finger placed 1cm apart along the seam.',
      'Thumb rests directly underneath on the seam for balance.',
      'Wrist cocked backward and locked firmly at delivery stride.',
      'Full finger snap straight down the seam at point of release.'
    ],
    commonFaults: [
      {
        fault: 'Floppy wrist causing ball to wobble horizontally (scramble seam).',
        fix: 'Practice throwing ball up in the air into your own hands while lying on your back.'
      },
      {
        fault: 'Releasing too early, causing full tosses or loss of revs.',
        fix: 'Feel the ball roll off the tips of your two main fingers at the highest arc point.'
      }
    ],
    coachCue: '“Lock the wrist like a door bolt and snap straight through the target.”',
    videoPoster: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Finger Placement & Seam Alignment',
        instructions: 'Grip with fingers resting on the leather without squeezing too tightly.',
        visualCue: 'Leave a small gap between the ball and your palm (air pocket).'
      },
      {
        stepNumber: 2,
        title: 'Gather & Coil',
        instructions: 'Bring the bowling arm close to your chin at back-foot impact.',
        visualCue: 'Front arm pulls down as a guide lever.'
      },
      {
        stepNumber: 3,
        title: 'High Arm Release',
        instructions: 'Release the ball at the 11:30 or 12 o’clock position above your ear.',
        visualCue: 'Wrist snaps vertically down toward batter’s off-stump.'
      },
      {
        stepNumber: 4,
        title: 'Follow-Through Sweep',
        instructions: 'Allow the bowling hand to finish across the opposite hip naturally.',
        visualCue: 'Back leg drives smoothly through the crease.'
      }
    ]
  },
  {
    id: 'basic-weight-transfer',
    title: 'Weight Transfer & Swivel on the Pull Shot',
    focus: 'Getting on the back foot quickly and rolling wrists over high deliveries.',
    difficulty: 'Intermediate',
    duration: '12 Mins',
    targetArea: 'Balance & Base',
    overview: 'Playing the short ball safely requires immediate recognition of length, planting the back foot deep in the crease, and swiveling through 90 degrees to keep the ball on the ground.',
    keyCheckpoints: [
      'Back foot moves back and across toward off-stump before the ball bounces.',
      'Weight transferred 80% onto the back foot with knees flexed.',
      'Bat swings horizontally on a high plane from second slip to mid-wicket.',
      'Wrists roll over the ball at contact to prevent aerial top edges.'
    ],
    commonFaults: [
      {
        fault: 'Backing away toward leg stump, leaving stumps exposed and losing leverage.',
        fix: 'Move back and across so head stays in line with the ball.'
      },
      {
        fault: 'Hitting with an open bat face, sending easy catches to fine leg.',
        fix: 'Turn the bat toe downwards right as the ball hits the sweet spot.'
      }
    ],
    coachCue: '“Get back, get tall, roll the wrists, and hit the grass.”',
    videoPoster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Length Recognition',
        instructions: 'Spot short length out of the hand and trigger back foot back and across.',
        visualCue: 'Eyes stay level, avoiding ducking backward.'
      },
      {
        stepNumber: 2,
        title: 'High Backlift Setup',
        instructions: 'Raise the bat above shoulder height in preparation for horizontal plane stroke.',
        visualCue: 'Chest turns toward the bowler slightly.'
      },
      {
        stepNumber: 3,
        title: 'Contact in Front of Eyes',
        instructions: 'Meet the ball in front of the body on the swivel axis.',
        visualCue: 'Roll wrists downward at the split second of impact.'
      },
      {
        stepNumber: 4,
        title: 'Swivel & Rotation',
        instructions: 'Pivot on the ball of the back foot, allowing the hips to rotate 90 degrees.',
        visualCue: 'Finish facing the square-leg umpire in complete balance.'
      }
    ]
  }
];

export const mockGearGuides: GearGuideSection[] = [
  {
    id: 'gear-bat-sizing',
    category: 'Bat Sizing & Willow',
    title: 'Cricket Bat Sizing, Weight & Willow Selection',
    summary: 'Selecting the correct bat size and sweet-spot profile prevents wrist fatigue and builds clean mechanics.',
    checklist: [
      'Stand bat vertically next to your leg: the top of the handle should reach the top of your hip bone.',
      'When picking up the bat in one hand with your top grip, you should be able to hold it horizontally for 5 seconds without wrist shaking.',
      'Low Sweet Spot (3-6 inches from toe): ideal for subcontinental, low-bounce slow pitches.',
      'Mid/High Sweet Spot: ideal for Australian, English, and South African bouncy pitches.',
      'Grade 1 English Willow features 6-12 straight grains with minimal blemishes; Grade 3-4 has wider grain structure at great value.'
    ],
    specsTable: {
      header: ['Bat Size', 'Player Height', 'Player Age', 'Avg Bat Length', 'Recommended Weight'],
      rows: [
        ['Size 0', 'Up to 3ft 9in', '4 - 5 yrs', '26 inches', '1 lb 10 oz - 1 lb 14 oz'],
        ['Size 1', '3ft 9in - 4ft 0in', '5 - 6 yrs', '27 inches', '1 lb 12 oz - 2 lb 0 oz'],
        ['Size 2', '4ft 0in - 4ft 3in', '6 - 7 yrs', '28 inches', '1 lb 14 oz - 2 lb 2 oz'],
        ['Size 3', '4ft 3in - 4ft 6in', '7 - 8 yrs', '29 inches', '2 lb 0 oz - 2 lb 4 oz'],
        ['Size 4', '4ft 6in - 4ft 9in', '8 - 9 yrs', '30 inches', '2 lb 2 oz - 2 lb 6 oz'],
        ['Size 5', '4ft 9in - 5ft 0in', '9 - 10 yrs', '31 inches', '2 lb 4 oz - 2 lb 7 oz'],
        ['Size 6', '5ft 0in - 5ft 3in', '10 - 12 yrs', '32 inches', '2 lb 6 oz - 2 lb 9 oz'],
        ['Harrow', '5ft 3in - 5ft 6in', '12 - 14 yrs', '32.5 inches', '2 lb 7 oz - 2 lb 10 oz'],
        ['Short Handle (SH)', '5ft 6in - 6ft 0in', '15+ / Adults', '33.5 inches', '2 lb 7 oz - 2 lb 12 oz'],
        ['Long Handle (LH)', '6ft 0in & Above', 'Tall Adults', '34.25 inches', '2 lb 9 oz - 2 lb 14 oz']
      ]
    },
    proTip: 'Never buy a bat that is too heavy for a junior hoping they will "grow into it." An overly heavy bat destroys natural high-elbow technique and forces bottom-hand scooping.',
    safetyAlert: 'Ensure your bat is thoroughly knocked in (at least 4-6 hours with a wooden mallet) before facing a hard leather ball to prevent edge cracking.'
  },
  {
    id: 'gear-helmet-safety',
    category: 'Helmet Safety (BS 7928)',
    title: 'Helmet Standards, Peak Gap & StemGuard Safety',
    summary: 'Safety first: every modern cricket helmet must satisfy the rigorous British Standard BS 7928:2013 impact test.',
    checklist: [
      'Look for the official "BS 7928:2013" certification label inside the helmet shell.',
      'Check the Grille-to-Peak Gap: a standard 5.5cm cricket ball must NEVER be able to squeeze between the peak and the metal grille.',
      'Ensure the chin cup fits snugly: no more than one finger space should exist under the chin strap.',
      'Attach an approved foam/composite neck guard (StemGuard) to protect the base of the skull/cervical spine against bouncers.',
      'Titanium grilles are ~30% lighter than stainless steel, reducing fatigue in long innings.'
    ],
    proTip: 'If a helmet takes a high-velocity direct impact (over 130 km/h) resulting in a shell dent or cracked EPS foam, replace it immediately even if external damage looks minor.',
    safetyAlert: 'Never play with a loose or bent grille. Even a 5mm widening can allow a cricket ball seam to penetrate to the eye socket.'
  },
  {
    id: 'gear-pads-protection',
    category: 'Pads & Protection',
    title: 'Leg Guards, Knee Rolls & Thigh Pad Fitting',
    summary: 'Batting pads must provide maximum protection without hindering sprint speed between wickets.',
    checklist: [
      'Knee Roll Alignment: The center of the padded knee bolster MUST sit directly over your kneecap when standing.',
      'Top Hat (Wing): Should sit comfortably below the hip crease so it does not collide with your thigh guard when squatting.',
      'Straps: Fasten the bottom ankle strap first, then the top calf strap. Straps should be snug but not pinch blood flow.',
      'Combo Thigh Pad: Inner and outer thigh guards should be linked by an adjustable elastic waist band to prevent slippage during quick singles.'
    ],
    proTip: 'Choose cane-reinforced pads over pure foam if you regularly face fast bowlers above 130 km/h for greater shock absorption against ball impact.'
  },
  {
    id: 'gear-gloves-spikes',
    category: 'Gloves & Spikes',
    title: 'Batting Gloves & Spike Selection',
    summary: 'Protecting your fingers from crushing impacts while maintaining soft feel on the rubber grip.',
    checklist: [
      'Split-Finger (Multi-Flex) Gloves: Best for flexibility, bottom-hand wrist rotation, and modern T20 360-degree shotmaking.',
      'Sausage-Finger (Traditional) Gloves: Thick high-density foam tubes offering maximum protection against fast bouncers on hard tracks.',
      'Lead Hand Thumb Protection: Ensure the bottom hand thumb has a three-piece hard plastic casing (thermoplastic inserts).',
      'Spike Types: Use full steel spikes for soft turf wickets, half-spikes (rubber heel) for firm turf, and full rubber studs for synthetic/concrete net practice.'
    ],
    proTip: 'Always carry 2 pairs of inner chamois leather gloves in your kit bag to absorb sweat on hot days and prevent bat twisting.'
  }
];
