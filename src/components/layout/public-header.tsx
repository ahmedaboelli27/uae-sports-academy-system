import { ROUTE_PATHS } from "@/app/router/route-paths";
import BrandLogo from "@/components/shared/BrandLogo";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore, type AuthUser } from "@/features/auth/pages/auth.store";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/role.types";
import { ROLE_REDIRECT_PATHS } from "@/types/role.types";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  CalendarDays,
  Camera,
  ChevronDown,
  CreditCard,
  Gift,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Medal,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  Trophy,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

interface PublicNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function isPathActive(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function getUserInitials(user: AuthUser | null) {
  const firstInitial = user?.firstName?.trim()?.[0] ?? "";
  const lastInitial = user?.lastName?.trim()?.[0] ?? "";
  const initials = `${firstInitial}${lastInitial}`.trim();

  return initials || "U";
}

function getDisplayName(user: AuthUser | null) {
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return fullName || user?.email || "User";
}

function getPortalPath(role: UserRole) {
  if (role === "guest") {
    return ROUTE_PATHS.auth.login;
  }

  return ROLE_REDIRECT_PATHS[role];
}

function getProfilePath(role: UserRole) {
  if (role === "parent") {
    return "/parent/profile";
  }

  if (role === "coach") {
    return "/coach/profile";
  }

  if (role === "admin" || role === "accountant") {
    return "/admin/profile";
  }

  return ROUTE_PATHS.auth.login;
}

function getPortalLabel(role: UserRole) {
  if (role === "parent") return "Parent Portal";
  if (role === "coach") return "Coach Portal";
  if (role === "admin") return "Admin Portal";
  if (role === "accountant") return "Finance Portal";

  return "My Portal";
}

function getRoleLabel(role: UserRole) {
  if (role === "parent") return "Parent";
  if (role === "coach") return "Coach";
  if (role === "admin") return "Administrator";
  if (role === "accountant") return "Accountant";

  return "Guest";
}

function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrateMe = useAuthStore((state) => state.hydrateMe);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = window.localStorage.getItem("access_token");

    if (!token || currentUser || isAuthenticated) {
      return;
    }

    void hydrateMe().catch(() => {
      logout();
    });
  }, [currentUser, hydrateMe, isAuthenticated, logout]);

  useEffect(() => {
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  const loginLabel = t("common.login", { defaultValue: "Log in" });
  const bookTrialLabel = t("common.bookTrial", {
    defaultValue: t("common.bookFreeTrial", { defaultValue: "Book Trial" }),
  });

  const displayName = useMemo(() => getDisplayName(currentUser), [currentUser]);
  const userInitials = useMemo(() => getUserInitials(currentUser), [currentUser]);

  const roleLabel = currentUser ? getRoleLabel(currentUser.role) : "Guest";
  const portalPath = currentUser ? getPortalPath(currentUser.role) : ROUTE_PATHS.auth.login;
  const profilePath = currentUser ? getProfilePath(currentUser.role) : ROUTE_PATHS.auth.login;
  const portalLabel = currentUser ? getPortalLabel(currentUser.role) : "My Portal";

  const mainNavItems: PublicNavItem[] = [
    {
      label: t("nav.about", { defaultValue: "About" }),
      href: ROUTE_PATHS.public.about,
      icon: Info,
    },
    {
      label: t("nav.programs", { defaultValue: "Programs" }),
      href: ROUTE_PATHS.public.programs,
      icon: Trophy,
    },
    {
      label: t("nav.coaches", { defaultValue: "Coaches" }),
      href: ROUTE_PATHS.public.coaches,
      icon: Medal,
    },
    {
      label: t("nav.locations", { defaultValue: "Locations" }),
      href: ROUTE_PATHS.public.locations,
      icon: MapPin,
    },
    {
      label: t("nav.pricing", { defaultValue: "Pricing" }),
      href: ROUTE_PATHS.public.pricing,
      icon: CreditCard,
    },
  ];

  const moreNavItems: PublicNavItem[] = [
    ...(settings.publicWebsite.enableOffers
      ? [
        {
          label: t("nav.offers", { defaultValue: "Offers" }),
          href: ROUTE_PATHS.public.offers,
          icon: Gift,
        },
      ]
      : []),
    ...(settings.publicWebsite.enableGallery
      ? [
        {
          label: t("nav.gallery", { defaultValue: "Gallery" }),
          href: ROUTE_PATHS.public.gallery,
          icon: Camera,
        },
      ]
      : []),
    ...(settings.publicWebsite.enableEvents
      ? [
        {
          label: t("nav.events", { defaultValue: "Events" }),
          href: ROUTE_PATHS.public.events,
          icon: CalendarDays,
        },
      ]
      : []),
    ...(settings.publicWebsite.enableBlog
      ? [
        {
          label: t("nav.blog", { defaultValue: "Blog" }),
          href: ROUTE_PATHS.public.blog,
          icon: BookOpenText,
        },
      ]
      : []),
    {
      label: t("nav.contact", { defaultValue: "Contact" }),
      href: ROUTE_PATHS.public.contact,
      icon: MessageCircle,
    },
  ];

  const mobileNavItems = [...mainNavItems, ...moreNavItems];

  const isMoreActive = moreNavItems.some((item) =>
    isPathActive(location.pathname, item.href),
  );

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsAccountOpen(false);
    navigate(ROUTE_PATHS.public.home);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-brand-blue/10 bg-white/88 shadow-[0_16px_50px_rgba(0,18,155,0.10)] backdrop-blur-2xl dark:border-brand-yellow/15 dark:bg-brand-dark/94 dark:shadow-[0_18px_55px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.16),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(0,18,155,0.09),transparent_28%)] dark:bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.15),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.08),transparent_26%)]" />

        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to={ROUTE_PATHS.public.home}
            onClick={closeMenus}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Go to home page"
          >
            <div className="rounded-2xl bg-white/75 px-2 py-1 ring-1 ring-brand-blue/10 transition group-hover:scale-[1.02] group-hover:bg-white group-hover:ring-brand-yellow/50 dark:hidden">
              <BrandLogo
                size="md"
                showText
                logoSrc={settings.branding.logoUrl || undefined}
                shortName={settings.branding.shortName}
                academyName={settings.branding.academyName}
              />
            </div>

            <div className="hidden rounded-2xl bg-white/8 px-2 py-1 ring-1 ring-white/10 transition group-hover:scale-[1.02] group-hover:bg-white/12 dark:block">
              <BrandLogo
                size="md"
                showText
                variant="white"
                logoSrc={settings.branding.logoUrl || undefined}
                darkLogoSrc={settings.branding.darkLogoUrl || undefined}
                shortName={settings.branding.shortName}
                academyName={settings.branding.academyName}
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10 xl:flex">
            <NavLink
              to={ROUTE_PATHS.public.home}
              className={({ isActive }) =>
                cn(
                  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                  isActive
                    ? "bg-brand-blue text-white shadow-[0_10px_24px_rgba(0,18,155,0.18)] dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                    : "text-slate-700 hover:bg-white hover:text-brand-blue hover:shadow-sm dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <Home className="h-4 w-4" /> : null}
                  <span>{t("nav.home", { defaultValue: "Home" })}</span>
                </>
              )}
            </NavLink>

            {mainNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                      isActive
                        ? "bg-brand-blue text-white shadow-[0_10px_24px_rgba(0,18,155,0.18)] dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                        : "text-slate-700 hover:bg-white hover:text-brand-blue hover:shadow-sm dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? <Icon className="h-4 w-4" /> : null}
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((value) => !value)}
                className={cn(
                  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                  isMoreActive || isMoreOpen
                    ? "bg-brand-blue text-white shadow-[0_10px_24px_rgba(0,18,155,0.18)] dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                    : "text-slate-700 hover:bg-white hover:text-brand-blue hover:shadow-sm dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white",
                )}
                aria-expanded={isMoreOpen}
              >
                <Sparkles className="h-4 w-4" />
                Explore
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition",
                    isMoreOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              {isMoreOpen ? (
                <div className="absolute end-0 top-12 w-64 overflow-hidden rounded-[1.5rem] border border-border bg-white p-2 shadow-[0_24px_70px_rgba(0,18,155,0.18)] ring-1 ring-brand-blue/10 dark:bg-brand-dark dark:ring-white/10">
                  {moreNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isPathActive(location.pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition",
                          active
                            ? "bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue"
                            : "text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <div className="flex items-center gap-2 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((value) => !value)}
                  className="group inline-flex items-center gap-3 rounded-full border border-brand-blue/10 bg-white/85 py-1.5 pe-3 ps-1.5 shadow-sm ring-1 ring-brand-blue/5 transition hover:-translate-y-0.5 hover:border-brand-yellow/60 hover:shadow-[0_14px_28px_rgba(0,18,155,0.12)] dark:border-white/10 dark:bg-white/8 dark:ring-white/10"
                  aria-expanded={isAccountOpen}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-black uppercase text-white ring-2 ring-brand-yellow/70 dark:bg-brand-yellow dark:text-brand-blue">
                    {userInitials}
                  </span>

                  <span className="min-w-0 text-start">
                    <span className="block max-w-[140px] truncate text-sm font-black text-slate-900 dark:text-white">
                      {displayName}
                    </span>
                    <span className="block max-w-[140px] truncate text-xs font-bold text-muted-foreground">
                      {roleLabel}
                    </span>
                  </span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition group-hover:text-brand-blue dark:group-hover:text-brand-yellow",
                      isAccountOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                {isAccountOpen ? (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-[110] cursor-default"
                      aria-label="Close account menu"
                      onClick={() => setIsAccountOpen(false)}
                    />

                    <div className="absolute end-0 top-[calc(100%+0.75rem)] z-[130]">
                      <AccountDropdown
                        user={currentUser}
                        displayName={displayName}
                        roleLabel={roleLabel}
                        initials={userInitials}
                        portalLabel={portalLabel}
                        portalPath={portalPath}
                        profilePath={profilePath}
                        onNavigate={closeMenus}
                        onLogout={handleLogout}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <Link
                to={ROUTE_PATHS.auth.login}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 hover:text-brand-blue dark:text-white/88 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                {loginLabel}
              </Link>
            )}

            {settings.system.trialBookingEnabled ? (
              <Link
                to={ROUTE_PATHS.public.bookTrial}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(0,18,155,0.20)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_14px_28px_rgba(255,212,0,0.25)] dark:hover:bg-white"
              >
                <Sparkles className="h-4 w-4" />
                {bookTrialLabel}
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 dark:bg-white/10 dark:text-white/60">
                Trial booking unavailable
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <div className="flex items-center gap-1 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {isAuthenticated && currentUser ? (
              <button
                type="button"
                onClick={() => setIsAccountOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-xs font-black uppercase text-white ring-2 ring-brand-yellow/70 dark:bg-brand-yellow dark:text-brand-blue"
                aria-label="Account menu"
                aria-expanded={isAccountOpen}
              >
                {userInitials}
              </button>
            ) : (
              <Link
                to={ROUTE_PATHS.auth.login}
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-4 text-xs font-black text-white shadow-sm transition hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
              >
                {loginLabel}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm ring-1 ring-brand-blue/10 transition hover:bg-brand-blue/5 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isAccountOpen && isAuthenticated && currentUser ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[110] cursor-default xl:hidden"
              aria-label="Close account menu"
              onClick={() => setIsAccountOpen(false)}
            />

            <div className="fixed end-4 top-[76px] z-[130] xl:hidden">
              <AccountDropdown
                user={currentUser}
                displayName={displayName}
                roleLabel={roleLabel}
                initials={userInitials}
                portalLabel={portalLabel}
                portalPath={portalPath}
                profilePath={profilePath}
                onNavigate={closeMenus}
                onLogout={handleLogout}
              />
            </div>
          </>
        ) : null}

        {isOpen ? (
          <div className="border-t border-brand-blue/10 bg-white/96 px-4 py-4 shadow-2xl backdrop-blur-2xl dark:border-brand-yellow/15 dark:bg-brand-dark/98 xl:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {isAuthenticated && currentUser ? (
                <div className="mb-2 rounded-3xl border border-border bg-card p-4 dark:border-white/10 dark:bg-white/8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-sm font-black uppercase text-white ring-2 ring-brand-yellow/70 dark:bg-brand-yellow dark:text-brand-blue">
                      {userInitials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        {displayName}
                      </p>
                      <p className="truncate text-xs font-bold text-muted-foreground">
                        {roleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      to={portalPath}
                      onClick={closeMenus}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-3 py-2.5 text-xs font-black text-white dark:bg-brand-yellow dark:text-brand-blue"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Portal
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-black text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}

              <NavLink
                to={ROUTE_PATHS.public.home}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition",
                    isActive
                      ? "bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue"
                      : "text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? <Home className="h-4 w-4" /> : null}
                    <span>{t("nav.home", { defaultValue: "Home" })}</span>
                  </>
                )}
              </NavLink>

              {mobileNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition",
                        isActive
                          ? "bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue"
                          : "text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <Icon className="h-4 w-4" /> : null}
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              <div className="mt-3 grid grid-cols-2 gap-3">
                {!isAuthenticated ? (
                  <Link
                    to={ROUTE_PATHS.auth.login}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue/8 px-4 py-3 text-center text-sm font-black text-brand-blue ring-1 ring-brand-blue/10 transition hover:bg-brand-blue/12 dark:bg-white/10 dark:text-white dark:ring-white/12 dark:hover:bg-white/15"
                  >
                    <LogIn className="h-4 w-4" />
                    {loginLabel}
                  </Link>
                ) : (
                  <Link
                    to={profilePath}
                    onClick={closeMenus}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue/8 px-4 py-3 text-center text-sm font-black text-brand-blue ring-1 ring-brand-blue/10 transition hover:bg-brand-blue/12 dark:bg-white/10 dark:text-white dark:ring-white/12 dark:hover:bg-white/15"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                )}

                {settings.system.trialBookingEnabled ? (
                  <Link
                    to={ROUTE_PATHS.public.bookTrial}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-4 py-3 text-center text-sm font-black text-white shadow-[0_14px_28px_rgba(0,18,155,0.18)] transition hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_14px_28px_rgba(255,212,0,0.22)] dark:hover:bg-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    {bookTrialLabel}
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-3 text-center text-xs font-black text-slate-600 dark:bg-white/10 dark:text-white/60">
                    Trial booking unavailable
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <div className="h-[73px] xl:h-[76px]" aria-hidden="true" />
    </>
  );
}

interface AccountDropdownProps {
  user: AuthUser;
  displayName: string;
  roleLabel: string;
  initials: string;
  portalLabel: string;
  portalPath: string;
  profilePath: string;
  onNavigate: () => void;
  onLogout: () => void;
}

function AccountDropdown({
  user,
  displayName,
  roleLabel,
  initials,
  portalLabel,
  portalPath,
  profilePath,
  onNavigate,
  onLogout,
}: AccountDropdownProps) {
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
          to={portalPath}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/7 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <span>{portalLabel}</span>
        </Link>

        <Link
          to={profilePath}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-brand-blue/7 hover:text-brand-blue dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/8 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
            <Settings className="h-4 w-4" />
          </span>
          <span>Profile settings</span>
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

export { PublicHeader };
export default PublicHeader;