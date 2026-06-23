export type LangCode = "fr" | "pt";

export interface TranslationResult {
  french: string;
  portuguese: string;
}

export interface LangConfig {
  code: LangCode;
  label: string;
  flag: string;
  bcp47: string;
  resultKey: keyof TranslationResult;
}

export const LANGUAGES: LangConfig[] = [
  { code: "fr", label: "French",     flag: "🇫🇷", bcp47: "fr-FR", resultKey: "french"     },
  { code: "pt", label: "Portuguese", flag: "🇵🇹", bcp47: "pt-PT", resultKey: "portuguese" },
];

export const EXAMPLES = [
  "Hello, how are you today?",
  "The weather is beautiful this morning.",
  "I would like to order a coffee, please.",
  "Thank you very much for your help.",
  "Where is the nearest train station?",
];
