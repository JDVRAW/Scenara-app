import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { stillImages } from '@/theme/stills';
import { colors, StillName, stills } from '@/theme/tokens';

type Props = {
  name: StillName;
  /** Width/height ratio. 2.39 is the anamorphic cinema format. */
  ratio?: number;
  style?: StyleProp<ViewStyle>;
  /** Darkens the bottom so text can sit on top. */
  scrim?: boolean;
  children?: ReactNode;
  /** Part of the frame to keep when the image is cropped, e.g. 'top' or 'center'. */
  position?: 'top' | 'center' | 'bottom';
};

/**
 * Cinematic image with its brand gradient underneath while it loads.
 * Pass `position` to choose which part of the frame stays visible when cropped.
 */
export function Still({ name, ratio, style, scrim, children, position = 'center' }: Props) {
  const c = stills[name] as unknown as [string, string, ...string[]];
  return (
    <View style={[styles.box, ratio ? { aspectRatio: ratio } : null, style]}>
      <LinearGradient colors={c} start={{ x: 0.8, y: 0 }} end={{ x: 0.2, y: 1 }} style={StyleSheet.absoluteFill} />
      <Image source={stillImages[name]} contentFit="cover" contentPosition={position} transition={300} style={StyleSheet.absoluteFill} />
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
