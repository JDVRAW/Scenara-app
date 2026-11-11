import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Empty, ErrorText, Loading, Screen, ScreenHeader, SectionHeader, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { conversations, getProfiles, myConnections, otherSide, timeAgo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Connect · requests, your network and messages */
export default function ConnectScreen() {
  const { wide } = useLayout();
  const { userId } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const data = useAsync(async () => {
    if (!userId) return null;
    const [conns, convos] = await Promise.all([myConnections(userId), conversations(userId)]);
    const people = await getProfiles([...conns.map((c) => otherSide(c, userId)), ...convos.map((c) => c.other)]);
    return { conns, convos, people };
  }, [userId]);

  useFocusEffect(useCallback(() => { data.reload(); }, [data.reload]));

  const respond = async (id: string, accept: boolean) => {
    setBusyId(id);
    setError(null);
    const { error: e } = accept
      ? await supabase.from('connections').update({ status: 'accepted' }).eq('id', id)
      : await supabase.from('connections').delete().eq('id', id);
    setBusyId(null);
    if (e) setError(e.message);
    data.reload();
  };

  if (!data.data) return <Screen><ScreenHeader title="Connect" />{data.error ? <ErrorText>{data.error}</ErrorText> : <Loading />}</Screen>;

  const { conns, convos, people } = data.data;
  const incoming = conns.filter((c) => c.status === 'pending' && c.addressee === userId);
  const sent = conns.filter((c) => c.status === 'pending' && c.requester === userId);
  const network = conns.filter((c) => c.status === 'accepted');

  return (
    <Screen>
      <ScreenHeader title="Connect" />
      <ErrorText>{error}</ErrorText>
      <View style={[styles.cols, wide && styles.colsWide]}>
        <View style={[styles.col, wide && { flexGrow: 0, flexShrink: 0, flexBasis: 380 }]}>
          <SectionHeader title={`Requests · ${incoming.length}`} />
          {incoming.length === 0 ? (
            <Text variant="caption">No new requests.{sent.length ? ` You have ${sent.length} waiting for a reply.` : ''}</Text>
          ) : (
            <View style={{ gap: spacing.xs }}>
              {incoming.map((c) => {
                const p = people[c.requester];
                return (
                  <View key={c.id} style={styles.req}>
                    <Pressable onPress={() => router.push(`/creator/${c.requester}`)}><Avatar uri={p?.avatar_url} id={c.requester} /></Pressable>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{p?.name ?? 'Creator'}</Text>
                      <Text variant="caption" numberOfLines={1}>{[p?.role, p?.city].filter(Boolean).join(' · ')}</Text>
                    </View>
                    <Button label="Decline" variant="ghost" size="sm" onPress={() => respond(c.id, false)} disabled={busyId === c.id} />
                    <Button label="Accept" variant="gold" size="sm" onPress={() => respond(c.id, true)} loading={busyId === c.id} />
                  </View>
                );
              })}
            </View>
          )}

          <SectionHeader title={`Your network · ${network.length}`} />
          {network.length === 0 ? (
            <Empty title="No connections yet" body="Find creators in Discover and send them a request." action={<Button label="Open Discover" size="sm" onPress={() => router.push('/discover')} />} />
          ) : (
            <View>
              {network.map((c) => {
                const id = otherSide(c, userId!);
                const p = people[id];
                return (
                  <Pressable key={c.id} onPress={() => router.push(`/creator/${id}`)} style={styles.row}>
                    <Avatar uri={p?.avatar_url} id={id} size={36} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{p?.name ?? 'Creator'}</Text>
                      <Text variant="caption" numberOfLines={1}>{p?.role}</Text>
                    </View>
                    <Button label="Message" variant="ghost" size="sm" onPress={() => router.push(`/chat/${id}`)} />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={[styles.col, wide && { flex: 1 }]}>
          <SectionHeader title="Messages" />
          {convos.length === 0 ? (
            <Empty title="No messages yet" body="Open any creator’s profile and tap Message to start a conversation." />
          ) : (
            <View>
              {convos.map((c) => {
                const p = people[c.other];
                return (
                  <Pressable key={c.other} accessibilityRole="link" onPress={() => router.push(`/chat/${c.other}`)} style={styles.row}>
                    <Avatar uri={p?.avatar_url} id={c.other} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{p?.name ?? 'Creator'}</Text>
                      <Text variant="caption" numberOfLines={1} tone={c.unread ? 'primary' : 'secondary'}>
                        {c.last.sender === userId ? 'You: ' : ''}{c.last.body}
                      </Text>
                    </View>
                    <View style={styles.meta}>
                      <Text variant="caption" style={{ fontSize: 11 }}>{timeAgo(c.last.created_at)}</Text>
                      {c.unread > 0 && <View style={styles.dot} accessibilityLabel={`${c.unread} unread`} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cols: { gap: 22 },
  colsWide: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xxl },
  col: { gap: 12, minWidth: 0 },
  req: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: 12, borderRadius: radius.md, backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  meta: { alignItems: 'flex-end', gap: 6, alignSelf: 'flex-start', paddingTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
