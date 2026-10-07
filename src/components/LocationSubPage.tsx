import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Trees,
  SunMedium,
  Users,
  Compass,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  X,
  Send,
} from 'lucide-react';
import { GenevaLocation } from '../types';
import { SURVEY_FORM_URL } from '../data/locationsData';
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
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
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

      {/* Student Feedback Survey Banner (For Campus des Nations) */}
      {location.id === 'ecolint-campus-nations' && (
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-neutral-900 to-black text-white shadow-xl border border-emerald-500/30 animate-fadeIn">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono uppercase tracking-wider">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Campus Action • Student Voice
                </span>
                <span className="text-xs text-neutral-400 font-mono">IB Personal Project</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                Help Shape Our School Courtyard — Student Feedback Survey Now Open
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We are gathering first-hand feedback from Campus des Nations students to prioritize shade structures, seating pergolas, and hydration stations. Have your voice heard in this IB research project!
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                onClick={() => {
                  if (SURVEY_FORM_URL) {
                    window.open(SURVEY_FORM_URL, '_blank', 'noopener,noreferrer');
                  } else {
                    setIsSurveyModalOpen(true);
                  }
                }}
                className="group px-6 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <span>Take the Survey →</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empirical Problem & Resilient Solution Diagnosis */}
      {(location.currentProblemSummary || location.adaptationVisionSummary) && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                Urban Diagnostic & Strategy
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                Climate Diagnosis & Resilient Vision
              </h2>
            </div>
            {location.sources && location.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                <span className="font-semibold text-neutral-400">Sources:</span>
                {location.sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/80"
                  >
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem (Current State) */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl shadow-card border-l-4 border-l-amber-500 flex flex-col justify-between space-y-4 bg-gradient-to-br from-amber-50/20 to-white">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                    The Problem (Current State)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {location.currentProblemSummary}
                </p>
              </div>
            </div>

            {/* The Solution (Resilient Future) */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl shadow-card border-l-4 border-l-resilient-600 flex flex-col justify-between space-y-4 bg-gradient-to-br from-resilient-50/20 to-white">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-resilient-100 text-resilient-900 border border-resilient-200">
                    The Solution (Resilient Future)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {location.adaptationVisionSummary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Student Feedback Survey Modal Dialog */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Student Feedback
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Campus des Nations</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                  School Backyard Climate Survey
                </h3>
              </div>
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Close survey modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              This survey directly supports my <strong>IB Year 11 Personal Project</strong> on bioclimatic adaptation in Geneva. Cast a quick priority vote below or leave a comment!
            </p>

            {/* Quick Priority Poll */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Quick Poll: What is your #1 priority for our backyard?
              </label>

              <div className="space-y-2">
                {[
                  { id: 'shade', label: '🌳 Mature Pubescent Oak Canopy', desc: 'Natural leaf shade to drop ground heat by 10–12°C' },
                  { id: 'pergola', label: '🌿 Climbing Timber Pergolas', desc: 'Shaded wooden picnic tables for lunch & study breaks' },
                  { id: 'fountain', label: '🚰 Chilled Drinking Water Fountain', desc: 'Reliable, fresh outdoor hydration during hot months' },
                  { id: 'paving', label: '🧱 Light Permeable Pavers', desc: 'Eliminates asphalt heat radiation & absorbs rain naturally' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedPriority(option.id);
                      setVoteSubmitted(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      selectedPriority === option.id
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900">{option.label}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{option.desc}</p>
                    </div>
                    {selectedPriority === option.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              {voteSubmitted && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vote registered! Thank you for contributing to the campus research dataset.</span>
                </div>
              )}
            </div>

            {/* Quick Comment / Idea */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Share an idea or student observation (Optional)
              </label>
              <textarea
                rows={2}
                value={quickFeedback}
                onChange={(e) => setQuickFeedback(e.target.value)}
                placeholder="E.g. The courtyard gets too hot to sit down by 13:00, we really need shaded benches..."
                className="w-full text-xs p-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none text-neutral-800"
              />
              <div className="flex justify-end">
                <button
                  disabled={!quickFeedback.trim() || feedbackSent}
                  onClick={() => {
                    setFeedbackSent(true);
                    setQuickFeedback('');
                  }}
                  className={`text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                    feedbackSent
                      ? 'bg-neutral-100 text-emerald-700 cursor-default'
                      : quickFeedback.trim()
                      ? 'bg-neutral-900 hover:bg-black text-white active:scale-95'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {feedbackSent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Idea Submitted</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Idea</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email Notification for full survey launch */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Get notified when the full student survey launches
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailInput.trim()) {
                    setEmailSubmitted(true);
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.name@ecolint.ch"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-neutral-800"
                />
                <button
                  type="submit"
                  disabled={!emailInput.trim() || emailSubmitted}
                  className={`text-xs px-5 py-2.5 rounded-full font-medium transition-all ${
                    emailSubmitted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold'
                  }`}
                >
                  {emailSubmitted ? 'Registered!' : 'Notify Me'}
                </button>
              </form>
              {emailSubmitted && (
                <p className="text-[11px] text-emerald-600">
                  ✓ You will receive an invite once the full questionnaire goes live!
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="px-5 py-2 rounded-full text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
