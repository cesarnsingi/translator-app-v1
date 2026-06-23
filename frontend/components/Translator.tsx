"use client";
import { useState, useRef, useCallback } from "react";
import { LANGUAGES, EXAMPLES, TranslationResult, LangCode } from "@/types/translator";
import ResultCard from "./ResultCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Translator() {
  const [inputText, setInputText]       = useState("");
  const [result, setResult]             = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");
  const [speakingLang, setSpeakingLang] = useState<LangCode | null>(null);
  const utteranceRef                    = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingLang(null);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((lang: LangCode) => {
    if (!result) return;
    if (!("speechSynthesis" in window)) {
      setError("Audio not supported in this browser. Try Chrome or Safari.");
      return;
    }
    stopSpeak();

    const langConfig = LANGUAGES.find((l) => l.code === lang)!;
    const text = result[langConfig.resultKey];
    if (!text) return;

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = langConfig.bcp47;
    utt.rate  = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const match  = voices.find((v) => v.lang.startsWith(lang === "fr" ? "fr" : "pt"));
    if (match) utt.voice = match;

    utt.onend   = () => setSpeakingLang(null);
    utt.onerror = () => setSpeakingLang(null);

    utteranceRef.current = utt;
    setSpeakingLang(lang);
    window.speechSynthesis.speak(utt);
  }, [result, stopSpeak]);

  async function translate() {
    if (!inputText.trim()) { setError("Please enter some English text."); return; }
    stopSpeak();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Translation failed");
      setResult(data as TranslationResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold tracking-tight">Translator</h1>
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white tracking-wide">TS</span>
          <span className="rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-black tracking-wide">PY</span>
        </div>
        <p className="text-sm text-neutral-400">Translate English into French &amp; Portuguese — with audio playback.</p>
      </div>

      {/* Language badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <span className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-neutral-300">🇺🇸 English</span>
        <span className="text-neutral-600">→</span>
        <span className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-neutral-300">🇫🇷 French</span>
        <span className="text-neutral-600 text-xs">+</span>
        <span className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-neutral-300">🇵🇹 Portuguese</span>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 mb-3">
        <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
          English text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) translate(); }}
          placeholder="Type or paste English text here…"
          maxLength={1000}
          rows={4}
          className="w-full resize-none bg-transparent text-base leading-relaxed text-white placeholder-neutral-600 focus:outline-none"
        />
        <div className="mt-2 text-right text-xs text-neutral-600">{inputText.length} / 1000</div>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-neutral-600">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setInputText(ex)}
            className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
          >
            {ex.length > 28 ? ex.slice(0, 28) + "…" : ex}
          </button>
        ))}
      </div>

      {/* Translate button */}
      <button
        onClick={translate}
        disabled={isLoading}
        className="mb-6 w-full rounded-xl border border-neutral-700 bg-neutral-800 py-3 text-base font-medium text-white transition-all hover:bg-neutral-700 hover:border-neutral-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Translating…
          </>
        ) : "Translate"}
      </button>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LANGUAGES.map((lang) => (
          <ResultCard
            key={lang.code}
            lang={lang}
            result={result}
            isLoading={isLoading}
            isSpeaking={speakingLang === lang.code}
            onSpeak={() => speak(lang.code)}
            onStop={stopSpeak}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-neutral-700">
        Ctrl + Enter to translate · Next.js frontend · FastAPI backend · Claude AI
      </p>
    </div>
  );
}
