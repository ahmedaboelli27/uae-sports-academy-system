import type { AdminDashboardKpiDto } from '@/features/admin/dashboard/types/admin-dashboard.dto';

export function formatKpiValue(kpi: AdminDashboardKpiDto): string {
  if (kpi.format === 'currency') {
    return `${kpi.value.toLocaleString()} ${kpi.unit ?? 'AED'}`;
  }
  if (kpi.format === 'percent') {
    return `${kpi.value}%`;
  }
  return kpi.value.toLocaleString();
}
