import { StyleSheet, View } from 'react-native';

import { colors, StillName } from '@/theme/tokens';

import { Still } from './Still';

const fallbacks: StillName[] = ['skin', 'velvet', 'fog', 'steel', 'jungle', 'crimson', 'dusk', 'ember'];

/** Picks a stable placeholder still from any id so people without a photo still look distinct. */
export function stillFor(id: string | null | undefined): StillName {
  if (!id) return 'skin';
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return fallbacks[h % fallbacks.length];
}

type Props = { uri?: string | null; id?: string | null; still?: StillName; size?: number; ring?: boolean };

export function Avatar({ uri, id, still, size = 44, ring }: Props) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        styles.wrap,
        ring && { borderColor: colors.accent, borderWidth: 2 },
      ]}>
      <Still name={still ?? stillFor(id)} uri={uri} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderWidth: 1, borderColor: colors.lineStrong },
});
