import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Badge, Button, Screen, SectionHeader, Still, Tag, Text, VerifiedMark } from '@/components';
import { me } from '@/data/mock';
import { colors, spacing } from '@/theme/tokens';

/** Showcase · portafolio profesional */
export default function ShowcaseScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen edgeToEdgeTop>
      <Still name="ember" style={[styles.cover, { height: 220 + insets.top }]}>
        <View style={styles.letterbox} />
        <Text variant="data" style={styles.timecode}>{me.timecode}</Text>
        <View style={[styles.letterbox, styles.letterboxBottom]} />
      </Still>

      <View style={styles.profile}>
        <Avatar still={me.still} size={84} ring />
        <View>
          <View style={styles.nameRow}>
            <Text variant="title1" style={{ fontSize: 26 }}>{me.name}</Text>
            <VerifiedMark />
          </View>
          <Text variant="body" tone="secondary">{me.role} · {me.city}</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Conectar" doneLabel="Conectada" style={{ flex: 1 }} />
          <Button label="Mensaje" variant="ghost" />
        </View>
      </View>

      <View style={styles.stats}>
        {me.stats.map((s, i) => (
          <View key={s.label} style={[styles.stat, i > 0 && styles.statDivider]}>
            <Text variant="title2" style={{ fontVariant: ['tabular-nums'] }}>{s.value}</Text>
            <Text variant="caption" style={{ fontSize: 11 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Reel destacado" action="Ver todo" />
      <View style={{ gap: 10 }}>
        <ReelItem {...me.reel[0]} ratio={2.39} play />
        <View style={styles.grid2}>
          <ReelItem {...me.reel[1]} ratio={1} />
          <ReelItem {...me.reel[2]} ratio={1} />
        </View>
      </View>

      <SectionHeader title="Créditos" />
      <View>
        {me.credits.map((c) => (
          <View key={c.title} style={styles.credit}>
            <Text variant="caption" style={styles.year}>{c.year}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="callout">{c.title}</Text>
              <Text variant="caption">{c.role}</Text>
            </View>
            {c.highlight ? <Badge label={c.note} /> : <Text variant="caption">{c.note}</Text>}
          </View>
        ))}
      </View>

      <SectionHeader title="Equipo" />
      <View style={styles.kit}>
        {me.kit.map((k) => <Tag key={k} label={k} />)}
      </View>
    </Screen>
  );
}

function ReelItem({ title, meta, still, ratio, play }: (typeof me.reel)[number] & { ratio: number; play?: boolean }) {
  return (
    <Still name={still} ratio={ratio} scrim style={[styles.reel, ratio === 1 && { flex: 1 }]}>
      {play && (
        <View style={styles.playWrap}>
          <View style={styles.play}><Ionicons name="play" size={14} color={colors.textPrimary} /></View>
        </View>
      )}
      <View style={styles.reelCap}>
        <Text variant="caption" tone="primary" style={{ fontFamily: 'Inter_600SemiBold' }}>{title}</Text>
        <Text variant="caption" tone="primary" style={{ opacity: 0.8 }}>{meta}</Text>
      </View>
    </Still>
  );
}

const styles = StyleSheet.create({
  cover: { marginHorizontal: -spacing.lg, marginTop: -spacing.xs, justifyContent: 'flex-end' },
  letterbox: { position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: '#000' },
  letterboxBottom: { top: undefined, bottom: 0 },
  timecode: { position: 'absolute', right: spacing.lg, bottom: 34, fontSize: 10, color: 'rgba(245,245,245,0.7)', letterSpacing: 1.2 },
  profile: { gap: spacing.sm, marginTop: -64 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: spacing.xs },
  stats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statDivider: { borderLeftWidth: 1, borderColor: colors.line },
  grid2: { flexDirection: 'row', gap: 10 },
  reel: { borderRadius: 8, justifyContent: 'flex-end' },
  playWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  play: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(10,10,10,0.5)', borderWidth: 1, borderColor: 'rgba(245,245,245,0.4)', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
  reelCap: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.sm, paddingBottom: 10 },
  credit: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  year: { width: 40, fontVariant: ['tabular-nums'] },
  kit: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
