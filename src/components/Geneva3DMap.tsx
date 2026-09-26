import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { RotateCcw, Box, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { GenevaLocation } from '../types';
import { DEFAULT_MAP_CAMERA } from '../data/locationsData';

interface Geneva3DMapProps {
  locations: GenevaLocation[];
  selectedLocation: GenevaLocation | null;
  onSelectLocation: (location: GenevaLocation) => void;
}

export const Geneva3DMap: React.FC<Geneva3DMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [showHeatIslandOverlay, setShowHeatIslandOverlay] = useState(false);

  // Initialize MapLibre GL with dark architectural clay studio styling
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: DEFAULT_MAP_CAMERA.center,
      zoom: 14.2,
      pitch: 60, // 60° architectural isometric tilt matching reference
      bearing: -28,
      maxBounds: [
        [5.95, 46.10],
        [6.35, 46.32],
      ],
    });

    map.on('load', () => {
      setMapLoaded(true);

      // Customize roads and water for monochromatic wireframe architectural look
      try {
        const layers = map.getStyle().layers;

        // Tune road layers to look like crisp white wireframes
        layers?.forEach((layer) => {
          if (layer.type === 'line' && layer.id.includes('road')) {
            map.setPaintProperty(layer.id, 'line-color', '#ffffff');
            map.setPaintProperty(layer.id, 'line-opacity', 0.28);
          }
          if (layer.id.includes('water')) {
            if (layer.type === 'fill') {
              map.setPaintProperty(layer.id, 'fill-color', '#0e1117');
            }
          }
        });

        // Add 3D Extruded Buildings in matte charcoal/clay
        const labelLayerId = layers?.find(
          (l) => l.type === 'symbol' && l.layout && 'text-field' in l.layout
        )?.id;

        const sourceId = map.getSource('carto') ? 'carto' : 'openmaptiles';
        if (map.getSource(sourceId)) {
          map.addLayer(
            {
              id: '3d-clay-buildings',
              source: sourceId,
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 13.5,
              paint: {
                'fill-extrusion-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'render_height'],
                  0,
                  '#1f242e',
                  30,
                  '#29303d',
                  80,
                  '#343c4d',
                ],
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13.5,
                  0,
                  15,
                  ['get', 'render_height'],
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13.5,
                  0,
                  15,
                  ['get', 'render_min_height'],
                ],
                'fill-extrusion-opacity': 0.95,
              },
            },
            labelLayerId
          );
        }

        // Configure directional studio lighting for crisp geometric building facets
        map.setLight({
          anchor: 'viewport',
          color: '#ffffff',
          intensity: 0.55,
          position: [1.2, 210, 35],
        });

        // Add architectural wireframe footprint for Gare Cornavin
        map.addSource('cornavin-footprint', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Gare Cornavin' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [6.1415, 46.2114],
                  [6.1438, 46.2118],
                  [6.1444, 46.2098],
                  [6.1420, 46.2093],
                  [6.1415, 46.2114],
                ],
              ],
            },
          },
        });

        map.addLayer({
          id: 'cornavin-area-fill',
          type: 'fill',
          source: 'cornavin-footprint',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.12,
          },
        });

        map.addLayer({
          id: 'cornavin-area-stroke',
          type: 'line',
          source: 'cornavin-footprint',
          paint: {
            'line-color': '#34d399',
            'line-width': 1.5,
            'line-dasharray': [4, 3],
            'line-opacity': 0.7,
          },
        });

        // Add subtle architectural diamond wireframe footprint for Plaine de Plainpalais
        map.addSource('plainpalais-footprint', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Plaine de Plainpalais' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [6.1408, 46.19988], // North corner (Skatepark / Frankenstein)
                  [6.14166, 46.19788], // East corner (Avenue Henri-Dunant)
                  [6.1408, 46.19589], // South corner (Bvd du Pont-d'Arve)
                  [6.1396, 46.19788], // West corner (Avenue du Mail)
                  [6.1408, 46.19988], // Close polygon
                ],
              ],
            },
          },
        });

        map.addLayer({
          id: 'plainpalais-area-fill',
          type: 'fill',
          source: 'plainpalais-footprint',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.12,
          },
        });

        map.addLayer({
          id: 'plainpalais-area-stroke',
          type: 'line',
          source: 'plainpalais-footprint',
          paint: {
            'line-color': '#34d399',
            'line-width': 1.5,
            'line-dasharray': [4, 3],
            'line-opacity': 0.7,
          },
        });

        // Add subtle architectural wireframe highlight for Rond-point de Rive
        map.addSource('rive-footprint', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Rive' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [6.1530, 46.2021],
                  [6.1540, 46.2019],
                  [6.1538, 46.2012],
                  [6.1528, 46.2014],
                  [6.1530, 46.2021],
                ],
              ],
            },
          },
        });

        map.addLayer({
          id: 'rive-area-fill',
          type: 'fill',
          source: 'rive-footprint',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.12,
          },
        });

        map.addLayer({
          id: 'rive-area-stroke',
          type: 'line',
          source: 'rive-footprint',
          paint: {
            'line-color': '#34d399',
            'line-width': 1.5,
            'line-dasharray': [4, 3],
            'line-opacity': 0.7,
          },
        });

        // Add subtle architectural wireframe highlight for Les Pâquis
        map.addSource('paquis-footprint', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: 'Les Pâquis' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [6.1456, 46.2125],
                  [6.1478, 46.2128],
                  [6.1481, 46.2106],
                  [6.1459, 46.2104],
                  [6.1456, 46.2125],
                ],
              ],
            },
          },
        });

        map.addLayer({
          id: 'paquis-area-fill',
          type: 'fill',
          source: 'paquis-footprint',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.12,
          },
        });

        map.addLayer({
          id: 'paquis-area-stroke',
          type: 'line',
          source: 'paquis-footprint',
          paint: {
            'line-color': '#34d399',
            'line-width': 1.5,
            'line-dasharray': [4, 3],
            'line-opacity': 0.7,
          },
        });

        // Add real GeoJSON heatmap source via URL for fast asynchronous web worker parsing
        map.addSource('geneva-heat', {
          type: 'geojson',
          data: '/data/heatMapData.json',
        });

        // High-resolution grid layer mimicking thermographic blocks (like Image 2 & 3)
        map.addLayer({
          id: 'geneva-heat-layer',
          type: 'circle',
          source: 'geneva-heat',
          layout: {
            visibility: 'none',
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 1.5,
              14, 4.5,
              16, 14,
              18, 40
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'heat'],
              0.0, '#000080',
              0.2, '#0000ff',
              0.35, '#00ffff',
              0.5, '#00ff00',
              0.65, '#ffff00',
              0.8, '#ff8000',
              1.0, '#ff0000',
            ],
            'circle-opacity': 0.75,
            'circle-pitch-alignment': 'map', // Sticks flat to the ground in 3D
            'circle-blur': 0.2, // Slight blur to weave them into a continuous thermal fabric
          },
        });

      } catch (err) {
        console.error("Error adding map layers:", err);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers matching the reference image HUD square tags (e.g. "[■] APD-7100-NYC")
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'geneva-hud-marker group cursor-pointer select-none';

      const isActive = loc.status === 'active';
      const code = loc.code || 'GVA-LOC';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          
          <!-- Monospace HUD Label Tag (Matching Reference Image) -->
          <div class="flex items-center gap-2 bg-neutral-950/95 border ${
            isActive ? 'border-white ring-1 ring-white/60' : 'border-white/50'
          } px-2.5 py-1 text-[11px] font-mono text-white tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all duration-200 group-hover:scale-105 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            
            <!-- Square beacon icon [■] -->
            <div class="w-3.5 h-3.5 border border-white bg-black flex items-center justify-center shrink-0">
              <div class="w-1.5 h-1.5 ${isActive ? 'bg-white animate-pulse' : 'bg-white'}"></div>
            </div>

            <!-- Code Identifier -->
            <span class="font-bold tracking-widest text-[10px]">${code}</span>

            ${
              isActive
                ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>'
                : ''
            }
          </div>

          <!-- Vertical Leader Stem connecting to ground -->
          <div class="w-[1px] h-5 bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.8)]"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-white ring-2 ring-black"></div>

          <!-- Extended Tooltip on Hover -->
          <div class="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 min-w-[200px]">
            <div class="bg-black/95 border border-white/60 p-2.5 rounded shadow-2xl text-center">
              <p class="text-xs font-bold text-white tracking-wide">${loc.name}</p>
              <p class="text-[10px] text-neutral-400 mt-0.5">${loc.subtitle}</p>
              <span class="inline-block mt-1 text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                Click to Zoom & Inspect →
              </span>
            </div>
          </div>

        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectLocation(loc);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(loc.coordinates)
        .addTo(map);

      markersRef.current[loc.id] = marker;
    });
  }, [locations, mapLoaded, onSelectLocation]);

  // Handle Camera FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedLocation) {
      map.flyTo({
        center: selectedLocation.coordinates,
        zoom: selectedLocation.camera.zoom,
        pitch: selectedLocation.camera.pitch,
        bearing: selectedLocation.camera.bearing,
        duration: 2200,
        essential: true,
      });
    } else {
      map.flyTo({
        center: DEFAULT_MAP_CAMERA.center,
        zoom: 14.2,
        pitch: 60,
        bearing: -28,
        duration: 2000,
        essential: true,
      });
    }
  }, [selectedLocation]);

  // Handle Heatmap Overlay Visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    
    try {
      if (map.getLayer('geneva-heat-layer')) {
        map.setLayoutProperty(
          'geneva-heat-layer',
          'visibility',
          showHeatIslandOverlay ? 'visible' : 'none'
        );
      } else {
        console.warn('geneva-heat-layer not found when trying to toggle visibility');
      }
    } catch (err) {
      console.error('Error toggling heatmap:', err);
    }
  }, [showHeatIslandOverlay, mapLoaded]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const toggle3DTilt = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    map.easeTo({
      pitch: nextMode ? 60 : 0,
      duration: 1000,
    });
  };

  const resetCamera = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo({
      center: DEFAULT_MAP_CAMERA.center,
      zoom: 14.2,
      pitch: 60,
      bearing: -28,
      duration: 1800,
      essential: true,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[640px] rounded-3xl overflow-hidden border border-neutral-300 shadow-2xl bg-[#111318]">
      
      {/* 1. ARCHITECTURAL HUD FRAMING BRACKETS (Matching Reference) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top-Left Bracket */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60" />
        {/* Top-Right Bracket */}
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60" />
        {/* Bottom-Left Bracket */}
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60" />

        {/* Framing edge tick marks */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2 w-2 h-[1px] bg-white/40" />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-[1px] bg-white/40" />
      </div>

      {/* 2. TOP-LEFT HUD TELEMETRY BADGE */}
      <div className="absolute top-5 left-8 z-20 pointer-events-none hidden sm:flex flex-col gap-0.5 text-white font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-white"></span>
          <span className="font-bold tracking-widest uppercase">
            Geneva 3D Isometric Model // 1:2500
          </span>
        </div>
        <span className="text-neutral-400 tracking-wider">
          46.2104°N, 06.1428°E • BASIN ELEV: 375M ASL
        </span>
      </div>

      {/* 3. MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Heat Island Simulation HUD */}
      {showHeatIslandOverlay && (
        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700 ease-in-out">
          {/* HUD Thermal Banner */}
          <div className="absolute top-20 left-8 z-20 pointer-events-none bg-black/95 backdrop-blur-md border border-amber-500/60 p-3.5 shadow-2xl animate-fadeIn max-w-xs">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>HEAT SIMULATION // ACTIVE</span>
            </div>
            <p className="text-[11px] text-neutral-300 mt-1.5 leading-snug">
              Modélisation thermographique haute résolution de l’îlot de chaleur urbain.
            </p>
            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-sky-400 font-bold">🔵 ~21°C (Frais / Eau & Parcs)</span>
                <span className="text-red-400 font-bold">🔴 48°C+ (Surchauffe / Bitume)</span>
              </div>
              <div 
                className="h-2 w-full rounded-full shadow-inner" 
                style={{ background: 'linear-gradient(to right, #000080, #0000ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)' }}
              />
              <div className="flex items-center justify-between text-[9px] text-neutral-400">
                <span>Lac Léman & canopées</span>
                <span>Gares, voiries & dalles minérales</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM-RIGHT STACKED ZOOM CONTROLS [+] [-] (Exact Match to Reference Image) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col pointer-events-auto shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-black/90 hover:bg-neutral-900 text-white border border-white/60 flex items-center justify-center font-mono text-base transition-colors active:bg-white active:text-black"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-black/90 hover:bg-neutral-900 text-white border-x border-b border-white/60 flex items-center justify-center font-mono text-base transition-colors active:bg-white active:text-black"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* 5. BOTTOM-LEFT HUD CONTROLS DOCK */}
      <div className="absolute bottom-6 left-8 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <button
          onClick={resetCamera}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-black/90 hover:bg-neutral-900 text-white border border-white/40 text-[11px] font-mono tracking-wider transition-colors shadow-lg"
          title="Reset Camera to Geneva Canton Overview"
        >
          <RotateCcw className="w-3 h-3 text-neutral-400" />
          <span>RESET CAM</span>
        </button>

        <button
          onClick={toggle3DTilt}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-mono tracking-wider transition-colors border shadow-lg ${
            is3DMode
              ? 'bg-white text-black border-white font-bold'
              : 'bg-black/90 hover:bg-neutral-900 text-white border-white/40'
          }`}
          title="Toggle 3D Perspective Tilt"
        >
          <Box className="w-3 h-3" />
          <span>{is3DMode ? '3D: 60°' : '2D: 0°'}</span>
        </button>

        <button
          onClick={() => setShowHeatIslandOverlay(!showHeatIslandOverlay)}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-mono tracking-wider transition-colors border shadow-lg ${
            showHeatIslandOverlay
              ? 'bg-amber-600 text-white border-amber-400'
              : 'bg-black/90 hover:bg-neutral-900 text-neutral-300 border-white/40'
          }`}
          title="Toggle Urban Heat Island Simulation Overlay"
        >
          <Flame className="w-3 h-3 text-amber-400" />
          <span>{showHeatIslandOverlay ? 'HEAT SIM: ON' : 'HEAT SIM'}</span>
        </button>
      </div>

      {/* 6. TOP-RIGHT QUICK JUMP TARGETS */}
      <div className="absolute top-5 right-8 z-20 pointer-events-auto hidden sm:flex items-center gap-2">
        <button
          onClick={() => {
            const cornavin = locations.find((l) => l.id === 'gare-cornavin');
            if (cornavin) onSelectLocation(cornavin);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-white hover:text-black text-white border border-white/60 text-[11px] font-mono tracking-wider transition-all shadow-xl group"
          title="Zoom to Gare Cornavin"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 group-hover:text-black" />
          <span>GVA-CRN-01</span>
        </button>

        <button
          onClick={() => {
            const plainpalais = locations.find((l) => l.id === 'plaine-plainpalais');
            if (plainpalais) onSelectLocation(plainpalais);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-white hover:text-black text-white border border-white/60 text-[11px] font-mono tracking-wider transition-all shadow-xl group"
          title="Zoom to Plaine de Plainpalais"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 group-hover:text-black" />
          <span>GVA-PLP-02</span>
        </button>

        <button
          onClick={() => {
            const rive = locations.find((l) => l.id === 'carrefour-rive');
            if (rive) onSelectLocation(rive);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-white hover:text-black text-white border border-white/60 text-[11px] font-mono tracking-wider transition-all shadow-xl group"
          title="Zoom to Rive"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 group-hover:text-black" />
          <span>GVA-RIV-03</span>
        </button>

        <button
          onClick={() => {
            const paquis = locations.find((l) => l.id === 'les-paquis');
            if (paquis) onSelectLocation(paquis);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-white hover:text-black text-white border border-white/60 text-[11px] font-mono tracking-wider transition-all shadow-xl group"
          title="Zoom to Les Pâquis"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 group-hover:text-black" />
          <span>GVA-PAQ-04</span>
        </button>
      </div>

    </div>
  );
};
