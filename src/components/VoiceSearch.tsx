"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function VoiceSearch({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  const supported = useMemo(() => {
    return typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!supported) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();

    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      onChange(transcript.trim());
    };

    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      if (onSubmit) onSubmit();
    };

    rec.onerror = () => {
      setListening(false);
      recRef.current = null;
    };

    recRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {}
      recRef.current = null;
    };
  }, [supported, onChange, onSubmit]);

  const toggle = () => {
    if (!supported) {
      alert("Voice search not supported in this browser.");
      return;
    }
    if (listening) {
      try {
        recRef.current?.stop();
      } catch {}
      setListening(false);
      return;
    }
    try {
      setListening(true);
      recRef.current?.start();
    } catch {
      setListening(false);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={supported ? (listening ? "Stop" : "Voice Search") : "Not supported"}
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,.16)",
        background: listening
          ? "linear-gradient(135deg, rgba(255,0,90,.35), rgba(124,58,237,.35))"
          : "rgba(255,255,255,.06)",
        color: "white",
        cursor: "pointer",
      }}
    >
      {listening ? "🎙️" : "🎤"}
    </button>
  );
}
