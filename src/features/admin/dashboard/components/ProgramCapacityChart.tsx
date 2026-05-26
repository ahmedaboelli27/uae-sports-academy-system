import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
import type { ChartDataPoint, MultiMetricDataPoint } from '@/types';

interface ProgramCapacityChartProps {
  capacityData: MultiMetricDataPoint[];
  studentsByProgram: ChartDataPoint[];
}

export function ProgramCapacityChart({
  capacityData,
  studentsByProgram,
}: ProgramCapacityChartProps) {
  const capacityChartData = capacityData.map((d) => ({
    name: d.label,
    enrolled: d.enrolled,
    capacity: d.capacity,
    utilization: Math.round((d.enrolled / d.capacity) * 100),
  }));

  const pieData = studentsByProgram.map((d) => ({ name: d.label, value: d.value }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardChartCard
        title="Students by Program"
        description="Active student distribution across programs"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS.series[index % CHART_COLORS.series.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} formatter={(value: number) => [value, 'Students']} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </DashboardChartCard>

      <DashboardChartCard
        title="Program Capacity"
        description="Enrolled vs maximum capacity per program"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={capacityChartData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="name" tick={axisTickStyle} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={50} />
            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipContentStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="enrolled" name="Enrolled" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="capacity" name="Capacity" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardChartCard>
    </div>
  );
}
