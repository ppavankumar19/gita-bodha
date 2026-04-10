# Data Flow — Gita Bala Vanam

This document traces how data enters, moves through, and is displayed in the application.

---

## 1. Data Sources

### A. Local Curated Data (embedded at build time)

```
src/data/slokas.js   — 23 hand-selected slokas with rich metadata
src/data/chapters.js — 18 Adhayaya names + verse counts
```

**Sloka metadata shape:**
```js
{
  id: '2-47',                  // "{chapter}-{verse}"
  chapter: 2,
  verse: 47,
  chapter_name_english: 'Sankhya Yoga',
  chapter_name_telugu: 'సాంఖ్య యోగం',
  sloka_sanskrit: 'కర్మణ్యేవాధికారస్తే...',   // Sanskrit in Telugu script
  bhavam_telugu: 'నీకు కర్మ చేయడంలో మాత్రమే...',
  child_summary_telugu: 'ఫలితాన్ని ఆశించకుండా...',
  moral_themes: ['Duty', 'Detachment', 'Action'],
  difficulty: 'beginner',      // 'beginner' | 'intermediate'
  age_group: '8+',
  is_featured: true,
}
```

### B. Telugu Gita API (fetched at runtime)

- **Base URL:** `https://gita-api.vercel.app` (proxied via `/api/gita`)
- **Endpoint:** `GET /tel/verse/{chapter}/{verse}`
- **Returns:** Sanskrit text (Telugu script), translation, purport, audio link
- **Coverage:** All 700 verses across 18 chapters

**Raw API response shape:**
```json
{
  "chapter_no": 2,
  "verse_no": 47,
  "verse": "కర్మణ్యేవాధికారస్తే...",
  "translation": "...",
  "purport": "...",
  "audio_link": "...",
  "chapter_name": "2. సాంఖ్య యోగం"
}
```

---

## 2. Data Layer: Services & Hooks

### gitaApi.js — API Client with Cache

```
Request path:
  hook → fetchVerse(chapter, verse)
       → cache hit? return cached : fetch /api/gita/tel/verse/{c}/{v}
       → mapVerse(raw) → normalised internal shape
       → cache.set(path, data)
       → return verse object
```

**mapVerse()** normalises the raw API response:
- Strips numeric prefix from `chapter_name` (e.g. `"2. సాంఖ్య యోగం"` → `"సాంఖ్య యోగం"`)
- Handles combined verse numbers (`verse_no = "5,6"` → uses first)
- Handles verse text as string or array of lines
- Merges optional local metadata (themes, difficulty, child summary)

**fetchChapterVerses()** batches 15 verses in parallel per batch:
```
for each batch of 15 verses:
  Promise.all([fetchVerse(c,1), ..., fetchVerse(c,15)])
  → skip nulls (failed individual fetches)
  → push to results
→ merge with local curated metadata
→ return enriched verse array
```

### Custom Hooks

| Hook | Input | Output | Data source |
|---|---|---|---|
| `useCuratedSlokas` | — | `{ slokas }` | `slokas.js` (local) |
| `useFeaturedSlokas` | — | `{ slokas, loading }` | `slokas.js` (local) |
| `useGitaVerse(id)` | `"2-47"` | `{ data, loading, error }` | Local-first → API fallback |
| `useGitaChapter(n)` | `2` | `{ verses, chapterInfo, loading, error }` | API + local enrichment |
| `useSearch(slokas)` | sloka array | `{ results, query, setQuery, ... }` | Fuse.js (in-memory) |
| `useVoice()` | — | voice controls + status | `AppContext` |

### useGitaVerse — Local-first with API fallback

```
useGitaVerse("2-47")
  1. Check slokas.js local data → getSlokaById("2-47")
  2. If found → return immediately (no network request)
  3. If not found → fetchVerse(2, 47) from Gita API
  4. Merge API data with any matching local metadata
  5. Return normalised verse object
```

---

## 3. State Flow: Global Voice Sync

All voice playback state lives in `AppContext` to ensure only one sloka plays at a time.

```
User clicks Play on SlokaCard or VoicePlayer
  │
  ▼
useVoice().playText(text, id)
  │
  ▼
AppContext.playSloka(id, text)
  │
  ├── Same sloka playing?
  │     yes → toggle pause/resume (no new network request)
  │
  ├── Different sloka?
  │     yes → stop() current audio
  │           setPlayingId(id)
  │           setVoiceStatus('loading')
  │
  ▼
ttsService.speak(text, { lang, rate, onStart, onEnd, onError })
  │
  ├── VITE_ELEVENLABS_API_KEY set?
  │     yes → elevenLabsSpeak(text) → Audio blob → audio.play()
  │           onStart → setVoiceStatus('playing')
  │           onEnd   → setVoiceStatus('idle'), setPlayingId(null)
  │
  ├── VITE_SARVAM_API_KEY set?
  │     yes → sarvamSpeak(text) → Audio blob → audio.play()
  │
  └── Fallback → browserSpeak() → SpeechSynthesisUtterance
                  lang: 'te-IN', rate: voiceRate
```

**Voice status state machine:**
```
idle ──[play]──► loading ──[onStart]──► playing
                                │
                           [pause]  ◄──[resume]──► paused
                                │
                           [onEnd / stop]
                                │
                              idle
```

All components that render voice controls observe `playingId` and `voiceStatus` from `AppContext` via `useVoice()`. This ensures the play/pause button state is consistent across:
- `SlokaCard` (grid view)
- `DailySloka` (homepage)
- `VoicePlayer` (detail page)

---

## 4. Search Data Flow

```
User types in SearchBar
  │
  ▼
useSearch(slokas).setQuery(value)
  │
  ▼
Fuse.js.search(query)
  searches: sloka_sanskrit, bhavam_telugu,
            chapter_name_english, moral_themes
  threshold: 0.4 (fuzzy, not exact match)
  │
  ▼
Optional filters applied:
  - chapterFilter: results.filter(s => s.chapter === n)
  - themeFilter:   results.filter(s => s.moral_themes.includes(t))
  │
  ▼
Filtered results → rendered as SlokaCard grid
```

---

## 5. Favorites Data Flow

```
User clicks ❤️ button on any SlokaCard or SlokaView
  │
  ▼
AppContext.toggleFavorite(id)
  │
  ├── id in favorites[] → remove it
  └── id not in favorites[] → append it
  │
  ▼
useEffect → localStorage.setItem('gbv-favorites', JSON.stringify(favorites))
  │
  ▼
Next session: useState initialiser reads localStorage → restored automatically
```

---

## 6. Page-Level Data Flows

### Home Page (`/`)
```
Home renders:
  DailySloka        → picks sloka by (dayOfYear % slokas.length) from slokas.js
  useFeaturedSlokas → filters slokas.js where is_featured === true → 3 SlokaCards
  getAllThemes()     → extracts unique moral_themes from slokas.js → theme links
```

### Sloka List (`/slokas`)
```
SlokaList (no chapterNum param):
  useCuratedSlokas() → all 23 slokas from slokas.js
  useSearch(slokas)  → Fuse.js on all 23
  → render SlokaCard grid
```

### Chapter List (`/chapter/:chapterNum`)
```
SlokaList (with chapterNum param):
  useGitaChapter(chapterNum)
    → fetchChapterVerses(n) — batched parallel API calls
    → enrich each verse with getSlokaById(id) local metadata
  → render SlokaCard grid (up to 78 verses for Ch. 18)
```

### Sloka Detail (`/sloka/:id`)
```
SlokaView:
  useGitaVerse(id)
    → local slokas.js lookup (instant)
    → OR API fetch (network)
  → render sloka text, bhavam, purport, child summary
  → VoicePlayer (full controls)
  → prev/next navigation (computed from chapters.js verse counts)
```
