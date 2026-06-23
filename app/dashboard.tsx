/**
 * OHPAH Dashboard — React Native implementation of V0-rendered design.
 *
 * Visual spec from reference image:
 *  - Sidebar tabs each have per-metric accent colors
 *  - Active period tab (Daily) has terracotta background
 *  - Numbers in warm terracotta / crimson
 *  - Arc with red/green/amber/white call-log segments
 *  - Bottom nav with cream OHPΔH wordmark
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
import ArcTimeline from '../components/ArcTimeline';

// ── Colors ────────────────────────────────────────────────
const C = {
  navy:        '#0C2747',
  white:       '#FFFFFF',
  cream:       '#F0E6C8',
  inkOnTab:    '#3A2A18',
  dimText:     'rgba(255,255,255,0.45)',
  border:      'rgba(0,0,0,0.25)',
  dashed:      'rgba(240,230,200,0.55)',
  terracotta:  '#B6452B',
  fabRed:      '#B6432A',

  // Tab accent colors from reference image
  tabSlate:    '#7B7466',  // Call
  tabTeal:     '#3FA3A1',  // Cal
  tabYellow:   '#E6B84A',  // Steps
  tabPink:     '#D88478',  // Heart
  tabOrange:   '#C77A2A',  // Calorie
};

const L = {
  sidebarWidth:    52,
  headerHeight:    52,
  bottomNavHeight: 64,
  fabSize:         58,
  fabRadius:       29,
};

// ── Tab definitions ───────────────────────────────────────
interface Tab {
  label: string;
  bg: string;
  ink: string;
}

const UPPER_TABS: Tab[] = [
  { label: 'FES',   bg: C.cream,     ink: C.inkOnTab },
  { label: 'WII',   bg: C.cream,     ink: C.inkOnTab },
  { label: 'Sleep', bg: C.cream,     ink: C.inkOnTab },
  { label: 'Call',  bg: C.tabSlate,  ink: C.cream },
];

const LOWER_TABS: Tab[] = [
  { label: 'Cal',     bg: C.tabTeal,   ink: C.cream },
  { label: 'Steps',   bg: C.tabYellow, ink: C.inkOnTab },
  { label: 'Heart',   bg: C.tabPink,   ink: C.cream },
  { label: 'Calorie', bg: C.tabOrange, ink: C.cream },
];

// Empty stale state — no metric values, no arc segments

// ── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
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

  const [periodTab, setPeriodTab] = useState('Daily');

  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });
  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBodyDims({ width, height });
  };

  return (
    <SafeAreaView style={s.root}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerName}>FF M. Harvey – SCFD</Text>
        <Text style={s.headerClock}>{time}</Text>
      </View>

      {/* ── Body ── */}
      <View style={s.body} onLayout={onBodyLayout}>

        {/* Left sidebar — tabs always show accent bg (reference image style) */}
        <View style={s.sidebar}>
          {UPPER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={[s.vtab, { backgroundColor: tab.bg }]}
              activeOpacity={0.75}
            >
              <Text style={[s.vtabText, { color: tab.ink }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={s.sidebarFabGap} />

          {LOWER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={[s.vtab, { backgroundColor: tab.bg }]}
              activeOpacity={0.75}
            >
              <Text style={[s.vtabText, { color: tab.ink }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Center */}
        <View style={s.center}>

          {/* Period tabs */}
          <View style={s.periodRow}>
            {['Daily', 'Lifetime', 'Custom'].map((t, i) => {
              const active = t === periodTab;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    s.periodBtn,
                    i < 2 && s.periodBtnBorder,
                    active && s.periodBtnActive,
                  ]}
                  onPress={() => setPeriodTab(t)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.periodText, active && s.periodTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Upper metric box — empty (stale) */}
          <View style={s.metricBox} />

          {/* FAB gap */}
          <View style={s.fabGap} />

          {/* Lower metric box — empty (stale) */}
          <View style={s.metricBox} />

        </View>

        {/* Arc timeline — plain white rail, no call segments */}
        {bodyDims.width > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ArcTimeline
              width={bodyDims.width}
              height={bodyDims.height}
            />
          </View>
        )}

        {/* FAB */}
        <TouchableOpacity style={s.fab} activeOpacity={0.8}>
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom nav ── */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>♡</Text>
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

  header: {
    height: L.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerName: {
    color: C.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerClock: {
    color: C.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

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
    height: L.fabSize + 16,
    flexShrink: 0,
  },
  vtab: {
    width: L.sidebarWidth,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vtabText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
  },

  // Center
  center: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 8,
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
    borderRadius: 2,
  },
  periodBtnBorder: {
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  periodBtnActive: {
    backgroundColor: C.terracotta,
    borderRadius: 3,
  },
  periodText: {
    color: C.dimText,
    fontSize: 13,
    fontWeight: '500',
  },
  periodTextActive: {
    color: C.white,
    fontWeight: '700',
  },

  // Metric boxes
  metricBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.dashed,
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'flex-end',
  },
  bigNum: {
    fontSize: 72,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.terracotta,
    lineHeight: 76,
    includeFontPadding: false,
  },
  metricLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    marginTop: 4,
  },

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
    backgroundColor: C.fabRed,
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
    color: C.white,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 36,
  },

  // Bottom nav
  bottomNav: {
    height: L.bottomNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.navy,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: C.cream,
    fontSize: 20,
  },
  wordmark: {
    color: C.cream,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
