import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, ErrorText, Field, FormPage, ImageField } from '@/components';
import { useAuth } from '@/lib/auth';
import { must, Project, supabase } from '@/lib/supabase';
import { spacing } from '@/theme/tokens';

export default function NewProject() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('');
  const [description, setDescription] = useState('');
  const [dates, setDates] = useState('');
  const [roles, setRoles] = useState('Director of photography, Editor, Colorist');
  const [mineRole, setMineRole] = useState('Director');
  const [cover, setCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!userId) return;
    if (!title.trim()) return setError('Give the project a title.');
    const open = roles.split(',').map((r) => r.trim()).filter(Boolean);
    if (!open.length && !mineRole.trim()) return setError('List at least one role.');
    setBusy(true);
    setError(null);
    try {
      const p = must(
        await supabase
          .from('projects')
          .insert({ owner: userId, title: title.trim(), kind: kind.trim(), description: description.trim(), dates: dates.trim(), cover_url: cover })
          .select()
          .single(),
      ) as Project;
      const rows = [
        ...(mineRole.trim() ? [{ project: p.id, role: mineRole.trim(), member: userId }] : []),
        ...open.map((role) => ({ project: p.id, role, member: null })),
      ];
      if (rows.length) must(await supabase.from('project_roles').insert(rows));
      router.replace(`/project/${p.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <FormPage title="New project" fallback="/collaborate">
      <ImageField label="Cover" value={cover} onChange={setCover} folder="projects" aspect={[239, 100]} still="dusk" />
      <Field id="title" label="Title" value={title} onChangeText={setTitle} placeholder="The Last Lighthouses" />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}><Field id="kind" label="Type" value={kind} onChangeText={setKind} placeholder="Series pilot" /></View>
        <View style={{ flex: 1 }}><Field id="dates" label="Dates" value={dates} onChangeText={setDates} placeholder="Shooting Jan 12–20" /></View>
      </View>
      <Field id="description" label="What it’s about" value={description} onChangeText={setDescription} multiline placeholder="Story, look, location, budget range…" />
      <Field id="mine" label="Your role" value={mineRole} onChangeText={setMineRole} placeholder="Director" />
      <Field id="roles" label="Roles you need" value={roles} onChangeText={setRoles} hint="Separate roles with commas. Each one becomes an open spot people can ask to join." />
      <ErrorText>{error}</ErrorText>
      <Button label="Create project" variant="gold" onPress={save} loading={busy} />
    </FormPage>
  );
}
