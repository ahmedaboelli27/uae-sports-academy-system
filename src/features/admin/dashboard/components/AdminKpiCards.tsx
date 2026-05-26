import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CreditCard,
  GraduationCap,
  RefreshCw,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatKpiValue } from '@/features/admin/dashboard/lib/format-kpi';
import type { AdminDashboardKpiDto } from '@/features/admin/dashboard/types/admin-dashboard.dto';
import type { DashboardKpiKey } from '@/types';
import { cn } from '@/lib/utils';

const KPI_ICONS: Record<DashboardKpiKey, LucideIcon> = {
  totalStudents: Users,
  activeStudents: UserCheck,
  activeSubscriptions: RefreshCw,
  expiredSubscriptions: Activity,
  pendingPayments: CreditCard,
  monthlyRevenue: Wallet,
  revenueByProgram: TrendingUp,
  revenueByBranch: Building2,
  attendanceRate: Target,
  trialToPaidConversion: TrendingUp,
  renewalRate: RefreshCw,
  dropoutRate: ArrowDownRight,
  coachUtilization: GraduationCap,
  branchUtilization: Building2,
  leadSources: Users,
  outstandingPayments: Wallet,
};

interface AdminKpiCardsProps {
  kpis: AdminDashboardKpiDto[];
}

export function AdminKpiCards({ kpis }: AdminKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.key] ?? Activity;
        const trendUp = kpi.trend !== undefined && kpi.trend >= 0;
        const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight;

        return (
          <Card
            key={kpi.key}
            className="border-border/60 bg-card transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-2 truncate text-2xl font-bold tracking-tight">
                    {formatKpiValue(kpi)}
                  </p>
                  {kpi.trend !== undefined ? (
                    <p
                      className={cn(
                        'mt-2 flex items-center gap-1 text-xs font-medium',
                        trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      <TrendIcon className="h-3.5 w-3.5 shrink-0" />
                      {trendUp ? '+' : ''}
                      {kpi.trend}% vs last period
                    </p>
                  ) : null}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
