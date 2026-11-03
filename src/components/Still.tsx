import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, StillName, stills } from '@/theme/tokens';

type Props = {
  name: StillName;
  /** Proporción ancho/alto. 2.39 es el formato anamórfico de cine. */
  ratio?: number;
  style?: StyleProp<ViewStyle>;
  /** Oscurece la parte inferior para poner texto encima. */
  scrim?: boolean;
  children?: ReactNode;
};

/**
 * Marcador de imagen cinematográfica. Cuando haya fotos reales,
 * sustituir el degradado por <Image> de expo-image con el mismo contenedor.
 */
export function Still({ name, ratio, style, scrim, children }: Props) {
  const c = stills[name] as unknown as [string, string, ...string[]];
  return (
    <View style={[styles.box, ratio ? { aspectRatio: ratio } : null, style]}>
      <LinearGradient colors={c} start={{ x: 0.8, y: 0 }} end={{ x: 0.2, y: 1 }} style={StyleSheet.absoluteFill} />
      {scrim && (
        <LinearGradient colors={['transparent', colors.scrim]} locations={[0.3, 1]} style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: colors.surfaceRaised },
});
