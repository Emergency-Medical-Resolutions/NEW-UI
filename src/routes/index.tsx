import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

// ── Colors ────────────────────────────────────────────────────
const C = {
  navy:          "#0B1E3A",
  white:         "#FFFFFF",
  cream:         "#EDE8D0",
  dimText:       "rgba(237,232,208,0.45)",
  border:        "rgba(237,232,208,0.22)",
  dashed:        "rgba(237,232,208,0.38)",
  terracotta:    "#C0522A",
  fabRed:        "#B03520",
  accentCall:    "#5C6470",
  accentCal:     "#0D7490",
  accentSteps:   "#D97706",
  accentHeart:   "#D97A7A",
  accentCalorie: "#CA8A04",
  paper:         "#E8DCC0",
  paperDark:     "#C9B896",
};

const SIDEBAR_W = 52;
const HEADER_H  = 52;
const BOTTOM_H  = 66;
const FAB_SIZE  = 60;
const FAB_R     = 30;

// ── Tab definitions ───────────────────────────────────────────
const UPPER_TABS: { label: string; accent: string | null }[] = [
  { label: "FES",   accent: null },
  { label: "WII",   accent: null },
  { label: "Sleep", accent: null },
  { label: "Call",  accent: C.accentCall },
];
const LOWER_TABS: { label: string; accent: string | null }[] = [
  { label: "Cal",     accent: C.accentCal },
  { label: "Steps",   accent: C.accentSteps },
  { label: "Heart",   accent: C.accentHeart },
  { label: "Calorie", accent: C.accentCalorie },
];

// ── Metric values ─────────────────────────────────────────────
const OHPAH_VALUES: Record<string, string> = {
  FES: "4", WII: "8", Sleep: "6.5", Call: "4",
};
const HK_VALUES: Record<string, string> = {
  Cal: "2341", Steps: "5437", Heart: "72", Calorie: "2341",
};

// ── Arc call-log segments ─────────────────────────────────────
const CALL_SEGMENTS = [
  { h1: 0,    h2: 0.8,  color: "#9B2915" },
  { h1: 0.8,  h2: 1.8,  color: "#2E6B2E" },
  { h1: 1.8,  h2: 5.5,  color: "#2E6B2E" },
  { h1: 5.5,  h2: 6.0,  color: "#9B2915" },
  { h1: 6.0,  h2: 9.5,  color: "#2E6B2E" },
  { h1: 9.5,  h2: 11.0, color: "#2E6B2E" },
  { h1: 11.0, h2: 12.0, color: "#C9A227" },
  { h1: 12.0, h2: 16.0, color: "#D8D8D8" },
  { h1: 16.0, h2: 19.0, color: "#2E6B2E" },
  { h1: 19.0, h2: 20.5, color: "#C9A227" },
  { h1: 20.5, h2: 22.0, color: "#2E6B2E" },
  { h1: 22.0, h2: 24.0, color: "#9B2915" },
];

// ── Arc hour labels (matches reference image) ─────────────────
const HOUR_LABELS = [
  "8","9","10","11","12",
  "1300","1400","1500","1600","1700","1800",
  "1900","2000","2100","2200","2300",
  "0000","0100","0200","0300","0400",
  "0500","0600","0700","8",
];

// ── Arc Timeline ──────────────────────────────────────────────
function ArcTimeline({
  width,
  height,
  segments = [],
}: {
  width: number;
  height: number;
  segments?: typeof CALL_SEGMENTS;
}) {
  const CX = -15;
  const CY = height / 2;
  const R  = Math.round(width * 1.0);

  const halfH     = height * 0.43;
  const halfAngle = Math.asin(Math.min(halfH / R, 0.9999)) * (180 / Math.PI);
  const A_START   = -halfAngle;
  const A_END     =  halfAngle;
  const SPAN      = A_END - A_START;
  const HOURS     = 24;

  const toRad       = (d: number) => (d * Math.PI) / 180;
  const ptOn        = (angleDeg: number) => ({
    x: CX + R * Math.cos(toRad(angleDeg)),
    y: CY + R * Math.sin(toRad(angleDeg)),
  });
  const hourToAngle = (h: number) => A_START + (h / HOURS) * SPAN;

  const arcPath = (h1: number, h2: number): string => {
    const p1  = ptOn(hourToAngle(h1));
    const p2  = ptOn(hourToAngle(h2));
    const deg = ((h2 - h1) / HOURS) * SPAN;
    return (
      `M${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ` +
      `A${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ` +
      `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  };

  const INNER_EDGE = R - 1;
  const TICK_LEN   = 10;
  const LABEL_R    = INNER_EDGE - TICK_LEN - 6;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      {/* White arc rail */}
      <path
        d={arcPath(0, 24)}
        fill="none"
        stroke="rgba(237,232,208,0.90)"
        strokeWidth={2}
      />

      {/* Colored call-log segments */}
      {segments.map((seg, i) => (
        <path
          key={i}
          d={arcPath(seg.h1, seg.h2)}
          fill="none"
          stroke={seg.color}
          strokeWidth={14}
          strokeLinecap="butt"
        />
      ))}

      {/* Tick marks + hour labels */}
      {HOUR_LABELS.map((label, h) => {
        const ang = hourToAngle(h);
        const a   = toRad(ang);
        const dx  = Math.cos(a);
        const dy  = Math.sin(a);
        const tx1 = CX + INNER_EDGE * dx;
        const ty1 = CY + INNER_EDGE * dy;
        const tx2 = CX + (INNER_EDGE - TICK_LEN) * dx;
        const ty2 = CY + (INNER_EDGE - TICK_LEN) * dy;
        const lx  = CX + LABEL_R * dx;
        const ly  = CY + LABEL_R * dy;

        return (
          <React.Fragment key={h}>
            <line
              x1={tx1} y1={ty1} x2={tx2} y2={ty2}
              stroke="rgba(237,232,208,0.55)"
              strokeWidth={1.2}
            />
            <text
              x={lx} y={ly}
              fill="rgba(237,232,208,0.80)"
              fontSize={9}
              fontFamily="'Courier New', Courier, monospace"
              fontWeight="500"
              dominantBaseline="middle"
              textAnchor="end"
            >
              {label}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

// ── Grain + vignette texture overlay ─────────────────────────
function WornOverlay() {
  return (
    <>
      {/* SVG fractal noise grain */}
      <svg
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 90,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              seed="2"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
            <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
            <feComposite in="blend" in2="SourceGraphic" operator="in"/>
          </filter>
        </defs>
        <rect
          width="100%" height="100%"
          fill="rgba(8,18,40,0.18)"
          filter="url(#grain)"
        />
      </svg>

      {/* Vignette: darker corners/edges */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 88,
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,5,18,0.55) 100%),
            linear-gradient(to bottom, rgba(0,5,18,0.35) 0%, transparent 12%, transparent 88%, rgba(0,5,18,0.35) 100%)
          `,
        }}
      />

      {/* Worn blue variation patches */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 87,
          background: `
            radial-gradient(ellipse at 15% 40%, rgba(12,30,70,0.45) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 60%, rgba(5,15,45,0.50) 0%, transparent 40%),
            radial-gradient(ellipse at 40% 80%, rgba(8,20,55,0.35) 0%, transparent 35%)
          `,
        }}
      />
    </>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const [time, setTime] = useState("14:22");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  const [upperActive, setUpperActive] = useState("FES");
  const [lowerActive, setLowerActive] = useState<string | null>("Steps");
  const [periodTab, setPeriodTab]   = useState("Daily");

  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBodyDims({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <WornOverlay />

    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100dvh",
        width: "100%",
        background:
          "radial-gradient(ellipse at 30% 20%, #EFE3C8 0%, #D9C8A6 60%, #B8A47E 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial Narrow', Arial, 'Helvetica Neue', sans-serif",
        userSelect: "none",
      }}
    >
      {/* Left paper margin with faint serif text */}
      <div
        aria-hidden
        style={{
          width: 18,
          flexShrink: 0,
          background:
            "linear-gradient(to right, rgba(120,90,50,0.35), transparent)",
          color: "rgba(60,40,20,0.45)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 7,
          lineHeight: 1.2,
          padding: "8px 2px",
          overflow: "hidden",
          writingMode: "vertical-rl",
          letterSpacing: 0.2,
        }}
      >
        latch contr. ts th of the matter, finely woven and bound. an old
        record of breath and motion that fades with each passing hour into
        memory and dust.
      </div>

      <WornOverlay />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.navy,
          overflow: "hidden",
          fontFamily: "'Arial Narrow', Arial, 'Helvetica Neue', sans-serif",
          userSelect: "none",
          position: "relative",
          zIndex: 1,
          boxShadow:
            "inset 0 0 60px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            height: HEADER_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
            background: "rgba(8,20,45,0.5)",
          }}
        >
          <span
            style={{
              color: C.cream,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.4,
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            FF M. Harvey - SCFD
          </span>
          <span
            style={{
              color: C.cream,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            {time}
          </span>
        </div>

        {/* ── Body ── */}
        <div
          ref={bodyRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Left sidebar */}
          <div
            style={{
              width: SIDEBAR_W,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0",
              borderRight: `1px solid ${C.border}`,
            }}
          >
            {/* Upper tabs */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {UPPER_TABS.map((tab) => {
                const active = tab.label === upperActive;
                const bg = active ? (tab.accent ?? C.cream) : "transparent";
                const textColor = active
                  ? tab.accent ? C.cream : C.navy
                  : "rgba(237,232,208,0.40)";
                return (
                  <button
                    key={tab.label}
                    onClick={() => setUpperActive(tab.label)}
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bg,
                      border: "none",
                      borderBottom: `1px solid ${C.border}`,
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: active ? "inset 0 0 8px rgba(0,0,0,0.25)" : "none",
                    }}
                  >
                    <span
                      style={{
                        color: textColor,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        transform: "rotate(-90deg)",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        textShadow: active ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FAB gap */}
            <div style={{ height: FAB_SIZE + 20, flexShrink: 0 }} />

            {/* Lower tabs */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {LOWER_TABS.map((tab) => {
                const active = tab.label === lowerActive;
                const bg = active ? (tab.accent ?? C.cream) : "transparent";
                const textColor = active
                  ? tab.accent === C.accentHeart ? C.navy : C.cream
                  : "rgba(237,232,208,0.40)";
                return (
                  <button
                    key={tab.label}
                    onClick={() =>
                      setLowerActive((p) => (p === tab.label ? null : tab.label))
                    }
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bg,
                      border: "none",
                      borderTop: `1px solid ${C.border}`,
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: active ? "inset 0 0 8px rgba(0,0,0,0.25)" : "none",
                    }}
                  >
                    <span
                      style={{
                        color: textColor,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        transform: "rotate(-90deg)",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        textShadow: active ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "0 6px 8px 8px",
              minWidth: 0,
            }}
          >
            {/* Period tabs */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                borderBottom: `1px solid ${C.border}`,
                flexShrink: 0,
                height: 48,
                alignItems: "center",
              }}
            >
              {(["Daily", "Lifetime", "Custom"] as const).map((t) => {
                const active = t === periodTab;
                return (
                  <button
                    key={t}
                    onClick={() => setPeriodTab(t)}
                    style={{
                      padding: "7px 14px",
                      marginRight: 6,
                      height: 32,
                      borderRadius: 2,
                      border: "none",
                      background: active ? C.terracotta : C.paper,
                      color: active ? C.paper : "#3A2A1A",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      cursor: "pointer",
                      letterSpacing: 0.3,
                      boxShadow:
                        "0 2px 4px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Upper metric box — OHPAH value */}
            <div
              style={{
                flex: 1,
                border: `1.5px dashed ${C.dashed}`,
                borderRadius: 3,
                marginTop: 6,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: 0,
                background: "rgba(255,255,255,0.02)",
              }}
            >
            </div>

            {/* FAB gap */}
            <div style={{ height: FAB_SIZE + 6, flexShrink: 0 }} />

            {/* Lower metric box — HealthKit value */}
            <div
              style={{
                flex: 1,
                border: `1.5px dashed ${C.dashed}`,
                borderRadius: 3,
                marginBottom: 6,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: 0,
                background: "rgba(255,255,255,0.02)",
              }}
            >
            </div>
          </div>

          {/* Arc timeline overlay */}
          {bodyDims.width > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                pointerEvents: "none",
              }}
            >
              <ArcTimeline
                width={bodyDims.width}
                height={bodyDims.height}
                segments={[]}
              />
            </div>
          )}

          {/* FAB */}
          <button
            style={{
              position: "absolute",
              left: SIDEBAR_W - FAB_R,
              top: "50%",
              transform: "translateY(-50%)",
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: "50%",
              background: `radial-gradient(circle at 38% 38%, #D04030, ${C.fabRed} 60%, #7A1A10)`,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,120,80,0.25)",
            }}
          >
            <span
              style={{
                color: C.cream,
                fontSize: 34,
                fontWeight: 200,
                lineHeight: 1,
                marginTop: -2,
              }}
            >
              +
            </span>
          </button>
        </div>

        {/* ── Bottom nav ── */}
        <div
          style={{
            height: BOTTOM_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderTop: `1px solid ${C.border}`,
            backgroundColor: "rgba(6,14,36,0.85)",
            flexShrink: 0,
          }}
        >
          <button
            style={{
              width: 36,
              height: 36,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {/* Bookmark icon */}
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
              <path
                d="M4 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
                stroke={C.cream}
                strokeWidth="1.8"
                fill="none"
              />
              <path
                d="M11 8 L13 11 L16 9 L14 13 L16 17 L11 14.5 L6 17 L8 13 L6 9 L9 11 Z"
                fill={C.cream}
                opacity="0.7"
              />
            </svg>
          </button>

          {/* OHPΔH wordmark */}
          <span
            style={{
              color: C.cream,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 5,
              fontFamily: "Georgia, 'Times New Roman', serif",
              textShadow: "0 1px 6px rgba(0,0,0,0.6), 0 0 20px rgba(237,232,208,0.12)",
            }}
          >
            OHPΔH
          </span>

          <button
            style={{
              width: 36,
              height: 36,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {/* Hamburger icon */}
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="2" x2="22" y2="2" stroke={C.cream} strokeWidth="2" strokeLinecap="round"/>
              <line x1="0" y1="8" x2="22" y2="8" stroke={C.cream} strokeWidth="2" strokeLinecap="round"/>
              <line x1="0" y1="14" x2="22" y2="14" stroke={C.cream} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
