import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Geneva3DMap } from './components/Geneva3DMap';
import { LocationSubPage } from './components/LocationSubPage';
import { ClimateContextModal } from './components/ClimateContextModal';
import { SearchBar } from './components/SearchBar';
import { LOCATIONS } from './data/locationsData';
import { GenevaLocation } from './types';
import { Sparkles, ArrowRight, CloudRain, TreePine, Sun } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<GenevaLocation | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleSelectLocation = (location: GenevaLocation | null) => {
    setSelectedLocation(location);
    if (location) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToCornavin = () => {
    const cornavin = LOCATIONS.find((l) => l.id === 'gare-cornavin');
    if (cornavin) {
      setSelectedLocation(cornavin);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Floating Capsule Header */}
      <Navbar
        locations={LOCATIONS}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onOpenInfo={() => setIsInfoModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
        {selectedLocation ? (
          /* Sub-Page View */
          <LocationSubPage
            location={selectedLocation}
            allLocations={LOCATIONS}
            onBackToMap={() => setSelectedLocation(null)}
            onSelectLocation={handleSelectLocation}
          />
        ) : (
          /* Geneva Overview & 3D Interactive Map */
          <div className="space-y-14 sm:space-y-16">
            
            {/* Architectural Hero Header */}
            <div className="space-y-6 max-w-3xl mx-auto text-center pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-700 text-xs font-medium shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-resilient-600" />
                <span>IB Year 11 Personal Project • Geneva Urban Adaptation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.12] font-display">
                Adapting Geneva’s Public Spaces to Climate Change
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                Explore an architectural vision where Geneva’s heat-trapping asphalt transforms into a climate-resilient sponge city with native shade canopies and living sedum roofs.
              </p>

              {/* Research / Search Capsule Bar */}
              <div className="pt-2">
                <SearchBar
                  locations={LOCATIONS}
                  onSelectLocation={handleSelectLocation}
                  selectedLocation={selectedLocation}
                />
              </div>
            </div>

            {/* 3D Map Section */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  <span>3D Isometric Urban Twin</span>
                  <span>•</span>
                  <span className="normal-case font-normal text-neutral-500">
                    Click any marker to zoom into that location
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-900" />
                    <span>4 Showcases: Cornavin, Plainpalais, Rive & Les Pâquis</span>
                  </span>
                </div>
              </div>

              <div className="h-[580px] sm:h-[660px] w-full">
                <Geneva3DMap
                  locations={LOCATIONS}
                  selectedLocation={selectedLocation}
                  onSelectLocation={handleSelectLocation}
                />
              </div>
            </section>

            {/* Hotspot Catalog Cards */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                    Hotspot Catalog
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
                    Explore Target Public Spaces
                  </h2>
                </div>
                <button
                  onClick={() => setIsInfoModalOpen(true)}
                  className="text-xs font-medium text-neutral-700 hover:text-black underline underline-offset-4"
                >
                  Read Geneva Climate Emergency Brief →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LOCATIONS.map((loc) => {
                  const isActive = loc.status === 'active';

                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className={`group cursor-pointer rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
                        isActive
                          ? 'glass-card border-neutral-300 hover:border-neutral-900 shadow-card hover:shadow-card-hover'
                          : 'glass-card hover:bg-neutral-50 shadow-subtle hover:shadow-card'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                            {loc.frenchName}
                          </span>
                          {isActive ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-white flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3 text-resilient-400" />
                              LIVE SHOWCASE
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-neutral-100 text-neutral-500">
                              UPCOMING
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-neutral-950 group-hover:text-black font-display">
                            {loc.name}
                          </h3>
                          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                            {loc.subtitle}
                          </p>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                            <span className="text-[10px] font-medium text-neutral-500 block">Peak Surface</span>
                            <span className="text-xs font-bold text-neutral-900 font-mono">
                              {loc.metrics[0].adaptedValue}°C <span className="text-[10px] text-neutral-400 font-normal">({loc.metrics[0].currentValue}°C)</span>
                            </span>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                            <span className="text-[10px] font-medium text-neutral-500 block">Water Capture</span>
                            <span className="text-xs font-bold text-cyan-700 font-mono">
                              {loc.metrics[1].adaptedValue}% <span className="text-[10px] text-neutral-400 font-normal">({loc.metrics[1].currentValue}%)</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium">
                        <span className="text-neutral-500 group-hover:text-neutral-900">
                          {isActive ? 'Interactive Slider & Sub-Page' : 'Explore Location'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-600 transition-all group-hover:translate-x-1">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3 Adaptation Pillars */}
            <section className="glass-card p-8 sm:p-10 rounded-3xl shadow-card space-y-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Geneva Urban Principles
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
                  Three Pillars of Climate Adaptation
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  How architectural engineering converts conventional concrete spaces into active ecological sponges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-full bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-cyan-600">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 font-display">1. Sponge City Ground</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Replacing sealed asphalt with porous stone pavers and continuous bioswales captures up to 75% of torrential rainwater on-site, recharging water tables and stopping street flash-floods.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                    <TreePine className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 font-display">2. Urban Canopies</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Native shade trees transpire water vapor into the air, acting as natural evaporative coolers that lower ground temperatures by up to 14°C and protect pedestrians.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 font-display">3. Living Roofs & Solar</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Sedum plants insulate buildings against summer heat while evaporatively cooling solar panels, increasing photovoltaic electricity output while purifying urban air.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-resilient-600" />
            <span>Geneva Resilient • IB Year 11 Personal Project</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="hover:text-black transition-colors"
            >
              Climate Context & Background
            </button>
            <span>•</span>
            <button
              onClick={handleGoToCornavin}
              className="text-neutral-900 font-semibold hover:underline"
            >
              Gare Cornavin Case Study →
            </button>
          </div>
        </div>
      </footer>

      {/* Climate Context Modal */}
      <ClimateContextModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onGoToCornavin={handleGoToCornavin}
      />
    </div>
  );
};

export default App;
