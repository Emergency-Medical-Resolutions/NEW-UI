/**
 * OHPAH — Biometric Command Dashboard
 * Faithful React Native port of .stitch/designs/dashboard.html (+ dashboard.png).
 *
 * Layout: [44px sidebar] | [center: tabs + two dashed metric boxes] | arc overlay (right)
 * Palette: cool dark-navy tactical interface (see constants/theme.ts).
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
import { COLORS as C, LAYOUT as L } from '../constants/theme';

// ── Sidebar tabs ──────────────────────────────────────────
const UPPER_TABS = ['FES', 'WII', 'SLEEP', 'CALL'];
const LOWER_TABS = ['CAL', 'STEPS', 'HEART', 'CALORIE'];

// ── Arc call-log segments (24h, 0 = 0800) ─────────────────
const CALL_SEGMENTS: ArcSegment[] = [
  { h1: 0,    h2: 0.8,  color: C.segRed   },
  { h1: 0.8,  h2: 5.5,  color: C.segGreen },
  { h1: 5.5,  h2: 6.0,  color: C.segRed   },
  { h1: 6.0,  h2: 11.0, color: C.segGreen },
  { h1: 11.0, h2: 12.0, color: C.segAmber },
  { h1: 12.0, h2: 16.0, color: C.segWhite },
  { h1: 16.0, h2: 19.0, color: C.segGreen },
  { h1: 19.0, h2: 20.5, color: C.segAmber },
  { h1: 20.5, h2: 22.0, color: C.segGreen },
  { h1: 22.0, h2: 24.0, color: C.segRed   },
];

export default function Dashboard() {
  // Live clock
  const [time, setTime] = useState('14:22');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(
          d.getMinutes(),
        ).padStart(2, '0')}`,
      );
    };
    fmt();
    const id = setInterval(fmt, 10000);
    return () => clearInterval(id);
  }, []);

  const [upperActive, setUpperActive] = useState('CALL');
  const [lowerActive, setLowerActive] = useState<string | null>(null);
  const [periodTab, setPeriodTab] = useState('DAILY');

  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });
  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBodyDims({ width, height });
  };

  return (
    <SafeAreaView style={s.root}>
      {/* ── Top app bar ── */}
      <View style={s.header}>
        <Text style={s.headerName}>FF M. HARVEY – SCFD</Text>
        <Text style={s.headerClock}>{time}</Text>
      </View>

      {/* ── Body ── */}
      <View style={s.body} onLayout={onBodyLayout}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          <View style={s.sidebarStack}>
            {UPPER_TABS.map((label) => {
              const active = label === upperActive;
              return (
                <TouchableOpacity
                  key={label}
                  style={[s.vtab, active && s.vtabActive]}
                  onPress={() => setUpperActive(label)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      s.vtabText,
                      active ? s.vtabTextActive : s.vtabTextDim,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={s.sidebarStackLower}>
            {LOWER_TABS.map((label) => {
              const active = label === lowerActive;
              return (
                <TouchableOpacity
                  key={label}
                  style={[s.vtab, active && s.vtabActive]}
                  onPress={() =>
                    setLowerActive((p) => (p === label ? null : label))
                  }
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      s.vtabText,
                      active ? s.vtabTextActive : s.vtabTextFaint,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Center */}
        <View style={s.center}>
          {/* Period tabs */}
          <View style={s.periodRow}>
            {['DAILY', 'LIFETIME', 'CUSTOM'].map((t, i) => {
              const active = t === periodTab;
              return (
                <TouchableOpacity
                  key={t}
                  style={[s.periodBtn, i < 2 && s.periodBtnBorder]}
                  onPress={() => setPeriodTab(t)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[s.periodText, active && s.periodTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Upper box — ZONE_STAT */}
          <View style={[s.metricBox, s.metricBoxCenter]}>
            <Text style={s.boxLabel}>ZONE_STAT</Text>
            <Text style={s.zoneNum}>4</Text>
          </View>

          {/* FAB gap */}
          <View style={s.fabGap} />

          {/* Lower box — TOTAL_MOVEMENT */}
          <View style={[s.metricBox, s.metricBoxBottom]}>
            <Text style={s.boxLabel}>TOTAL_MOVEMENT</Text>
            <Text style={s.totalNum}>5437</Text>
            <Text style={s.totalUnit}>STEPS</Text>
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
        <TouchableOpacity style={s.fab} activeOpacity={0.85}>
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom nav ── */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>♡</Text>
        </TouchableOpacity>
        <Text style={s.wordmark}>
          OHP<Text style={s.wordmarkDelta}>Δ</Text>H
        </Text>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>☰</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  header: {
    height: L.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
    backgroundColor: C.background,
  },
  headerName: {
    color: C.primary,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  headerClock: {
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },

  body: { flex: 1, flexDirection: 'row', overflow: 'hidden' },

  // Sidebar
  sidebar: {
    width: L.sidebarWidth,
    flexShrink: 0,
    alignItems: 'center',
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: C.outlineVariant,
    backgroundColor: C.surfaceLow,
  },
  sidebarStack: { alignItems: 'center', gap: 24 },
  sidebarStackLower: { alignItems: 'center', gap: 28, marginTop: 70 },
  vtab: {
    width: L.sidebarWidth,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vtabActive: { backgroundColor: C.primary, paddingVertical: 12 },
  vtabText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
    transform: [{ rotate: '-90deg' }],
  },
  vtabTextActive: { color: C.onPrimary, fontWeight: '700' },
  vtabTextDim: { color: C.outlineVariant },
  vtabTextFaint: { color: C.outline, opacity: 0.6 },

  // Center
  center: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 92, // clear the arc overlay on the right
    paddingTop: 4,
    paddingBottom: 10,
  },

  // Period tabs
  periodRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
    marginBottom: 24,
    flexShrink: 0,
  },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  periodBtnBorder: {
    borderRightWidth: 1,
    borderRightColor: C.outlineVariant,
  },
  periodText: {
    color: C.onSurfaceVariant,
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '500',
    letterSpacing: 1,
    opacity: 0.5,
  },
  periodTextActive: { color: C.primary, opacity: 1 },

  // Metric boxes
  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderStyle: 'dashed',
    position: 'relative',
  },
  metricBoxCenter: { alignItems: 'center', justifyContent: 'center' },
  metricBoxBottom: { justifyContent: 'flex-end', padding: 24 },
  boxLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    color: C.outlineVariant,
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  zoneNum: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontSize: 120,
    lineHeight: 124,
    color: C.primary,
    opacity: 0.9,
    includeFontPadding: false,
  },
  totalNum: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontSize: 64,
    lineHeight: 66,
    color: C.onSurface,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  totalUnit: {
    marginTop: 8,
    color: C.outlineVariant,
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },

  fabGap: { height: L.fabSize + 4, flexShrink: 0 },

  // FAB
  fab: {
    position: 'absolute',
    left: L.sidebarWidth - L.fabRadius,
    top: '50%',
    marginTop: -L.fabRadius,
    width: L.fabSize,
    height: L.fabSize,
    borderRadius: L.fabRadius,
    backgroundColor: C.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    color: C.onErrorContainer,
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
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
    backgroundColor: C.surfaceHighest,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: { color: C.onSurfaceVariant, fontSize: 20 },
  wordmark: {
    color: C.onSurface,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 6,
  },
  wordmarkDelta: { color: C.primary },
});
