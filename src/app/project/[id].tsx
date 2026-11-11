import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Button, Empty, ErrorText, FormPage, Loading, Still, stillFor, Text } from '@/components';
import { getProfiles } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getProject, PHASES } from '@/lib/projects';
import { ProjectRole, supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const data = useAsync(async () => {
    const d = await getProject(id);
    if (!d) return null;
    const people = await getProfiles([d.project.owner, ...d.roles.map((r) => r.member ?? ''), ...d.requests.map((q) => q.applicant)]);
    return { ...d, people };
  }, [id]);

  const run = async (key: string, fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setBusy(key);
    setError(null);
    const { error: e } = await fn();
    setBusy(null);
    if (e) setError(e.message);
    data.reload();
  };

  if (data.loading && !data.data) return <FormPage fallback="/collaborate"><Loading /></FormPage>;
  if (!data.data)
    return (
      <FormPage fallback="/collaborate">
        <Empty title="Project not found" body="It may have been deleted by its owner." />
      </FormPage>
    );

  const { project: p, roles, requests, people } = data.data;
  const isOwner = p.owner === userId;
  const owner = people[p.owner];
  const filled = roles.filter((r) => r.member).length;
  const iAmIn = roles.some((r) => r.member === userId);

  const accept = (role: ProjectRole, applicant: string) =>
    run(`accept-${role.id}-${applicant}`, async () => {
      const r = await supabase.from('project_roles').update({ member: applicant }).eq('id', role.id);
      if (r.error) return r;
      return supabase.from('role_requests').delete().eq('role_id', role.id);
    });

  return (
    <FormPage fallback="/collaborate" maxWidth={820}>
      <Still name={stillFor(p.id)} uri={p.cover_url} ratio={2.39} position="top" style={{ borderRadius: radius.md }} />
      <View style={{ gap: 6 }}>
        <Text variant="label">{[p.kind, p.dates].filter(Boolean).join(' · ') || 'Project'}</Text>
        <Text variant="title1">{p.title}</Text>
        <Pressable onPress={() => router.push(`/creator/${p.owner}`)} style={styles.owner}>
          <Avatar uri={owner?.avatar_url} id={p.owner} size={24} />
          <Text variant="caption">Led by <Text variant="caption" tone="primary" style={{ fontFamily: fonts.semibold }}>{owner?.name ?? 'Creator'}</Text></Text>
        </Pressable>
      </View>
      {!!p.description && <Text variant="body">{p.description}</Text>}

      <View style={{ gap: 8 }}>
        <View style={styles.phases}>
          {PHASES.map((ph, i) => {
            const on = i <= p.phase;
            return (
              <Pressable
                key={ph}
                disabled={!isOwner}
                accessibilityRole={isOwner ? 'button' : undefined}
                accessibilityLabel={isOwner ? `Set phase to ${ph}` : undefined}
                onPress={() => run('phase', () => supabase.from('projects').update({ phase: i }).eq('id', p.id))}
                style={[styles.phase, on && styles.phaseOn]}>
                <Text variant="label" tone={on ? 'primary' : 'secondary'} style={{ fontSize: 10, letterSpacing: 1 }}>{ph}</Text>
              </Pressable>
            );
          })}
        </View>
        {isOwner && <Text variant="caption">Tap a phase to update where the production is.</Text>}
      </View>

      <View style={{ gap: spacing.xs }}>
        <Text variant="headline">Crew · {filled} of {roles.length}</Text>
        <ErrorText>{error}</ErrorText>
        {roles.map((r) => {
          const member = r.member ? people[r.member] : null;
          const reqs = requests.filter((q) => q.role_id === r.id);
          const mine = reqs.some((q) => q.applicant === userId);
          return (
            <View key={r.id} style={[styles.role, !r.member && styles.roleOpen]}>
              <View style={styles.roleRow}>
                {r.member ? (
                  <Pressable onPress={() => router.push(`/creator/${r.member}`)}><Avatar uri={member?.avatar_url} id={r.member} size={32} /></Pressable>
                ) : (
                  <View style={styles.slot}><Text tone="accent" style={{ fontSize: 16, lineHeight: 18 }}>+</Text></View>
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="callout">{r.role}</Text>
                  <Text variant="caption" style={{ fontSize: 11 }}>
                    {r.member ? member?.name ?? 'Crew member' : reqs.length ? `Open role · ${reqs.length} ${reqs.length === 1 ? 'request' : 'requests'}` : 'Open role'}
                  </Text>
                </View>
                {!isOwner && !r.member && !iAmIn && (
                  <Button
                    label={mine ? 'Requested' : 'Ask to join'}
                    done={mine}
                    variant="ghost"
                    size="sm"
                    loading={busy === `req-${r.id}`}
                    onPress={() =>
                      run(`req-${r.id}`, () =>
                        mine
                          ? supabase.from('role_requests').delete().eq('role_id', r.id).eq('applicant', userId!)
                          : supabase.from('role_requests').insert({ role_id: r.id, applicant: userId }),
                      )
                    }
                  />
                )}
                {isOwner && r.member && r.member !== userId && (
                  <Button label="Remove" variant="ghost" size="sm" onPress={() => run(`rm-${r.id}`, () => supabase.from('project_roles').update({ member: null }).eq('id', r.id))} />
                )}
                {isOwner && !r.member && (
                  <Button label="Delete role" variant="ghost" size="sm" onPress={() => run(`del-${r.id}`, () => supabase.from('project_roles').delete().eq('id', r.id))} />
                )}
              </View>
              {isOwner && !r.member && reqs.length > 0 && (
                <View style={styles.requests}>
                  {reqs.map((q) => {
                    const a = people[q.applicant];
                    return (
                      <View key={q.id} style={styles.roleRow}>
                        <Pressable onPress={() => router.push(`/creator/${q.applicant}`)} style={[styles.roleRow, { flex: 1 }]}>
                          <Avatar uri={a?.avatar_url} id={q.applicant} size={28} />
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text variant="callout" numberOfLines={1}>{a?.name ?? 'Creator'}</Text>
                            <Text variant="caption" numberOfLines={1}>{a?.role}</Text>
                          </View>
                        </Pressable>
                        <Button label="Decline" variant="ghost" size="sm" onPress={() => run(`dec-${q.id}`, () => supabase.from('role_requests').delete().eq('id', q.id))} />
                        <Button label="Add to crew" variant="gold" size="sm" loading={busy === `accept-${r.id}-${q.applicant}`} onPress={() => accept(r, q.applicant)} />
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
        {isOwner && (
          <View style={styles.addRole}>
            <TextInput
              id="new-role"
              accessibilityLabel="New role"
              value={newRole}
              onChangeText={setNewRole}
              placeholder="Add a role, e.g. Sound mixer"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
            <Button
              label="Add"
              size="sm"
              disabled={!newRole.trim()}
              onPress={() => {
                const role = newRole.trim();
                setNewRole('');
                run('add', () => supabase.from('project_roles').insert({ project: p.id, role }));
              }}
            />
          </View>
        )}
      </View>

      {!isOwner && <Button label={`Message ${owner?.name?.split(' ')[0] ?? 'the owner'}`} variant="ghost" onPress={() => router.push(`/chat/${p.owner}`)} />}
      {isOwner &&
        (confirmDelete ? (
          <View style={styles.danger}>
            <Text variant="callout" style={{ flex: 1 }}>Delete this project and its crew list? This can’t be undone.</Text>
            <Button label="Cancel" variant="ghost" size="sm" onPress={() => setConfirmDelete(false)} />
            <Button
              label="Delete"
              variant="danger"
              size="sm"
              onPress={async () => {
                await supabase.from('projects').delete().eq('id', p.id);
                router.replace('/collaborate');
              }}
            />
          </View>
        ) : (
          <Button label="Delete project" variant="danger" onPress={() => setConfirmDelete(true)} />
        ))}
    </FormPage>
  );
}

const styles = StyleSheet.create({
  owner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phases: { flexDirection: 'row', gap: 4 },
  phase: { flex: 1, paddingTop: 6, borderTopWidth: 2, borderColor: colors.surfaceRaised },
  phaseOn: { borderColor: colors.accent },
  role: { gap: 10, padding: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line },
  roleOpen: { borderStyle: 'dashed', borderColor: colors.accentBorder },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  requests: { gap: 8, paddingTop: 10, borderTopWidth: 1, borderColor: colors.line },
  addRole: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  input: { flex: 1, height: 40, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 14, outlineStyle: 'none' } as never,
  danger: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(230,110,90,0.4)' },
});
