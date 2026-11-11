import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Button, Chips, Empty, ErrorText, Loading, Screen, ScreenHeader, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { timeAgo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { OPP_KINDS } from '@/lib/opportunities';
import { Application, must, Opportunity, supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

const FILTERS = ['All', 'Posted by me', ...OPP_KINDS];

/** Opportunities · jobs and projects */
export default function OpportunitiesScreen() {
  const { wide } = useLayout();
  const { userId } = useAuth();
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const data = useAsync(async () => {
    const opps = must(await supabase.from('opportunities').select('*').order('created_at', { ascending: false }).limit(200)) as Opportunity[];
    const apps = must(await supabase.from('applications').select('*')) as Application[];
    return { opps, apps };
  }, []);
  useFocusEffect(useCallback(() => { data.reload(); }, [data.reload]));

  const list = useMemo(() => {
    const opps = data.data?.opps ?? [];
    if (filter === 'All') return opps;
    if (filter === 'Posted by me') return opps.filter((o) => o.owner === userId);
    return opps.filter((o) => o.kind === filter);
  }, [data.data, filter, userId]);

  const toggleApply = async (o: Opportunity, applied: boolean) => {
    setBusy(o.id);
    setError(null);
    const { error: e } = applied
      ? await supabase.from('applications').delete().eq('opportunity', o.id).eq('applicant', userId!)
      : await supabase.from('applications').insert({ opportunity: o.id, applicant: userId });
    setBusy(null);
    if (e) setError(e.message);
    data.reload();
  };

  return (
    <Screen>
      <View style={styles.head}>
        <View style={{ flex: 1 }}><ScreenHeader title="Opportunities" /></View>
        <Button label="Post" variant="gold" size="sm" onPress={() => router.push('/new-opportunity')} />
      </View>
      <Chips label="Type of opportunity" options={FILTERS} onChange={setFilter} />
      <ErrorText>{error ?? data.error}</ErrorText>
      {data.loading && !data.data ? (
        <Loading />
      ) : list.length === 0 ? (
        <Empty
          title={filter === 'All' ? 'No opportunities yet' : 'Nothing here yet'}
          body={filter === 'All' ? 'Post the first job, grant or project. Creators can apply in one tap.' : 'Try another type, or post one yourself.'}
          action={<Button label="Post an opportunity" variant="gold" size="sm" onPress={() => router.push('/new-opportunity')} />}
        />
      ) : (
        <View style={styles.grid}>
          {list.map((o, i) => {
            const mine = o.owner === userId;
            const apps = data.data!.apps.filter((a) => a.opportunity === o.id);
            const applied = apps.some((a) => a.applicant === userId);
            const featured = i === 0 && filter === 'All';
            const facts = [
              { k: 'Rate', v: o.rate },
              { k: 'Dates', v: o.dates },
              { k: 'Type', v: o.kind },
            ].filter((f) => f.v);
            return (
              <Pressable
                key={o.id}
                accessibilityRole="link"
                onPress={() => router.push(`/opportunity/${o.id}`)}
                style={[styles.card, featured && styles.featured, wide && { width: featured ? '100%' : '48.5%' }]}>
                {featured && <LinearGradient colors={[colors.accentSoft, 'transparent']} locations={[0, 0.7]} style={StyleSheet.absoluteFill} />}
                <View style={styles.top}>
                  <View style={styles.logo}><Text variant="callout" style={{ fontFamily: fonts.bold }}>{(o.org || o.title).slice(0, 2).toUpperCase()}</Text></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="headline" style={{ fontSize: 16 }} numberOfLines={2}>{o.title}</Text>
                    <Text variant="caption" numberOfLines={1}>{[o.org, o.location].filter(Boolean).join(' · ')}</Text>
                  </View>
                </View>
                {facts.length > 0 && (
                  <View style={styles.facts}>
                    {facts.map((f) => (
                      <View key={f.k} style={{ flex: 1, gap: 2 }}>
                        <Text variant="label" style={{ fontSize: 10, letterSpacing: 1 }}>{f.k}</Text>
                        <Text variant="data" numberOfLines={1}>{f.v}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.foot}>
                  {mine ? (
                    <Badge label={`${apps.length} ${apps.length === 1 ? 'applicant' : 'applicants'}`} />
                  ) : (
                    <Text variant="caption">Posted {timeAgo(o.created_at)}</Text>
                  )}
                  {mine ? (
                    <Button label="Review" variant="ghost" size="sm" onPress={() => router.push(`/opportunity/${o.id}`)} />
                  ) : (
                    <Button
                      label={applied ? 'Applied' : 'Apply'}
                      done={applied}
                      variant={featured ? 'gold' : 'ghost'}
                      size="sm"
                      loading={busy === o.id}
                      onPress={() => toggleApply(o, applied)}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: '100%', padding: spacing.md, gap: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  featured: { borderColor: 'rgba(214,179,122,0.35)' },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  logo: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  facts: { flexDirection: 'row', gap: spacing.xs },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
