import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Empty, ErrorText, Loading, Screen, ScreenHeader, SectionHeader, Still, stillFor, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/lib/auth';
import { listProjects, PHASES } from '@/lib/projects';
import { useAsync } from '@/lib/useAsync';
import { colors, radius, spacing } from '@/theme/tokens';

/** Collaborate · build crews */
export default function CollaborateScreen() {
  const { wide } = useLayout();
  const { userId } = useAuth();
  const projects = useAsync(listProjects, []);
  useFocusEffect(useCallback(() => { projects.reload(); }, [projects.reload]));

  const all = projects.data ?? [];
  const mine = all.filter((p) => p.owner === userId || p.roles.some((r) => r.member === userId));
  const open = all.filter((p) => !mine.includes(p) && p.roles.some((r) => !r.member));

  const card = (p: (typeof all)[number]) => {
    const filled = p.roles.filter((r) => r.member).length;
    return (
      <Pressable key={p.id} accessibilityRole="link" onPress={() => router.push(`/project/${p.id}`)} style={[styles.card, wide && { width: '48.5%' }]}>
        <Still name={stillFor(p.id)} uri={p.cover_url} ratio={2.39} position="top" />
        <View style={styles.body}>
          <Text variant="label" numberOfLines={1}>{[p.kind, PHASES[p.phase]].filter(Boolean).join(' · ')}</Text>
          <Text variant="title2" numberOfLines={1}>{p.title}</Text>
          <Text variant="caption">
            Crew {filled} of {p.roles.length}
            {p.dates ? ` · ${p.dates}` : ''}
            {p.roles.length - filled > 0 ? ` · ${p.roles.length - filled} open ${p.roles.length - filled === 1 ? 'role' : 'roles'}` : ''}
          </Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${p.roles.length ? (filled / p.roles.length) * 100 : 0}%` }]} /></View>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <View style={styles.head}>
        <View style={{ flex: 1 }}><ScreenHeader title="Collaborate" /></View>
        <Button label="New project" variant="gold" size="sm" onPress={() => router.push('/new-project')} />
      </View>
      {projects.loading && !projects.data ? (
        <Loading />
      ) : projects.error ? (
        <ErrorText>{projects.error}</ErrorText>
      ) : (
        <>
          <SectionHeader title="Your projects" />
          {mine.length === 0 ? (
            <Empty title="No projects yet" body="Start a project, list the roles you need, and invite creators to join your crew." action={<Button label="New project" variant="gold" size="sm" onPress={() => router.push('/new-project')} />} />
          ) : (
            <View style={styles.grid}>{mine.map(card)}</View>
          )}
          <SectionHeader title="Crews looking for people" />
          {open.length === 0 ? (
            <Text variant="caption">No open roles right now. Check back soon.</Text>
          ) : (
            <View style={styles.grid}>{open.map(card)}</View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: '100%', borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  body: { padding: spacing.md, gap: 6 },
  track: { height: 3, borderRadius: 2, backgroundColor: colors.surfaceRaised, overflow: 'hidden', marginTop: 4 },
  fill: { height: '100%', backgroundColor: colors.accent },
});
