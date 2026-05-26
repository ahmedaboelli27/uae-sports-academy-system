import BrandLogo from "@/components/shared/BrandLogo";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Gift,
  Home,
  LogIn,
  MapPin,
  Medal,
  Menu,
  MessageCircle,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

interface PublicNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const loginLabel = t("common.login", { defaultValue: "Log in" });
  const bookTrialLabel = t("common.bookTrial", {
    defaultValue: t("common.bookFreeTrial", { defaultValue: "Book Trial" }),
  });

  const navItems: PublicNavItem[] = [
    { label: t("nav.programs"), href: "/programs", icon: Trophy },
    { label: t("nav.coaches"), href: "/coaches", icon: Medal },
    { label: t("nav.locations"), href: "/locations", icon: MapPin },
    { label: t("nav.pricing"), href: "/pricing", icon: CreditCard },
    { label: t("nav.offers"), href: "/offers", icon: Gift },
    { label: t("nav.contact"), href: "/contact", icon: MessageCircle },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-brand-blue/10 bg-white/90 shadow-[0_12px_38px_rgba(0,18,155,0.08)] backdrop-blur-2xl dark:border-brand-yellow/15 dark:bg-brand-dark/95 dark:shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.16),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(0,18,155,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.15),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.08),transparent_26%)]" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Go to home page"
          >
            <div className="rounded-2xl bg-white/75 px-2 py-1 ring-1 ring-brand-blue/10 transition group-hover:scale-[1.02] group-hover:bg-white group-hover:ring-brand-yellow/50 dark:hidden">
              <BrandLogo size="md" showText />
            </div>

            <div className="hidden rounded-2xl bg-white/8 px-2 py-1 ring-1 ring-white/10 transition group-hover:scale-[1.02] group-hover:bg-white/12 dark:block">
              <BrandLogo size="md" showText variant="white" />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10 lg:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                  isActive
                    ? "bg-brand-blue text-white shadow-[0_10px_24px_rgba(0,18,155,0.18)] dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                    : "text-slate-650 hover:bg-white hover:text-brand-blue hover:shadow-sm dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white",
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

            {navItems.map((item) => {
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
                        : "text-slate-650 hover:bg-white hover:text-brand-blue hover:shadow-sm dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white",
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
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 hover:text-brand-blue dark:text-white/88 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              {loginLabel}
            </Link>

            <Link
              to="/book-trial"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(0,18,155,0.20)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_14px_28px_rgba(255,212,0,0.25)] dark:hover:bg-white"
            >
              <Sparkles className="h-4 w-4" />
              {bookTrialLabel}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1 rounded-full bg-brand-blue/[0.04] p-1 ring-1 ring-brand-blue/10 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-4 text-xs font-black text-white shadow-sm transition hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
            >
              {loginLabel}
            </Link>

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

        {isOpen ? (
          <div className="border-t border-brand-blue/10 bg-white/96 px-4 py-4 shadow-2xl backdrop-blur-2xl dark:border-brand-yellow/15 dark:bg-brand-dark/98 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <NavLink
                to="/"
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

              {navItems.map((item) => {
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
                <Link
                  to="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue/8 px-4 py-3 text-center text-sm font-black text-brand-blue ring-1 ring-brand-blue/10 transition hover:bg-brand-blue/12 dark:bg-white/10 dark:text-white dark:ring-white/12 dark:hover:bg-white/15"
                >
                  <LogIn className="h-4 w-4" />
                  {loginLabel}
                </Link>

                <Link
                  to="/book-trial"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-4 py-3 text-center text-sm font-black text-white shadow-[0_14px_28px_rgba(0,18,155,0.18)] transition hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:shadow-[0_14px_28px_rgba(255,212,0,0.22)] dark:hover:bg-white"
                >
                  <Sparkles className="h-4 w-4" />
                  {bookTrialLabel}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <div className="h-[73px] lg:h-[76px]" aria-hidden="true" />
    </>
  );
}

export { PublicHeader };
export default PublicHeader;