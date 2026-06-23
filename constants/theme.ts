/**
 * OHPAH — "Field Journal" vintage design tokens.
 * Source of truth: user reference image (aged-paper + weathered-navy tactical dashboard).
 */
export const COLORS = {
  // Surfaces
  paper:      '#cbb892', // aged paper (outer frame) — texture fallback
  navyCard:   '#16243f', // weathered navy card — texture fallback
  navyDeep:   '#0e1a30',

  // Ink / text on navy
  cream:      '#efe3c8', // primary parchment text
  creamDim:   '#c8bb9c',
  inkOnCream: '#3a2f22', // dark text on cream buttons

  // Accents
  terracotta:   '#c0512c', // Daily tab
  fabRed:       '#d8442a', // + button (brighter red-orange)
  onTerracotta: '#f4e9d2',

  // Sidebar tab colors
  tabCream:  '#e8dcc0',
  tabGrey:   '#a89f8d', // Call (selected)
  tabTeal:   '#4a9a92', // Cal
  tabYellow: '#e6c34d', // Steps
  tabCoral:  '#d96a58', // Heart
  tabOrange: '#d99a4e', // Calorie

  // Lines / arc
  dashedBorder: '#efe3c8',
  arcLine:      '#efe3c8',
  tickStroke:   '#efe3c8',
  tickLabel:    '#efe3c8',

  // Arc call-log segment colors (kept for optional overlays)
  segRed:    '#c0392b',
  segGreen:  '#5a9e6f',
  segAmber:  '#e6c34d',
  segWhite:  '#efe3c8',

  // Legacy aliases (keep older imports valid)
  background: '#16243f',
  navy:       '#16243f',
  white:      '#efe3c8',
  crimson:    '#c0512c',
  dimText:    '#c8bb9c',
  border:     '#efe3c8',
  primary:    '#efe3c8',
} as const;

export const FONTS = {
  display: 'PlayfairDisplay_700Bold',          // header, wordmark, big numerals
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  serif: 'EBGaramond_500Medium',               // tabs, labels
  serifBold: 'EBGaramond_600SemiBold',
} as const;

export const LAYOUT = {
  framePadding:    10,
  sidebarWidth:    40,
  headerHeight:    52,
  bottomNavHeight: 64,
  fabSize:         62,
  fabRadius:       31,
} as const;
