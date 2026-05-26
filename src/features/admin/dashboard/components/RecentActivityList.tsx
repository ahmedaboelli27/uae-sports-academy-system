import { formatDistanceToNow } from 'date-fns';
import {
  CalendarPlus,
  ClipboardCheck,
  CreditCard,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardActivity, DashboardActivityType } from '@/types';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS: Record<DashboardActivityType, LucideIcon> = {
  enrollment: UserPlus,
  payment: CreditCard,
  attendance: ClipboardCheck,
  trial: CalendarPlus,
  subscription: RefreshCw,
  alert: ClipboardCheck,
};

const ACTIVITY_COLORS: Record<DashboardActivityType, string> = {
  enrollment: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  payment: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  attendance: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  trial: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  subscription: 'bg-primary/10 text-primary',
  alert: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

interface RecentActivityListProps {
  activities: DashboardActivity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
        <CardDescription>Latest operations across the academy</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => {
            const Icon = ACTIVITY_ICONS[activity.type];
            return (
              <li key={activity.id} className="flex gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    ACTIVITY_COLORS[activity.type],
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium leading-tight">{activity.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    {activity.actor ? ` · ${activity.actor}` : ''}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
