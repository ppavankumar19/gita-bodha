import { slokas, getFeaturedSlokas } from '../data/slokas';

// All 23 curated slokas are embedded in slokas.js — no API call needed
export function useCuratedSlokas() {
  return { slokas, loading: false, error: null };
}

// Featured slokas only — also fully local
export function useFeaturedSlokas() {
  return { slokas: getFeaturedSlokas(), loading: false };
}
