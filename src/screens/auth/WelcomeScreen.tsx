import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const { height } = Dimensions.get('window');

const features: { iconName: IoniconName; title: string; desc: string; color: string }[] = [
  { iconName: 'time-outline',        title: 'Attendance & Leaves',      desc: 'Clock in, apply leaves, view history',   color: Colors.primary },
  { iconName: 'chatbubbles-outline', title: 'Team Collaboration',        desc: 'Chat, discuss and share updates',        color: Colors.accent },
  { iconName: 'folder-open-outline', title: 'Projects & Tasks',          desc: 'Manage work and track deadlines',        color: Colors.success },
  { iconName: 'wallet-outline',      title: 'Payroll & Expenses',        desc: 'View payslips and submit expenses',      color: Colors.warning },
];



export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroCircle3} />

        <View style={styles.heroBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Enterprise HR Platform</Text>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logoRing}>
            <View style={styles.logoBox}>
              <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>
        </View>

        <Text style={styles.heroTitle}>MetroMindz{'\n'}HRMS</Text>
        <Text style={styles.heroSub}>Streamline your workforce management</Text>


      </View>

      {/* Sheet */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.pill} />

        <Text style={styles.sectionLabel}>EVERYTHING IN ONE PLACE</Text>
        <Text style={styles.headline}>Built for modern{'\n'}workplaces</Text>

        <View style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconBox, { backgroundColor: f.color + '15' }]}>
                <Ionicons name={f.iconName} size={20} color={f.color} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
            </View>
          ))}
        </View>

        <Button
          title="Sign In to Your Account"
          onPress={() => router.push('/auth/login')}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.primaryBtn}
          leftIcon={<Ionicons name="log-in-outline" size={18} color={Colors.white} />}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>Contact HR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.brandRow}>
          <View style={styles.brandDivider} />
          <Text style={styles.footerBrand}>Powered by MetroMindz © 2025</Text>
          <View style={styles.brandDivider} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },

  // Hero
  hero: {
    height: height * 0.42,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: 36,
    paddingHorizontal: Spacing[5],
  },
  heroCircle1: { position: 'absolute', width: 340, height: 340, borderRadius: 170, backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60 },
  heroCircle2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: -50 },
  heroCircle3: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)', top: 20, left: 30 },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 18,
    gap: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  badgeText: { fontSize: Typography.fontSize.xs, color: Colors.white, fontWeight: '600', letterSpacing: 0.5 },

  logoWrap: { marginBottom: 14 },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  logoImage: { width: 52, height: 52 },

  heroTitle: { fontSize: Typography.fontSize['3xl'], fontWeight: '800', color: Colors.white, textAlign: 'center', letterSpacing: -0.5, lineHeight: 36, marginBottom: 6 },
  heroSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 22 },



  // Sheet
  sheet: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -28 },
  sheetContent: { paddingHorizontal: Spacing[5], paddingTop: 20, paddingBottom: 36 },
  pill: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.gray200, alignSelf: 'center', marginBottom: 22 },

  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 1.5, marginBottom: 6 },
  headline: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.gray900, lineHeight: 34, marginBottom: 22, letterSpacing: -0.3 },

  // Features
  featureList: { marginBottom: 28, gap: 4 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  featureIconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  featureTextWrap: { flex: 1 },
  featureTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900, marginBottom: 2 },
  featureDesc: { fontSize: Typography.fontSize.xs, color: Colors.gray500, lineHeight: 16 },

  primaryBtn: { marginBottom: 16, borderRadius: Radius.lg },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  footerText: { fontSize: Typography.fontSize.sm, color: Colors.gray500 },
  footerLink: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '700' },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandDivider: { flex: 1, height: 1, backgroundColor: Colors.gray100 },
  footerBrand: { fontSize: Typography.fontSize.xs, color: Colors.gray400, textAlign: 'center' },
});
