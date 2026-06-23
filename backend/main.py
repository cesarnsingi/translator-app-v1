import json
import os

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Translator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

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
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system=(
            "You are a professional translator. Translate English text into French and Portuguese. "
            'Respond ONLY with valid JSON, no markdown, no backticks. '
            'Format: {"french":"...","portuguese":"..."}. '
            "Produce natural, idiomatic translations."
        ),
        messages=[{"role": "user", "content": f"Translate:\n\n{body.text}"}],
    )

    raw = "".join(block.text for block in message.content if block.type == "text")

    try:
        data = json.loads(raw.strip())
        return TranslationResult(**data)
    except (json.JSONDecodeError, KeyError) as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse model response: {exc}") from exc
