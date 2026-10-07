import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { GenevaLocation } from '../types';

interface NavbarProps {
  locations: GenevaLocation[];
  selectedLocation: GenevaLocation | null;
  onSelectLocation: (loc: GenevaLocation | null) => void;
  onOpenInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onOpenInfo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <div className="w-full max-w-5xl pointer-events-auto">
        {/* Main Floating Capsule Pill Bar - exactly matching the reference image */}
        <div className="glass-pill rounded-full py-2.5 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300">
          
          {/* Logo on Left */}
          <button
            onClick={() => onSelectLocation(null)}
            className="flex items-center gap-1.5 text-left group"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 font-display">
              Geneva<span className="text-resilient-600">.</span>
            </span>
          </button>

          {/* Navigation Links in Center (Desktop) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-xs lg:text-sm font-medium">
            <button
              onClick={() => onSelectLocation(null)}
              className={`transition-colors ${
                selectedLocation === null
                  ? 'text-neutral-950 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Overview
            </button>

            {locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              let shortName = loc.name
                .replace('Gare de Genève-', '')
                .replace('Plaine de ', '')
                .replace('Rond-point de ', '');
              if (loc.id === 'ecolint-campus-nations' || loc.name.includes('Campus des Nations')) {
                shortName = 'Campus des Nations';
              }

              return (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className={`transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'text-neutral-950 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>{shortName}</span>
                  {loc.status === 'active' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-resilient-600" />
                  )}
                </button>
              );
            })}

            <button
              onClick={onOpenInfo}
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              About
            </button>
          </nav>

          {/* Right Action Button - Black Rounded Pill */}
          <div className="flex items-center gap-2">
            {selectedLocation ? (
              <button
                onClick={() => onSelectLocation(null)}
                className="bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const cornavin = locations.find((l) => l.id === 'gare-cornavin');
                  if (cornavin) onSelectLocation(cornavin);
                }}
                className="bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-medium px-5 sm:px-6 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Explore</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-xl space-y-2 animate-fadeIn pointer-events-auto">
            <button
              onClick={() => {
                onSelectLocation(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                selectedLocation === null ? 'bg-neutral-100 text-neutral-950 font-bold' : 'text-neutral-600'
              }`}
            >
              Overview Map
            </button>

            {locations.map((loc) => {
              const displayName = loc.id === 'ecolint-campus-nations' ? 'Campus des Nations' : loc.name;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between ${
                    selectedLocation?.id === loc.id
                      ? 'bg-neutral-100 text-neutral-950 font-bold'
                      : 'text-neutral-600'
                  }`}
                >
                  <span>{displayName}</span>
                  {loc.status === 'active' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-resilient-100 text-resilient-700 font-semibold">
                      Live
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                onOpenInfo();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Climate Context & About
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
