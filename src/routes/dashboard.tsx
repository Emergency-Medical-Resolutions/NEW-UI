import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

// ─── Palette (matches reference image) ──────────────────────────────────────
const C = {
  paper:        "#E8D8B0",   // outer aged paper
  paperEdge:    "#C9B582",   // darker paper edge
  paperInk:     "rgba(60,40,18,0.55)",
  navy:         "#0C2747",   // worn dark-blue page
  navyDeep:     "#06182F",
  cream:        "#F0E6C8",   // light ivory text + tab paper
  creamDim:     "rgba(240,230,200,0.55)",
  dashed:       "rgba(240,230,200,0.55)",
  terracotta:   "#B6452B",   // active Daily tab + FAB
  fabRed:       "#B6432A",
  tabSlate:     "#7B7466",   // Call (active gray)
  tabTeal:      "#3FA3A1",   // Cal
  tabYellow:    "#E6B84A",   // Steps
  tabPink:      "#D88478",   // Heart
  tabOrange:    "#C77A2A",   // Calorie
  inkOnTab:     "#3A2A18",
};

const SIDEBAR_W = 44;
const HEADER_H  = 50;
const BOTTOM_H  = 60;
const PAPER_W   = 28;
const FAB_SIZE  = 58;

// ─── Tabs ────────────────────────────────────────────────────────────────────
const UPPER_TABS = [
  { label: "FES",   bg: C.cream,    ink: C.inkOnTab },
  { label: "WII",   bg: C.cream,    ink: C.inkOnTab },
  { label: "Sleep", bg: C.cream,    ink: C.inkOnTab },
  { label: "Call",  bg: C.tabSlate, ink: C.cream, active: true },
];
const LOWER_TABS = [
  { label: "Cal",     bg: C.tabTeal,   ink: C.cream },
  { label: "Steps",   bg: C.tabYellow, ink: C.inkOnTab },
  { label: "Heart",   bg: C.tabPink,   ink: C.cream },
  { label: "Calorie", bg: C.tabOrange, ink: C.cream },
];

// 8am → 8am, exactly as labelled in the reference
const HOUR_LABELS = [
  "8", "9", "10", "11", "12",
  "1300", "1400", "1500", "1600", "1700",
  "1800", "1900", "2000", "2100", "2200", "2300",
  "0000", "0100", "0200", "0300", "0400",
  "0500", "0600", "0700", "8",
];

// ─── Arc (right side) ────────────────────────────────────────────────────────
function Arc({ width, height }: { width: number; height: number }) {
  // Center the arc off the right side so it curves like a parenthesis
  const CX = width + width * 0.35;
  const CY = height / 2;
  const R  = width + width * 0.25;

  const halfH     = height * 0.46;
  const halfAngle = Math.asin(Math.min(halfH / R, 0.9999)) * (180 / Math.PI);
  const A_START   = 180 - halfAngle;
  const A_END     = 180 + halfAngle;
  const SPAN      = A_END - A_START;
  const N         = HOUR_LABELS.length - 1;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (deg: number) => ({
    x: CX + R * Math.cos(toRad(deg)),
    y: CY + R * Math.sin(toRad(deg)),
  });

  const p1 = pt(A_START);
  const p2 = pt(A_END);
  const arcD =
    `M${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ` +
    `A${R} ${R} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;

  const TICK = 8;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <path
        d={arcD}
        fill="none"
        stroke={C.cream}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {HOUR_LABELS.map((label, i) => {
        const ang = A_START + (i / N) * SPAN;
        const a   = toRad(ang);
        const dx  = Math.cos(a);
        const dy  = Math.sin(a);
        const x1  = CX + R * dx;
        const y1  = CY + R * dy;
        const x2  = CX + (R + TICK) * dx;
        const y2  = CY + (R + TICK) * dy;
        const lx  = CX + (R + TICK + 4) * dx;
        const ly  = CY + (R + TICK + 4) * dy;
        return (
          <React.Fragment key={i}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={C.cream}
              strokeWidth={1.2}
            />
            <text
              x={lx} y={ly}
              fill={C.cream}
              fontSize={label.length > 1 ? 10 : 12}
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight={500}
              dominantBaseline="middle"
              textAnchor="start"
            >
              {label}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

// ─── Worn texture overlay (grain + vignette + creases) ──────────────────────
function WornOverlay() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 30,
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      >
        <defs>
          <filter id="paper-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Vignette + dark blotches */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          zIndex: 31,
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%),
            radial-gradient(ellipse at 78% 35%, rgba(0,0,0,0.40) 0%, transparent 22%),
            radial-gradient(ellipse at 22% 70%, rgba(0,0,0,0.30) 0%, transparent 25%),
            radial-gradient(ellipse at 65% 75%, rgba(0,0,0,0.30) 0%, transparent 18%)
          `,
        }}
      />

      {/* Horizontal crease through the middle */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: "50%",
          height: 2,
          transform: "translateY(-1px)",
          pointerEvents: "none",
          zIndex: 32,
          background:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 30%, rgba(255,240,210,0.10) 50%, rgba(0,0,0,0.35) 70%, transparent 100%)",
          boxShadow: "0 1px 0 rgba(255,240,210,0.10)",
        }}
      />
    </>
  );
}

function PaperMargin({ side }: { side: "left" | "right" }) {
  const text =
    side === "left"
      ? "latch contr. ts th of the matter, finely woven and bound an old record of breath and motion that fades with each passing hour into memory and dust slowly disappearing"
      : "of the matter finely woven and bound an old record of breath and motion that fades with each passing hour into memory and dust the time passes and fades quietly";
  return (
    <div
      aria-hidden
      style={{
        width: PAPER_W,
        flexShrink: 0,
        background: `
          linear-gradient(${side === "left" ? "to right" : "to left"},
            ${C.paperEdge} 0%, ${C.paper} 60%, ${C.paper} 100%)
        `,
        position: "relative",
        overflow: "hidden",
        boxShadow:
          side === "left"
            ? "inset -3px 0 6px rgba(0,0,0,0.45)"
            : "inset 3px 0 6px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8, bottom: 8,
          [side]: 2,
          width: PAPER_W - 6,
          color: C.paperInk,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 7,
          lineHeight: 1.25,
          writingMode: "vertical-rl",
          letterSpacing: 0.2,
          overflow: "hidden",
          transform: side === "left" ? "rotate(180deg)" : "none",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function Dashboard() {
  const [time, setTime] = useState("14:22");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [period, setPeriod] = useState<"Daily" | "Lifetime" | "Custom">("Daily");

  const arcRef = useRef<HTMLDivElement>(null);
  const [arcDims, setArcDims] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setArcDims({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100dvh",
        width: "100%",
        background: C.paper,
        userSelect: "none",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <PaperMargin side="left" />

      {/* Worn navy book page */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: `
            radial-gradient(ellipse at 50% 50%, ${C.navy} 0%, ${C.navyDeep} 110%)
          `,
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.6)",
        }}
      >
        <WornOverlay />

        {/* Header */}
        <div
          style={{
            position: "relative",
            zIndex: 40,
            height: HEADER_H,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
          }}
        >
          <span
            style={{
              color: C.cream,
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "Georgia, 'Times New Roman', serif",
              letterSpacing: 0.3,
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            FF M. Harvey - SCFD
          </span>
          <span
            style={{
              color: C.cream,
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: 0.5,
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            {time}
          </span>
        </div>

        {/* Body row */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            position: "relative",
            minHeight: 0,
            zIndex: 35,
          }}
        >
          {/* Left tab rail */}
          <div
            style={{
              width: SIDEBAR_W,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {UPPER_TABS.map((t) => (
                <div
                  key={t.label}
                  style={{
                    height: 70,
                    background: t.bg,
                    margin: "0 0 0 2px",
                    borderRadius: "0 2px 2px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "1px 1px 3px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                >
                  <span
                    style={{
                      color: t.ink,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontWeight: 700,
                      fontSize: 13,
                      transform: "rotate(-90deg)",
                      whiteSpace: "nowrap",
                      letterSpacing: 0.3,
                    }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {LOWER_TABS.map((t) => (
                <div
                  key={t.label}
                  style={{
                    height: 70,
                    background: t.bg,
                    margin: "0 0 0 2px",
                    borderRadius: "0 2px 2px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "1px 1px 3px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                >
                  <span
                    style={{
                      color: t.ink,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontWeight: 700,
                      fontSize: 13,
                      transform: "rotate(-90deg)",
                      whiteSpace: "nowrap",
                      letterSpacing: 0.3,
                    }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "6px 8px 8px 8px",
              minWidth: 0,
              position: "relative",
            }}
          >
            {/* Period tabs */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
                flexShrink: 0,
                marginBottom: 10,
              }}
            >
              {(["Daily", "Lifetime", "Custom"] as const).map((t) => {
                const active = t === period;
                return (
                  <button
                    key={t}
                    onClick={() => setPeriod(t)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      background: active ? C.terracotta : C.cream,
                      color: active ? C.cream : C.inkOnTab,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 2,
                      cursor: "pointer",
                      letterSpacing: 0.3,
                      boxShadow:
                        "1px 2px 4px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Upper dashed box */}
            <div
              style={{
                flex: 1,
                border: `2px dashed ${C.dashed}`,
                borderRadius: 4,
                minHeight: 0,
                marginBottom: 28,
              }}
            />

            {/* Lower dashed box */}
            <div
              style={{
                flex: 1,
                border: `2px dashed ${C.dashed}`,
                borderRadius: 4,
                minHeight: 0,
              }}
            />
          </div>

          {/* Arc overlay (right side, drawn over the dashed box edges) */}
          <div
            ref={arcRef}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "44%",
              pointerEvents: "none",
              zIndex: 36,
            }}
          >
            {arcDims.width > 0 && (
              <Arc width={arcDims.width} height={arcDims.height} />
            )}
          </div>

          {/* FAB */}
          <button
            style={{
              position: "absolute",
              left: SIDEBAR_W - FAB_SIZE / 2 + 2,
              top: "50%",
              transform: "translateY(-50%)",
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: `radial-gradient(circle at 38% 35%, #D44A30, ${C.fabRed} 60%, #6E1A0E)`,
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,140,100,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <span
              style={{
                color: C.cream,
                fontSize: 38,
                fontWeight: 300,
                lineHeight: 1,
                marginTop: -3,
              }}
            >
              +
            </span>
          </button>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "relative",
            zIndex: 40,
            height: BOTTOM_H,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "rgba(6,18,38,0.55)",
            borderTop: "1px solid rgba(0,0,0,0.4)",
            boxShadow: "inset 0 1px 0 rgba(255,240,210,0.06)",
          }}
        >
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
            <path
              d="M3 2h16a1 1 0 0 1 1 1v21l-9-5-9 5V3a1 1 0 0 1 1-1z"
              stroke={C.cream}
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M11 7 L12.5 10.5 L16 11 L13.3 13.4 L14 17 L11 15.2 L8 17 L8.7 13.4 L6 11 L9.5 10.5 Z"
              fill={C.cream}
              opacity="0.85"
            />
          </svg>

          <span
            style={{
              color: C.cream,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              fontFamily: "Georgia, 'Times New Roman', serif",
              textShadow:
                "0 1px 4px rgba(0,0,0,0.7), 0 0 14px rgba(240,230,200,0.18)",
            }}
          >
            OHP<span style={{ fontSize: 26 }}>Δ</span>H
          </span>

          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <line x1="0" y1="2"  x2="24" y2="2"  stroke={C.cream} strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="9"  x2="24" y2="9"  stroke={C.cream} strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="16" x2="24" y2="16" stroke={C.cream} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <PaperMargin side="right" />
    </div>
  );
}
