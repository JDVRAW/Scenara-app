import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Empty, ErrorText, FormPage, Loading, Text } from '@/components';
import { getProfiles, timeAgo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Application, must, Opportunity, supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export default function OpportunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const data = useAsync(async () => {
    const o = must(await supabase.from('opportunities').select('*').eq('id', id).maybeSingle()) as Opportunity | null;
    if (!o) return null;
    const apps = must(await supabase.from('applications').select('*').eq('opportunity', id).order('created_at', { ascending: false })) as Application[];
    const people = await getProfiles([o.owner, ...apps.map((a) => a.applicant)]);
    return { o, apps, people };
  }, [id]);

  if (data.loading && !data.data) return <FormPage fallback="/opportunities"><Loading /></FormPage>;
  if (!data.data)
    return (
      <FormPage fallback="/opportunities">
        <Empty title="Opportunity not found" body="It may have been closed by the person who posted it." />
      </FormPage>
    );

  const { o, apps, people } = data.data;
  const mine = o.owner === userId;
  const applied = apps.some((a) => a.applicant === userId);
  const poster = people[o.owner];

  const toggle = async () => {
    setBusy(true);
    setError(null);
    const { error: e } = applied
      ? await supabase.from('applications').delete().eq('opportunity', o.id).eq('applicant', userId!)
      : await supabase.from('applications').insert({ opportunity: o.id, applicant: userId });
    setBusy(false);
    if (e) setError(e.message);
    data.reload();
  };

  const facts = [
    { k: 'Type', v: o.kind },
    { k: 'Rate', v: o.rate },
    { k: 'Dates', v: o.dates },
    { k: 'Location', v: o.location },
  ].filter((f) => f.v);

  return (
    <FormPage fallback="/opportunities" maxWidth={760}>
      <View style={{ gap: 6 }}>
        <Text variant="label">{o.org || 'Opportunity'}</Text>
        <Text variant="title1">{o.title}</Text>
        <Pressable onPress={() => router.push(`/creator/${o.owner}`)} style={styles.owner}>
          <Avatar uri={poster?.avatar_url} id={o.owner} size={24} />
          <Text variant="caption">Posted by <Text variant="caption" tone="primary" style={{ fontFamily: fonts.semibold }}>{poster?.name ?? 'Creator'}</Text> · {timeAgo(o.created_at)}</Text>
        </Pressable>
      </View>
      {facts.length > 0 && (
        <View style={styles.facts}>
          {facts.map((f) => (
            <View key={f.k} style={styles.fact}>
              <Text variant="label" style={{ fontSize: 10, letterSpacing: 1 }}>{f.k}</Text>
              <Text variant="data">{f.v}</Text>
            </View>
          ))}
        </View>
      )}
      {!!o.description && <Text variant="body">{o.description}</Text>}
      <ErrorText>{error}</ErrorText>

      {mine ? (
        <View style={{ gap: spacing.xs }}>
          <Text variant="headline">Applicants · {apps.length}</Text>
          {apps.length === 0 ? (
            <Text variant="caption">No one has applied yet. Share the opportunity with your network.</Text>
          ) : (
            apps.map((a) => {
              const p = people[a.applicant];
              return (
                <View key={a.id} style={styles.applicant}>
                  <Pressable onPress={() => router.push(`/creator/${a.applicant}`)} style={[styles.owner, { flex: 1 }]}>
                    <Avatar uri={p?.avatar_url} id={a.applicant} size={36} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{p?.name ?? 'Creator'}</Text>
                      <Text variant="caption" numberOfLines={1}>{[p?.role, p?.city].filter(Boolean).join(' · ')} · applied {timeAgo(a.created_at)}</Text>
                    </View>
                  </Pressable>
                  <Button label="Message" variant="ghost" size="sm" onPress={() => router.push(`/chat/${a.applicant}`)} />
                </View>
              );
            })
          )}
          {confirmDelete ? (
            <View style={styles.danger}>
              <Text variant="callout" style={{ flex: 1 }}>Close this opportunity? Applicants will no longer see it.</Text>
              <Button label="Cancel" variant="ghost" size="sm" onPress={() => setConfirmDelete(false)} />
              <Button
                label="Close it"
                variant="danger"
                size="sm"
                onPress={async () => {
                  await supabase.from('opportunities').delete().eq('id', o.id);
                  router.replace('/opportunities');
                }}
              />
            </View>
          ) : (
            <Button label="Close opportunity" variant="danger" onPress={() => setConfirmDelete(true)} />
          )}
        </View>
      ) : (
        <View style={styles.actions}>
          <Button label={applied ? 'Applied' : 'Apply now'} done={applied} variant="gold" loading={busy} onPress={toggle} style={{ flex: 1 }} />
          <Button label="Message" variant="ghost" onPress={() => router.push(`/chat/${o.owner}`)} />
        </View>
      )}
      {!mine && applied && <Text variant="caption">Tap Applied to withdraw. {poster?.name?.split(' ')[0] ?? 'The poster'} can see your profile and showcase.</Text>}
    </FormPage>
  );
}

const styles = StyleSheet.create({
  owner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface },
  fact: { minWidth: 120, flex: 1, gap: 2 },
  applicant: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  actions: { flexDirection: 'row', gap: spacing.xs },
  danger: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(230,110,90,0.4)', marginTop: spacing.md },
});
