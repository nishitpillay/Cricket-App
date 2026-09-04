import { BeehiveDelivery, HawkEyeHitVerdict } from '../types';

export const mockBeehiveDeliveries: BeehiveDelivery[] = [
  {
    id: 'del-1',
    ballNumber: 1,
    overNumber: '1.1',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Ben Stokes',
    speedKmh: 141.8,
    postBounceSpeedKmh: 125.4,
    lengthCategory: 'Good Length',
    lineCategory: 'Off Stump',
    impactXCm: -10.8, // Top of off stump
    impactYCm: 68.4,  // Just below bails
    outcome: 'Wicket',
    wicketType: 'Bowled',
    swingDeg: 2.1,
    seamCutDeg: 1.4,
    spinRpm: 2150,
    hawkEyeVerdict: 'HITTING_OFF',
    lbwProbabilityPct: 98.2,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.15, y: 2.18, z: 0 },
      apexPoint: { x: 0.12, y: 2.22, z: 5.5 },
      pitchPoint: { x: -0.06, y: 0.0, z: 14.8 },
      impactPoint: { x: -0.108, y: 0.684, z: 20.12 },
      projectedEnd: { x: -0.12, y: 0.72, z: 22.0 },
    },
  },
  {
    id: 'del-2',
    ballNumber: 2,
    overNumber: '1.2',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Ben Stokes',
    speedKmh: 144.2,
    postBounceSpeedKmh: 127.8,
    lengthCategory: 'Yorker',
    lineCategory: 'Middle Stump',
    impactXCm: 1.2,   // Root of middle
    impactYCm: 14.5,  // Toe-crusher
    outcome: 'Wicket',
    wicketType: 'Clean Bowled',
    swingDeg: -1.8,
    seamCutDeg: 0.8,
    spinRpm: 2280,
    hawkEyeVerdict: 'HITTING_MIDDLE',
    lbwProbabilityPct: 99.4,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.14, y: 2.15, z: 0 },
      apexPoint: { x: 0.10, y: 2.18, z: 5.0 },
      pitchPoint: { x: 0.02, y: 0.0, z: 18.2 },
      impactPoint: { x: 0.012, y: 0.145, z: 20.12 },
      projectedEnd: { x: 0.01, y: 0.16, z: 22.0 },
    },
  },
  {
    id: 'del-3',
    ballNumber: 3,
    overNumber: '1.3',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Joe Root',
    speedKmh: 139.6,
    postBounceSpeedKmh: 123.0,
    lengthCategory: 'Good Length',
    lineCategory: '4th Stump',
    impactXCm: -22.5, // Corridor of uncertainty
    impactYCm: 72.0,  // Bail height
    outcome: 'Play and Miss',
    swingDeg: 2.8,
    seamCutDeg: 1.2,
    spinRpm: 2110,
    hawkEyeVerdict: 'MISSING_OFF',
    lbwProbabilityPct: 12.0,
    isStumpHit: false,
    flightTrajectory: {
      releasePoint: { x: 0.16, y: 2.20, z: 0 },
      apexPoint: { x: 0.10, y: 2.24, z: 6.0 },
      pitchPoint: { x: -0.14, y: 0.0, z: 14.5 },
      impactPoint: { x: -0.225, y: 0.72, z: 20.12 },
      projectedEnd: { x: -0.26, y: 0.76, z: 22.0 },
    },
  },
  {
    id: 'del-4',
    ballNumber: 4,
    overNumber: '1.4',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Joe Root',
    speedKmh: 143.0,
    postBounceSpeedKmh: 126.2,
    lengthCategory: 'Full',
    lineCategory: 'Leg Stump',
    impactXCm: 10.4,  // Leg stump
    impactYCm: 44.0,  // Knee roll height
    outcome: 'Wicket',
    wicketType: 'LBW',
    swingDeg: -2.4,   // Inswinger
    seamCutDeg: 0.5,
    spinRpm: 2210,
    hawkEyeVerdict: 'HITTING_LEG',
    lbwProbabilityPct: 94.7,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.18, y: 2.16, z: 0 },
      apexPoint: { x: 0.12, y: 2.19, z: 5.5 },
      pitchPoint: { x: 0.06, y: 0.0, z: 16.4 },
      impactPoint: { x: 0.104, y: 0.44, z: 20.12 },
      projectedEnd: { x: 0.115, y: 0.48, z: 22.0 },
    },
  },
  {
    id: 'del-5',
    ballNumber: 5,
    overNumber: '1.5',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Harry Brook',
    speedKmh: 145.6,
    postBounceSpeedKmh: 128.5,
    lengthCategory: 'Bouncer',
    lineCategory: 'Off Stump',
    impactXCm: -6.0,
    impactYCm: 135.0, // Shoulder height bouncer
    outcome: 'Dot',
    swingDeg: 0.8,
    seamCutDeg: 2.1,
    spinRpm: 2340,
    hawkEyeVerdict: 'MISSING_OVER',
    lbwProbabilityPct: 0.0,
    isStumpHit: false,
    flightTrajectory: {
      releasePoint: { x: 0.15, y: 2.22, z: 0 },
      apexPoint: { x: 0.11, y: 2.26, z: 4.5 },
      pitchPoint: { x: -0.02, y: 0.0, z: 10.2 },
      impactPoint: { x: -0.06, y: 1.35, z: 20.12 },
      projectedEnd: { x: -0.07, y: 1.52, z: 22.0 },
    },
  },
  {
    id: 'del-6',
    ballNumber: 6,
    overNumber: '1.6',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Harry Brook',
    speedKmh: 142.1,
    postBounceSpeedKmh: 125.1,
    lengthCategory: 'Good Length',
    lineCategory: 'Middle Stump',
    impactXCm: 0.5,
    impactYCm: 71.0, // Bail trimmer
    outcome: 'Wicket',
    wicketType: 'Bowled',
    swingDeg: 1.2,
    seamCutDeg: 0.9,
    spinRpm: 2200,
    hawkEyeVerdict: 'CLIPPING_BAILS_UMPIRES_CALL',
    lbwProbabilityPct: 88.5,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.14, y: 2.17, z: 0 },
      apexPoint: { x: 0.10, y: 2.21, z: 5.5 },
      pitchPoint: { x: 0.01, y: 0.0, z: 15.0 },
      impactPoint: { x: 0.005, y: 0.71, z: 20.12 },
      projectedEnd: { x: 0.002, y: 0.75, z: 22.0 },
    },
  },
  {
    id: 'del-7',
    ballNumber: 7,
    overNumber: '2.1',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Harry Brook',
    speedKmh: 138.4,
    postBounceSpeedKmh: 121.8,
    lengthCategory: 'Short of Length',
    lineCategory: '4th Stump',
    impactXCm: -28.0,
    impactYCm: 92.0,
    outcome: 'Boundary',
    swingDeg: 1.9,
    seamCutDeg: 1.1,
    spinRpm: 2050,
    hawkEyeVerdict: 'MISSING_OFF',
    lbwProbabilityPct: 4.0,
    isStumpHit: false,
    flightTrajectory: {
      releasePoint: { x: 0.15, y: 2.19, z: 0 },
      apexPoint: { x: 0.11, y: 2.23, z: 5.2 },
      pitchPoint: { x: -0.16, y: 0.0, z: 12.8 },
      impactPoint: { x: -0.28, y: 0.92, z: 20.12 },
      projectedEnd: { x: -0.32, y: 1.02, z: 22.0 },
    },
  },
  {
    id: 'del-8',
    ballNumber: 8,
    overNumber: '2.2',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Harry Brook',
    speedKmh: 143.8,
    postBounceSpeedKmh: 126.9,
    lengthCategory: 'Good Length',
    lineCategory: 'Off Stump',
    impactXCm: -9.2,
    impactYCm: 58.0,
    outcome: 'Dot',
    swingDeg: 2.2,
    seamCutDeg: 0.7,
    spinRpm: 2190,
    hawkEyeVerdict: 'HITTING_OFF',
    lbwProbabilityPct: 92.1,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.14, y: 2.16, z: 0 },
      apexPoint: { x: 0.09, y: 2.20, z: 5.6 },
      pitchPoint: { x: -0.05, y: 0.0, z: 15.2 },
      impactPoint: { x: -0.092, y: 0.58, z: 20.12 },
      projectedEnd: { x: -0.105, y: 0.62, z: 22.0 },
    },
  },
  {
    id: 'del-9',
    ballNumber: 9,
    overNumber: '2.3',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Jos Buttler',
    speedKmh: 136.5,
    postBounceSpeedKmh: 119.4,
    lengthCategory: 'Yorker',
    lineCategory: 'Wide Outside Off',
    impactXCm: -46.0,
    impactYCm: 18.0,
    outcome: 'Dot',
    swingDeg: 3.5, // Big outswinger
    seamCutDeg: 0.4,
    spinRpm: 1980,
    hawkEyeVerdict: 'MISSING_OFF',
    lbwProbabilityPct: 1.2,
    isStumpHit: false,
    flightTrajectory: {
      releasePoint: { x: 0.15, y: 2.14, z: 0 },
      apexPoint: { x: 0.08, y: 2.18, z: 5.4 },
      pitchPoint: { x: -0.32, y: 0.0, z: 17.8 },
      impactPoint: { x: -0.46, y: 0.18, z: 20.12 },
      projectedEnd: { x: -0.52, y: 0.20, z: 22.0 },
    },
  },
  {
    id: 'del-10',
    ballNumber: 10,
    overNumber: '2.4',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Jos Buttler',
    speedKmh: 146.2,
    postBounceSpeedKmh: 129.1,
    lengthCategory: 'Full',
    lineCategory: 'Middle Stump',
    impactXCm: 1.0,
    impactYCm: 32.0,
    outcome: 'Wicket',
    wicketType: 'Bowled',
    swingDeg: -1.5,
    seamCutDeg: 1.8,
    spinRpm: 2380,
    hawkEyeVerdict: 'HITTING_MIDDLE',
    lbwProbabilityPct: 97.8,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.16, y: 2.16, z: 0 },
      apexPoint: { x: 0.11, y: 2.20, z: 5.2 },
      pitchPoint: { x: 0.02, y: 0.0, z: 16.8 },
      impactPoint: { x: 0.01, y: 0.32, z: 20.12 },
      projectedEnd: { x: 0.008, y: 0.35, z: 22.0 },
    },
  },
  {
    id: 'del-11',
    ballNumber: 11,
    overNumber: '2.5',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Sam Curran',
    speedKmh: 140.5,
    postBounceSpeedKmh: 124.0,
    lengthCategory: 'Good Length',
    lineCategory: 'Leg Stump',
    impactXCm: 18.5,
    impactYCm: 65.0,
    outcome: 'Single',
    swingDeg: -2.9,
    seamCutDeg: 0.6,
    spinRpm: 2120,
    hawkEyeVerdict: 'MISSING_LEG',
    lbwProbabilityPct: 22.4,
    isStumpHit: false,
    flightTrajectory: {
      releasePoint: { x: 0.18, y: 2.17, z: 0 },
      apexPoint: { x: 0.13, y: 2.20, z: 5.5 },
      pitchPoint: { x: 0.12, y: 0.0, z: 15.1 },
      impactPoint: { x: 0.185, y: 0.65, z: 20.12 },
      projectedEnd: { x: 0.21, y: 0.70, z: 22.0 },
    },
  },
  {
    id: 'del-12',
    ballNumber: 12,
    overNumber: '2.6',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Sam Curran',
    speedKmh: 144.5,
    postBounceSpeedKmh: 127.3,
    lengthCategory: 'Good Length',
    lineCategory: 'Off Stump',
    impactXCm: -11.0,
    impactYCm: 70.8,
    outcome: 'Wicket',
    wicketType: 'Bowled',
    swingDeg: 2.0,
    seamCutDeg: 1.5,
    spinRpm: 2290,
    hawkEyeVerdict: 'HITTING_OFF',
    lbwProbabilityPct: 96.5,
    isStumpHit: true,
    flightTrajectory: {
      releasePoint: { x: 0.15, y: 2.18, z: 0 },
      apexPoint: { x: 0.10, y: 2.22, z: 5.5 },
      pitchPoint: { x: -0.06, y: 0.0, z: 14.9 },
      impactPoint: { x: -0.11, y: 0.708, z: 20.12 },
      projectedEnd: { x: -0.125, y: 0.75, z: 22.0 },
    },
  },
];

// Helper to assess Hawk-Eye hit or miss based on regulation cricket wickets:
// Width of 3 stumps + bails = 9 inches = 22.86 cm (X: -11.43 cm to +11.43 cm)
// Height of stumps + bails = 28 inches = 71.12 cm (Y: 0 cm to 71.12 cm)
export function evaluateHawkEyeImpact(impactXCm: number, impactYCm: number): {
  verdict: HawkEyeHitVerdict;
  isStumpHit: boolean;
  lbwProbabilityPct: number;
} {
  const isWidthHit = Math.abs(impactXCm) <= 11.43;
  const isHeightHit = impactYCm >= 0 && impactYCm <= 71.12;

  // Margin for Umpire's Call clipping bails (71.12cm to 74.0cm, or edge of stump width 10.5cm - 13.0cm)
  const isClippingBails = impactYCm > 71.12 && impactYCm <= 75.0 && Math.abs(impactXCm) <= 12.0;
  const isClippingStumpEdge = isHeightHit && Math.abs(impactXCm) > 11.43 && Math.abs(impactXCm) <= 13.5;

  if (isClippingBails || isClippingStumpEdge) {
    return {
      verdict: 'CLIPPING_BAILS_UMPIRES_CALL',
      isStumpHit: true,
      lbwProbabilityPct: 82.0,
    };
  }

  if (isWidthHit && isHeightHit) {
    let verdict: HawkEyeHitVerdict = 'HITTING_MIDDLE';
    if (impactXCm < -3.8) verdict = 'HITTING_OFF';
    else if (impactXCm > 3.8) verdict = 'HITTING_LEG';

    return {
      verdict,
      isStumpHit: true,
      lbwProbabilityPct: 96.5,
    };
  }

  if (impactYCm > 71.12) {
    return {
      verdict: 'MISSING_OVER',
      isStumpHit: false,
      lbwProbabilityPct: Math.max(0, 40 - (impactYCm - 71.12) * 2),
    };
  }

  if (impactXCm < -11.43) {
    return {
      verdict: 'MISSING_OFF',
      isStumpHit: false,
      lbwProbabilityPct: Math.max(0, 30 - Math.abs(impactXCm + 11.43) * 3),
    };
  }

  return {
    verdict: 'MISSING_LEG',
    isStumpHit: false,
    lbwProbabilityPct: Math.max(0, 30 - Math.abs(impactXCm - 11.43) * 3),
  };
}
