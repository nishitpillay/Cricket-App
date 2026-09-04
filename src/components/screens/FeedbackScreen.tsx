import React, { useState } from 'react';
import { ScreenType, TelestrationFeedback, UserProfile, DrillItem } from '../../types';
import { mockTelestration } from '../../data/mockData';
import { playBeep } from '../../utils/audioFeedback';
import { ShareCardModal } from '../ShareCardModal';
import { BeehiveVisualizer } from '../telemetry/BeehiveVisualizer';
import { NetSessionPlaylistFeed } from '../telemetry/NetSessionPlaylistFeed';

interface FeedbackScreenProps {
  onNavigate: (screen: ScreenType) => void;
  feedbackData?: TelestrationFeedback;
  currentUser?: UserProfile;
  drill?: DrillItem | null;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  onNavigate,
  feedbackData = mockTelestration,
  currentUser,
  drill
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [showBeehiveAnalysis, setShowBeehiveAnalysis] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'coach' | 'player'; text: string; time: string }[]>([
    {
      sender: 'coach',
      text: 'Alex, take a close look at the head stability circle at 0:12. You are dropping into the stroke slightly too early.',
      time: '10:45 AM'
    },
    {
      sender: 'player',
      text: 'Got it Coach Mark! Should I try the cone touch drill before my next net session?',
      time: '10:48 AM'
    },
    {
      sender: 'coach',
      text: 'Yes, 3 sets of 10 repetitions will groove that stillness.',
      time: '10:50 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [sharedToast, setSharedToast] = useState(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    playBeep(880, 0.08);
    const newMsg = {
      sender: 'player' as const,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated coach reply
    setTimeout(() => {
      playBeep(980, 0.12);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: 'Excellent focus! Keep tracking the top hand dominance on your swing arc.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleShare = () => {
    playBeep(700, 0.1);
    setIsShareModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-[#131313] pb-28 max-w-4xl mx-auto">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg height="100%" width="100%">
          <defs>
            <pattern id="gridPat" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#444933" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPat)" />
        </svg>
      </div>

      <div className="flex flex-col w-full z-10 px-4 sm:px-6 gap-5 pt-3">
        {/* Top Section: Video Frame Analysis */}
        <div className="relative w-full rounded-2xl overflow-hidden glass shadow-2xl border border-white/10 pb-3">
          <div className="relative w-full aspect-video bg-[#0e0e0e] overflow-hidden">
            {/* Annotated Video Frame Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url('${feedbackData.frameImage}')` }}
            />

            {/* Telestration Visual Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Head Circle Highlight */}
              <div className="absolute top-[18%] left-[45%] w-10 h-10 rounded-full border-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse" />
              {/* Impact Point Reticle */}
              <div className="absolute top-[48%] left-[58%] w-6 h-6 rounded-full border border-[#c3f400] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] shadow-[0_0_6px_#c3f400]" />
              </div>
            </div>

            {/* Play Overlay / Scrub Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/90 to-transparent flex items-end px-3 pb-2">
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => {
                    playBeep(700, 0.1);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-8 h-8 rounded-full bg-[#c3f400]/20 backdrop-blur-md flex items-center justify-center border border-[#c3f400]/50 hover:bg-[#c3f400] hover:text-[#161e00] transition-colors text-[#c3f400] shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                {/* Scrubber track */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProg = Math.round((clickX / rect.width) * 100);
                    setProgress(Math.max(0, Math.min(100, newProg)));
                  }}
                  className="h-1.5 flex-1 bg-[#353534] rounded-full overflow-hidden relative cursor-pointer"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[#c3f400] rounded-full shadow-[0_0_8px_rgba(195,244,0,0.8)] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <span className="text-xs text-[#c4c9ac] font-medium shrink-0 font-mono">
                  {feedbackData.videoCurrentTime} / {feedbackData.videoDuration}
                </span>
              </div>
            </div>

            {/* Premium Gold Tag */}
            <div className="absolute top-3 right-3 bg-[#ffdb3c] text-[#221b00] px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-[#ffdb3c]/40 backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="font-headline font-extrabold text-[10px] uppercase tracking-wider">
                Expert Analysis
              </span>
            </div>
          </div>

          <div className="px-3 pt-3 flex justify-between items-center">
            <div>
              <h2 className="font-headline font-bold text-lg text-white">
                {feedbackData.sessionTitle}
              </h2>
              <p className="text-xs text-[#c4c9ac]">{feedbackData.sessionDate}</p>
            </div>
            <button
              onClick={handleShare}
              className="text-[#c3f400] flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#c3f400]/30 bg-[#c3f400]/10 hover:bg-[#c3f400]/20 transition-colors text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Share toast */}
        {sharedToast && (
          <div className="p-2.5 rounded-xl bg-[#201f1f] border border-[#c3f400] text-xs font-bold text-[#c3f400] text-center shadow-[0_0_15px_rgba(195,244,0,0.3)] animate-fadeIn">
            ✓ Analysis video link copied to clipboard!
          </div>
        )}

        {/* Coach Profile Strip */}
        <div className="flex items-center gap-3.5 bg-[#201f1f]/80 backdrop-blur-lg rounded-2xl p-3.5 border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#ffdb3c]/15 blur-xl rounded-full pointer-events-none" />
          <img
            alt={feedbackData.coachName}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#ffdb3c] relative z-10 shadow-md"
            src={feedbackData.coachAvatar}
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 z-10">
            <p className="text-[10px] text-[#c4c9ac] uppercase font-bold tracking-wider">Analyzed By</p>
            <p className="font-headline font-bold text-base text-white leading-tight">
              {feedbackData.coachName}
            </p>
          </div>
          <button
            onClick={() => {
              playBeep(750, 0.08);
              setShowCoachChat(!showCoachChat);
            }}
            title="Chat with Coach"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all z-10 ${
              showCoachChat
                ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                : 'bg-[#2a2a2a] border-white/10 text-white hover:text-[#c3f400]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">forum</span>
          </button>
        </div>

        {/* Coach Live Messages Drawer */}
        {showCoachChat && (
          <div className="glass rounded-2xl p-4 border border-[#c3f400]/30 flex flex-col gap-3 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
                <span className="text-xs font-bold text-[#c3f400]">
                  Accredited Technical Feedback • {feedbackData.coachName}
                </span>
              </div>
              <button
                onClick={() => setShowCoachChat(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Junior Safeguard Notice & 2-Way Guardian CC */}
            {currentUser?.isJunior && (
              <div className="p-2.5 rounded-xl bg-[#121c12] border border-[#4ade80]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4ade80] text-[18px]">family_restroom</span>
                  <div>
                    <span className="text-[#4ade80] font-bold text-[11px] block">
                      Junior Safeguard • Guardian CC Active
                    </span>
                    <span className="text-[10px] text-[#c4c9ac]">
                      All coaching messages copied to {currentUser.guardianInfo?.guardianEmail || 'parent@guardian.com'}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                  AUDITED
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] rounded-xl p-2.5 text-xs ${
                    msg.sender === 'coach'
                      ? 'bg-white/5 border border-white/10 text-white self-start'
                      : 'bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#e5e2e1] self-end'
                  }`}
                >
                  <span className="text-[9px] font-bold text-[#c4c9ac] mb-0.5">
                    {msg.sender === 'coach' ? feedbackData.coachName : 'You'} • {msg.time}
                  </span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask coach about your head position..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c3f400]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] font-bold text-xs hover:bg-[#abd600] cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Coach's Insights Bento Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Key Takeaway Card (Core Focus) */}
          <div className="glass-gold rounded-2xl p-4 sm:p-5 border border-[#ffdb3c]/35 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffdb3c]/10 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#ffdb3c]/20 flex items-center justify-center border border-[#ffdb3c]/50">
                <span className="material-symbols-outlined text-[#ffdb3c] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lightbulb
                </span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#ffdb3c]">Core Focus</h3>
            </div>
            <p className="text-sm text-[#e5e2e1] relative z-10 leading-relaxed">
              {feedbackData.coreFocus}
            </p>
          </div>

          {/* Metrics Split: Strengths vs Adjustments */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Strengths */}
            <div className="glass rounded-2xl p-4 border border-[#c3f400]/25 shadow-lg flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#c3f400] mb-1">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  trending_up
                </span>
                <span className="font-headline font-bold text-xs uppercase tracking-wider">
                  Strengths
                </span>
              </div>
              <ul className="flex flex-col gap-2 text-xs text-[#c4c9ac]">
                {feedbackData.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c3f400] mt-1.5 shrink-0" />
                    <span className="text-white">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adjustments */}
            <div className="glass rounded-2xl p-4 border border-[#ffb4ab]/30 shadow-lg flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#ffb4ab] mb-1">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  trending_down
                </span>
                <span className="font-headline font-bold text-xs uppercase tracking-wider">
                  Adjustments
                </span>
              </div>
              <ul className="flex flex-col gap-2 text-xs text-[#c4c9ac]">
                {feedbackData.adjustments.map((adj, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] mt-1.5 shrink-0" />
                    <span className="text-white">{adj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assigned Drill Recommendation */}
          <div
            onClick={() => {
              playBeep(880, 0.1);
              onNavigate('drill-details');
            }}
            className="glass rounded-2xl p-4 border-l-4 border-l-[#c3f400] border-t border-r border-b border-white/10 flex items-center justify-between shadow-xl group hover:bg-[#2a2a2a] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#353534] flex items-center justify-center group-hover:bg-[#c3f400]/20 transition-colors">
                <span className="material-symbols-outlined text-[#c3f400] text-[22px]">fitness_center</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors">
                  Assigned Drill
                </h4>
                <p className="text-xs text-[#c4c9ac]">
                  {feedbackData.assignedDrillTitle} {feedbackData.assignedDrillSets}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#c3f400] text-xs font-bold">
              <span>Start</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">
                chevron_right
              </span>
            </div>
          </div>

          {/* Fulltrack AI Stumps Beehive & 3D Flight Arc Section */}
          <div className="glass rounded-2xl p-4 border border-white/10 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[22px]">sports_cricket</span>
                <h4 className="font-headline font-bold text-sm text-white">
                  Hawk-Eye Stumps Beehive & 3D Flight Arc
                </h4>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400]">
                  FULLTRACK
                </span>
              </div>
              <button
                onClick={() => setShowBeehiveAnalysis(!showBeehiveAnalysis)}
                className="text-xs font-bold text-[#c3f400] hover:underline cursor-pointer"
              >
                {showBeehiveAnalysis ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showBeehiveAnalysis && (
              <div className="pt-2 animate-fadeIn">
                <BeehiveVisualizer compact={true} />
              </div>
            )}
          </div>

          {/* Fulltrack Net Session Playlist Feed Button */}
          <div
            onClick={() => {
              playBeep(750, 0.05);
              setShowPlaylistModal(true);
            }}
            className="p-4 rounded-2xl bg-gradient-to-r from-[#1c1d1a] to-[#141512] border border-white/10 hover:border-[#c3f400]/40 flex items-center justify-between shadow-xl cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">video_library</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors">
                    Ball-by-Ball Auto-Slicer Playlist
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#c3f400]/20 text-[#c3f400]">
                    12 CLIPS
                  </span>
                </div>
                <p className="text-xs text-[#c4c9ac]">
                  Browse slow-mo clips, Hawk-Eye pitch maps, and coach tags for this spell
                </p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white font-headline font-bold text-xs flex items-center gap-1 group-hover:bg-[#c3f400] group-hover:text-[#161e00] transition-colors shadow-md">
              <span>Open Reel</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Social Share Callout Card */}
          <div
            onClick={handleShare}
            className="p-4 rounded-2xl bg-gradient-to-r from-[#1b250d] to-[#12160b] border border-[#c3f400]/30 flex items-center justify-between shadow-xl hover:border-[#c3f400] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#c3f400]/20 border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">share</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors">
                    Share Drill Card
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#c3f400] text-[#161e00]">
                    94/100
                  </span>
                </div>
                <p className="text-xs text-[#c4c9ac]">
                  Export a high-res graphic report for Instagram, X & TikTok
                </p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center gap-1 group-hover:bg-[#abd600] transition-colors shadow-md">
              <span>Share</span>
              <span className="material-symbols-outlined text-[16px]">ios_share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fulltrack Net Session Playlist Feed Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 p-4 sm:p-6 shadow-2xl">
            <NetSessionPlaylistFeed onClose={() => setShowPlaylistModal(false)} />
          </div>
        </div>
      )}

      {/* Social Media Share Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentUser={currentUser}
        feedbackData={feedbackData}
        drill={drill}
      />
    </div>
  );
};
