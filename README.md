# ✨ Anime Transformer

Transform any photo into anime-style artwork using Claude AI (vision) + Pollinations image generation.

## How it works

1. Upload a photo → Claude analyzes facial features via Vision API
2. Select an anime style (Ghibli, Shōnen, Chibi, Cyberpunk, Rétro 90s, Pixar, Dark Fantasy, Cartoon Flat)
3. Claude + Pollinations generate a stylized anime portrait
4. Compare side-by-side and download

## Styles available

| Style | Description |
|-------|-------------|
| 🌿 Ghibli | Miyazaki watercolor warmth |
| ⚡ Shōnen | Bold dynamic energy |
| 🎀 Chibi | Kawaii super-deformed |
| 🔮 Cyberpunk | Neon futuristic noir |
| 📼 Rétro 90s | Classic cel-shaded nostalgia |
| 🎬 Pixar | 3D charming render |
| 🌑 Dark Fantasy | Gothic epic atmosphere |
| 🎨 Cartoon Flat | Clean modern illustration |

## Local development

### Prerequisites
- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Anthropic API key → https://console.anthropic.com

### Setup

```bash
git clone <your-repo-url>
cd anime-transformer
npm install

# Copy and fill environment variables
cp .env.example .env
# Edit .env: add your ANTHROPIC_API_KEY

# Start local dev server
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm install
vercel login
vercel deploy

# Set environment variables
vercel env add ANTHROPIC_API_KEY
# (POLLINATIONS_KEY is optional — Pollinations has a free public API)

# Deploy to production
vercel deploy --prod
```

### Option 2 — Vercel Dashboard

1. Push to GitHub
2. Import project at vercel.com/new
3. Add `ANTHROPIC_API_KEY` in Settings → Environment Variables
4. Deploy

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | From console.anthropic.com |
| `POLLINATIONS_KEY` | ❌ | Optional — Pollinations is free by default |

## Tech stack

- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Vision**: Claude claude-opus-4-7 (Anthropic)
- **Image Generation**: Pollinations AI (Flux model, free tier)
- **Hosting**: Vercel
