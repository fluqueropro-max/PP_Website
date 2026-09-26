import React from 'react';
import { ArrowLeft, Droplets, Trees, SunMedium, Users, Compass, Sparkles } from 'lucide-react';
import { GenevaLocation } from '../types';
import { VisualComparison } from './VisualComparison';

interface LocationSubPageProps {
  location: GenevaLocation;
  allLocations: GenevaLocation[];
  onBackToMap: () => void;
  onSelectLocation: (location: GenevaLocation) => void;
}

export const LocationSubPage: React.FC<LocationSubPageProps> = ({
  location,
  allLocations,
  onBackToMap,
  onSelectLocation,
}) => {
  return (
    <div className="w-full space-y-12 animate-fadeIn pb-24 text-neutral-900">
      
      {/* Top Capsule Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToMap}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill hover:bg-white text-neutral-800 font-medium text-xs shadow-pill transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Geneva Map</span>
        </button>

        <div className="flex items-center gap-2">
          {location.status === 'active' ? (
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-resilient-100 text-resilient-800 border border-resilient-200">
              <span className="w-2 h-2 rounded-full bg-resilient-600 animate-pulse" />
              Active IB Case Study
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
              Future Study Location
            </span>
          )}
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            {location.coordinates[1].toFixed(4)}°N, {location.coordinates[0].toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Location Hero Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 uppercase font-semibold">
            {location.frenchName}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight font-display">
            {location.name}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-neutral-600 max-w-3xl leading-relaxed">
          {location.subtitle}
        </p>
      </div>

      {/* Centerpiece: Interactive Visual Comparison */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2 font-display">
              <Sparkles className="w-4 h-4 text-resilient-600" />
              <span>Interactive Visual Transformation</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Slide to reveal how asphalt and heat-trapping surfaces convert into permeable ground, canopies, and living roofs.
            </p>
          </div>
        </div>

        <VisualComparison
          beforeImage={location.beforeImage}
          afterImage={location.afterImage}
          beforeLabel={location.beforeLabel}
          afterLabel={location.afterLabel}
          locationName={location.name}
          views={location.views}
        />
      </section>

      {/* Performance Indicators Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Climate Performance Simulation
          </h3>
          <span className="text-xs font-mono text-resilient-700">
            Baseline vs. Adapted Vision
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {location.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="glass-card p-5 sm:p-6 rounded-3xl shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <span className="text-xs font-medium text-neutral-500">{metric.label}</span>
              
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display">
                  {metric.adaptedValue}
                </span>
                <span className="text-xs font-mono text-neutral-400">{metric.unit}</span>
                <span className="text-xs font-mono text-neutral-300 line-through ml-auto">
                  {metric.currentValue} {metric.unit}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-semibold ${
                    metric.favorable === 'decrease' ? 'text-cyan-700' : 'text-resilient-700'
                  }`}
                >
                  {metric.favorable === 'decrease' ? '▼ Reduction' : '▲ Improvement'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
                {metric.changeDescription}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Pillars / Deep-Dive Cards */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
            The Anatomy of Adaptation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
            Key Architectural Interventions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Engineered systems designed to mitigate urban heat islands and store stormwater locally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {location.pillars.map((pillar) => {
            const getIcon = () => {
              switch (pillar.category) {
                case 'water':
                  return <Droplets className="w-5 h-5 text-cyan-600" />;
                case 'vegetation':
                  return <Trees className="w-5 h-5 text-emerald-600" />;
                case 'roofs':
                  return <SunMedium className="w-5 h-5 text-amber-600" />;
                default:
                  return <Users className="w-5 h-5 text-neutral-800" />;
              }
            };

            return (
              <div
                key={pillar.id}
                className="glass-card p-6 sm:p-7 rounded-3xl shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-full bg-neutral-100">
                      {getIcon()}
                    </div>
                    {pillar.metricHighlight && (
                      <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-resilient-50 text-resilient-800 border border-resilient-200">
                        {pillar.metricHighlight}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 leading-snug font-display">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-resilient-700">
                    {pillar.tagline}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                      Architectural Technique
                    </span>
                    <span className="text-neutral-700 text-xs">
                      {pillar.architecturalIntervention}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-resilient-700 block font-semibold">
                      Ecological Outcome
                    </span>
                    <span className="text-neutral-700 text-xs">
                      {pillar.climateBenefit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academic / IB Personal Project Note */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl shadow-subtle bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-neutral-100 text-neutral-800 mt-1 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-950 font-display">
                IB Year 11 Personal Project Context & Methodology
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                This project investigates how urban design standards can transition Geneva’s dense infrastructure from a heat liability into an ecological sponge, benchmarked against Canton de Genève climate emergency action guidelines and the Swiss Federal Sponge City initiative.
              </p>
            </div>
          </div>
          <button
            onClick={onBackToMap}
            className="bg-neutral-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm shrink-0 active:scale-95"
          >
            <span>Explore Next Space →</span>
          </button>
        </div>
      </section>

      {/* Switcher to Other Geneva Locations */}
      <section className="space-y-4 pt-4 border-t border-neutral-200">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
          All Geneva Target Hotspots
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allLocations.map((otherLoc) => {
            const isCurrent = otherLoc.id === location.id;
            return (
              <button
                key={otherLoc.id}
                disabled={isCurrent}
                onClick={() => onSelectLocation(otherLoc)}
                className={`p-5 rounded-3xl text-left transition-all ${
                  isCurrent
                    ? 'bg-neutral-950 text-white shadow-md cursor-default'
                    : 'glass-card hover:bg-neutral-50 text-neutral-800 hover:shadow-card'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-neutral-950'}`}>
                    {otherLoc.name}
                  </span>
                  {otherLoc.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-resilient-400" />
                  )}
                </div>
                <p className={`text-[11px] line-clamp-1 ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {otherLoc.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
