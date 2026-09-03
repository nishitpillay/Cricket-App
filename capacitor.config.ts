import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pitchprecision.app',
  appName: 'Pitch Precision',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'pitchprecision',
    cleartext: false,
    allowNavigation: [
      'https://ais-dev-*.run.app',
      'https://ais-pre-*.run.app',
      'https://*.googleapis.com',
      'https://*.google.com'
    ]
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0d0d0d',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0d0d0d'
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: true
  }
};

export default config;
