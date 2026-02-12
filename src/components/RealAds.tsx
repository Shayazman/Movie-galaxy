"use client";

import { useEffect } from "react";
import { isPremium } from "@/lib/premium";

export default function RealAds() {
  if (isPremium()) return null;
  useEffect(() => {
    try {
      const w = window as any;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {}
  }, []);

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
