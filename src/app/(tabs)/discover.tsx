import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Chips, Screen, ScreenHeader, SectionHeader, Still, Text } from '@/components';
import { creators, disciplines } from '@/data/mock';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Discover · descubrir creadores */
export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const featured = creators[1];
  const nearby = creators.slice(2).filter((c) =>
    `${c.name} ${c.role} ${c.city}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Screen>
      <ScreenHeader title="Descubrir" icon="options-outline" iconLabel="Filtros" />
      <View style={styles.search}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Busca por oficio, ciudad o estilo"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>
      <Chips label="Disciplinas" options={disciplines} />

      <Still name={featured.still} scrim style={styles.feature}>
        <Text variant="label" tone="accent">Creador de la semana</Text>
        <Text variant="title1" style={{ fontSize: 22 }}>{featured.name}</Text>
        <Text variant="caption" tone="primary" style={{ opacity: 0.75 }}>
          {featured.role} · {featured.city} · 3 cortos en festivales este año
        </Text>
      </Still>

      <SectionHeader title="En tendencia cerca de ti" action="Mapa" />
      <View style={styles.grid}>
        {nearby.map((c) => (
          <View key={c.id} style={styles.card}>
            <Still name={c.still} ratio={4 / 5} style={{ borderRadius: radius.sm }} />
            <Text variant="callout" style={{ fontFamily: fonts.semibold }}>{c.name}</Text>
            <Text variant="caption">{c.role} · {c.city}</Text>
          </View>
        ))}
        {nearby.length === 0 && <Text variant="body" tone="secondary">Nadie coincide con “{query}”.</Text>}
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
