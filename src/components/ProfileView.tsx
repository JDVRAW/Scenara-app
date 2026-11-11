import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayout } from '@/hooks/useLayout';
import { connectionWith, countConnections, listWorks } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Connection, must, Profile, supabase, Work } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { Avatar, stillFor } from './Avatar';
import { Tag } from './Badge';
import { Button } from './Button';
import { Empty, ErrorText, Loading } from './Form';
import { Screen, SectionHeader } from './Screen';
import { Still } from './Still';
import { Text } from './Text';

/** A creator's portfolio. `isMe` turns on editing. */
export function ProfileView({ profile, isMe, header }: { profile: Profile; isMe: boolean; header?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { wide } = useLayout();
  const { userId, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const works = useAsync(() => listWorks(profile.id), [profile.id]);
  const stats = useAsync(() => countConnections(profile.id), [profile.id]);
  const link = useAsync(
    async () => (userId && !isMe ? connectionWith(userId, profile.id) : null),
    [userId, profile.id, isMe],
  );

  const connect = async () => {
    if (!userId) return;
    setBusy(true);
    setError(null);
    try {
      const c = link.data;
      if (!c) {
        const row = must(await supabase.from('connections').insert({ requester: userId, addressee: profile.id }).select().single()) as Connection;
        link.setData(row);
      } else if (c.status === 'pending' && c.addressee === userId) {
        must(await supabase.from('connections').update({ status: 'accepted' }).eq('id', c.id).select().single());
        link.reload();
        stats.reload();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const removeWork = async (w: Work) => {
    await supabase.from('works').delete().eq('id', w.id);
    works.reload();
  };

  const c = link.data;
  const connectLabel = !c ? 'Connect' : c.status === 'accepted' ? 'Connected' : c.requester === userId ? 'Requested' : 'Accept request';
  const connectDone = !!c && (c.status === 'accepted' || c.requester === userId);
  const list = works.data ?? [];
  const [lead, ...rest] = list;

  return (
    <Screen edgeToEdgeTop>
      <Still
        name={stillFor(profile.id)}
        uri={profile.cover_url}
        style={[styles.cover, { height: (wide ? 340 : 220) + insets.top }, wide && styles.coverWide]}>
        <View style={styles.letterbox} />
        <View style={[styles.letterbox, styles.letterboxBottom]} />
        {header && <View style={[styles.headerSlot, { top: insets.top + 36 }]}>{header}</View>}
      </Still>

      <View style={[styles.profile, wide && { paddingHorizontal: spacing.lg }]}>
        <Avatar uri={profile.avatar_url} id={profile.id} size={84} ring />
        <View style={{ gap: 2 }}>
          <Text variant="title1" style={{ fontSize: 26 }}>{profile.name || 'Unnamed creator'}</Text>
          <Text variant="body" tone="secondary">{[profile.role, profile.city].filter(Boolean).join(' · ') || 'Craft and city not added yet'}</Text>
        </View>
        {!!profile.bio && <Text variant="body" style={{ maxWidth: 640 }}>{profile.bio}</Text>}
        <View style={[styles.actions, wide && { maxWidth: 480 }]}>
          {isMe ? (
            <>
              <Button label="Edit profile" onPress={() => router.push('/edit-profile')} style={{ flex: 1 }} />
              <Button label="Add work" variant="gold" onPress={() => router.push('/new-work')} />
              {!wide && <Button label="Log out" variant="ghost" onPress={signOut} />}
            </>
          ) : (
            <>
              <Button label={connectLabel} done={connectDone} loading={busy} onPress={connect} style={{ flex: 1 }} disabled={connectDone} />
              <Button label="Message" variant="ghost" onPress={() => router.push(`/chat/${profile.id}`)} />
            </>
          )}
        </View>
        <ErrorText>{error}</ErrorText>
      </View>

      <View style={styles.stats}>
        <Stat value={list.length} label="Works" />
        <Stat value={stats.data ?? 0} label="Connections" divider />
        <Stat value={profile.kit.length} label="Gear" divider />
      </View>

      <SectionHeader title="Showcase" />
      {works.loading && !works.data ? (
        <Loading />
      ) : works.error ? (
        <ErrorText>{works.error}</ErrorText>
      ) : !lead ? (
        <Empty
          title={isMe ? 'Your showcase is empty' : 'No work yet'}
          body={isMe ? 'Add your first piece: a still, a reel link and your credit.' : `${profile.name || 'This creator'} hasn’t added work yet.`}
          action={isMe ? <Button label="Add work" variant="gold" onPress={() => router.push('/new-work')} /> : undefined}
        />
      ) : (
        <View style={{ gap: 10 }}>
          <WorkCard work={lead} ratio={2.39} isMe={isMe} onRemove={removeWork} />
          {rest.length > 0 && (
            <View style={styles.grid}>
              {rest.map((w) => (
                <View key={w.id} style={[styles.gridItem, wide && { width: '32%' }]}>
                  <WorkCard work={w} ratio={1} isMe={isMe} onRemove={removeWork} />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {list.length > 0 && (
        <>
          <SectionHeader title="Credits" />
          <View>
            {list.map((w) => (
              <View key={w.id} style={styles.credit}>
                <Text variant="caption" style={styles.year}>{w.year ?? '—'}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="callout">{w.title}</Text>
                  <Text variant="caption">{[w.credit, w.kind].filter(Boolean).join(' · ')}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {profile.kit.length > 0 && (
        <>
          <SectionHeader title="Gear" />
          <View style={styles.kit}>{profile.kit.map((k) => <Tag key={k} label={k} />)}</View>
        </>
      )}
    </Screen>
  );
}

function Stat({ value, label, divider }: { value: number; label: string; divider?: boolean }) {
  return (
    <View style={[styles.stat, divider && styles.statDivider]}>
      <Text variant="title2" style={{ fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text variant="caption" style={{ fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function WorkCard({ work, ratio, isMe, onRemove }: { work: Work; ratio: number; isMe: boolean; onRemove: (w: Work) => void }) {
  return (
    <Still name={stillFor(work.id)} uri={work.image_url} ratio={ratio} scrim style={styles.reel}>
      {!!work.video_url && (
        <Pressable accessibilityRole="link" accessibilityLabel={`Play ${work.title}`} onPress={() => Linking.openURL(work.video_url!)} style={styles.playWrap}>
          <View style={styles.play}><Ionicons name="play" size={14} color={colors.textPrimary} /></View>
        </Pressable>
      )}
      {isMe && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${work.title}`} onPress={() => onRemove(work)} style={styles.remove}>
          <Ionicons name="trash-outline" size={14} color={colors.textPrimary} />
        </Pressable>
      )}
      <View style={styles.reelCap}>
        <Text variant="caption" tone="primary" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{work.title}</Text>
        <Text variant="caption" tone="primary" style={{ opacity: 0.8 }} numberOfLines={1}>{[work.kind, work.year].filter(Boolean).join(' · ')}</Text>
      </View>
    </Still>
  );
}

const styles = StyleSheet.create({
  cover: { marginHorizontal: -spacing.lg, marginTop: -spacing.xs },
  coverWide: { marginHorizontal: 0, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md },
  letterbox: { position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: '#000' },
  letterboxBottom: { top: undefined, bottom: 0 },
  headerSlot: { position: 'absolute', left: spacing.lg, right: spacing.lg },
  profile: { gap: spacing.sm, marginTop: -64 },
  actions: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  stats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  statDivider: { borderLeftWidth: 1, borderColor: colors.line },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '48.5%', flexGrow: 1 },
  reel: { borderRadius: radius.sm, justifyContent: 'flex-end' },
  playWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  play: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(10,10,10,0.5)', borderWidth: 1, borderColor: 'rgba(245,245,245,0.4)', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
  remove: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(10,10,10,0.6)', alignItems: 'center', justifyContent: 'center' },
  reelCap: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs, padding: spacing.sm, paddingBottom: 10 },
  credit: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  year: { width: 40, fontVariant: ['tabular-nums'] },
  kit: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
