# SCENARA

The creative network for visual storytellers. Web app built with Expo + React Native Web. The same code can ship to iOS and Android later.

## Getting started

```bash
npm install
npm run web                 # dev server in the browser
npx expo export -p web      # static build in dist/, deployable to any static host
```

## Structure

```
src/
  theme/tokens.ts     Brand direction v1.0: palette, color roles, type, spacing, radii
  components/         Base pieces: Text, Button, Chips, Still, Avatar, Badge, Screen
  hooks/useLayout.ts  Breakpoints: phone layout below 900px, desktop sidebar above
  data/mock.ts        Sample data (replace with the API)
  app/
    _layout.tsx       Inter font loading and dark theme
    index.tsx         Welcome page: what SCENARA is, how it works, the five functions
    (tabs)/
      showcase.tsx      Showcase · professional portfolio
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
