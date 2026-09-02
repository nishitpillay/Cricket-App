export type ScreenType = 
  | 'home' 
  | 'record' 
  | 'video-analysis'
  | 'stats' 
  | 'drills' 
  | 'drills-vault'
  | 'academy'
  | 'scenarios'
  | 'masterclasses'
  | 'planner'
  | 'chalkboard'
  | 'feedback' 
  | 'drill-details' 
  | 'drill-practice' 
  | 'auth-player' 
  | 'auth-coach' 
  | 'auth-admin'
  | 'security-settings'
  | 'privacy-governance'
  | 'encryption-governance'
  | 'mobile-security';

export type MASVSDomain = 
  | 'MASVS-STORAGE'
  | 'MASVS-CRYPTO'
  | 'MASVS-AUTH'
  | 'MASVS-NETWORK'
  | 'MASVS-PLATFORM'
  | 'MASVS-CODE'
  | 'MASVS-RESILIENCE'
  | 'MASVS-DATA-INGESTION';

export interface MASVSCheckItem {
  id: string;
  domain: MASVSDomain;
  title: string;
  threatTarget: string;
  status: 'COMPLIANT' | 'ACTIVE_SHIELD' | 'WARNING' | 'CRITICAL';
  verificationLevel: 'MASVS-L1' | 'MASVS-L2' | 'MASVS-R';
  mitigationEngine: string;
  technicalEvidence: string;
  targetPlatform: 'iOS & Android' | 'iOS (Keychain/Secure Enclave)' | 'Android (Keystore/EncryptedSP)';
}

export interface SecureStorageEntry {
  key: string;
  storageTarget: 'iOS_KEYCHAIN' | 'ANDROID_KEYSTORE_ENCRYPTED_SP' | 'BLOCKED_PLAINTEXT_PREFS';
  accessControl: string;
  hardwareBacked: boolean;
  biometricBound: boolean;
  encryptedDataB64: string;
  updatedAt: string;
  classification: DataClassificationLevel;
}

export interface DeepLinkValidationResult {
  url: string;
  isValid: boolean;
  scheme: string;
  host: string;
  path: string;
  intentAction?: string;
  securityVerdict: 'AUTHORIZED_UNIVERSAL_LINK' | 'BLOCKED_UNVALIDATED_SCHEME' | 'MALICIOUS_PARAM_INJECTION';
  details: string;
}

export interface DeviceIntegrityCheck {
  checkName: string;
  category: 'ROOT_DETECTION' | 'JAILBREAK_DETECTION' | 'HOOKING_FRAMEWORK' | 'DEBUGGER_DETECTION' | 'SYSTEM_TAMPER';
  passed: boolean;
  threatIndicator: string;
  remediationAction: string;
}

export interface FileUploadScanResult {
  fileName: string;
  fileSizeBytes: number;
  detectedMimeType: string;
  declaredMimeType: string;
  magicBytesHex: string;
  status: 'CLEAN_VERIFIED' | 'REJECTED_POLYGLOT' | 'BLOCKED_MALICIOUS_EXTENSION' | 'CORRUPTED_STREAM';
  exifScrubbed: boolean;
  details: string;
}

export type DataClassificationLevel = 
  | 'PUBLIC'
  | 'INTERNAL'
  | 'PERSONAL'
  | 'SENSITIVE'
  | 'CHILD-SENSITIVE'
  | 'SECURITY-SENSITIVE'
  | 'HIGHLY RESTRICTED';

export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'RSA-OAEP-4096';
export type KeyState = 'PRIMARY_ACTIVE' | 'ACTIVE_READ_ONLY' | 'DEPRECATED' | 'SCHEDULED_FOR_DESTRUCTION';
export type CloudKmsProvider = 'GOOGLE_CLOUD_KMS' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'HASHICORP_VAULT';

export interface KMSKeyVersion {
  versionId: string;
  versionNumber: number;
  state: KeyState;
  algorithm: string;
  protectionLevel: 'HSM_FIPS_140_2_L3' | 'SOFTWARE';
  createdAt: string;
  primarySince?: string;
  rotationIntervalDays: number;
  nextScheduledRotation: string;
  totalRecordsEncrypted: number;
}

export interface KMSKeyRing {
  keyRingId: string;
  resourceArn: string;
  provider: CloudKmsProvider;
  region: string;
  primaryKeyId: string;
  activeVersion: number;
  versions: KMSKeyVersion[];
  autoRotationEnabled: boolean;
  rotationPeriodDays: number;
  managedHsm: boolean;
}

export interface EncryptedFieldEnvelope {
  keyVersion: number;
  algorithm: EncryptionAlgorithm;
  ivB64: string;
  authTagB64: string;
  encryptedDekB64: string; // Wrapped Data Encryption Key under KMS KEK
  ciphertextB64: string;
  kmsKeyUri: string;
  encryptedAt: string;
}

export interface MobileSecurityAuditItem {
  id: string;
  ruleCategory: 'DATABASE_CREDENTIALS' | 'SERVICE_ACCOUNT_SECRETS' | 'PRIVATE_API_SECRETS' | 'PRODUCTION_ENCRYPTION_KEYS' | 'ADMINISTRATIVE_CREDENTIALS';
  ruleDescription: string;
  compliant: boolean;
  detectedThreatCount: number;
  enforcementMethod: string;
  verificationEvidence: string;
  severity: 'CRITICAL_BLOCKER' | 'HIGH';
}

export interface TransitSecurityStatus {
  tlsVersion: 'TLS 1.3' | 'TLS 1.2' | 'TLS 1.1 (DEPRECATED)' | 'PLAINTEXT (BLOCKED)';
  cipherSuite: string;
  forwardSecrecy: boolean;
  hstsEnforced: boolean;
  hstsPreloadApproved: boolean;
  hstsMaxAgeSeconds: number;
  httpFallbackPermitted: boolean;
  alpnProtocols: string[];
  certIssuer: string;
  certValidityDaysRemaining: number;
}

export interface DataFieldClassification {
  fieldName: string;
  category: string;
  classification: DataClassificationLevel;
  requiredForService: boolean;
  purposeRationale: string;
  retentionPeriod: string;
  maskingMethod: string;
  isRedactedFromLogs: boolean;
  examples: string[];
}

export interface SanitizedTelemetryLog {
  id: string;
  timestamp: string;
  category: 'telemetry' | 'analytics' | 'debug' | 'audit' | 'error';
  rawPayloadSize: number;
  sanitizedPayload: Record<string, any>;
  redactedFieldsCount: number;
  redactedCategories: DataClassificationLevel[];
  sourceComponent: string;
  complianceStatus: 'VERIFIED_ZERO_LEAKAGE' | 'FILTERED_SENSITIVE';
}

export interface DataPrivacySettings {
  privacyByDesignEnforced: boolean;
  dataMinimizationActive: boolean;
  autoExifStripping: boolean;
  strictChildProtectionActive: boolean;
  analyticsRedactionLevel: 'FULL_ANONYMIZED' | 'PSEUDONYMIZED' | 'ZERO_TELEMETRY';
  videoRetentionDays: number;
  healthDataRestrictedToPlayerAndGuardian: boolean;
  coachBehavioralNotesEncrypted: boolean;
}

export type UserRole = 
  | 'player' 
  | 'coach' 
  | 'club_admin' 
  | 'platform_admin' 
  | 'security_admin' 
  | 'admin';

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  ipAddressMasked: string;
  locationCity: string;
  lastActive: string;
  isCurrentSession: boolean;
  createdAt: string;
  mfaVerified: boolean;
}

export interface SecuritySettings {
  mfaEnforced: boolean;
  mfaEnabled: boolean;
  mfaMethod: 'authenticator_app' | 'passkey' | 'sms' | 'email_otp';
  passkeysRegistered: Array<{
    id: string;
    name: string;
    createdDate: string;
    lastUsed: string;
    authenticatorType: string;
  }>;
  emailVerified: boolean;
  twoFactorBackupCodesRemaining: number;
  suspiciousLoginAlerts: boolean;
  recentSecurityEvents: Array<{
    id: string;
    timestamp: string;
    type: 'login_success' | 'mfa_challenge' | 'failed_login_lockout' | 'password_reset_requested' | 'session_terminated' | 'passkey_registered';
    details: string;
    location: string;
    status: 'success' | 'flagged' | 'blocked';
  }>;
}

export interface PlayerCricketProfile {
  name: string;
  age: number;
  dateOfBirth: string; // YYYY-MM-DD
  playingStyle: 'Aggressive / Dominant' | 'Classical & Technical' | 'Anchor / Accumulator' | 'Power Hitter / Finisher' | 'Innovative / 360-Degree';
  primaryCategory: 'Batter' | 'Bowler' | 'Fielder / Wicket-Keeper' | 'All-Rounder';
  
  // Batting Breakdown
  battingDetails: {
    handedness: 'Right-Hand Bat' | 'Left-Hand Bat';
    orderPosition: 'Opening Batsman (1-2)' | 'Top-Order (No. 3)' | 'Middle-Order (4-5)' | 'Lower-Middle / Finisher (6-7)' | 'Tail-Ender (8-11)';
    keyStrengths: string[];
    favoriteShots?: string;
  };

  // Bowling Breakdown
  bowlingDetails?: {
    speedCategory: 'Fast Bowler (140+ kph)' | 'Fast-Medium Pacer (125-140 kph)' | 'Medium Pacer & Seamer (110-125 kph)' | 'Spin Bowler' | 'Non-Bowler';
    techniqueStyle: 
      | 'Right-Arm Fast / Express'
      | 'Left-Arm Fast / Inswing Seam'
      | 'Right-Arm Fast-Medium Outswing'
      | 'Left-Arm Medium-Fast Swing'
      | 'Right-Arm Off-Spin (Finger Spin & Doosra)'
      | 'Right-Arm Leg-Spin (Wrist Spin & Googly)'
      | 'Left-Arm Orthodox (Finger Spin & Arm Ball)'
      | 'Left-Arm Unorthodox / Chinaman (Wrist Spin)'
      | 'Part-Time Medium / Seam';
    tacticalRole: 'New Ball Strike Bowler' | 'First Change Seamer' | 'Middle Overs Strangler' | 'Death Overs Yorker Specialist';
    stockDelivery?: string;
  };

  fieldingPosition?: string;
  googleConnected?: boolean;
  isJunior?: boolean;
  guardianInfo?: GuardianInformation;
  juniorPrivacy?: JuniorPrivacyGuardrails;
}

export interface GuardianInformation {
  guardianName: string;
  guardianEmail: string;
  guardianPhone?: string;
  relationship: 'Parent' | 'Legal Guardian' | 'Designated Club Safeguarding Lead';
  consentStatus: 'verified' | 'pending' | 'revoked';
  consentGrantedAt?: string;
  consentVerificationToken?: string;
  guardianPortalPin?: string;
  supervisionEnabled: boolean;
  ccAllCoachCommunications: boolean; // Automatically CC parent on all coach feedback/drills/videos
  notifyOnSessionUpload: boolean;
}

export interface JuniorPrivacyGuardrails {
  isJunior: boolean; // true if age < 18
  hideExactLocation: boolean; // Strict suppression of exact GPS / residential coordinates
  disablePublicDiscovery: boolean; // Not searchable by strangers
  allowOnlyAssignedCoaches: boolean; // Only verified approved coaches can interact
  blockDirectMessaging: boolean; // Direct 1-on-1 social DMs blocked
  disablePublicComments: boolean; // Unrestricted comments on videos blocked
  stripExifMetadata: boolean; // All photo/video EXIF metadata stripped
  videoPrivacyLevel: 'private-guardian-coach-only' | 'club-squad-only';
  assignedCoachIds: string[]; // List of coach IDs authorized by guardian
}

export type SafeguardingReportCategory = 
  | 'inappropriate_behaviour'
  | 'bullying'
  | 'harassment'
  | 'grooming_concern'
  | 'inappropriate_coaching_communication'
  | 'suspicious_account_activity'
  | 'unauthorised_contact';

export interface SafeguardingIncidentReport {
  id: string;
  reportedByUserId: string;
  reportedByRole: UserRole | 'guardian';
  targetUserId?: string;
  targetUserName?: string;
  targetUserRole?: UserRole;
  category: SafeguardingReportCategory;
  description: string;
  timestamp: string;
  status: 'under_review' | 'quarantined' | 'investigating' | 'resolved';
  caseReferenceNumber: string;
  emergencyEscalated: boolean;
  guardianNotified: boolean;
  actionTaken?: string;
}

export interface SafeguardingAuditLog {
  id: string;
  timestamp: string;
  actionType: 
    | 'coach_feedback_sent' 
    | 'video_analyzed' 
    | 'guardian_consent_verified' 
    | 'coach_access_granted' 
    | 'coach_access_revoked' 
    | 'incident_reported' 
    | 'user_blocked' 
    | 'exif_stripped';
  actorName: string;
  actorRole: string;
  details: string;
  juniorUserId: string;
  guardianCcDelivered: boolean;
}

export interface CoachHistoricalRecord {
  organizationOrTeam: string;
  role: string;
  years: string;
  notableAchievements: string;
}

export interface CoachCricketProfile {
  name: string;
  specialization: 
    | 'Batting Masterclass & Biomechanics'
    | 'Fast Bowling Pace & Seam Mechanics'
    | 'Spin Bowling Artistry & Deception'
    | 'Wicket-Keeping & Fielding Elite'
    | 'Tactical Match Strategy & Analytics'
    | 'Head Coach / High Performance Director';
  bioSummary: string; // Coaching philosophy & self-summary
  yearsOfExperience: number;
  accreditations: string[];
  coachingHistory: CoachHistoricalRecord[];
  historicStats: {
    winRatePct: number;
    trophiesWon: number;
    proPlayersDeveloped: number;
    matchesCoached: number;
  };
  googleConnected?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar: string;
  level: number;
  xpProgress: number; // 0 - 100
  tier: string;
  specialty: string;
  isJunior?: boolean;
  guardianInfo?: GuardianInformation;
  juniorPrivacy?: JuniorPrivacyGuardrails;
  blockedUserIds?: string[];
  securitySettings?: SecuritySettings;
  sessions?: UserSession[];
  playerProfile?: PlayerCricketProfile;
  coachProfile?: CoachCricketProfile;
}

export interface SessionRecord {
  id: string;
  title: string;
  type: 'Net Session' | 'Match Sim' | 'Live Match' | 'Masterclass';
  date: string;
  deliveriesCount?: number;
  duration?: string;
  score: number;
  topSpeed?: number;
  insight?: string;
  timing?: string;
  tagColor?: string;
}

export interface MatchStat {
  opponent: string;
  dateLocation: string;
  score: number;
  sparkline: number[];
  isPositive: boolean;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
}

export interface TechniqueScores {
  power: number;
  timing: number;
  placement: number;
  footwork: number;
}

export interface DrillItem {
  id: string;
  title: string;
  category: 'Batting' | 'Bowling' | 'Fielding' | 'Fitness' | 'Masterclass';
  subCategory?: 'Spin Bowling' | 'Fast Bowling' | 'Slip Fielding' | 'Power Hitting' | 'Wicketkeeping' | 'Ground Fielding';
  level: 'Beginner' | 'Int/Pro' | 'Pro' | 'Elite';
  duration: string;
  durationMinutes: number;
  coach: string;
  coachAvatar?: string;
  image: string;
  isDrillOfDay?: boolean;
  isNew?: boolean;
  isOfflineCached?: boolean;
  equipment?: string[];
  tags?: string[];
  progressPercent?: number;
  description: string;
  focusAreas: {
    title: string;
    description: string;
    icon: string;
  }[];
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  coachTip: string;
}

export interface TelestrationFeedback {
  id: string;
  sessionTitle: string;
  sessionDate: string;
  videoDuration: string;
  videoCurrentTime: string;
  videoProgress: number; // 0 - 100
  frameImage: string;
  coachName: string;
  coachAvatar: string;
  coreFocus: string;
  strengths: string[];
  adjustments: string[];
  assignedDrillId: string;
  assignedDrillTitle: string;
  assignedDrillSets: string;
}

// ----------------------
// NEW TYPES FOR REQUESTED FEATURES
// ----------------------

export interface WagonWheelShot {
  id: string;
  angle: number; // 0 - 360 degrees (0 = straight down ground, 90 = cover/point offside, 270 = square leg/midwicket legside)
  distance: number; // 0 - 100% of boundary
  runs: 0 | 1 | 2 | 3 | 4 | 6;
  shotType: 'Cover Drive' | 'Straight Drive' | 'Pull Shot' | 'Cut Shot' | 'Sweep' | 'Flick' | 'Upper Cut' | 'Slog Sweep' | 'Defensive';
  sector: 'Fine Leg' | 'Square Leg' | 'Mid Wicket' | 'Long On' | 'Long Off' | 'Cover' | 'Point' | 'Third Man';
  ballLength?: 'Full' | 'Good' | 'Short' | 'Yorker';
  date: string;
}

export interface PitchMapDelivery {
  id: string;
  x: number; // 0 to 100 (horizontal line across wickets: 0 = far outside off, 50 = middle stump, 100 = down leg)
  y: number; // 0 to 100 (vertical length: 0 = batting crease / yorker, 25 = full, 55 = good length, 80 = short, 100 = bouncer)
  length: 'Yorker' | 'Full' | 'Good Length' | 'Short' | 'Bouncer';
  line: 'Outside Off' | '4th Stump' | 'Off Stump' | 'Middle Stump' | 'Leg Stump' | 'Down Leg';
  speedKph: number;
  seamDeviationDeg?: number; // e.g. +2.4 deg outswing
  outcome: 'Dot' | 'Wicket' | 'Single' | 'Boundary' | 'Play & Miss' | 'Edge';
  isWicket?: boolean;
}

export interface ScenarioChoice {
  id: string;
  title: string;
  description: string;
  fieldSetup: string;
  deliveryType: string;
  riskReward: 'Safe' | 'Aggressive' | 'Tactical Gamble';
  scoreImpact: number; // out of 100
  coachVerdict: string;
  isOptimal: boolean;
  simulatedOutcome: {
    result: string;
    runsConcededOrScored: number;
    wicketChance: string;
    visualAnimation: string;
  };
}

export interface ScenarioItem {
  id: string;
  title: string;
  badge: string;
  format: 'T20 Death Overs' | 'Powerplay Blast' | 'Test Match Grunt' | 'Spin Web' | 'DLS Chase';
  matchContext: {
    requiredRuns?: number;
    oversRemaining?: number;
    wicketsLeft?: number;
    pitchCondition: string;
    weatherCondition?: string;
  };
  targetBatsman: {
    name: string;
    style: string;
    strengths: string[];
    weaknesses: string[];
  };
  problemStatement: string;
  choices: ScenarioChoice[];
}

export interface TacticalMasterclass {
  id: string;
  title: string;
  coach: string;
  coachRole: string;
  coachAvatar: string;
  badge: string;
  duration: string;
  overview: string;
  videoThumbnail: string;
  videoEmbedUrl?: string;
  keyTactics: {
    title: string;
    description: string;
    icon: string;
  }[];
  chapters: {
    timestamp: string;
    title: string;
    summary: string;
  }[];
  whiteboardTakeaway: string;
}

export interface TrainingPlanBlock {
  id: string;
  durationMinutes: number;
  phaseName: 'Dynamic Warm-up' | 'Biomechanics Focus' | 'Net Execution' | 'Match Pressure Scenario' | 'Cool Down & Recovery';
  activityTitle: string;
  description: string;
  equipment: string[];
  intensity: 'Low' | 'Medium' | 'High' | 'Max';
  icon: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  targetDurationMinutes: 30 | 45 | 60 | 90;
  skillFocus: 'Batting' | 'Fast Bowling' | 'Spin Bowling' | 'Fielding & Reflexes' | 'All-Rounder Match Prep';
  intensity: 'Medium' | 'High' | 'Elite';
  summary: string;
  blocks: TrainingPlanBlock[];
}

export interface FieldPlacementPreset {
  id: string;
  name: string;
  format: string;
  description: string;
  positions: {
    id: string;
    label: string;
    x: number; // 0 - 100 on 2D oval
    y: number; // 0 - 100 on 2D oval
    role: 'Slip' | 'Keeper' | 'Ring' | 'Boundary' | 'Close In' | 'Bowler';
  }[];
}

// ----------------------
// PLAYER HEALTH & READINESS TYPES
// ----------------------

export interface DailyHealthTrend {
  dayLabel: string; // e.g. "Mon", "Tue", "Wed"
  date: string; // "2026-08-26"
  restingHeartRate: number; // bpm
  hrvMs: number; // ms
  sleepHours: number; // hours
  sleepQualityScore: number; // 0 - 100
  workloadStrainAU: number; // Arbitrary Units (load)
  acwr: number; // Acute:Chronic Workload Ratio
  readinessScore: number; // 0 - 100
  bowlingBalls: number;
  soreness: number; // 1 - 10
}

export interface PlayerHealthRecord {
  id: string;
  playerName: string;
  specialty: string;
  avatar: string;
  
  // Resting Heart Rate & HRV
  restingHeartRate: number;
  baselineRhr: number;
  hrvMs: number;
  baselineHrv: number;
  
  // Sleep Quality & Stages
  sleepHours: number;
  sleepQualityScore: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  sleepEfficiencyPct: number;
  sleepDebtMinutes: number;
  
  // Workload & Intensity
  dailyWorkloadStrainAU: number;
  acuteWorkload7d: number;
  chronicWorkload28d: number;
  acwr: number;
  highSpeedRunningKm: number;
  bowlingDeliveriesCount: number;
  matchDurationMinutes: number;
  muscleSorenessScore: number; // 1-10
  
  // Readiness Index
  readinessScore: number; // 0-100
  readinessTier: 'OPTIMAL' | 'MODERATE' | 'FATIGUE WARNING' | 'OVERTRAINED';
  
  // 7-day historical telemetry
  sevenDayTrends: DailyHealthTrend[];
}

export interface AIRecoveryPlan {
  readinessScore: number;
  readinessTier: 'OPTIMAL' | 'MODERATE' | 'FATIGUE WARNING' | 'OVERTRAINED';
  readinessAssessment: string;
  workloadVerdict: string;
  injuryRiskIndex: string;
  prescribedTrainingAdaptation: {
    headline: string;
    maxBowlingOvers: string | number;
    highIntensitySprintsAllowed: boolean;
    recommendedDrills: string[];
    drillsToAvoid: string[];
  };
  nutritionHydrationProtocol: {
    waterIntakeLiters: number;
    electrolytesMg: string;
    keySupplements: string[];
    mealTimingAdvice: string;
  };
  activeRecoveryRoutine: {
    durationMinutes: number;
    modality: string;
    steps: {
      order: number;
      action: string;
      duration: string;
      rationale: string;
    }[];
  };
  sleepOptimization: {
    targetBedtime: string;
    sleepHygieneCues: string[];
  };
  coachSummary: string;
}

// ----------------------
// GOOGLE ACCOUNT & HEALTH / LOCATION INTEGRATION TYPES
// ----------------------

export interface GoogleAuthSession {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  scope: string;
  user: {
    id?: string;
    name: string;
    email: string;
    picture?: string;
  };
}

export interface GoogleFitnessData {
  lastSynced: string;
  restingHeartRate?: number;
  heartRateSamples?: { time: string; bpm: number }[];
  sleepSession?: {
    durationHours: number;
    deepSleepMinutes: number;
    remSleepMinutes: number;
    lightSleepMinutes: number;
    efficiencyScore: number;
  };
  activity?: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    distanceMeters: number;
  };
}

export interface GoogleCricketVenueLocation {
  venueName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  pitchType: 'Dry / Dust Bowl' | 'Green Seam' | 'Hard Bouncy' | 'Flat Deck' | 'Drop-In Pitch';
  weather?: {
    temperatureC: number;
    humidityPct: number;
    windSpeedKph: number;
    condition: string;
    airDensityKgM3: number;
    swingIndex: string; // e.g. "High Swing (Overcast + 78% Humidity)"
  };
}

