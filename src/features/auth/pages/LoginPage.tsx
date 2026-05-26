import BrandLogo from "@/components/shared/BrandLogo";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/features/auth/pages/auth.store";
import type { UserRole } from "@/types/role.types";
import { ROLE_REDIRECT_PATHS } from "@/types/role.types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCog,
  Users,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface RoleOption {
  value: Exclude<UserRole, 'guest'>;
  icon: LucideIcon;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginMock = useAuthStore((state) => state.loginMock);

  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'guest'>>("admin");

  const roleOptions: RoleOption[] = [
    { value: "admin", icon: ShieldCheck },
    { value: "accountant", icon: CreditCard },
    { value: "coach", icon: Trophy },
    { value: "parent", icon: Users },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMock(selectedRole);
    navigate(ROLE_REDIRECT_PATHS[selectedRole]);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-foreground dark:bg-slate-950">
      <section className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.28),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-10 xl:px-14 xl:py-14">
            <div>
              <BrandLogo size="lg" showText variant="white" />

              <div className="mt-16 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">
                  <Sparkles className="h-4 w-4" />
                  {t("auth.login.badge")}
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
                  {t("auth.login.sideTitle")}
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-white/75 xl:text-lg">
                  {t("auth.login.sideDescription")}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <SideFeature
                  icon={BarChart3}
                  title={t("auth.login.features.kpi")}
                />
                <SideFeature
                  icon={UserCog}
                  title={t("auth.login.features.operations")}
                />
                <SideFeature
                  icon={CheckCircle2}
                  title={t("auth.login.features.attendance")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard value="1,200+" label="Players" />
              <MetricCard value="35+" label="Coaches" />
              <MetricCard value="8" label="Branches" />
            </div>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,18,155,0.07),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,212,0,0.12),transparent_25%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,212,0,0.08),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(0,18,155,0.18),transparent_25%)]" />

          <div className="relative z-10 w-full max-w-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <BrandLogo size="md" showText />
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                  {t("auth.login.title")}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  {t("auth.login.description")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-black">
                    {t("auth.login.email")}
                  </span>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="email"
                      defaultValue="admin@aspirex.com"
                      placeholder="admin@aspirex.com"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black">
                    {t("auth.login.password")}
                  </span>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="password"
                      defaultValue="password"
                      placeholder="••••••••"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                  </div>
                </label>

                <div>
                  <p className="mb-3 text-sm font-black">
                    {t("auth.login.selectRole")}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.value;

                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={[
                            "rounded-2xl border p-4 text-start transition",
                            isSelected
                              ? "border-brand-blue bg-brand-blue text-white shadow-brand dark:border-brand-yellow dark:bg-brand-yellow dark:text-brand-blue"
                              : "border-border bg-background hover:border-brand-blue/40 dark:hover:border-brand-yellow/40",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={[
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                                isSelected
                                  ? "bg-white/15"
                                  : "bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow",
                              ].join(" ")}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-black">
                                {t(`auth.roles.${role.value}`)}
                              </p>
                              <p
                                className={[
                                  "mt-1 text-xs leading-5 font-semibold",
                                  isSelected
                                    ? "text-white/80 dark:text-brand-blue/75"
                                    : "text-muted-foreground",
                                ].join(" ")}
                              >
                                {t(`auth.roleDescriptions.${role.value}`)}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-6 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                >
                  {t("auth.login.submit")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/15 p-4 text-sm font-bold leading-6 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                {t("auth.login.demoNote")}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SideFeatureProps {
  icon: LucideIcon;
  title: string;
}

function SideFeature({ icon: Icon, title }: SideFeatureProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-black leading-6 text-white">{title}</p>
    </div>
  );
}

interface MetricCardProps {
  value: string;
  label: string;
}

function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-bold text-white/70">{label}</p>
    </div>
  );
}