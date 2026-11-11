import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Chips, ErrorText, Field, FormPage, ImageField, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/tokens';

const kinds = ['Short film', 'Feature film', 'Commercial', 'Music video', 'Documentary', 'Series', 'Photography'];

export default function NewWork() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState(kinds[0]);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [credit, setCredit] = useState('');
  const [video, setVideo] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!userId) return;
    if (!title.trim()) return setError('Give the work a title.');
    const y = parseInt(year, 10);
    if (year && (isNaN(y) || y < 1900 || y > 2100)) return setError('Use a four-digit year, like 2026.');
    if (video && !/^https?:\/\//.test(video.trim())) return setError('The video link should start with https://');
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.from('works').insert({
      owner: userId,
      title: title.trim(),
      kind,
      year: year ? y : null,
      credit: credit.trim(),
      video_url: video.trim() || null,
      image_url: image,
    });
    setBusy(false);
    if (e) return setError(e.message);
    router.replace('/showcase');
  };

  return (
    <FormPage title="Add work">
      <ImageField label="Still or poster" value={image} onChange={setImage} folder="works" aspect={[239, 100]} />
      <Field id="title" label="Title" value={title} onChangeText={setTitle} placeholder="Low Tide" />
      <View style={{ gap: 6 }}>
        <Text variant="label">Type</Text>
        <Chips label="Type of work" options={kinds} onChange={setKind} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}><Field id="credit" label="Your credit" value={credit} onChangeText={setCredit} placeholder="Director of photography" /></View>
        <View style={{ width: 110 }}><Field id="year" label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} /></View>
      </View>
      <Field id="video" label="Video link (optional)" value={video} onChangeText={setVideo} placeholder="https://vimeo.com/…" autoCapitalize="none" />
      <ErrorText>{error}</ErrorText>
      <Button label="Add to showcase" variant="gold" onPress={save} loading={busy} />
    </FormPage>
  );
}
