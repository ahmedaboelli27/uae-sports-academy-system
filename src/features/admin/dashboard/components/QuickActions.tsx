import {
  BarChart3,
  CalendarPlus,
  ClipboardCheck,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardQuickAction } from '@/types';
import { cn } from '@/lib/utils';

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
  'user-plus': UserPlus,
  'clipboard-check': ClipboardCheck,
  wallet: Wallet,
  'calendar-plus': CalendarPlus,
  users: Users,
  'bar-chart-3': BarChart3,
};

interface QuickActionsProps {
  actions: DashboardQuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.icon] ?? UserPlus;
            return (
              <Link
                key={action.id}
                to={action.path}
                className={cn(
                  'group flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3',
                  'transition-colors hover:border-primary/40 hover:bg-accent/50',
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
