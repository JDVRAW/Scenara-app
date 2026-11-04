import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Badge, Button, Chips, Screen, ScreenHeader, Text } from '@/components';
import { opportunities, opportunityFilters } from '@/data/mock';
import { useLayout } from '@/hooks/useLayout';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

/** Opportunities · jobs and projects */
export default function OpportunitiesScreen() {
  const { wide } = useLayout();
  return (
    <Screen>
      <ScreenHeader title="Opportunities" icon="bookmark-outline" iconLabel="Saved" />
      <Chips label="Opportunity type" options={opportunityFilters} />
      <View style={styles.grid}>
      {opportunities.map((o) => (
        <View key={o.id} style={[styles.card, o.featured && styles.featured, wide && { width: o.featured ? '100%' : '48%', flexGrow: 1 }]}>
          {o.featured && (
            <LinearGradient colors={[colors.accentSoft, 'transparent']} locations={[0, 0.7]} style={StyleSheet.absoluteFill} />
          )}
          <View style={styles.top}>
            <View style={styles.logo}><Text variant="callout" style={{ fontFamily: fonts.bold }}>{o.logo}</Text></View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="headline" style={{ fontSize: 16 }}>{o.title}</Text>
              <Text variant="caption">{o.org}</Text>
            </View>
          </View>
          <View style={styles.facts}>
            {o.facts.map((f) => (
              <View key={f.k} style={{ flex: 1, gap: 2 }}>
                <Text variant="label" style={{ fontSize: 10, letterSpacing: 1 }}>{f.k}</Text>
                <Text variant="data">{f.v}</Text>
              </View>
            ))}
          </View>
          <View style={styles.foot}>
            {o.featured ? <Badge label={o.footer} /> : <Text variant="caption">{o.footer}</Text>}
            <Button label="Apply" doneLabel="Applied" variant={o.featured ? 'gold' : 'ghost'} size="sm" />
          </View>
        </View>
      ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: '100%', padding: spacing.md, gap: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  featured: { borderColor: 'rgba(214,179,122,0.35)' },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  logo: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  facts: { flexDirection: 'row', gap: spacing.xs },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
