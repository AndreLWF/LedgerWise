// Purple & Gold Brand System — design tokens for the entire app

export const purple = {
  50: '#FAF5FF',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#A855F7',
  600: '#9333EA',
  700: '#7E22CE',
  800: '#6B21A8',
  900: '#581C87',
} as const;

export const gold = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

export const surface = {
  bg: '#FAFAF9',
  card: '#FFFFFF',
  elevated: '#FFFFFF',
  sidebar: '#F8F7F6',
} as const;

export const text = {
  primary: '#1A1A2E',
  secondary: '#52525B',
  tertiary: '#A1A1AA',
  inverse: '#FFFFFF',
} as const;

export const border = {
  default: '#E5E5E5',
  subtle: '#F4F4F5',
  hover: purple[200],
} as const;

export const brand = {
  primary: purple[600],
  primaryHover: purple[700],
  primaryLight: purple[50],
  secondary: gold[500],
  secondaryHover: gold[600],
  secondaryLight: gold[50],
} as const;

export const semantic = {
  success: '#22C55E',
  error: '#EF4444',
  warning: gold[500],
} as const;

export const overlay = {
  backdrop: 'rgba(0, 0, 0, 0.4)',
} as const;
