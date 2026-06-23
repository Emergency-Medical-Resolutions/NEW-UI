/**
 * ArcTimeline
 *
 * 24-hour semicircular timeline drawn with react-native-svg, styled as an
 * engraved cream dial on the weathered-navy field-journal dashboard.
 * A solid cream rail curves down the right side as a ")" shape, with inward
 * tick marks and serif time labels (08:00 → 08:00 cycle).
 */
import React from 'react';
import Svg, {
  Line as SvgLine,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import { COLORS, FONTS } from '../constants/theme';

export interface ArcSegment {
  h1: number;
  h2: number;
  color: string;
}

interface Props {
  width: number;
  height: number;
  segments?: ArcSegment[];
}

// Labels matching the reference dial: hours 8–12, then military 1300→0700, back to 8
const HOUR_LABELS = [
  '8', '9', '10', '11', '12',
  '1300', '1400', '1500', '1600', '1700', '1800',
  '1900', '2000', '2100', '2200', '2300',
  '0000', '0100', '0200', '0300', '0400',
  '0500', '0600', '0700', '8',
];

export default function ArcTimeline({ width, height, segments = [] }: Props) {
  // Circle centre sits off-screen left so the visible arc reads as ")".
  const CX = -10;
  const CY = height / 2;
  const R  = Math.round(width * 0.96);

  const halfH     = height * 0.46;
  const halfAngle = Math.asin(Math.min(halfH / R, 0.9999)) * (180 / Math.PI);
  const A_START   = -halfAngle;
  const A_END     =  halfAngle;
  const SPAN      = A_END - A_START;
  const HOURS     = 24;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const ptOn  = (angleDeg: number) => ({
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
  const TICK_LEN   = 12;
  const LABEL_R    = INNER_EDGE - TICK_LEN - 6;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Solid cream rail (full 24 h) */}
      <Path
        d={arcPath(0, 24)}
        fill="none"
        stroke={COLORS.arcLine}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Optional colour segments (call logs) */}
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

      {/* Inward tick marks + serif time labels */}
      {HOUR_LABELS.map((label, h) => {
        const ang = hourToAngle(h);
        const a   = toRad(ang);
        const dx  = Math.cos(a);
        const dy  = Math.sin(a);

        const tx1 = CX + INNER_EDGE * dx;
        const ty1 = CY + INNER_EDGE * dy;
        const tx2 = CX + (INNER_EDGE - TICK_LEN) * dx;
        const ty2 = CY + (INNER_EDGE - TICK_LEN) * dy;

        const lx = CX + LABEL_R * dx;
        const ly = CY + LABEL_R * dy;

        return (
          <React.Fragment key={h}>
            <SvgLine
              x1={tx1} y1={ty1}
              x2={tx2} y2={ty2}
              stroke={COLORS.tickStroke}
              strokeWidth={1.4}
            />
            <SvgText
              x={lx}
              y={ly}
              fill={COLORS.tickLabel}
              fontSize={13}
              fontFamily={FONTS.serif}
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
