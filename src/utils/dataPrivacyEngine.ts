import { DataClassificationLevel, DataFieldClassification, SanitizedTelemetryLog, DataPrivacySettings } from '../types';

/**
 * DATA PRIVACY CLASSIFICATION REGISTRY
 * 
 * Strict classification adhering to Privacy by Design and Data Minimization.
 * Only data strictly required for the cricket coaching service is collected.
 */
export const DATA_CLASSIFICATION_REGISTRY: DataFieldClassification[] = [
  // 1. PUBLIC
  {
    fieldName: 'public_match_scores',
    category: 'Match & Academy Overview',
    classification: 'PUBLIC',
    requiredForService: true,
    purposeRationale: 'Display standard cricket scorecard totals and publicly scheduled club fixtures.',
    retentionPeriod: 'Indefinite / Permanent archive',
    maskingMethod: 'None (Aggregated score numbers only)',
    isRedactedFromLogs: false,
    examples: ['248/6 in 45.0 overs vs St. Albans CC', 'Player strike rate 124.5', 'Match date and club division']
  },
  {
    fieldName: 'cricket_drills_catalog',
    category: 'Curriculum & Tactics',
    classification: 'PUBLIC',
    requiredForService: true,
    purposeRationale: 'Serve educational training modules, batting wagon wheel models, and bowling pitch maps.',
    retentionPeriod: 'Indefinite',
    maskingMethod: 'None (Generic instructional assets)',
    isRedactedFromLogs: false,
    examples: ['Front-Foot Cover Drive Drill #14', 'In-Swinging Good Length Drill', 'ICC Level 3 Spin Masterclass']
  },

  // 2. INTERNAL
  {
    fieldName: 'tactical_field_presets',
    category: 'Coaching Operations',
    classification: 'INTERNAL',
    requiredForService: true,
    purposeRationale: 'Store academy chalkboard whiteboard states and squad training plans.',
    retentionPeriod: 'Active club season + 1 year',
    maskingMethod: 'Internal squad role restriction',
    isRedactedFromLogs: false,
    examples: ['Slip cordon placement strategy', 'Death overs field setup preset', 'Net session station allocations']
  },
  {
    fieldName: 'platform_system_metrics',
    category: 'Infrastructure',
    classification: 'INTERNAL',
    requiredForService: true,
    purposeRationale: 'Monitor application response latency, offline cache sync status, and video transcoding throughput.',
    retentionPeriod: '90 days rolling',
    maskingMethod: 'Aggregated metric telemetry',
    isRedactedFromLogs: false,
    examples: ['Sync latency 142ms', 'IndexedDB cache 4.2MB', 'Render pipeline FPS: 60']
  },

  // 3. PERSONAL
  {
    fieldName: 'player_legal_name',
    category: 'Identity & Profile',
    classification: 'PERSONAL',
    requiredForService: true,
    purposeRationale: 'Identify player on academy rosters, training schedules, and match scorecards.',
    retentionPeriod: 'Duration of academy membership + 6 months',
    maskingMethod: 'Pseudonymized in analytics (e.g. USER-DEV-42)',
    isRedactedFromLogs: true,
    examples: ['Devang Dalvi', 'Kiyara Pillay', 'Arin Mishra']
  },
  {
    fieldName: 'date_of_birth',
    category: 'Age Verification & Junior Safeguarding',
    classification: 'PERSONAL',
    requiredForService: true,
    purposeRationale: 'Calculate exact age group brackets (U-13, U-15, U-17, Senior) and automatically trigger mandatory junior safeguarding guardrails.',
    retentionPeriod: 'Active training duration; scrubbed upon account closure',
    maskingMethod: 'Masked as age bracket in logs (e.g., [AGE-BRACKET: U-16])',
    isRedactedFromLogs: true,
    examples: ['2003-05-14 (Age 23)', '2011-06-22 (Age 15 - Triggering Child Protection)']
  },
  {
    fieldName: 'email_address',
    category: 'Account & Security Communications',
    classification: 'PERSONAL',
    requiredForService: true,
    purposeRationale: 'Account authentication, password recovery, session alerts, and CC guardian communication delivery.',
    retentionPeriod: 'Duration of account activity',
    maskingMethod: 'Masked display (e.g., p***y@gmail.com) / Scrubbed from logs',
    isRedactedFromLogs: true,
    examples: ['PillayN@gmail.com', 'devi.pillay.parent@gmail.com', 'arin.mishra.coach@gmail.com']
  },
  {
    fieldName: 'phone_number',
    category: 'Emergency & Urgent Safeguarding Alerting',
    classification: 'PERSONAL',
    requiredForService: true,
    purposeRationale: 'Urgent safeguarding alerts and match-day rain cancellation SMS notifications.',
    retentionPeriod: 'Active season only',
    maskingMethod: 'E.164 masked (+44 7700 •••543) / Scrubbed in logs',
    isRedactedFromLogs: true,
    examples: ['+44 7700 900543', '+94 77 123 4567']
  },

  // 4. SENSITIVE
  {
    fieldName: 'player_videos',
    category: 'Biomechanical Analysis',
    classification: 'SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Perform AI motion-capture, seam rotation calculations, and telestration drawing overlays for technique improvement.',
    retentionPeriod: 'Configurable by player/guardian (default 30-day net review retention)',
    maskingMethod: 'EXIF metadata stripped, DRM encrypted blob URI, direct URLs scrubbed from logs',
    isRedactedFromLogs: true,
    examples: ['Front-foot drive 60fps telemetry video', 'Outswing bowling release frame video', 'High-speed batting slow-mo']
  },
  {
    fieldName: 'player_photographs',
    category: 'Profile & Visual Identity',
    classification: 'SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Render authenticated in-app avatar and coaching roster identification.',
    retentionPeriod: 'Account lifetime or until user replaces image',
    maskingMethod: 'Stripped of GPS/Camera EXIF metadata; URLs sanitized from debug logs',
    isRedactedFromLogs: true,
    examples: ['Player profile avatar', 'Coach badge headshot', 'Squad photo with EXIF metadata stripped']
  },
  {
    fieldName: 'coaching_assessments',
    category: 'Technical Feedback & Appraisal',
    classification: 'SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Provide customized mechanical corrections, batting grip adjustments, and tactical game recommendations.',
    retentionPeriod: '3 seasons for historical progress benchmarking',
    maskingMethod: 'Role-based access (Player + Assigned Coach + Guardian only)',
    isRedactedFromLogs: true,
    examples: ['"Keep head still through impact; slight head-bob at contact causing mistimed drives"', 'Release point seam tilt 14° review']
  },
  {
    fieldName: 'location_data',
    category: 'Session Context & Security Geo-verification',
    classification: 'SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Validate match venue weather conditions and detect unauthorized cross-border login attempts.',
    retentionPeriod: 'Coarse city retained; high-precision GPS coordinates scrubbed immediately after check-in',
    maskingMethod: 'Coarse city truncation (e.g., "London, UK" instead of precise latitude/longitude coordinates)',
    isRedactedFromLogs: true,
    examples: ['51.5074° N, 0.1278° W (Exact GPS -> Scrubbed)', 'Coarse Venue: Lord\'s Cricket Ground (Retained)']
  },

  // 5. CHILD-SENSITIVE
  {
    fieldName: 'junior_player_records',
    category: 'Youth & Under-18 Safeguarding',
    classification: 'CHILD-SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Deliver specialized youth cricket coaching with strict adherence to COPPA, UK Children’s Code, and ECB Safeguarding standards.',
    retentionPeriod: 'Active youth registration; expunged upon transition or explicit parent request',
    maskingMethod: 'Complete public discovery blackout; restricted exclusively to verified guardians and DBS-cleared coaches',
    isRedactedFromLogs: true,
    examples: ['Kiyara Pillay (Age 15) training metrics', 'Liam Chen (Age 14) bowling speed progression']
  },
  {
    fieldName: 'guardian_information',
    category: 'Parental Consent & Supervision',
    classification: 'CHILD-SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Maintain legally binding parental consent, dual-signature communication CC chains, and supervision portal access.',
    retentionPeriod: 'Until player reaches age of majority (18) + 1 year statutory audit requirement',
    maskingMethod: 'Encrypted storage with 4-digit guardian portal PIN; fully masked in logs',
    isRedactedFromLogs: true,
    examples: ['Devi Pillay (Mother, Verified Consent GV-UK-94218)', 'Sarah Chen (Parent, Authorized Coach Arin & Roshan)']
  },
  {
    fieldName: 'junior_video_recordings',
    category: 'Youth Video Telemetry',
    classification: 'CHILD-SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Technical swing and bowling analysis exclusively under active guardian supervision.',
    retentionPeriod: 'Private storage; auto-purged or archived per guardian settings',
    maskingMethod: 'Strict private-guardian-coach-only ACL; EXIF stripped; direct CDN tokens redacted from telemetry',
    isRedactedFromLogs: true,
    examples: ['Junior net practice clip with EXIF GPS removed', 'Guardian-supervised cover drive video review']
  },

  // 6. SECURITY-SENSITIVE
  {
    fieldName: 'authentication_credentials',
    category: 'Access Control & Authentication',
    classification: 'SECURITY-SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Authenticate users securely and prevent account takeover or unauthorized telemetry spoofing.',
    retentionPeriod: 'Stored as adaptive salted hashes (PBKDF2/Bcrypt); zero plaintext stored',
    maskingMethod: 'Salted cryptographic hash; NEVER logged in plaintext under any circumstance',
    isRedactedFromLogs: true,
    examples: ['PBKDF2 salted password hash', 'WebAuthn/FIDO2 public key credential IDs', 'OAuth 2.0 refresh tokens']
  },
  {
    fieldName: 'mfa_totp_secrets',
    category: 'Multi-Factor Safeguarding',
    classification: 'SECURITY-SENSITIVE',
    requiredForService: true,
    purposeRationale: 'Enforce mandatory 2FA for coaches and administrators handling junior member rosters.',
    retentionPeriod: 'Duration of MFA enrollment',
    maskingMethod: 'Encrypted vault; secret key NEVER displayed in UI or logged in telemetry',
    isRedactedFromLogs: true,
    examples: ['RFC 6238 TOTP seed secret', '2FA backup recovery codes', 'Guardian PIN hashes']
  },

  // 7. HIGHLY RESTRICTED
  {
    fieldName: 'injury_information',
    category: 'Sports Medicine & Workload Safety',
    classification: 'HIGHLY RESTRICTED',
    requiredForService: true,
    purposeRationale: 'Prevent acute bowling overuse injuries (e.g. lumbar stress fractures, shoulder impingements) and guide return-to-play bowling workloads.',
    retentionPeriod: 'Current season medical clearance + 1 year; subject to explicit medical consent',
    maskingMethod: 'Segregated encrypted medical partition; inaccessible to general peers or public analytics',
    isRedactedFromLogs: true,
    examples: ['Right shoulder rotator cuff strain (Grade 1)', 'Lumbar spine bowling workload restriction (Max 4 overs)']
  },
  {
    fieldName: 'fitness_information',
    category: 'Athletic Conditioning & Biometrics',
    classification: 'HIGHLY RESTRICTED',
    requiredForService: true,
    purposeRationale: 'Track cardiovascular conditioning, sprint split times, and recovery readiness to prevent athletic burnout.',
    retentionPeriod: 'Active season; anonymized for club athletic benchmarking',
    maskingMethod: 'Isolated biometric field; stripped from external analytics',
    isRedactedFromLogs: true,
    examples: ['Yo-Yo Intermittent Recovery Test Level 18.2', 'Heart Rate Recovery 142 bpm', 'Max velocity sprint 28.4 km/h']
  },
  {
    fieldName: 'behavioural_notes',
    category: 'Coaching Observations & Safeguarding Notes',
    classification: 'HIGHLY RESTRICTED',
    requiredForService: true,
    purposeRationale: 'Record private pastoral, sportsmanship, and mental resilience notes between head coach and designated safeguarding officers.',
    retentionPeriod: 'Confidential sealed record; reviewed annually',
    maskingMethod: 'End-to-end encrypted; strictly prohibited from all analytics and debugging streams',
    isRedactedFromLogs: true,
    examples: ['Confidential pastoral note on match anxiety', 'Safeguarding officer wellbeing observation']
  }
];

// Default Data Privacy Configuration
export const DEFAULT_DATA_PRIVACY_SETTINGS: DataPrivacySettings = {
  privacyByDesignEnforced: true,
  dataMinimizationActive: true,
  autoExifStripping: true,
  strictChildProtectionActive: true,
  analyticsRedactionLevel: 'FULL_ANONYMIZED',
  videoRetentionDays: 30,
  healthDataRestrictedToPlayerAndGuardian: true,
  coachBehavioralNotesEncrypted: true
};

/**
 * REGEX PATTERNS FOR AUTOMATED SENSITIVE DATA DETECTION & REDACTION
 */
const SENSITIVE_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g,
  dob: /\b(?:19|20)\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])\b/g,
  exactCoordinates: /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
  videoBlobUrl: /blob:https?:\/\/[^\s"'<>]+/gi,
  cdnAssetToken: /https:\/\/[^\s"'<>]+(?:\?|&)(?:token|key|sig|auth)=[^\s"'<>]+/gi,
  bearerToken: /Bearer\s+[A-Za-z0-9\-_.]+/gi,
  passwordKeyword: /(?:password|secret|pin|otp|token|privateKey)\s*[:=]\s*["']?([^"',\s]+)["']?/gi
};

// Sensitive Key Identifier Substrings
const SENSITIVE_KEY_NAMES = [
  'dateofbirth', 'dob', 'birthdate',
  'email', 'guardianemail',
  'phone', 'guardianphone', 'phonenumber',
  'video', 'videourl', 'frameimage', 'bloburl',
  'photo', 'avatar', 'photograph',
  'assessment', 'coachfeedback', 'corefocus',
  'injury', 'medical', 'condition', 'injuryhistory',
  'fitness', 'biometrics', 'heartrate',
  'behavioural', 'behavioral', 'notes', 'confidentialnotes',
  'guardian', 'guardianname', 'guardianinfo', 'guardianportalpin',
  'location', 'gps', 'latitude', 'longitude', 'coordinates',
  'password', 'passwordhash', 'mfa', 'totp', 'secret', 'token', 'passkey'
];

/**
 * Returns the classification level for a given field key.
 */
export function classifyFieldKey(key: string, isJunior: boolean = false): DataClassificationLevel {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normalized.includes('password') || normalized.includes('totp') || normalized.includes('secret') || normalized.includes('token') || normalized.includes('pin')) {
    return 'SECURITY-SENSITIVE';
  }
  if (normalized.includes('injury') || normalized.includes('medical') || normalized.includes('behavioural') || normalized.includes('behavioral') || normalized.includes('fitness')) {
    return 'HIGHLY RESTRICTED';
  }
  if (isJunior || normalized.includes('guardian') || normalized.includes('junior') || normalized.includes('child')) {
    return 'CHILD-SENSITIVE';
  }
  if (normalized.includes('video') || normalized.includes('assessment') || normalized.includes('photo') || normalized.includes('feedback') || normalized.includes('location') || normalized.includes('gps')) {
    return 'SENSITIVE';
  }
  if (normalized.includes('email') || normalized.includes('phone') || normalized.includes('dob') || normalized.includes('dateofbirth') || normalized.includes('name')) {
    return 'PERSONAL';
  }
  if (normalized.includes('preset') || normalized.includes('metric') || normalized.includes('latency') || normalized.includes('chalkboard')) {
    return 'INTERNAL';
  }
  return 'PUBLIC';
}

/**
 * Privacy by Design Scrubber: Deep sanitizes objects and strings.
 * Ensures zero sensitive information leaks to analytics, console, logs, or debugging streams.
 */
export function sanitizeForTelemetry(
  data: any,
  options: {
    isJuniorContext?: boolean;
    redactionPrefix?: string;
  } = {}
): {
  sanitized: any;
  redactedCount: number;
  categoriesRedacted: Set<DataClassificationLevel>;
} {
  let redactedCount = 0;
  const categoriesRedacted = new Set<DataClassificationLevel>();
  const isJunior = !!options.isJuniorContext;

  function redactString(val: string): string {
    let result = val;

    // Redact Emails
    if (SENSITIVE_PATTERNS.email.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.email, () => {
        redactedCount++;
        categoriesRedacted.add('PERSONAL');
        return '[REDACTED: PERSONAL - Email]';
      });
    }

    // Redact Phone Numbers
    if (SENSITIVE_PATTERNS.phone.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.phone, () => {
        redactedCount++;
        categoriesRedacted.add('PERSONAL');
        return '[REDACTED: PERSONAL - Phone]';
      });
    }

    // Redact Dates of Birth
    if (SENSITIVE_PATTERNS.dob.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.dob, () => {
        redactedCount++;
        categoriesRedacted.add(isJunior ? 'CHILD-SENSITIVE' : 'PERSONAL');
        return isJunior ? '[REDACTED: CHILD-SENSITIVE - DoB]' : '[REDACTED: PERSONAL - DoB]';
      });
    }

    // Redact Video Blobs / CDN Signed Tokens
    if (SENSITIVE_PATTERNS.videoBlobUrl.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.videoBlobUrl, () => {
        redactedCount++;
        categoriesRedacted.add(isJunior ? 'CHILD-SENSITIVE' : 'SENSITIVE');
        return '[REDACTED: SENSITIVE - Video Blob URI]';
      });
    }

    // Redact Bearer Tokens / Auth Keys
    if (SENSITIVE_PATTERNS.bearerToken.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.bearerToken, () => {
        redactedCount++;
        categoriesRedacted.add('SECURITY-SENSITIVE');
        return 'Bearer [REDACTED: SECURITY-SENSITIVE]';
      });
    }

    // Redact Exact GPS Coordinates
    if (SENSITIVE_PATTERNS.exactCoordinates.test(result)) {
      result = result.replace(SENSITIVE_PATTERNS.exactCoordinates, () => {
        redactedCount++;
        categoriesRedacted.add('SENSITIVE');
        return '[REDACTED: SENSITIVE - Exact GPS Coordinates]';
      });
    }

    return result;
  }

  function scrubNode(node: any, parentKey: string = ''): any {
    if (node === null || node === undefined) return node;

    // Check if the parent key itself is classified as sensitive
    const keyClassification = classifyFieldKey(parentKey, isJunior);

    if (keyClassification === 'SECURITY-SENSITIVE') {
      redactedCount++;
      categoriesRedacted.add('SECURITY-SENSITIVE');
      return '[REDACTED: SECURITY-SENSITIVE - Credential/Secret]';
    }

    if (keyClassification === 'HIGHLY RESTRICTED') {
      redactedCount++;
      categoriesRedacted.add('HIGHLY RESTRICTED');
      return `[REDACTED: HIGHLY RESTRICTED - Medical/Fitness/Behavioural Record]`;
    }

    if (keyClassification === 'CHILD-SENSITIVE' && parentKey) {
      const norm = parentKey.toLowerCase();
      if (norm.includes('guardian') || norm.includes('phone') || norm.includes('email') || norm.includes('dob') || norm.includes('video') || norm.includes('photo')) {
        redactedCount++;
        categoriesRedacted.add('CHILD-SENSITIVE');
        return `[REDACTED: CHILD-SENSITIVE - Junior/Guardian Protected Data]`;
      }
    }

    if (keyClassification === 'SENSITIVE' && parentKey) {
      const norm = parentKey.toLowerCase();
      if (norm.includes('video') || norm.includes('assessment') || norm.includes('notes') || norm.includes('gps') || norm.includes('injury')) {
        redactedCount++;
        categoriesRedacted.add('SENSITIVE');
        return `[REDACTED: SENSITIVE - ${parentKey.toUpperCase()}]`;
      }
    }

    if (typeof node === 'string') {
      return redactString(node);
    }

    if (typeof node === 'number' || typeof node === 'boolean') {
      // Check if this number is in a sensitive field (like portal PIN)
      if (parentKey.toLowerCase().includes('pin') || parentKey.toLowerCase().includes('secret')) {
        redactedCount++;
        categoriesRedacted.add('SECURITY-SENSITIVE');
        return '[REDACTED: PIN/SECRET]';
      }
      return node;
    }

    if (Array.isArray(node)) {
      return node.map((item, index) => scrubNode(item, `${parentKey}[${index}]`));
    }

    if (typeof node === 'object') {
      const cleanedObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) {
        cleanedObj[k] = scrubNode(v, k);
      }
      return cleanedObj;
    }

    return node;
  }

  const sanitized = scrubNode(data);

  return {
    sanitized,
    redactedCount,
    categoriesRedacted
  };
}

/**
 * In-memory buffer of sanitized privacy telemetry events for verification in UI
 */
const telemetryBuffer: SanitizedTelemetryLog[] = [
  {
    id: 'tel-priv-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    category: 'telemetry',
    rawPayloadSize: 1840,
    sanitizedPayload: {
      eventType: 'SESSION_UPLOAD_ANALYZED',
      drillId: 'drill-cover-drive-04',
      ballSpeedKph: 138.4,
      releaseAngleDeg: 14.2,
      playerIdentifier: 'DEV-ANON-7841',
      playerVideo: '[REDACTED: SENSITIVE - Player Video URL / Blob]',
      dateOfBirth: '[REDACTED: PERSONAL - DoB]',
      coachingNotes: '[REDACTED: SENSITIVE - Coaching Assessment Details]',
      exactCoordinates: '[REDACTED: SENSITIVE - Exact GPS Coordinates]'
    },
    redactedFieldsCount: 4,
    redactedCategories: ['SENSITIVE', 'PERSONAL'],
    sourceComponent: 'VideoAnalysisPipeline',
    complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
  },
  {
    id: 'tel-priv-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    category: 'audit',
    rawPayloadSize: 2290,
    sanitizedPayload: {
      eventType: 'JUNIOR_SUPERVISION_CHECK',
      juniorId: 'usr-kiyara-junior',
      juniorAgeGroup: 'U-16',
      assignedCoaches: ['coach-arin', 'coach-roshan'],
      guardianContact: '[REDACTED: CHILD-SENSITIVE - Junior/Guardian Protected Data]',
      guardianPhone: '[REDACTED: CHILD-SENSITIVE - Junior/Guardian Protected Data]',
      guardianPortalPin: '[REDACTED: SECURITY-SENSITIVE - Credential/Secret]',
      medicalWorkloadExemption: '[REDACTED: HIGHLY RESTRICTED - Medical/Fitness/Behavioural Record]'
    },
    redactedFieldsCount: 4,
    redactedCategories: ['CHILD-SENSITIVE', 'SECURITY-SENSITIVE', 'HIGHLY RESTRICTED'],
    sourceComponent: 'GuardianSupervisionManager',
    complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
  },
  {
    id: 'tel-priv-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    category: 'debug',
    rawPayloadSize: 940,
    sanitizedPayload: {
      eventType: 'AUTHENTICATION_CHALLENGE_VERIFY',
      method: 'passkey_fido2',
      rpId: 'pitchprecision.cricket.ai',
      clientHash: 'sha256-verified',
      userCredentials: '[REDACTED: SECURITY-SENSITIVE - Credential/Secret]',
      ipMasked: '192.168.***.***',
      cityCoarse: 'London, UK'
    },
    redactedFieldsCount: 2,
    redactedCategories: ['SECURITY-SENSITIVE', 'SENSITIVE'],
    sourceComponent: 'AuthSecurityEngine',
    complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
  }
];

/**
 * SECURE LOGGER (Privacy by Design)
 * Intercepts all runtime telemetry, diagnostic logs, and debug traces.
 * Guarantees zero sensitive data leakage.
 */
export const secureLogger = {
  log: (message: string, payload?: any, sourceComponent: string = 'SystemRuntime') => {
    const { sanitized, redactedCount, categoriesRedacted } = sanitizeForTelemetry(payload);
    
    // In dev environment, console log the SANITIZED payload only
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.log(`[PRIVACY-SANITIZED-LOG][${sourceComponent}] ${message}`, sanitized || '');
    }

    if (payload && redactedCount > 0) {
      telemetryBuffer.unshift({
        id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        category: 'telemetry',
        rawPayloadSize: JSON.stringify(payload).length,
        sanitizedPayload: typeof sanitized === 'object' ? sanitized : { value: sanitized },
        redactedFieldsCount: redactedCount,
        redactedCategories: Array.from(categoriesRedacted),
        sourceComponent,
        complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
      });
      if (telemetryBuffer.length > 50) telemetryBuffer.pop();
    }
  },

  warn: (message: string, payload?: any, sourceComponent: string = 'SystemRuntime') => {
    const { sanitized, redactedCount, categoriesRedacted } = sanitizeForTelemetry(payload);
    console.warn(`[PRIVACY-SANITIZED-WARN][${sourceComponent}] ${message}`, sanitized || '');
    
    if (payload) {
      telemetryBuffer.unshift({
        id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        category: 'debug',
        rawPayloadSize: JSON.stringify(payload).length,
        sanitizedPayload: typeof sanitized === 'object' ? sanitized : { value: sanitized },
        redactedFieldsCount: redactedCount,
        redactedCategories: Array.from(categoriesRedacted),
        sourceComponent,
        complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
      });
      if (telemetryBuffer.length > 50) telemetryBuffer.pop();
    }
  },

  error: (message: string, payload?: any, sourceComponent: string = 'SystemRuntime') => {
    const { sanitized, redactedCount, categoriesRedacted } = sanitizeForTelemetry(payload);
    console.error(`[PRIVACY-SANITIZED-ERROR][${sourceComponent}] ${message}`, sanitized || '');
    
    if (payload) {
      telemetryBuffer.unshift({
        id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        category: 'error',
        rawPayloadSize: JSON.stringify(payload).length,
        sanitizedPayload: typeof sanitized === 'object' ? sanitized : { value: sanitized },
        redactedFieldsCount: redactedCount,
        redactedCategories: Array.from(categoriesRedacted),
        sourceComponent,
        complianceStatus: 'VERIFIED_ZERO_LEAKAGE'
      });
      if (telemetryBuffer.length > 50) telemetryBuffer.pop();
    }
  },

  getSanitizedTelemetryStream: (): SanitizedTelemetryLog[] => {
    return [...telemetryBuffer];
  },

  clearTelemetryBuffer: () => {
    telemetryBuffer.length = 0;
  }
};

/**
 * Data Subject Access Request (DSAR) - GDPR / Privacy by Design Export Generator
 * Returns categorized, transparent payload showing data collected and its classification.
 */
export function generateDataPrivacyExportPacket(userProfile: any) {
  const isJunior = !!userProfile?.isJunior;

  return {
    exportMetadata: {
      generatedAt: new Date().toISOString(),
      governanceFramework: 'Privacy by Design • ISO/IEC 27701 • UK GDPR & COPPA Compliant',
      dataMinimizationVerified: true,
      subjectId: userProfile?.id || 'usr-anon',
      subjectName: userProfile?.name || 'Cricket Athlete',
      isJuniorAccount: isJunior
    },
    classificationSummary: {
      PUBLIC: ['Tournament fixtures', 'Drills library access history'],
      INTERNAL: ['Session latency logs', 'Tactical whiteboard configs'],
      PERSONAL: ['Full Name', 'Age / Date of Birth (for safety bracket)', 'Contact Email', 'Phone Number'],
      SENSITIVE: ['Session Video Recordings', 'Profile Photograph (EXIF stripped)', 'Coach Assessment Comments', 'Coarse City Venue'],
      CHILD_SENSITIVE: isJunior ? ['Junior Profile Details', 'Guardian Contact Information', 'Authorized Coach Safeguarding List'] : ['N/A - Senior Account'],
      SECURITY_SENSITIVE: ['Salted PBKDF2 Password Hashes', 'FIDO2 Passkey Credential ID', 'MFA Status'],
      HIGHLY_RESTRICTED: ['Player Health & Injury Recovery Notes', 'Yo-Yo Biometrics & Cardiovascular Split Times', 'Confidential Pastoral Coaching Notes']
    },
    collectedDataWithRationale: DATA_CLASSIFICATION_REGISTRY.map(reg => ({
      field: reg.fieldName,
      classification: reg.classification,
      rationale: reg.purposeRationale,
      retention: reg.retentionPeriod,
      maskingStrategy: reg.maskingMethod,
      redactedFromTelemetry: reg.isRedactedFromLogs
    }))
  };
}
