/**
 * ArcTimeline
 *
 * Renders the 24-hour semicircular timeline using react-native-svg.
 * The arc is a tall ")" shape positioned in the right portion of the screen.
 *
 * Baseline: white rail + inside tick marks + 0800-format labels.
 * With call segments: coloured bands overlay the rail at logged call times.
 *
 * Props:
 *   width     — pixel width of the containing view
 *   height    — pixel height of the containing view
 *   segments  — array of call-log colour bands (empty = baseline)
 */
import React from 'react';
import Svg, {
  Line as SvgLine,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import { COLORS } from '../constants/theme';

export interface ArcSegment {
  /** Start hour offset (0 = 0800, 24 = 0800 next day) */
  h1: number;
  /** End hour offset */
  h2: number;
  /** Stroke colour */
  color: string;
}

interface Props {
  width: number;
  height: number;
  segments?: ArcSegment[];
}

// Military time labels for 0800 → 0800 (25 ticks, 24 hours)
const HOUR_LABELS = [
  '0800','0900','1000','1100','1200',
  '1300','1400','1500','1600','1700','1800',
  '1900','2000','2100','2200','2300',
  '0000','0100','0200','0300','0400',
  '0500','0600','0700','0800',
];

export default function ArcTimeline({ width, height, segments = [] }: Props) {
  // ── Circle geometry ──────────────────────────────────
  // Centre is off-screen to the left so the visible arc reads as a ")" shape.
  // Rightmost point sits near the right edge of the body.
  const CX = -15;
  const CY = height / 2;
  const R  = Math.round(width * 1.0); // radius ≈ body width

  // Span the arc to cover ~86% of body height
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

  // ── Tick geometry ─────────────────────────────────────
  const STROKE_HALF = 1;
  const INNER_EDGE  = R - STROKE_HALF;   // inner face of arc rail
  const TICK_LEN    = 10;                // tick extends inward from inner face
  const LABEL_R     = INNER_EDGE - TICK_LEN - 5; // label anchor radius

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>

      {/* ── Faint dashed reference rail (full 24 h) ── */}
      <Path
        d={arcPath(0, 24)}
        fill="none"
        stroke={COLORS.arcRail}
        strokeWidth={1}
        strokeDasharray="2 4"
      />

      {/* ── Colour segments (call logs) ── */}
      {segments.map((seg, i) => (
        <Path
          key={i}
          d={arcPath(seg.h1, seg.h2)}
          fill="none"
          stroke={seg.color}
          strokeWidth={6}
          strokeLinecap="butt"
        />
      ))}

      {/* ── Inside tick marks + time labels ── */}
      {HOUR_LABELS.map((label, h) => {
        const ang = hourToAngle(h);
        const a   = toRad(ang);
        const dx  = Math.cos(a); // outward unit vector x
        const dy  = Math.sin(a); // outward unit vector y

        // Tick: inner arc edge → inward
        const tx1 = CX + INNER_EDGE * dx;
        const ty1 = CY + INNER_EDGE * dy;
        const tx2 = CX + (INNER_EDGE - TICK_LEN) * dx;
        const ty2 = CY + (INNER_EDGE - TICK_LEN) * dy;

        // Label anchor (right-edge of text sits at this point; text extends inward)
        const lx = CX + LABEL_R * dx;
        const ly = CY + LABEL_R * dy;

        return (
          <React.Fragment key={h}>
            <SvgLine
              x1={tx1} y1={ty1}
              x2={tx2} y2={ty2}
              stroke={COLORS.tickStroke}
              strokeWidth={1.2}
            />
            <SvgText
              x={lx}
              y={ly}
              fill={COLORS.tickLabel}
              fontSize={8.5}
              fontFamily="monospace"
              dominantBaseline="middle"
              textAnchor="end"
            >
              {label}
            </SvgText>
          </React.Fragment>
        );
      })}

    </Svg>
  );
}
