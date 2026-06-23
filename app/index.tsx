/**
 * Splash screen — static "Tactical Medical Interface" branded screen.
 * Faithful port of .stitch/designs/splash-screen.html:
 *   deep navy (#051424) base · crimson + white atmospheric glows · vignette ·
 *   Δ brand mark · OHPAH wordmark · "Your Record. Always." tagline
 * Displays briefly, then fades into the dashboard.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import SplashOverlay from '../components/SplashOverlay';
import { COLORS as C } from '../constants/theme';

const HOLD_DURATION = 3200; // ms on screen before transition

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => router.replace('/dashboard'));
    }, HOLD_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        {/* Atmospheric glows (behind branding) */}
        <View style={styles.crimsonGlow} pointerEvents="none" />
        <View style={styles.whiteGlow} pointerEvents="none" />

        {/* Branding */}
        <SplashOverlay entranceDelay={250} />

        {/* Vignette for the tactical, military feel */}
        <View style={styles.vignette} pointerEvents="none" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background, // #051424
    alignItems: 'center',
    justifyContent: 'center',
  },
  crimsonGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 320,
    height: 320,
    marginLeft: -160,
    marginTop: -160,
    borderRadius: 160,
    backgroundColor: 'transparent',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 110,
  },
  whiteGlow: {
    position: 'absolute',
    top: '46%',
    left: '50%',
    width: 220,
    height: 220,
    marginLeft: -110,
    marginTop: -110,
    borderRadius: 110,
    backgroundColor: 'transparent',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 70,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: '#000',
    // Inset-like darkening at the edges via a large inner shadow approximation
    backgroundColor: 'transparent',
  },
});
