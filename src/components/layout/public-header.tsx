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
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-brand-yellow/20 bg-brand-blue/95 shadow-[0_14px_40px_rgba(0,18,155,0.20)] backdrop-blur-2xl dark:border-brand-yellow/15 dark:bg-brand-dark/95">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_50%,rgba(255,212,0,0.16),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.10),transparent_26%)]" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Go to home page"
          >
            <div className="rounded-2xl bg-white/8 px-2 py-1 ring-1 ring-white/10 transition group-hover:scale-[1.02] group-hover:bg-white/12">
              <BrandLogo size="md" showText variant="white" />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-white/8 p-1 ring-1 ring-white/10 backdrop-blur-xl lg:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
                  isActive
                    ? "bg-brand-yellow text-brand-blue shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                    : "text-white/78 hover:bg-white/10 hover:text-white",
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
                        ? "bg-brand-yellow text-brand-blue shadow-[0_10px_24px_rgba(255,212,0,0.22)]"
                        : "text-white/78 hover:bg-white/10 hover:text-white",
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
            <div className="flex items-center gap-2 rounded-full bg-white/8 p-1 ring-1 ring-white/10 backdrop-blur-xl">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-white/88 transition hover:bg-white/10 hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              {loginLabel}
            </Link>

            <Link
              to="/book-trial"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-black text-brand-blue shadow-[0_14px_28px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Sparkles className="h-4 w-4" />
              {bookTrialLabel}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1 rounded-full bg-white/8 p-1 ring-1 ring-white/10 backdrop-blur-xl">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue shadow-sm transition hover:bg-white"
            >
              {loginLabel}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="border-t border-brand-yellow/15 bg-brand-blue/98 px-4 py-4 shadow-2xl backdrop-blur-2xl dark:bg-brand-dark/98 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition",
                    isActive
                      ? "bg-brand-yellow text-brand-blue"
                      : "text-white/82 hover:bg-white/10 hover:text-white",
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
                          ? "bg-brand-yellow text-brand-blue"
                          : "text-white/82 hover:bg-white/10 hover:text-white",
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-black text-white ring-1 ring-white/12 transition hover:bg-white/15"
                >
                  <LogIn className="h-4 w-4" />
                  {loginLabel}
                </Link>

                <Link
                  to="/book-trial"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-yellow px-4 py-3 text-center text-sm font-black text-brand-blue shadow-[0_14px_28px_rgba(255,212,0,0.22)] transition hover:bg-white"
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