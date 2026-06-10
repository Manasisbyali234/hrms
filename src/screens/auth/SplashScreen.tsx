import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../design-system/tokens';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(taglineAnim, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/auth/welcome');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background gradient circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoBox}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.brandName}>MetroMindz</Text>
        <Text style={styles.brandSub}>HRMS Platform</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineWrap, { opacity: taglineAnim }]}>
        <Text style={styles.tagline}>Empowering your workforce</Text>
        <Text style={styles.taglineSub}>with smart HR solutions</Text>
      </Animated.View>

      {/* Bottom bar */}
      <View style={styles.footer}>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingFill, { transform: [{ scaleX: opacityAnim }] }]} />
        </View>
        <Text style={styles.version}>v2.0.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 100,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: height * 0.2,
    left: -40,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  logoImage: { width: 74, height: 74 },
  brandName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  taglineWrap: {
    alignItems: 'center',
    marginTop: 60,
  },
  tagline: {
    fontSize: Typography.fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  taglineSub: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 60,
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingFill: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 2,
    transformOrigin: 'left',
  },
  version: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },
});
