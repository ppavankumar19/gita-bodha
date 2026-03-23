import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/slokas', label: 'Slokas' },
  { to: '/chapters', label: 'Adhayayas' },
  { to: '/themes', label: 'Virtues' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 transition-all duration-300">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-secondary opacity-80" />
      
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3.5 group active:scale-95 transition-transform">
          <div className="relative">
            <span className="text-2xl block group-hover:rotate-12 transition-transform duration-300">🪷</span>
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="leading-tight">
            <div className="font-telugu font-bold text-primary text-lg leading-tight tracking-tight">
              గీత బాల వనం
            </div>
            <div className="font-ui text-text-muted text-[9px] tracking-[0.2em] uppercase font-semibold">
              Gita Bala Vanam
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1.5">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-ui px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : 'text-text-main hover:bg-orange-50 hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2.5 rounded-xl hover:bg-orange-50 transition-all active:scale-90"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between relative">
            <span className={`w-full h-0.5 bg-text-main rounded-full transition-all duration-300 transform origin-left ${menuOpen ? 'rotate-[42deg] translate-y-[-1px]' : ''}`} />
            <span className={`w-full h-0.5 bg-text-main rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-full h-0.5 bg-text-main rounded-full transition-all duration-300 transform origin-left ${menuOpen ? '-rotate-[42deg] translate-y-[1px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu (Mobile menu) */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-orange-50 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 flex flex-col gap-2 shadow-inner">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-ui px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                    : 'text-text-main hover:bg-orange-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
