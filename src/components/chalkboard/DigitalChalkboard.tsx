import React, { useState, useRef, useEffect } from 'react';
import { ScreenType, FieldPlacementPreset } from '../../types';
import { mockFieldPresets } from '../../data/tacticsAndPlannerData';
import { OfflineStorageManager, SavedChalkboard } from '../../utils/offlineStore';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface DigitalChalkboardProps {
  onNavigate: (screen: ScreenType) => void;
}

interface PathPoint {
  x: number;
  y: number;
}

interface DrawnPath {
  points: PathPoint[];
  color: string;
  width: number;
  type: 'line' | 'arrow' | 'curve' | 'ball';
}

export const DigitalChalkboard: React.FC<DigitalChalkboardProps> = ({ onNavigate }) => {
  const [fieldPresets] = useState<FieldPlacementPreset[]>(mockFieldPresets);
  const [activePreset, setActivePreset] = useState<FieldPlacementPreset>(mockFieldPresets[0]);

  // Fielders positions on 0-100 coordinates
  const [fielders, setFielders] = useState(mockFieldPresets[0].positions);
  const [draggingFielderId, setDraggingFielderId] = useState<string | null>(null);

  // Drawing tool state
  const [drawingTool, setDrawingTool] = useState<'pen' | 'arrow' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#c3f400');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [paths, setPaths] = useState<DrawnPath[]>([]);
  const [currentPath, setCurrentPath] = useState<PathPoint[] | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Tactical Notes
  const [tacticalNotes, setTacticalNotes] = useState<string>(
    'Focus on protecting the off-side boundary against the wide yorker. Extra cover holds single.'
  );
  const [savedDiagrams, setSavedDiagrams] = useState<SavedChalkboard[]>([]);
  const [diagramTitle, setDiagramTitle] = useState<string>('T20 20th Over Defense');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setSavedDiagrams(OfflineStorageManager.getSavedChalkboards());
  }, []);

  const handleApplyPreset = (preset: FieldPlacementPreset) => {
    playBeep(700, 0.05);
    setActivePreset(preset);
    setFielders(preset.positions);
    setDiagramTitle(preset.name);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Convert client coordinate to SVG 0-800 x 0-600 viewBox
  const getSvgCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 800;
    const y = ((clientY - rect.top) / rect.height) * 600;
    return { x, y };
  };

  // Drawing handlers
  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingFielderId) return;
    const pos = getSvgCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([pos]);
  };

  const handleDrawMove = (e: React.MouseEvent | React.TouchEvent) => {
    // Handle fielder dragging
    if (draggingFielderId && svgRef.current) {
      const pos = getSvgCoordinates(e);
      const percentX = Math.max(5, Math.min(95, (pos.x / 800) * 100));
      const percentY = Math.max(5, Math.min(95, (pos.y / 600) * 100));

      setFielders((prev) =>
        prev.map((f) =>
          f.id === draggingFielderId
            ? { ...f, x: Math.round(percentX), y: Math.round(percentY) }
            : f
        )
      );
      return;
    }

    if (!isDrawing || !currentPath) return;
    const pos = getSvgCoordinates(e);
    setCurrentPath((prev) => (prev ? [...prev, pos] : [pos]));
  };

  const handleEndDraw = () => {
    if (draggingFielderId) {
      setDraggingFielderId(null);
      return;
    }

    if (isDrawing && currentPath && currentPath.length > 1) {
      setPaths((prev) => [
        ...prev,
        {
          points: currentPath,
          color: drawingTool === 'eraser' ? '#000000' : selectedColor,
          width: strokeWidth,
          type: drawingTool === 'arrow' ? 'arrow' : 'line'
        }
      ]);
    }
    setIsDrawing(false);
    setCurrentPath(null);
  };

  const handleClearCanvas = () => {
    playBeep(450, 0.08);
    setPaths([]);
  };

  const handleUndo = () => {
    playBeep(600, 0.04);
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleSaveDiagram = () => {
    playBallImpact();
    const newBoard: SavedChalkboard = {
      id: `board-${Date.now()}`,
      title: diagramTitle || 'Custom Tactical Setup',
      format: activePreset.format,
      fielders,
      paths: paths.map((p) => ({
        points: p.points,
        color: p.color,
        type: p.type
      })),
      notes: tacticalNotes,
      savedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    OfflineStorageManager.saveChalkboard(newBoard);
    setSavedDiagrams(OfflineStorageManager.getSavedChalkboards());
    showToast('Diagram saved to local offline memory!');
  };

  const handleLoadSavedBoard = (board: SavedChalkboard) => {
    playBeep(700, 0.05);
    setDiagramTitle(board.title);
    setFielders(board.fielders as any);
    setPaths(
      board.paths.map((p) => ({
        points: p.points,
        color: p.color,
        width: 3,
        type: p.type
      }))
    );
    setTacticalNotes(board.notes);
    showToast(`Loaded "${board.title}"`);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#1c260f] via-[#161f0d] to-[#202020] p-6 rounded-3xl border border-[#c3f400]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-[10px] uppercase tracking-wider">
              Tactical Whiteboard
            </span>
            <span className="text-xs text-[#ffdb3c] font-bold">Mid-Game Sketch Pad</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">
            Digital Chalkboard
          </h1>
          <p className="text-sm text-[#c4c9ac] mt-1 max-w-xl">
            Drag fielders, sketch delivery arcs, and diagram defensive field rings in real time. Works 100% offline at the pitch.
          </p>
        </div>

        {/* Action Save Button */}
        <button
          onClick={handleSaveDiagram}
          className="px-5 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.3)] shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Save Field Plan</span>
        </button>
      </div>

      {/* Preset Strategy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#201f1f] p-3 sm:p-4 rounded-2xl border border-white/10 glass">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#c4c9ac] shrink-0">Field Presets:</span>
          {fieldPresets.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                    : 'bg-black/30 text-[#c4c9ac] hover:text-white border border-white/5'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={diagramTitle}
          onChange={(e) => setDiagramTitle(e.target.value)}
          placeholder="Tactical Setup Title..."
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-[#c4c9ac]/40 focus:border-[#c3f400] outline-none w-full sm:w-60"
        />
      </div>

      {/* Main Interactive Chalkboard Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: 2D Cricket Ground SVG Canvas */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Drawing Tools Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#201f1f] p-2.5 rounded-2xl border border-white/10">
            {/* Tool Selection */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDrawingTool('pen')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  drawingTool === 'pen' ? 'bg-[#c3f400] text-[#161e00]' : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                }`}
                title="Freehand Sketch"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span className="hidden sm:inline">Draw</span>
              </button>

              <button
                onClick={() => setDrawingTool('arrow')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  drawingTool === 'arrow' ? 'bg-[#c3f400] text-[#161e00]' : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                }`}
                title="Tactical Movement Arrow"
              >
                <span className="material-symbols-outlined text-[18px]">trending_flat</span>
                <span className="hidden sm:inline">Arrow</span>
              </button>

              <button
                onClick={() => setDrawingTool('eraser')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  drawingTool === 'eraser' ? 'bg-[#ffb4ab] text-[#410002]' : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                }`}
                title="Eraser"
              >
                <span className="material-symbols-outlined text-[18px]">ink_eraser</span>
                <span className="hidden sm:inline">Erase</span>
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5">
              {['#c3f400', '#9cf0ff', '#ffb4ab', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor === c ? 'scale-125 border-white shadow-[0_0_8px_white]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Undo & Clear */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
                title="Undo last stroke"
              >
                <span className="material-symbols-outlined text-[18px]">undo</span>
              </button>
              <button
                onClick={handleClearCanvas}
                className="p-2 rounded-xl bg-black/30 hover:bg-red-500/20 text-[#ffb4ab] transition-colors cursor-pointer"
                title="Clear all drawings"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
            </div>
          </div>

          {/* 2D Oval Ground Canvas */}
          <div className="relative w-full aspect-[4/3] bg-[#0c160c] rounded-3xl overflow-hidden border border-[#c3f400]/20 shadow-2xl select-none touch-none">
            {/* SVG Interactive Surface */}
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-full cursor-crosshair"
              onMouseDown={handleStartDraw}
              onMouseMove={handleDrawMove}
              onMouseUp={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleEndDraw}
            >
              {/* Cricket Ground Boundary Oval */}
              <ellipse
                cx="400"
                cy="300"
                rx="370"
                ry="270"
                fill="#132313"
                stroke="#c3f400"
                strokeWidth="3"
                strokeDasharray="8,6"
              />

              {/* 30-Yard Circle */}
              <ellipse
                cx="400"
                cy="300"
                rx="210"
                ry="150"
                fill="none"
                stroke="rgba(195,244,0,0.3)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* Pitch Rectangle (Center) */}
              <rect
                x="376"
                y="180"
                width="48"
                height="240"
                rx="4"
                fill="#8f7a5b"
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Bowling & Batting Stumps / Crease */}
              <line x1="365" y1="210" x2="435" y2="210" stroke="#ffffff" strokeWidth="2" />
              <line x1="365" y1="390" x2="435" y2="390" stroke="#ffffff" strokeWidth="2" />
              {/* Batting Stumps */}
              <circle cx="395" cy="205" r="2.5" fill="#ffdb3c" />
              <circle cx="400" cy="205" r="2.5" fill="#ffdb3c" />
              <circle cx="405" cy="205" r="2.5" fill="#ffdb3c" />
              {/* Bowling Stumps */}
              <circle cx="395" cy="395" r="2.5" fill="#ffdb3c" />
              <circle cx="400" cy="395" r="2.5" fill="#ffdb3c" />
              <circle cx="405" cy="395" r="2.5" fill="#ffdb3c" />

              {/* Labels for Orientation */}
              <text x="400" y="55" textAnchor="middle" fill="#c4c9ac" fontSize="11" fontFamily="monospace" fontWeight="bold">
                BEHIND WICKETS / FINE LEG & THIRD MAN
              </text>
              <text x="400" y="575" textAnchor="middle" fill="#c4c9ac" fontSize="11" fontFamily="monospace" fontWeight="bold">
                STRAIGHT BOUNDARY (LONG-OFF / LONG-ON)
              </text>
              <text x="35" y="305" textAnchor="middle" fill="#c4c9ac" fontSize="10" fontFamily="monospace" transform="rotate(-90 35 305)">
                LEG SIDE (MID-WICKET / SQUARE LEG)
              </text>
              <text x="765" y="305" textAnchor="middle" fill="#c4c9ac" fontSize="10" fontFamily="monospace" transform="rotate(90 765 305)">
                OFF SIDE (COVER / POINT)
              </text>

              {/* Drawn Paths */}
              {paths.map((p, idx) => {
                const ptsStr = p.points.map((pt) => `${pt.x},${pt.y}`).join(' ');
                return (
                  <g key={idx}>
                    <polyline
                      points={ptsStr}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={p.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* If arrow, draw arrowhead on final segment */}
                    {p.type === 'arrow' && p.points.length >= 2 && (
                      <circle
                        cx={p.points[p.points.length - 1].x}
                        cy={p.points[p.points.length - 1].y}
                        r={p.width * 2}
                        fill={p.color}
                      />
                    )}
                  </g>
                );
              })}

              {/* Active Current Stroke */}
              {currentPath && currentPath.length > 1 && (
                <polyline
                  points={currentPath.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                  fill="none"
                  stroke={drawingTool === 'eraser' ? '#000000' : selectedColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Draggable Fielders Markers */}
              {fielders.map((fielder) => {
                const pixelX = (fielder.x / 100) * 800;
                const pixelY = (fielder.y / 100) * 600;
                const isDragging = draggingFielderId === fielder.id;

                return (
                  <g
                    key={fielder.id}
                    transform={`translate(${pixelX}, ${pixelY})`}
                    className="cursor-move"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingFielderId(fielder.id);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setDraggingFielderId(fielder.id);
                    }}
                  >
                    {/* Outer Glow on drag */}
                    {isDragging && (
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#c3f400" strokeWidth="2" className="animate-ping" />
                    )}

                    {/* Fielder Puck */}
                    <circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill={fielder.role === 'Keeper' ? '#ffdb3c' : fielder.role === 'Bowler' ? '#9cf0ff' : '#c3f400'}
                      stroke="#161e00"
                      strokeWidth="2.5"
                      className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-125 transition-transform"
                    />

                    {/* Role Icon inside puck */}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#161e00"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Inter"
                      pointerEvents="none"
                    >
                      {fielder.role === 'Keeper' ? 'WK' : fielder.role === 'Bowler' ? 'B' : fielder.role === 'Slip' ? 'S' : 'F'}
                    </text>

                    {/* Fielder Label Tag */}
                    <rect
                      x="-40"
                      y="16"
                      width="80"
                      height="16"
                      rx="4"
                      fill="#161e00"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y="28"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="Inter"
                      pointerEvents="none"
                    >
                      {fielder.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Col: Tactical Notes & Saved Diagrams */}
        <div className="flex flex-col gap-4">
          {/* Tactical Notes Card */}
          <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-2">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">sticky_note_2</span>
              Tactical Instructions
            </h3>

            <textarea
              rows={4}
              value={tacticalNotes}
              onChange={(e) => setTacticalNotes(e.target.value)}
              placeholder="Add field positioning instructions for the bowler or captain..."
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-[#c4c9ac]/40 focus:border-[#c3f400] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Saved Offline Diagrams Library */}
          <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-white">
                Saved Field Plans ({savedDiagrams.length})
              </h3>
              <span className="text-[10px] text-[#c3f400] font-mono">OFFLINE CACHE</span>
            </div>

            {savedDiagrams.length === 0 ? (
              <p className="text-xs text-[#c4c9ac]/60 italic py-2">
                No saved plans yet. Click "Save Field Plan" to store diagrams for offline use.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {savedDiagrams.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => handleLoadSavedBoard(board)}
                    className="p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#c3f400]/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <h4 className="font-headline font-bold text-xs text-white group-hover:text-[#c3f400] transition-colors truncate">
                        {board.title}
                      </h4>
                      <span className="text-[10px] text-[#c4c9ac] block mt-0.5">
                        {board.savedAt}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        OfflineStorageManager.deleteChalkboard(board.id);
                        setSavedDiagrams(OfflineStorageManager.getSavedChalkboards());
                      }}
                      className="text-gray-500 hover:text-[#ffb4ab] p-1"
                      title="Delete diagram"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs shadow-2xl animate-fadeIn flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
