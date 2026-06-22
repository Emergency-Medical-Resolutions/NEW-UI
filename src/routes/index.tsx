import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

// ── Colors ────────────────────────────────────────────────────
const C = {
  navy:          "#0B2340",
  white:         "#FFFFFF",
  cream:         "#EDE8D0",
  dimText:       "rgba(255,255,255,0.45)",
  border:        "rgba(255,255,255,0.20)",
  dashed:        "rgba(255,255,255,0.32)",
  terracotta:    "#C0522A",
  fabRed:        "#A63020",
  accentCall:    "#5C6470",
  accentCal:     "#0E7490",
  accentSteps:   "#D97706",
  accentHeart:   "#E5E7EB",
  accentCalorie: "#CA8A04",
};

const SIDEBAR_W = 52;
const HEADER_H  = 52;
const BOTTOM_H  = 64;
const FAB_SIZE  = 58;
const FAB_R     = 29;

// ── Tab definitions ───────────────────────────────────────────
const UPPER_TABS = [
  { label: "FES",   accent: null                as string | null },
  { label: "WII",   accent: null                as string | null },
  { label: "Sleep", accent: null                as string | null },
  { label: "Call",  accent: C.accentCall        as string | null },
];

const LOWER_TABS = [
  { label: "Cal",     accent: C.accentCal     as string | null },
  { label: "Steps",   accent: C.accentSteps   as string | null },
  { label: "Heart",   accent: C.accentHeart   as string | null },
  { label: "Calorie", accent: C.accentCalorie as string | null },
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

// ── Arc Timeline ──────────────────────────────────────────────
const HOUR_LABELS = [
  "0800","0900","1000","1100","1200",
  "1300","1400","1500","1600","1700","1800",
  "1900","2000","2100","2200","2300",
  "0000","0100","0200","0300","0400",
  "0500","0600","0700","0800",
];

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
  const LABEL_R    = INNER_EDGE - TICK_LEN - 5;

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
        stroke="rgba(255,255,255,0.82)"
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
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.2}
            />
            <text
              x={lx} y={ly}
              fill="rgba(255,255,255,0.70)"
              fontSize={8.5}
              fontFamily="monospace"
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

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const [time, setTime] = useState("");
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        backgroundColor: C.navy,
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          height: HEADER_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <span style={{ color: C.white, fontSize: 15, fontWeight: 600, letterSpacing: 0.2 }}>
          FF M. Harvey – SCFD
        </span>
        <span
          style={{
            color: C.white,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 0.5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </span>
      </div>

      {/* ── Body ── */}
      <div
        ref={bodyRef}
        style={{ flex: 1, display: "flex", flexDirection: "row", position: "relative", overflow: "hidden" }}
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
            padding: "10px 0",
            borderRight: `1px solid ${C.border}`,
          }}
        >
          {/* Upper tabs */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {UPPER_TABS.map((tab) => {
              const active = tab.label === upperActive;
              const bg = active ? (tab.accent ?? C.white) : "transparent";
              const textColor = active
                ? tab.accent ? C.white : C.navy
                : C.dimText;
              return (
                <button
                  key={tab.label}
                  onClick={() => setUpperActive(tab.label)}
                  style={{
                    width: SIDEBAR_W,
                    height: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      transform: "rotate(-90deg)",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FAB gap */}
          <div style={{ height: FAB_SIZE + 16, flexShrink: 0 }} />

          {/* Lower tabs */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {LOWER_TABS.map((tab) => {
              const active = tab.label === lowerActive;
              const bg = active ? (tab.accent ?? C.white) : "transparent";
              const textColor = active
                ? tab.accent === C.accentHeart ? C.navy : C.white
                : C.dimText;
              return (
                <button
                  key={tab.label}
                  onClick={() => setLowerActive((p) => (p === tab.label ? null : tab.label))}
                  style={{
                    width: SIDEBAR_W,
                    height: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      transform: "rotate(-90deg)",
                      display: "inline-block",
                      whiteSpace: "nowrap",
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
            padding: "4px 6px 8px 10px",
            minWidth: 0,
          }}
        >
          {/* Period tabs */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 8,
              flexShrink: 0,
            }}
          >
            {(["Daily", "Lifetime", "Custom"] as const).map((t, i) => {
              const active = t === periodTab;
              return (
                <button
                  key={t}
                  onClick={() => setPeriodTab(t)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 3,
                    border: "none",
                    borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                    background: active ? C.terracotta : "transparent",
                    color: active ? C.white : C.dimText,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
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
              borderRadius: 4,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: 0,
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                fontStyle: "italic",
                color: C.terracotta,
                lineHeight: 1.05,
              }}
            >
              {OHPAH_VALUES[upperActive] ?? "—"}
            </span>
          </div>

          {/* FAB gap */}
          <div style={{ height: FAB_SIZE + 4, flexShrink: 0 }} />

          {/* Lower metric box — HealthKit value */}
          <div
            style={{
              flex: 1,
              border: `1.5px dashed ${C.dashed}`,
              borderRadius: 4,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: 0,
            }}
          >
            {lowerActive && (
              <>
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: C.terracotta,
                    lineHeight: 1.05,
                  }}
                >
                  {HK_VALUES[lowerActive] ?? "—"}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.white,
                    marginTop: 4,
                  }}
                >
                  {lowerActive}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Arc timeline overlay */}
        {bodyDims.width > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <ArcTimeline
              width={bodyDims.width}
              height={bodyDims.height}
              segments={CALL_SEGMENTS}
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
            borderRadius: FAB_R,
            background: C.fabRed,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ color: C.white, fontSize: 32, fontWeight: 300, lineHeight: 1 }}>+</span>
        </button>
      </div>

      {/* ── Bottom nav ── */}
      <div
        style={{
          height: BOTTOM_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderTop: `1px solid ${C.border}`,
          backgroundColor: C.navy,
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
          }}
        >
          <span style={{ color: C.cream, fontSize: 20 }}>♡</span>
        </button>
        <span style={{ color: C.cream, fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>
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
          }}
        >
          <span style={{ color: C.cream, fontSize: 20 }}>☰</span>
        </button>
      </div>
    </div>
  );
}
