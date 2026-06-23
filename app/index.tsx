/**
 * Splash screen — plays the OHPAH field-journal intro video full-screen,
 * fades a subtle wordmark over it, then transitions to the dashboard.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { COLORS as C, FONTS as F } from '../constants/theme';

const SPLASH_VIDEO = require('../assets/splash.mp4');
const MIN_DURATION = 3600; // ms before transitioning

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(1)).current;
  const wordmark = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(SPLASH_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    Animated.timing(wordmark, {
      toValue: 1,
      duration: 1200,
      delay: 500,
      useNativeDriver: true,
    }).start();

    const t = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => router.replace('/dashboard'));
    }, MIN_DURATION);

    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />

      {/* Subtle darkening so the wordmark reads over the footage */}
      <View style={styles.scrim} pointerEvents="none" />

      {/* Branding */}
      <Animated.View style={[styles.brand, { opacity: wordmark }]} pointerEvents="none">
        <Animated.Text style={styles.wordmark}>
          OHP{'\u0394'}H
        </Animated.Text>
        <Animated.Text style={styles.tagline}>Your Record. Always.</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.navyDeep },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,26,48,0.28)',
  },
  brand: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 80,
  },
  wordmark: {
    color: C.cream,
    fontSize: 46,
    fontFamily: F.display,
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    color: C.cream,
    fontSize: 16,
    fontFamily: F.serif,
    letterSpacing: 2,
    marginTop: 8,
    opacity: 0.9,
  },
});
