import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, X, ArrowRight, Droplets, Trees } from 'lucide-react';
import { GenevaLocation } from '../types';

interface SearchBarProps {
  locations: GenevaLocation[];
  onSelectLocation: (location: GenevaLocation) => void;
  selectedLocation: GenevaLocation | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  locations,
  onSelectLocation,
  selectedLocation,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'water' | 'cooling'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations based on query & category
  const filteredLocations = locations.filter((loc) => {
    const matchesQuery =
      query.trim() === '' ||
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.frenchName.toLowerCase().includes(query.toLowerCase()) ||
      loc.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      loc.pillars.some(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

    if (!matchesQuery) return false;

    if (activeFilter === 'active') return loc.status === 'active';
    if (activeFilter === 'water') {
      return loc.pillars.some((p) => p.category === 'water');
    }
    if (activeFilter === 'cooling') {
      return loc.pillars.some((p) => p.category === 'vegetation' || p.category === 'roofs');
    }
    return true;
  });

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Floating Capsule Search Bar */}
      <div className="glass-pill rounded-full p-2 pl-5 sm:pl-6 flex items-center justify-between gap-3 transition-all duration-300 hover:shadow-pill-hover focus-within:shadow-pill-hover focus-within:border-neutral-300">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Geneva spaces, sponge city, canopy shade..."
            className="w-full bg-transparent border-none text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Button - Black Pill */}
        <button
          onClick={() => {
            if (filteredLocations.length > 0) {
              onSelectLocation(filteredLocations[0]);
              setIsOpen(false);
            }
          }}
          className="bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-medium px-5 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
        >
          <span>Find Space</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 flex-wrap">
        <button
          onClick={() => {
            setActiveFilter('all');
            setIsOpen(true);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200/80 shadow-subtle'
          }`}
        >
          All Locations
        </button>

        <button
          onClick={() => {
            setActiveFilter('active');
            setIsOpen(true);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activeFilter === 'active'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200/80 shadow-subtle'
          }`}
        >
          <Sparkles className="w-3 h-3 text-resilient-600" />
          <span>Live Showcase (Cornavin)</span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('water');
            setIsOpen(true);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activeFilter === 'water'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200/80 shadow-subtle'
          }`}
        >
          <Droplets className="w-3 h-3 text-cyan-500" />
          <span>Sponge Stormwater</span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('cooling');
            setIsOpen(true);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            activeFilter === 'cooling'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200/80 shadow-subtle'
          }`}
        >
          <Trees className="w-3 h-3 text-emerald-600" />
          <span>Canopy & Shade</span>
        </button>
      </div>

      {/* Dropdown Results Card */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 p-3 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-3xl shadow-pill-hover z-30 space-y-1.5 animate-fadeIn max-h-[360px] overflow-y-auto">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            <span>Locations matching "{query || activeFilter}"</span>
            <span>{filteredLocations.length} results</span>
          </div>

          {filteredLocations.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-500">
              No matching locations found. Try searching "Cornavin" or "water".
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-4 group ${
                    isSelected
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-950 group-hover:text-black">
                        {loc.name}
                      </span>
                      {loc.status === 'active' ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-resilient-100 text-resilient-800 font-bold">
                          Live Showcase
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {loc.subtitle}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-600 transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
