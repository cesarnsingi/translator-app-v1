import json
import os

import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Translator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

# ── Schemas ───────────────────────────────────────────────────────────────────
class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)


class TranslationResult(BaseModel):
    french: str
    portuguese: str


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/translate", response_model=TranslationResult)
def translate(body: TranslateRequest) -> TranslationResult:
    prompt = (
        "You are a professional translator. Translate the English text below into French and Portuguese. "
        'Respond ONLY with valid JSON, no markdown, no backticks. '
        'Format: {"french":"...","portuguese":"..."}. '
        "Produce natural, idiomatic translations.\n\n"
        f"Translate:\n\n{body.text}"
    )

    response = model.generate_content(prompt)
    raw = response.text.strip().replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(raw)
        return TranslationResult(**data)
    except (json.JSONDecodeError, KeyError) as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse model response: {exc}") from exc