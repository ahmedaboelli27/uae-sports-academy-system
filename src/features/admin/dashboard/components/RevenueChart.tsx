import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardChartCard } from '@/features/admin/dashboard/components/DashboardChartCard';
import {
  CHART_COLORS,
  axisTickStyle,
  chartMargin,
  tooltipContentStyle,
} from '@/features/admin/dashboard/lib/chart-config';
import type { TimeSeriesDataPoint } from '@/types';

interface RevenueChartProps {
  data: TimeSeriesDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({ name: d.period, revenue: d.value }));

  return (
    <DashboardChartCard
      title="Revenue by Month"
      description="Monthly revenue in AED across all branches"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={chartMargin}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="name" tick={axisTickStyle} axisLine={false} tickLine={false} />
          <YAxis
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            formatter={(value: number) => [`${value.toLocaleString()} AED`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.primary}
            fill="url(#revenueGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
}
