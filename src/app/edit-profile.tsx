import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, ErrorText, Field, FormPage, ImageField, stillFor } from '@/components';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/tokens';

export default function EditProfile() {
  const { profile, userId, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [kit, setKit] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setRole(profile.role);
    setCity(profile.city);
    setBio(profile.bio);
    setKit(profile.kit.join(', '));
    setAvatar(profile.avatar_url);
    setCover(profile.cover_url);
  }, [profile]);

  const save = async () => {
    if (!userId) return;
    if (!name.trim()) return setError('Add your name.');
    setBusy(true);
    setError(null);
    const { error: e } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: name.trim(),
        role: role.trim(),
        city: city.trim(),
        bio: bio.trim(),
        kit: kit.split(',').map((k) => k.trim()).filter(Boolean),
        avatar_url: avatar,
        cover_url: cover,
      });
    setBusy(false);
    if (e) return setError(e.message);
    await refreshProfile();
    router.replace('/showcase');
  };

  return (
    <FormPage title="Edit profile">
      <ImageField label="Cover" value={cover} onChange={setCover} folder="cover" aspect={[239, 100]} still={stillFor(userId)} />
      <ImageField label="Profile photo" value={avatar} onChange={setAvatar} folder="avatar" aspect={[1, 1]} round still={stillFor(userId)} />
      <Field id="name" label="Full name" value={name} onChangeText={setName} />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}><Field id="role" label="Craft" value={role} onChangeText={setRole} placeholder="Cinematographer" /></View>
        <View style={{ flex: 1 }}><Field id="city" label="City" value={city} onChangeText={setCity} placeholder="Mexico City" /></View>
      </View>
      <Field id="bio" label="About you" value={bio} onChangeText={setBio} multiline placeholder="What you shoot, how you work, what you’re looking for." />
      <Field id="kit" label="Gear" value={kit} onChangeText={setKit} placeholder="ARRI Alexa 35, Cooke Anamorphic/i, DaVinci Resolve" hint="Separate items with commas." />
      <ErrorText>{error}</ErrorText>
      <Button label="Save profile" variant="gold" onPress={save} loading={busy} />
    </FormPage>
  );
}
