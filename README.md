# IMTAI — Your Smart Multilingual AI Advisor

A self-hosted, Lovable-independent version of the IMTAI app.  
AI is powered entirely by **OpenRouter** — no Lovable dependency needed.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Run dev server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

The app is built on TanStack Start + Cloudflare Workers.  
Deploy with:
```bash
npx wrangler deploy
```
Make sure to set `OPENROUTER_API_KEY` in your Cloudflare Workers secrets:
```bash
npx wrangler secret put OPENROUTER_API_KEY
```

## AI Model

By default uses `openrouter/free` via OpenRouter.  
Change it by setting `OPENROUTER_MODEL` in your environment to any model available on OpenRouter (for example `openrouter/free`, `openai/gpt-oss-20b:free`, or another model slug from OpenRouter).
"# imtai-adviso" 
