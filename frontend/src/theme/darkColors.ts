// Dark mode color overrides — layered on the same token structure as light mode

import { purple, gold } from './colors';

export const darkSurface = {
  bg: '#121218',
  card: '#1A1A24',
  elevated: '#22222E',
  sidebar: '#16161E',
} as const;

export const darkText = {
  primary: '#F0F0F5',
  secondary: '#A1A1B5',
  tertiary: '#6B6B80',
  inverse: '#121218',
} as const;

export const darkBorder = {
  default: '#2A2A3A',
  subtle: '#1E1E2A',
  hover: purple[400],
} as const;

export const darkBrand = {
  primary: purple[500],
  primaryHover: purple[400],
  primaryLight: purple[900] + '60',
  secondary: gold[500],
  secondaryHover: gold[400],
  secondaryLight: gold[900] + '40',
} as const;

export const darkSemantic = {
  success: '#34D399',
  error: '#F87171',
  warning: gold[400],
} as const;

export const darkOverlay = {
  backdrop: 'rgba(0, 0, 0, 0.6)',
} as const;
