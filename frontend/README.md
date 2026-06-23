# Translator — EN → FR & PT

AI-powered English to French and Portuguese translator with audio playback.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and the **Anthropic SDK**.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
├── app/
│   ├── api/translate/route.ts   # Server-side API route (proxies Anthropic)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Translator.tsx           # Main UI + state
│   └── ResultCard.tsx           # Per-language result card with audio
└── types/
    └── translator.ts            # Shared TypeScript types + constants
```

## Features

- Translate English → French + Portuguese simultaneously
- Audio playback via Web Speech API (no extra cost)
- Copy to clipboard per language
- Keyboard shortcut: Ctrl/Cmd + Enter
- API key stays server-side — no CORS issues
