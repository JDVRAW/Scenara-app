import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLayout } from '@/hooks/useLayout';
import { colors, spacing } from '@/theme/tokens';

import { Text } from './Text';

type IconName = keyof typeof Ionicons.glyphMap;

/** Container for every tab: Onyx background, safe area and scroll. */
export function Screen({ children, edgeToEdgeTop, maxWidth = 1120 }: { children: ReactNode; edgeToEdgeTop?: boolean; maxWidth?: number }) {
  const { wide } = useLayout();
  return (
    <SafeAreaView style={styles.safe} edges={edgeToEdgeTop ? [] : ['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, wide && { maxWidth, paddingTop: edgeToEdgeTop ? 0 : spacing.xl, gap: 28 }]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function ScreenHeader({ title, icon, iconLabel }: { title: string; icon?: IconName; iconLabel?: string }) {
  return (
    <View style={styles.header}>
      <Text variant="title1">{title}</Text>
      {icon && (
        <Pressable accessibilityRole="button" accessibilityLabel={iconLabel} style={styles.iconBtn}>
          <Ionicons name={icon} size={18} color={colors.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.section}>
      <Text variant="headline">{title}</Text>
      {action && (
        <Pressable accessibilityRole="button">
          <Text variant="caption" tone="accent" style={{ fontFamily: 'Inter_500Medium' }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.xxl, gap: 22, width: '100%', maxWidth: 640, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  section: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
});
