import { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { colors, radius } from '@/theme/tokens';

import { Text } from './Text';

type Variant = 'primary' | 'gold' | 'ghost';

type Props = {
  label: string;
  variant?: Variant;
  size?: 'md' | 'sm';
  /** Si se indica, el botón alterna a este texto al tocarlo (Conectar → Conectada). */
  doneLabel?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Button({ label, variant = 'primary', size = 'md', doneLabel, onPress, style }: Props) {
  const [done, setDone] = useState(false);
  const isDone = doneLabel != null && done;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isDone }}
      onPress={() => {
        if (doneLabel) setDone((d) => !d);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        isDone ? styles.done : styles[variant],
        pressed && styles.pressed,
        style,
      ]}>
      <Text
        variant="callout"
        style={[styles.label, size === 'sm' && styles.labelSm]}
        tone={isDone ? 'accent' : variant === 'ghost' ? 'primary' : 'onAccent'}>
        {isDone ? `${doneLabel} ✓` : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 40, paddingHorizontal: 18, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  sm: { height: 32, paddingHorizontal: 14 },
  primary: { backgroundColor: colors.textPrimary },
  gold: { backgroundColor: colors.accent },
  ghost: { borderColor: colors.lineStrong },
  done: { borderColor: colors.accent },
  pressed: { opacity: 0.75 },
  label: { fontFamily: 'Inter_600SemiBold' },
  labelSm: { fontSize: 12 },
});
