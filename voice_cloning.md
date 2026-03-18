# 🎙️ Voice Cloning Setup Guide — Gita Bala Vanam

This guide explains how to clone a pandit/scholar voice using **ElevenLabs** and plug it into this project. The integration code is already written — you only need to record audio, upload it, and add two environment variables.

---

## Overview

```
Record voice  →  Upload to ElevenLabs  →  Copy Voice ID  →  Add to .env  →  Done
```

The app's TTS priority chain is:
```
1. ElevenLabs (cloned voice)   ← this guide sets this up
2. Sarvam AI (anushka)
3. Browser Web Speech API
```

Once `VITE_ELEVENLABS_API_KEY` is set in `.env`, ElevenLabs becomes the default voice automatically.

---

## Step 1 — Create an ElevenLabs Account

1. Go to **https://elevenlabs.io** and sign up (free account available)
2. Free tier gives **10,000 characters/month** — enough for testing
3. For production use, the **Starter plan ($5/month)** gives 30,000 chars + voice cloning access

> Voice cloning (Instant Clone) requires **Starter plan or above**.

---

## Step 2 — Record the Voice

### What to record
Record a Telugu pandit, scholar, or a clear adult voice reading Gita slokas.

### Recording requirements
| Requirement | Recommended |
|---|---|
| Duration | 1–5 minutes (more = better quality) |
| Format | MP3 or WAV |
| Sample rate | 44100 Hz |
| Environment | Quiet room, no background noise |
| Microphone | Any decent mic or phone mic in a silent room |
| Content | Telugu slokas or any clear Telugu speech |

### Sample recording script (use any of these slokas)
```
కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన।
మా కర్మఫలహేతుర్భూ మా తే సంగోఽస్త్వకర్మణి॥

యదా యదా హి ధర్మస్య గ్లానిర్భవతి భారత।
అభ్యుత్థానమధర్మస్య తదాత్మానం సృజామ్యహమ్॥
```

### Tips for better cloning quality
- Speak at a **natural, steady pace** — not too fast, not too slow
- Avoid breathing noise, mouth clicks, or long pauses
- Record multiple takes and pick the clearest one
- If recording on phone: use Voice Memos (iOS) or Recorder app (Android), then transfer to PC

---

## Step 3 — Upload and Clone the Voice

1. Log in to **https://elevenlabs.io**
2. Click **Voices** in the left sidebar
3. Click **Add a new voice** → select **Instant Voice Cloning**
4. Fill in:
   - **Name:** e.g., `Gita Pandit Voice`
   - **Description:** e.g., `Telugu scholar reading Bhagavad Gita slokas`
5. Upload your audio file(s) — you can upload multiple clips for better quality
6. Click **Add Voice**
7. ElevenLabs will process the voice (usually takes a few seconds)

---

## Step 4 — Get Your Voice ID

1. After cloning, go to **Voices → My Voices**
2. Find your newly created voice
3. Click the **ID icon** (or look in the URL when you click the voice)
4. Copy the Voice ID — it looks like: `abc123xyz456def789`

Alternatively, get it via API:
```bash
curl https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: YOUR_API_KEY"
```
Look for your voice name in the response JSON and copy its `voice_id`.

---

## Step 5 — Get Your API Key

1. Go to **https://elevenlabs.io → Profile → API Keys**
2. Click **Generate API Key** (or copy the existing one)
3. Copy the key — it looks like: `sk_abc123...`

---

## Step 6 — Add to .env

Open `D:\gita-bodha\.env` and fill in:

```env
VITE_ELEVENLABS_API_KEY=sk_your_actual_api_key_here
VITE_ELEVENLABS_VOICE_ID=your_voice_id_here
```

**Example:**
```env
VITE_ELEVENLABS_API_KEY=sk_abc123def456ghi789
VITE_ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

> `.env` is gitignored — your keys will never be committed to GitHub.

---

## Step 7 — Test It

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. Click any **Play** button on a sloka
3. You should hear the cloned voice reading the sloka

If it falls back to Sarvam AI or browser voice, check:
- `.env` has no extra spaces around the `=`
- Restart the dev server after editing `.env` (`Ctrl+C` then `npm run dev`)
- Open browser DevTools → Console for any ElevenLabs error messages

---

## How the Integration Works (Code Reference)

The integration is already complete in the project. Here's how it flows:

### `src/services/elevenLabsApi.js`
```javascript
// Sends text to ElevenLabs and returns an Audio object
POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}
Headers: { 'xi-api-key': VITE_ELEVENLABS_API_KEY }
Body: {
  text: slokaText,
  model_id: 'eleven_multilingual_v2',   // best multilingual model
  voice_settings: {
    stability: 0.5,          // 0 = more expressive, 1 = more consistent
    similarity_boost: 0.75   // how closely to match the cloned voice
  }
}
```

### `src/services/ttsService.js`
```javascript
// Priority chain — ElevenLabs runs first if API key is set
if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
  // uses elevenLabsApi.js → your cloned voice
}
```

### `.env.example` reference
```env
VITE_ELEVENLABS_API_KEY=      # ElevenLabs API key
VITE_ELEVENLABS_VOICE_ID=     # Cloned voice ID from ElevenLabs dashboard
```

---

## Tuning Voice Quality

If the cloned voice sounds off, adjust these settings in `src/services/elevenLabsApi.js`:

| Setting | Range | Effect |
|---|---|---|
| `stability` | 0.0 – 1.0 | Lower = more expressive and dynamic; Higher = more consistent/robotic |
| `similarity_boost` | 0.0 – 1.0 | Higher = stays closer to the original recording |

**Recommended for sloka recitation:**
```javascript
voice_settings: { stability: 0.65, similarity_boost: 0.80 }
```
This gives a calm, consistent recitation style that suits slokas.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Still hearing Sarvam AI voice | Check `.env` has `VITE_ELEVENLABS_API_KEY` set and restart dev server |
| `ElevenLabs 401` in console | API key is wrong or expired — regenerate on ElevenLabs dashboard |
| `ElevenLabs 422` in console | Voice ID is invalid — copy it again from ElevenLabs Voices page |
| Voice sounds like a different person | Upload more audio samples (3–5 minutes total works best) |
| Characters running out fast | Free tier has 10k chars/month — upgrade to Starter for 30k |
| Telugu sounds mispronounced | ElevenLabs `eleven_multilingual_v2` handles Telugu reasonably; cloning a native Telugu speaker improves this significantly |

---

## Free vs Paid Tiers

| Feature | Free | Starter ($5/mo) | Creator ($22/mo) |
|---|---|---|---|
| Characters/month | 10,000 | 30,000 | 100,000 |
| Instant Voice Cloning | ❌ | ✅ | ✅ |
| Professional Voice Clone | ❌ | ❌ | ✅ |
| Commercial use | ❌ | ✅ | ✅ |

For this project, **Starter ($5/mo)** is sufficient.

---

## Alternative: Use a Pre-built Telugu Voice

If you don't want to clone a voice, ElevenLabs has built-in voices that support Telugu. You can browse them at **https://elevenlabs.io/voice-library** and filter by language.

To use a pre-built voice, just set the `VITE_ELEVENLABS_VOICE_ID` to any voice ID from the library — no cloning needed, just the API key.

---

*The `VITE_ELEVENLABS_VOICE_ID` in `elevenLabsApi.js` defaults to `EXAVITQu4vr4xnSDxMaL` (Sarah — English) if not set. Always set your own voice ID for Telugu content.*
