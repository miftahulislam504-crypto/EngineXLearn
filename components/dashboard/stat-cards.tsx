import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-xl font-semibold leading-tight">{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressCard({
  title,
  percent,
  detail,
}: {
  title: string;
  percent: number;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-2xl font-semibold">{percent}%</span>
          <span className="text-xs text-muted-foreground">{detail}</span>
        </div>
        <Progress value={percent} className="mt-3" />
      </CardContent>
    </Card>
  );
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="font-display text-sm font-semibold">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
