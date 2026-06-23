/**
 * OHPAH — Field Journal Dashboard
 * Faithful port of the vintage reference: aged-paper frame, weathered-navy
 * card, serif type, colour-coded sidebar tabs, terracotta period tabs, two
 * dashed metric boxes, red-orange FAB, engraved 24h cream arc, OHPΔH footer.
 */
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArcTimeline from '../components/ArcTimeline';
import { COLORS as C, FONTS as F, LAYOUT as L } from '../constants/theme';

const PAPER = require('../assets/textures/paper.png');
const NAVY = require('../assets/textures/navy-card.png');

// Sidebar tabs: [label, color, selected?]
const UPPER_TABS: { label: string; color: string }[] = [
  { label: 'FES', color: C.tabCream },
  { label: 'WII', color: C.tabCream },
  { label: 'Sleep', color: C.tabCream },
  { label: 'Call', color: C.tabGrey },
];
const LOWER_TABS: { label: string; color: string }[] = [
  { label: 'Cal', color: C.tabTeal },
  { label: 'Steps', color: C.tabYellow },
  { label: 'Heart', color: C.tabCoral },
  { label: 'Calorie', color: C.tabOrange },
];

export default function Dashboard() {
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

  const [selectedTab, setSelectedTab] = useState('Call');
  const [periodTab, setPeriodTab] = useState('Daily');

  const [bodyDims, setBodyDims] = useState({ width: 0, height: 0 });
  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBodyDims({ width, height });
  };

  const renderTab = ({ label, color }: { label: string; color: string }) => {
    const selected = label === selectedTab;
    return (
      <TouchableOpacity
        key={label}
        activeOpacity={0.8}
        onPress={() => setSelectedTab(label)}
        style={[
          s.vtab,
          { backgroundColor: color },
          selected && s.vtabSelected,
        ]}
      >
        <Text style={s.vtabText} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={PAPER} style={s.paper} resizeMode="cover">
      <SafeAreaView style={s.safe}>
        <ImageBackground source={NAVY} style={s.card} imageStyle={s.cardImg} resizeMode="cover">
          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerName}>FF M. Harvey - SCFD</Text>
            <Text style={s.headerClock}>{time}</Text>
          </View>
          <View style={s.headerRule} />

          {/* Body */}
          <View style={s.body} onLayout={onBodyLayout}>
            {/* Arc (behind) */}
            {bodyDims.width > 0 && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <ArcTimeline width={bodyDims.width} height={bodyDims.height} />
              </View>
            )}

            {/* Center content */}
            <View style={s.center}>
              {/* Period tabs */}
              <View style={s.periodRow}>
                {['Daily', 'Lifetime', 'Custom'].map((t) => {
                  const active = t === periodTab;
                  return (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.8}
                      onPress={() => setPeriodTab(t)}
                      style={[s.periodBtn, active ? s.periodBtnActive : s.periodBtnIdle]}
                    >
                      <Text style={[s.periodText, active ? s.periodTextActive : s.periodTextIdle]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Upper dashed box */}
              <View style={s.dashBox} />

              {/* Gap for FAB */}
              <View style={s.fabGap} />

              {/* Lower dashed box */}
              <View style={s.dashBox} />
            </View>

            {/* Sidebar */}
            <View style={s.sidebar} pointerEvents="box-none">
              <View style={s.tabGroup}>{UPPER_TABS.map(renderTab)}</View>
              <View style={s.tabGroup}>{LOWER_TABS.map(renderTab)}</View>
            </View>

            {/* FAB */}
            <TouchableOpacity style={s.fab} activeOpacity={0.85}>
              <Text style={s.fabIcon}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom nav */}
          <View style={s.bottomRule} />
          <View style={s.bottomNav}>
            <TouchableOpacity style={s.navBtn}>
              <Text style={s.navIcon}>{'\u2691'}</Text>
            </TouchableOpacity>
            <Text style={s.wordmark}>
              OHP<Text style={s.wordmarkDelta}>{'\u0394'}</Text>H
            </Text>
            <TouchableOpacity style={s.navBtn}>
              <Text style={s.navIcon}>{'\u2630'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  paper: { flex: 1 },
  safe: { flex: 1, padding: L.framePadding },

  card: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: C.cream,
    overflow: 'hidden',
  },
  cardImg: { borderRadius: 3 },

  // Header
  header: {
    height: L.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerName: {
    color: C.cream,
    fontSize: 20,
    fontFamily: F.display,
  },
  headerClock: {
    color: C.cream,
    fontSize: 20,
    fontFamily: F.display,
  },
  headerRule: {
    height: 2,
    marginHorizontal: 8,
    backgroundColor: C.cream,
    opacity: 0.8,
  },

  body: { flex: 1, position: 'relative' },

  // Center content (clears sidebar on left, arc on right)
  center: {
    flex: 1,
    marginLeft: L.sidebarWidth + 6,
    marginRight: 96,
    paddingTop: 10,
    paddingBottom: 10,
  },

  // Period tabs
  periodRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  periodBtnActive: { backgroundColor: C.terracotta },
  periodBtnIdle: { backgroundColor: C.tabCream },
  periodText: { fontSize: 15, fontFamily: F.serifBold },
  periodTextActive: { color: C.onTerracotta },
  periodTextIdle: { color: C.inkOnCream },

  // Dashed metric boxes
  dashBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: C.dashedBorder,
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  fabGap: { height: L.fabSize + 8 },

  // Sidebar
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: L.sidebarWidth,
    justifyContent: 'space-between',
  },
  tabGroup: { gap: 12 },
  vtab: {
    width: L.sidebarWidth,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  vtabSelected: { width: L.sidebarWidth + 8 },
  vtabText: {
    color: C.inkOnCream,
    fontSize: 14,
    fontFamily: F.serifBold,
    transform: [{ rotate: '-90deg' }],
    width: 60,
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    left: 2,
    top: '50%',
    marginTop: -L.fabRadius,
    width: L.fabSize,
    height: L.fabSize,
    borderRadius: L.fabRadius,
    backgroundColor: C.fabRed,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    color: C.onTerracotta,
    fontSize: 40,
    fontWeight: '400',
    lineHeight: 44,
  },

  // Bottom nav
  bottomRule: {
    height: 2,
    marginHorizontal: 8,
    backgroundColor: C.cream,
    opacity: 0.8,
  },
  bottomNav: {
    height: L.bottomNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: C.cream, fontSize: 22 },
  wordmark: {
    color: C.cream,
    fontSize: 30,
    fontFamily: F.display,
    letterSpacing: 4,
  },
  wordmarkDelta: { color: C.cream, fontFamily: F.display },
});
