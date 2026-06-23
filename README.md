# Translator — EN → FR & PT

AI-powered English to French and Portuguese translator with audio playback.

**Stack:** FastAPI (Python) · Next.js 15 (TypeScript) · Anthropic Claude · Docker

---

## Quick start (without Docker)

### 1. Backend — FastAPI

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your API key
cp .env.example .env
# Open .env and set: ANTHROPIC_API_KEY=sk-ant-...

# Run
uvicorn main:app --reload --port 8000
```

API runs at http://localhost:8000  
Docs at http://localhost:8000/docs

---

### 2. Frontend — Next.js

```bash
cd frontend
npm install
# .env.local already points to http://localhost:8000
npm run dev
```

App runs at http://localhost:3000

---

## Quick start (with Docker)

```bash
# Set your API key in backend/.env first
cp backend/.env.example backend/.env
# Edit backend/.env → ANTHROPIC_API_KEY=sk-ant-...

docker compose up --build
```

- Frontend → http://localhost:3000  
- Backend  → http://localhost:8000  
- API docs → http://localhost:8000/docs

---

## Project structure

```
translator/
├── backend/
│   ├── main.py              # FastAPI app — /translate endpoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                 # ANTHROPIC_API_KEY (git-ignored)
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   │   ├── Translator.tsx   # Main UI + state
│   │   └── ResultCard.tsx   # Per-language card with audio
│   ├── types/
│   │   └── translator.ts    # Shared TypeScript types
│   ├── Dockerfile
│   └── .env.local           # NEXT_PUBLIC_API_URL
└── docker-compose.yml
```

## API

`POST /translate`

```json
// Request
{ "text": "Hello, how are you?" }

// Response
{ "french": "Bonjour, comment allez-vous ?", "portuguese": "Olá, como você está?" }
```
