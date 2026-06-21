/**
 * OHPAH — Main Dashboard
 *
 * Layout (portrait, full-screen):
 *   ┌─ Header: name | live clock ───────────────────────┐
 *   │ [L-bar] [Center content]          [Arc] [R-bar]   │
 *   │          ┌──────────────┐                         │
 *   │          │ OHPAH number │  ← always shown (FES…)  │
 *   │          │ [FES][SDI]   │                         │
 *   │          │ [WII][Total] │                         │
 *   │          └──────────────┘                         │
 *   │     ●  FAB (+)                                    │
 *   │          ┌──────────────┐                         │
 *   │          │ [HR][Sleep]  │                         │
 *   │          │ [Steps][Cal] │                         │
 *   │          │ HK number    │  ← tap to reveal        │
 *   │          └──────────────┘                         │
 *   └─ Bottom nav: bookmark | OHPΔH | menu ─────────────┘
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Line as SvgLine, Path, Text as SvgText } from 'react-native-svg';
import { COLORS, LAYOUT } from '../constants/theme';
import ArcTimeline, { ArcSegment } from '../components/ArcTimeline';
import MetricBox from '../components/MetricBox';

// ── Types ──────────────────────────────────────────────
interface SidebarTab {
  label: string;
  inverted?: boolean; // white bg, dark text (e.g. "Call")
}

// ── Static data (replace with real data layer later) ──
const LEFT_TABS: SidebarTab[] = [
  { label: 'FES' },
  { label: 'WII' },
  { label: 'Sleep' },
  { label: 'Call', inverted: true },
];

const RIGHT_TABS: SidebarTab[] = [
  { label: 'Cal' },
  { label: 'Steps' },
  { label: 'Heart' },
  { label: 'Calorie' },
];

const OHPAH_METRICS = [
  { key: 'FES',   label: 'FES',   value: '4'    },
  { key: 'SDI',   label: 'SDI',   value: '3.2'  },
  { key: 'WII',   label: 'WII',   value: '8'    },
  { key: 'Total', label: 'Total', value: '15.2' },
];

const HEALTH_METRICS = [
  { key: 'HR',    label: 'HR',    value: '72 bpm' },
  { key: 'Sleep', label: 'Sleep', value: '6.5'    },
  { key: 'Steps', label: 'Steps', value: '5437'   },
  { key: 'Cal',   label: 'Cal',   value: '2341'   },
];

// Active call-log segments (empty = baseline, no logged calls yet).
// Shape: { h1: hourOffset, h2: hourOffset, color: string }
// where h=0 → 0800, h=24 → 0800 next day
const CALL_SEGMENTS: ArcSegment[] = [];

// ── Component ──────────────────────────────────────────
export default function Dashboard() {
  // Live clock
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  // Metric selection state
  const [upperKey, setUpperKey] = useState('FES');
  const [lowerKey, setLowerKey] = useState<string | null>(null);

  const activeUpper = OHPAH_METRICS.find((m) => m.key === upperKey)!;
  const activeLower = HEALTH_METRICS.find((m) => m.key === lowerKey);

  // Body layout dimensions (for arc SVG sizing)
  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });
  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBodyDims({ width, height });
  };

  return (
    <SafeAreaView style={styles.root}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerName}>FF M. Harvey – SCFD</Text>
        <Text style={styles.headerClock}>{time}</Text>
      </View>

      {/* ── Body ── */}
      <View style={styles.body} onLayout={onBodyLayout}>

        {/* Left sidebar */}
        <View style={[styles.sidebar, styles.leftSidebar]}>
          {LEFT_TABS.map((tab) => (
            <View
              key={tab.label}
              style={[styles.vtabWrap, tab.inverted && styles.vtabInverted]}
            >
              <Text style={[styles.vtabText, tab.inverted && styles.vtabTextInverted]}>
                {tab.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Center content */}
        <View style={styles.center}>

          {/* Top tabs */}
          <View style={styles.topTabs}>
            {['Daily', 'Lifetime', 'Custom'].map((t, i) => (
              <TouchableOpacity key={t} style={styles.topTabBtn}>
                <Text style={[styles.topTabText, i === 0 && styles.topTabActive]}>
                  {t}
                </Text>
                {i === 0 && <View style={styles.topTabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Upper OHPAH metric box — number always visible */}
          <MetricBox
            style={styles.boxUpper}
            metrics={OHPAH_METRICS}
            activeKey={upperKey}
            numberPosition="top"
            activeMetric={activeUpper}
            onSelect={(key) => setUpperKey(key)}
          />

          {/* FAB gap spacer */}
          <View style={styles.fabGap} />

          {/* Lower HealthKit metric box — number tap to reveal */}
          <MetricBox
            style={styles.boxLower}
            metrics={HEALTH_METRICS}
            activeKey={lowerKey}
            numberPosition="bottom"
            activeMetric={activeLower ?? null}
            onSelect={(key) =>
              setLowerKey((prev) => (prev === key ? null : key))
            }
          />

        </View>

        {/* Right sidebar */}
        <View style={[styles.sidebar, styles.rightSidebar]}>
          {RIGHT_TABS.map((tab) => (
            <View key={tab.label} style={styles.vtabWrap}>
              <Text style={styles.vtabText}>{tab.label}</Text>
            </View>
          ))}
        </View>

        {/* Arc timeline — absolute overlay */}
        {bodyDims.width > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ArcTimeline
              width={bodyDims.width}
              height={bodyDims.height}
              segments={CALL_SEGMENTS}
            />
          </View>
        )}

        {/* FAB — absolute, centred vertically, overlaps left sidebar edge */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>🔖</Text>
        </TouchableOpacity>
        <Text style={styles.wordmark}>OHPΔH</Text>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>☰</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  // Header
  header: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerName: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  headerClock: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.4,
  },

  // Body
  body: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  // Sidebars
  sidebar: {
    width: LAYOUT.sidebarWidth,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  leftSidebar: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  rightSidebar: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  vtabWrap: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  vtabInverted: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  vtabText: {
    color: COLORS.dimText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    // Rotate text vertically
    transform: [{ rotate: '-90deg' }],
  },
  vtabTextInverted: {
    color: COLORS.navy,
  },

  // Center
  center: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 8,
    paddingBottom: 8,
    overflow: 'hidden',
  },

  // Top tabs
  topTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 6,
    flexShrink: 0,
  },
  topTabBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    position: 'relative',
  },
  topTabText: {
    color: COLORS.dimText,
    fontSize: 12,
    fontWeight: '500',
  },
  topTabActive: {
    color: COLORS.white,
  },
  topTabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 13,
    right: 13,
    height: 2,
    backgroundColor: COLORS.white,
  },

  // Metric boxes
  boxUpper: { flex: 1, marginBottom: 2 },
  boxLower: { flex: 1, marginTop: 2 },

  // FAB gap
  fabGap: { height: 58, flexShrink: 0 },

  // FAB
  fab: {
    position: 'absolute',
    left: LAYOUT.sidebarWidth - LAYOUT.fabRadius, // overlaps left sidebar edge
    top: '50%',
    marginTop: -LAYOUT.fabRadius,
    width: LAYOUT.fabSize,
    height: LAYOUT.fabSize,
    borderRadius: LAYOUT.fabRadius,
    backgroundColor: COLORS.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
  },

  // Bottom nav
  bottomNav: {
    height: LAYOUT.bottomNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: COLORS.dimText,
    fontSize: 18,
  },
  wordmark: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
