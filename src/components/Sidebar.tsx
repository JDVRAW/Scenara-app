import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { me } from '@/data/mock';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { Avatar } from './Avatar';
import { Text } from './Text';

export type NavItem = { name: string; title: string; label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap };

/** Desktop navigation: replaces the bottom tab bar on wide screens. */
export function Sidebar({ state, navigateToTab, items }: BottomTabBarProps & { items: NavItem[] }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.wordmark}>SCENARA</Text>
      <View style={styles.nav}>
        {state.routes.map((route, i) => {
          const item = items.find((t) => t.name === route.name);
          if (!item) return null;
          const on = state.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="link"
              accessibilityState={{ selected: on }}
              onPress={() => navigateToTab(route.key)}
              style={({ pressed }) => [styles.item, (on || pressed) && styles.itemOn]}>
              <Ionicons name={on ? item.iconActive : item.icon} size={20} color={on ? colors.accent : colors.textSecondary} />
              <Text variant="callout" tone={on ? 'primary' : 'secondary'} style={{ fontFamily: on ? fonts.semibold : fonts.medium, fontSize: 14 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.me}>
        <Avatar still={me.still} size={36} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="callout" numberOfLines={1} style={{ fontFamily: fonts.semibold }}>{me.name}</Text>
          <Text variant="caption" numberOfLines={1}>{me.role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { width: 248, height: '100%', paddingVertical: spacing.xl, paddingHorizontal: spacing.md, borderRightWidth: 1, borderColor: colors.line, backgroundColor: colors.background, gap: spacing.xl },
  wordmark: { fontFamily: fonts.display, fontWeight: '600', fontSize: 18, letterSpacing: 6, color: colors.textPrimary, paddingHorizontal: spacing.sm },
  nav: { gap: 4, flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, height: 44, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
  itemOn: { backgroundColor: colors.surface },
  me: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: spacing.md, paddingHorizontal: spacing.xs, borderTopWidth: 1, borderColor: colors.line },
});
