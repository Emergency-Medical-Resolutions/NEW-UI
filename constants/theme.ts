/**
 * Tactical Medical Interface — design system tokens
 * Source: Stitch project 5907006008518696965
 * Design system: assets/2b41aed9a2244f6494619c48d53bc330
 */
export const COLORS = {
  // Surfaces
  navy:          '#051424',   // surface / background
  navyLight:     '#0d1c2d',   // surface-container-low
  navyContainer: '#122131',   // surface-container
  navyHigh:      '#1c2b3c',   // surface-container-high

  // Brand
  crimson:  '#7f1d1d',        // tertiary-container (FAB / glow)
  white:    '#d4e4fa',        // on-surface  (primary text)
  whiteTrue:'#ffffff',

  // Structure
  border:       'rgba(212,228,250,0.14)',
  dimText:      'rgba(212,228,250,0.45)',
  outline:      '#909097',

  // Arc timeline
  arcRail:      'rgba(212,228,250,0.82)',
  tickStroke:   'rgba(212,228,250,0.40)',
  tickLabel:    'rgba(212,228,250,0.65)',
  dashedBorder: 'rgba(212,228,250,0.22)',

  // Call-log segment colors on the arc
  segRed:   '#7B1111',
  segGreen: '#2E6B2E',
  segAmber: '#B8870A',
  segWhite: '#D8D8D8',
} as const;

export const LAYOUT = {
  sidebarWidth:    44,
  headerHeight:    52,
  bottomNavHeight: 58,
  fabSize:         54,
  fabRadius:       27,
} as const;
