import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/tokens';

import { Text } from './Text';

export function goBack(fallback: Href = '/showcase') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export function BackHeader({ title, fallback, right }: { title?: string; fallback?: Href; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => goBack(fallback)} style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
      </Pressable>
      {title ? <Text variant="title2" style={{ flex: 1 }} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
});
