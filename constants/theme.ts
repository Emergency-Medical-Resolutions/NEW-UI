/**
 * OHPAH — "Tactical Medical Interface" design tokens.
 * Source of truth: .stitch/designs/dashboard.html (+ dashboard.png) & splash-screen.html
 */
export const COLORS = {
  // Surfaces (cool dark navy)
  background:     '#051424', // surface / surface-dim
  surfaceLow:     '#0d1c2d', // surface-container-low  (sidebar)
  surfaceLowest:  '#010f1f', // surface-container-lowest (arc column)
  surfaceHighest: '#273647', // surface-container-highest (bottom nav)

  // Primary (light blue-grey) + text
  primary:          '#c1c6db',
  onPrimary:        '#2a3040',
  onSurface:        '#d4e4fa',
  onSurfaceVariant: '#c6c6cd',
  outline:          '#909097',
  outlineVariant:   '#45464c', // hairline borders

  // Error / FAB
  errorContainer:   '#93000a',
  onErrorContainer: '#ffdad6',

  // Arc timeline
  arcRail:      '#45464c',
  tickStroke:   '#45464c',
  tickLabel:    '#909097',
  dashedBorder: '#45464c',
  segRed:       '#93000a',
  segGreen:     '#4ade80',
  segAmber:     '#facc15',
  segWhite:     '#ffffff',

  // Legacy aliases (kept so older imports stay valid)
  navy:    '#051424',
  white:   '#d4e4fa',
  cream:   '#d4e4fa',
  crimson: '#93000a',
  dimText: '#909097',
  border:  '#45464c',
} as const;

export const LAYOUT = {
  sidebarWidth:    44,
  headerHeight:    52,
  bottomNavHeight: 58,
  fabSize:         54,
  fabRadius:       27,
} as const;
