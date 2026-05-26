import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardAlert, DashboardAlertSeverity } from '@/types';
import { cn } from '@/lib/utils';

const ALERT_STYLES: Record<
  DashboardAlertSeverity,
  { icon: LucideIcon; container: string; iconWrap: string }
> = {
  critical: {
    icon: AlertCircle,
    container: 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30',
    iconWrap: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    container: 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30',
    iconWrap: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
  },
  info: {
    icon: Info,
    container: 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30',
    iconWrap: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  },
};

interface AdminAlertsProps {
  alerts: DashboardAlert[];
}

export function AdminAlerts({ alerts }: AdminAlertsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Operational Alerts</CardTitle>
        <CardDescription>Items requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const style = ALERT_STYLES[alert.severity];
          const Icon = style.icon;
          return (
            <div
              key={alert.id}
              className={cn('flex gap-3 rounded-lg border p-3', style.container)}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  style.iconWrap,
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{alert.message}</p>
                {alert.actionLabel && alert.actionPath ? (
                  <Link
                    to={alert.actionPath}
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {alert.actionLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
