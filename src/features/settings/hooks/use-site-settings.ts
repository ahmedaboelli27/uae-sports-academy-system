import { useEffect, useState } from 'react';
import {
  fallbackSiteSettings,
  getPublicSiteSettings,
} from '../services/settings.service';
import type { SiteSettingsDto } from '../types/settings.dto';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsDto>(fallbackSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void getPublicSiteSettings()
      .then((data) => {
        if (mounted) {
          setSettings(data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
