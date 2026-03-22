# 📋 SPEC.md — Technical Specification
## గీత బాల వనం (Gita Bala Vanam)

**Version:** 1.2
**Status:** Active
**Updated:** March 2026

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | React 18 (Vite 6) | Fast, component-based |
| Styling | Tailwind CSS 3 | Utility-first, responsive |
| Routing | React Router v6 | Standard SPA routing |
| Search | Fuse.js | Lightweight fuzzy search, works offline |
| Gita Data | gita-api.vercel.app | All 700 verses, Telugu text — free, no key |
| TTS Primary | ElevenLabs API | Best voice quality + voice cloning (pending key) |
| TTS Indian | Sarvam AI | Specialized Indian language TTS — active |
| TTS Fallback | Web Speech API | Free, browser built-in, zero setup |
| Font | Noto Sans Telugu | Google Fonts, best Telugu rendering |
| State | React Context + useState | Simple, no Redux needed |
| Persistence | localStorage | Favorites bookmarks |
| Build | Vite 6 | Fast HMR, optimal bundling |

---

## 2. Folder & File Structure

```
gita-bodha/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SlokaCard.jsx
│   │   ├── VoicePlayer.jsx
│   │   ├── ChapterNav.jsx
│   │   ├── ThemeTag.jsx
│   │   └── DailySloka.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   ├── slokas.js              # 23 curated slokas with Telugu bhavam
│   │   └── chapters.js            # 18 chapters: Telugu names + verse counts
│   ├── hooks/
│   │   ├── useCuratedSlokas.js    # Local data only — no API call
│   │   ├── useSearch.js
│   │   ├── useVoice.js
│   │   ├── useGitaVerse.js        # Local-first; API fallback for non-curated
│   │   └── useGitaChapter.js      # Batched API fetch (10 at a time) + merge
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SlokaList.jsx
│   │   ├── SlokaView.jsx
│   │   ├── ChaptersPage.jsx
│   │   ├── ThemePage.jsx
│   │   └── ThemesPage.jsx
│   ├── services/
│   │   ├── gitaApi.js             # gita-api.vercel.app client + in-memory cache + merge
│   │   ├── ttsService.js          # TTS abstraction layer (ElevenLabs → Sarvam → Browser)
│   │   ├── elevenLabsApi.js       # ElevenLabs TTS
│   │   └── sarvamApi.js           # Sarvam AI TTS (Telugu native)
│   └── styles/
│       └── global.css
├── .env                           # Secret keys (gitignored)
├── .env.example                   # Template for setup
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js                 # Dev proxy: /api/gita → gita-api.vercel.app
├── bhagavadgita.md
├── README.md
├── SCOPE.md
└── SPEC.md
```

---

## 3. Data Model

### 3.1 Curated Sloka Object (`src/data/slokas.js`)

```javascript
{
  id: "2-47",                          // "chapter-verse"
  chapter: 2,
  verse: 47,
  chapter_name_telugu: "సాంఖ్య యోగం",
  chapter_name_english: "Sankhya Yoga",
  sloka_sanskrit: "కర్మణ్యేవాధికారస్తే...",  // Sanskrit in Telugu script
  transliteration: "Karmanye vadhikaraste...",
  bhavam_telugu: "కర్మ చేయడానికి నీకు హక్కు ఉంది...",
  child_summary_telugu: "మన పని మనం చేయాలి...",
  moral_themes: ["Duty", "Selflessness"],
  difficulty: "beginner",              // "beginner" | "intermediate"
  age_group: "6+",
  is_featured: true,
}
```

**Helper functions exported from slokas.js:**
- `getAllThemes()` — unique sorted virtue list
- `getAllChapters()` — unique chapter numbers
- `getSlokaById(id)` — lookup by ID
- `getFeaturedSlokas()` — filter is_featured=true (8 slokas)
- `getDailySloka()` — deterministic daily rotation

### 3.2 Merged Verse Object (API + Local)

```javascript
// Output of mergeWithLocal() in gitaApi.js
{
  id: "2-47",
  chapter: 2,
  verse: 47,
  chapter_name_english: "Sankhya Yoga",
  chapter_name_telugu: "సాంఖ్య యోగం",     // from local data (if available)
  sloka_sanskrit: "...",                   // from API
  transliteration: "...",                  // from API
  bhavam_telugu: "...",                    // from local data (null if not curated)
  child_summary_telugu: "...",             // from local data (null if not curated)
  moral_themes: [...],                     // from local data ([] if not curated)
  bhavam_english: "...",                   // from API
  difficulty: "beginner",                 // from local data (null if not curated)
  age_group: "6+",                        // from local data (null if not curated)
  is_featured: false,                     // from local data
}
```

### 3.3 Fuse.js Search Config

```javascript
const fuseOptions = {
  keys: [
    { name: "sloka_sanskrit", weight: 0.3 },
    { name: "bhavam_telugu", weight: 0.4 },
    { name: "child_summary_telugu", weight: 0.2 },
    { name: "moral_themes", weight: 0.5 },
    { name: "chapter_name_telugu", weight: 0.3 },
    { name: "id", weight: 0.6 },
  ],
  threshold: 0.4,
  includeScore: true,
};
```

---

## 4. API Integration

### 4.1 Gita API (gita-api.vercel.app)

**Base URL:** `https://gita-api.vercel.app` (production) / `/api/gita` (dev via Vite proxy)

**No API key required.**

**Endpoints used:**

| Endpoint | Purpose |
|---|---|
| `GET /tel/verse/{chapter}/{verse}` | Single verse with Telugu text + translation |

**CORS:** Blocked in browser. Dev server proxies `/api/gita/*` → `gita-api.vercel.app` via `vite.config.js`. Production needs a reverse proxy.

**Caching:** In-memory Map cache — avoids duplicate API calls within a session.

**Known quirks:**
- `verse_no` can be `"5,6"` (combined verse) → parse first number
- `verse` field can be an array → join with `\n`

### 4.2 Data Merge Strategy

```
API verse data  ──┐
                  ├──► mergeWithLocal() ──► Merged verse object ──► UI
Local sloka data ─┘
```

- **Telugu fields** (bhavam_telugu, child_summary_telugu, moral_themes) come from `slokas.js`
- **Sanskrit/transliteration** come from the API
- If no local data exists → Telugu fields are `null`, API translation shown as fallback

---

## 5. Voice / TTS Service

### Priority Order
```
1. ElevenLabs (VITE_ELEVENLABS_API_KEY set?)  → use elevenLabsApi.js
2. Sarvam AI  (VITE_SARVAM_API_KEY set?)      → use sarvamApi.js
3. Web Speech API                              → browser built-in fallback
```

### Sarvam AI (Active)

```javascript
POST https://api.sarvam.ai/text-to-speech/stream
Body: {
  text: text,
  target_language_code: "te-IN",
  speaker: "simran",
  model: "bulbul:v3",
  speech_sample_rate: 22050,    // valid: 8000 | 16000 | 22050 only
  pace: 1,
  output_audio_codec: "mp3",
  enable_preprocessing: true,
}
```

Speed (`rate`) must be passed through from `useVoice` → `ttsService.speak()` → `sarvamSpeak()`.

### ElevenLabs Voice Cloning (Pending key)

```javascript
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Headers: { "xi-api-key": VITE_ELEVENLABS_API_KEY }
Body: {
  text: slokaText,
  model_id: "eleven_multilingual_v2",
  voice_settings: { stability: 0.5, similarity_boost: 0.75 }
}
```

**To clone a voice:** Upload 1–5 min audio of the target voice on ElevenLabs dashboard → copy the Voice ID → set `VITE_ELEVENLABS_VOICE_ID` in `.env`.

---

## 6. Pages & Routing

```jsx
<AppProvider>                       {/* Favorites context */}
  <Header />
  <Routes>
    <Route path="/"                    element={<Home />} />
    <Route path="/slokas"              element={<SlokaList />} />       {/* 23 curated */}
    <Route path="/sloka/:id"           element={<SlokaView />} />       {/* local-first */}
    <Route path="/chapter/:chapterNum" element={<SlokaList />} />       {/* API fetch */}
    <Route path="/chapters"            element={<ChaptersPage />} />    {/* static */}
    <Route path="/theme/:themeName"    element={<ThemePage />} />
    <Route path="/themes"              element={<ThemesPage />} />
    <Route path="*"                    element={<NotFound />} />
  </Routes>
  <Footer />
</AppProvider>
```

---

## 7. Design System

### Color Palette

| Token | Hex | Use |
|---|---|---|
| `primary` | `#E07B39` | Saffron — buttons, highlights |
| `secondary` | `#2D6A4F` | Deep green — chapter tags |
| `background` | `#FFF8F0` | Warm cream — app background |
| `surface` | `#FFFFFF` | Card background |
| `text-main` | `#1A1A2E` | Primary text |
| `text-muted` | `#6B7280` | Secondary text |
| `accent` | `#F4D03F` | Gold — badges |

### Typography

```css
font-family: 'Noto Sans Telugu', sans-serif;  /* Telugu content */

.sloka-text   { font-size: 1.4rem; line-height: 2.2rem; }
.bhavam-text  { font-size: 1.1rem; line-height: 1.9rem; }
.summary-text { font-size: 1.15rem; font-weight: 700; }
```

---

## 8. Environment Variables

```env
# Optional — TTS (falls back to browser if not set)
VITE_ELEVENLABS_API_KEY=      # ElevenLabs API key
VITE_ELEVENLABS_VOICE_ID=     # Cloned voice ID from ElevenLabs dashboard
VITE_SARVAM_API_KEY=          # Sarvam AI key (best Telugu TTS — active)

# Feature flags
VITE_ENABLE_FAVORITES=true
VITE_ENABLE_DAILY_SLOKA=true
VITE_USE_BROWSER_TTS_FALLBACK=true
```

---

## 9. Build & Dev Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## 10. Known Limitations

1. **Chapter browsing CORS** — `gita-api.vercel.app` blocks direct browser requests. Dev Vite proxy handles this automatically. Production deployment needs a reverse proxy.
2. **Telugu TTS via browser** — quality varies by OS/browser. Chrome on Android gives decent results.
3. **ElevenLabs voice cloning** — code is ready; requires API key + voice ID. Starter plan ($5/month) or above needed.
4. **Telugu bhavam coverage** — 23 of 700 verses have Telugu bhavam in local data. Rest show API Telugu translation as fallback.
