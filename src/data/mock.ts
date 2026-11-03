/** Datos de ejemplo para el prototipo. Sustituir por la API real. */
import { StillName } from '@/theme/tokens';

export type Creator = { id: string; name: string; role: string; city: string; still: StillName };

export const creators: Creator[] = [
  { id: 'valeria', name: 'Valeria Ortiz', role: 'Directora de fotografía', city: 'Ciudad de México', still: 'skin' },
  { id: 'tomas', name: 'Tomás Rey', role: 'Director', city: 'Buenos Aires', still: 'velvet' },
  { id: 'ines', name: 'Inés Duarte', role: 'Fotógrafa', city: 'Madrid', still: 'fog' },
  { id: 'kenji', name: 'Kenji Mora', role: 'Colorista', city: 'Lima', still: 'steel' },
  { id: 'lucia', name: 'Lucía Paz', role: 'Editora', city: 'Bogotá', still: 'jungle' },
  { id: 'andres', name: 'Andrés Vela', role: 'Gaffer', city: 'CDMX', still: 'crimson' },
];

export const me = {
  ...creators[0],
  timecode: 'REEL 2026 · 01:12:04:18 · 2.39:1',
  stats: [
    { value: '34', label: 'Proyectos' },
    { value: '2.1k', label: 'Conexiones' },
    { value: '6', label: 'Festivales' },
  ],
  reel: [
    { title: 'Marea baja', meta: 'Cortometraje · 14′', still: 'crimson' as StillName },
    { title: 'Norte', meta: 'Spot', still: 'dusk' as StillName },
    { title: 'Selva', meta: 'Doc', still: 'jungle' as StillName },
  ],
  credits: [
    { year: '2026', title: 'Marea baja', role: 'DF · Cortometraje', note: 'Cannes', highlight: true },
    { year: '2025', title: 'Casa de humo', role: 'DF · Largometraje', note: 'Netflix' },
    { year: '2025', title: 'Norte para Volvo', role: 'DF · Comercial', note: 'Spot' },
  ],
  kit: ['ARRI Alexa 35', 'Cooke Anamorphic/i', 'DaVinci Resolve', 'Aputure 1200d'],
};

export const disciplines = ['Todos', 'Cinematografía', 'Dirección', 'Fotografía', 'Colorista', 'Edición'];

export const requests = [
  { creator: creators[2], note: 'Fotógrafa · 12 conexiones en común' },
  { creator: creators[3], note: 'Colorista · Trabajó en Casa de humo' },
];

export const messages = [
  { creator: creators[1], text: 'Te paso el moodboard del piloto, ¿lo vemos el jueves?', time: '10:24', unread: true },
  { creator: creators[4], text: 'Listo el primer corte de Marea baja, 14 min.', time: 'Ayer' },
  { creator: creators[5], text: 'Confirmo el 1200d y dos tubos para el sábado.', time: 'Lun' },
  { creator: { id: 'faro', name: 'Estudio Faro', role: 'Productora', city: 'CDMX', still: 'dusk' as StillName }, text: 'Gracias por aplicar. Nos encantó tu reel.', time: '2 nov' },
];

export const project = {
  kind: 'Piloto de serie · Dirige Tomás Rey',
  title: 'Los Últimos Faros',
  phases: ['Desarrollo', 'Preprod.', 'Rodaje', 'Post'],
  currentPhase: 1,
  dates: 'Rodaje del 12 al 20 de enero',
  roles: [
    { role: 'Dirección', who: creators[1] },
    { role: 'Dirección de fotografía', who: creators[0] },
    { role: 'Edición', who: creators[4] },
    { role: 'Gaffer', who: creators[5] },
    { role: 'Colorista', who: null, note: 'Rol abierto · 3 candidatos' },
    { role: 'Sonido directo', who: null, note: 'Rol abierto' },
  ],
};

export const opportunityFilters = ['Para ti', 'Remoto', 'Largometraje', 'Publicidad', 'Becas'];

export const opportunities = [
  {
    id: 'faro', logo: 'EF', title: 'DF para campaña de moda', org: 'Estudio Faro · Ciudad de México', featured: true,
    facts: [{ k: 'Tarifa', v: '$2,400/día' }, { k: 'Fechas', v: '4–6 dic' }, { k: 'Formato', v: '2.39:1' }],
    footer: '94% match',
  },
  {
    id: 'norte', logo: 'NC', title: 'Colorista · Documental', org: 'Norte Cine · Remoto',
    facts: [{ k: 'Tarifa', v: '$9,000' }, { k: 'Duración', v: '3 sem' }, { k: 'Entrega', v: 'HDR' }],
    footer: 'Cierra en 5 días',
  },
  {
    id: 'bruma', logo: 'LB', title: 'Beca de cortometraje 2027', org: 'Laboratorio Bruma · Iberoamérica',
    facts: [{ k: 'Apoyo', v: '$15,000' }, { k: 'Cupos', v: '8' }, { k: 'Cierre', v: '15 ene' }],
    footer: '212 aplicaciones',
  },
];
