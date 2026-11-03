import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Screen, ScreenHeader, Still, Text } from '@/components';
import { project } from '@/data/mock';
import { colors, radius, spacing } from '@/theme/tokens';

/** Collaborate · formar equipos */
export default function CollaborateScreen() {
  const filled = project.roles.filter((r) => r.who).length;
  const total = project.roles.length;

  return (
    <Screen>
      <ScreenHeader title="Colaborar" icon="add" iconLabel="Nuevo proyecto" />
      <View style={styles.card}>
        <Still name="dusk" ratio={2.39} />
        <View style={styles.body}>
          <View style={{ gap: 4 }}>
            <Text variant="label">{project.kind}</Text>
            <Text variant="title2">{project.title}</Text>
          </View>

          <View style={styles.phases}>
            {project.phases.map((p, i) => {
              const on = i <= project.currentPhase;
              return (
                <View key={p} style={[styles.phase, on && styles.phaseOn]}>
                  <Text variant="label" tone={on ? 'primary' : 'secondary'} style={{ fontSize: 9, letterSpacing: 1 }}>{p}</Text>
                </View>
              );
            })}
          </View>

          <Text variant="caption">
            Equipo formado <Text variant="data" style={{ fontSize: 12 }}>{filled} de {total}</Text> · {project.dates}
          </Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${(filled / total) * 100}%` }]} /></View>

          <View style={{ gap: spacing.xs }}>
            {project.roles.map((r) => (
              <View key={r.role} style={[styles.role, !r.who && styles.roleOpen]}>
                {r.who ? (
                  <Avatar still={r.who.still} size={28} />
                ) : (
                  <View style={styles.slot}><Text tone="accent" style={{ fontSize: 16, lineHeight: 18 }}>+</Text></View>
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="callout">{r.role}</Text>
                  <Text variant="caption" style={{ fontSize: 11 }}>{r.who ? r.who.name : r.note}</Text>
                </View>
                {!r.who && <Button label="Invitar" doneLabel="Invitado" variant="ghost" size="sm" />}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, backgroundColor: colors.surface, overflow: 'hidden' },
  body: { padding: spacing.md, gap: 14 },
  phases: { flexDirection: 'row', gap: 4 },
  phase: { flex: 1, paddingTop: 6, borderTopWidth: 2, borderColor: colors.surfaceRaised },
  phaseOn: { borderColor: colors.accent },
  track: { height: 3, borderRadius: 2, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
  role: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line },
  roleOpen: { borderStyle: 'dashed', borderColor: colors.accentBorder },
  slot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
