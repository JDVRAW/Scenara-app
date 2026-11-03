import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Screen, ScreenHeader, SectionHeader, Text } from '@/components';
import { messages, requests } from '@/data/mock';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Connect · networking */
export default function ConnectScreen() {
  return (
    <Screen>
      <ScreenHeader title="Connect" icon="create-outline" iconLabel="New message" />

      <SectionHeader title={`Requests · ${requests.length}`} />
      <View style={{ gap: spacing.xs, marginTop: -10 }}>
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

      <SectionHeader title="Messages" action="Archived" />
      <View style={{ marginTop: -10 }}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  req: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.line },
  meta: { alignItems: 'flex-end', gap: 6, alignSelf: 'flex-start', paddingTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
