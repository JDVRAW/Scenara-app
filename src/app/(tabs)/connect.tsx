import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Screen, ScreenHeader, SectionHeader, Text } from '@/components';
import { messages, requests } from '@/data/mock';
import { useLayout } from '@/hooks/useLayout';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Connect · networking */
export default function ConnectScreen() {
  const { wide } = useLayout();
  return (
    <Screen>
      <ScreenHeader title="Connect" icon="create-outline" iconLabel="New message" />

      <View style={[styles.cols, wide && styles.colsWide]}>
      <View style={[styles.col, wide && { flexGrow: 0, flexShrink: 0, flexBasis: 380 }]}>
      <SectionHeader title={`Requests · ${requests.length}`} />
      <View style={{ gap: spacing.xs }}>
        {requests.map((r) => (
          <View key={r.creator.id} style={styles.req}>
            <Avatar still={r.creator.still} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="callout" style={{ fontFamily: fonts.semibold }}>{r.creator.name}</Text>
              <Text variant="caption">{r.note}</Text>
            </View>
            <Button label="Accept" doneLabel="Accepted" variant="gold" size="sm" />
          </View>
        ))}
      </View>

      </View>
      <View style={[styles.col, wide && styles.colWide]}>
      <SectionHeader title="Messages" action="Archived" />
      <View>
        {messages.map((m) => (
          <View key={m.creator.id} style={styles.row}>
            <Avatar still={m.creator.still} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="callout" style={{ fontFamily: fonts.semibold }}>{m.creator.name}</Text>
              <Text variant="caption" numberOfLines={1}>{m.text}</Text>
            </View>
            <View style={styles.meta}>
              <Text variant="caption" style={{ fontSize: 11 }}>{m.time}</Text>
              {m.unread && <View style={styles.dot} accessibilityLabel="Unread" />}
            </View>
          </View>
        ))}
      </View>
      </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cols: { gap: 22 },
  colsWide: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xxl },
  col: { gap: 12, minWidth: 0 },
  colWide: { flex: 1 },
  req: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  meta: { alignItems: 'flex-end', gap: 6, alignSelf: 'flex-start', paddingTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
