/**
 * MetricBox — glassmorphism panel
 *
 * numberPosition="top"    → number above tiles (OHPAH box, always visible)
 * numberPosition="bottom" → tiles above number (HealthKit box, tap to reveal)
 */
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

export interface Metric {
  key: string;
  label: string;
  value: string;
}

interface Props {
  metrics: Metric[];
  activeKey: string | null;
  activeMetric: Metric | null;
  numberPosition: 'top' | 'bottom';
  onSelect: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

export default function MetricBox({
  metrics,
  activeKey,
  activeMetric,
  numberPosition,
  onSelect,
  style,
}: Props) {
  const tileRow = (
    <View style={styles.tileRow}>
      {metrics.map((m) => {
        const isActive = m.key === activeKey;
        return (
          <TouchableOpacity
            key={m.key}
            style={[styles.tile, isActive && styles.tileActive]}
            onPress={() => onSelect(m.key)}
            activeOpacity={0.7}
          >
            {isActive && (
              <LinearGradient
                colors={['rgba(127,29,29,0.55)', 'rgba(127,29,29,0.2)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={[styles.tileText, isActive && styles.tileTextActive]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const numberDisplay = activeMetric ? (
    <View style={styles.numDisplay}>
      <Text style={styles.bigNum}>{activeMetric.value}</Text>
      <Text style={styles.metricLabel}>{activeMetric.label}</Text>
    </View>
  ) : (
    <View style={styles.numDisplay} />
  );

  return (
    <View style={[styles.boxOuter, style]}>
      {/* Glass background */}
      <LinearGradient
        colors={['rgba(28,43,60,0.72)', 'rgba(12,28,49,0.88)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      {/* Top-left highlight edge — simulates light source */}
      <View style={styles.highlightEdge} />

      <View style={styles.boxInner}>
        {numberPosition === 'top' ? (
          <>
            {numberDisplay}
            {tileRow}
          </>
        ) : (
          <>
            {tileRow}
            {numberDisplay}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxOuter: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,228,250,0.13)',
    overflow: 'hidden',
    // Glass depth shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  boxInner: {
    flex: 1,
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  // Simulated top-left light edge
  highlightEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(212,228,250,0.28)',
  },

  // Number display
  numDisplay: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  bigNum: {
    fontSize: 68,
    fontWeight: '700',
    fontStyle: 'italic',
    color: COLORS.crimson,
    lineHeight: 72,
    includeFontPadding: false,
    // Crimson glow
    textShadowColor: 'rgba(127,29,29,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.white,
    marginTop: 4,
    opacity: 0.85,
  },

  // Tile row
  tileRow: {
    flexDirection: 'row',
    gap: 5,
    flexShrink: 0,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: 'rgba(212,228,250,0.12)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tileActive: {
    borderColor: 'rgba(127,29,29,0.6)',
  },
  tileText: {
    color: 'rgba(212,228,250,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tileTextActive: {
    color: COLORS.white,
  },
});
