import {
  Bar,
  BarChart,
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
import type { ChartDataPoint } from '@/types';

interface BranchPerformanceChartProps {
  data: ChartDataPoint[];
}

export function BranchPerformanceChart({ data }: BranchPerformanceChartProps) {
  const chartData = data.map((d) => ({ name: d.label, score: d.value }));

  return (
    <DashboardChartCard
      title="Branch Performance"
      description="Performance index by academy branch (0–100)"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ ...chartMargin, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={axisTickStyle} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            formatter={(value: number) => [`${value}`, 'Score']}
          />
          <Bar dataKey="score" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
}
