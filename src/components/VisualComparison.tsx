import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Columns, Sliders, Maximize2, Minimize2, Sparkles, AlertTriangle, Upload, Eye } from 'lucide-react';
import { LocationViewAngle } from '../types';

interface VisualComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  locationName: string;
  views?: LocationViewAngle[];
  onCustomImageLoaded?: (before: string, after: string) => void;
}

export const VisualComparison: React.FC<VisualComparisonProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Current State — Mineral Heat Island',
  afterLabel = 'Adapted Vision — Sponge Infrastructure',
  locationName,
  views,
  onCustomImageLoaded,
}) => {
  // View angle state (Front View vs Side View)
  const [activeViewId, setActiveViewId] = useState<string>(
    views && views.length > 0 ? views[0].id : 'default'
  );

  // Current active view data
  const currentView = views?.find((v) => v.id === activeViewId);

  const baseBefore = currentView ? currentView.beforeImage : beforeImage;
  const baseAfter = currentView ? currentView.afterImage : afterImage;
  const activeBeforeLabel = currentView?.beforeLabel || beforeLabel;
  const activeAfterLabel = currentView?.afterLabel || afterLabel;

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [displayMode, setDisplayMode] = useState<'slider' | 'side-by-side'>('slider');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);
  const [customBefore, setCustomBefore] = useState<string | null>(null);
  const [customAfter, setCustomAfter] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeBefore = customBefore || baseBefore;
  const activeAfter = customAfter || baseAfter;

  // Sync view ID and reset error state whenever location or views change
  useEffect(() => {
    if (views && views.length > 0) {
      setActiveViewId(views[0].id);
    } else {
      setActiveViewId('default');
    }
    setBeforeError(false);
    setAfterError(false);
    setCustomBefore(null);
    setCustomAfter(null);
  }, [locationName, beforeImage, afterImage, views]);

  // Reset errors when view angle changes within same location
  useEffect(() => {
    setBeforeError(false);
    setAfterError(false);
    setCustomBefore(null);
    setCustomAfter(null);
  }, [activeViewId]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let newBefore = activeBefore;
    let newAfter = activeAfter;

    if (files[0]) {
      newBefore = URL.createObjectURL(files[0]);
      setCustomBefore(newBefore);
      setBeforeError(false);
    }
    if (files[1]) {
      newAfter = URL.createObjectURL(files[1]);
      setCustomAfter(newAfter);
      setAfterError(false);
    }
    if (onCustomImageLoaded) {
      onCustomImageLoaded(newBefore, newAfter);
    }
  };

  return (
    <div className={`relative flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#fafafa] p-6 sm:p-10 overflow-auto' : 'w-full'}`}>
      
      {/* Control Bar - Floating White Capsule Pill */}
      <div className="glass-pill rounded-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-pill">
        
        {/* VIEW ANGLE SELECTOR (Front View vs Side View as requested) */}
        {views && views.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:inline mr-1">
              View:
            </span>
            <div className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200/60">
              {views.map((v) => {
                const isActive = activeViewId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveViewId(v.id)}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{v.name}</span>
                  </button>
                );
              })}
            </div>
            {currentView?.description && (
              <span className="text-xs text-neutral-400 hidden lg:inline pl-2">
                {currentView.description}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Comparison:
            </span>
            <span className="text-xs text-neutral-600 font-medium">
              Interactive Split Slider
            </span>
          </div>
        )}

        {/* Right Action Controls: Layout Mode, Upload & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Secondary Layout Toggle (Slider vs Side-by-Side) */}
          <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200/60">
            <button
              onClick={() => setDisplayMode('slider')}
              className={`p-1.5 rounded-full text-xs transition-all ${
                displayMode === 'slider' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Split Slider Mode"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('side-by-side')}
              className={`p-1.5 rounded-full text-xs transition-all ${
                displayMode === 'side-by-side' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Side-by-Side Mode"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs font-medium cursor-pointer transition-colors border border-neutral-200/80">
            <Upload className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">Load JPEGs</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />
          </label>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors border border-neutral-200/80"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      {displayMode === 'slider' ? (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
          className="relative w-full h-[440px] sm:h-[560px] lg:h-[640px] rounded-3xl overflow-hidden border border-neutral-200/90 shadow-card select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-neutral-900"
        >
          {/* AFTER IMAGE (Adapted Vision) - Bottom Layer */}
          <div className="absolute inset-0 w-full h-full">
            {afterError ? (
              <FallbackAdaptedArchitecturalGraphic locationName={locationName} />
            ) : (
              <img
                src={activeAfter}
                alt={activeAfterLabel}
                onError={() => setAfterError(true)}
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            )}
            {/* Green floating tag */}
            <div className="absolute bottom-5 right-5 glass-pill px-4 py-2 rounded-full text-xs font-semibold text-emerald-800 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeAfterLabel}</span>
            </div>
          </div>

          {/* BEFORE IMAGE (Current State) - Clipped Overlay with clipPath */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden transition-none pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {beforeError ? (
              <FallbackCurrentArchitecturalGraphic locationName={locationName} />
            ) : (
              <img
                src={activeBefore}
                alt={activeBeforeLabel}
                onError={() => setBeforeError(true)}
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            )}
            {/* Amber floating tag */}
            <div className="absolute bottom-5 left-5 glass-pill px-4 py-2 rounded-full text-xs font-semibold text-amber-800 flex items-center gap-1.5 shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{activeBeforeLabel}</span>
            </div>
          </div>

          {/* Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 transition-none pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-2xl border-2 border-neutral-900 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <div className="flex items-center gap-0.5 text-xs font-bold tracking-tighter">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>

          {/* Top Instruction Pill */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-pill text-neutral-600 text-xs font-medium pointer-events-none shadow-sm">
            Slide to compare {currentView?.name || 'before & after'}
          </div>
        </div>
      ) : (
        /* Side-by-Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative h-[340px] md:h-[480px] rounded-3xl overflow-hidden border border-neutral-200 shadow-card bg-neutral-900">
            {beforeError ? (
              <FallbackCurrentArchitecturalGraphic locationName={locationName} />
            ) : (
              <img src={activeBefore} alt={activeBeforeLabel} onError={() => setBeforeError(true)} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-4 left-4 glass-pill px-4 py-2 rounded-full text-xs font-semibold text-amber-800 flex items-center gap-1.5 shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{activeBeforeLabel}</span>
            </div>
          </div>

          <div className="relative h-[340px] md:h-[480px] rounded-3xl overflow-hidden border border-neutral-200 shadow-card bg-neutral-900">
            {afterError ? (
              <FallbackAdaptedArchitecturalGraphic locationName={locationName} />
            ) : (
              <img src={activeAfter} alt={activeAfterLabel} onError={() => setAfterError(true)} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-4 right-4 glass-pill px-4 py-2 rounded-full text-xs font-semibold text-emerald-800 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeAfterLabel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Fallback info notice if images ever fail */}
      {(beforeError || afterError) && (
        <div className="p-3.5 rounded-2xl glass-card text-xs text-neutral-600 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Displaying architectural schematic fallback.</span>
          </div>
        </div>
      )}
    </div>
  );
};

const FallbackCurrentArchitecturalGraphic: React.FC<{ locationName: string }> = ({ locationName }) => {
  const isPlainpalais = locationName.toLowerCase().includes('plainpalais');
  const isRive = locationName.toLowerCase().includes('rive');

  return (
    <div className="relative w-full h-full bg-[#181a20] flex flex-col justify-between p-6 sm:p-10 text-neutral-200 overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#f87171 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            {isPlainpalais
              ? 'Satellite Thermal Survey // Îlot de Chaleur Sévère'
              : isRive
              ? 'Nœud TPG // Canyon Minéral & Surchauffe Voies'
              : 'Thermal Analysis // Status Quo'}
          </span>
          <h4 className="text-2xl sm:text-3xl font-bold text-white font-display">{locationName}</h4>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold shadow-lg">
          {isPlainpalais ? 'Temp. Nocturne: 46.5°C' : isRive ? 'Surface Rails: 49.2°C' : 'Surface Temp: 48.5°C'}
        </span>
      </div>

      {/* Schematic Diagram */}
      <div className="my-auto relative w-full flex flex-col items-center justify-center py-6 relative z-10">
        {isPlainpalais ? (
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Diamond esplanade SVG wireframe representation */}
            <svg viewBox="0 0 400 180" className="w-full h-40 max-w-sm drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <polygon points="200,10 370,90 200,170 30,90" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
              <polygon points="200,25 345,90 200,155 55,90" fill="#2d1515" stroke="#f87171" strokeWidth="1.5" />
              <path d="M120 75 Q130 65 140 75 T160 75" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.8" />
              <path d="M180 60 Q190 50 200 60 T220 60" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M240 75 Q250 65 260 75 T280 75" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.8" />
              <path d="M150 110 Q160 100 170 110 T190 110" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M210 110 Q220 100 230 110 T250 110" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="200" y="93" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                SOL COMPACTÉ & BITUME (7.8 HA)
              </text>
              <text x="200" y="107" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace" opacity="0.9">
                ACCUMULATION THERMIQUE MAXIMALE
              </text>
            </svg>
            <div className="bg-black/80 backdrop-blur-md border border-red-500/40 p-4 rounded-2xl max-w-sm text-center shadow-2xl mt-2">
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider font-mono">
                Esplanade Minérale Non Végétalisée
              </p>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                Grande plaine sans ombre • Sol étanche • Voies routières denses périphériques empêchant la ventilation nocturne
              </p>
            </div>
          </div>
        ) : isRive ? (
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Rive Tramway & Asphalt Corridor SVG wireframe */}
            <svg viewBox="0 0 400 180" className="w-full h-40 max-w-sm drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              {/* Canyon walls / buildings */}
              <rect x="20" y="20" width="60" height="140" fill="#262626" stroke="#525252" strokeWidth="1.5" />
              <rect x="320" y="20" width="60" height="140" fill="#262626" stroke="#525252" strokeWidth="1.5" />
              
              {/* Asphalt Roadway */}
              <rect x="80" y="60" width="240" height="100" fill="#171717" stroke="#dc2626" strokeWidth="1.5" />
              
              {/* Steel Tram Tracks */}
              <line x1="120" y1="60" x2="120" y2="160" stroke="#737373" strokeWidth="3" />
              <line x1="150" y1="60" x2="150" y2="160" stroke="#737373" strokeWidth="3" />
              <line x1="250" y1="60" x2="250" y2="160" stroke="#737373" strokeWidth="3" />
              <line x1="280" y1="60" x2="280" y2="160" stroke="#737373" strokeWidth="3" />

              {/* Bare Glass Shelter */}
              <rect x="180" y="70" width="40" height="60" fill="#404040" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
              <text x="200" y="105" textAnchor="middle" fill="#fca5a5" fontSize="7" fontFamily="monospace">ABRI NU</text>

              {/* Heat waves from asphalt */}
              <path d="M125 45 Q135 35 145 45" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M260 45 Q270 35 280 45" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="200" y="148" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold">
                VOIES SUR GOUDRON NOIR (100% BITUME)
              </text>
            </svg>
            <div className="bg-black/80 backdrop-blur-md border border-red-500/40 p-4 rounded-2xl max-w-sm text-center shadow-2xl mt-2">
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider font-mono">
                Canyon Minéral & Rails Surchauffés
              </p>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                Asphalte noir emmagasinant la chaleur • Abris en verre sans isolation thermique • Absence de canopée d'ombrage
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-black/75 backdrop-blur-md border border-neutral-700 p-5 rounded-2xl max-w-sm text-center shadow-xl">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">
              Heat-Trapping Mineral Ground
            </p>
            <p className="text-[11px] text-neutral-300 mt-1">
              92% Impermeable Asphalt • Zero Soil Drainage • Heavy Summer Heat Storage
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10">
        <span>ARCHITECTURAL BASELINE // 2026</span>
        <span>INFILTRATION: {isPlainpalais ? '12%' : isRive ? '5%' : '8%'}</span>
      </div>
    </div>
  );
};

const FallbackAdaptedArchitecturalGraphic: React.FC<{ locationName: string }> = ({ locationName }) => {
  const isPlainpalais = locationName.toLowerCase().includes('plainpalais');
  const isRive = locationName.toLowerCase().includes('rive');

  return (
    <div className="relative w-full h-full bg-[#0d1f17] flex flex-col justify-between p-6 sm:p-10 text-neutral-200 overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isPlainpalais
              ? 'Rénovation Climatique // Bosquets & Miroirs d’Eau'
              : isRive
              ? 'Tramway Vert // Tapis d’Herbe & Abris Végétalisés'
              : 'Architectural Transformation // Adapted Vision'}
          </span>
          <h4 className="text-2xl sm:text-3xl font-bold text-white font-display">{locationName}</h4>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-lg">
          {isPlainpalais
            ? 'Temp: 31.8°C (-14.7°C)'
            : isRive
            ? 'Surface: 32.5°C (-16.7°C)'
            : 'Surface Temp: 34.2°C (-14.3°C)'}
        </span>
      </div>

      {/* Schematic Diagram */}
      <div className="my-auto relative w-full flex flex-col items-center justify-center py-6 relative z-10">
        {isPlainpalais ? (
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Diamond esplanade adapted SVG wireframe */}
            <svg viewBox="0 0 400 180" className="w-full h-40 max-w-sm drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <polygon points="200,10 370,90 200,170 30,90" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" />
              <polygon points="200,25 345,90 200,155 55,90" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
              
              <ellipse cx="200" cy="90" rx="42" ry="18" fill="#0284c7" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="200" y="93" textAnchor="middle" fill="#e0f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
                MIROIR D'EAU PASSATIF
              </text>

              <circle cx="130" cy="80" r="18" fill="#059669" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="150" cy="110" r="14" fill="#047857" fillOpacity="0.8" stroke="#a7f3d0" strokeWidth="1.5" />
              <circle cx="270" cy="80" r="18" fill="#059669" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="250" cy="110" r="14" fill="#047857" fillOpacity="0.8" stroke="#a7f3d0" strokeWidth="1.5" />
              
              <text x="130" y="83" textAnchor="middle" fill="#d1fae5" fontSize="7" fontFamily="monospace">
                BOSQUET
              </text>
              <text x="270" y="83" textAnchor="middle" fill="#d1fae5" fontSize="7" fontFamily="monospace">
                BOSQUET
              </text>
              
              <path d="M100 45 L300 45" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
              <path d="M100 135 L300 135" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </svg>
            <div className="bg-black/85 backdrop-blur-md border border-emerald-500/40 p-4 rounded-2xl max-w-sm text-center shadow-2xl mt-2">
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider font-mono">
                Bosquets Résilients & Noues d’Infiltration
              </p>
              <p className="text-[11px] text-neutral-200 mt-1 leading-relaxed">
                Revêtements clairs perméables • Érables de Montpellier & Chênes • Miroirs d’eau pour rafraîchissement évaporatif passif
              </p>
            </div>
          </div>
        ) : isRive ? (
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Rive Tramway & Green Shelter SVG wireframe */}
            <svg viewBox="0 0 400 180" className="w-full h-40 max-w-sm drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              {/* Canyon walls / buildings */}
              <rect x="20" y="20" width="60" height="140" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <rect x="320" y="20" width="60" height="140" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              
              {/* Green Tramway Grass Lawn Corridor */}
              <rect x="80" y="60" width="240" height="100" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
              
              {/* Grass texture dashes */}
              <line x1="90" y1="75" x2="110" y2="75" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="290" y1="75" x2="310" y2="75" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="165" y1="90" x2="235" y2="90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Steel Tram Tracks on Grass */}
              <line x1="120" y1="60" x2="120" y2="160" stroke="#e2e8f0" strokeWidth="3" />
              <line x1="150" y1="60" x2="150" y2="160" stroke="#e2e8f0" strokeWidth="3" />
              <line x1="250" y1="60" x2="250" y2="160" stroke="#e2e8f0" strokeWidth="3" />
              <line x1="280" y1="60" x2="280" y2="160" stroke="#e2e8f0" strokeWidth="3" />

              {/* Living Sedum Roof Shelter */}
              <rect x="180" y="70" width="40" height="60" fill="#047857" stroke="#34d399" strokeWidth="2" rx="4" />
              <rect x="175" y="66" width="50" height="10" fill="#10b981" rx="3" />
              <text x="200" y="74" textAnchor="middle" fill="#022c22" fontSize="6" fontWeight="bold">SEDUM</text>
              <text x="200" y="105" textAnchor="middle" fill="#d1fae5" fontSize="7" fontFamily="monospace">ABRI VERT</text>

              {/* Shade Trees on sidewalks */}
              <circle cx="65" cy="90" r="16" fill="#059669" fillOpacity="0.8" stroke="#a7f3d0" strokeWidth="1.5" />
              <circle cx="335" cy="90" r="16" fill="#059669" fillOpacity="0.8" stroke="#a7f3d0" strokeWidth="1.5" />

              <text x="200" y="148" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                TAPIS VÉGÉTAL // SEDUM & GRAMINÉES
              </text>
            </svg>
            <div className="bg-black/85 backdrop-blur-md border border-emerald-500/40 p-4 rounded-2xl max-w-sm text-center shadow-2xl mt-2">
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider font-mono">
                Tramway Vert & Abris Végétalisés
              </p>
              <p className="text-[11px] text-neutral-200 mt-1 leading-relaxed">
                Tapis d’herbe/sedum entre les rails • Toitures vivantes sur abribus • Canopée d'arbres protectrice pour usagers TPG
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-black/75 backdrop-blur-md border border-neutral-700 p-5 rounded-2xl max-w-sm text-center shadow-xl">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono">
              Sponge City & Canopy Sanctuary
            </p>
            <p className="text-[11px] text-neutral-300 mt-1">
              72% Stormwater Retention • Sedum Green Roofs • Biosolar Panels • Deep Pedestrian Shade
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10">
        <span>TRAM CORRIDOR ADAPTATION // 2026-2030</span>
        <span className="text-emerald-400">INFILTRATION: {isPlainpalais ? '78% (+66%)' : isRive ? '68% (+63%)' : '72% (+64%)'}</span>
      </div>
    </div>
  );
};
