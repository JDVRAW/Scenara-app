import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

import { Text } from './Text';

type Props = { options: string[]; initial?: number; onChange?: (value: string) => void; label: string };

export function Chips({ options, initial = 0, onChange, label }: Props) {
  const [active, setActive] = useState(initial);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={label}
      style={styles.scroller}
      contentContainerStyle={styles.row}>
      {options.map((opt, i) => {
        const on = i === active;
        return (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => {
              setActive(i);
              onChange?.(opt);
            }}
            style={[styles.chip, on && styles.chipOn]}>
            <Text variant="callout" tone={on ? 'accent' : 'secondary'} style={styles.text}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  row: { gap: spacing.xs, paddingHorizontal: spacing.lg },
  chip: { height: 32, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.lineStrong, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  text: { fontSize: 12 },
});
