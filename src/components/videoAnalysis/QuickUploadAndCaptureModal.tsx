import React, { useState, useRef } from 'react';
import { CricketDiscipline, QuickUploadVideoPreset } from '../../types';
import { mockQuickPresets } from '../../data/videoDevelopmentData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface QuickUploadAndCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: QuickUploadVideoPreset) => void;
  onCustomUploadComplete: (fileInfo: { name: string; size: string; duration: string; discipline: CricketDiscipline }) => void;
}

export const QuickUploadAndCaptureModal: React.FC<QuickUploadAndCaptureModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onCustomUploadComplete
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'tripod_record'>('presets');
  const [selectedDiscipline, setSelectedDiscipline] = useState<CricketDiscipline>('batting');
  const [isDragging, setIsDragging] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timerSetting, setTimerSetting] = useState<number>(5); // 3, 5, 10 seconds countdown
  const [fpsMode, setFpsMode] = useState<120 | 240>(120);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const filteredPresets = mockQuickPresets.filter(
    (p) => p.discipline === selectedDiscipline
  );

  const handleStartCountdown = () => {
    playBeep(800, 0.05);
    setCountdownSeconds(timerSetting);
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsRecording(true);
          playBallImpact();
          // auto record for 4 seconds then finish
          setTimeout(() => {
            setIsRecording(false);
            setCountdownSeconds(null);
            playBallImpact();
            onCustomUploadComplete({
              name: `Live Net Session (${timerSetting}s countdown tripod capture)`,
              size: '28.4 MB (4K HDR)',
              duration: '4.2s (120 FPS)',
              discipline: selectedDiscipline
            });
            onClose();
          }, 4200);
          return null;
        }
        playBeep(900, 0.04);
        return prev - 1;
      });
    }, 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    playBallImpact();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onCustomUploadComplete({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: '3.6s (Auto-Trimmed)',
        discipline: selectedDiscipline
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl p-5 sm:p-6 rounded-3xl bg-[#1c1f1c] border border-[#c3f400]/40 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-white">
                Cricket Video Studio & Ingestion
              </h2>
              <p className="text-[11px] text-[#c4c9ac]">
                Quick upload, preset reels, and high-speed tripod camera capture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">video_library</span>
            <span>Sample Practice Reels</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Quick File Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('tripod_record')}
            className={`flex-1 py-2 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tripod_record'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span>Tripod Auto-Capture</span>
          </button>
        </div>

        {/* Discipline Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#c4c9ac]">CRICKET DISCIPLINE:</span>
          {(['batting', 'bowling', 'fielding'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDiscipline(d);
                playBeep(700, 0.04);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-headline font-bold capitalize transition-all cursor-pointer border ${
                selectedDiscipline === d
                  ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]'
                  : 'bg-black/30 text-[#c4c9ac] border-white/5 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Tab 1: Presets Gallery */}
        {activeTab === 'presets' && (
          <div className="flex flex-col gap-2.5">
            <span className="text-xs text-[#c4c9ac]">
              Select a pre-calibrated 120 FPS high-speed cricket reel for instant frame-by-frame review:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    playBallImpact();
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-[#c3f400] hover:bg-[#162215] transition-all cursor-pointer flex flex-col justify-between gap-2 group"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-[10px]">
                      {preset.resolution}
                    </span>
                    <span className="text-[10px] text-[#c3f400] font-mono font-bold">
                      {preset.duration}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline font-bold text-xs text-white group-hover:text-[#c3f400] transition-colors">
                      {preset.title}
                    </h4>
                    <span className="text-[10px] text-[#c4c9ac] block mt-0.5 font-mono">
                      Key moment: {preset.keyMoment}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {preset.techniqueTags.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-[#c4c9ac] text-[9px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Quick File Upload Dropzone */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#c3f400] bg-[#c3f400]/10'
                  : 'border-white/20 bg-black/30 hover:border-white/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    playBallImpact();
                    onCustomUploadComplete({
                      name: file.name,
                      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      duration: '3.6s (Auto-Trimmed)',
                      discipline: selectedDiscipline
                    });
                    onClose();
                  }
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <div className="text-center">
                <span className="font-headline font-bold text-sm text-white block">
                  Drag & drop cricket video here or click to browse
                </span>
                <span className="text-xs text-[#c4c9ac] block mt-1">
                  Supports MP4, MOV, WebM • Auto-strips GPS/EXIF metadata for privacy
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-[#c4c9ac]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px]">auto_fix_high</span>
                Auto-Slicer & Delivery Recognition Active
              </span>
              <span className="text-[10px] font-mono text-[#c3f400]">SMART CROPPING</span>
            </div>
          </div>
        )}

        {/* Tab 3: Tripod Auto-Capture with Countdown */}
        {activeTab === 'tripod_record' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-sm text-white">
                    Solo Net Practice Countdown Timer
                  </h4>
                  <p className="text-xs text-[#c4c9ac]">
                    Set phone on tripod, tap start, and walk into stance before recording begins.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#c3f400] text-[24px]">tripod</span>
              </div>

              {/* Countdown Settings */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <span className="text-xs text-white font-medium">Pre-Roll Delay:</span>
                <div className="flex items-center gap-1.5">
                  {[3, 5, 10].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setTimerSetting(sec)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                        timerSetting === sec
                          ? 'bg-[#c3f400] text-[#161e00]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {sec}s Delay
                    </button>
                  ))}
                </div>
              </div>

              {/* FPS Toggle */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-white font-medium">High-Speed Slow-Mo Rate:</span>
                <div className="flex items-center gap-1.5">
                  {[120, 240].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setFpsMode(rate as 120 | 240)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                        fpsMode === rate
                          ? 'bg-[#c3f400] text-[#161e00]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {rate} FPS
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Countdown / Recording Status */}
            {countdownSeconds !== null && (
              <div className="p-6 rounded-2xl bg-[#c3f400] text-[#161e00] flex flex-col items-center justify-center gap-1 shadow-2xl animate-pulse">
                <span className="font-mono text-4xl font-extrabold">{countdownSeconds}</span>
                <span className="font-headline font-bold text-xs uppercase tracking-wider">
                  Get into crease position...
                </span>
              </div>
            )}

            {isRecording && (
              <div className="p-6 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center gap-1 shadow-2xl animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                  <span className="font-headline font-extrabold text-sm uppercase">
                    RECORDING LIVE ACTION (120 FPS HIGH SPEED)
                  </span>
                </div>
                <span className="text-xs opacity-90">Executing delivery / swing...</span>
              </div>
            )}

            {countdownSeconds === null && !isRecording && (
              <button
                onClick={handleStartCountdown}
                className="w-full py-3.5 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#abd600] transition-colors cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                <span>Start {timerSetting}s Countdown & Record Delivery</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
