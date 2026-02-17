"use client";

import { useEffect, useState } from "react";
import { isPremium } from "@/lib/premium";

const PREMIUM_EVENT = "mg-premium-change";

export default function RealAds() {
  const [ready, setReady] = useState(false);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPremium(isPremium());
      setReady(true);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(PREMIUM_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PREMIUM_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    if (!ready || premium) return;

    try {
      const w = window as Window & {
        adsbygoogle?: Array<Record<string, never>>;
      };

      if (!w.adsbygoogle) {
        w.adsbygoogle = [];
      }

      w.adsbygoogle.push({});
    } catch {}
  }, [ready, premium]);

  if (!ready || premium) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXXXX"
      data-ad-slot="XXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
