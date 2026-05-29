import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  Gauge,
  Home,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Settings,
  Trophy,
  UserRound,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import type { SidebarRole } from '@/components/layout/sidebar';

type NavigationItem = {
  labelKey: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  allowedRoles?: SidebarRole[];
  badge?: string;
};

export const publicNavItems = [
  {
    labelKey: 'nav.home',
    label: 'Home',
    path: ROUTE_PATHS.public.home,
    icon: Home,
  },
  {
    labelKey: 'nav.about',
    label: 'About',
    path: ROUTE_PATHS.public.about,
    icon: Info,
  },
  {
    labelKey: 'nav.programs',
    label: 'Programs',
    path: ROUTE_PATHS.public.programs,
    icon: Trophy,
  },
  {
    labelKey: 'nav.coaches',
    label: 'Coaches',
    path: ROUTE_PATHS.public.coaches,
    icon: Dumbbell,
  },
  {
    labelKey: 'nav.locations',
    label: 'Locations',
    path: ROUTE_PATHS.public.locations,
    icon: MapPin,
  },
  {
    labelKey: 'nav.pricing',
    label: 'Pricing',
    path: ROUTE_PATHS.public.pricing,
    icon: CreditCard,
  },
  {
    labelKey: 'nav.contact',
    label: 'Contact',
    path: ROUTE_PATHS.public.contact,
    icon: Mail,
  },
] satisfies NavigationItem[];

export const parentNavItems = [
  {
    labelKey: 'nav.dashboard',
    label: 'Dashboard',
    path: ROUTE_PATHS.parent.dashboard,
    icon: Gauge,
  },
  {
    labelKey: 'nav.children',
    label: 'My Children',
    path: ROUTE_PATHS.parent.children,
    icon: UsersRound,
  },
  {
    labelKey: 'nav.subscriptions',
    label: 'Subscriptions',
    path: ROUTE_PATHS.parent.subscriptions,
    icon: CreditCard,
  },
  {
    labelKey: 'nav.payments',
    label: 'Payments',
    path: ROUTE_PATHS.parent.payments,
    icon: WalletCards,
  },
  {
    labelKey: 'nav.messages',
    label: 'Messages',
    path: ROUTE_PATHS.parent.messages,
    icon: MessageSquare,
  },
  {
    labelKey: 'nav.settings',
    label: 'Settings',
    path: ROUTE_PATHS.parent.settings,
    icon: Settings,
  },
] satisfies NavigationItem[];

export const coachNavItems = [
  {
    labelKey: 'nav.dashboard',
    label: 'Dashboard',
    path: ROUTE_PATHS.coach.dashboard,
    icon: Gauge,
  },
  {
    labelKey: 'nav.todaySessions',
    label: 'Today Sessions',
    path: ROUTE_PATHS.coach.todaySessions,
    icon: CalendarDays,
  },
  {
    labelKey: 'nav.students',
    label: 'Students',
    path: ROUTE_PATHS.coach.students,
    icon: UsersRound,
  },
  {
    labelKey: 'nav.attendance',
    label: 'Attendance',
    path: ROUTE_PATHS.coach.attendance,
    icon: ClipboardCheck,
  },
  {
    labelKey: 'nav.schedule',
    label: 'Schedule',
    path: ROUTE_PATHS.coach.schedule,
    icon: CalendarCheck,
  },
  {
    labelKey: 'nav.settings',
    label: 'Settings',
    path: ROUTE_PATHS.coach.settings,
    icon: Settings,
  },
] satisfies NavigationItem[];

export const adminNavItems = [
  {
    labelKey: 'nav.dashboard',
    label: 'Dashboard',
    path: ROUTE_PATHS.admin.dashboard,
    icon: Gauge,
  },
  {
    labelKey: 'nav.students',
    label: 'Students',
    path: ROUTE_PATHS.admin.students,
    icon: UsersRound,
  },
  {
    labelKey: 'nav.parents',
    label: 'Parents',
    path: ROUTE_PATHS.admin.parents,
    icon: UserRound,
  },
  {
    labelKey: 'nav.coaches',
    label: 'Coaches',
    path: ROUTE_PATHS.admin.coaches,
    icon: Dumbbell,
  },
  {
    labelKey: 'nav.programs',
    label: 'Programs',
    path: ROUTE_PATHS.admin.programs,
    icon: Trophy,
  },
  {
    labelKey: 'nav.branches',
    label: 'Branches',
    path: ROUTE_PATHS.admin.branches,
    icon: Building2,
    allowedRoles: ['admin'],
  },
  {
    labelKey: 'nav.schedule',
    label: 'Schedule',
    path: ROUTE_PATHS.admin.schedule,
    icon: CalendarDays,
  },
  {
    labelKey: 'nav.attendance',
    label: 'Attendance',
    path: ROUTE_PATHS.admin.attendance,
    icon: ClipboardCheck,
  },
  {
    labelKey: 'nav.finance',
    label: 'Finance',
    path: ROUTE_PATHS.admin.finance,
    icon: WalletCards,
  },
  {
    labelKey: 'nav.reports',
    label: 'Reports',
    path: ROUTE_PATHS.admin.reports,
    icon: BarChart3,
  },
  {
    labelKey: 'nav.settings',
    label: 'Settings',
    path: ROUTE_PATHS.admin.settings,
    icon: Settings,
  },
] satisfies NavigationItem[];