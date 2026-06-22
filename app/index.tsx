/**
 * Splash → Transition → Dashboard
 *
 * Phase 1: splash.mp4 loops while the app "loads"
 *          SplashOverlay fades in on top with brand mark + wordmark + tagline
 * Phase 2: transition.mp4 plays once (pole bends into dashboard arc)
 * Phase 3: navigate to /dashboard
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { router } from 'expo-router';
import SplashOverlay from '../components/SplashOverlay';

type Phase = 'splash' | 'transition';

// Match these to actual video durations.
const SPLASH_DURATION = 3400;
const TRANSITION_DURATION = 4800;

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('splash');
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  // Phase 1 → 2
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

  // Phase 2 → 3
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
          <>
            <VideoView
              player={splashPlayer}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              nativeControls={false}
            />
            {/* Brand overlay fades in 400ms after video starts */}
            <SplashOverlay entranceDelay={400} />
          </>
        ) : (
          <VideoView
            player={transPlayer}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
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
    backgroundColor: '#051424',
  },
});
