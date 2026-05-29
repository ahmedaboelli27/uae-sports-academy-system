import BrandLogo from "@/components/shared/BrandLogo";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { USE_MOCK_API } from "@/config/api-mode";
import { useAuthStore } from "@/features/auth/pages/auth.store";
import { loadPublicLoginShowcase } from "@/features/public/services/public-data.service";
import type { UserRole } from "@/types/role.types";
import { ROLE_REDIRECT_PATHS } from "@/types/role.types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Home,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

interface RoleOption {
  value: Exclude<UserRole, "guest" | "accountant">;
  icon: LucideIcon;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginMock = useAuthStore((state) => state.loginMock);
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [selectedRole, setSelectedRole] =
    useState<Exclude<UserRole, "guest" | "accountant">>("admin");
  const [email, setEmail] = useState("admin@aspirex.com");
  const [password, setPassword] = useState("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showcase, setShowcase] = useState({
    features: [
      { id: "f-kpi", title: t("auth.login.features.kpi") },
      { id: "f-ops", title: t("auth.login.features.operations") },
      { id: "f-att", title: t("auth.login.features.attendance") },
    ],
    metrics: [
      { id: "m-players", value: "1,200+", label: "Players" },
      { id: "m-coaches", value: "35+", label: "Coaches" },
      { id: "m-branches", value: "8", label: "Branches" },
    ],
  });

  useEffect(() => {
    void loadPublicLoginShowcase().then((data) => {
      if (data.features.length && data.metrics.length) setShowcase(data);
    });
  }, []);

  const roleOptions: RoleOption[] = [
    { value: "admin", icon: ShieldCheck },
    { value: "coach", icon: Trophy },
    { value: "parent", icon: Users },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (USE_MOCK_API) {
        await loginMock(selectedRole);

        if (selectedRole === "parent") {
          navigate("/");
          return;
        }

        navigate(ROLE_REDIRECT_PATHS[selectedRole]);
        return;
      }

      await loginWithCredentials(email, password);

      const loggedInRole = useAuthStore.getState().role;

      if (loggedInRole === "parent") {
        navigate("/");
        return;
      }

      if (loggedInRole === "admin") {
        navigate(ROLE_REDIRECT_PATHS.admin);
        return;
      }

      if (loggedInRole === "coach") {
        navigate(ROLE_REDIRECT_PATHS.coach);
        return;
      }

      if (loggedInRole === "accountant") {
        navigate(ROLE_REDIRECT_PATHS.accountant);
        return;
      }

      navigate("/");
    } catch {
      setError(
        t("auth.login.invalidCredentials", {
          defaultValue: "Invalid credentials.",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 text-foreground dark:bg-slate-950">
      <section className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.30),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_35%)]" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-950/35 to-transparent" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-10 xl:px-14 xl:py-14">
            <div>
              <BrandLogo size="lg" showText variant="white" />

              <div className="mt-16 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.22)]">
                  <Sparkles className="h-4 w-4" />
                  {t("auth.login.badge")}
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-2xl xl:text-5xl">
                  {t("auth.login.sideTitle")}
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-white/75 xl:text-lg">
                  {t("auth.login.sideDescription")}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {showcase.features.map((feature, index) => (
                  <SideFeature
                    key={feature.id}
                    icon={[BarChart3, UserCog, CheckCircle2][index % 3]}
                    title={feature.title}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {showcase.metrics.map((metric) => (
                <MetricCard key={metric.id} value={metric.value} label={metric.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,18,155,0.09),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,212,0,0.16),transparent_25%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,212,0,0.08),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(0,18,155,0.20),transparent_25%)]" />

          <div className="relative z-10 w-full max-w-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <BrandLogo size="md" showText />

              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-blue shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-blue dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-brand-yellow dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
                  aria-label="Go to home page"
                  title="Home"
                >
                  <Home className="h-4 w-4" />
                </Link>

                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/92 p-6 shadow-[0_25px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/92 dark:shadow-[0_25px_90px_rgba(0,0,0,0.48)] sm:p-8">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow/20 px-4 py-2 text-xs font-black text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow">
                  <ShieldCheck className="h-4 w-4" />
                  AspireX Secure Portal
                </div>

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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                  </div>
                </label>

                {USE_MOCK_API ? <div>
                  <p className="mb-3 text-sm font-black">
                    {t("auth.login.selectRole")}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
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
                              ? "border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.24)]"
                              : "border-border bg-background hover:border-brand-blue/40 hover:bg-brand-blue/5 dark:hover:border-brand-yellow/40 dark:hover:bg-brand-yellow/5",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-3 sm:flex-col">
                            <div
                              className={[
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                                isSelected
                                  ? "bg-brand-blue/10 text-brand-blue"
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
                                  "mt-1 text-xs font-semibold leading-5",
                                  isSelected
                                    ? "text-brand-blue/75"
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
                </div> : null}

                <div className="space-y-3">
                  {error ? (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                      {error}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white dark:bg-brand-yellow dark:text-brand-blue"
                  >
                    {isSubmitting ? t("auth.login.loading", { defaultValue: "Signing in..." }) : t("auth.login.submit")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </button>

                  <Link
                    to="/auth/register"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue px-6 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:border-brand-yellow/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    <UserPlus className="h-4 w-4" />
                    {t("common.register", {
                      defaultValue: "Create a regular account",
                    })}
                  </Link>
                </div>
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