# Architecture Overview — Gita Bala Vanam

## Project Identity

**Gita Bala Vanam** (గీత బాల వనం) is a React + Vite web application that presents Bhagavad Gita slokas to Telugu-speaking children aged 6–16. The app combines curated local data, a live Gita API, and a 3-tier TTS system into a mobile-first, offline-capable reading experience.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│                                                         │
│  ┌───────────┐   ┌──────────────┐   ┌───────────────┐  │
│  │  React UI │ → │  AppContext  │ → │  TTS Service  │  │
│  │  (Pages + │   │  (Global     │   │  (3-tier TTS) │  │
│  │Components)│   │   State)     │   │               │  │
│  └───────────┘   └──────────────┘   └───────────────┘  │
│        │                                    │           │
│        ▼                                    ▼           │
│  ┌───────────┐                    ┌──────────────────┐  │
│  │Local Data │                    │ ElevenLabs API   │  │
│  │(slokas.js │                    │ Sarvam AI API    │  │
│  │chapters.js│                    │ Web Speech API   │  │
│  └───────────┘                    └──────────────────┘  │
│        │                                                 │
│        ▼                                                 │
│  ┌───────────┐                                           │
│  │ Gita API  │ ← /api/gita proxy → gita-api.vercel.app  │
│  │  Client   │   (CORS handled by Vite dev proxy /       │
│  │(gitaApi.js│    Render rewrites in production)         │
│  └───────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.3.1 | UI component tree |
| Build tool | Vite | 6.3.1 | Dev server, bundling, proxying |
| Routing | React Router DOM | 6.28.0 | SPA client-side routing |
| Styling | Tailwind CSS | 3.4.17 | Utility-first CSS |
| Search | Fuse.js | 7.0.0 | Fuzzy offline search |
| Fonts | Google Fonts | CDN | Noto Sans Telugu, Poppins, Lora |
| Gita data | gita-api.vercel.app | — | 700 verses, 18 chapters, free |
| TTS (primary) | ElevenLabs | v1 | Voice-cloned Telugu TTS |
| TTS (fallback 1) | Sarvam AI | bulbul:v3 | Native Indian-language TTS |
| TTS (fallback 2) | Web Speech API | built-in | Browser-native, always works |

---

## Directory Structure

```
gita-bodha/
├── public/
│   └── lotus.svg                  # App favicon
├── src/
│   ├── components/                # Reusable UI components (8)
│   │   ├── Header.jsx             # Sticky nav with mobile hamburger
│   │   ├── Footer.jsx             # Site footer
│   │   ├── SlokaCard.jsx          # Sloka preview card (grid item)
│   │   ├── DailySloka.jsx         # Featured sloka of the day
│   │   ├── VoicePlayer.jsx        # Full TTS controls (play/pause/stop/rate)
│   │   ├── SearchBar.jsx          # Fuzzy search + chapter/theme filters
│   │   ├── ThemeTag.jsx           # Clickable virtue/theme badge
│   │   └── ChapterNav.jsx         # Chapter navigation breadcrumb
│   ├── context/
│   │   └── AppContext.jsx         # Global state: favorites + voice playback
│   ├── data/
│   │   ├── slokas.js              # 23 curated slokas with full metadata
│   │   └── chapters.js            # 18 chapter names + verse counts
│   ├── hooks/
│   │   ├── useVoice.js            # Voice control hook (wraps AppContext)
│   │   ├── useGitaVerse.js        # Fetch single verse (local-first + API)
│   │   ├── useGitaChapter.js      # Fetch entire chapter from API
│   │   ├── useCuratedSlokas.js    # Access local curated slokas
│   │   └── useSearch.js           # Fuse.js search + filters hook
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── SlokaList.jsx          # Curated list or chapter verse list
│   │   ├── SlokaView.jsx          # Full single-sloka detail page
│   │   ├── ChaptersPage.jsx       # Grid of all 18 Adhayayas
│   │   ├── ThemesPage.jsx         # Grid of all virtue themes
│   │   └── ThemePage.jsx          # Slokas filtered by one virtue
│   ├── services/
│   │   ├── gitaApi.js             # API client + in-memory cache
│   │   ├── ttsService.js          # TTS abstraction (3-tier waterfall)
│   │   ├── elevenLabsApi.js       # ElevenLabs REST integration
│   │   └── sarvamApi.js           # Sarvam AI REST integration
│   ├── styles/
│   │   └── global.css             # Tailwind base + custom animations
│   ├── App.jsx                    # Route declarations
│   └── main.jsx                   # React DOM mount
├── docs/                          # Project documentation
├── index.html                     # HTML entry point (lang="te")
├── vite.config.js                 # Vite + dev proxy config
├── tailwind.config.js             # Custom colors, fonts
├── postcss.config.js              # PostCSS with Tailwind + Autoprefixer
├── package.json                   # Dependencies
├── .env.example                   # Environment variable template
└── .gitignore                     # node_modules, dist, .env excluded
```

---

## Routing Map

| Route | Component | Data source |
|---|---|---|
| `/` | `Home` | Local (`slokas.js`) |
| `/slokas` | `SlokaList` | Local (`slokas.js`) |
| `/sloka/:id` | `SlokaView` | Local-first → Gita API |
| `/chapter/:chapterNum` | `SlokaList` | Gita API (batched) |
| `/chapters` | `ChaptersPage` | Local (`chapters.js`) |
| `/themes` | `ThemesPage` | Local (`slokas.js`) |
| `/theme/:themeName` | `ThemePage` | Local (`slokas.js`) |
| `*` | Inline 404 | — |

---

## State Management

State is deliberately minimal — no Redux, no external store.

| State | Location | Persistence |
|---|---|---|
| Favorites (sloka IDs) | `AppContext` | `localStorage` (key: `gbv-favorites`) |
| Currently playing sloka ID | `AppContext` | In-memory only |
| Voice status | `AppContext` | In-memory only |
| Playback rate | `AppContext` | In-memory only |
| Fetched verse data | Custom hooks (`useState`) | In-memory, per-session |
| API response cache | `gitaApi.js` Map | In-memory, per-session |

---

## Design System

**Colors:**
- `primary` — `#E07B39` (saffron orange, brand color)
- `secondary` — `#2D6A4F` (forest green, accent)
- `background` — `#FFF8F0` (warm cream)
- `accent` — `#F4D03F` (golden yellow)
- `text-main` — `#1A1A2E` (near-black)
- `text-muted` — `#6B7280` (gray)

**Fonts:**
- `font-telugu` — Noto Sans Telugu (all Telugu script content)
- `font-ui` — Poppins (buttons, labels, English UI)
- `font-display` — Lora (decorative headings)

**Breakpoints:** Mobile-first (`sm:` = 640px, `md:` = 768px, `lg:` = 1024px)
