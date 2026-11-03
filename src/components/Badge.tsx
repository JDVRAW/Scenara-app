import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme/tokens';

import { Text } from './Text';

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'neutral' }) {
  return (
    <View style={[styles.badge, tone === 'neutral' && styles.neutral]}>
      <Text variant="label" tone={tone === 'accent' ? 'accent' : 'primary'} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text variant="caption" style={{ fontSize: 11 }}>{label}</Text>
    </View>
  );
}

export function VerifiedMark() {
  return (
    <View style={styles.verified} accessibilityLabel="Perfil verificado">
      <Text style={styles.check} tone="onAccent">✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: colors.accentSoft, alignSelf: 'flex-start' },
  neutral: { backgroundColor: colors.surfaceRaised },
  text: { fontSize: 10, letterSpacing: 1.2, fontFamily: 'Inter_600SemiBold' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.surface },
  verified: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  check: { fontSize: 10, lineHeight: 12, fontFamily: 'Inter_700Bold' },
});
