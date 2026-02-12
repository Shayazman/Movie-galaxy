"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isOwner } from "@/lib/owner";
import Monetization from "@/components/Monetization";
import AdSlots from "@/components/AdSlots";
import Languages from "@/components/Languages";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isOwner()) {
    return <div style={{ padding: 40 }}>Not allowed</div>;
  }

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Owner Control Center</h1>

      <nav style={{ marginBottom: 20 }}>
        <Link href="/owner/analytics">Analytics</Link> |{" "}
        <Link href="/owner/editor">Editor</Link> |{" "}
        <Link href="/owner/youtube">YouTube</Link>
      </nav>

      <Monetization />
      <AdSlots />
      <Languages />
    </main>
  );
}
