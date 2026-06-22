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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, LAYOUT } from '../constants/theme';
import ArcTimeline, { ArcSegment } from '../components/ArcTimeline';
import MetricBox from '../components/MetricBox';

// ── Types ──────────────────────────────────────────────
interface SidebarTab {
  label: string;
  inverted?: boolean; // white bg + dark text = active state
}

// ── Static data ────────────────────────────────────────
// Single left sidebar: OHPAH metrics above FAB, HealthKit below
const UPPER_TABS: SidebarTab[] = [
  { label: 'FES' },
  { label: 'WII' },
  { label: 'Sleep' },
  { label: 'Call', inverted: true },
];

const LOWER_TABS: SidebarTab[] = [
  { label: 'Cal' },
  { label: 'Steps', inverted: true },
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
      {/* ── Deep gradient background ── */}
      <LinearGradient
        colors={['#051424', '#091b32', '#06162a', '#051424']}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      />
      {/* Subtle crimson ambient at center */}
      <View style={styles.ambientGlow} />

      {/* ── Header ── */}
      <BlurView intensity={18} tint="dark" style={styles.header}>
        <Text style={styles.headerName}>FF M. Harvey – SCFD</Text>
        <Text style={styles.headerClock}>{time}</Text>
      </BlurView>

      {/* ── Body ── */}
      <View style={styles.body} onLayout={onBodyLayout}>

        {/* Left sidebar — OHPAH tabs above FAB, HealthKit tabs below */}
        <View style={[styles.sidebar, styles.leftSidebar]}>
          {UPPER_TABS.map((tab) => (
            <View
              key={tab.label}
              style={[styles.vtabWrap, tab.inverted && styles.vtabInverted]}
            >
              {tab.inverted && (
                <LinearGradient
                  colors={['rgba(127,29,29,0.75)', 'rgba(80,10,10,0.5)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Text style={[styles.vtabText, tab.inverted && styles.vtabTextInverted]}>
                {tab.label}
              </Text>
            </View>
          ))}
          <View style={styles.sidebarFabGap} />
          {LOWER_TABS.map((tab) => (
            <View
              key={tab.label}
              style={[styles.vtabWrap, tab.inverted && styles.vtabInverted]}
            >
              {tab.inverted && (
                <LinearGradient
                  colors={['rgba(127,29,29,0.75)', 'rgba(80,10,10,0.5)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
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

        {/* FAB — multi-ring crimson glow */}
        <View style={styles.fabGlowOuter} pointerEvents="none" />
        <View style={styles.fabGlowMiddle} pointerEvents="none" />
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom nav — glass ── */}
      <BlurView intensity={22} tint="dark" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>🔖</Text>
        </TouchableOpacity>
        <Text style={styles.wordmark}>OHPΔH</Text>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>☰</Text>
        </TouchableOpacity>
      </BlurView>

    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  // Background ambient glow
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '30%',
    left: '10%',
    backgroundColor: 'transparent',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 120,
  },

  // Header
  header: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,228,250,0.1)',
    // BlurView handles background
    backgroundColor: 'transparent',
  },
  headerName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'JetBrainsMono_500Medium',
  },
  headerClock: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    fontFamily: 'JetBrainsMono_500Medium',
  },

  // Body
  body: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  // Sidebar
  sidebar: {
    width: LAYOUT.sidebarWidth,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftSidebar: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  sidebarFabGap: {
    height: LAYOUT.fabSize + 8,
    flexShrink: 0,
  },
  vtabWrap: {
    width: LAYOUT.sidebarWidth,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vtabInverted: {
    // gradient applied inline; just set border glow
    borderWidth: 1,
    borderColor: 'rgba(127,29,29,0.45)',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  vtabText: {
    color: COLORS.dimText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
    fontFamily: 'JetBrainsMono_500Medium',
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

  // FAB glow rings
  fabGlowOuter: {
    position: 'absolute',
    left: LAYOUT.sidebarWidth - LAYOUT.fabRadius - 22,
    top: '50%',
    marginTop: -(LAYOUT.fabRadius + 22),
    width: LAYOUT.fabSize + 44,
    height: LAYOUT.fabSize + 44,
    borderRadius: LAYOUT.fabRadius + 22,
    backgroundColor: 'transparent',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    zIndex: 9,
  },
  fabGlowMiddle: {
    position: 'absolute',
    left: LAYOUT.sidebarWidth - LAYOUT.fabRadius - 10,
    top: '50%',
    marginTop: -(LAYOUT.fabRadius + 10),
    width: LAYOUT.fabSize + 20,
    height: LAYOUT.fabSize + 20,
    borderRadius: LAYOUT.fabRadius + 10,
    backgroundColor: 'rgba(127,29,29,0.18)',
    zIndex: 9,
  },
  fab: {
    position: 'absolute',
    left: LAYOUT.sidebarWidth - LAYOUT.fabRadius,
    top: '50%',
    marginTop: -LAYOUT.fabRadius,
    width: LAYOUT.fabSize,
    height: LAYOUT.fabSize,
    borderRadius: LAYOUT.fabRadius,
    backgroundColor: COLORS.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 12,
  },
  fabIcon: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
  },

  // Bottom nav — glass
  bottomNav: {
    height: LAYOUT.bottomNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,228,250,0.10)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
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
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 3,
    fontFamily: 'HankenGrotesk_800ExtraBold',
  },
});
