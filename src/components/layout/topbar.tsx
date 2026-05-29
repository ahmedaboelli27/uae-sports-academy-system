import {
  Bell,
  ChevronDown,
  Globe2,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  PanelTop,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/config/app';
import { getAdminUnreadNotificationCount } from '@/features/admin/notifications/services/admin-notifications.service';
import {
  useAuthStore,
  type AuthUser,
} from '@/features/auth/pages/auth.store';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

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

function getDisplayName(firstName?: string, lastName?: string, email?: string) {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  return fullName || email || 'User';
}

function getProfileRoute(role?: string) {
  if (role === 'parent') {
    return '/parent/profile';
  }

  if (role === 'coach') {
    return ROUTE_PATHS.coach.profile;
  }

  if (role === 'accountant') {
    return ROUTE_PATHS.admin.finance;
  }

  if (role === 'admin') {
    return '/admin/profile';
  }

  return ROUTE_PATHS.auth.login;
}

function getPortalRoute(role?: string) {
  if (role === 'parent') {
    return ROUTE_PATHS.parent.dashboard;
  }

  if (role === 'coach') {
    return ROUTE_PATHS.coach.dashboard;
  }

  if (role === 'admin') {
    return ROUTE_PATHS.admin.dashboard;
  }

  if (role === 'accountant') {
    return ROUTE_PATHS.admin.finance;
  }

  return ROUTE_PATHS.auth.login;
}

function getNotificationRoute(role?: string) {
  if (role === 'parent') {
    return ROUTE_PATHS.parent.messages;
  }

  if (role === 'coach') {
    return ROUTE_PATHS.coach.messages;
  }

  if (role === 'admin') {
    return ROUTE_PATHS.admin.notifications;
  }

  if (role === 'accountant') {
    return ROUTE_PATHS.admin.finance;
  }

  return ROUTE_PATHS.auth.login;
}

function getPortalLabel(role?: string) {
  if (role === 'parent') return 'Parent Portal';
  if (role === 'coach') return 'Coach Portal';
  if (role === 'admin') return 'Admin Portal';
  if (role === 'accountant') return 'Finance Portal';

  return 'My Portal';
}

function getRoleTone(role?: string) {
  if (role === 'admin') {
    return {
      badge:
        'border-brand-yellow/35 bg-brand-yellow/15 text-brand-blue dark:text-brand-yellow',
      dot: 'bg-brand-yellow',
      label: 'Admin Access',
    };
  }

  if (role === 'accountant') {
    return {
      badge:
        'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      label: 'Finance Access',
    };
  }

  if (role === 'coach') {
    return {
      badge:
        'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
      label: 'Coach Access',
    };
  }

  if (role === 'parent') {
    return {
      badge:
        'border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500',
      label: 'Parent Access',
    };
  }

  return {
    badge: 'border-border bg-secondary text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Guest Access',
  };
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
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const hydrateMe = useAuthStore((state) => state.hydrateMe);
  const logout = useAuthStore((state) => state.logout);

  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showLogoImage, setShowLogoImage] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const isArabic = i18n.language?.startsWith('ar');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('academy-theme') as
      | ThemeMode
      | null;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme: ThemeMode =
      savedTheme ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem('access_token');

    if (!token || currentUser || isAuthenticated) {
      return;
    }

    void hydrateMe().catch(() => {
      logout();
    });
  }, [currentUser, hydrateMe, isAuthenticated, logout]);

  useEffect(() => {
    setIsAccountOpen(false);
  }, [location.pathname]);

  const shouldLoadAdminNotifications =
    isAuthenticated && currentUser?.role === 'admin';

  const refreshUnreadNotifications = useCallback(async () => {
    if (!shouldLoadAdminNotifications) {
      setUnreadNotificationsCount(0);
      return;
    }

    try {
      const count = await getAdminUnreadNotificationCount();
      setUnreadNotificationsCount(count);
    } catch {
      setUnreadNotificationsCount(0);
    }
  }, [shouldLoadAdminNotifications]);

  useEffect(() => {
    if (!shouldLoadAdminNotifications) {
      setUnreadNotificationsCount(0);
      return;
    }

    void refreshUnreadNotifications();

    const timer = window.setInterval(() => {
      void refreshUnreadNotifications();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [refreshUnreadNotifications, shouldLoadAdminNotifications]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const profileRoute = useMemo(
    () => getProfileRoute(currentUser?.role),
    [currentUser?.role],
  );

  const portalRoute = useMemo(
    () => getPortalRoute(currentUser?.role),
    [currentUser?.role],
  );

  const portalButtonLabel = useMemo(
    () => getPortalLabel(currentUser?.role),
    [currentUser?.role],
  );

  const roleTone = useMemo(
    () => getRoleTone(currentUser?.role),
    [currentUser?.role],
  );

  const notificationRoute = useMemo(
    () => getNotificationRoute(currentUser?.role),
    [currentUser?.role],
  );

  const userInitials = useMemo(
    () => getUserInitials(currentUser?.firstName, currentUser?.lastName),
    [currentUser?.firstName, currentUser?.lastName],
  );

  const displayName = useMemo(
    () =>
      getDisplayName(
        currentUser?.firstName,
        currentUser?.lastName,
        currentUser?.email,
      ),
    [currentUser?.email, currentUser?.firstName, currentUser?.lastName],
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

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    setUnreadNotificationsCount(0);
    navigate(ROUTE_PATHS.public.home);
  };

  return (
    <header className="sticky top-0 z-[90] border-b border-brand-blue/10 bg-background/88 px-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/78 dark:border-brand-yellow/15 sm:px-4 lg:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,18,155,0.08),transparent_26%)] dark:bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.06),transparent_26%)]" />

      <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          <Link
            to={ROUTE_PATHS.public.home}
            className="group flex min-w-0 items-center gap-3 rounded-[1.6rem] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-brand-yellow/30"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-brand-yellow text-brand-blue shadow-[0_18px_38px_rgba(255,212,0,0.26)] ring-1 ring-brand-yellow/40 transition group-hover:rotate-2 group-hover:scale-105 sm:h-14 sm:w-14">
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-brand-blue/10" />

              {showLogoImage ? (
                <img
                  src={logoSrc}
                  alt={APP_NAME}
                  className="relative h-full w-full object-cover"
                  onError={() => setShowLogoImage(false)}
                />
              ) : (
                <PanelTop className="relative h-7 w-7" />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-base font-black tracking-tight text-brand-blue dark:text-white">
                {APP_NAME}
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand-yellow" />
                {t('topbar.systemLabel', {
                  defaultValue: 'Academy Portal',
                })}
              </p>
            </div>
          </Link>

          {portalLabel ? (
            <div className="hidden min-w-0 items-center gap-3 rounded-full border border-brand-yellow/35 bg-brand-yellow/10 px-4 py-2 text-brand-blue shadow-sm dark:text-brand-yellow md:flex">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm font-black">{portalLabel}</span>
            </div>
          ) : null}

          {isAuthenticated && currentUser ? (
            <div
              className={cn(
                'hidden items-center gap-2 rounded-full border px-3 py-2 shadow-sm lg:flex',
                roleTone.badge,
              )}
            >
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]',
                  roleTone.dot,
                )}
              />

              <span className="text-xs font-black uppercase tracking-[0.14em]">
                {t(`topbar.access.${currentUser.role}`, {
                  defaultValue: roleTone.label,
                })}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to={ROUTE_PATHS.public.home}
            className={cn(
              'group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-3 text-sm font-black text-brand-blue shadow-sm transition',
              'hover:-translate-y-0.5 hover:border-brand-yellow/60 hover:bg-brand-blue hover:text-white hover:shadow-[0_14px_28px_rgba(0,18,155,0.16)]',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow/30',
              'dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow dark:hover:bg-brand-yellow dark:hover:text-brand-blue',
            )}
          >
            <Home className="h-4 w-4 transition group-hover:scale-110" />
            <span className="hidden md:inline">
              {t('topbar.publicHome', {
                defaultValue: 'Public Home',
              })}
            </span>
          </Link>

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
            <div className="relative flex items-center gap-2">
              <Link
                to={notificationRoute}
                aria-label={t('topbar.notifications', {
                  defaultValue: 'Notifications',
                })}
                title={
                  unreadNotificationsCount > 0
                    ? `${unreadNotificationsCount} new notifications`
                    : t('topbar.notifications', {
                      defaultValue: 'Notifications',
                    })
                }
                className={cn(
                  'group relative hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-brand-blue shadow-sm outline-none transition sm:inline-flex',
                  'hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-[0_14px_28px_rgba(220,38,38,0.12)]',
                  'focus-visible:ring-4 focus-visible:ring-red-200',
                  'dark:text-brand-yellow dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-300',
                )}
              >
                <Bell className="h-5 w-5 transition group-hover:rotate-12 group-hover:scale-110" />

                {unreadNotificationsCount > 0 ? (
                  <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-red-600 px-1 text-[10px] font-black leading-none text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]">
                    {unreadNotificationsCount > 99
                      ? '99+'
                      : unreadNotificationsCount}
                  </span>
                ) : null}
              </Link>

              <button
                type="button"
                onClick={() => setIsAccountOpen((value) => !value)}
                className={cn(
                  'group flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pe-3 ps-1.5 shadow-sm outline-none transition',
                  'hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:shadow-[0_16px_35px_rgba(15,23,42,0.10)]',
                  'focus-visible:ring-4 focus-visible:ring-brand-yellow/30',
                )}
                aria-expanded={isAccountOpen}
                aria-label={t('topbar.accountMenu', {
                  defaultValue: 'Account menu',
                })}
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark text-sm font-black uppercase text-white shadow-[0_12px_25px_rgba(0,18,155,0.24)] ring-2 ring-brand-yellow/35 transition group-hover:scale-105 dark:from-brand-yellow dark:to-yellow-300 dark:text-brand-blue">
                  {userInitials}
                  <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500" />
                </div>

                <div className="hidden min-w-0 text-start md:block">
                  <p className="max-w-[10rem] truncate text-sm font-black text-foreground group-hover:text-brand-blue dark:group-hover:text-brand-yellow">
                    {displayName}
                  </p>

                  <p className="truncate text-xs font-bold text-muted-foreground">
                    {roleLabel}
                  </p>
                </div>

                <ChevronDown
                  className={cn(
                    'hidden h-4 w-4 text-muted-foreground transition md:block',
                    isAccountOpen ? 'rotate-180 text-brand-blue' : '',
                  )}
                />
              </button>

              {isAccountOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[80] cursor-default"
                    aria-label="Close account menu"
                    onClick={() => setIsAccountOpen(false)}
                  />

                  <div className="absolute end-0 top-[calc(100%+0.75rem)] z-[100]">
                    <AccountMenu
                      user={currentUser}
                      displayName={displayName}
                      roleLabel={roleLabel}
                      initials={userInitials}
                      portalLabel={portalButtonLabel}
                      portalRoute={portalRoute}
                      profileRoute={profileRoute}
                      notificationRoute={notificationRoute}
                      onClose={() => setIsAccountOpen(false)}
                      onLogout={handleLogout}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={ROUTE_PATHS.auth.login}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 gap-2 rounded-full border-border bg-background px-4 font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t('nav.login', {
                      defaultValue: 'Login',
                    })}
                  </span>
                </Button>
              </Link>

              <Link
                to={ROUTE_PATHS.auth.login}
                aria-label={t('nav.login', {
                  defaultValue: 'Login',
                })}
                title={t('nav.login', {
                  defaultValue: 'Login',
                })}
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-blue sm:inline-flex"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface AccountMenuProps {
  user: AuthUser;
  displayName: string;
  roleLabel: string;
  initials: string;
  portalLabel: string;
  portalRoute: string;
  profileRoute: string;
  notificationRoute: string;
  onClose: () => void;
  onLogout: () => void;
}

function AccountMenu({
  user,
  displayName,
  roleLabel,
  initials,
  portalLabel,
  portalRoute,
  profileRoute,
  notificationRoute,
  onClose,
  onLogout,
}: AccountMenuProps) {
  return (
    <div className="w-[320px] overflow-hidden rounded-[1.7rem] border border-brand-blue/10 bg-white/95 p-2 shadow-[0_28px_80px_rgba(0,18,155,0.22)] ring-1 ring-brand-blue/10 backdrop-blur-2xl dark:border-white/10 dark:bg-[#070d1f]/95 dark:ring-white/10">
      <div className="rounded-[1.35rem] bg-gradient-to-br from-brand-blue/[0.08] via-white to-brand-yellow/[0.18] p-4 dark:from-white/[0.08] dark:via-white/[0.04] dark:to-brand-yellow/[0.10]">
        <div className="flex items-center gap-3">
          <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-brand-yellow text-sm font-black uppercase text-brand-blue shadow-[0_14px_32px_rgba(255,212,0,0.28)] ring-2 ring-white/80 dark:ring-white/10">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950 dark:text-white">
              {displayName}
            </p>

            <p className="mt-0.5 truncate text-xs font-black text-brand-blue dark:text-brand-yellow">
              {roleLabel}
            </p>

            <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <Link
          to={ROUTE_PATHS.public.home}
          onClick={onClose}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <Home className="h-4 w-4" />
          </span>
          <span>Public Home</span>
        </Link>

        <Link
          to={portalRoute}
          onClick={onClose}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <span>{portalLabel}</span>
        </Link>

        <Link
          to={profileRoute}
          onClick={onClose}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <Settings className="h-4 w-4" />
          </span>
          <span>Profile settings</span>
        </Link>

        <Link
          to={notificationRoute}
          onClick={onClose}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <Bell className="h-4 w-4" />

            {unreadCountForMenuPlaceholder > 0 ? null : null}
          </span>
          <span>Notifications</span>
        </Link>

        <div className="my-2 h-px bg-border dark:bg-white/10" />

        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 transition group-hover:bg-red-600 group-hover:text-white dark:bg-red-500/10 dark:text-red-300">
            <LogOut className="h-4 w-4" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

const unreadCountForMenuPlaceholder = 0;

export default Topbar;