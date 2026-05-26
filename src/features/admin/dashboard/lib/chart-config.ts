/** Recharts theme tokens — work in light & dark via CSS variables */
export const CHART_COLORS = {
  primary: 'hsl(173 80% 32%)',
  primaryLight: 'hsl(173 60% 45%)',
  secondary: 'hsl(215 16% 47%)',
  accent: 'hsl(173 60% 55%)',
  grid: 'hsl(var(--border))',
  muted: 'hsl(var(--muted-foreground))',
  series: [
    'hsl(173 80% 32%)',
    'hsl(199 89% 48%)',
    'hsl(262 83% 58%)',
    'hsl(38 92% 50%)',
    'hsl(0 84% 60%)',
  ],
} as const;

export const chartMargin = { top: 8, right: 8, left: 0, bottom: 0 };

export const axisTickStyle = {
  fontSize: 12,
  fill: 'hsl(var(--muted-foreground))',
};

export const tooltipContentStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--card-foreground))',
};
