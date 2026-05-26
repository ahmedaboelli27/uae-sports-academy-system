import { ROUTE_PATHS } from '@/app/router/route-paths';

export const publicNavItems = [
  { labelKey: 'nav.home', path: ROUTE_PATHS.public.home },
  { labelKey: 'nav.about', path: ROUTE_PATHS.public.about },
  { labelKey: 'nav.programs', path: ROUTE_PATHS.public.programs },
  { labelKey: 'nav.coaches', path: ROUTE_PATHS.public.coaches },
  { labelKey: 'nav.locations', path: ROUTE_PATHS.public.locations },
  { labelKey: 'nav.pricing', path: ROUTE_PATHS.public.pricing },
  { labelKey: 'nav.contact', path: ROUTE_PATHS.public.contact },
] as const;

export const parentNavItems = [
  { labelKey: 'nav.dashboard', path: ROUTE_PATHS.parent.dashboard },
  { labelKey: 'nav.children', path: ROUTE_PATHS.parent.children },
  { labelKey: 'nav.subscriptions', path: ROUTE_PATHS.parent.subscriptions },
  { labelKey: 'nav.payments', path: ROUTE_PATHS.parent.payments },
  { labelKey: 'nav.messages', path: ROUTE_PATHS.parent.messages },
  { labelKey: 'nav.settings', path: ROUTE_PATHS.parent.settings },
] as const;

export const coachNavItems = [
  { labelKey: 'nav.dashboard', path: ROUTE_PATHS.coach.dashboard },
  { labelKey: 'nav.todaySessions', path: ROUTE_PATHS.coach.todaySessions },
  { labelKey: 'nav.students', path: ROUTE_PATHS.coach.students },
  { labelKey: 'nav.attendance', path: ROUTE_PATHS.coach.attendance },
  { labelKey: 'nav.schedule', path: ROUTE_PATHS.coach.schedule },
  { labelKey: 'nav.settings', path: ROUTE_PATHS.coach.settings },
] as const;

export const adminNavItems = [
  { labelKey: 'nav.dashboard', path: ROUTE_PATHS.admin.dashboard },
  { labelKey: 'nav.students', path: ROUTE_PATHS.admin.students },
  { labelKey: 'nav.parents', path: ROUTE_PATHS.admin.parents },
  { labelKey: 'nav.coaches', path: ROUTE_PATHS.admin.coaches },
  { labelKey: 'nav.programs', path: ROUTE_PATHS.admin.programs },

  {
    labelKey: 'nav.branches',
    path: ROUTE_PATHS.admin.branches,
    allowedRoles: ['admin'],
  },
  { labelKey: 'nav.schedule', path: ROUTE_PATHS.admin.schedule },
  { labelKey: 'nav.attendance', path: ROUTE_PATHS.admin.attendance },
  { labelKey: 'nav.finance', path: ROUTE_PATHS.admin.finance },
  { labelKey: 'nav.reports', path: ROUTE_PATHS.admin.reports },
  { labelKey: 'nav.settings', path: ROUTE_PATHS.admin.settings },
] as const;