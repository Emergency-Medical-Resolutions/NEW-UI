/**
 * SplashOverlay
 *
 * Transparent overlay rendered on top of the splash video.
 * Design system: Tactical Medical Interface (Stitch / project 5907006008518696965)
 *
 * Brand tokens:
 *   Background:  #051424  (surface-dim)
 *   On-surface:  #d4e4fa
 *   Crimson glow: #7f1d1d (tertiary-container)
 *   Wordmark font: Hanken Grotesk 800, 0.2em tracking
 *   Tagline font:  Source Serif 4 400
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export interface SplashOverlayProps {
  /** Delay before the entrance animation starts, in ms */
  readonly entranceDelay?: number;
}

/** OΔ brand mark — delta triangle inside a thin circle */
function BrandMark() {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
      {/* Outer circle */}
      <Circle cx={48} cy={48} r={46} stroke="#d4e4fa" strokeWidth={1.5} />
      {/* Delta triangle Δ — filled white */}
      <Path
        d="M48 18 L74 68 L22 68 Z"
        fill="#d4e4fa"
        stroke="#d4e4fa"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SplashOverlay({
  entranceDelay = 400,
}: SplashOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, entranceDelay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
      pointerEvents="none"
    >
      {/* Crimson radial glow */}
      <View style={styles.crimsonGlow} />
      <View style={styles.whiteGlow} />

      {/* Brand mark */}
      <BrandMark />

      {/* Wordmark */}
      <Text style={styles.wordmark}>OHPAH</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Your Record. Always.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Subtle dark crimson radial glow behind the mark */
  crimsonGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'transparent',
    // iOS
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 80,
    // Android
    elevation: 0,
  },
  whiteGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'transparent',
    shadowColor: '#d4e4fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 50,
    elevation: 0,
  },
  wordmark: {
    marginTop: 24,
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
    color: '#d4e4fa',
    textTransform: 'uppercase',
  },
  tagline: {
    marginTop: 12,
    fontFamily: 'SourceSerif4_400Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(212, 228, 250, 0.55)',
    letterSpacing: 1,
  },
});
