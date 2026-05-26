import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BadgePercent,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  FileText,
  FolderOpen,
  Gauge,
  Image,
  LayoutGrid,
  Megaphone,
  Menu,
  MessageSquare,
  NotebookText,
  PartyPopper,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Trophy,
  UserCog,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import { cn } from '@/lib/utils';

export type SidebarRole = 'admin' | 'accountant' | 'coach' | 'parent';

export interface SidebarItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  allowedRoles?: SidebarRole[];
  badge?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  className?: string;
  currentRole?: SidebarRole;
}

function normalizeLabel(label: string) {
  return label
    .trim()
    .replace(/\s+/g, '')
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

function getSidebarIcon(item: SidebarItem): LucideIcon {
  if (item.icon) {
    return item.icon;
  }

  const path = item.path.toLowerCase();
  const label = normalizeLabel(item.label).toLowerCase();

  if (path.includes('dashboard') || label.includes('dashboard')) return Gauge;
  if (path.includes('students') || label.includes('student')) return UsersRound;
  if (path.includes('parents') || label.includes('parent')) return UserRound;
  if (path.includes('coaches') || label.includes('coach')) return Dumbbell;
  if (path.includes('programs') || label.includes('program')) return Trophy;
  if (path.includes('sports') || label.includes('sport')) return Trophy;
  if (path.includes('branches') || label.includes('branch')) return Building2;
  if (path.includes('schedule') || label.includes('schedule')) return CalendarDays;
  if (path.includes('attendance') || label.includes('attendance')) return ClipboardCheck;

  if (path.includes('finance') || label.includes('finance')) return WalletCards;
  if (path.includes('subscriptions') || label.includes('subscription')) return CreditCard;
  if (path.includes('payments') || label.includes('payment')) return CreditCard;
  if (path.includes('invoices') || label.includes('invoice')) return Receipt;

  if (path.includes('offers') || label.includes('offer')) return BadgePercent;
  if (path.includes('coupons') || label.includes('coupon')) return TicketPercent;
  if (path.includes('events') || label.includes('event')) return PartyPopper;
  if (path.includes('camps') || label.includes('camp')) return FolderOpen;
  if (path.includes('leads') || label.includes('lead')) return Megaphone;
  if (path.includes('trial') || label.includes('trial')) return Sparkles;

  if (path.includes('reports') || label.includes('report')) return BarChart3;
  if (path.includes('notifications') || label.includes('notification')) return Bell;

  if (path.includes('cms') || label.includes('cms')) return FileText;
  if (path.includes('gallery') || label.includes('gallery')) return Image;

  if (path.includes('users') || label.includes('user')) return UserCog;
  if (path.includes('roles') || label.includes('permission')) return ShieldCheck;
  if (path.includes('settings') || label.includes('setting')) return Settings;
  if (path.includes('audit') || label.includes('audit')) return NotebookText;

  if (path.includes('messages') || label.includes('message')) return MessageSquare;
  if (path.includes('documents') || label.includes('document')) return FileText;
  if (path.includes('incident') || label.includes('incident')) return AlertTriangle;

  return LayoutGrid;
}

function getSidebarTranslationKey(item: SidebarItem) {
  const path = item.path.toLowerCase();

  if (path.includes('dashboard')) return 'dashboard';
  if (path.includes('students')) return 'students';
  if (path.includes('parents')) return 'parents';
  if (path.includes('coaches')) return 'coaches';
  if (path.includes('programs')) return 'programs';
  if (path.includes('sports')) return 'sports';
  if (path.includes('branches')) return 'branches';
  if (path.includes('schedule')) return 'schedule';
  if (path.includes('attendance')) return 'attendance';

  if (path.includes('finance/subscriptions')) return 'subscriptions';
  if (path.includes('finance/payments')) return 'payments';
  if (path.includes('finance/invoices')) return 'invoices';
  if (path.includes('finance')) return 'finance';

  if (path.includes('offers')) return 'offers';
  if (path.includes('coupons')) return 'coupons';
  if (path.includes('events')) return 'events';
  if (path.includes('camps')) return 'camps';
  if (path.includes('leads')) return 'leads';
  if (path.includes('trial')) return 'trialRequests';

  if (path.includes('reports')) return 'reports';
  if (path.includes('notifications')) return 'notifications';

  if (path.includes('cms/home')) return 'cmsHome';
  if (path.includes('cms/gallery')) return 'cmsGallery';
  if (path.includes('cms')) return 'cms';

  if (path.includes('users')) return 'users';
  if (path.includes('roles')) return 'rolesPermissions';
  if (path.includes('settings')) return 'settings';
  if (path.includes('audit')) return 'auditLogs';

  if (path.includes('today')) return 'todaySessions';
  if (path.includes('assessments')) return 'assessments';
  if (path.includes('progress')) return 'progressNotes';
  if (path.includes('incident')) return 'incidentReport';
  if (path.includes('documents')) return 'documents';
  if (path.includes('messages')) return 'messages';
  if (path.includes('profile')) return 'profileSettings';
  if (path.includes('children')) return 'myChildren';
  if (path.includes('make-up') || path.includes('makeup')) return 'makeUpRequest';

  return normalizeLabel(item.label);
}

function getItemLabel(item: SidebarItem, t: ReturnType<typeof useTranslation>['t']) {
  const key = getSidebarTranslationKey(item);

  return t(`sidebar.items.${key}`, {
    defaultValue: item.label,
  });
}

export function Sidebar({
  items,
  title,
  className,
  currentRole,
}: SidebarProps) {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarItems = useMemo(() => {
    const canSeeAdminBranches = currentRole === 'admin';

    const hasBranchesItem = items.some(
      (item) => item.path === ROUTE_PATHS.admin.branches,
    );

    const adminBranchesItem: SidebarItem = {
      label: 'branches',
      path: ROUTE_PATHS.admin.branches,
      icon: Building2,
      allowedRoles: ['admin'],
    };

    const nextItems =
      canSeeAdminBranches && !hasBranchesItem
        ? [...items, adminBranchesItem]
        : items;

    return nextItems.filter((item) => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }

      if (!currentRole) {
        return false;
      }

      return item.allowedRoles.includes(currentRole);
    });
  }, [items, currentRole]);

  const renderSidebarContent = (options?: { onNavigate?: () => void; isMobile?: boolean }) => {
    const onNavigate = options?.onNavigate;
    const isMobile = options?.isMobile ?? false;

    return (
      <>
        <div className="px-4 pb-3 pt-4">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-yellow/20 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-5 text-white shadow-brand">
            <div className="absolute -end-10 -top-10 h-28 w-28 rounded-full bg-brand-yellow/20 blur-2xl" />
            <div className="absolute -bottom-12 -start-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue shadow-brand-yellow">
                <LayoutGrid className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-white/60">
                  {title ?? t('sidebar.title')}
                </p>

                <h2 className="mt-1 truncate text-lg font-black tracking-tight">
                  {t('sidebar.navigation')}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <nav
          className={cn(
            'flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3',
            isMobile ? 'pb-6' : '',
          )}
        >
          {sidebarItems.map((item) => {
            const Icon = getSidebarIcon(item);
            const label = getItemLabel(item, t);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path.split('/').filter(Boolean).length <= 2}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-black transition-all duration-200',
                    isActive
                      ? 'border-brand-yellow/40 bg-brand-yellow text-brand-blue shadow-brand-yellow'
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground hover:shadow-sm',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                        isActive
                          ? 'bg-brand-blue text-white shadow-sm'
                          : 'bg-secondary text-muted-foreground group-hover:bg-brand-blue/10 group-hover:text-brand-blue dark:group-hover:text-brand-yellow',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1 truncate">
                      {label}
                    </span>

                    {item.badge ? (
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-black',
                          isActive
                            ? 'bg-brand-blue/10 text-brand-blue'
                            : 'bg-brand-yellow/15 text-brand-blue dark:text-brand-yellow',
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}

                    <ChevronRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-all rtl:rotate-180',
                        isActive
                          ? 'translate-x-0 opacity-100 rtl:translate-x-0'
                          : 'opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5',
                      )}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border/70 p-4">
          <div className="rounded-[1.5rem] border border-border bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-muted-foreground">
                  {t('sidebar.footer.label')}
                </p>

                <p className="mt-0.5 truncate text-sm font-black text-brand-blue dark:text-brand-yellow">
                  {currentRole
                    ? t(`sidebar.roles.${currentRole}`)
                    : t('sidebar.roles.unknown')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed start-4 top-24 z-[80] inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-2xl ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue lg:hidden"
        aria-label={t('sidebar.openMenu', { defaultValue: 'Open sidebar menu' })}
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            type="button"
            aria-label={t('sidebar.closeMenu', { defaultValue: 'Close sidebar menu' })}
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-brand-dark/55 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[86vw] max-w-[22rem] flex-col border-r border-border/70 bg-background/98 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                  <LayoutGrid className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    {title ?? t('sidebar.title')}
                  </p>
                  <p className="text-sm font-black text-brand-blue dark:text-brand-yellow">
                    {t('sidebar.navigation')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground transition hover:bg-brand-blue hover:text-white dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
                aria-label={t('sidebar.closeMenu', { defaultValue: 'Close sidebar menu' })}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {renderSidebarContent({
              isMobile: true,
              onNavigate: () => setIsMobileOpen(false),
            })}
          </aside>
        </div>
      ) : null}

      <aside
        className={cn(
          'hidden h-screen w-72 shrink-0 border-r border-border/70 bg-background/95 shadow-sm backdrop-blur-xl lg:flex lg:flex-col',
          className,
        )}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}