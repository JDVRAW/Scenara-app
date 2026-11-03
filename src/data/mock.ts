/** Sample data for the prototype. Replace with the real API. */
import { StillName } from '@/theme/tokens';

export type Creator = { id: string; name: string; role: string; city: string; still: StillName };

export const creators: Creator[] = [
  { id: 'valeria', name: 'Valeria Ortiz', role: 'Cinematographer', city: 'Mexico City', still: 'skin' },
  { id: 'tomas', name: 'Tomás Rey', role: 'Director', city: 'Buenos Aires', still: 'velvet' },
  { id: 'ines', name: 'Inés Duarte', role: 'Photographer', city: 'Madrid', still: 'fog' },
  { id: 'kenji', name: 'Kenji Mora', role: 'Colorist', city: 'Lima', still: 'steel' },
  { id: 'lucia', name: 'Lucía Paz', role: 'Editor', city: 'Bogotá', still: 'jungle' },
  { id: 'andres', name: 'Andrés Vela', role: 'Gaffer', city: 'CDMX', still: 'crimson' },
];

export const me = {
  ...creators[0],
  timecode: 'REEL 2026 · 01:12:04:18 · 2.39:1',
  stats: [
    { value: '34', label: 'Projects' },
    { value: '2.1k', label: 'Connections' },
    { value: '6', label: 'Festivals' },
  ],
  reel: [
    { title: 'Low Tide', meta: 'Short film · 14′', still: 'crimson' as StillName },
    { title: 'North', meta: 'Spot', still: 'dusk' as StillName },
    { title: 'Jungle', meta: 'Doc', still: 'jungle' as StillName },
  ],
  credits: [
    { year: '2026', title: 'Low Tide', role: 'DP · Short film', note: 'Cannes', highlight: true },
    { year: '2025', title: 'House of Smoke', role: 'DP · Feature film', note: 'Netflix' },
    { year: '2025', title: 'North for Volvo', role: 'DP · Commercial', note: 'Spot' },
  ],
  kit: ['ARRI Alexa 35', 'Cooke Anamorphic/i', 'DaVinci Resolve', 'Aputure 1200d'],
};

export const disciplines = ['All', 'Cinematography', 'Directing', 'Photography', 'Color', 'Editing'];

export const requests = [
  { creator: creators[2], note: 'Photographer · 12 mutual connections' },
  { creator: creators[3], note: 'Colorist · Worked on House of Smoke' },
];

export const messages = [
  { creator: creators[1], text: 'Sending the pilot moodboard. Review it Thursday?', time: '10:24', unread: true },
  { creator: creators[4], text: 'First cut of Low Tide is done, 14 min.', time: 'Yesterday' },
  { creator: creators[5], text: 'Confirmed the 1200d and two tubes for Saturday.', time: 'Mon' },
  { creator: { id: 'faro', name: 'Faro Studio', role: 'Production company', city: 'CDMX', still: 'dusk' as StillName }, text: 'Thanks for applying. We loved your reel.', time: 'Nov 2' },
];

export const project = {
  kind: 'Series pilot · Directed by Tomás Rey',
  title: 'The Last Lighthouses',
  phases: ['Develop', 'Prep', 'Shoot', 'Post'],
  currentPhase: 1,
  dates: 'Shooting Jan 12–20',
  roles: [
    { role: 'Director', who: creators[1] },
    { role: 'Director of photography', who: creators[0] },
    { role: 'Editor', who: creators[4] },
    { role: 'Gaffer', who: creators[5] },
    { role: 'Colorist', who: null, note: 'Open role · 3 candidates' },
    { role: 'Production sound', who: null, note: 'Open role' },
  ],
};

export const opportunityFilters = ['For you', 'Remote', 'Feature film', 'Advertising', 'Grants'];

export const opportunities = [
  {
    id: 'faro', logo: 'FS', title: 'DP for fashion campaign', org: 'Faro Studio · Mexico City', featured: true,
    facts: [{ k: 'Rate', v: '$2,400/day' }, { k: 'Dates', v: 'Dec 4–6' }, { k: 'Format', v: '2.39:1' }],
    footer: '94% match',
  },
  {
    id: 'norte', logo: 'NC', title: 'Colorist · Documentary', org: 'Norte Cine · Remote',
    facts: [{ k: 'Rate', v: '$9,000' }, { k: 'Length', v: '3 wks' }, { k: 'Delivery', v: 'HDR' }],
    footer: 'Closes in 5 days',
  },
  {
    id: 'bruma', logo: 'BL', title: '2027 Short Film Grant', org: 'Bruma Lab · Ibero-America',
    facts: [{ k: 'Funding', v: '$15,000' }, { k: 'Spots', v: '8' }, { k: 'Deadline', v: 'Jan 15' }],
    footer: '212 applicants',
  },
];
