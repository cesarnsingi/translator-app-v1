"use client";
import { useState } from "react";
import { LangConfig, TranslationResult } from "@/types/translator";

interface Props {
  lang: LangConfig;
  result: TranslationResult | null;
  isLoading: boolean;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
}

export default function ResultCard({ lang, result, isLoading, isSpeaking, onSpeak, onStop }: Props) {
  const [copied, setCopied] = useState(false);
  const text = result?.[lang.resultKey] ?? "";

  async function handleCopy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 min-h-[160px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-neutral-400">
          <span className="text-lg">{lang.flag}</span>
          {lang.label}
        </span>
        <div className="flex items-center gap-1">
          {/* Speak / Stop */}
          <button
            onClick={isSpeaking ? onStop : onSpeak}
            disabled={!text || isLoading}
            title={isSpeaking ? "Stop" : `Listen in ${lang.label}`}
            className={`rounded-lg border px-2 py-1.5 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              isSpeaking
                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
            }`}
          >
            {isSpeaking ? "■" : "▶"}
          </button>
          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={!text || isLoading}
            title="Copy translation"
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-sm text-neutral-400 transition-all hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {copied ? "✓" : "⎘"}
          </button>
        </div>
      </div>

      {/* Result text */}
      <div className="flex-1">
        {isLoading ? (
          <p className="text-sm italic text-neutral-500 animate-pulse">Translating…</p>
        ) : text ? (
          <p className="text-base leading-relaxed text-white">{text}</p>
        ) : (
          <p className="text-sm italic text-neutral-600">Translation appears here…</p>
        )}
      </div>

      {/* Speaking waveform */}
      {isSpeaking && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
          <div className="pulse-bar flex items-center gap-[3px]">
            {[8, 14, 10, 16, 6].map((h, i) => (
              <span
                key={i}
                className="inline-block w-[3px] rounded-full bg-blue-400"
                style={{ height: h }}
              />
            ))}
          </div>
          <span className="flex-1 text-xs text-blue-400">Speaking {lang.label}…</span>
          <button onClick={onStop} className="text-xs text-blue-400 hover:text-white transition-colors">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
