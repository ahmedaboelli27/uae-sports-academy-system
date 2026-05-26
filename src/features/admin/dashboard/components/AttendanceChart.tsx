import {
  CartesianGrid,
  Line,
  LineChart,
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

interface AttendanceChartProps {
  data: TimeSeriesDataPoint[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = data.map((d) => ({ name: d.period, rate: d.value }));

  return (
    <DashboardChartCard
      title="Attendance Trend"
      description="Weekly attendance rate across all programs"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="name" tick={axisTickStyle} axisLine={false} tickLine={false} />
          <YAxis
            domain={[80, 100]}
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            formatter={(value: number) => [`${value}%`, 'Attendance']}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
}
