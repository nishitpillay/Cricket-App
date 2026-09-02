import React, { useState, useRef } from 'react';
import { UserProfile, TelestrationFeedback, DrillItem } from '../types';
import { playBeep } from '../utils/audioFeedback';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  feedbackData: TelestrationFeedback;
  drill?: DrillItem | null;
}

type CardTheme = 'cyber-neon' | 'pitch-emerald' | 'gold-masterclass';
type CardFormat = 'story' | 'square';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  feedbackData,
  drill
}) => {
  const [format, setFormat] = useState<CardFormat>('square');
  const [theme, setTheme] = useState<CardTheme>('cyber-neon');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const playerName = currentUser?.name || 'Alex Mercer';
  const playerAvatar = currentUser?.avatar || feedbackData.coachAvatar;
  const playerTier = currentUser?.tier || 'ELITE TIER';
  const playerLevel = currentUser?.level || 42;
  const drillTitle = drill?.title || feedbackData.sessionTitle || 'High Performance Net Session';
  const drillCategory = drill?.category || 'Batting Technique';
  const overallScore = 94;

  const metrics = [
    { label: 'Execution Rate', value: '96%', icon: 'verified' },
    { label: 'Impact Velocity', value: '142 km/h', icon: 'speed' },
    { label: 'Head Stillness', value: '98%', icon: 'track_changes' },
    { label: 'Biometrics', value: 'Grade A+', icon: 'military_tech' }
  ];

  const handleCopyLink = async () => {
    playBeep(880, 0.08);
    const dummyUrl = `https://pitchprecision.ai/share/drill/${feedbackData.id || 'sess-latest'}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(dummyUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCaption = async () => {
    playBeep(880, 0.08);
    const caption = `🏏 Just crushed my ${drillTitle} session on PitchPrecision! 🎯 Overall Score: ${overallScore}/100 with 98% Head Stability & 142 km/h bat speed. Analyzed by ${feedbackData.coachName}.\n\n#CricketTraining #PitchPrecision #Biomechanics #ElitePerformance`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
      }
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    playBeep(700, 0.1);
    const shareData = {
      title: `${playerName}'s Drill Analysis - PitchPrecision`,
      text: `Checked out my latest cricket drill result: ${drillTitle} (${overallScore}/100)!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadImage = () => {
    playBeep(980, 0.12);
    setIsDownloading(true);

    try {
      // Draw graphic card to HTML5 Canvas
      const canvas = document.createElement('canvas');
      const width = format === 'story' ? 1080 : 1080;
      const height = format === 'story' ? 1920 : 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        if (theme === 'cyber-neon') {
          bgGrad.addColorStop(0, '#0d1109');
          bgGrad.addColorStop(0.5, '#13190b');
          bgGrad.addColorStop(1, '#080a06');
        } else if (theme === 'pitch-emerald') {
          bgGrad.addColorStop(0, '#062015');
          bgGrad.addColorStop(0.5, '#0b3524');
          bgGrad.addColorStop(1, '#03120c');
        } else {
          bgGrad.addColorStop(0, '#1c1704');
          bgGrad.addColorStop(0.5, '#2b2308');
          bgGrad.addColorStop(1, '#110f02');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid lines effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 2;
        const step = 60;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Card Border Glow
        ctx.strokeStyle = theme === 'gold-masterclass' ? '#ffdb3c' : '#c3f400';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        // Header Brand
        ctx.fillStyle = theme === 'gold-masterclass' ? '#ffdb3c' : '#c3f400';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('PITCHPRECISION AI', 80, 110);

        ctx.fillStyle = '#c4c9ac';
        ctx.font = '22px sans-serif';
        ctx.fillText('OFFICIAL CRICKET TELEMETRY REPORT', 80, 145);

        // Player Info Block
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(playerName, 80, 240);

        ctx.fillStyle = theme === 'gold-masterclass' ? '#ffdb3c' : '#c3f400';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`${playerTier} • LEVEL ${playerLevel}`, 80, 280);

        // Drill Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px sans-serif';
        const displayTitle = drillTitle.length > 32 ? drillTitle.slice(0, 30) + '...' : drillTitle;
        ctx.fillText(displayTitle, 80, format === 'story' ? 440 : 380);

        ctx.fillStyle = '#a0a880';
        ctx.font = '28px sans-serif';
        ctx.fillText(`${drillCategory} • ${feedbackData.sessionDate}`, 80, format === 'story' ? 490 : 430);

        // Big Score Ring Center/Right
        const scoreX = width - 260;
        const scoreY = format === 'story' ? 450 : 280;
        ctx.beginPath();
        ctx.arc(scoreX, scoreY, 90, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.strokeStyle = theme === 'gold-masterclass' ? '#ffdb3c' : '#c3f400';
        ctx.lineWidth = 12;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${overallScore}`, scoreX, scoreY + 15);
        ctx.fillStyle = '#c4c9ac';
        ctx.font = '20px sans-serif';
        ctx.fillText('SCORE', scoreX, scoreY + 45);
        ctx.textAlign = 'left';

        // 4 Key Metrics Boxes
        const metricsStartY = format === 'story' ? 620 : 540;
        const colWidth = (width - 200) / 2;
        const boxHeight = 130;

        metrics.forEach((m, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = 80 + col * (colWidth + 40);
          const by = metricsStartY + row * (boxHeight + 25);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(bx, by, colWidth, boxHeight);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, colWidth, boxHeight);

          ctx.fillStyle = '#c4c9ac';
          ctx.font = '22px sans-serif';
          ctx.fillText(m.label, bx + 24, by + 45);

          ctx.fillStyle = theme === 'gold-masterclass' ? '#ffdb3c' : '#c3f400';
          ctx.font = 'bold 42px sans-serif';
          ctx.fillText(m.value, bx + 24, by + 98);
        });

        // Coach Review Quote
        const quoteY = format === 'story' ? 1040 : 880;
        ctx.fillStyle = 'rgba(255, 219, 60, 0.08)';
        ctx.fillRect(80, quoteY, width - 160, 130);
        ctx.strokeStyle = 'rgba(255, 219, 60, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(80, quoteY, width - 160, 130);

        ctx.fillStyle = '#ffdb3c';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`COACH VERDICT: ${feedbackData.coachName}`, 105, quoteY + 45);

        ctx.fillStyle = '#f0ede6';
        ctx.font = 'italic 24px sans-serif';
        const focusText = feedbackData.coreFocus.length > 70 ? feedbackData.coreFocus.slice(0, 68) + '...' : feedbackData.coreFocus;
        ctx.fillText(`"${focusText}"`, 105, quoteY + 90);

        // Footer Verification Tag
        const footerY = height - 90;
        ctx.fillStyle = '#888f70';
        ctx.font = '20px sans-serif';
        ctx.fillText('VERIFIED BY PITCHPRECISION TELEMETRY ENGINE • APP.PITCHPRECISION.AI', 80, footerY);

        // Trigger file download
        const dataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `PitchPrecision-${playerName.replace(/\s+/g, '_')}-DrillCard.png`;
        downloadLink.href = dataUrl;
        downloadLink.click();
      }
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const getThemeGradient = () => {
    if (theme === 'cyber-neon') {
      return 'from-[#141a0b] via-[#1b250d] to-[#0c1007] border-[#c3f400]/40 text-white';
    }
    if (theme === 'pitch-emerald') {
      return 'from-[#082016] via-[#0d3424] to-[#04120c] border-[#34d399]/40 text-white';
    }
    return 'from-[#1f1905] via-[#2f2509] to-[#120f03] border-[#ffdb3c]/40 text-white';
  };

  const getAccentColor = () => {
    if (theme === 'cyber-neon') return '#c3f400';
    if (theme === 'pitch-emerald') return '#34d399';
    return '#ffdb3c';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#181818] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#202020]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Social Performance Card</h3>
              <p className="text-[11px] text-[#c4c9ac]">Ready to share across Instagram, X, TikTok & WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Customization Controls: Format & Themes */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            {/* Format toggle */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider mr-1">Aspect:</span>
              <button
                onClick={() => setFormat('square')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  format === 'square'
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                    : 'bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">crop_square</span>
                1:1 Post
              </button>
              <button
                onClick={() => setFormat('story')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  format === 'story'
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                    : 'bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">crop_portrait</span>
                9:16 Story
              </button>
            </div>

            {/* Theme picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider mr-1">Theme:</span>
              <button
                onClick={() => setTheme('cyber-neon')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  theme === 'cyber-neon' ? 'scale-110 border-white ring-2 ring-[#c3f400]' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: '#c3f400' }}
                title="Cyber Neon"
              />
              <button
                onClick={() => setTheme('pitch-emerald')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  theme === 'pitch-emerald' ? 'scale-110 border-white ring-2 ring-[#34d399]' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: '#34d399' }}
                title="Pitch Emerald"
              />
              <button
                onClick={() => setTheme('gold-masterclass')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  theme === 'gold-masterclass' ? 'scale-110 border-white ring-2 ring-[#ffdb3c]' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: '#ffdb3c' }}
                title="Gold Masterclass"
              />
            </div>
          </div>

          {/* THE LIVE SOCIAL PREVIEW CARD */}
          <div className="flex justify-center w-full">
            <div
              ref={cardRef}
              className={`w-full max-w-md bg-gradient-to-br ${getThemeGradient()} border rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                format === 'story' ? 'aspect-[9/14]' : 'aspect-square'
              } flex flex-col justify-between`}
            >
              {/* Card Ambient Glow Elements */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: getAccentColor() }}
              />
              <div
                className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: getAccentColor() }}
              />

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-md"
                    style={{ backgroundColor: getAccentColor(), color: '#111' }}
                  >
                    ⚡
                  </div>
                  <div>
                    <span className="font-headline font-black text-xs tracking-wider" style={{ color: getAccentColor() }}>
                      PITCHPRECISION
                    </span>
                    <p className="text-[9px] text-[#c4c9ac] uppercase font-mono tracking-tight">AI Telemetry</p>
                  </div>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-[#c3f400]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">OFFICIAL</span>
                </div>
              </div>

              {/* Card Player & Drill Section */}
              <div className="flex flex-col gap-2 relative z-10 my-auto">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={playerAvatar}
                      alt={playerName}
                      className="w-11 h-11 rounded-full object-cover border-2 shadow-md"
                      style={{ borderColor: getAccentColor() }}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-headline font-extrabold text-base text-white leading-tight">
                        {playerName}
                      </h4>
                      <p className="text-[10px] font-semibold text-[#c4c9ac]">
                        {playerTier} • LVL {playerLevel}
                      </p>
                    </div>
                  </div>

                  {/* Big Score Circular Pill */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-black/40 border border-white/15 shadow-inner">
                    <span className="font-headline font-black text-xl leading-none" style={{ color: getAccentColor() }}>
                      {overallScore}
                    </span>
                    <span className="text-[8px] font-bold text-[#c4c9ac] uppercase tracking-wider">SCORE</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getAccentColor() }}>
                    {drillCategory} Drill Result
                  </span>
                  <h3 className="font-headline font-bold text-sm text-white line-clamp-1">
                    {drillTitle}
                  </h3>
                  <p className="text-[10px] text-[#c4c9ac] mt-0.5">{feedbackData.sessionDate}</p>
                </div>

                {/* Grid of 4 Key Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <div className="flex items-center gap-1 text-[9px] text-[#c4c9ac] font-medium">
                        <span className="material-symbols-outlined text-[12px]">{m.icon}</span>
                        <span>{m.label}</span>
                      </div>
                      <span className="font-headline font-extrabold text-sm text-white mt-0.5" style={{ color: getAccentColor() }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coach Takeaway Quote Pill */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#ffdb3c] text-[16px] shrink-0 mt-0.5">
                    format_quote
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/90 italic line-clamp-2 leading-tight">
                      "{feedbackData.coreFocus}"
                    </p>
                    <span className="text-[9px] text-[#c4c9ac] font-semibold block mt-0.5">
                      — {feedbackData.coachName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-[#c4c9ac] relative z-10">
                <span className="font-mono">#PitchPrecision #{drillCategory}</span>
                <span className="font-semibold text-white/80">app.pitchprecision.ai</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Download PNG */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-4 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#abd600] active:scale-95 transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Rendering PNG...' : 'Save PNG Card'}</span>
            </button>

            {/* Copy Social Caption */}
            <button
              onClick={handleCopyCaption}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-headline font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copiedCaption ? 'check' : 'content_copy'}
              </span>
              <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
            </button>

            {/* Native / Direct Share */}
            <button
              onClick={handleNativeShare}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-headline font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copiedLink ? 'check' : 'ios_share'}
              </span>
              <span>{copiedLink ? 'Link Copied!' : 'Share Result'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
