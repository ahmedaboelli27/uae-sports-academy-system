import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  className?: string;
}

export function StatCard({ title, value, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        {trend !== undefined ? (
          <p className={cn('mt-1 text-xs', trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
            {trend >= 0 ? '+' : ''}
            {trend}% vs last period
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
