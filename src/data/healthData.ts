import { PlayerHealthRecord, AIRecoveryPlan } from '../types';

export const initialHealthRecord: PlayerHealthRecord = {
  id: 'health-root-01',
  playerName: 'J. Root',
  specialty: 'Top-Order Batsman & Captain',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSw2JC59TxaxcJTzcFRnzOeQPsDng9yjyDQu4fYq40HT2lDw_2QSvEL5tvbp7ruwi0BFK8HmjO8_nQTm0ZuOrt8SKVl8eWXn0LMEgajHer9HoyBBPAJ-XKmwdJ55o0zwWP9mAqqWFRK1cXcT854QENfHXfZ5XUhJL1Cyuzfv-u0_6WaiTLqg87EGsU2-C7SP8kTTpNKRwsbIQJxKvqkKdhCMn4NtEtLyDrwDNGiJOv_SJ1SOYxuhyQ',
  
  // RHR & HRV
  restingHeartRate: 49,
  baselineRhr: 48,
  hrvMs: 78,
  baselineHrv: 82,
  
  // Sleep
  sleepHours: 8.2,
  sleepQualityScore: 91,
  deepSleepMinutes: 112,
  remSleepMinutes: 118,
  lightSleepMinutes: 262,
  sleepEfficiencyPct: 94,
  sleepDebtMinutes: -15, // 15 mins banked
  
  // Workload & Intensity
  dailyWorkloadStrainAU: 680,
  acuteWorkload7d: 2450,
  chronicWorkload28d: 2150,
  acwr: 1.14,
  highSpeedRunningKm: 3.8,
  bowlingDeliveriesCount: 42,
  matchDurationMinutes: 180,
  muscleSorenessScore: 3,
  
  // Readiness
  readinessScore: 88,
  readinessTier: 'OPTIMAL',
  
  // 7-day Historical Trend
  sevenDayTrends: [
    {
      dayLabel: 'Wed',
      date: '2026-08-26',
      restingHeartRate: 47,
      hrvMs: 84,
      sleepHours: 8.5,
      sleepQualityScore: 94,
      workloadStrainAU: 420,
      acwr: 0.98,
      readinessScore: 94,
      bowlingBalls: 18,
      soreness: 2
    },
    {
      dayLabel: 'Thu',
      date: '2026-08-27',
      restingHeartRate: 48,
      hrvMs: 82,
      sleepHours: 7.9,
      sleepQualityScore: 89,
      workloadStrainAU: 750,
      acwr: 1.05,
      readinessScore: 90,
      bowlingBalls: 48,
      soreness: 3
    },
    {
      dayLabel: 'Fri',
      date: '2026-08-28',
      restingHeartRate: 52,
      hrvMs: 72,
      sleepHours: 6.8,
      sleepQualityScore: 78,
      workloadStrainAU: 920,
      acwr: 1.22,
      readinessScore: 74,
      bowlingBalls: 60,
      soreness: 5
    },
    {
      dayLabel: 'Sat',
      date: '2026-08-29',
      restingHeartRate: 53,
      hrvMs: 69,
      sleepHours: 7.2,
      sleepQualityScore: 82,
      workloadStrainAU: 840,
      acwr: 1.28,
      readinessScore: 71,
      bowlingBalls: 36,
      soreness: 6
    },
    {
      dayLabel: 'Sun',
      date: '2026-08-30',
      restingHeartRate: 50,
      hrvMs: 76,
      sleepHours: 9.0,
      sleepQualityScore: 95,
      workloadStrainAU: 280,
      acwr: 1.18,
      readinessScore: 86,
      bowlingBalls: 0,
      soreness: 4
    },
    {
      dayLabel: 'Mon',
      date: '2026-08-31',
      restingHeartRate: 48,
      hrvMs: 81,
      sleepHours: 8.1,
      sleepQualityScore: 90,
      workloadStrainAU: 560,
      acwr: 1.12,
      readinessScore: 91,
      bowlingBalls: 30,
      soreness: 2
    },
    {
      dayLabel: 'Today',
      date: '2026-09-01',
      restingHeartRate: 49,
      hrvMs: 78,
      sleepHours: 8.2,
      sleepQualityScore: 91,
      workloadStrainAU: 680,
      acwr: 1.14,
      readinessScore: 88,
      bowlingBalls: 42,
      soreness: 3
    }
  ]
};

export const initialAIRecoveryPlan: AIRecoveryPlan = {
  readinessScore: 88,
  readinessTier: 'OPTIMAL',
  readinessAssessment: 'Autonomic nervous system is primed with robust parasympathetic tone. Heart Rate Variability (78 ms) is within 5% of your elite baseline, and resting heart rate (49 bpm) indicates efficient cardiovascular recovery following yesterday’s 680 AU net session.',
  workloadVerdict: 'Acute:Chronic Workload Ratio (ACWR) stands at 1.14, comfortably inside the optimal adaptation sweet spot (0.8 - 1.3). Lumbar spine and hamstring load accumulation are within low-injury risk tolerances.',
  injuryRiskIndex: 'Low (0.84 - 1.14 ACWR Range • Safe Functional Overreach)',
  prescribedTrainingAdaptation: {
    headline: 'Cleared for Full Match-Intensity Execution & High-Velocity Running',
    maxBowlingOvers: '6 to 8 Overs (Full Match Intensity)',
    highIntensitySprintsAllowed: true,
    recommendedDrills: [
      'High-Speed Running Between Wickets (Repeat 2s and 3s)',
      'Death Overs Yorker Precision & Slower Ball Variations',
      'Slip Cordon Reaction Snatch & Diving Drills'
    ],
    drillsToAvoid: [
      'Excessive unweighted over-speed bat throwing without full dynamic warmup'
    ]
  },
  nutritionHydrationProtocol: {
    waterIntakeLiters: 3.4,
    electrolytesMg: '1200mg Sodium + 400mg Potassium with Tart Cherry Concentrate',
    keySupplements: [
      'Magnesium Glycinate (400mg before bed for neuromuscular relaxation)',
      'Tart Cherry Extract (Anthocyanins 500mg for DOMS reduction)',
      'Hydrolyzed Whey Isolate + 3g Leucine (Post-session synthesis)',
      'Omega-3 EPA/DHA (2000mg for anti-inflammatory joint recovery)'
    ],
    mealTimingAdvice: 'Consume 35g high-quality protein + 75g low-GI carbohydrates within 40 minutes post-training to replenish glycogen depleted during high-speed crease sprints.'
  },
  activeRecoveryRoutine: {
    durationMinutes: 25,
    modality: 'Contrast Hydrotherapy & Thoracic Spine Mobilization',
    steps: [
      {
        order: 1,
        action: 'Contrast Hydrotherapy (12°C Cold Plunge vs 38°C Hot Tub)',
        duration: '12 mins (3 cycles of 3m hot / 1m cold)',
        rationale: 'Stimulates systemic vasoconstriction/vasodilation pumping action, accelerating metabolic byproduct clearance.'
      },
      {
        order: 2,
        action: 'Thoracic Extension & Cat-Camel Foam Rolling',
        duration: '7 mins',
        rationale: 'Decompresses thoracic spine segments after torsional bowling torque and batting power strokes.'
      },
      {
        order: 3,
        action: 'Hamstring & Hip Flexor PNF Stretch with Resistance Band',
        duration: '6 mins',
        rationale: 'Lengthens anterior hip chain to prevent lumbar hyperextension during bowling delivery stride.'
      }
    ]
  },
  sleepOptimization: {
    targetBedtime: '22:15',
    sleepHygieneCues: [
      'Set bedroom thermostat to 18.5°C to facilitate natural core body temperature drop',
      'Enforce blue-light filter glasses or screen blackout 45 minutes prior to sleep',
      'Conduct 5 minutes of 4-7-8 diaphragmatic parasympathetic breathing in bed'
    ]
  },
  coachSummary: 'J. Root is physically primed (Readiness: 88/100, Optimal Tier). High performance staff approve full workload participation for today’s tactical session.'
};

export interface HealthPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  rhr: number;
  hrv: number;
  sleep: number;
  sleepQuality: number;
  workload: number;
  acwr: number;
  bowlingBalls: number;
  soreness: number;
  complaintNotes: string;
}

export const healthPresets: HealthPreset[] = [
  {
    id: 'optimal',
    name: 'Peak Match Condition',
    badge: 'OPTIMAL (88/100)',
    description: 'Restored HRV, 8.2h sleep, balanced ACWR 1.14.',
    rhr: 49,
    hrv: 78,
    sleep: 8.2,
    sleepQuality: 91,
    workload: 680,
    acwr: 1.14,
    bowlingBalls: 42,
    soreness: 3,
    complaintNotes: 'Feeling sharp and explosive; ready for match simulation.'
  },
  {
    id: 'heavy-bowling',
    name: 'Post Heavy 12-Over Spell',
    badge: 'FATIGUE (68/100)',
    description: 'Spike in workload, muscle soreness 7/10, elevated RHR.',
    rhr: 54,
    hrv: 62,
    sleep: 7.1,
    sleepQuality: 78,
    workload: 950,
    acwr: 1.38,
    bowlingBalls: 72,
    soreness: 7,
    complaintNotes: 'Lower back stiffness on non-bowling side and heavy quad fatigue after bowling 12 overs in heat.'
  },
  {
    id: 'sleep-deprived',
    name: 'Travel & Sub-Optimal Sleep',
    badge: 'WARNING (62/100)',
    description: 'Only 5.4h sleep, suppressed HRV 58ms, CNS fatigue.',
    rhr: 56,
    hrv: 58,
    sleep: 5.4,
    sleepQuality: 64,
    workload: 520,
    acwr: 1.21,
    bowlingBalls: 24,
    soreness: 5,
    complaintNotes: 'Night flight arrival; groggy cognitive state and delayed reaction times in morning warm-up.'
  },
  {
    id: 'rest-recharge',
    name: 'Post-Rest Day Recharge',
    badge: 'RECHARGED (95/100)',
    description: '9.0h deep sleep, low RHR 46 bpm, zero bowling fatigue.',
    rhr: 46,
    hrv: 86,
    sleep: 9.0,
    sleepQuality: 96,
    workload: 310,
    acwr: 0.92,
    bowlingBalls: 0,
    soreness: 1,
    complaintNotes: 'Zero soreness; full recovery completed with contrast hydrotherapy.'
  }
];
