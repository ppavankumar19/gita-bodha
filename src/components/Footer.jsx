import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-orange-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪷</span>
              <div>
                <p className="font-telugu font-bold text-primary text-base leading-tight">గీత బాల వనం</p>
                <p className="font-ui text-text-muted text-[10px] tracking-widest uppercase">Gita Bala Vanam</p>
              </div>
            </div>
            <p className="font-telugu text-text-muted text-sm leading-relaxed">
              విద్యా దదాతి వినయం
            </p>
            <p className="font-ui text-text-muted text-xs mt-1 italic">
              "Knowledge gives humility"
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-ui font-semibold text-text-main text-sm mb-3 uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/slokas', label: 'Curated Slokas' },
                { to: '/chapters', label: 'All 18 Adhayayas' },
                { to: '/themes', label: 'Virtues' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="font-ui text-sm text-text-muted hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-ui font-semibold text-text-main text-sm mb-3 uppercase tracking-wide">About</h4>
            <p className="font-ui text-sm text-text-muted leading-relaxed">
              Bhagavad Gita for children aged 6–16. Telugu slokas with bhavam, voice playback, and moral values — built for the next generation.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-orange-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-ui text-xs text-text-muted">
            © 2026 Gita Bala Vanam · Bhagavad Gita for Children · Telugu Edition
          </p>
          <p className="font-ui text-xs text-text-muted">
            Built with 🙏 for Andhra Pradesh & Telangana
          </p>
        </div>
      </div>
    </footer>
  );
}
