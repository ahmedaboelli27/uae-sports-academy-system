import BrandLogo from "@/components/shared/BrandLogo";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface SelectOption {
  value: string;
  label: string;
}

export default function RegisterChildPage() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sportOptions: SelectOption[] = [
    { value: "", label: t("registration.form.placeholders.selectSport") },
    { value: "football", label: t("registration.options.sports.football") },
    { value: "swimming", label: t("registration.options.sports.swimming") },
    { value: "basketball", label: t("registration.options.sports.basketball") },
    { value: "multiSport", label: t("registration.options.sports.multiSport") },
  ];

  const branchOptions: SelectOption[] = [
    { value: "", label: t("registration.form.placeholders.selectBranch") },
    { value: "dubai", label: t("registration.options.branches.dubai") },
    { value: "abuDhabi", label: t("registration.options.branches.abuDhabi") },
    { value: "sharjah", label: t("registration.options.branches.sharjah") },
  ];

  const levelOptions: SelectOption[] = [
    { value: "", label: t("registration.form.placeholders.selectLevel") },
    { value: "beginner", label: t("registration.options.levels.beginner") },
    { value: "intermediate", label: t("registration.options.levels.intermediate") },
    { value: "advanced", label: t("registration.options.levels.advanced") },
    { value: "notSure", label: t("registration.options.levels.notSure") },
  ];

  const contactOptions: SelectOption[] = [
    { value: "", label: t("registration.form.placeholders.selectContact") },
    { value: "whatsapp", label: t("registration.options.contact.whatsapp") },
    { value: "phone", label: t("registration.options.contact.phone") },
    { value: "email", label: t("registration.options.contact.email") },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!settings.system.registrationEnabled) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    setIsSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,18,155,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,212,0,0.25),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(0,18,155,0.30),transparent_30%)]" />

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-card px-4 py-2 text-sm font-black text-brand-blue shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-brand-yellow">
                <Sparkles className="h-4 w-4" />
                {t("registration.hero.badge")}
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-brand-blue dark:text-white sm:text-5xl lg:text-6xl">
                {t("registration.hero.title")}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {t("registration.hero.description")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {settings.system.registrationEnabled ? (
                  <a
                    href="#registration-form"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-4 text-sm font-black text-white shadow-brand transition hover:-translate-y-1 hover:bg-brand-blue-dark"
                  >
                    {t("registration.hero.primaryAction")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-7 py-4 text-sm font-black text-slate-600">
                    Registration is currently unavailable
                  </span>
                )}

                {settings.system.trialBookingEnabled ? (
                  <Link
                    to="/book-trial"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-black text-foreground shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
                  >
                    {t("registration.hero.secondaryAction")}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-border bg-card p-5 shadow-2xl">
              <div className="rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                <BrandLogo size="lg" showText variant="white" />

                <div className="mt-8 grid gap-4">
                  <HeroFeature
                    icon={Users}
                    title={t("registration.heroCard.parentData.title")}
                    description={t("registration.heroCard.parentData.description")}
                  />
                  <HeroFeature
                    icon={Trophy}
                    title={t("registration.heroCard.programSelection.title")}
                    description={t("registration.heroCard.programSelection.description")}
                  />
                  <HeroFeature
                    icon={ShieldCheck}
                    title={t("registration.heroCard.safeRegistration.title")}
                    description={t("registration.heroCard.safeRegistration.description")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSubmitted && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <h2 className="text-lg font-black">
                  {t("registration.success.title")}
                </h2>
                <p className="mt-1 text-sm font-semibold leading-6">
                  {t("registration.success.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="registration-form"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {!settings.system.registrationEnabled ? (
              <div className="rounded-[2rem] border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                Registration is currently unavailable.
              </div>
            ) : null}
            <FormSection
              icon={User}
              title={t("registration.sections.parent.title")}
              description={t("registration.sections.parent.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label={t("registration.form.parentName")}
                  name="parentName"
                  placeholder={t("registration.form.placeholders.parentName")}
                  required
                />

                <FormInput
                  label={t("registration.form.phone")}
                  name="phone"
                  type="tel"
                  placeholder="+971 50 000 0000"
                  required
                />

                <FormInput
                  label={t("registration.form.email")}
                  name="email"
                  type="email"
                  placeholder="parent@example.com"
                  required
                />

                <FormSelect
                  label={t("registration.form.preferredContact")}
                  name="preferredContact"
                  options={contactOptions}
                  required
                />

                <FormInput
                  label={t("registration.form.city")}
                  name="city"
                  placeholder={t("registration.form.placeholders.city")}
                />

                <FormInput
                  label={t("registration.form.relationship")}
                  name="relationship"
                  placeholder={t("registration.form.placeholders.relationship")}
                />
              </div>
            </FormSection>

            <FormSection
              icon={Users}
              title={t("registration.sections.child.title")}
              description={t("registration.sections.child.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label={t("registration.form.childName")}
                  name="childName"
                  placeholder={t("registration.form.placeholders.childName")}
                  required
                />

                <FormInput
                  label={t("registration.form.dateOfBirth")}
                  name="dateOfBirth"
                  type="date"
                  required
                />

                <FormSelect
                  label={t("registration.form.gender")}
                  name="gender"
                  options={[
                    { value: "", label: t("registration.form.placeholders.selectGender") },
                    { value: "male", label: t("registration.options.gender.male") },
                    { value: "female", label: t("registration.options.gender.female") },
                  ]}
                  required
                />

                <FormSelect
                  label={t("registration.form.skillLevel")}
                  name="skillLevel"
                  options={levelOptions}
                  required
                />
              </div>
            </FormSection>

            <FormSection
              icon={Trophy}
              title={t("registration.sections.program.title")}
              description={t("registration.sections.program.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormSelect
                  label={t("registration.form.sport")}
                  name="sport"
                  options={sportOptions}
                  required
                />

                <FormSelect
                  label={t("registration.form.branch")}
                  name="branch"
                  options={branchOptions}
                  required
                />

                <FormInput
                  label={t("registration.form.preferredDays")}
                  name="preferredDays"
                  placeholder={t("registration.form.placeholders.preferredDays")}
                />

                <FormInput
                  label={t("registration.form.preferredTime")}
                  name="preferredTime"
                  placeholder={t("registration.form.placeholders.preferredTime")}
                />
              </div>
            </FormSection>

            <FormSection
              icon={HeartPulse}
              title={t("registration.sections.medical.title")}
              description={t("registration.sections.medical.description")}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormTextarea
                  label={t("registration.form.medicalNotes")}
                  name="medicalNotes"
                  placeholder={t("registration.form.placeholders.medicalNotes")}
                />

                <FormTextarea
                  label={t("registration.form.allergies")}
                  name="allergies"
                  placeholder={t("registration.form.placeholders.allergies")}
                />

                <FormInput
                  label={t("registration.form.emergencyName")}
                  name="emergencyName"
                  placeholder={t("registration.form.placeholders.emergencyName")}
                />

                <FormInput
                  label={t("registration.form.emergencyPhone")}
                  name="emergencyPhone"
                  type="tel"
                  placeholder="+971 50 000 0000"
                />
              </div>
            </FormSection>

            <FormSection
              icon={FileText}
              title={t("registration.sections.consent.title")}
              description={t("registration.sections.consent.description")}
            >
              <div className="space-y-4">
                <CheckboxRow
                  name="termsConsent"
                  label={t("registration.consent.terms")}
                  required
                />

                <CheckboxRow
                  name="medicalConsent"
                  label={t("registration.consent.medical")}
                  required
                />

                <CheckboxRow
                  name="photoConsent"
                  label={t("registration.consent.photo")}
                />
              </div>
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black">
                    {t("registration.submit.title")}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    {t("registration.submit.description")}
                  </p>
                </div>

                {settings.system.registrationEnabled ? (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-4 text-sm font-black text-white shadow-brand transition hover:-translate-y-1 hover:bg-brand-blue-dark"
                  >
                    {t("registration.submit.button")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <InfoCard
              icon={CalendarDays}
              title={t("registration.sideCards.nextStep.title")}
              description={t("registration.sideCards.nextStep.description")}
            />

            <InfoCard
              icon={Phone}
              title={t("registration.sideCards.contact.title")}
              description={t("registration.sideCards.contact.description")}
            />

            <InfoCard
              icon={MapPin}
              title={t("registration.sideCards.locations.title")}
              description={t("registration.sideCards.locations.description")}
            />

            <div className="rounded-[2rem] border border-brand-yellow/40 bg-brand-yellow/15 p-5 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-bold leading-6">
                  {t("registration.sideCards.note")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

interface HeroFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function HeroFeature({ icon: Icon, title, description }: HeroFeatureProps) {
  return (
    <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
    </div>
  );
}

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
}

function FormSelect({
  label,
  name,
  options,
  required = false,
}: FormSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      <select
        name={name}
        required={required}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
}

function FormTextarea({ label, name, placeholder }: FormTextareaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-foreground">
        {label}
      </span>

      <textarea
        name={name}
        rows={5}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

interface CheckboxRowProps {
  name: string;
  label: string;
  required?: boolean;
}

function CheckboxRow({ name, label, required = false }: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-brand-blue/40 dark:hover:border-brand-yellow/40">
      <input
        name={name}
        type="checkbox"
        required={required}
        className="mt-1 h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue dark:text-brand-yellow dark:focus:ring-brand-yellow"
      />

      <span className="text-sm font-bold leading-6 text-muted-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
    </label>
  );
}

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}