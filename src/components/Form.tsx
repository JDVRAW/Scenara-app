import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { Text } from './Text';

type FieldProps = TextInputProps & { label: string; hint?: string; id: string };

export function Field({ label, hint, id, multiline, style, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text variant="label" nativeID={`${id}-label`}>{label}</Text>
      <TextInput
        id={id}
        accessibilityLabelledBy={`${id}-label`}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, style]}
        {...rest}
      />
      {hint && <Text variant="caption">{hint}</Text>}
    </View>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <View style={styles.error} accessibilityRole="alert">
      <Text variant="callout" style={{ color: '#F0A090' }}>{children}</Text>
    </View>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.accent} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <Text variant="headline">{title}</Text>
      <Text variant="body" tone="secondary" style={{ textAlign: 'center', maxWidth: 360 }}>{body}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  input: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  error: { padding: spacing.sm, borderRadius: radius.sm, backgroundColor: 'rgba(230,110,90,0.12)', borderWidth: 1, borderColor: 'rgba(230,110,90,0.35)' },
  loading: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xxl },
  empty: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.lineStrong },
});
