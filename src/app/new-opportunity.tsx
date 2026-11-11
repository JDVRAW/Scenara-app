import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Chips, ErrorText, Field, FormPage, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { OPP_KINDS } from '@/lib/opportunities';
import { must, Opportunity, supabase } from '@/lib/supabase';
import { spacing } from '@/theme/tokens';

export default function NewOpportunity() {
  const { userId, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [location, setLocation] = useState('');
  const [kind, setKind] = useState(OPP_KINDS[0]);
  const [rate, setRate] = useState('');
  const [dates, setDates] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!userId) return;
    if (!title.trim()) return setError('Add a title, like “DP for a fashion campaign”.');
    setBusy(true);
    setError(null);
    try {
      const o = must(
        await supabase
          .from('opportunities')
          .insert({
            owner: userId,
            title: title.trim(),
            org: org.trim() || profile?.name || '',
            location: location.trim(),
            kind,
            rate: rate.trim(),
            dates: dates.trim(),
            description: description.trim(),
          })
          .select()
          .single(),
      ) as Opportunity;
      router.replace(`/opportunity/${o.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <FormPage title="Post an opportunity" fallback="/opportunities">
      <Field id="title" label="Title" value={title} onChangeText={setTitle} placeholder="DP for a fashion campaign" />
      <View style={{ gap: 6 }}>
        <Text variant="label">Type</Text>
        <Chips label="Type" options={OPP_KINDS} onChange={setKind} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}><Field id="org" label="Company or studio" value={org} onChangeText={setOrg} placeholder={profile?.name || 'Faro Studio'} /></View>
        <View style={{ flex: 1 }}><Field id="location" label="Location" value={location} onChangeText={setLocation} placeholder="Mexico City or Remote" /></View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}><Field id="rate" label="Rate or budget" value={rate} onChangeText={setRate} placeholder="$2,400/day" /></View>
        <View style={{ flex: 1 }}><Field id="dates" label="Dates" value={dates} onChangeText={setDates} placeholder="Dec 4–6" /></View>
      </View>
      <Field id="description" label="Details" value={description} onChangeText={setDescription} multiline placeholder="What you need, the look, gear, deliverables, how to stand out." />
      <ErrorText>{error}</ErrorText>
      <Button label="Publish" variant="gold" onPress={save} loading={busy} />
    </FormPage>
  );
}
