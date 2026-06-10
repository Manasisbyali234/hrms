import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, ScrollView, Image,
  Animated, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Shadow } from '../../design-system/tokens';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const { width, height } = Dimensions.get('window');

const FEATURES: { icon: IoniconName; title: string; desc: string; grad: [string, string] }[] = [
  { icon: 'calendar-outline',     title: 'Attendance & Leaves',  desc: 'Track attendance and manage leave requests',     grad: ['#56CCF2', '#4DA8DA'] },
  { icon: 'chatbubble-outline',   title: 'Team Collaboration',   desc: 'Connect and communicate with your team',         grad: ['#F9A8D4', '#EC4899'] },
  { icon: 'briefcase-outline',    title: 'Projects & Tasks',     desc: 'Organize work and track deadlines',              grad: ['#6EE7B7', '#34D399'] },
  { icon: 'wallet-outline',       title: 'Payroll & Expenses',   desc: 'Access payslips and expense claims',             grad: ['#FCD34D', '#FBBF24'] },
];

function FeatureCard({ item, index }: { item: typeof FEATURES[0]; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: 300 + index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[
      styles.card,
      {
        opacity: anim,
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
          { scale },
        ],
      },
    ]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut} style={styles.cardInner}>
            <LinearGradient colors={item.grad} style={styles.iconGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name={item.icon} size={22} color="#fff" />
        </LinearGradient>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const heroAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const onBtnIn  = () => Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true }).start();
  const onBtnOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Hero ── */}
      <LinearGradient colors={['#56CCF2', '#4DA8DA']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* decorative blobs */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        <Animated.View style={[styles.heroContent, {
          opacity: heroAnim,
          transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          {/* badge */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Enterprise HR Platform</Text>
          </View>

          {/* glassmorphism logo card */}
          <View style={styles.glassCard}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.heroTitle}>MetroMindz HRMS</Text>
          <Text style={styles.heroSubtitle}>Smart Workforce Management Platform</Text>
          <Text style={styles.heroDesc}>
            Manage attendance, payroll, collaboration, projects and employee engagement from one place.
          </Text>
        </Animated.View>

        {/* curved bottom */}
        <View style={styles.curve} />
      </LinearGradient>

      {/* ── Content Sheet ── */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* section header */}
        <Text style={styles.sectionTitle}>Everything in One Place</Text>
        <Text style={styles.sectionSub}>Tools your team needs every day</Text>

        {/* 2-column grid */}
        <View style={styles.grid}>
          {FEATURES.map((f, i) => <FeatureCard key={i} item={f} index={i} />)}
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={onBtnIn}
              onPressOut={onBtnOut}
              onPress={() => router.push('/auth/login')}
            >
              <LinearGradient colors={['#56CCF2', '#4DA8DA']} style={styles.ctaBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.ctaBtnText}>Continue to Dashboard</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.footer}>Powered by MetroMindz © 2025</Text>
      </ScrollView>
    </View>
  );
}

const HERO_H = height * 0.42;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EEF6FC' },

  // Hero
  hero: { height: HERO_H, overflow: 'hidden' },
  blob1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.10)', top: -100, right: -80 },
  blob2: { position: 'absolute', width: 180, height: 180, borderRadius: 90,  backgroundColor: 'rgba(255,255,255,0.07)', bottom: 20, left: -50 },

  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 32 : 48, paddingBottom: 48 },

  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#fff', letterSpacing: 0.4 },

  // glassmorphism logo card
  glassCard: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    ...Shadow.lg,
  },
  logo: { width: 54, height: 54 },

  heroTitle:    { fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center', letterSpacing: -0.5, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 8 },
  heroDesc:     { fontSize: 13, color: 'rgba(255,255,255,0.70)', textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },

  // curved separator
  curve: {
    position: 'absolute', bottom: -1, left: 0, right: 0, height: 36,
    backgroundColor: '#EEF6FC',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },

  // Sheet
  sheet: { flex: 1, marginTop: -32 },
  sheetContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40, backgroundColor: '#EEF6FC' },

  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#163E57', marginBottom: 4, letterSpacing: -0.3 },
  sectionSub:   { fontSize: 13, color: '#5590B5', marginBottom: 20 },

  // 2-col grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },

  card: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    ...Shadow.md,
  },
  cardInner: { padding: 16, gap: 10 },
  iconGrad: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#163E57', lineHeight: 20 },
  cardDesc:  { fontSize: 12, color: '#5590B5', lineHeight: 17 },

  // CTA
  ctaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    gap: 14,
    ...Shadow.sm,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E4F5',
  },
  ctaTitle: { fontSize: 16, fontWeight: '600', color: '#163E57', textAlign: 'center' },
  ctaBtn: {
    height: 52, borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    ...Shadow.md,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '600', color: '#fff', letterSpacing: 0.2 },

  footer: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
});
