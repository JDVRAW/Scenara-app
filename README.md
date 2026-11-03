# SCENARA

The creative network for visual storytellers. React Native app built with Expo (iOS, Android and web).

## Getting started

```bash
npm install
npx expo start        # open in Expo Go, an iOS/Android simulator, or the browser (press w)
```

## Structure

```
src/
  theme/tokens.ts     Brand direction v1.0: palette, color roles, type, spacing, radii
  components/         Base pieces: Text, Button, Chips, Still, Avatar, Badge, Screen
  data/mock.ts        Sample data (replace with the API)
  app/
    _layout.tsx       Inter font loading and dark theme
    (tabs)/
      index.tsx         Showcase · professional portfolio
      discover.tsx      Discover · find creators
      connect.tsx       Connect · networking
      collaborate.tsx   Collaborate · build crews
      opportunities.tsx Opportunities · jobs and projects
```

## Brand rules in code

- Screens use `colors.*` (semantic roles), never raw hex values.
- Sand (`colors.accent`) is reserved for the primary action, the active state and recognition. At most once per screen.
- Headlines use `variant="title1" | "title2" | "display"` (SF Pro Display on iOS, Inter elsewhere). UI and body text use Inter.
- `Still` is a gradient film-still placeholder. Once real photography exists, swap it for `expo-image` inside the same container.
