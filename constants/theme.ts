export const COLORS = {
  navy:    '#0B1929',
  navyLight: '#0F2237',
  crimson: '#8B1A1A',
  white:   '#FFFFFF',
  border:  'rgba(255,255,255,0.16)',
  dimText: 'rgba(255,255,255,0.5)',
  arcRail: 'rgba(255,255,255,0.82)',
  tickStroke: 'rgba(255,255,255,0.5)',
  tickLabel:  'rgba(255,255,255,0.75)',
  dashedBorder: 'rgba(255,255,255,0.28)',

  // Call-type segment colors (used on the arc when calls are logged)
  segRed:    '#7B1111',
  segGreen:  '#2E6B2E',
  segAmber:  '#B8870A',
  segWhite:  '#D8D8D8',
} as const;

export const LAYOUT = {
  sidebarWidth:    44,
  headerHeight:    52,
  bottomNavHeight: 58,
  fabSize:         54,
  fabRadius:       27,
} as const;
