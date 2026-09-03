// Store Assets, Privacy Policies, Legal Declarations, and ASO Metadata for Pitch Precision

export interface StoreAssetSpec {
  name: string;
  platform: 'iOS' | 'Android' | 'Cross-Platform';
  dimensions: string;
  format: string;
  usage: string;
  required: boolean;
  notes: string;
}

export const STORE_IMAGE_ASSETS = {
  masterIcon: '/src/assets/images/app_master_icon_1788439224145.jpg',
  splashScreen: '/src/assets/images/app_splash_screen_1788439242414.jpg',
  appStoreMockup1: '/src/assets/images/appstore_mockup_1_1788439259597.jpg',
};

export const STORE_LISTING_METADATA = {
  appName: 'Pitch Precision: Cricket AI',
  subtitle: 'Biomechanical Radar & Pitch Map',
  bundleIdIOS: 'com.pitchprecision.cricket.ios',
  packageIdAndroid: 'com.pitchprecision.cricket.android',
  primaryCategory: 'Sports',
  secondaryCategory: 'Health & Fitness',
  
  promotionalText: 'Transform your cricket bowling and batting with real-time AI biomechanics, high-speed release radar, pitch zone tracking, and coach-guardian safeguarding.',
  
  shortDescriptionAndroid: 'AI cricket bowling radar, delivery pitch map, biomechanics & coach reviews.', // 78 chars (max 80)
  
  keywordsAppStore: 'cricket,bowling speed,pitch map,cricket coach,bowling action,biomechanics,radar gun,cricket drills,fast bowling,spin bowling', // 127 chars, comma-separated
  
  urls: {
    supportUrl: 'https://pitchprecision.app/support',
    marketingUrl: 'https://pitchprecision.app',
    privacyPolicyUrl: 'https://pitchprecision.app/privacy-policy',
    termsOfServiceUrl: 'https://pitchprecision.app/terms',
    accountDeletionUrl: 'https://pitchprecision.app/account/delete',
  },

  fullDescription: `Pitch Precision is the definitive cricket performance analytics and biomechanical intelligence platform designed for cricketers, coaches, academies, and parents.

Engineered with high-speed video computer vision and computer-aided ball tracking, Pitch Precision turns your smartphone into a professional-grade bowling radar and delivery mapping system without requiring expensive hardware or wearables.

KEY PERFORMANCE CAPABILITIES:
• AI Release Speed Radar: Measure instant release velocity (km/h & mph) with high-frame-rate acoustic and optical sensor fusion.
• Precision 22-Yard Pitch Heatmap: Automatic landing coordinates, line & length grouping, seam/spin deviation angles, and bounce trajectory.
• Biomechanical Action Analysis: 17-point skeletal pose tracking measuring front-knee bracing angle, shoulder counter-rotation, arm release height, and head stability.
• Coach-Athlete Video Pipeline: Cloud-synced delivery video breakdown with slow-motion scrub, synchronized angle comparison, and telestrator drawing tools.
• Multi-Session Fatigue & Load Tracking: Prevent lumbar stress fractures and bowling overuse injuries with delivery workload monitoring.

CHILD SAFEGUARDING & FAMILY PRIVACY (COPPA & GDPR-K COMPLIANT):
Pitch Precision is built from the ground up for youth academies and minor athletes:
• Parental Supervision & Co-Sign: Junior player accounts (under 16/13) require verified guardian linking.
• Zero Public Exposure: All video footage is stored in private-by-default cloud storage with Public Access Prevention enforced.
• Relationship-Based Access (ReBAC): Only accredited coaches with active guardian-approved relationships can view athlete video.
• Zero Ad Networks & Zero Data Brokers: We never sell athlete performance data or video telemetry.

COMPATIBILITY & HARDWARE:
• Compatible with iPhone & iPad (iOS 16.0+) and Android (API 29+).
• Optimized for 60fps, 120fps, and 240fps slow-motion camera recording.
• Cloud synchronization powered by secure Google Cloud infrastructure with Cloud KMS encryption.`,

  ageRating: {
    appleRating: '4+',
    appleReasons: ['No mature or suggestive content', 'No gambling or simulated betting', 'No unmoderated user chat', 'Family & Junior Sports Safe'],
    googleIARC: 'Everyone (PEGI 3, USK 0, ACB G)',
    familiesPolicyCompliant: true,
    coppaCompliant: true
  }
};

export const PERMISSION_STRINGS = {
  ios: [
    {
      key: 'NSCameraUsageDescription',
      name: 'Camera Permission',
      value: 'Pitch Precision requires camera access to record high-frame-rate bowling deliveries, calculate release speed, and detect 17-point biomechanical body pose angles during training sessions.'
    },
    {
      key: 'NSMicrophoneUsageDescription',
      name: 'Microphone Permission',
      value: 'Pitch Precision uses microphone audio to detect the acoustic ball-release snap and pitch-impact sound for millisecond-accurate delivery timing and speed synchronization.'
    },
    {
      key: 'NSPhotoLibraryUsageDescription',
      name: 'Photo Library Permission',
      value: 'Pitch Precision allows you to import existing cricket practice videos from your gallery for biomechanical breakdown and save annotated coaching clips.'
    },
    {
      key: 'NSLocationWhenInUseUsageDescription',
      name: 'Location (Optional/Regional)',
      value: 'Pitch Precision uses regional location to fetch local weather, wind direction, and pitch humidity conditions during outdoor net sessions.'
    }
  ],
  android: [
    {
      key: 'android.permission.CAMERA',
      name: 'Camera Access',
      rationale: 'Used exclusively during active session capture to record bowling/batting drills and compute optical release velocity and skeletal tracking.'
    },
    {
      key: 'android.permission.RECORD_AUDIO',
      name: 'Acoustic Sensor',
      rationale: 'Captures acoustic impact signatures (ball hitting bat/pitch) to calibrate delivery frame timestamps.'
    },
    {
      key: 'android.permission.READ_MEDIA_VIDEO',
      name: 'Media Video Storage',
      rationale: 'Enables importing existing training videos from device storage for local AI model inference.'
    }
  ]
};

export const APP_PRIVACY_NUTRITION_LABELS = {
  dataUsedToTrackYou: [
    {
      status: 'NONE',
      title: 'No Data Used for Tracking',
      description: 'Pitch Precision does NOT track users across third-party apps and websites for advertising or data broker purposes.'
    }
  ],
  dataLinkedToYou: [
    {
      category: 'User Content',
      types: ['Videos & Photos (Delivery recordings, drill clips)', 'Performance Data (Bowling speed, pitch coordinates, biomechanical angles)'],
      purposes: ['App Functionality', 'Performance Analytics', 'Coaching Feedback']
    },
    {
      category: 'Contact Info & Identifiers',
      types: ['Name / Display Name', 'Email Address', 'User Account ID'],
      purposes: ['Account Authentication', 'Guardian Consent Verification', 'Security Audit Logging']
    },
    {
      category: 'Health & Fitness',
      types: ['Delivery workload count', 'Session duration', 'Fatigue metrics'],
      purposes: ['Injury Prevention', 'Overuse Monitoring']
    },
    {
      category: 'Diagnostics',
      types: ['Crash logs', 'Performance telemetry (Connection pool latency, camera FPS)'],
      purposes: ['App Stability', 'Service Quality Improvement']
    }
  ],
  securityPractices: [
    { name: 'Data Encrypted in Transit', detail: 'TLS 1.3 with HSTS and Certificate Transparency across all endpoints' },
    { name: 'Data Encrypted at Rest', detail: 'Cloud KMS Hardware Security Module (HSM) AES-256 encryption on all private storage buckets' },
    { name: 'Account Deletion Supported', detail: 'Users and verified guardians can request immediate hard deletion in-app or via web URL' },
    { name: 'Child Safeguarding Certified', detail: 'COPPA and GDPR-K compliant isolation; zero public indexing of minor athlete video' }
  ]
};

export const ACCOUNT_DELETION_WORKFLOW = {
  guideline: 'Apple App Store Review Guideline 5.1.1(v) & Google Play Account Deletion Policy',
  inAppPath: 'Settings > Security & Privacy > Delete Account & Wipe Data',
  webUrl: 'https://pitchprecision.app/account/delete',
  deletionProcess: [
    {
      step: 1,
      title: 'Authentication & Verification',
      detail: 'User or verified guardian confirms identity with password re-entry or biometric authentication (Face ID / Fingerprint).'
    },
    {
      step: 2,
      title: 'Immediate Token Revocation',
      detail: 'All active JWT sessions, refresh tokens, and mobile bridge credentials are instantly invalidated across all devices.'
    },
    {
      step: 3,
      title: 'Cloud Storage & Video Purge',
      detail: 'All private media files in dev/test/prod buckets are permanently purged. Signed URLs immediately return 404.'
    },
    {
      step: 4,
      title: 'Relational Database Anonymization & Purge',
      detail: 'User profile, coaching relationships, and session records are wiped from Cloud SQL. Audit ledger entries are anonymized to preserve immutable security checksums without PII.'
    },
    {
      step: 5,
      title: 'Confirmation Receipt',
      detail: 'A cryptographically signed deletion certificate is issued to the user via confirmation screen and email.'
    }
  ]
};

export const FULL_PRIVACY_POLICY_DOCUMENT = `
# PITCH PRECISION PRIVACY POLICY
**Effective Date:** September 3, 2026
**Version:** 2.4 (Security Gate 2 Certified)

At Pitch Precision ("we", "our", or "us"), we are committed to protecting the privacy, biometric security, and safeguarding of all athletes, coaches, guardians, and youth sports academies using our mobile application and cloud platform.

This Privacy Policy explains how Pitch Precision collects, processes, stores, protects, and deletes information when you use our iOS and Android mobile applications and cloud services.

---

### 1. SPECIAL SAFEGUARDS FOR JUNIOR PLAYERS & MINORS (COPPA & GDPR-K)
Pitch Precision is designed with strict child-safeguarding standards (including compliance with the US Children's Online Privacy Protection Act "COPPA", EU/UK GDPR-K, and ECB Safe Hands guidelines):
- **Verifiable Parental/Guardian Consent:** Accounts for minor athletes (under age 13 in the US, under 16 in the UK/EU) require link-binding to a verified parent or legal guardian account.
- **Private-by-Default Media:** Videos and biomechanical recordings of minor athletes are NEVER indexed publicly, shared to public feeds, or accessible without explicit ReBAC coaching grants.
- **Guardian Revocation Control:** Parents and guardians retain unilateral authority to grant or immediately revoke coaching access to their child's video repository and performance telemetry.
- **No Direct Contact:** Coaches cannot initiate unmonitored private communication channels with minor athletes outside the guardian-linked supervision structure.

---

### 2. INFORMATION WE COLLECT
We collect only data necessary to deliver AI performance analysis and secure coaching:
- **Account Data:** Name, email address, date of birth (for age-appropriate governance), playing role (batter, bowler, all-rounder, coach), and club/academy affiliation.
- **Video & Biomechanical Telemetry:** High-speed video footage captured during training sessions, extracted 17-point skeletal pose coordinates, bowling release velocity, pitch landing heatmaps, and arm angles.
- **Workload & Injury-Prevention Metrics:** Delivery counts, session duration, and bowling frequency used for overuse warning systems.
- **Technical & Diagnostic Telemetry:** Device model, OS version, camera frame rate, crash reports, and TLS/API connection diagnostic metrics.

---

### 3. HOW WE USE YOUR INFORMATION
We use your information exclusively for:
- Generating AI bowling radar analytics, delivery pitch maps, and biomechanical posture feedback.
- Facilitating private, authenticated video sharing between athletes and their accredited coaches.
- Monitoring bowling delivery workload to prevent physical injury and stress fractures.
- Maintaining cryptographic security audit trails and preventing unauthorized access.

**WE DO NOT SELL DATA:** We never sell, rent, monetize, or disclose athlete personal data, biometrics, or video footage to third-party advertisers, data brokers, or commercial marketing networks.

---

### 4. CLOUD STORAGE, ENCRYPTION & RELATIONSHIP-BASED ACCESS (ReBAC)
- **Encryption in Transit:** All communication between mobile devices and our Cloud Run backend uses TLS 1.3 with HTTP Strict Transport Security (HSTS).
- **Encryption at Rest:** All video files and performance records are stored in private cloud storage encrypted using Google Cloud KMS Hardware Security Module (HSM) AES-256 keys.
- **Short-Lived Expiring Signed URLs:** Video files are never accessed through static public URLs. Mobile clients receive temporary, cryptographic signed URLs that strictly expire within 15 minutes.
- **Relationship Verification:** The backend authorizer establishes whether an active coaching grant exists in the database before signing any video access request.

---

### 5. DATA RETENTION & ACCOUNT DELETION RIGHTS
- **On-Demand Deletion:** You have the absolute right to delete your account, player profile, and all associated video footage at any time via in-app settings (*Settings > Security & Privacy > Delete Account*) or through our web portal at https://pitchprecision.app/account/delete.
- **Permanent Purge:** Upon deletion confirmation, all private video objects in cloud buckets are permanently purged within 60 seconds, and database records are scrubbed.
- **Data Portability:** You may export your complete bowling metrics and session history in JSON/CSV format prior to deletion.

---

### 6. CAMERA & MICROPHONE SENSOR USAGE
- **Camera:** Accessed only during active recording mode to compute ball speed and skeletal pose tracking.
- **Microphone:** Audio samples are processed locally in real-time to detect ball-impact acoustic timestamps; raw audio recordings are not stored as separate audio tracks.

---

### 7. CONTACT US & DATA PRIVACY OFFICER
For privacy inquiries, guardian verification requests, or data subject access requests:
- **Data Protection Officer:** privacy@pitchprecision.app
- **Safeguarding Officer:** safeguarding@pitchprecision.app
- **Support Portal:** https://pitchprecision.app/support
- **Mailing Address:** Pitch Precision Privacy Office, 100 Sports Tech Way, San Francisco, CA 94107
`;
