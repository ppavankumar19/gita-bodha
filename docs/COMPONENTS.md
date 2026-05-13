# Component Guide — Gita Bala Vanam

This document describes every React component: its responsibility, props, and how it connects to state.

---

## Component Tree

```
App (router root)
├── Header
└── main (Routes)
    ├── Home
    │   ├── DailySloka
    │   │   └── (inline play button using useVoice)
    │   ├── SlokaCard × 3    (featured)
    │   │   ├── ThemeTag × n
    │   │   └── (inline play button using useVoice)
    │   └── (virtue link pills)
    ├── SlokaList
    │   ├── SearchBar
    │   └── SlokaCard × n
    │       └── ThemeTag × n
    ├── SlokaView
    │   ├── VoicePlayer
    │   └── ThemeTag × n
    ├── ChaptersPage
    ├── ThemesPage
    └── ThemePage
        └── SlokaCard × n
```

---

## Pages

### `Home` — `/`

**Responsibility:** Landing page. Displays hero, stats, daily sloka, featured cards, and virtue links.

**Data:** `useFeaturedSlokas()` for the card grid; `getAllThemes()` for virtue links; `DailySloka` handles its own data internally.

**Sections:**
1. Hero — headline, subtitle, CTA buttons
2. Stats — 4 stat counters (slokas count, 18 chapters, 700 verses, age 6+)
3. Today's Sloka — `DailySloka` component
4. Featured Slokas — `SlokaCard` grid (is_featured === true)
5. Virtues — theme pill links

---

### `SlokaList` — `/slokas` and `/chapter/:chapterNum`

**Responsibility:** Renders a searchable, filterable grid of slokas. Works for both curated list and chapter browsing.

**Logic:**
- If `chapterNum` param present → `useGitaChapter(chapterNum)` (API, batched fetch)
- Otherwise → `useCuratedSlokas()` (local data, instant)
- Passes slokas to `useSearch()` for Fuse.js filtering
- Renders `SearchBar` + `SlokaCard` grid

**Loading state:** Spinner shown while chapter API fetches are in progress.

---

### `SlokaView` — `/sloka/:id`

**Responsibility:** Full detail view for one sloka. Shows sloka text, bhavam, purport, child summary, virtue tags, voice controls, prev/next navigation.

**Data:** `useGitaVerse(id)` — local-first lookup, falls back to API.

**Navigation:** Prev/Next computed from `CHAPTERS` data (verse counts per chapter). Correctly crosses chapter boundaries.

**Sections:**
1. Breadcrumb — Home / Adhyayam N / Slokam N
2. Sloka header — chapter label, favorite toggle
3. Sloka text — Telugu script, left-bordered highlight box
4. Word meanings — collapsible `<details>` (if data present)
5. Telugu Bhavam — meaning in Telugu
6. English Meaning — fallback if no Telugu bhavam
7. Purport — extended commentary, collapsible `<details>`
8. For Children — `child_summary_telugu`, amber gradient card
9. Virtues — difficulty badge, age badge, `ThemeTag` list
10. Voice Player — `VoicePlayer` component
11. Prev/Next — two-column navigation buttons

---

### `ChaptersPage` — `/chapters`

**Responsibility:** Displays a grid of all 18 Adhayayas. Each card shows chapter number, Telugu name, English name, verse count, and navigates to `/chapter/:n`.

**Data:** Local `CHAPTERS` array — no API calls needed.

---

### `ThemesPage` — `/themes`

**Responsibility:** Displays all unique virtue/theme tags extracted from curated slokas.

**Data:** `getAllThemes()` from `slokas.js`. Only shows non-Telugu themes (English virtue names).

---

### `ThemePage` — `/theme/:themeName`

**Responsibility:** Shows all curated slokas that have a specific virtue in their `moral_themes` array.

**Data:** Filters `slokas.js` by `themeName` param. Renders `SlokaCard` grid.

---

## Components

### `Header`

**Responsibility:** Sticky navigation bar with logo, desktop nav links, and mobile hamburger menu.

**State:** `menuOpen` (local) — toggled by hamburger button, auto-closed via `useEffect` on `location.pathname` change (handles back/forward browser navigation too).

**Nav links:** Slokas · Adhayayas · Virtues

---

### `Footer`

**Responsibility:** Site footer with branding and link row.

---

### `SlokaCard`

**Responsibility:** Compact sloka preview card used in grids across Home, SlokaList, ThemePage.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `sloka` | object | Full sloka data object |
| `compact` | boolean | If true, hides sloka text preview (default: false) |

**Interactions:**
- Click anywhere → `navigate('/sloka/{id}')`
- Favorite button → `toggleFavorite(id)` (stops card click propagation)
- Listen/Pause button → `playText(text, id)` via `useVoice()`

**Voice state:** Uses `playingId` and `status` from `useVoice()` to show Play / Pause / Resume / Loading state.

---

### `DailySloka`

**Responsibility:** Displays today's featured sloka on the Home page, with an inline play button.

**Algorithm:** `dayOfYear % slokas.length` — deterministic, same sloka all day, rotates daily.

**Voice:** Plays sloka text using `useVoice().playText()`.

---

### `VoicePlayer`

**Responsibility:** Full-featured TTS controls rendered on the SlokaView detail page.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `id` | string | Sloka ID (e.g. `"2-47"`) |
| `slokaText` | string | Sanskrit text in Telugu script |
| `bhavamText` | string | Telugu bhavam (meaning) |

**Features:**
- **Mode selector:** Sloka / Bhavam / Both — determines what text is spoken
- **Play/Pause button:** Large circular button, shows loading spinner during fetch
- **Stop button:** Appears only when playing or paused
- **Wave animation:** Animated bars shown during playback
- **Rate selector:** 0.5x / 0.75x / 1.0x speed buttons

**Voice state sync:** Reads `playingId` from `useVoice()` to determine if this specific player is active vs. another sloka playing.

---

### `SearchBar`

**Responsibility:** Search input with chapter and theme filter dropdowns.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `query` | string | Current search query |
| `setQuery` | function | Update query |
| `filters` | object | `{ chapter: number|null, theme: string|null }` |
| `setFilters` | function | Update filters object |
| `resultCount` | number | Number of results (shown as badge) |

**Features:**
- Fuzzy search (Fuse.js via `useSearch`)
- Auto-suggested virtue chips (filtered by current query)
- Adhyayam (chapter) filter dropdown
- Virtue (theme) filter dropdown
- Result count indicator
- Clear all / reset button
- Horizontally scrollable suggestions on mobile

---

### `ThemeTag`

**Responsibility:** Renders a clickable virtue badge that navigates to `/theme/:name`.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `theme` | string | Virtue name (e.g. `"Courage"`, `"Duty"`) |
| `clickable` | boolean | If true (default), renders as Link to `/theme/:name`; otherwise renders as `<span>` |

**Logic:** Detects Telugu script via `/[\u0C00-\u0C7F]/` regex and returns `null` for Telugu-only tags (only English tags shown in UI). If clickable, renders as a `<Link>` navigating to the theme page.

---

### `ChapterNav`

**Responsibility:** Renders chapter navigation breadcrumb / indicator used in chapter browsing contexts.

---

## Hook Quick Reference

| Hook | Where used | What it provides |
|---|---|---|
| `useVoice()` | SlokaCard, DailySloka, VoicePlayer | `playText`, `handlePause`, `handleStop`, `status`, `rate`, `setRate`, `playingId` |
| `useApp()` | SlokaCard, SlokaView, Header | `isFavorite`, `toggleFavorite`, `playingId`, `voiceStatus` |
| `useGitaVerse(id)` | SlokaView | `{ data, loading, error }` |
| `useGitaChapter(n)` | SlokaList | `{ verses, chapterInfo, loading, error }` |
| `useCuratedSlokas()` | SlokaList | `{ slokas }` |
| `useFeaturedSlokas()` | Home | `{ slokas, loading }` |
| `useSearch(slokas)` | SlokaList | `{ results, query, setQuery, filters, setFilters }` |
