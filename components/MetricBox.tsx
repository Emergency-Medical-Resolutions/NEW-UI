/**
 * MetricBox
 *
 * Dashed-border box used for both OHPAH and HealthKit metric regions.
 *
 * numberPosition="top"    → large number above the tile row (OHPAH box)
 *   - Active metric number is always visible; default = first tile.
 *
 * numberPosition="bottom" → large number below the tile row (HealthKit box)
 *   - Number is hidden until the user taps a tile.
 *
 * Tile behaviour:
 *   - Default: navy background, white text, dashed border
 *   - Active:  white background, navy text (inverted)
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
            activeOpacity={0.75}
          >
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
    // Placeholder keeps layout stable when nothing is selected (lower box)
    <View style={styles.numDisplay} />
  );

  return (
    <View style={[styles.box, style]}>
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
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: COLORS.dashedBorder,
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  // Number display
  numDisplay: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  bigNum: {
    fontSize: 64,
    fontWeight: '700',
    fontStyle: 'italic',
    color: COLORS.crimson,
    lineHeight: 68,
    includeFontPadding: false,
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.white,
    marginTop: 4,
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
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: COLORS.dashedBorder,
    borderRadius: 4,
  },
  tileActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  tileText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tileTextActive: {
    color: COLORS.navy,
  },
});
