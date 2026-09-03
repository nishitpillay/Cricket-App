import React, { useState } from 'react';
import { 
  STORE_IMAGE_ASSETS, 
  STORE_LISTING_METADATA, 
  PERMISSION_STRINGS, 
  APP_PRIVACY_NUTRITION_LABELS, 
  ACCOUNT_DELETION_WORKFLOW, 
  FULL_PRIVACY_POLICY_DOCUMENT 
} from '../../data/storePrivacyData';
import { ScreenType } from '../../types';

interface StoreAssetsPrivacyScreenProps {
  onNavigate?: (screen: ScreenType) => void;
  onBack?: () => void;
}

export const StoreAssetsPrivacyScreen: React.FC<StoreAssetsPrivacyScreenProps> = ({ onNavigate, onBack }) => {
  const [activeTab, setActiveTab] = useState<
    'icons_splash' | 'screenshots' | 'listing_aso' | 'privacy_policy' | 'apple_google_privacy' | 'deletion_permissions' | 'age_rating'
  >('icons_splash');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [adaptiveShape, setAdaptiveShape] = useState<'squircle' | 'circle' | 'rounded_rect' | 'teardrop'>('squircle');
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);
  const [simulatingDeletion, setSimulatingDeletion] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSimulateDeletion = () => {
    setSimulatingDeletion(true);
    setTimeout(() => {
      setSimulatingDeletion(false);
      setDeletionConfirmed(true);
    }, 1800);
  };

  const exportStoreBundle = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      app: STORE_LISTING_METADATA,
      permissions: PERMISSION_STRINGS,
      privacyLabels: APP_PRIVACY_NUTRITION_LABELS,
      deletionWorkflow: ACCOUNT_DELETION_WORKFLOW,
      privacyPolicy: FULL_PRIVACY_POLICY_DOCUMENT
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitch-precision-appstore-playstore-readiness-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e7eb] pb-24 font-sans selection:bg-[#c3f400] selection:text-black">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-md border-b border-[#222] px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-lg bg-[#222] hover:bg-[#333] flex items-center justify-center text-white transition cursor-pointer"
                title="Go Back"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Step 4: Store Assets & Privacy Center
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#c3f400] text-black uppercase tracking-wider">
                  App Store & Play Store Ready
                </span>
              </div>
              <p className="text-xs text-[#8e9285]">
                1024×1024 Icon, Adaptive Specs, Splash Screen, ASO, Full COPPA Privacy Policy, Deletion Flow & Nutrition Labels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportStoreBundle}
              className="px-3.5 py-1.5 rounded-xl bg-[#222] hover:bg-[#333] border border-[#333] text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Export complete JSON readiness package"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">download</span>
              <span className="hidden sm:inline">Export Store Manifest</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('security-gate-2')}
                className="px-3 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span className="hidden sm:inline">Security Gate 2</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#222] scrollbar-none">
          {[
            { id: 'icons_splash', label: '1. Icons & Splash Screen', icon: 'app_shortcut' },
            { id: 'screenshots', label: '2. Screenshots & Media Specs', icon: 'smartphone' },
            { id: 'listing_aso', label: '3. Store Descriptions & ASO', icon: 'storefront' },
            { id: 'privacy_policy', label: '4. Privacy Policy (COPPA/GDPR-K)', icon: 'policy', highlight: true },
            { id: 'apple_google_privacy', label: '5. Nutrition Labels & Data Safety', icon: 'shield_lock' },
            { id: 'deletion_permissions', label: '6. Account Deletion & Permissions', icon: 'lock_person' },
            { id: 'age_rating', label: '7. Age Rating & Families Policy', icon: 'family_restroom' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#c3f400] text-black shadow-md'
                  : 'bg-[#171717] hover:bg-[#222] text-[#aaa] hover:text-white border border-[#222]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-black' : 'bg-[#c3f400]'}`} />
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ICONS & SPLASH SCREEN */}
        {/* ========================================================================= */}
        {activeTab === 'icons_splash' && (
          <div className="space-y-6">
            {/* Master Icon 1024x1024 */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30">
                      MASTER PRODUCTION ASSET
                    </span>
                    <span className="text-xs text-[#888]">1024 × 1024 px • PNG-24 (No Alpha)</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">App Store & Google Play Master Icon</h2>
                  <p className="text-xs text-[#a0a0a0] leading-relaxed">
                    A high-contrast luxury dark cricket ball seam with electric lime biometric trajectory lines. 
                    Formatted strictly without alpha channels, rounded corners (applied dynamically by OS), or embedded text, complying with Apple Human Interface Guidelines and Google Material Design 3.
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#262626]">
                      <div className="text-[10px] text-[#888] uppercase font-bold">iOS App Store</div>
                      <div className="text-white font-semibold mt-0.5">1024 × 1024 px (100% sRGB)</div>
                      <div className="text-[11px] text-[#8e9285] mt-1">No transparency, squared canvas</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#262626]">
                      <div className="text-[10px] text-[#888] uppercase font-bold">Google Play Store</div>
                      <div className="text-white font-semibold mt-0.5">512 × 512 px (32-bit PNG)</div>
                      <div className="text-[11px] text-[#8e9285] mt-1">Max 1024KB, color space sRGB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={STORE_IMAGE_ASSETS.masterIcon}
                      download="pitch-precision-master-icon-1024.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download 1024×1024 Master</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(STORE_IMAGE_ASSETS.masterIcon, 'master_icon_url')}
                      className="px-3.5 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-[#333]"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedKey === 'master_icon_url' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedKey === 'master_icon_url' ? 'Copied Path!' : 'Copy Asset URL'}</span>
                    </button>
                  </div>
                </div>

                {/* Visual Preview */}
                <div className="flex flex-col items-center gap-3 shrink-0 mx-auto lg:mx-0">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#c3f400]/40 p-1 bg-black">
                    <img
                      src={STORE_IMAGE_ASSETS.masterIcon}
                      alt="Pitch Precision 1024x1024 Master Icon"
                      className="w-full h-full object-cover rounded-[22px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white">Pitch Precision App Icon</span>
                    <span className="block text-[11px] text-[#777]">Rendered with iOS 22.5% squircle curvature</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Android Adaptive Icon Studio */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">android</span>
                    <span>Android Adaptive Icon Architecture (API 26+ & Android 13 Themed)</span>
                  </h3>
                  <p className="text-xs text-[#8e9285]">
                    Split into Foreground (108×108 dp), Background (108×108 dp), and Monochrome vector layers with a 72 dp safe zone.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-xl border border-[#333]">
                  <span className="text-[10px] text-[#888] font-bold px-2">Mask:</span>
                  {(['squircle', 'circle', 'rounded_rect', 'teardrop'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setAdaptiveShape(shape)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition capitalize ${
                        adaptiveShape === shape ? 'bg-[#c3f400] text-black' : 'text-[#aaa] hover:text-white'
                      }`}
                    >
                      {shape.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Foreground Layer */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#282828] text-center space-y-2">
                  <div className="text-xs font-bold text-white">1. Foreground Layer (108dp)</div>
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-[#111] border border-dashed border-[#444] flex items-center justify-center p-2 relative overflow-hidden">
                    <img
                      src={STORE_IMAGE_ASSETS.masterIcon}
                      alt="Foreground"
                      className="w-20 h-20 object-contain drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-2 border border-dotted border-[#c3f400]/40 rounded-full pointer-events-none" />
                  </div>
                  <div className="text-[11px] text-[#777]">Cricket ball seam & radar vector (72dp safe area)</div>
                </div>

                {/* Background Layer */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#282828] text-center space-y-2">
                  <div className="text-xs font-bold text-white">2. Background Layer (108dp)</div>
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-[#0a0a0a] border border-[#333] flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#1c1b1b] via-[#111] to-[#0a0a0a] flex items-center justify-center">
                      <span className="text-[10px] text-[#444] font-mono">#0A0A0A Carbon</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#777]">Deep obsidian canvas (Solid / Subtle gradient)</div>
                </div>

                {/* Live Mask Preview */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#c3f400]/30 text-center space-y-2">
                  <div className="text-xs font-bold text-[#c3f400]">3. Composite Adaptive Result</div>
                  <div className="w-28 h-28 mx-auto flex items-center justify-center">
                    <div
                      className={`w-24 h-24 overflow-hidden shadow-xl transition-all duration-300 border-2 border-[#c3f400] ${
                        adaptiveShape === 'squircle'
                          ? 'rounded-[28px]'
                          : adaptiveShape === 'circle'
                          ? 'rounded-full'
                          : adaptiveShape === 'rounded_rect'
                          ? 'rounded-xl'
                          : 'rounded-[30px_30px_30px_4px]'
                      }`}
                    >
                      <img
                        src={STORE_IMAGE_ASSETS.masterIcon}
                        alt="Composite Adaptive Icon"
                        className="w-full h-full object-cover scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-[#c3f400] font-semibold capitalize">{adaptiveShape.replace('_', ' ')} Mask Active</div>
                </div>
              </div>

              {/* Copyable XML Manifest */}
              <div className="mt-4 p-4 rounded-xl bg-[#0d0d0d] border border-[#222]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#c3f400]">res/mipmap-anydpi-v26/ic_launcher.xml</span>
                  <button
                    onClick={() => copyToClipboard(`<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
    <monochrome android:drawable="@drawable/ic_launcher_monochrome"/>
</adaptive-icon>`, 'adaptive_xml')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-white flex items-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedKey === 'adaptive_xml' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'adaptive_xml' ? 'Copied XML!' : 'Copy XML'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-[#aaa] overflow-x-auto whitespace-pre p-2 bg-black/60 rounded-lg">
{`<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
    <monochrome android:drawable="@drawable/ic_launcher_monochrome"/>
</adaptive-icon>`}
                </pre>
              </div>
            </div>

            {/* Launch / Splash Screen Specification */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c3f400]/20 text-[#c3f400]">
                      LAUNCH EXPERIENCE
                    </span>
                    <span className="text-xs text-[#888]">iOS Storyboard & Android 12+ Splash API</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Native Splash / Launch Screen</h3>
                  <p className="text-xs text-[#a0a0a0] leading-relaxed">
                    Designed to render instantly upon cold start without layout jitter. Conforms with Android 12 <code className="text-[#c3f400]">SplashScreen</code> API (animated center icon & window background) and iOS <code className="text-[#c3f400]">LaunchScreen.storyboard</code> (zero dynamic code execution).
                  </p>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626]">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                        <span>Android 12+ SplashScreen Theme</span>
                      </div>
                      <div className="text-[11px] text-[#8e9285] font-mono mt-1">
                        postSplashScreenTheme = @style/Theme.PitchPrecision.App
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626]">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                        <span>iOS UILaunchScreen / Asset Catalog</span>
                      </div>
                      <div className="text-[11px] text-[#8e9285] mt-1">
                        Safe area centered vector with dynamic background matching <code className="text-[#c3f400]">#0E0E0E</code>.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={STORE_IMAGE_ASSETS.splashScreen}
                      download="pitch-precision-splash-screen.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-[#333]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#c3f400]">download</span>
                      <span>Download Launch Asset</span>
                    </a>
                  </div>
                </div>

                {/* Splash Screen Mobile Frame Preview */}
                <div className="flex flex-col items-center gap-2 shrink-0 mx-auto lg:mx-0">
                  <div className="w-48 h-96 rounded-[32px] overflow-hidden border-4 border-[#333] shadow-2xl p-1 bg-black relative">
                    <img
                      src={STORE_IMAGE_ASSETS.splashScreen}
                      alt="Pitch Precision Splash Screen"
                      className="w-full h-full object-cover rounded-[26px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] text-[#777]">Cold-Start Launch Screen Mockup</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SCREENSHOTS & MEDIA SPECS */}
        {/* ========================================================================= */}
        {activeTab === 'screenshots' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <h2 className="text-xl font-bold text-white mb-2">App Store & Google Play Screenshot Matrix</h2>
              <p className="text-xs text-[#8e9285] mb-6">
                Exact pixel specifications for every required device format. Screenshots must showcase real telemetry, line & length pitch heatmaps, and coach review workflows.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    platform: 'iOS 6.7" Super Retina',
                    device: 'iPhone 16 Pro Max / 15 Pro Max',
                    resolution: '1290 × 2796 px (Portrait)',
                    aspect: '19.5:9 ratio',
                    required: 'Mandatory',
                  },
                  {
                    platform: 'iOS 6.5" Super Retina',
                    device: 'iPhone 14 Plus / 11 Pro Max',
                    resolution: '1284 × 2778 px (Portrait)',
                    aspect: '19.5:9 ratio',
                    required: 'Mandatory',
                  },
                  {
                    platform: 'iOS 13" iPad Pro',
                    device: 'iPad Pro (M4 / 6th Gen)',
                    resolution: '2048 × 2732 px (Portrait)',
                    aspect: '4:3 ratio',
                    required: 'Mandatory for Universal',
                  },
                  {
                    platform: 'Google Play Feature Graphic',
                    device: 'Play Store Header Banner',
                    resolution: '1024 × 500 px (JPEG/24-bit PNG)',
                    aspect: '2:1 ratio (No alpha)',
                    required: 'Mandatory for Play Store',
                  },
                ].map((spec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#1c1b1b] border border-[#282828] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400]">
                        {spec.required}
                      </span>
                      <span className="text-[10px] text-[#777]">{spec.aspect}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{spec.platform}</div>
                    <div className="text-xs text-[#aaa]">{spec.device}</div>
                    <div className="text-xs font-mono text-[#c3f400] pt-1">{spec.resolution}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Screenshot Gallery */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-6">
              <h3 className="text-lg font-bold text-white">5 High-Impact Store Screenshots</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Screenshot 1 */}
                <div className="space-y-3">
                  <div className="w-full h-96 rounded-2xl overflow-hidden border border-[#333] shadow-lg bg-black">
                    <img
                      src={STORE_IMAGE_ASSETS.appStoreMockup1}
                      alt="Screenshot 1"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">Screen 1: Bowling Radar</span>
                    <h4 className="text-sm font-bold text-white">Instant Release Speed & 17-Point Pose</h4>
                    <p className="text-[11px] text-[#8e9285] mt-0.5">
                      Sub-millisecond optical radar measuring 142.4 km/h release velocity and knee-bracing angles.
                    </p>
                  </div>
                </div>

                {/* Screenshot 2 */}
                <div className="space-y-3">
                  <div className="w-full h-96 rounded-2xl overflow-hidden border border-[#333] shadow-lg bg-gradient-to-b from-[#181818] to-[#0c0c0c] p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#c3f400]">22-YARD PITCH HEATMAP</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#222] text-[#fff]">GOOD LENGTH: 78%</span>
                      </div>
                      <div className="h-44 rounded-xl bg-[#111] border border-[#2a2a2a] relative flex items-center justify-center">
                        <div className="w-3/4 h-36 border-2 border-dashed border-[#444] rounded-lg relative flex flex-col justify-between p-2">
                          <div className="text-[9px] text-[#666] text-center">BATSMAN CREASE (Yorker Zone)</div>
                          <div className="w-12 h-8 rounded-full bg-[#c3f400]/30 border border-[#c3f400] mx-auto flex items-center justify-center text-[10px] font-bold text-[#c3f400]">
                            6 / 6 Dots
                          </div>
                          <div className="text-[9px] text-[#666] text-center">BOWLER CREASE</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a]">
                      <div className="text-xs font-bold text-white">Seam & Swing Telemetry</div>
                      <div className="text-[11px] text-[#c3f400] font-mono mt-0.5">+2.4° Outswing • 11.2° Arm Angle</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">Screen 2: Pitch Mapping</span>
                    <h4 className="text-sm font-bold text-white">Delivery Grouping & Seam Deviation</h4>
                    <p className="text-[11px] text-[#8e9285] mt-0.5">
                      Visual ball landing coordinates across all lengths: Yorker, Full, Good Length, and Bouncer.
                    </p>
                  </div>
                </div>

                {/* Screenshot 3 */}
                <div className="space-y-3">
                  <div className="w-full h-96 rounded-2xl overflow-hidden border border-[#333] shadow-lg bg-gradient-to-b from-[#181818] to-[#0c0c0c] p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#c3f400]">COACH-GUARDIAN SAFEGUARDING</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#c3f400] text-black font-extrabold">COPPA CO-SIGN</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Parental Supervision Bound</div>
                            <div className="text-[10px] text-[#888]">Guardian CC on all drill feedback</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] space-y-1">
                        <div className="text-xs font-bold text-white">15-Min Expiring Signed URLs</div>
                        <div className="text-[10px] text-[#888]">Zero public video indexing or unauthenticated access</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a]">
                      <div className="text-xs font-bold text-white">Injury Prevention & Load Radar</div>
                      <div className="text-[11px] text-[#c3f400]">ACWR: 1.14 (Optimal Workload Zone)</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">Screen 3: Safe Coaching</span>
                    <h4 className="text-sm font-bold text-white">ReBAC Guardian Consent & Injury Load</h4>
                    <p className="text-[11px] text-[#8e9285] mt-0.5">
                      Strict youth academy protection, fatigue monitoring, and stress-fracture prevention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STORE DESCRIPTIONS & ASO */}
        {/* ========================================================================= */}
        {activeTab === 'listing_aso' && (
          <div className="space-y-6">
            {/* Meta Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                <div className="text-[10px] text-[#888] font-bold uppercase">App Name (30 Chars max)</div>
                <div className="text-sm font-bold text-white">{STORE_LISTING_METADATA.appName}</div>
                <div className="text-[11px] text-[#8e9285]">25 / 30 characters</div>
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                <div className="text-[10px] text-[#888] font-bold uppercase">Subtitle (30 Chars max)</div>
                <div className="text-sm font-bold text-white">{STORE_LISTING_METADATA.subtitle}</div>
                <div className="text-[11px] text-[#8e9285]">30 / 30 characters</div>
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                <div className="text-[10px] text-[#888] font-bold uppercase">Primary & Secondary Category</div>
                <div className="text-sm font-bold text-[#c3f400]">{STORE_LISTING_METADATA.primaryCategory} • {STORE_LISTING_METADATA.secondaryCategory}</div>
                <div className="text-[11px] text-[#8e9285]">App Store & Google Play</div>
              </div>
            </div>

            {/* Promotional Text & Short Description */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">App Store Promotional Text (170 Chars max)</span>
                  <button
                    onClick={() => copyToClipboard(STORE_LISTING_METADATA.promotionalText, 'promo_text')}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-white flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedKey === 'promo_text' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'promo_text' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] text-xs text-[#ddd]">
                  {STORE_LISTING_METADATA.promotionalText}
                </div>
                <div className="text-[11px] text-[#777] mt-1">{STORE_LISTING_METADATA.promotionalText.length} / 170 characters</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Google Play Short Description (80 Chars max)</span>
                  <button
                    onClick={() => copyToClipboard(STORE_LISTING_METADATA.shortDescriptionAndroid, 'short_desc')}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-white flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedKey === 'short_desc' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'short_desc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] text-xs text-[#ddd]">
                  {STORE_LISTING_METADATA.shortDescriptionAndroid}
                </div>
                <div className="text-[11px] text-[#777] mt-1">{STORE_LISTING_METADATA.shortDescriptionAndroid.length} / 80 characters</div>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">App Store Search Keywords (100 Chars comma-separated)</span>
                  <button
                    onClick={() => copyToClipboard(STORE_LISTING_METADATA.keywordsAppStore, 'keywords')}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-white flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedKey === 'keywords' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedKey === 'keywords' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] text-xs font-mono text-[#c3f400]">
                  {STORE_LISTING_METADATA.keywordsAppStore}
                </div>
                <div className="text-[11px] text-[#777] mt-1">Optimized for search indexing: bowling radar, pitch map, biomechanics, cricket coaching.</div>
              </div>
            </div>

            {/* Full Store Description */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Full Store Description (Up to 4,000 Chars)</h3>
                <button
                  onClick={() => copyToClipboard(STORE_LISTING_METADATA.fullDescription, 'full_desc')}
                  className="px-3 py-1 rounded-xl bg-[#c3f400] text-black font-extrabold text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copiedKey === 'full_desc' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'full_desc' ? 'Copied Full Description!' : 'Copy Full Description'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#282828] text-xs text-[#ccc] font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                {STORE_LISTING_METADATA.fullDescription}
              </div>
            </div>

            {/* Official URLs */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
              <h3 className="text-base font-bold text-white">Store Submission URLs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(STORE_LISTING_METADATA.urls).map(([k, url]) => (
                  <div key={k} className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#888] uppercase font-bold">{k.replace('Url', ' URL')}</div>
                      <div className="text-[#c3f400] font-mono truncate max-w-xs">{url}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(url, k)}
                      className="text-[#888] hover:text-white transition p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedKey === k ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PRIVACY POLICY (COPPA / GDPR-K / ECB) */}
        {/* ========================================================================= */}
        {activeTab === 'privacy_policy' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171717] via-[#141414] to-[#171717] border border-[#c3f400]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c3f400] text-black uppercase">
                    COMPREHENSIVE LEGAL SPECIFICATION
                  </span>
                  <span className="text-xs text-[#8e9285]">Version 2.4 • Effective Sep 3, 2026</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Junior Player Video & Biometrics Privacy Policy
                </h2>
                <p className="text-xs text-[#aaa] mt-1 max-w-2xl">
                  Meets stringent App Store Review Guideline 5.1.1, Google Play Families Policy, US COPPA, UK/EU GDPR-K, and ECB Safe Hands youth cricket regulations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(FULL_PRIVACY_POLICY_DOCUMENT, 'privacy_md')}
                  className="px-3.5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'privacy_md' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'privacy_md' ? 'Copied Policy!' : 'Copy Full Markdown'}</span>
                </button>
              </div>
            </div>

            {/* Key Safeguarding Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                </div>
                <div className="text-sm font-bold text-white">Parental Co-Sign & Supervision</div>
                <p className="text-[11px] text-[#8e9285]">
                  Minor athletes under 16/13 require verified guardian email linking and unilateral coach revocation rights.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="text-sm font-bold text-white">Private Cloud KMS Storage</div>
                <p className="text-[11px] text-[#8e9285]">
                  Zero public video URLs. All video requests are validated against relational coaching grants and issued 15-min signed URLs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                </div>
                <div className="text-sm font-bold text-white">Instant Data Wipe Rights</div>
                <p className="text-[11px] text-[#8e9285]">
                  Self-service in-app deletion permanently purges video objects from cloud buckets within 60 seconds with no soft traps.
                </p>
              </div>
            </div>

            {/* Complete Document Render */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <div className="p-6 rounded-xl bg-[#0b0b0b] border border-[#242424] text-xs text-[#ddd] font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {FULL_PRIVACY_POLICY_DOCUMENT}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: NUTRITION LABELS & DATA SAFETY */}
        {/* ========================================================================= */}
        {activeTab === 'apple_google_privacy' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#c3f400]">privacy_tip</span>
                <h2 className="text-xl font-bold text-white">Apple App Privacy Nutrition Labels</h2>
              </div>
              <p className="text-xs text-[#8e9285] mb-6">
                Direct answers for App Store Connect App Privacy declarations. Discloses exact collection, linkage, and tracking status.
              </p>

              {/* Data Used to Track You */}
              <div className="p-4 rounded-xl bg-[#1c1b1b] border border-green-500/30 mb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-white">Data Used to Track You: NONE</span>
                </div>
                <p className="text-[11px] text-[#aaa]">
                  Pitch Precision does NOT track user identity across other apps and websites owned by third-party companies.
                </p>
              </div>

              {/* Data Linked to You */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Data Linked to You</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {APP_PRIVACY_NUTRITION_LABELS.dataLinkedToYou.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                      <div className="text-sm font-bold text-[#c3f400]">{item.category}</div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-[#888] font-bold uppercase">Data Types:</div>
                        <ul className="list-disc list-inside text-xs text-[#ddd] space-y-0.5">
                          {item.types.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1 border-t border-[#262626]">
                        <span className="text-[10px] text-[#888] font-bold uppercase">Purposes: </span>
                        <span className="text-xs text-[#aaa]">{item.purposes.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Play Data Safety Form */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">verified</span>
                <h3 className="text-lg font-bold text-white">Google Play Data Safety Declarations</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {APP_PRIVACY_NUTRITION_LABELS.securityPractices.map((sec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#282828] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                      <span>{sec.name}</span>
                    </div>
                    <div className="text-[11px] text-[#8e9285]">{sec.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ACCOUNT DELETION & PERMISSIONS */}
        {/* ========================================================================= */}
        {activeTab === 'deletion_permissions' && (
          <div className="space-y-6">
            {/* Account Deletion Flow (Guideline 5.1.1(v)) */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                      APP STORE GUIDELINE 5.1.1(v)
                    </span>
                    <span className="text-xs text-[#8e9285]">In-App & Web Account Deletion Flow</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">Instant Account & Video Purge Architecture</h3>
                </div>

                <button
                  onClick={() => setShowDeletionModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                  <span>Test Live Deletion Flow</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {ACCOUNT_DELETION_WORKFLOW.deletionProcess.map((step) => (
                  <div key={step.step} className="p-3.5 rounded-xl bg-[#1c1b1b] border border-[#282828] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="w-6 h-6 rounded-full bg-[#222] text-[#c3f400] text-xs font-extrabold flex items-center justify-center mb-1">
                        {step.step}
                      </div>
                      <div className="text-xs font-bold text-white">{step.title}</div>
                    </div>
                    <div className="text-[11px] text-[#8e9285] leading-relaxed">{step.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permission Strings (iOS Info.plist & Android Manifest) */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-6">
              <h3 className="text-xl font-bold text-white">Camera & Microphone Usage Rationales</h3>

              {/* iOS Info.plist */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#c3f400] uppercase tracking-wider">iOS Info.plist Keys & Exact Copy</div>
                <div className="space-y-3">
                  {PERMISSION_STRINGS.ios.map((perm) => (
                    <div key={perm.key} className="p-4 rounded-xl bg-[#1c1b1b] border border-[#282828] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#c3f400] font-bold">{perm.key}</span>
                          <span className="text-xs text-[#888]">({perm.name})</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(perm.value, perm.key)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-white flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedKey === perm.key ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedKey === perm.key ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-lg bg-[#111] text-xs text-[#eee] leading-relaxed border border-[#222]">
                        "{perm.value}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Android Manifest Permissions */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-[#c3f400] uppercase tracking-wider">Android Runtime Permission Rationales</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PERMISSION_STRINGS.android.map((perm) => (
                    <div key={perm.key} className="p-3.5 rounded-xl bg-[#1c1b1b] border border-[#282828] space-y-1.5">
                      <div className="text-xs font-mono text-white font-bold">{perm.key}</div>
                      <div className="text-[11px] text-[#8e9285] leading-relaxed">{perm.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: AGE RATING & FAMILIES POLICY */}
        {/* ========================================================================= */}
        {activeTab === 'age_rating' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222] space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">family_restroom</span>
                <h2 className="text-xl font-bold text-white">Age Classification & Global Rating Certificates</h2>
              </div>
              <p className="text-xs text-[#8e9285]">
                Certified for junior sports academies and minor athlete participation under international age rating councils.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Apple Rating */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#282828] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Apple App Store</span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#c3f400] text-black">4+</span>
                  </div>
                  <ul className="text-[11px] text-[#8e9285] space-y-1 list-disc list-inside">
                    <li>Zero violent content</li>
                    <li>Zero mature/suggestive themes</li>
                    <li>Zero gambling / betting</li>
                    <li>Junior sports safeguarding verified</li>
                  </ul>
                </div>

                {/* Google Play IARC */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#282828] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Google Play IARC</span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#c3f400] text-black">EVERYONE</span>
                  </div>
                  <ul className="text-[11px] text-[#8e9285] space-y-1 list-disc list-inside">
                    <li>PEGI 3 (Europe / UK)</li>
                    <li>ESRB Everyone (North America)</li>
                    <li>USK 0 (Germany)</li>
                    <li>ACB G (Australia)</li>
                  </ul>
                </div>

                {/* Families Policy */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-green-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Families Policy</span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-green-500 text-black">COMPLIANT</span>
                  </div>
                  <ul className="text-[11px] text-[#8e9285] space-y-1 list-disc list-inside">
                    <li>Target Age: 5 & Under to 18+</li>
                    <li>Parental consent link required</li>
                    <li>Zero personalized ad SDKs</li>
                    <li>Compliant with Play Families Policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Deletion Simulation Modal */}
      {showDeletionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-[#333] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-400">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <h3 className="text-lg font-bold text-white">Test Account Deletion Flow</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeletionModal(false);
                  setDeletionConfirmed(false);
                }}
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-[#aaa] flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {!deletionConfirmed ? (
              <>
                <p className="text-xs text-[#aaa] leading-relaxed">
                  This simulates the App Store Review Guideline 5.1.1(v) compliant self-service account wipe.
                  Executing this will trigger an immediate revocation of all sessions, hard-purge private video bucket objects, scrub profile records, and issue a cryptographic deletion receipt.
                </p>

                <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] text-xs text-[#8e9285] space-y-1">
                  <div className="text-white font-bold">Target Account: demo_player_minor_01</div>
                  <div>Linked Guardian: guardian_jane_doe@example.com</div>
                  <div>Stored Deliveries: 14 Videos (684 MB KMS Encrypted)</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowDeletionModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateDeletion}
                    disabled={simulatingDeletion}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {simulatingDeletion ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Purging Cloud Buckets...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                        <span>Confirm & Hard Wipe Account</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">verified</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Account & Media Successfully Purged</h4>
                  <p className="text-xs text-[#8e9285] mt-1 max-w-sm mx-auto">
                    All cloud bucket objects purged in 142ms. JWT sessions revoked. Cryptographic deletion certificate generated.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#282828] text-[11px] font-mono text-[#c3f400] text-left">
                  Certificate: DEL-CERT-20260903-88F4A1<br />
                  Signature: SHA256:8b4f17c...<br />
                  Status: PERMANENTLY_PURGED
                </div>

                <button
                  onClick={() => {
                    setShowDeletionModal(false);
                    setDeletionConfirmed(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
