import React, { useState } from 'react';
import { CoachVideoComment, CricketDiscipline } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface CoachVideoCommentsOverlayProps {
  comments: CoachVideoComment[];
  currentFrameTime: number;
  discipline: CricketDiscipline;
  onSeekToComment: (timestampSec: number) => void;
  onAddComment: (comment: Omit<CoachVideoComment, 'id'>) => void;
  isTelestratorActive: boolean;
  onToggleTelestrator: () => void;
}

export const CoachVideoCommentsOverlay: React.FC<CoachVideoCommentsOverlayProps> = ({
  comments,
  currentFrameTime,
  discipline,
  onSeekToComment,
  onAddComment,
  isTelestratorActive,
  onToggleTelestrator
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newPriority, setNewPriority] = useState<'technique' | 'high' | 'praise'>('technique');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);

  // Filter comments for active discipline or global
  const filteredComments = comments.filter(
    (c) => !c.discipline || c.discipline === discipline
  );

  const handlePlayVoice = (id: string, durationSec = 15) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
      return;
    }
    playBeep(880, 0.08);
    setPlayingVoiceId(id);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, durationSec * 500); // simulated fast playback
  };

  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playBallImpact();
    onAddComment({
      coachName: 'Coach Justin Langer',
      coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      coachRole: 'Master Specialist Coach',
      timestampSec: currentFrameTime,
      frameIndex: Math.round(currentFrameTime * 60),
      title: newTitle,
      textComment: newCommentText || 'Technical alignment reviewed at this keyframe.',
      priority: newPriority,
      discipline: discipline,
      voiceDurationSec: recordedDuration > 0 ? recordedDuration : undefined,
      voiceWaveform: recordedDuration > 0 ? [20, 50, 80, 95, 60, 40, 85, 70, 30, 15] : undefined,
      isResolved: false
    });

    setNewTitle('');
    setNewCommentText('');
    setRecordedDuration(0);
    setIsRecordingAudio(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#1c1b1f] border border-white/10 shadow-xl">
      {/* Header with Telestrator & Add Note Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm text-white">
              Coach Voice & Frame Critiques
            </h3>
            <p className="text-[11px] text-[#c4c9ac]">
              Timestamped frame markers & tactical voice notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Telestrator Drawing Toggle */}
          <button
            onClick={onToggleTelestrator}
            className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isTelestratorActive
                ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.4)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">draw</span>
            <span className="hidden sm:inline">{isTelestratorActive ? 'Telestrator Active' : 'Draw Telestrator'}</span>
          </button>

          {/* Add Comment Button */}
          <button
            onClick={() => {
              playBeep(700, 0.05);
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-headline font-bold flex items-center gap-1 hover:bg-[#abd600] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_comment</span>
            <span>Pin Frame Note</span>
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="flex flex-col gap-2.5 mt-1">
        {filteredComments.length === 0 ? (
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-center text-xs text-[#c4c9ac]">
            No coach comments pinned on this clip yet. Click <span className="text-[#c3f400] font-bold">Pin Frame Note</span> to add one.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isNearCurrent = Math.abs(currentFrameTime - comment.timestampSec) < 0.25;
            const isPlayingThisVoice = playingVoiceId === comment.id;

            return (
              <div
                key={comment.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isNearCurrent
                    ? 'bg-[#1e2a18] border-[#c3f400] shadow-md'
                    : 'bg-black/30 border-white/5 hover:border-white/15'
                }`}
                onClick={() => onSeekToComment(comment.timestampSec)}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.coachAvatar}
                      alt={comment.coachName}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{comment.coachName}</span>
                        <span className="text-[10px] text-[#c4c9ac]">({comment.coachRole})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {comment.priority === 'high' && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-mono font-bold">
                        HIGH PRIORITY
                      </span>
                    )}
                    {comment.priority === 'praise' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] text-[9px] font-mono font-bold">
                        MASTERY PRAISE
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[#c3f400] font-mono font-bold text-[10px]">
                      {comment.timestampSec.toFixed(1)}s (F{comment.frameIndex})
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                <h4 className="font-headline font-bold text-xs text-white mb-1">
                  {comment.title}
                </h4>
                <p className="text-xs text-[#c4c9ac] leading-relaxed mb-2">
                  {comment.textComment}
                </p>

                {/* Audio Voice Note Player (if available) */}
                {comment.voiceDurationSec && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice(comment.id, comment.voiceDurationSec);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                      isPlayingThisVoice
                        ? 'bg-[#c3f400]/20 border-[#c3f400]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">
                        {isPlayingThisVoice ? 'pause' : 'play_arrow'}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center gap-1">
                      {comment.voiceWaveform?.map((val, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all ${
                            isPlayingThisVoice ? 'bg-[#c3f400] animate-pulse' : 'bg-[#c4c9ac]/40'
                          }`}
                          style={{ height: `${Math.max(4, val / 4)}px` }}
                        />
                      ))}
                    </div>

                    <span className="font-mono text-[10px] text-[#c4c9ac] shrink-0">
                      {isPlayingThisVoice ? 'PLAYING...' : `VOICE NOTE (${comment.voiceDurationSec}s)`}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Coach Comment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-5 rounded-3xl bg-[#201f1f] border border-white/15 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[20px]">add_comment</span>
                <h3 className="font-headline font-bold text-base text-white">
                  Pin Coach Note at Frame {Math.round(currentFrameTime * 60)} ({currentFrameTime.toFixed(2)}s)
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveComment} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#c4c9ac] block mb-1">
                  Key Technical Observation / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Elbow Collapsing at Impact"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-[#c3f400] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#c4c9ac] block mb-1">
                  Corrective Drill & Biomechanical Cue
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the movement adjustment, angle target, or follow-up drill..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-[#c3f400] outline-none resize-none"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-xs font-bold text-[#c4c9ac] block mb-1">
                  Critique Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['technique', 'high', 'praise'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                        newPriority === p
                          ? p === 'high'
                            ? 'bg-red-500/20 text-red-300 border-red-500'
                            : p === 'praise'
                            ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]'
                            : 'bg-sky-500/20 text-sky-300 border-sky-500'
                          : 'bg-black/30 text-[#c4c9ac] border-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Voice Recorder */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRecordingAudio ? 'bg-red-500 animate-ping' : 'bg-[#c4c9ac]'}`} />
                  <span className="text-xs text-white font-medium">
                    {isRecordingAudio ? `Recording voice note... (${recordedDuration}s)` : 'Attach Coach Voice Note'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playBeep(isRecordingAudio ? 600 : 900, 0.05);
                    if (!isRecordingAudio) {
                      setIsRecordingAudio(true);
                      setRecordedDuration(12);
                    } else {
                      setIsRecordingAudio(false);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    isRecordingAudio ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isRecordingAudio ? 'stop' : 'mic'}
                  </span>
                  <span>{isRecordingAudio ? 'Stop' : 'Record'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-bold hover:bg-[#abd600] transition-colors cursor-pointer shadow-md"
                >
                  Save Frame Critique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
