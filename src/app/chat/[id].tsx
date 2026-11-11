import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, BackHeader, ErrorText, Loading, Text } from '@/components';
import { getProfile, timeAgo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Message, must, supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId, ready, session } = useAuth();
  const other = useAsync(() => getProfile(id), [id]);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    if (!userId || !id) return;
    let alive = true;
    const load = async () => {
      try {
        const rows = must(
          await supabase
            .from('messages')
            .select('*')
            .or(`and(sender.eq.${userId},recipient.eq.${id}),and(sender.eq.${id},recipient.eq.${userId})`)
            .order('created_at', { ascending: true })
            .limit(500),
        ) as Message[];
        if (alive) setMessages(rows);
        await supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('sender', id).eq('recipient', userId).is('read_at', null);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      }
    };
    load();
    const channel = supabase
      .channel(`chat-${userId}-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient=eq.${userId}` }, (payload) => {
        const m = payload.new as Message;
        if (m.sender !== id) return;
        setMessages((prev) => (prev && !prev.some((x) => x.id === m.id) ? [...prev, m] : prev));
        supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', m.id);
      })
      .subscribe();
    // fallback refresh in case realtime is off
    const timer = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [userId, id]);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 50);
  }, [messages?.length]);

  if (ready && !session) return <Redirect href="/login" />;
  if (id === userId) return <Redirect href="/connect" />;

  const send = async () => {
    const body = draft.trim();
    if (!body || !userId) return;
    setSending(true);
    setError(null);
    const { data, error: e } = await supabase.from('messages').insert({ sender: userId, recipient: id, body }).select().single();
    setSending(false);
    if (e) return setError(e.message);
    setDraft('');
    setMessages((prev) => [...(prev ?? []), data as Message]);
  };

  const p = other.data;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.header}>
          <BackHeader
            fallback="/connect"
            title={undefined}
            right={
              <Pressable accessibilityRole="link" onPress={() => router.push(`/creator/${id}`)} style={styles.who}>
                <Avatar uri={p?.avatar_url} id={id} size={36} />
                <View style={{ minWidth: 0 }}>
                  <Text variant="callout" style={{ fontFamily: fonts.semibold }} numberOfLines={1}>{p?.name ?? '…'}</Text>
                  <Text variant="caption" numberOfLines={1}>{p?.role}</Text>
                </View>
              </Pressable>
            }
          />
        </View>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={styles.thread}>
          {!messages ? (
            <Loading />
          ) : messages.length === 0 ? (
            <Text variant="caption" style={{ textAlign: 'center', paddingVertical: spacing.xl }}>
              Say hello to {p?.name ?? 'this creator'}. Messages are only visible to the two of you.
            </Text>
          ) : (
            messages.map((m) => {
              const mine = m.sender === userId;
              return (
                <View key={m.id} style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
                  <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                    <Text variant="body" tone={mine ? 'onAccent' : 'primary'} style={{ fontSize: 15 }}>{m.body}</Text>
                    <Text variant="caption" style={{ fontSize: 10, alignSelf: 'flex-end', color: mine ? 'rgba(10,10,10,0.6)' : colors.textSecondary }}>
                      {timeAgo(m.created_at)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        <ErrorText>{error}</ErrorText>
        <View style={styles.composer}>
          <TextInput
            id="chat-input"
            accessibilityLabel="Message"
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            multiline
            onKeyPress={(e) => {
              const ev = e.nativeEvent as unknown as { key: string; shiftKey?: boolean };
              if (ev.key === 'Enter' && !ev.shiftKey) {
                (e as unknown as { preventDefault?: () => void }).preventDefault?.();
                send();
              }
            }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={send} disabled={sending || !draft.trim()} style={[styles.send, (!draft.trim() || sending) && { opacity: 0.4 }]}>
            <Ionicons name="arrow-up" size={18} color={colors.onAccent} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line, width: '100%', maxWidth: 760, alignSelf: 'center' },
  who: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  thread: { padding: spacing.lg, gap: 8, width: '100%', maxWidth: 760, alignSelf: 'center' },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.lg, gap: 2 },
  mine: { backgroundColor: colors.accent, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.surface, borderBottomLeftRadius: 6 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, padding: spacing.sm, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderColor: colors.line, width: '100%', maxWidth: 760, alignSelf: 'center' },
  input: { flex: 1, minHeight: 44, maxHeight: 140, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, outlineStyle: 'none' } as never,
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
