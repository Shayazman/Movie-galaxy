"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
    movieGalaxyGoogleTranslateInit?: () => void;
  }
}

type LanguageOption = {
  code: string;
  label: string;
};

const STORAGE_KEY = "movie-galaxy-lang";
const PREV_STORAGE_KEY = "movie-galaxy-lang-prev";
const ROOT_ID = "mg-google-translate-root";
const SCRIPT_ID = "mg-google-translate-script";
const STYLE_ID = "mg-google-translate-style";

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "az", label: "Azerbaijani" },
  { code: "eu", label: "Basque" },
  { code: "be", label: "Belarusian" },
  { code: "bn", label: "Bengali" },
  { code: "bs", label: "Bosnian" },
  { code: "bg", label: "Bulgarian" },
  { code: "ca", label: "Catalan" },
  { code: "ceb", label: "Cebuano" },
  { code: "ny", label: "Chichewa" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "co", label: "Corsican" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "et", label: "Estonian" },
  { code: "tl", label: "Filipino" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "fy", label: "Frisian" },
  { code: "gl", label: "Galician" },
  { code: "ka", label: "Georgian" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gu", label: "Gujarati" },
  { code: "ht", label: "Haitian Creole" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "Hawaiian" },
  { code: "he", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hmn", label: "Hmong" },
  { code: "hu", label: "Hungarian" },
  { code: "is", label: "Icelandic" },
  { code: "ig", label: "Igbo" },
  { code: "id", label: "Indonesian" },
  { code: "ga", label: "Irish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "jw", label: "Javanese" },
  { code: "kn", label: "Kannada" },
  { code: "kk", label: "Kazakh" },
  { code: "km", label: "Khmer" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "ko", label: "Korean" },
  { code: "ku", label: "Kurdish" },
  { code: "ky", label: "Kyrgyz" },
  { code: "lo", label: "Lao" },
  { code: "la", label: "Latin" },
  { code: "lv", label: "Latvian" },
  { code: "lt", label: "Lithuanian" },
  { code: "lb", label: "Luxembourgish" },
  { code: "mk", label: "Macedonian" },
  { code: "mg", label: "Malagasy" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mt", label: "Maltese" },
  { code: "mi", label: "Maori" },
  { code: "mr", label: "Marathi" },
  { code: "mn", label: "Mongolian" },
  { code: "my", label: "Myanmar (Burmese)" },
  { code: "ne", label: "Nepali" },
  { code: "no", label: "Norwegian" },
  { code: "or", label: "Odia (Oriya)" },
  { code: "ps", label: "Pashto" },
  { code: "fa", label: "Persian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "sm", label: "Samoan" },
  { code: "gd", label: "Scots Gaelic" },
  { code: "sr", label: "Serbian" },
  { code: "st", label: "Sesotho" },
  { code: "sn", label: "Shona" },
  { code: "sd", label: "Sindhi" },
  { code: "si", label: "Sinhala" },
  { code: "sk", label: "Slovak" },
  { code: "sl", label: "Slovenian" },
  { code: "so", label: "Somali" },
  { code: "es", label: "Spanish" },
  { code: "su", label: "Sundanese" },
  { code: "sv", label: "Swedish" },
  { code: "tg", label: "Tajik" },
  { code: "ta", label: "Tamil" },
  { code: "tt", label: "Tatar" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "tr", label: "Turkish" },
  { code: "tk", label: "Turkmen" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "ug", label: "Uyghur" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" },
  { code: "cy", label: "Welsh" },
  { code: "xh", label: "Xhosa" },
  { code: "yi", label: "Yiddish" },
  { code: "yo", label: "Yoruba" },
  { code: "zu", label: "Zulu" },
];

const KNOWN_CODES = new Set(LANGUAGE_OPTIONS.map((x) => x.code));

function readSavedLanguage(): string {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw && KNOWN_CODES.has(raw)) return raw;

  const browser = (window.navigator.language || "en").trim();
  const normalized =
    browser.toLowerCase().startsWith("zh-")
      ? browser
      : browser.split("-")[0];

  if (KNOWN_CODES.has(normalized)) return normalized;
  return "en";
}

function readPreviousLanguage(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PREV_STORAGE_KEY);
  if (raw && KNOWN_CODES.has(raw)) return raw;
  return null;
}

function injectTranslateStyles() {
  if (typeof window === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .goog-te-banner-frame.skiptranslate { display: none !important; }
    body { top: 0 !important; }
    #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
    .goog-text-highlight { background: transparent !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
}

function clearGoogleTranslateCookies() {
  if (typeof window === "undefined") return;

  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const parts = host.split(".");

  const domains = new Set<string>([host]);
  if (parts.length >= 2) domains.add(`.${parts.slice(-2).join(".")}`);
  if (parts.length >= 3) domains.add(`.${parts.slice(-3).join(".")}`);

  const cookieNames = ["googtrans", "googtransopt"];

  for (const name of cookieNames) {
    document.cookie = `${name}=; expires=${expires}; path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=${expires}; path=/; domain=${domain}`;
    }
  }
}

function applyGoogleLanguage(code: string): boolean {
  if (typeof window === "undefined") return false;
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;

  if (code === "en") {
    // Different widget builds represent original language as "en" or empty.
    combo.value = "en";
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    combo.value = "";
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  combo.value = code;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function queueApplyGoogleLanguage(code: string) {
  if (applyGoogleLanguage(code)) return;

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (applyGoogleLanguage(code) || attempts > 40) {
      window.clearInterval(timer);
    }
  }, 150);
}

export default function LanguageSwitch() {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const applyLanguage = (next: string, trackPrevious: boolean) => {
    const current = readSavedLanguage();

    if (trackPrevious && current !== next) {
      window.localStorage.setItem(PREV_STORAGE_KEY, current);
    }

    window.localStorage.setItem(STORAGE_KEY, next);

    if (next === "en") {
      clearGoogleTranslateCookies();
      queueApplyGoogleLanguage("en");
      // Reset translated DOM back to original source text.
      window.setTimeout(() => {
        window.location.replace(
          `${window.location.pathname}${window.location.search}`
        );
      }, 120);
      return;
    }

    queueApplyGoogleLanguage(next);
  };

  useEffect(() => {
    const saved = readSavedLanguage();

    if (selectRef.current) {
      selectRef.current.value = saved;
    }

    if (saved === "en") {
      clearGoogleTranslateCookies();
    }

    injectTranslateStyles();

    const init = () => {
      if (!window.google?.translate?.TranslateElement) return;
      const host = document.getElementById(ROOT_ID);
      if (!host) return;

      if (!host.hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            multilanguagePage: true,
          },
          ROOT_ID
        );
      }

      if (saved !== "en") {
        queueApplyGoogleLanguage(saved);
      }
    };

    window.movieGalaxyGoogleTranslateInit = init;

    if (window.google?.translate?.TranslateElement) {
      init();
      return;
    }

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=movieGalaxyGoogleTranslateInit";
    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px 4px 10px",
        borderRadius: 14,
        border: "1px solid rgba(167,139,250,.45)",
        background:
          "linear-gradient(135deg, rgba(124,58,237,.35), rgba(6,182,212,.16), rgba(4,4,12,.86))",
        boxShadow: "0 0 24px rgba(124,58,237,.3)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".03em",
          color: "#ddd6fe",
          userSelect: "none",
        }}
      >
        Language
      </span>

      <select
        ref={selectRef}
        aria-label="Language"
        defaultValue="en"
        onChange={(e) => {
          const next = e.target.value;
          applyLanguage(next, true);
        }}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          height: 38,
          minWidth: 160,
          padding: "0 36px 0 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(5,8,18,.92)",
          color: "#f9fafb",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          outline: "none",
          boxShadow: "inset 0 0 0 1px rgba(124,58,237,.18)",
        }}
      >
        {LANGUAGE_OPTIONS.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            style={{
              backgroundColor: "#070b16",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            {lang.label}
          </option>
        ))}
      </select>

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 18,
          fontSize: 12,
          color: "#e9d5ff",
          pointerEvents: "none",
          fontWeight: 700,
        }}
      >
        v
      </span>

      <button
        type="button"
        onClick={() => {
          const previous = readPreviousLanguage();
          if (!previous || !KNOWN_CODES.has(previous)) return;
          if (selectRef.current) selectRef.current.value = previous;
          applyLanguage(previous, true);
        }}
        style={{
          height: 38,
          padding: "0 10px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(255,255,255,.1)",
          color: "white",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
        }}
        title="Back to previous language"
      >
        Back
      </button>

      <div
        id={ROOT_ID}
        style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
