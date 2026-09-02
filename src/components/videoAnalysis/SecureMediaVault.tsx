import React, { useState, useEffect } from 'react';
import { secureFetch } from '../../utils/authSecurityManager';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface VideoItem {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  durationSec: number;
  uploadedBy: string;
  uploadedAt: string;
  isPrivate: boolean;
  hasMalware: boolean;
  thumbnailDataUrl: string;
  metadataCleaned: boolean;
  signedUrl: string;
  expiresInSeconds: number;
}

export const SecureMediaVault: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [relationshipActive, setRelationshipActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual mock upload fields
  const [mockFileName, setMockFileName] = useState('cover_drive_practice.mp4');
  const [mockMimeType, setMockMimeType] = useState('video/mp4');
  const [mockFileSizeMB, setMockFileSizeMB] = useState('12.5');
  const [mockDuration, setMockDuration] = useState('7.2');
  const [useMaliciousFilename, setUseMaliciousFilename] = useState(false);
  const [mismatchMagicBytes, setMismatchMagicBytes] = useState(false);

  // Load videos
  const fetchVideos = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await secureFetch('/api/media/list');
      const data = await res.json();
      if (res.ok && data.success) {
        setVideos(data.videos);
        setRelationshipActive(data.activeCoachingRelationship);
      } else {
        setErrorMessage(data.error || 'Failed to fetch secured videos.');
      }
    } catch (err) {
      setErrorMessage('Network error contacting media secure gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleToggleRelationship = async () => {
    playBeep(700, 0.08);
    try {
      const res = await secureFetch('/api/media/relationship/toggle', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRelationshipActive(data.activeCoachingRelationship);
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
        // Refresh video list to reflect active access controls
        fetchVideos();
      }
    } catch (err) {
      setErrorMessage('Failed to change relationship policy.');
    }
  };

  const handleMockUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    playBeep(880, 0.1);

    const sizeBytes = Math.round(parseFloat(mockFileSizeMB) * 1024 * 1024);
    const finalFilename = useMaliciousFilename ? 'eicar-malware-test.mp4' : mockFileName;

    // Simulated magic bytes: if mismatch is selected, we pass a corrupted string, otherwise valid 'ftyp' MP4 magic bytes
    const base64Contents = mismatchMagicBytes 
      ? btoa('MZXXXXXXXXXXXX - PE Executable Polyglot Header Trap') 
      : btoa('....ftypmp42isom....moov....');

    try {
      const res = await secureFetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: finalFilename,
          mimeType: mockMimeType,
          fileSizeBytes: sizeBytes,
          durationSec: parseFloat(mockDuration),
          fileContentsBase64: base64Contents
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playBallImpact();
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 4000);
        fetchVideos();
      } else {
        setErrorMessage(data.error || 'Upload validation rejected.');
      }
    } catch (err) {
      setErrorMessage('Network error uploading video.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Wipe video permanently? This action cannot be undone.')) return;
    playBeep(440, 0.1);

    try {
      const res = await secureFetch(`/api/media/video/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchVideos();
      } else {
        setErrorMessage(data.error || 'Delete failed.');
      }
    } catch (err) {
      setErrorMessage('Network error purging media.');
    }
  };

  const handlePlayStream = async (id: string) => {
    playBeep(900, 0.05);
    try {
      const res = await secureFetch(`/api/media/stream/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`ACCESS VERIFIED:\nStreaming secured video via signed URL:\n${data.streamUrl}`);
      } else {
        setErrorMessage(data.error || 'Stream validation failed.');
      }
    } catch (err) {
      setErrorMessage('Failed to access secure video stream.');
    }
  };

  return (
    <div className="bg-[#181818] border border-white/5 rounded-3xl p-5 sm:p-6 space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-headline font-bold text-base text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400]">video_stable</span>
            Video & Media Security (MASVS Compliance)
          </h2>
          <p className="text-xs text-[#c4c9ac] mt-1">
            Zero Raw URLs • Short-Lived Signed Token Expirations • Anti-Malware Sandbox • Relationship Access Control
          </p>
        </div>

        {/* Coach Access Toggle */}
        <button
          onClick={handleToggleRelationship}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            relationshipActive 
              ? 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40' 
              : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {relationshipActive ? 'handshake' : 'gpp_bad'}
          </span>
          <span>{relationshipActive ? 'Coaching Relationship: ACTIVE' : 'Relationship: REMOVED (Coach Blocked)'}</span>
        </button>
      </div>

      {/* Warning / Success Toast */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
          <strong>SECURE GATEWAY CHECK FAILED:</strong> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] text-xs font-semibold">
          {successMessage}
        </div>
      )}

      {/* Main Content Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Sandbox */}
        <div className="lg:col-span-5 bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9cf0ff] text-[20px]">shield</span>
            <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Security Inspection Sandbox</h3>
          </div>
          <p className="text-[11px] text-[#c4c9ac]">
            Run deep inspection validations on file headers, malware patterns, file size limits, and max video durations.
          </p>

          <form onSubmit={handleMockUpload} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[#c4c9ac] uppercase font-bold mb-1">Filename</label>
                <input
                  type="text"
                  value={mockFileName}
                  onChange={(e) => setMockFileName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono"
                  placeholder="swing.mp4"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#c4c9ac] uppercase font-bold mb-1">MIME Type</label>
                <select
                  value={mockMimeType}
                  onChange={(e) => setMockMimeType(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-white"
                >
                  <option value="video/mp4">video/mp4 (Standard)</option>
                  <option value="video/quicktime">video/quicktime (MOV)</option>
                  <option value="video/x-msvideo">video/x-msvideo (AVI)</option>
                  <option value="application/x-sh">application/x-sh (Forbidden)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[#c4c9ac] uppercase font-bold mb-1">File Size (MB)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mockFileSizeMB}
                  onChange={(e) => setMockFileSizeMB(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono"
                  placeholder="12.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#c4c9ac] uppercase font-bold mb-1">Duration (Sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mockDuration}
                  onChange={(e) => setMockDuration(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono"
                  placeholder="5.4"
                />
              </div>
            </div>

            {/* Simulated Vulnerabilities checkboxes */}
            <div className="space-y-2 p-3 bg-black/40 border border-white/5 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-white">
                <input
                  type="checkbox"
                  checked={useMaliciousFilename}
                  onChange={(e) => setUseMaliciousFilename(e.target.checked)}
                  className="accent-[#c3f400]"
                />
                <span className="text-red-400 font-bold">Inject Malware Virus Signature</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-white">
                <input
                  type="checkbox"
                  checked={mismatchMagicBytes}
                  onChange={(e) => setMismatchMagicBytes(e.target.checked)}
                  className="accent-[#c3f400]"
                />
                <span className="text-amber-400 font-bold">Corrupt Magic Bytes Signature</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={uploadLoading}
              className="w-full py-2.5 bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs rounded-xl hover:bg-[#abd600] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {uploadLoading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>Scanning & Sanitizing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">security_scan</span>
                  <span>Inspect & Secure Upload</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Video Listings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Secure Private Media Vault</h3>
            <span className="text-[10px] font-mono text-[#c4c9ac] bg-white/5 px-2.5 py-1 rounded">
              {videos.length} VIDEOS ENCRYPTED
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-2">
              <span className="material-symbols-outlined text-white text-[32px] animate-spin">sync</span>
              <p className="text-xs text-[#c4c9ac]">Contacting secure storage servers...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center bg-[#201f1f] border border-white/5 rounded-2xl">
              <span className="material-symbols-outlined text-[#8e9285] text-[36px] mb-2">video_library</span>
              <p className="text-xs text-[#c4c9ac]">Zero videos stored in vault or access is completely revoked.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((vid) => (
                <div key={vid.id} className="p-4 bg-[#201f1f] border border-white/10 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Simulated Server-Side generated thumbnail rendered securely via frame-grabber */}
                    <div 
                      className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: vid.thumbnailDataUrl }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-xs text-white truncate max-w-[130px]">{vid.fileName}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-mono border border-red-500/20 uppercase font-bold">
                          PRIVATE
                        </span>
                      </div>
                      <p className="text-[10px] text-[#c4c9ac] font-mono mt-0.5">
                        {vid.mimeType} • {(vid.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB • {vid.durationSec}s
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    {/* Temporary Signed URL indicator */}
                    <div className="p-1.5 rounded bg-black/40 text-[9px] font-mono text-[#c4c9ac] flex items-center justify-between">
                      <span>Temporary Signed URL:</span>
                      <span className="text-[#c3f400] font-bold">Expires in {vid.expiresInSeconds}s</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayStream(vid.id)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-headline font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">play_circle</span>
                        <span>Stream</span>
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] flex items-center justify-center cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
