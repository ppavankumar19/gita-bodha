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
    <header className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🪷</span>
          <div className="leading-tight">
            <div className="font-telugu font-bold text-primary text-base leading-tight">
              గీత బాల వనం
            </div>
            <div className="font-ui text-text-muted text-[10px] tracking-widest uppercase">
              Gita Bala Vanam
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-ui px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-main hover:bg-orange-50 hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-text-main transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-text-main my-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-text-main transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-orange-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-ui px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-text-main hover:bg-orange-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
