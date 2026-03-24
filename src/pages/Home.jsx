import React from 'react';
import { Link } from 'react-router-dom';
import DailySloka from '../components/DailySloka';
import SlokaCard from '../components/SlokaCard';
import { getAllThemes, slokas } from '../data/slokas';
import { useFeaturedSlokas } from '../hooks/useCuratedSlokas';

const themes = getAllThemes().filter(t => !/[\u0C00-\u0C7F]/.test(t)).slice(0, 12);

export default function Home() {
  const { slokas: featured, loading: featuredLoading } = useFeaturedSlokas();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="text-center mb-12 fade-up">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-primary text-xs font-ui font-medium px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
          🪷 Bhagavad Gita for Children
        </div>
        <h1 className="font-telugu font-bold text-primary text-4xl sm:text-6xl mb-2 leading-tight">
          గీత బాల వనం
        </h1>
        <p className="font-display italic text-secondary text-xl mb-1">
          Knowledge · Wisdom · Values
        </p>
        <p className="font-ui text-text-muted text-sm max-w-md mx-auto leading-relaxed">
          Telugu slokas with meaning, voice playback and moral themes — curated for children aged 6–16.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link
            to="/slokas"
            className="font-ui px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
          >
            Browse Slokas
          </Link>
          <Link
            to="/chapters"
            className="font-ui px-6 py-2.5 bg-white border border-orange-300 text-primary rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
          >
            All Adhayayas
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {[
          { value: slokas.length, label: 'Knowledge Slokas', icon: '📖' },
          { value: '18', label: 'Adhayayas', icon: '📚' },
          { value: '700', label: 'Total Verses', icon: '🕉️' },
          { value: '6+', label: 'Age Group', icon: '👦' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-orange-100 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-ui text-2xl font-bold text-primary">{stat.value}</div>
            <div className="font-ui text-xs text-text-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Daily Sloka */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading text-xl text-text-main">Today's Sloka</h2>
        </div>
        <DailySloka />
      </section>

      {/* Featured Slokas */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-heading text-xl text-text-main">⭐ Featured Slokas</h2>
          <Link to="/slokas" className="font-ui text-primary text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>
        {featuredLoading ? (
          <div className="flex items-center justify-center py-12 gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-ui text-text-muted text-sm">Loading slokas...</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(s => <SlokaCard key={s.id} sloka={s} />)}
          </div>
        )}
      </section>

      {/* Moral Themes */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-heading text-xl text-text-main">🌺 Virtues</h2>
          <Link to="/themes" className="font-ui text-primary text-sm font-medium hover:underline">
            All themes →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <Link
              key={t}
              to={`/theme/${encodeURIComponent(t)}`}
              className="font-ui px-4 py-2 bg-white border border-orange-200 rounded-full text-sm text-text-main hover:bg-primary hover:text-white hover:border-primary transition-all duration-150 shadow-sm"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
