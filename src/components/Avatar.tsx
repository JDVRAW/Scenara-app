import { StyleSheet, View } from 'react-native';

import { colors, StillName } from '@/theme/tokens';

import { Still } from './Still';

export function Avatar({ still, size = 44, ring }: { still: StillName; size?: number; ring?: boolean }) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        styles.wrap,
        ring && { borderColor: colors.accent, borderWidth: 2 },
      ]}>
      <Still name={still} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderWidth: 1, borderColor: colors.lineStrong },
});
