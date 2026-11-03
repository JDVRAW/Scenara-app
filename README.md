# SCENARA

The creative network for visual storytellers. App en React Native con Expo (iOS, Android y web).

## Arrancar

```bash
npm install
npx expo start        # abre en Expo Go, simulador iOS/Android o navegador (tecla w)
```

## Estructura

```
src/
  theme/tokens.ts     Brand direction v1.0: paleta, roles de color, tipografía, espaciado, radios
  components/         Piezas base: Text, Button, Chips, Still, Avatar, Badge, Screen
  data/mock.ts        Datos de ejemplo (sustituir por la API)
  app/
    _layout.tsx       Carga de fuentes Inter y tema oscuro
    (tabs)/
      index.tsx         Showcase · portafolio profesional
      discover.tsx      Discover · descubrir creadores
      connect.tsx       Connect · networking
      collaborate.tsx   Collaborate · formar equipos
      opportunities.tsx Opportunities · trabajos y proyectos
```

## Reglas de marca en código

- Las pantallas usan `colors.*` (roles), nunca los hex sueltos.
- Sand (`colors.accent`) solo para la acción principal, el estado activo y el reconocimiento. Una vez por pantalla como máximo.
- Titulares con `variant="title1" | "title2" | "display"` (SF Pro Display en iOS, Inter en el resto). Interfaz y texto con Inter.
- `Still` es un marcador de fotograma con degradado. Cuando haya fotografía real, se cambia por `expo-image` dentro del mismo contenedor.
