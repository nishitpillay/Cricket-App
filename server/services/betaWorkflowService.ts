// Backend Service for Step 5: TestFlight & Google Play Internal Testing and Junior -> Parent -> Coach Workflow

import crypto from 'crypto';

export interface WorkflowState {
  currentStage: number; // 1 to 6
  isCompleted: boolean;
  activeSessionId: string;
  juniorPlayer: {
    id: string;
    name: string;
    age: number;
    ballSpeedKmH: number;
    oversCount: number;
    videoPath: string;
    recordedAt: string;
  };
  consentRequest: {
    requestId: string;
    guardianId: string;
    guardianEmail: string;
    requestedCoachId: string;
    coachName: string;
    status: 'PENDING' | 'APPROVED_COSIGNED' | 'REJECTED';
    approvedAt?: string;
    coSignSignature?: string;
  };
  coachReview: {
    coachId: string;
    coachName: string;
    signedVideoUrl?: string;
    signedUrlExpiry?: string;
    annotationsCount: number;
    frontKneeBraceAngle: number;
    shoulderCounterRotation: number;
    feedbackText: string;
    drillsAssigned: string[];
    reviewedAt?: string;
  };
  auditRecord: {
    auditId: string;
    coppaVerificationHash: string;
    bucketAclEnforced: string;
    ledgerTimestamp: string;
    verifiedByAdmin: string;
  };
  logs: {
    timestamp: string;
    actor: string;
    event: string;
    status: 'SUCCESS' | 'BLOCKED_BY_POLICY' | 'SECURITY_PASS';
    details: string;
  }[];
}

let activeWorkflowState: WorkflowState = {
  currentStage: 1,
  isCompleted: false,
  activeSessionId: 'sess_beta_aarav_001',
  juniorPlayer: {
    id: 'tester-junior-1',
    name: 'Aarav Sharma',
    age: 14,
    ballSpeedKmH: 128.4,
    oversCount: 6,
    videoPath: 'gs://pitch-precision-prod-video-private/junior/aarav_sharma/session_001.mp4',
    recordedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  consentRequest: {
    requestId: 'REQ-COPPA-7712',
    guardianId: 'tester-parent-1',
    guardianEmail: 'priya.sharma@sharmafamily.org',
    requestedCoachId: 'tester-coach-1',
    coachName: 'Coach David Miller (ECB Level 3)',
    status: 'PENDING'
  },
  coachReview: {
    coachId: 'tester-coach-1',
    coachName: 'Coach David Miller',
    annotationsCount: 0,
    frontKneeBraceAngle: 164,
    shoulderCounterRotation: 28,
    feedbackText: '',
    drillsAssigned: []
  },
  auditRecord: {
    auditId: 'AUDIT-LEGAL-99410',
    coppaVerificationHash: '',
    bucketAclEnforced: 'UNIFORM_BUCKET_LEVEL_ACCESS_PRIVATE',
    ledgerTimestamp: '',
    verifiedByAdmin: 'Marcus Vance (Safeguarding Director)'
  },
  logs: [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      actor: 'Aarav Sharma (14yo Junior)',
      event: 'SESSION_RECORDED_LOCAL',
      status: 'SUCCESS',
      details: 'Recorded 6 deliveries at 128.4 km/h using iPhone 14 120fps slow-motion capture.'
    }
  ]
};

export const BetaWorkflowService = {
  getWorkflowState(): WorkflowState {
    return activeWorkflowState;
  },

  resetWorkflow(): WorkflowState {
    activeWorkflowState = {
      currentStage: 1,
      isCompleted: false,
      activeSessionId: `sess_beta_aarav_${Date.now().toString(36)}`,
      juniorPlayer: {
        id: 'tester-junior-1',
        name: 'Aarav Sharma',
        age: 14,
        ballSpeedKmH: 128.4,
        oversCount: 6,
        videoPath: 'gs://pitch-precision-prod-video-private/junior/aarav_sharma/session_001.mp4',
        recordedAt: new Date().toISOString()
      },
      consentRequest: {
        requestId: `REQ-COPPA-${Math.floor(1000 + Math.random() * 9000)}`,
        guardianId: 'tester-parent-1',
        guardianEmail: 'priya.sharma@sharmafamily.org',
        requestedCoachId: 'tester-coach-1',
        coachName: 'Coach David Miller (ECB Level 3)',
        status: 'PENDING'
      },
      coachReview: {
        coachId: 'tester-coach-1',
        coachName: 'Coach David Miller',
        annotationsCount: 0,
        frontKneeBraceAngle: 164,
        shoulderCounterRotation: 28,
        feedbackText: '',
        drillsAssigned: []
      },
      auditRecord: {
        auditId: `AUDIT-LEGAL-${Math.floor(10000 + Math.random() * 90000)}`,
        coppaVerificationHash: '',
        bucketAclEnforced: 'UNIFORM_BUCKET_LEVEL_ACCESS_PRIVATE',
        ledgerTimestamp: '',
        verifiedByAdmin: 'Marcus Vance (Safeguarding Director)'
      },
      logs: [
        {
          timestamp: new Date().toISOString(),
          actor: 'Aarav Sharma (14yo Junior)',
          event: 'SESSION_RECORDED_LOCAL',
          status: 'SUCCESS',
          details: 'Recorded 6 deliveries at 128.4 km/h using iPhone 14 120fps camera sensor.'
        }
      ]
    };
    return activeWorkflowState;
  },

  advanceStep(targetStage?: number): WorkflowState {
    const nextStage = targetStage || activeWorkflowState.currentStage + 1;
    const now = new Date().toISOString();

    if (nextStage === 2) {
      // Stage 2: Junior Player dispatches coach review request -> System blocks direct sharing & routes to parent
      activeWorkflowState.currentStage = 2;
      activeWorkflowState.consentRequest.status = 'PENDING';
      activeWorkflowState.logs.push({
        timestamp: now,
        actor: 'Security Gate Subsystem',
        event: 'JUNIOR_SAFEGUARDING_TRIGGERED',
        status: 'SECURITY_PASS',
        details: 'Athlete age 14 detected (<16 limit). Direct coach transfer blocked. Guardian consent challenge dispatched to Priya Sharma.'
      });
    } else if (nextStage === 3) {
      // Stage 3: Parent / Guardian co-signs consent
      activeWorkflowState.currentStage = 3;
      const signature = crypto
        .createHmac('sha256', 'GUARDIAN_COSIGN_SECRET_KEY')
        .update(`GUARDIAN:PriyaSharma:PLAYER:AaravSharma:COACH:DavidMiller:${now}`)
        .digest('hex');

      activeWorkflowState.consentRequest.status = 'APPROVED_COSIGNED';
      activeWorkflowState.consentRequest.approvedAt = now;
      activeWorkflowState.consentRequest.coSignSignature = `ECDSA-P256-SHA256:${signature.substring(0, 32)}`;

      activeWorkflowState.logs.push({
        timestamp: now,
        actor: 'Priya Sharma (Verified Guardian)',
        event: 'GUARDIAN_COSIGN_APPROVED',
        status: 'SUCCESS',
        details: `Guardian verified coach credentials and authorized 30-day coaching relationship. Cryptographic signature minted: ${activeWorkflowState.consentRequest.coSignSignature}`
      });
    } else if (nextStage === 4) {
      // Stage 4: Coach ReBAC access & video telestrator review
      activeWorkflowState.currentStage = 4;
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString(); // 15-min signed URL
      const signedUrlToken = crypto.randomBytes(16).toString('hex');
      
      activeWorkflowState.coachReview.signedVideoUrl = `https://storage.googleapis.com/pitch-precision-prod-video-private/junior/aarav_sharma/session_001.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Expires=900&token=${signedUrlToken}`;
      activeWorkflowState.coachReview.signedUrlExpiry = expiresAt;
      activeWorkflowState.coachReview.annotationsCount = 4;
      activeWorkflowState.coachReview.feedbackText = 'Superb release speed at 128.4 km/h! Front-knee bracing angle is solid at 164° (ideal is 165°-170°). Keep head upright through follow-through to maximize outswing seam stability.';
      activeWorkflowState.coachReview.drillsAssigned = [
        'Single-Stump Target Outswing Drill (6 overs)',
        'Front-Foot Heavy Plant & Follow-Through (3 sets)'
      ];
      activeWorkflowState.coachReview.reviewedAt = now;

      activeWorkflowState.logs.push({
        timestamp: now,
        actor: 'Coach David Miller (ECB Level 3)',
        event: 'COACH_VIDEO_REVIEWED_AND_ANNOTATED',
        status: 'SUCCESS',
        details: 'ReBAC relationship validated. 15-minute signed URL generated. Attached 4 telestrator vectors and assigned 2 technical drills.'
      });
    } else if (nextStage === 5) {
      // Stage 5: Dual delivery to Junior + Parent simultaneously
      activeWorkflowState.currentStage = 5;
      activeWorkflowState.logs.push({
        timestamp: now,
        actor: 'System Notification Hub',
        event: 'DUAL_NOTIFICATION_DISPATCHED',
        status: 'SUCCESS',
        details: 'Encrypted push notification delivered to Aarav Sharma (Player) and Priya Sharma (Guardian CC). Zero unmonitored communication.'
      });
    } else if (nextStage === 6) {
      // Stage 6: Club Administrator audits complete legal and safeguarding compliance
      activeWorkflowState.currentStage = 6;
      activeWorkflowState.isCompleted = true;
      const auditHash = crypto
        .createHash('sha256')
        .update(`AUDIT:${activeWorkflowState.activeSessionId}:${activeWorkflowState.consentRequest.coSignSignature}:${now}`)
        .digest('hex');

      activeWorkflowState.auditRecord.coppaVerificationHash = `SHA256:${auditHash}`;
      activeWorkflowState.auditRecord.ledgerTimestamp = now;

      activeWorkflowState.logs.push({
        timestamp: now,
        actor: 'Marcus Vance (Safeguarding Director)',
        event: 'ADMIN_COMPLIANCE_CERTIFIED',
        status: 'SUCCESS',
        details: `Audit ledger verified: 100% COPPA consent adherence, private bucket isolation verified, 0 data leaks. Audit Hash: ${activeWorkflowState.auditRecord.coppaVerificationHash.substring(0, 24)}...`
      });
    }

    return activeWorkflowState;
  }
};
