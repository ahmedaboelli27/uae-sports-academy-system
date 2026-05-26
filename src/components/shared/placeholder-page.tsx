import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">{t('placeholder.implementLater')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
