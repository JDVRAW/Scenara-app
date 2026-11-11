import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/lib/auth';
import { pickAndUpload } from '@/lib/upload';
import { colors, radius, StillName } from '@/theme/tokens';

import { ErrorText } from './Form';
import { Still } from './Still';
import { Text } from './Text';

type Props = { label: string; value: string | null; onChange: (url: string) => void; folder: string; aspect?: [number, number]; round?: boolean; still?: StillName };

/** Photo picker that uploads straight to storage and shows the result. */
export function ImageField({ label, value, onChange, folder, aspect = [16, 9], round, still = 'ember' }: Props) {
  const { userId } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async () => {
    if (!userId) return;
    setBusy(true);
    setError(null);
    try {
      const url = await pickAndUpload(userId, folder, aspect);
      if (url) onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const size = round ? 96 : undefined;
  return (
    <View style={{ gap: 6 }}>
      <Text variant="label">{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Choose ${label.toLowerCase()}`} onPress={pick} disabled={busy}>
        <Still
          name={still}
          uri={value}
          ratio={round ? 1 : aspect[0] / aspect[1]}
          scrim
          style={[styles.frame, round && { width: size, height: size, borderRadius: 48 }]}>
          <View style={styles.overlay}>
            <Text variant="callout" style={styles.cta}>{busy ? 'Uploading…' : value ? 'Change photo' : 'Upload photo'}</Text>
          </View>
        </Still>
      </Pressable>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  cta: { backgroundColor: 'rgba(10,10,10,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
});
