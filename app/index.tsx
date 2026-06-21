/**
 * Splash → Transition → Dashboard
 *
 * Phase 1: splash.mp4 loops while the app "loads"
 * Phase 2: transition.mp4 plays once (pole bends into dashboard)
 * Phase 3: navigate to /dashboard
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { router } from 'expo-router';

type Phase = 'splash' | 'transition';

// How long to show the splash before moving to transition (ms).
// Set to match one full loop of splash.mp4.
const SPLASH_DURATION = 3400;

// How long the transition video plays before navigating (ms).
// Set to match the length of transition.mp4.
const TRANSITION_DURATION = 4800;

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('splash');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ── Video players ──
  const splashPlayer = useVideoPlayer(
    require('../assets/splash.mp4'),
    (p) => {
      p.loop = true;
      p.muted = true;
      p.play();
    },
  );

  const transPlayer = useVideoPlayer(
    require('../assets/transition.mp4'),
    (p) => {
      p.loop = false;
      p.muted = true;
    },
  );

  // ── Phase 1 → 2: after one splash loop ──
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setPhase('transition');
        fadeAnim.setValue(1);
        transPlayer.play();
      });
    }, SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  // ── Phase 2 → 3: after transition video ends ──
  useEffect(() => {
    if (phase !== 'transition') return;
    const t = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => router.replace('/dashboard'));
    }, TRANSITION_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        {phase === 'splash' ? (
          <VideoView
            player={splashPlayer}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            nativeControls={false}
          />
        ) : (
          <VideoView
            player={transPlayer}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            nativeControls={false}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1929',
  },
});
