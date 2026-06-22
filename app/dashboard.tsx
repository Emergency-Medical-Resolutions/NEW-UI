/**
 * OHPAH Dashboard — matches reference image exactly.
 *
 * Layout:
 *   ┌─ Header: "FF M. Harvey – SCFD"  |  "14:22" ─────────┐
 *   │ [Sidebar] [Center]              [Arc timeline]        │
 *   │  FES      Daily|Lifetime|Custom                       │
 *   │  WII      ┌─ ─ ─ ─ ─ ─ ─ ─ ┐                        │
 *   │  Sleep    │      4           │  ← OHPAH number        │
 *   │  Call ██  └─ ─ ─ ─ ─ ─ ─ ─ ┘                        │
 *   │  ●FAB                                                 │
 *   │  Cal      ┌─ ─ ─ ─ ─ ─ ─ ─ ┐                        │
 *   │  Steps ██ │    5437          │  ← HealthKit number    │
 *   │  Heart    │    Steps         │                        │
 *   │  Calorie  └─ ─ ─ ─ ─ ─ ─ ─ ┘                        │
 *   └─ Bottom nav: 🔖  OHPΔH  ☰ ──────────────────────────┘
 */
import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArcTimeline, { ArcSegment } from '../components/ArcTimeline';

// ── Theme tokens (faithful to reference image) ────────────
const C = {
  navy:         '#0B1929',
  white:        '#FFFFFF',
  dimText:      'rgba(255,255,255,0.45)',
  border:       'rgba(255,255,255,0.18)',
  dashedBorder: 'rgba(255,255,255,0.30)',
  crimson:      '#8B1A1A',
  activeTabBg:  '#FFFFFF',
  activeTabText:'#0B1929',
};

const L = {
  sidebarWidth:    44,
  headerHeight:    52,
  bottomNavHeight: 58,
  fabSize:         54,
  fabRadius:       27,
};

// ── Call-log segments visible in the reference image ──────
// h=0 → 0800, h=24 → 0800 next day
const CALL_SEGMENTS: ArcSegment[] = [
  { h1: 0,   h2: 1,   color: '#8B1111' }, // red  0800–0900
  { h1: 1,   h2: 5.5, color: '#2E6B2E' }, // green 0900–1330
  { h1: 5.5, h2: 7,   color: '#2E6B2E' }, // green continues
  { h1: 11,  h2: 12,  color: '#B8870A' }, // amber 1900–2000
  { h1: 13,  h2: 16,  color: '#D8D8D8' }, // white 2100–0000
  { h1: 17,  h2: 20,  color: '#2E6B2E' }, // green 0100–0400
  { h1: 21,  h2: 22,  color: '#B8870A' }, // amber 0500–0600
  { h1: 22,  h2: 24,  color: '#8B1111' }, // red   0600–0800
];

// ── Sidebar tabs ──────────────────────────────────────────
const UPPER_TABS = ['FES', 'WII', 'Sleep', 'Call'];
const LOWER_TABS = ['Cal', 'Steps', 'Heart', 'Calorie'];

// ── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  // Live clock
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  // Active tabs
  const [upperActive, setUpperActive] = useState('Call');
  const [lowerActive, setLowerActive] = useState<string|null>('Steps');
  const [periodTab, setPeriodTab] = useState('Daily');

  // Body layout for arc sizing
  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });
  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBodyDims({ width, height });
  };

  return (
    <SafeAreaView style={s.root}>

      {/* ── Header ─────────────────────────────────────── */}
      <View style={s.header}>
        <Text style={s.headerName}>FF M. Harvey – SCFD</Text>
        <Text style={s.headerClock}>{time}</Text>
      </View>

      {/* ── Body ───────────────────────────────────────── */}
      <View style={s.body} onLayout={onBodyLayout}>

        {/* Left sidebar */}
        <View style={s.sidebar}>
          {UPPER_TABS.map((tab) => {
            const active = tab === upperActive;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.vtab, active && s.vtabActive]}
                onPress={() => setUpperActive(tab)}
                activeOpacity={0.7}
              >
                <Text style={[s.vtabText, active && s.vtabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* FAB gap */}
          <View style={s.sidebarFabGap} />

          {LOWER_TABS.map((tab) => {
            const active = tab === lowerActive;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.vtab, active && s.vtabActive]}
                onPress={() => setLowerActive(prev => prev === tab ? null : tab)}
                activeOpacity={0.7}
              >
                <Text style={[s.vtabText, active && s.vtabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center */}
        <View style={s.center}>

          {/* Period tabs */}
          <View style={s.periodRow}>
            {['Daily', 'Lifetime', 'Custom'].map((t, i) => (
              <TouchableOpacity
                key={t}
                style={[s.periodBtn, i < 2 && s.periodBtnBorder]}
                onPress={() => setPeriodTab(t)}
                activeOpacity={0.7}
              >
                <Text style={[s.periodText, t === periodTab && s.periodTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upper metric box — OHPAH, number always shown */}
          <View style={s.metricBox}>
            <Text style={s.bigNum}>4</Text>
          </View>

          {/* FAB gap spacer */}
          <View style={s.fabGap} />

          {/* Lower metric box — HealthKit, tap-to-reveal */}
          <View style={s.metricBox}>
            {lowerActive ? (
              <>
                <Text style={s.bigNum}>{lowerActive === 'Steps' ? '5437' : '—'}</Text>
                <Text style={s.metricLabel}>{lowerActive}</Text>
              </>
            ) : null}
          </View>

        </View>

        {/* Arc timeline overlay */}
        {bodyDims.width > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ArcTimeline
              width={bodyDims.width}
              height={bodyDims.height}
              segments={CALL_SEGMENTS}
            />
          </View>
        )}

        {/* FAB */}
        <TouchableOpacity style={s.fab} activeOpacity={0.8}>
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom nav ─────────────────────────────────── */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>🔖</Text>
        </TouchableOpacity>
        <Text style={s.wordmark}>OHPΔH</Text>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>☰</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.navy,
  },

  // Header
  header: {
    height: L.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerName: {
    color: C.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  headerClock: {
    color: C.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Body
  body: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  // Sidebar
  sidebar: {
    width: L.sidebarWidth,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  sidebarFabGap: {
    height: L.fabSize + 12,
    flexShrink: 0,
  },
  vtab: {
    width: L.sidebarWidth,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vtabActive: {
    backgroundColor: C.activeTabBg,
  },
  vtabText: {
    color: C.dimText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
  },
  vtabTextActive: {
    color: C.activeTabText,
  },

  // Center
  center: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 6,
    paddingBottom: 8,
    paddingTop: 4,
  },

  // Period tabs
  periodRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 8,
    flexShrink: 0,
  },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  periodBtnBorder: {
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  periodText: {
    color: C.dimText,
    fontSize: 13,
    fontWeight: '500',
  },
  periodTextActive: {
    color: C.white,
    fontWeight: '600',
  },

  // Metric boxes
  metricBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.dashedBorder,
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'flex-end',
  },
  bigNum: {
    fontSize: 68,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.white,
    lineHeight: 72,
    includeFontPadding: false,
  },
  metricLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: C.white,
    marginTop: 2,
  },

  // FAB gap spacer
  fabGap: {
    height: L.fabSize + 4,
    flexShrink: 0,
  },

  // FAB
  fab: {
    position: 'absolute',
    left: L.sidebarWidth - L.fabRadius,
    top: '50%',
    marginTop: -L.fabRadius,
    width: L.fabSize,
    height: L.fabSize,
    borderRadius: L.fabRadius,
    backgroundColor: C.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: C.crimson,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: C.white,
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
  },

  // Bottom nav
  bottomNav: {
    height: L.bottomNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.navy,
  },
  navBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: C.dimText,
    fontSize: 18,
  },
  wordmark: {
    color: C.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 3,
  },
});
