import { useWindowDimensions } from 'react-native';

/** Breakpoints for the web app. Phone layout below 900px, desktop above. */
export function useLayout() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  return { width, wide, xwide: width >= 1280 };
}
