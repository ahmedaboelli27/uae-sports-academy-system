import {
  Globe2,
  LogIn,
  LogOut,
  Moon,
  PanelTop,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/config/app';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

type ThemeMode = 'light' | 'dark';

interface TopbarProps {
  portalLabel?: string;
  logoSrc?: string;
}

function getUserInitials(firstName?: string, lastName?: string) {
  const firstInitial = firstName?.trim()?.[0] ?? '';
  const lastInitial = lastName?.trim()?.[0] ?? '';

  const initials = `${firstInitial}${lastInitial}`.trim();

  return initials || 'U';
}

function applyTheme(theme: ThemeMode) {
  const root = window.document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  window.localStorage.setItem('academy-theme', theme);
}

export function Topbar({ portalLabel, logoSrc = '/logo.png' }: TopbarProps) {
  const { t, i18n } = useTranslation();
  const { toggleLocale } = useLocale();
  const { isAuthenticated, currentUser, logout } = useAuthStore();

  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showLogoImage, setShowLogoImage] = useState(true);

  const isArabic = i18n.language?.startsWith('ar');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('academy-theme') as
      | ThemeMode
      | null;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme: ThemeMode = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const userInitials = useMemo(
    () => getUserInitials(currentUser?.firstName, currentUser?.lastName),
    [currentUser?.firstName, currentUser?.lastName],
  );

  const roleLabel = currentUser?.role
    ? t(`topbar.roles.${currentUser.role}`, {
      defaultValue: currentUser.role,
    })
    : t('topbar.roles.guest', {
      defaultValue: 'Guest',
    });

  const languageButtonLabel = isArabic
    ? t('topbar.languageSwitch.english', {
      defaultValue: 'English',
    })
    : t('topbar.languageSwitch.arabic', {
      defaultValue: 'العربية',
    });

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 px-4 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <div className="flex h-20 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl transition hover:-translate-y-0.5"
          >
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-yellow text-brand-blue shadow-brand-yellow ring-1 ring-brand-yellow/30 transition group-hover:scale-105">
              {showLogoImage ? (
                <img
                  src={logoSrc}
                  alt={APP_NAME}
                  className="h-full w-full object-cover"
                  onError={() => setShowLogoImage(false)}
                />
              ) : (
                <PanelTop className="h-7 w-7" />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-base font-black tracking-tight text-brand-blue dark:text-white">
                {APP_NAME}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand-yellow" />
                {t('topbar.systemLabel', {
                  defaultValue: 'Academy Portal',
                })}
              </p>
            </div>
          </Link>

          {portalLabel ? (
            <div className="hidden min-w-0 items-center gap-3 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-2 text-brand-blue shadow-sm dark:text-brand-yellow md:flex">
              <ShieldCheck className="h-4 w-4 shrink-0" />

              <span className="truncate text-sm font-black">
                {portalLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            aria-label={t('topbar.languageSwitch.ariaLabel', {
              defaultValue: 'Change language',
            })}
            className="h-11 gap-2 rounded-full border border-border bg-card px-3 font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10"
          >
            <Globe2 className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />

            <span className="hidden text-sm font-black sm:inline">
              {languageButtonLabel}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? t('topbar.theme.switchToLight', {
                  defaultValue: 'Switch to light mode',
                })
                : t('topbar.theme.switchToDark', {
                  defaultValue: 'Switch to dark mode',
                })
            }
            className="h-11 gap-2 rounded-full border border-border bg-card px-3 font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-brand-yellow" />
            ) : (
              <Moon className="h-4 w-4 text-brand-blue" />
            )}

            <span className="hidden text-sm font-black lg:inline">
              {theme === 'dark'
                ? t('topbar.theme.light', {
                  defaultValue: 'Light',
                })
                : t('topbar.theme.dark', {
                  defaultValue: 'Dark',
                })}
            </span>
          </Button>

          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-3 rounded-full border border-border bg-card py-1.5 pe-4 ps-1.5 shadow-sm md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-black uppercase text-white dark:bg-brand-yellow dark:text-brand-blue">
                  {userInitials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-foreground">
                    {currentUser.firstName}
                  </p>

                  <p className="truncate text-xs font-bold text-muted-foreground">
                    {roleLabel}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={logout}
                className={cn(
                  'h-11 gap-2 rounded-full border-border bg-background px-3 font-black shadow-sm transition',
                  'hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-700',
                  'dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-300',
                )}
              >
                <LogOut className="h-4 w-4" />

                <span className="hidden sm:inline">
                  {t('common.logout', {
                    defaultValue: 'Logout',
                  })}
                </span>
              </Button>
            </div>
          ) : (
            <Link to={ROUTE_PATHS.auth.login}>
              <Button
                variant="outline"
                size="sm"
                className="h-11 gap-2 rounded-full border-border bg-background px-4 font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
              >
                <LogIn className="h-4 w-4" />

                {t('nav.login', {
                  defaultValue: 'Login',
                })}
              </Button>
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm sm:flex">
              <UserRound className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}