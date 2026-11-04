import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Chips, Screen, ScreenHeader, SectionHeader, Still, Text } from '@/components';
import { creators, disciplines } from '@/data/mock';
import { useLayout } from '@/hooks/useLayout';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Discover · find creators */
export default function DiscoverScreen() {
  const { wide } = useLayout();
  const [query, setQuery] = useState('');
  const featured = creators[1];
  const nearby = creators.slice(2).filter((c) =>
    `${c.name} ${c.role} ${c.city}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Screen>
      <ScreenHeader title="Discover" icon="options-outline" iconLabel="Filters" />
      <View style={[styles.search, wide && { maxWidth: 520 }]}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by craft, city or style"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>
      <Chips label="Disciplines" options={disciplines} />

      <Still name={featured.still} scrim style={[styles.feature, wide && { height: 340, padding: 32 }]}>
        <Text variant="label" tone="accent">Creator of the week</Text>
        <Text variant="title1" style={{ fontSize: 22 }}>{featured.name}</Text>
        <Text variant="caption" tone="primary" style={{ opacity: 0.75 }}>
          {featured.role} · {featured.city} · 3 festival shorts this year
        </Text>
      </Still>

      <SectionHeader title="Trending near you" action="Map" />
      <View style={styles.grid}>
        {nearby.map((c) => (
          <View key={c.id} style={[styles.card, wide && { width: '23%' }]}>
            <Still name={c.still} ratio={4 / 5} style={{ borderRadius: radius.sm }} />
            <Text variant="callout" style={{ fontFamily: fonts.semibold }}>{c.name}</Text>
            <Text variant="caption">{c.role} · {c.city}</Text>
          </View>
        ))}
        {nearby.length === 0 && <Text variant="body" tone="secondary">No one matches “{query}”.</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  input: { flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 14, outlineStyle: 'none' } as never,
  feature: { height: 240, borderRadius: radius.md, justifyContent: 'flex-end', padding: 18, gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', flexGrow: 1, gap: 4 },
});
