// Step 5: TestFlight & Google Play Internal Testing Beta Group & Workflow Engine

export interface BetaTester {
  id: string;
  name: string;
  role: 'ADULT_PLAYER' | 'JUNIOR_PLAYER' | 'PARENT_GUARDIAN' | 'COACH' | 'CLUB_ADMIN';
  email: string;
  age?: number;
  club: string;
  linkedGuardianId?: string;
  linkedPlayerIds?: string[];
  platform: 'iOS_TESTFLIGHT' | 'GOOGLE_PLAY_INTERNAL' | 'DUAL_PLATFORM';
  deviceModel: string;
  osVersion: string;
  buildTrack: 'iOS TestFlight v1.0.0 (42)' | 'Google Play Internal v1.0.0 (10042)';
  inviteStatus: 'ACTIVE_TESTING' | 'INVITE_ACCEPTED' | 'PENDING_INSTALL';
  lastActiveSession: string;
  feedbackSubmitted: number;
  crashesReported: number;
  avatarBg: string;
  bio: string;
}

export const INITIAL_BETA_GROUP: BetaTester[] = [
  // 3 Adult Players
  {
    id: 'tester-adult-1',
    name: 'Liam Vance',
    role: 'ADULT_PLAYER',
    email: 'liam.vance@londoncricket.co.uk',
    age: 24,
    club: 'Marylebone Premier CC',
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPhone 16 Pro Max',
    osVersion: 'iOS 18.1',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '14 mins ago',
    feedbackSubmitted: 3,
    crashesReported: 0,
    avatarBg: '#3b82f6',
    bio: 'Premier 1st XI opening fast bowler testing 145 km/h high-speed frame capture.'
  },
  {
    id: 'tester-adult-2',
    name: 'Sophie Taylor',
    role: 'ADULT_PLAYER',
    email: 'sophie.taylor@surreycricket.org',
    age: 22,
    club: 'Surrey Women Elite Academy',
    platform: 'GOOGLE_PLAY_INTERNAL',
    deviceModel: 'Google Pixel 9 Pro',
    osVersion: 'Android 15',
    buildTrack: 'Google Play Internal v1.0.0 (10042)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '42 mins ago',
    feedbackSubmitted: 2,
    crashesReported: 0,
    avatarBg: '#ec4899',
    bio: 'All-rounder testing pitch map length grouping and bat impact acoustic detection.'
  },
  {
    id: 'tester-adult-3',
    name: 'Rashid Khanani',
    role: 'ADULT_PLAYER',
    email: 'rashid.k@birminghamcricket.net',
    age: 27,
    club: 'Edgbaston CC',
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPhone 15 Pro',
    osVersion: 'iOS 17.6',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '2 hours ago',
    feedbackSubmitted: 1,
    crashesReported: 0,
    avatarBg: '#10b981',
    bio: 'Right-arm leg spinner testing wrist deviation angles and bounce telemetry.'
  },

  // 3 Junior Players (under 16)
  {
    id: 'tester-junior-1',
    name: 'Aarav Sharma',
    role: 'JUNIOR_PLAYER',
    email: 'aarav.sharma.junior@pitchbeta.app',
    age: 14,
    club: 'North London Youth Academy (U15)',
    linkedGuardianId: 'tester-parent-1',
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPhone 14',
    osVersion: 'iOS 17.5',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '8 mins ago',
    feedbackSubmitted: 4,
    crashesReported: 0,
    avatarBg: '#f59e0b',
    bio: 'U15 junior opening bowler. Requires guardian co-sign for coach video sharing.'
  },
  {
    id: 'tester-junior-2',
    name: 'Chloe Bennett',
    role: 'JUNIOR_PLAYER',
    email: 'chloe.bennett.junior@pitchbeta.app',
    age: 13,
    club: 'Middlesex Girls U14 Academy',
    linkedGuardianId: 'tester-parent-2',
    platform: 'GOOGLE_PLAY_INTERNAL',
    deviceModel: 'Samsung Galaxy S24',
    osVersion: 'Android 14 (OneUI 6.1)',
    buildTrack: 'Google Play Internal v1.0.0 (10042)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '1 hour ago',
    feedbackSubmitted: 2,
    crashesReported: 0,
    avatarBg: '#8b5cf6',
    bio: 'U14 junior batter & medium pacer. Guardian consent verified via SMS OTP.'
  },
  {
    id: 'tester-junior-3',
    name: 'Leo Miller',
    role: 'JUNIOR_PLAYER',
    email: 'leo.miller.junior@pitchbeta.app',
    age: 12,
    club: 'Kent Junior Cricket Club (U13)',
    linkedGuardianId: 'tester-parent-1',
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPad Air (5th Gen)',
    osVersion: 'iPadOS 17.6',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '3 hours ago',
    feedbackSubmitted: 1,
    crashesReported: 0,
    avatarBg: '#06b6d4',
    bio: 'U13 junior spin bowler. Supervised under parent Priya Sharma profile.'
  },

  // 2 Parents / Guardians
  {
    id: 'tester-parent-1',
    name: 'Priya Sharma (Guardian)',
    role: 'PARENT_GUARDIAN',
    email: 'priya.sharma@sharmafamily.org',
    club: 'North London Youth Academy (Parent Liaison)',
    linkedPlayerIds: ['tester-junior-1', 'tester-junior-3'],
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPhone 15',
    osVersion: 'iOS 18.0',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '5 mins ago',
    feedbackSubmitted: 3,
    crashesReported: 0,
    avatarBg: '#14b8a6',
    bio: 'Verified parent of Aarav & Leo. Tests guardian approval alerts and instant coach revocation.'
  },
  {
    id: 'tester-parent-2',
    name: 'Mark Bennett (Guardian)',
    role: 'PARENT_GUARDIAN',
    email: 'mark.bennett@bennettconsulting.co.uk',
    club: 'Middlesex Girls Academy (Parent Advisory)',
    linkedPlayerIds: ['tester-junior-2'],
    platform: 'GOOGLE_PLAY_INTERNAL',
    deviceModel: 'Google Pixel 8',
    osVersion: 'Android 14',
    buildTrack: 'Google Play Internal v1.0.0 (10042)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '25 mins ago',
    feedbackSubmitted: 2,
    crashesReported: 0,
    avatarBg: '#64748b',
    bio: 'Verified legal guardian of Chloe. Validates COPPA privacy declarations and deletion controls.'
  },

  // 2 Coaches
  {
    id: 'tester-coach-1',
    name: 'Coach David Miller',
    role: 'COACH',
    email: 'david.miller@ecbcoaches.org.uk',
    club: 'North London & Middlesex High Performance',
    platform: 'DUAL_PLATFORM',
    deviceModel: 'iPad Pro 13" (M4) & Pixel 9 Pro',
    osVersion: 'iPadOS 18.1 / Android 15',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: 'Just now',
    feedbackSubmitted: 6,
    crashesReported: 0,
    avatarBg: '#c3f400',
    bio: 'ECB Level 3 High Performance Coach. Validates slow-motion telestrator and ReBAC signed video URLs.'
  },
  {
    id: 'tester-coach-2',
    name: 'Coach Sarah Jenkins',
    role: 'COACH',
    email: 'sarah.jenkins@surreycricket.org',
    club: 'Surrey Youth Pathway & Women Academy',
    platform: 'iOS_TESTFLIGHT',
    deviceModel: 'iPhone 16 Pro',
    osVersion: 'iOS 18.1',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: '18 mins ago',
    feedbackSubmitted: 5,
    crashesReported: 0,
    avatarBg: '#84cc16',
    bio: 'ECB Level 2 Fast Bowling Coach. Tests front-knee bracing and release height overlay telemetry.'
  },

  // 1 Club Administrator
  {
    id: 'tester-admin-1',
    name: 'Marcus Vance',
    role: 'CLUB_ADMIN',
    email: 'marcus.vance@londoncricket.co.uk',
    club: 'London & Home Counties Cricket Association',
    platform: 'DUAL_PLATFORM',
    deviceModel: 'MacBook Pro / iPhone 16 Pro',
    osVersion: 'iOS 18.1 / Web Console',
    buildTrack: 'iOS TestFlight v1.0.0 (42)',
    inviteStatus: 'ACTIVE_TESTING',
    lastActiveSession: 'Just now',
    feedbackSubmitted: 4,
    crashesReported: 0,
    avatarBg: '#e11d48',
    bio: 'Academy Director & Designated Safeguarding Lead (DSL). Audits ReBAC access logs and COPPA co-signs.'
  }
];

export interface WorkflowStepLog {
  stepNumber: number;
  actorName: string;
  actorRole: string;
  actionTitle: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  timestamp: string;
  details: string;
  payloadSummary: Record<string, any>;
  verificationBadge: string;
}

export const WORKFLOW_STAGES = [
  {
    stage: 1,
    title: 'Junior Player Delivery Recording',
    actor: 'Aarav Sharma (14yo Junior Bowler)',
    role: 'JUNIOR_PLAYER',
    description: 'Aarav records a 6-ball bowling spell at 128.4 km/h with 17-point pose telemetry. Video is saved locally in private sandbox.'
  },
  {
    stage: 2,
    title: 'Coach Review Request & Safeguarding Gate',
    actor: 'Aarav Sharma -> System Gate',
    role: 'JUNIOR_PLAYER',
    description: 'Aarav taps "Request Coach Review" with Coach David Miller. System detects junior status (<16) and blocks direct transfer, dispatching Guardian Consent Request to Priya Sharma.'
  },
  {
    stage: 3,
    title: 'Parent / Guardian Safeguarding Co-Sign',
    actor: 'Priya Sharma (Verified Guardian)',
    role: 'PARENT_GUARDIAN',
    description: 'Priya opens push notification, inspects video privacy badge, verifies Coach David Miller credentials, and approves 30-day coaching relationship with cryptographic co-sign.'
  },
  {
    stage: 4,
    title: 'Coach ReBAC Authorized Video Analysis & Telestrator',
    actor: 'Coach David Miller (ECB Level 3)',
    role: 'COACH',
    description: 'Coach Miller receives authenticated grant, fetches 15-minute expiring signed URL, scrubs 240fps slow-motion frame, draws angle lines on front-knee bracing, and attaches voice/text drill feedback.'
  },
  {
    stage: 5,
    title: 'Dual Notification & Delivery to Junior + Parent',
    actor: 'System Multi-Cast',
    role: 'SYSTEM',
    description: 'Coaching review is delivered simultaneously to Aarav (player) and Priya (guardian). Zero public exposure; unlinked coaches cannot access.'
  },
  {
    stage: 6,
    title: 'Club Administrator Compliance & Safeguarding Audit',
    actor: 'Marcus Vance (Safeguarding Director)',
    role: 'CLUB_ADMIN',
    description: 'Admin audits the complete immutable event ledger: verifies valid guardian consent timestamp, confirms bucket isolation, and checks bowling load safety.'
  }
];

export const TESTFLIGHT_TRACK_DETAILS = {
  appStoreConnectAppId: '6478901234',
  bundleId: 'com.pitchprecision.cricket.ios',
  version: '1.0.0',
  buildNumber: '42',
  releasedAt: '2026-09-03T05:30:00Z',
  expirationDate: '2026-12-02T05:30:00Z (90 days)',
  minOS: 'iOS 16.0 / iPadOS 16.0',
  activeInstallCount: 8,
  totalInvites: 8,
  crashFreeSessionRate: '100.0%',
  fastlaneCommand: 'fastlane ios beta --track testflight',
  testflightPublicLink: 'https://testflight.apple.com/join/PitchPrecBeta2026',
  whatsNewInThisBuild: 'First genuine mobile release with full ReBAC video security gate, junior guardian co-sign, and 17-point bowling radar.'
};

export const PLAYSTORE_INTERNAL_TRACK_DETAILS = {
  packageId: 'com.pitchprecision.cricket.android',
  versionName: '1.0.0',
  versionCode: 10042,
  trackType: 'Closed Internal Testing (Email List)',
  targetSdk: 'API 35 (Android 15)',
  minSdk: 'API 29 (Android 10)',
  activeInstallCount: 3,
  totalInvites: 3,
  aabSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  playConsoleUrl: 'https://play.google.com/apps/internaltest/pitchprecision-cricket',
  distributionList: 'cricket-beta-safeguarding@pitchprecision.app'
};
