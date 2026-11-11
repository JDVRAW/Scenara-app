import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { colors, radius } from '@/theme/tokens';

import { Text } from './Text';

type Variant = 'primary' | 'gold' | 'ghost' | 'danger';

type Props = {
  label: string;
  variant?: Variant;
  size?: 'md' | 'sm';
  /** Shows the settled state (e.g. "Requested ✓") with an outlined gold style. */
  done?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, variant = 'primary', size = 'md', done, loading, disabled, onPress, style }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, selected: !!done }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        done ? styles.done : styles[variant],
        inactive && styles.inactive,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'ghost' || done ? colors.textPrimary : colors.onAccent} />
      ) : (
        <Text
          variant="callout"
          style={[styles.label, size === 'sm' && styles.labelSm]}
          tone={done ? 'accent' : variant === 'ghost' || variant === 'danger' ? 'primary' : 'onAccent'}>
          {done ? `${label} ✓` : label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 40, paddingHorizontal: 18, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  sm: { height: 32, paddingHorizontal: 14 },
  primary: { backgroundColor: colors.textPrimary },
  gold: { backgroundColor: colors.accent },
  ghost: { borderColor: colors.lineStrong },
  danger: { borderColor: 'rgba(230,110,90,0.5)' },
  done: { borderColor: colors.accent },
  inactive: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
  label: { fontFamily: 'Inter_600SemiBold' },
  labelSm: { fontSize: 12 },
});
