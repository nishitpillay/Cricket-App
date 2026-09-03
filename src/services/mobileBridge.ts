import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus as CameraPermissionStatus } from '@capacitor/camera';
import { Network, ConnectionStatus } from '@capacitor/network';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import { App, AppState, URLOpenListenerEvent } from '@capacitor/app';
import { PushNotifications, PermissionStatus as PushPermissionStatus, Token } from '@capacitor/push-notifications';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { SecureVault, SecureAuthCredentials } from './secureStorage';

export interface MobileBridgeState {
  isNative: boolean;
  platform: 'ios' | 'android' | 'web';
  networkStatus: ConnectionStatus;
  currentOrientation: string;
  appState: 'active' | 'background' | 'inactive';
  cameraPermission: string;
  micPermission: string;
  photosPermission: string;
  pushToken: string | null;
  pushPermission: string;
  lastDeepLink: string | null;
  uploadQueue: VideoUploadJob[];
}

export interface VideoUploadJob {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  progressPercent: number;
  status: 'QUEUED' | 'UPLOADING' | 'PAUSED' | 'FAILED' | 'COMPLETED' | 'CANCELLED';
  retryCount: number;
  error?: string;
  storageTicketId?: string;
}

type BridgeListener = (state: MobileBridgeState) => void;

class MobileBridgeService {
  private state: MobileBridgeState = {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform() as 'ios' | 'android' | 'web',
    networkStatus: { connected: true, connectionType: 'wifi' },
    currentOrientation: 'portrait-primary',
    appState: 'active',
    cameraPermission: 'prompt',
    micPermission: 'prompt',
    photosPermission: 'prompt',
    pushToken: null,
    pushPermission: 'prompt',
    lastDeepLink: null,
    uploadQueue: []
  };

  private listeners: Set<BridgeListener> = new Set();
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    this.initListeners();
  }

  private async initListeners() {
    // 1. Network status listener
    try {
      const status = await Network.getStatus();
      this.state.networkStatus = status;
      Network.addListener('networkStatusChange', (status) => {
        this.state.networkStatus = status;
        this.notify();
        // Auto-resume paused uploads if network returns
        if (status.connected) {
          this.retryFailedUploads();
        }
      });
    } catch (e) {
      console.warn('Network listener init:', e);
    }

    // 2. App State (Background / Foreground transition)
    try {
      App.addListener('appStateChange', (state: AppState) => {
        this.state.appState = state.isActive ? 'active' : 'background';
        this.notify();
      });

      // Deep Linking Listener
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.state.lastDeepLink = event.url;
        this.notify();
      });
    } catch (e) {
      console.warn('App state listener init:', e);
    }

    // 3. Screen Orientation
    try {
      if (Capacitor.isPluginAvailable('ScreenOrientation')) {
        const orientation = await ScreenOrientation.orientation();
        this.state.currentOrientation = orientation.type;
        ScreenOrientation.addListener('screenOrientationChange', (res) => {
          this.state.currentOrientation = res.type;
          this.notify();
        });
      }
    } catch (e) {
      console.warn('Orientation listener init:', e);
    }
  }

  public subscribe(listener: BridgeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((fn) => fn(currentState));
  }

  public getState(): MobileBridgeState {
    return { ...this.state, uploadQueue: [...this.state.uploadQueue] };
  }

  // =========================================================================
  // JUST-IN-TIME HARDWARE PERMISSIONS (Rule: Never ask everything on launch)
  // =========================================================================

  /**
   * Requests camera & photos permission strictly when Record Video or Pick Media is triggered
   */
  public async requestCameraPermissionJustInTime(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('Camera')) {
        const check = await Camera.checkPermissions();
        if (check.camera === 'granted') {
          this.state.cameraPermission = 'granted';
          this.state.photosPermission = check.photos || 'granted';
          this.notify();
          return true;
        }

        const request = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
        this.state.cameraPermission = request.camera;
        this.state.photosPermission = request.photos;
        this.notify();
        return request.camera === 'granted';
      }
      return true; // Web fallback
    } catch (e) {
      console.error('Camera permission request error:', e);
      return false;
    }
  }

  /**
   * Captures or selects video delivery clip
   */
  public async recordOrPickVideo(source: 'camera' | 'photos'): Promise<{ uri?: string; dataUrl?: string; name: string } | null> {
    const granted = await this.requestCameraPermissionJustInTime();
    if (!granted) {
      throw new Error('Camera and Photo permissions are required to record or upload bowling clips.');
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos
      });

      return {
        uri: image.webPath,
        name: `delivery_${Date.now()}.mp4`
      };
    } catch (e: any) {
      if (e.message?.includes('cancelled') || e.message?.includes('canceled')) {
        return null; // User cancelled cleanly
      }
      throw e;
    }
  }

  // =========================================================================
  // ORIENTATION LOCK CONTROLS (Bowling Run-up Landscape vs UI Portrait)
  // =========================================================================

  public async lockOrientation(orientation: 'landscape' | 'portrait' | 'any'): Promise<void> {
    try {
      if (Capacitor.isPluginAvailable('ScreenOrientation')) {
        if (orientation === 'landscape') {
          await ScreenOrientation.lock({ orientation: 'landscape-primary' as any });
        } else if (orientation === 'portrait') {
          await ScreenOrientation.lock({ orientation: 'portrait-primary' as any });
        } else {
          await ScreenOrientation.unlock();
        }
      }
    } catch (e) {
      console.warn('ScreenOrientation lock not supported in browser environment:', e);
    }
  }

  // =========================================================================
  // PUSH NOTIFICATIONS READINESS
  // =========================================================================

  public async registerPushNotifications(): Promise<boolean> {
    try {
      if (Capacitor.isPluginAvailable('PushNotifications')) {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          this.state.pushPermission = 'denied';
          this.notify();
          return false;
        }

        this.state.pushPermission = 'granted';
        await PushNotifications.register();

        PushNotifications.addListener('registration', (token: Token) => {
          this.state.pushToken = token.value;
          this.notify();
        });

        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Push registration error: ', error);
        });

        this.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Push notification register error:', e);
      return false;
    }
  }

  // =========================================================================
  // ROBUST UPLOAD QUEUE WITH CANCELLATION & RESUME/RETRY
  // =========================================================================

  public enqueueUpload(file: { name: string; size: number }): string {
    const jobId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newJob: VideoUploadJob = {
      id: jobId,
      fileName: file.name,
      fileSizeBytes: file.size,
      progressPercent: 0,
      status: 'QUEUED',
      retryCount: 0
    };

    this.state.uploadQueue.unshift(newJob);
    this.notify();
    this.startUpload(jobId);
    return jobId;
  }

  public async startUpload(jobId: string) {
    const job = this.state.uploadQueue.find((j) => j.id === jobId);
    if (!job || job.status === 'UPLOADING') return;

    if (!this.state.networkStatus.connected) {
      job.status = 'PAUSED';
      job.error = 'Paused: Waiting for network connection';
      this.notify();
      return;
    }

    job.status = 'UPLOADING';
    job.error = undefined;
    this.notify();

    const controller = new AbortController();
    this.abortControllers.set(jobId, controller);

    try {
      // 1. Fetch Signed Upload Ticket from Server
      const ticketRes = await fetch('/api/v1/security-gate1/videos/upload-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 'usr_player_active',
          fileSizeBytes: job.fileSizeBytes,
          mimeType: 'video/mp4'
        }),
        signal: controller.signal
      });

      const ticketData = await ticketRes.json();
      if (!ticketData.success) {
        throw new Error(ticketData.error || 'Failed to acquire upload ticket');
      }

      job.storageTicketId = ticketData.ticket.ticketId;

      // 2. Simulated Chunked Progress Stream with cancel check
      for (let p = job.progressPercent; p <= 100; p += 10) {
        if (controller.signal.aborted) {
          job.status = 'CANCELLED';
          this.notify();
          return;
        }

        job.progressPercent = p;
        this.notify();
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      job.status = 'COMPLETED';
      job.progressPercent = 100;
      this.notify();
    } catch (e: any) {
      if (e.name === 'AbortError') {
        job.status = 'CANCELLED';
      } else {
        job.status = 'FAILED';
        job.error = e.message || 'Upload transmission failed';
      }
      this.notify();
    } finally {
      this.abortControllers.delete(jobId);
    }
  }

  public cancelUpload(jobId: string) {
    const controller = this.abortControllers.get(jobId);
    if (controller) {
      controller.abort();
    }
    const job = this.state.uploadQueue.find((j) => j.id === jobId);
    if (job) {
      job.status = 'CANCELLED';
      this.notify();
    }
  }

  public retryFailedUploads() {
    this.state.uploadQueue
      .filter((j) => j.status === 'FAILED' || j.status === 'PAUSED')
      .forEach((j) => {
        j.retryCount += 1;
        this.startUpload(j.id);
      });
  }
}

export const MobileBridge = new MobileBridgeService();
