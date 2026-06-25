import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Image,
  Animated, Platform, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const shadow = (color: string, y: number, radius: number, opacity: number, elevation: number) =>
  Platform.OS === 'web'
    ? { boxShadow: `0px ${y}px ${radius}px rgba(${color},${opacity})` }
    : { shadowColor: `rgb(${color})`, shadowOffset: { width: 0, height: y }, shadowOpacity: opacity, shadowRadius: radius, elevation };

const S = {
  sm: shadow('77,168,218', 2,  6,  0.08, 2),
  md: shadow('77,168,218', 4,  14, 0.14, 5),
  lg: shadow('46,134,181', 8,  24, 0.18, 10),
};

const FEATURES: { icon: IoniconName; title: string; desc: string; grad: [string, string] }[] = [
  { icon: 'calendar-outline',   title: 'Attendance & Leaves', desc: 'Track attendance and manage leave requests', grad: ['#56CCF2', '#4DA8DA'] },
  { icon: 'chatbubble-outline', title: 'Team Collaboration',  desc: 'Connect and communicate with your team',    grad: ['#F9A8D4', '#EC4899'] },
  { icon: 'briefcase-outline',  title: 'Projects & Tasks',    desc: 'Organize work and track deadlines',         grad: ['#6EE7B7', '#34D399'] },
  { icon: 'wallet-outline',     title: 'Payroll & Expenses',  desc: 'Access payslips and expense claims',        grad: ['#FCD34D', '#FBBF24'] },
];

function FeatureCard({ item, index, cardWidth, isSmall }: { item: typeof FEATURES[0]; index: number; cardWidth: number; isSmall: boolean }) {
  const anim  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay: 300 + index * 100, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [index]);

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: Platform.OS !== 'web' }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: Platform.OS !== 'web' }).start();

  return (
    <Animated.View style={[styles.card, { width: cardWidth }, {
      opacity: anim,
      transform: [
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
        { scale },
      ],
    }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut} style={styles.cardInner}>
        <LinearGradient colors={item.grad} style={[styles.iconGrad, isSmall && { width: 38, height: 38, borderRadius: 12 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name={item.icon} size={isSmall ? 18 : 22} color="#fff" />
        </LinearGradient>
        <Text style={[styles.cardTitle, isSmall && { fontSize: 13 }]}>{item.title}</Text>
        <Text style={[styles.cardDesc, isSmall && { fontSize: 11 }]}>{item.desc}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router   = useRouter();
  const { width, height } = useWindowDimensions();
  const heroAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const isSmall   = width < 360;
  const isMedium  = width >= 360 && width < 400;
  const heroH     = height * (isSmall ? 0.38 : 0.42);
  const cardWidth = (width - (isSmall ? 44 : 52)) / 2;
  const hPad      = isSmall ? 14 : 20;
  const heroTitle = isSmall ? 22 : isMedium ? 25 : 28;
  const sectionFs = isSmall ? 18 : 22;

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }).start();
  }, []);

  const onBtnIn  = () => Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: Platform.OS !== 'web' }).start();
  const onBtnOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: Platform.OS !== 'web' }).start();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={['#56CCF2', '#4DA8DA']} style={[styles.hero, { height: heroH }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        <Animated.View style={[styles.heroContent, {
          opacity: heroAnim,
          transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{'Enterprise HR Platform'}</Text>
          </View>

          <View style={[styles.glassCard, S.lg, isSmall && { width: 66, height: 66, borderRadius: 20 }]}>
            <Image source={require('../../../assets/logo.png')} style={[styles.logo, isSmall && { width: 44, height: 44 }]} resizeMode="contain" />
          </View>

          <Text style={[styles.heroTitle, { fontSize: heroTitle }]}>{'MetroMindz HRMS'}</Text>
          <Text style={[styles.heroSubtitle, isSmall && { fontSize: 12 }]}>{'Smart Workforce Management Platform'}</Text>
        </Animated.View>

        <View style={styles.curve} />
      </LinearGradient>

      <ScrollView style={styles.sheet} contentContainerStyle={[styles.sheetContent, { paddingHorizontal: hPad }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { fontSize: sectionFs }]}>{'Everything in One Place'}</Text>
        <Text style={styles.sectionSub}>{'Tools your team needs every day'}</Text>

        <View style={styles.grid}>
          {FEATURES.map((f, i) => <FeatureCard key={i} item={f} index={i} cardWidth={cardWidth} isSmall={isSmall} />)}
        </View>

        <View style={[styles.ctaCard, S.sm]}>
          <Text style={[styles.ctaTitle, isSmall && { fontSize: 14 }]}>{'Ready to get started?'}</Text>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity activeOpacity={1} onPressIn={onBtnIn} onPressOut={onBtnOut} onPress={() => router.push('/auth/login' as any)}>
              <LinearGradient colors={['#56CCF2', '#4DA8DA']} style={[styles.ctaBtn, S.md]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[styles.ctaBtnText, isSmall && { fontSize: 13 }]}>{'Continue to Dashboard'}</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.footer}>{'Powered by MetroMindz © 2025'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6' },

  hero:  { overflow: 'hidden' },
  blob1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.10)', top: -100, right: -80 },
  blob2: { position: 'absolute', width: 180, height: 180, borderRadius: 90,  backgroundColor: 'rgba(255,255,255,0.07)', bottom: 20, left: -50 },

  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },

  badge:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  badgeText:{ fontSize: 11, fontWeight: '600', color: '#fff', letterSpacing: 0.4 },

  glassCard: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logo: { width: 54, height: 54 },

  heroTitle:    { fontWeight: '700', color: '#fff', textAlign: 'center', letterSpacing: -0.5, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 8 },

  curve: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 36, backgroundColor: '#F3F4F6', borderTopLeftRadius: 32, borderTopRightRadius: 32 },

  sheet:        { flex: 1, marginTop: -32 },
  sheetContent: { paddingTop: 28, paddingBottom: 40, backgroundColor: '#F3F4F6' },

  sectionTitle: { fontWeight: '700', color: '#163E57', marginBottom: 4, letterSpacing: -0.3 },
  sectionSub:   { fontSize: 13, color: '#5590B5', marginBottom: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },

  card:      { backgroundColor: '#fff', borderRadius: 20, ...S.md },
  cardInner: { padding: 16, gap: 10 },
  iconGrad:  { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#163E57', lineHeight: 20 },
  cardDesc:  { fontSize: 12, color: '#5590B5', lineHeight: 17 },

  ctaCard:    { backgroundColor: '#fff', borderRadius: 20, padding: 20, gap: 14, marginBottom: 20 },
  ctaTitle:   { fontSize: 16, fontWeight: '600', color: '#163E57', textAlign: 'center' },
  ctaBtn:     { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaBtnText: { fontSize: 15, fontWeight: '600', color: '#fff', letterSpacing: 0.2 },

  footer: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
});
