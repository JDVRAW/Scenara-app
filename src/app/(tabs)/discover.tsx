import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Chips, Empty, ErrorText, Loading, Screen, ScreenHeader, SectionHeader, Still, stillFor, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/lib/auth';
import { must, Profile, supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

const disciplines: { label: string; match: string[] }[] = [
  { label: 'All', match: [] },
  { label: 'Cinematography', match: ['cinematograph', 'dp', 'director of photography', 'camera'] },
  { label: 'Directing', match: ['direct'] },
  { label: 'Photography', match: ['photograph'] },
  { label: 'Color', match: ['color', 'colour', 'grade', 'grading'] },
  { label: 'Editing', match: ['edit'] },
  { label: 'Sound', match: ['sound', 'audio', 'mix'] },
  { label: 'Production', match: ['produc', 'gaffer', 'grip', 'art'] },
];

/** Discover · find creators */
export default function DiscoverScreen() {
  const { wide } = useLayout();
  const { userId } = useAuth();
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState('All');
  const people = useAsync(
    async () => must(await supabase.from('profiles').select('*').neq('name', '').order('created_at', { ascending: false }).limit(200)) as Profile[],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const d = disciplines.find((x) => x.label === discipline)!;
    return (people.data ?? [])
      .filter((p) => p.id !== userId)
      .filter((p) => !q || `${p.name} ${p.role} ${p.city} ${p.bio}`.toLowerCase().includes(q))
      .filter((p) => !d.match.length || d.match.some((m) => p.role.toLowerCase().includes(m)));
  }, [people.data, query, discipline, userId]);

  const featured = !query && discipline === 'All' ? filtered.find((p) => p.cover_url) ?? filtered[0] : undefined;
  const rest = filtered.filter((p) => p !== featured);

  return (
    <Screen>
      <ScreenHeader title="Discover" />
      <View style={[styles.search, wide && { maxWidth: 520 }]}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          id="discover-search"
          accessibilityLabel="Search creators"
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, craft or city"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>
      <Chips label="Disciplines" options={disciplines.map((d) => d.label)} onChange={setDiscipline} />

      {people.loading && !people.data ? (
        <Loading />
      ) : people.error ? (
        <ErrorText>{people.error}</ErrorText>
      ) : filtered.length === 0 ? (
        <Empty
          title={people.data && people.data.length <= 1 ? 'You’re one of the first' : 'No one matches yet'}
          body={people.data && people.data.length <= 1 ? 'Share the link with other creators. Their profiles will appear here as they join.' : 'Try another name, craft or city.'}
        />
      ) : (
        <>
          {featured && (
            <Pressable accessibilityRole="link" onPress={() => router.push(`/creator/${featured.id}`)}>
              <Still name={stillFor(featured.id)} uri={featured.cover_url} scrim position="top" style={[styles.feature, wide && { height: 340, padding: 32 }]}>
                <Text variant="label" tone="accent">Newest on SCENARA</Text>
                <Text variant="title1" style={{ fontSize: 22 }}>{featured.name}</Text>
                <Text variant="caption" tone="primary" style={{ opacity: 0.75 }} numberOfLines={2}>
                  {[featured.role, featured.city].filter(Boolean).join(' · ')}
                </Text>
              </Still>
            </Pressable>
          )}
          {rest.length > 0 && (
            <>
              <SectionHeader title={query || discipline !== 'All' ? `${filtered.length} ${filtered.length === 1 ? 'creator' : 'creators'}` : 'Creators'} />
              <View style={styles.grid}>
                {rest.map((c) => (
                  <Pressable key={c.id} accessibilityRole="link" onPress={() => router.push(`/creator/${c.id}`)} style={[styles.card, wide && { width: '23%' }]}>
                    <Still name={stillFor(c.id)} uri={c.avatar_url ?? c.cover_url} ratio={4 / 5} style={{ borderRadius: radius.sm }} />
                    <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{c.name}</Text>
                    <Text variant="caption" numberOfLines={1}>{[c.role, c.city].filter(Boolean).join(' · ') || 'Creator'}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  input: { flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 14, outlineStyle: 'none' } as never,
  feature: { height: 240, borderRadius: radius.md, justifyContent: 'flex-end', padding: 18, gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', flexGrow: 1, gap: 4, maxWidth: '50%' },
});
