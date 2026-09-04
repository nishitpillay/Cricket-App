import {
  DEFAULT_AUTOSLICER_CONFIG,
  mockAutoSlicedClips,
  mockNetSessionPlaylists,
  getStoredAutoSlicerConfig,
  getStoredPlaylists,
} from './src/data/autoSlicerPlaylistData';

let passed = 0;
let total = 0;

function assert(cond: boolean, name: string, details?: string) {
  total++;
  if (cond) {
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name} ${details ? `(${details})` : ''}`);
  }
}

console.log('======================================================');
console.log('PITCH PRECISION — PRIORITY 3 AUTO-SLICER REGRESSION');
console.log('======================================================\n');

// 1. Auto-Slicer Configuration Parameters
console.log('--- 1. AUTOSLICER BUFFER & TRIGGER CONFIGURATION ---');
assert(DEFAULT_AUTOSLICER_CONFIG.isEnabled === true, 'Auto-slicer buffer is enabled by default');
assert(DEFAULT_AUTOSLICER_CONFIG.preRollSeconds >= 1.0 && DEFAULT_AUTOSLICER_CONFIG.preRollSeconds <= 3.0, 'Pre-roll buffer is within 1.0s - 3.0s window');
assert(DEFAULT_AUTOSLICER_CONFIG.postRollSeconds >= 1.5 && DEFAULT_AUTOSLICER_CONFIG.postRollSeconds <= 4.0, 'Post-roll buffer is within 1.5s - 4.0s window');
assert(DEFAULT_AUTOSLICER_CONFIG.soundThresholdDb <= -10 && DEFAULT_AUTOSLICER_CONFIG.soundThresholdDb >= -25, 'Acoustic snick threshold is within realistic dB range');
assert(DEFAULT_AUTOSLICER_CONFIG.slowMoFrameRateFps === 120, 'Default slow-mo camera capture is 120 FPS');
assert(DEFAULT_AUTOSLICER_CONFIG.autoBookmarkWickets === true, 'Auto-bookmark wickets is active');

// 2. Auto-Sliced Delivery Clips Integrity
console.log('\n--- 2. AUTO-SLICED CLIPS & TELEMETRY INTEGRITY ---');
assert(mockAutoSlicedClips.length === 12, '12 auto-sliced clips loaded in standard net session');

for (const clip of mockAutoSlicedClips) {
  assert(clip.durationSeconds >= 4.0 && clip.durationSeconds <= 6.0, `Clip #${clip.ballNumber} duration (${clip.durationSeconds}s) is in 4.0-6.0s broadcast slow-mo range`);
  assert(clip.detectionConfidencePct >= 95.0, `Clip #${clip.ballNumber} AI detection confidence (${clip.detectionConfidencePct}%) is >= 95%`);
  assert(clip.thumbnailUrl.startsWith('https://'), `Clip #${clip.ballNumber} thumbnail has secure HTTPS URL`);
  assert(clip.delivery.speedKmh >= 130 && clip.delivery.speedKmh <= 150, `Clip #${clip.ballNumber} speed ${clip.delivery.speedKmh} km/h is valid`);
  assert(clip.delivery.hawkEyeVerdict !== undefined, `Clip #${clip.ballNumber} includes Hawk-Eye strike verdict`);
  
  if (clip.delivery.outcome === 'Wicket') {
    assert(clip.isBookmarked === true, `Wicket clip #${clip.ballNumber} is automatically bookmarked`);
  }
}

// 3. Net Session Playlists & Aggregate Metrics
console.log('\n--- 3. NET SESSION PLAYLISTS & AGGREGATE CALCULATIONS ---');
assert(mockNetSessionPlaylists.length >= 2, 'Multiple net session playlists available');
const session1 = mockNetSessionPlaylists[0];
assert(session1.title.includes("Lord's"), 'Session 1 is at Lord\'s Indoor Cricket Centre');
assert(session1.pitchCondition === 'Turf', 'Session 1 pitch condition is Turf');
assert(session1.totalDeliveries === 12, 'Session 1 totals 12 deliveries');
assert(session1.topSpeedKmh === 146.2, 'Session 1 top speed is 146.2 km/h');
assert(session1.avgSpeedKmh > 140, 'Session 1 average speed is > 140 km/h');
assert(session1.stumpHitPct > 50, 'Session 1 stumps hit percentage > 50%');

// 4. Default Storage Retrieval Fallbacks
console.log('\n--- 4. DATA STORE RETRIEVAL LOGIC ---');
const storedConfig = getStoredAutoSlicerConfig();
assert(storedConfig.preRollSeconds === DEFAULT_AUTOSLICER_CONFIG.preRollSeconds, 'getStoredAutoSlicerConfig retrieves default config safely');

const storedPlaylists = getStoredPlaylists();
assert(storedPlaylists.length >= 2, 'getStoredPlaylists retrieves default playlists safely');

console.log('\n======================================================');
console.log(`AUTO-SLICER REGRESSION RESULT: ${passed} / ${total} PASSED`);
console.log('======================================================');

if (passed !== total) {
  process.exit(1);
} else {
  process.exit(0);
}
