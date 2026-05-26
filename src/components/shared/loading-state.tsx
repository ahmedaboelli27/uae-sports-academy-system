import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
    </div>
  );
}
