import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useLocale() {
  const { i18n } = useTranslation();

  const setLocale = useCallback(
    (lng: 'en' | 'ar') => {
      void i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    },
    [i18n],
  );

  const toggleLocale = useCallback(() => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    setLocale(next);
  }, [i18n.language, setLocale]);

  return {
    locale: i18n.language as 'en' | 'ar',
    isRtl: i18n.language === 'ar',
    setLocale,
    toggleLocale,
  };
}
