# 📐 SCOPE.md — గీత బాల వనం (Gita Bala Vanam)

**Project:** Gita Bala Vanam — Bhagavad Gita for Children (Telugu)
**Version:** 1.2
**Last Updated:** March 2026

---

## 🎯 Project Goal

Build a child-friendly web application that presents selected Bhagavad Gita slokas in Telugu with their bhavam (meaning), voice playback, and a search feature — so children aged 6–16 can explore moral values rooted in the Gita in an accessible, engaging way.

**Language strategy:** Slokas and bhavams stay in Telugu. All UI, navigation, and labels are in English.

---

## ✅ IN SCOPE (What We Are Building)

### Phase 1 — Core ✅ COMPLETE

- [x] **Sloka Display**
  - Sanskrit sloka in Telugu script
  - Transliteration (pronunciation guide)
  - Telugu bhavam (full meaning)
  - Child-friendly one-line summary in Telugu
  - Virtue tags (English)

- [x] **Sloka Library**
  - 23 carefully selected child-appropriate slokas
  - Organized by chapter
  - Difficulty: Beginner / Intermediate
  - Virtues: Duty, Courage, Honesty, Devotion, Compassion, Patience, etc.

- [x] **Search Feature**
  - Search by keyword (Telugu or English)
  - Search by virtue
  - Search by chapter number
  - Search by sloka ID (e.g., "2-47")
  - Instant results via Fuse.js fuzzy search

- [x] **Voice Playback**
  - Play button on each sloka card
  - Read aloud sloka (Sanskrit) or bhavam (Telugu)
  - Pause / Stop controls
  - Speed control (0.75x, 1x, 1.25x)
  - Animated waveform indicator while playing

- [x] **Responsive UI**
  - Works on mobile, tablet, desktop
  - Clean, child-friendly design (warm saffron palette)
  - Telugu font rendering (Noto Sans Telugu)

---

### Phase 2 — Enhanced ✅ COMPLETE

- [x] **Favorites / Bookmark**
  - Heart icon on each sloka card
  - Stored in browser localStorage

- [x] **Daily Sloka**
  - Featured sloka rotates daily on homepage

- [x] **Chapter Browser (Adhayayas)**
  - All 18 Adhayayas with verse counts
  - Shows Telugu chapter name alongside English
  - CORS handled by Vite dev proxy in development

- [x] **Full Gita via API**
  - gita-api.vercel.app integration (free, no key required)
  - Browse all 700 verses across 18 chapters
  - Telugu bhavam overlaid where available from local data

- [x] **Virtue Filter Pages**
  - Browse slokas by virtue (English tags only in UI)

- [x] **Sarvam AI Telugu TTS**
  - Native Telugu voice (`anushka`, `bulbul:v2`)
  - API key configured and active

---

### Phase 3 — Future (Nice to Have)

- [ ] **ElevenLabs Voice Cloning**
  - Clone a scholar/pandit voice for authentic sloka recitation
  - Code ready — plug in `VITE_ELEVENLABS_API_KEY` + `VITE_ELEVENLABS_VOICE_ID`

- [ ] **Quiz / Activity**
  - Match-the-meaning quiz for children
  - Multiple choice "What does this sloka teach?"

- [ ] **Print / Share Card**
  - Printable sloka card for classroom use

- [ ] **Parent / Teacher Mode**
  - Notes for parents on explaining each sloka

- [ ] **Offline PWA**
  - Install as Progressive Web App
  - Offline sloka access for schools with limited internet

- [ ] **Expand Telugu Bhavam Coverage**
  - Currently 23 slokas have Telugu bhavam
  - Target: 100+ slokas with Telugu bhavam

---

## ❌ OUT OF SCOPE

- User accounts, login, or database backend
- Video content or animations
- Paid subscription or monetization
- Mobile native app (Android/iOS)
- Multi-language beyond Telugu + English (Phase 1 & 2)

---

## 👥 Target Audience

| Audience | Age | Use Case |
|---|---|---|
| Primary Children | 6–10 | Listen to slokas, view simple bhavam |
| Middle School | 11–14 | Read and understand deeper meaning |
| High School | 15–16 | Explore virtues |
| Parents | Any | Daily reading with children |
| Teachers | Any | Classroom moral education |

---

## 🔊 Voice / TTS Strategy

| Provider | Quality | Status |
|---|---|---|
| **Web Speech API** | Basic | ✅ Active — zero setup fallback |
| **Sarvam AI** | Excellent (Indian languages) | ✅ Active — API key configured |
| **ElevenLabs** | Excellent + Voice Cloning | 🔜 Pending API key + voice ID |

---

## ⚠️ Constraints & Assumptions

1. **Telugu bhavam accuracy** — Sloka data reviewed by Telugu scholars before publishing.
2. **API keys** — TTS API keys provided by user; app gracefully falls back to browser TTS.
3. **Gita API** — `gita-api.vercel.app` used for Sanskrit/transliteration/Telugu. Free, no key required. CORS requires Vite dev proxy in development; production needs a reverse proxy.
4. **Browser compatibility** — Web Speech API works in Chrome, Edge, Safari.
5. **Phase 1 & 2 = Frontend only** — No server, no database.

---

## 📅 Milestone Status

| Milestone | Description | Status |
|---|---|---|
| M1 | Project setup, 10 slokas, basic UI | ✅ Done |
| M2 | Full sloka display + Telugu bhavam + voice | ✅ Done |
| M3 | Search feature (keyword + virtue + chapter) | ✅ Done |
| M4 | 23 slokas, mobile responsive, polish | ✅ Done |
| M5 | Favorites, daily sloka, chapter browser | ✅ Done |
| M6 | gita-api.vercel.app integration (all 700 verses) | ✅ Done |
| M7 | Sarvam AI Telugu TTS | ✅ Done |
| M8 | ElevenLabs voice cloning | 🔜 Next |
