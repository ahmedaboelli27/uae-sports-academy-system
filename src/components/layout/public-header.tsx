import BrandLogo from "@/components/shared/BrandLogo";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.programs"), href: "/programs" },
    { label: t("nav.coaches"), href: "/coaches" },
    { label: t("nav.locations"), href: "/locations" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.offers"), href: "/offers" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-brand-dark/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <BrandLogo size="md" showText />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-bold transition",
                  isActive
                    ? "text-brand-blue dark:text-brand-yellow"
                    : "text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-yellow",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            to="/auth/login"
            className="rounded-full px-5 py-2.5 text-sm font-black text-brand-blue transition hover:bg-brand-surface dark:text-white dark:hover:bg-white/10"
          >
            {t("common.login")}
          </Link>

          <Link
            to="/book-trial"
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark"
          >
            {t("common.bookTrial")}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-blue dark:border-slate-700 dark:bg-brand-navy dark:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-brand-dark lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-2xl px-4 py-3 text-sm font-black transition",
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-slate-700 hover:bg-brand-surface dark:text-slate-200 dark:hover:bg-white/10",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/book-trial"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-2xl bg-brand-blue px-4 py-3 text-center text-sm font-black text-white"
            >
              {t("common.bookFreeTrial")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { PublicHeader };
export default PublicHeader;