"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import useClickSound from "@/components/useClickSound";
import GlowIcon from "@/components/GlowIcon";
import LanguageSwitch from "@/components/LanguageSwitch";
import ToastHost from "@/components/Toast";
import ParticlesBackground from "@/components/ParticlesBackground";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import { getCinemaMode, setCinemaMode } from "@/lib/galaxy";
import { defaultProfiles, getActiveProfile, setActiveProfile } from "@/lib/profiles";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [cinema, setCinema] = useState(false);
  const pathname = usePathname();
  const click = useClickSound();

  useEffect(() => {
    const on = getCinemaMode();
    setCinema(on);
    if (on) document.body.classList.add("cinema-mode");
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Dev mode + cache-first SW is a common source of stale bundles and hydration mismatch.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys
            .filter((k) => k.startsWith("movie-galaxy-"))
            .forEach((k) => {
              caches.delete(k);
            });
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("visits") || 0);
      localStorage.setItem("visits", String(v + 1));
    } catch {}
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
      </head>
      <body suppressHydrationWarning>
        <ScrollProgress />
        <ParticlesBackground />
        <CursorGlow />
        <div
          style={{
            minHeight: "100vh",
            background: "rgba(5,5,10,.92)",
            color: "white",
            margin: 0,
            animation: "pageFade .6s ease",
            position: "relative",
            zIndex: 2,
          }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            style={{ position: "absolute", width: 0, height: 0 }}
          >
            <defs>
              <linearGradient id="galaxy-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6ad5" />
                <stop offset="45%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <radialGradient id="galaxy-fill" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,.95)" />
                <stop offset="40%" stopColor="rgba(255,106,213,.7)" />
                <stop offset="100%" stopColor="rgba(124,58,237,.25)" />
              </radialGradient>
              <filter id="galaxy-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          {/* ===== HEADER ===== */}
          <header
            className="app-header"
            style={{
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: 8,
              padding: "0 18px",
              background: "rgba(5,5,10,.92)",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              position: "sticky",
              top: 0,
              zIndex: 50,
              backdropFilter: "blur(10px)",
              animation: "headerGlow 4s ease-in-out infinite",
            }}
          >
            <div
              className="brand-wrap"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 0,
              }}
            >
              <div
                className="brand-orb"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(167,139,250,.45)",
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,.22), rgba(124,58,237,.42))",
                  boxShadow: "0 0 24px rgba(124,58,237,.35)",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/icon.svg"
                  alt="Movie Galaxy"
                  style={{
                    width: 30,
                    height: 30,
                    filter: "drop-shadow(0 0 12px rgba(124,58,237,.75))",
                  }}
                />
              </div>
              <span
                className="brand-title"
                style={{
                  fontSize: "clamp(24px, 3.1vw, 34px)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: ".02em",
                  textShadow: "0 0 18px rgba(124,58,237,.75)",
                  animation: "logoPulse 4s infinite",
                  whiteSpace: "nowrap",
                  background:
                    "linear-gradient(120deg, #ffffff 0%, #e9d5ff 52%, #c4b5fd 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Movie Galaxy
              </span>
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="menu-badge"
                onClick={() => {
                  click();
                  setOpen(true);
                }}
                aria-label="Open menu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(167,139,250,.55)",
                  background:
                    "linear-gradient(135deg, rgba(255,43,214,.28), rgba(124,58,237,.55), rgba(6,182,212,.28))",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 900,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  boxShadow: "0 0 22px rgba(124,58,237,.45)",
                  flexShrink: 0,
                }}
              >
                <GlowIcon name="star" size={14} strokeWidth={2.6} className="glow-icon" />
                <GlowIcon name="menu" size={16} strokeWidth={2.8} className="glow-icon menu-icon" />
                Menu
              </button>
              <button
                onClick={() => {
                  const next = !cinema;
                  setCinema(next);
                  setCinemaMode(next);
                  document.body.classList.toggle("cinema-mode", next);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: cinema ? "rgba(124,58,237,.22)" : "rgba(255,255,255,.06)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                <span className="icon-inline">
                  <GlowIcon name="film" size={14} className="glow-icon" />
                  Cinema {cinema ? "ON" : "OFF"}
                </span>
              </button>

              <div style={{ marginLeft: 12 }}>
                <LanguageSwitch />
              </div>

              <ProfileSwitcher />
            </div>
          </header>

          <div style={{ display: "flex" }}>
            {/* ===== SIDEBAR ===== */}
            <aside
              className="sidebar-scroll"
              style={{
                width: 230,
                background: "linear-gradient(180deg,#0b0b18,#05050a)",
                padding: "32px 20px",
                borderRight: "1px solid rgba(255,255,255,.06)",
                position: "fixed",
                top: 0,
                left: open ? 0 : -240,
                height: "100vh",
                transition: "left .35s ease",
                zIndex: 100,
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: 22,
                  marginBottom: 20,
                }}
              >
                <GlowIcon name="bolt" size={20} className="glow-icon" />
              </button>

              <Nav href="/" label="Welcome" iconName="spark" close={() => setOpen(false)} />
              <Nav href="/home" label="Home" iconName="star" close={() => setOpen(false)} />
              <Nav href="/surprise" label="Galaxy Oracle" iconName="shuffle" close={() => setOpen(false)} />
              <Nav href="/binge-tonight" label="Binge Tonight" iconName="shuffle" close={() => setOpen(false)} />
              <Nav href="/playlists" label="Playlists" iconName="play" close={() => setOpen(false)} />
              <Nav href="/galaxy-picks" label="Galaxy Picks" iconName="spark" close={() => setOpen(false)} />
              <Nav href="/my-list" label="My List" iconName="heart" close={() => setOpen(false)} />
              <Nav href="/tonight" label="Tonight" iconName="moon" close={() => setOpen(false)} />
              <Nav href="/continue" label="Continue" iconName="play" close={() => setOpen(false)} />
              <Nav href="/categories" label="Categories" iconName="film" close={() => setOpen(false)} />
              <Nav href="/premium" label="Premium" iconName="star" close={() => setOpen(false)} />
              <Nav href="/youtube" label="YouTube Tools" iconName="play" close={() => setOpen(false)} />
              <Nav href="/watch/demo" label="Demo Player" iconName="play" close={() => setOpen(false)} />
              <Nav href="/blog" label="Blog" iconName="spark" close={() => setOpen(false)} />
              <Nav href="/search" label="Search" iconName="search" close={() => setOpen(false)} />
              <Nav href="/owner/newsletter" label="Owner Newsletter" iconName="bolt" close={() => setOpen(false)} />
              <Nav href="/owner/tiktok" label="Owner TikTok" iconName="play" close={() => setOpen(false)} />
              <Nav href="/owner/youtube" label="Owner YouTube" iconName="play" close={() => setOpen(false)} />
            </aside>

            {/* overlay */}
            {open && (
              <div
                onClick={() => setOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,.6)",
                  zIndex: 90,
                }}
              />
            )}

            {/* ===== CONTENT ===== */}
            <main
              className="content"
              style={{
                flex: 1,
                marginLeft: 0,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div className="page-crest" aria-hidden="true">
                <img
                  src="/icon.svg"
                  alt=""
                  style={{
                    width: 34,
                    height: 34,
                    filter: "drop-shadow(0 0 14px rgba(124,58,237,1))",
                  }}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>

              <Footer />
            </main>
          </div>
          <ToastHost />

          {/* ===== GLOBAL STYLES ===== */}
          <style jsx global>{`
            *,
            *::before,
            *::after {
              box-sizing: border-box;
            }

            html,
            body {
              max-width: 100%;
              overflow-x: hidden;
              scrollbar-width: none;
            }

            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              width: 0;
              height: 0;
            }

            img,
            video,
            iframe,
            canvas,
            svg {
              max-width: 100%;
            }

            .content {
              overflow-x: clip;
            }

            .galaxy-nav {
              transition: transform .18s ease,
                          box-shadow .2s ease,
                          background .2s ease;
            }

            .app-header {
              box-shadow: 0 0 45px rgba(124,58,237,.15);
            }

            .app-header::after {
              content: "";
              position: absolute;
              inset: 0;
              pointer-events: none;
              background:
                radial-gradient(circle at 20% 50%, rgba(124,58,237,.18), transparent 60%),
                radial-gradient(circle at 80% 40%, rgba(255,255,255,.06), transparent 55%);
              opacity: 0.9;
            }

            @keyframes headerGlow {
              0% { filter: drop-shadow(0 0 0 rgba(124,58,237,0)); }
              50% { filter: drop-shadow(0 0 18px rgba(124,58,237,.35)); }
              100% { filter: drop-shadow(0 0 0 rgba(124,58,237,0)); }
            }

            .brand-orb {
              animation: brandPulse 3.6s ease-in-out infinite;
            }

            @keyframes brandPulse {
              0% {
                box-shadow: 0 0 14px rgba(124,58,237,.28);
              }
              50% {
                box-shadow: 0 0 30px rgba(124,58,237,.52), 0 0 16px rgba(6,182,212,.28);
              }
              100% {
                box-shadow: 0 0 14px rgba(124,58,237,.28);
              }
            }

            .galaxy-nav:hover {
              box-shadow: 0 0 22px rgba(124,58,237,.6);
            }

            img:hover {
              transform: scale(1.09);
              box-shadow: 0 0 50px rgba(124,58,237,.9);
            }

            @keyframes pageFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes logoPulse {
              0% { text-shadow: 0 0 14px rgba(124,58,237,.7); }
              50% { text-shadow: 0 0 30px rgba(124,58,237,1); }
              100% { text-shadow: 0 0 14px rgba(124,58,237,.7); }
            }

            @keyframes logoOrbit {
              0% { transform: translateZ(0) scale(1); }
              50% { transform: translateZ(0) scale(1.08); }
              100% { transform: translateZ(0) scale(1); }
            }

            @keyframes pulse {
              0% { box-shadow: 0 0 20px rgba(124,58,237,.5); }
              50% { box-shadow: 0 0 50px rgba(124,58,237,1); }
              100% { box-shadow: 0 0 20px rgba(124,58,237,.5); }
            }

            :root{
              --glow: rgba(124,58,237,.55);
              --glow2: rgba(255, 200, 0, .35);
            }

            .card-glow{
              box-shadow: 0 0 25px rgba(124,58,237,.22);
              border: 1px solid rgba(255,255,255,.08);
            }

            .floaty{
              animation: floaty 4.5s ease-in-out infinite;
            }
            @keyframes floaty{
              0%{ transform: translateY(0px); }
              50%{ transform: translateY(-8px); }
              100%{ transform: translateY(0px); }
            }

            .shine{
              position: relative;
              overflow: hidden;
            }
            .shine::after{
              content:"";
              position:absolute;
              top:-40%;
              left:-60%;
              width:60%;
              height:180%;
              transform: rotate(20deg);
              background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
              animation: shine 5.5s ease-in-out infinite;
            }
            @keyframes shine{
              0%{ left:-60%; opacity:.2; }
              45%{ opacity:.3; }
              100%{ left:140%; opacity:.15; }
            }

            .galaxy-logo {
              animation: logoOrbit 4.5s ease-in-out infinite;
            }

            .page-crest {
              position: absolute;
              top: 14px;
              right: 22px;
              z-index: 5;
              opacity: .9;
              pointer-events: none;
              animation: logoOrbit 5.5s ease-in-out infinite;
            }

            h1 {
              position: relative;
              z-index: 0;
            }

            h1::before {
              content: "";
              position: absolute;
              left: -14px;
              top: 50%;
              width: 72px;
              height: 72px;
              transform: translateY(-50%);
              background: url("/icon.svg") no-repeat center/contain;
              opacity: 0.22;
              filter: drop-shadow(0 0 18px rgba(124,58,237,.9));
              z-index: -1;
              pointer-events: none;
            }

            .icon-inline {
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }

            .glow-icon {
              color: #a78bfa;
              filter:
                drop-shadow(0 0 6px rgba(255,106,213,.7))
                drop-shadow(0 0 12px rgba(124,58,237,.8))
                drop-shadow(0 0 16px rgba(34,211,238,.5));
              transform: translateZ(0) scale(1.4);
              transform-origin: center;
            }

            .menu-icon {
              filter:
                drop-shadow(0 0 6px rgba(255,106,213,.6))
                drop-shadow(0 0 12px rgba(124,58,237,.7))
                drop-shadow(0 0 16px rgba(34,211,238,.45));
            }

            .menu-badge {
              animation: menuGlow 2.6s ease-in-out infinite;
            }

            @keyframes menuGlow {
              0% {
                box-shadow: 0 0 16px rgba(124,58,237,.35);
              }
              50% {
                box-shadow: 0 0 30px rgba(255,43,214,.38), 0 0 42px rgba(124,58,237,.5);
              }
              100% {
                box-shadow: 0 0 16px rgba(6,182,212,.35);
              }
            }

            .sidebar-scroll {
              scrollbar-width: none;
            }

            .sidebar-scroll::-webkit-scrollbar {
              width: 0;
              height: 0;
            }

            .nav-bg {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              opacity: .16;
              z-index: 0;
              pointer-events: none;
            }

            .nav-label {
              position: relative;
              z-index: 1;
            }

            body.cinema-mode {
              background: #030308 !important;
            }

            body.cinema-mode img {
              filter: saturate(1.08) contrast(1.06);
            }

            body.cinema-mode .content {
              background: radial-gradient(circle at top, rgba(124,58,237,.12), transparent 60%);
            }

            @media (max-width: 900px) {
              .page-crest {
                right: 16px;
                top: 10px;
                opacity: .75;
              }

              h1::before {
                width: 54px;
                height: 54px;
                left: -10px;
                opacity: 0.18;
              }
            }

            @media (max-width: 900px) {
              .content {
                width: 100% !important;
                max-width: 100% !important;
                margin-left: 0 !important;
              }

              .app-header {
                padding: 10px 12px !important;
              }

              main {
                padding-left: 16px !important;
                padding-right: 16px !important;
              }

              .menu-badge {
                padding: 8px 10px !important;
              }
            }

            @media (max-width: 1180px) {
              .profile-switcher {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </body>
    </html>
  );
}

function ProfileSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(defaultProfiles[0]);

  useEffect(() => {
    setMounted(true);
    setActive(getActiveProfile());
  }, []);

  if (!mounted) return null;

  return (
    <div className="profile-switcher" style={{ display: "flex", gap: 8, marginLeft: 12, flexWrap: "wrap" }}>
      {defaultProfiles.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            setActiveProfile(p);
            setActive(p);
            window.location.reload();
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 14,
            background: active.id === p.id ? p.color : "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.1)",
            color: "white",
            cursor: "pointer",
          }}
        >
          {p.avatar} {p.name}
        </button>
      ))}
    </div>
  );
}

/* ===== NAV ITEM ===== */
function Nav({
  href,
  iconName,
  label,
  close,
}: {
  href: string;
  iconName: "moon" | "star" | "flame" | "film" | "rocket" | "mask" | "skull" | "spark" | "heart" | "search" | "shuffle" | "play" | "bolt";
  label: string;
  close: () => void;
}) {
  const path = usePathname();
  const active = path === href;

  return (
    <Link
      href={href}
      onClick={close}
      className="galaxy-nav"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        color: active ? "#fff" : "#ddd",
        background: active ? "rgba(124,58,237,.22)" : "transparent",
        marginBottom: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span className="nav-label">{label}</span>
      <span className="nav-bg" aria-hidden="true">
        <GlowIcon name={iconName} size={34} className="glow-icon" />
      </span>
    </Link>
  );
}


