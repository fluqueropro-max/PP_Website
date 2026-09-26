import React from 'react';
import { X, Droplets, Trees, Sun, AlertTriangle, ArrowRight } from 'lucide-react';

interface ClimateContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCornavin: () => void;
}

export const ClimateContextModal: React.FC<ClimateContextModalProps> = ({
  isOpen,
  onClose,
  onGoToCornavin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-9 rounded-3xl border border-neutral-200/80 shadow-2xl space-y-6 text-neutral-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-resilient-600" />
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase font-semibold">
              Geneva Climate Emergency Context
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
            Why Geneva Must Transform Its Public Spaces
          </h2>
        </div>

        {/* Twin Challenges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Intense Urban Heatwaves</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Geneva sits in a topographical basin between the Jura and the Salève. Dark asphalt, rail yards, and concrete trap radiant heat during summer days, creating night temperature differentials up to <strong>+7°C</strong> compared to surrounding countryside.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200/60 space-y-2">
            <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Torrential Stormwater</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Warmer air holds 7% more moisture per degree Celsius. Heavy alpine storm fronts dump millions of liters of rain in minutes. Over sealed surfaces, this causes rapid flash flooding and flushes pollutants into Lac Léman.
            </p>
          </div>
        </div>

        {/* The Three Adaptation Pillars */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            The Three Adaptation Pillars
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="p-2 rounded-full bg-cyan-100 text-cyan-700 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-950 text-sm">1. Sponge City (Ville-Éponge)</h4>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">
                  Replacing impervious tarmac with porous stone pavers, gravel sub-bases, and bioswales that absorb water where it falls, replenishing groundwater.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                <Trees className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-950 text-sm">2. Urban Tree Canopy & Evapotranspiration</h4>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">
                  Planting climate-hardy native trees with underground Silva-Cell root channels, providing natural pedestrian shade and dropping surface temperatures by up to 14°C.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="p-2 rounded-full bg-amber-100 text-amber-700 mt-0.5">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-950 text-sm">3. Sedum Green Roofs + Biosolar Synergy</h4>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">
                  Extensive succulent sedum blankets retain roof rainwater, insulate buildings, and cool elevated solar panels to boost clean energy generation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
          <span className="text-xs text-neutral-400 font-mono">IB Year 11 Personal Project</span>
          <button
            onClick={() => {
              onClose();
              onGoToCornavin();
            }}
            className="bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Explore Gare Cornavin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
