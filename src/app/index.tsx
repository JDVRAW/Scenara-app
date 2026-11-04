import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Head } from 'expo-router/head';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Still, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { colors, fonts, radius, spacing, StillName } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const steps = [
  { n: '1', title: 'Build your showcase', body: 'Upload your reel, credits and gear. Your work leads, not your follower count.' },
  { n: '2', title: 'Get discovered, connect', body: 'Directors, DPs, editors and studios find you by craft, city and style.' },
  { n: '3', title: 'Team up and get hired', body: 'Join crews for real projects and apply to paid jobs, grants and commissions.' },
];

const features: { route: string; name: string; line: string; icon: IconName; still: StillName }[] = [
  { route: '/showcase', name: 'Showcase', line: 'A professional portfolio: reel, credits, festivals and gear.', icon: 'film-outline', still: 'ember' },
  { route: '/discover', name: 'Discover', line: 'Find creators by craft, city and visual style.', icon: 'compass-outline', still: 'fog' },
  { route: '/connect', name: 'Connect', line: 'Requests and direct messages with people in the industry.', icon: 'chatbubbles-outline', still: 'steel' },
  { route: '/collaborate', name: 'Collaborate', line: 'Form a crew, fill open roles and track the production.', icon: 'people-outline', still: 'dusk' },
  { route: '/opportunities', name: 'Opportunities', line: 'Paid jobs, grants and projects matched to your profile.', icon: 'star-outline', still: 'crimson' },
];

/** First page of the link: what SCENARA is, how it works, and its five functions. */
export default function Welcome() {
  const { wide } = useLayout();
  const insets = useSafeAreaInsets();
  const enter = () => router.replace('/showcase');

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: spacing.xxxl + insets.bottom }}>
      <Head>
        <title>SCENARA · The creative network for visual storytellers</title>
        <meta name="description" content="A place where visual talent gets discovered, connects and finds opportunities." />
      </Head>

      {/* Hero */}
      <Still name="velvet" scrim position="top" style={[styles.hero, { minHeight: (wide ? 640 : 560) + insets.top }]}>
        <View style={[styles.letterbox, { height: wide ? 44 : 28 }]} />
        <View style={[styles.heroInner, { paddingTop: insets.top + spacing.xl }, wide && styles.heroInnerWide]}>
          <Text style={[styles.wordmark, wide && { fontSize: 22 }]}>SCENARA</Text>
          <View style={{ gap: spacing.md, maxWidth: 720 }}>
            <Text variant="label" tone="accent">The creative network for visual storytellers</Text>
            <Text variant="display" style={[styles.headline, wide && { fontSize: 64, lineHeight: 68 }]}>
              Where visual talent gets discovered.
            </Text>
            <Text variant="body" style={styles.lede}>
              SCENARA brings cinematographers, directors, photographers, editors and colorists together in one place, to show their work, meet each other and find their next project.
            </Text>
            <View style={styles.ctaRow}>
              <Pressable accessibilityRole="button" onPress={enter} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}>
                <Text variant="callout" tone="onAccent" style={{ fontFamily: fonts.semibold, fontSize: 15 }}>Enter SCENARA</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.onAccent} />
              </Pressable>
              <Text variant="caption">Prototype · sample creators and projects</Text>
            </View>
          </View>
        </View>
      </Still>

      <View style={[styles.body, wide && styles.bodyWide]}>
        {/* How it works */}
        <View style={styles.section}>
          <Text variant="label">How it works</Text>
          <Text variant="title1">Three steps from your reel to your next job.</Text>
          <View style={[styles.steps, wide && { flexDirection: 'row' }]}>
            {steps.map((s) => (
              <View key={s.n} style={[styles.step, wide && { flex: 1 }]}>
                <Text style={styles.stepNum}>{s.n}</Text>
                <Text variant="headline" style={{ fontSize: 17 }}>{s.title}</Text>
                <Text variant="body" tone="secondary">{s.body}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Five functions */}
        <View style={styles.section}>
          <Text variant="label">What you can do</Text>
          <Text variant="title1">Five spaces, one network.</Text>
          <View style={styles.grid}>
            {features.map((f) => (
              <Pressable
                key={f.name}
                accessibilityRole="link"
                onPress={() => router.replace(f.route as never)}
                style={({ pressed }) => [styles.card, wide && { width: '31.5%' }, pressed && { opacity: 0.85 }]}>
                <Still name={f.still} ratio={2.39} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTitle}>
                    <Ionicons name={f.icon} size={18} color={colors.accent} />
                    <Text variant="headline" style={{ fontSize: 17 }}>{f.name}</Text>
                  </View>
                  <Text variant="body" tone="secondary" style={{ fontSize: 14, lineHeight: 20 }}>{f.line}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Closing */}
        <View style={[styles.closing, wide && { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
          <View style={{ gap: 6, flexShrink: 1 }}>
            <Text variant="title2">Your work deserves a better stage.</Text>
            <Text variant="body" tone="secondary">Cinematic, minimal and built around the creator.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={enter} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}>
            <Text variant="callout" tone="onAccent" style={{ fontFamily: fonts.semibold, fontSize: 15 }}>Enter SCENARA</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.onAccent} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  hero: { justifyContent: 'flex-end' },
  letterbox: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.background },
  heroInner: { flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl + 28, gap: spacing.xxl },
  heroInnerWide: { paddingHorizontal: spacing.xxxl, paddingBottom: spacing.xxxl + 44, maxWidth: 1280, width: '100%', alignSelf: 'center' },
  wordmark: { fontFamily: fonts.display, fontWeight: '600', fontSize: 18, letterSpacing: 7, color: colors.textPrimary },
  headline: { fontSize: 42, lineHeight: 46 },
  lede: { color: 'rgba(245,245,245,0.8)', fontSize: 16, lineHeight: 24, maxWidth: 560 },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  cta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, height: 48, paddingHorizontal: 22, borderRadius: radius.pill, backgroundColor: colors.accent, alignSelf: 'flex-start' },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, gap: spacing.xxxl },
  bodyWide: { paddingHorizontal: spacing.xxxl, maxWidth: 1280, width: '100%', alignSelf: 'center' },
  section: { gap: spacing.md },
  steps: { gap: spacing.md, marginTop: spacing.xs },
  step: { gap: spacing.xs, paddingTop: spacing.md, borderTopWidth: 1, borderColor: colors.lineStrong },
  stepNum: { fontFamily: fonts.display, fontWeight: '600', fontSize: 28, color: colors.accent, fontVariant: ['tabular-nums'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xs },
  card: { width: '100%', flexGrow: 1, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  cardBody: { padding: spacing.md, gap: 6 },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  closing: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.accentBorder, backgroundColor: colors.accentSoft },
});
