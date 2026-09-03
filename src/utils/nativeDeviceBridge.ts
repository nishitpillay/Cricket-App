import { Capacitor } from '@capacitor/core';

export type PermissionStatusType = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'checking';

export interface DeviceHardwareCapability {
  id: string;
  name: string;
  type: 'camera' | 'microphone' | 'biometrics' | 'storage' | 'haptics' | 'geolocation';
  status: PermissionStatusType;
  details: string;
  nativeRequiredStringIos: string;
  nativeRequiredPermissionAndroid: string;
}

export interface StorageEstimateResult {
  usageBytes: number;
  quotaBytes: number;
  percentUsed: number;
  formattedUsage: string;
  formattedQuota: string;
}

// 1. Platform Detection
export function getRunningPlatform(): 'ios' | 'android' | 'web_pwa' | 'desktop_browser' {
  const capPlatform = Capacitor.getPlatform();
  if (capPlatform === 'ios') return 'ios';
  if (capPlatform === 'android') return 'android';
  
  const isMobileBrowser = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobileBrowser) return 'web_pwa';
  return 'desktop_browser';
}

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

// 2. Camera Diagnostics & Stream Manager
export async function checkCameraPermission(): Promise<PermissionStatusType> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return 'unsupported';
  }
  
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const result = await navigator.permissions.query({ name: 'camera' as any });
      return result.state as PermissionStatusType;
    }
  } catch {
    // Some browsers don't support query('camera')
  }
  return 'prompt';
}

export async function requestCameraStream(
  facingMode: 'environment' | 'user' = 'environment',
  preferredFps: number = 60
): Promise<{ stream: MediaStream | null; error: string | null }> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { stream: null, error: 'Camera hardware API is not supported in this environment.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: preferredFps, min: 30 }
      },
      audio: false
    });
    return { stream, error: null };
  } catch (err: any) {
    let errorMsg = 'Failed to access camera.';
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMsg = 'Camera permission was denied by the user or OS settings.';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      errorMsg = 'No camera device was found on this hardware.';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      errorMsg = 'Camera is currently locked by another application.';
    }
    return { stream: null, error: errorMsg };
  }
}

// 3. Microphone Diagnostics & Audio Manager
export async function checkMicrophonePermission(): Promise<PermissionStatusType> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return 'unsupported';
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const result = await navigator.permissions.query({ name: 'microphone' as any });
      return result.state as PermissionStatusType;
    }
  } catch {
    // Fallback
  }
  return 'prompt';
}

export async function requestMicrophoneStream(): Promise<{ stream: MediaStream | null; error: string | null }> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { stream: null, error: 'Audio recording API is not supported.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    });
    return { stream, error: null };
  } catch (err: any) {
    return { stream: null, error: err.message || 'Microphone permission denied.' };
  }
}

// 4. Biometrics / FaceID / TouchID Assessment
export async function checkBiometricAuthSupport(): Promise<{
  supported: boolean;
  type: 'faceid_touchid' | 'webauthn_fido2' | 'unavailable';
  details: string;
}> {
  if (typeof window === 'undefined') {
    return { supported: false, type: 'unavailable', details: 'Window object unavailable.' };
  }

  if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        const isApple = /iPhone|iPad|Macintosh/i.test(navigator.userAgent);
        return {
          supported: true,
          type: isApple ? 'faceid_touchid' : 'webauthn_fido2',
          details: isApple 
            ? 'Apple Face ID / Touch ID Secure Enclave available.' 
            : 'Android BiometricPrompt / Windows Hello hardware key available.'
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    supported: false,
    type: 'unavailable',
    details: 'Biometric platform authenticator not detected.'
  };
}

// 5. Local Sandbox Storage Diagnostics
export async function getStorageQuotaEstimate(): Promise<StorageEstimateResult> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || (1024 * 1024 * 1024); // default 1GB if unspecified
      const percent = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        usageBytes: usage,
        quotaBytes: quota,
        percentUsed: Math.min(100, Math.round(percent * 10) / 10),
        formattedUsage: formatBytes(usage),
        formattedQuota: formatBytes(quota)
      };
    } catch {
      // Fallback
    }
  }

  return {
    usageBytes: 0,
    quotaBytes: 1024 * 1024 * 500,
    percentUsed: 0,
    formattedUsage: '0 MB',
    formattedQuota: '500 MB (Default Sandbox)'
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 6. Native Haptic Feedback Vibration Trigger
export function triggerHapticFeedback(type: 'impact_light' | 'impact_heavy' | 'success' | 'warning'): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'impact_light':
          navigator.vibrate(15);
          break;
        case 'impact_heavy':
          navigator.vibrate([40, 20, 40]);
          break;
        case 'success':
          navigator.vibrate([20, 30, 20]);
          break;
        case 'warning':
          navigator.vibrate([60, 40, 60, 40, 80]);
          break;
      }
    } catch {
      // Ignore if denied or muted
    }
  }
}

// 7. Store Compliance Manifest Rules Matrix
export const NATIVE_STORE_PERMISSIONS_DECLARATION = [
  {
    permission: 'Camera (Video Telemetry & Pose Analysis)',
    iosKey: 'NSCameraUsageDescription',
    iosDescription: 'Pitch Precision requires access to your camera to record cricket bowling and batting drills for AI-assisted biomechanics joint analysis.',
    androidPermission: 'android.permission.CAMERA',
    androidFeature: '<uses-feature android:name="android.hardware.camera" android:required="true" />',
    complianceStatus: 'VERIFIED_MANDATORY'
  },
  {
    permission: 'Microphone (Coach Audio Cues & Acoustic Strike)',
    iosKey: 'NSMicrophoneUsageDescription',
    iosDescription: 'Pitch Precision uses the microphone to record coach voice notes and capture cricket ball-on-bat acoustic impact cues.',
    androidPermission: 'android.permission.RECORD_AUDIO',
    androidFeature: '<uses-feature android:name="android.hardware.microphone" android:required="false" />',
    complianceStatus: 'VERIFIED_MANDATORY'
  },
  {
    permission: 'Face ID & Biometric Authentication',
    iosKey: 'NSFaceIDUsageDescription',
    iosDescription: 'Pitch Precision uses Face ID to securely authenticate coaches and players to protect private biometric video data.',
    androidPermission: 'android.permission.USE_BIOMETRIC',
    androidFeature: '<uses-permission android:name="android.permission.USE_BIOMETRIC" />',
    complianceStatus: 'VERIFIED_OPTIONAL'
  },
  {
    permission: 'Local Sandbox Storage (Offline Drills Caching)',
    iosKey: 'LSSupportsOpeningDocumentsInPlace',
    iosDescription: 'Enables private application document sandbox storage for offline drill review.',
    androidPermission: 'Scoped Storage API (No Dangerous Permission Required in Android 13+)',
    androidFeature: '<application android:requestLegacyExternalStorage="false" />',
    complianceStatus: 'VERIFIED_COMPLIANT'
  }
];
