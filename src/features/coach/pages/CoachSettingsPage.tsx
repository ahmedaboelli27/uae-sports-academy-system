import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  FileText,
  Languages,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UserRound,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { coachDataService } from '@/features/coach/services/coach-data.service';
import type { CoachProfileDto } from '@/features/coach/types/coach.dto';

type CoachLevel = 'beginner' | 'intermediate' | 'advanced' | 'allLevels';
type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

interface CoachAccountProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  branch: string;
  specialization: string;
  bio: string;
  preferredLevel: CoachLevel;
  language: string;
  timezone: string;
}

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  expiryDate: string;
  status: 'valid' | 'expiringSoon' | 'expired';
}

const initialAvailability: AvailabilitySlot[] = [
  {
    id: 'availability-001',
    day: 'Monday',
    startTime: '04:00 PM',
    endTime: '08:00 PM',
    status: 'available',
  },
  {
    id: 'availability-002',
    day: 'Tuesday',
    startTime: '05:00 PM',
    endTime: '08:00 PM',
    status: 'available',
  },
  {
    id: 'availability-003',
    day: 'Wednesday',
    startTime: '06:00 PM',
    endTime: '08:30 PM',
    status: 'limited',
  },
  {
    id: 'availability-004',
    day: 'Thursday',
    startTime: '04:00 PM',
    endTime: '07:00 PM',
    status: 'available',
  },
  {
    id: 'availability-005',
    day: 'Friday',
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    status: 'available',
  },
];

const certifications: CertificationItem[] = [
  {
    id: 'cert-001',
    title: 'Youth Football Coaching Certificate',
    issuer: 'National Coaching Academy',
    expiryDate: '2027-02-15',
    status: 'valid',
  },
  {
    id: 'cert-002',
    title: 'First Aid & Sports Safety',
    issuer: 'Red Crescent Training Center',
    expiryDate: '2026-08-20',
    status: 'expiringSoon',
  },
  {
    id: 'cert-003',
    title: 'Child Safeguarding Awareness',
    issuer: 'Academy Compliance Unit',
    expiryDate: '2027-01-10',
    status: 'valid',
  },
];

function toCoachLevel(level?: string): CoachLevel {
  const normalizedLevel = level?.toLowerCase() ?? '';

  if (normalizedLevel.includes('beginner')) return 'beginner';
  if (normalizedLevel.includes('intermediate')) return 'intermediate';
  if (normalizedLevel.includes('advanced')) return 'advanced';

  return 'allLevels';
}

function splitCoachName(name: string) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || 'Coach';

  return {
    firstName,
    lastName,
  };
}

function buildInitialProfile(coach: CoachProfileDto): CoachAccountProfile {
  const name = splitCoachName(coach.name);

  return {
    firstName: name.firstName,
    lastName: name.lastName,
    email: 'coach.omar@example.com',
    phone: '+971 55 123 4567',
    emergencyPhone: '+971 55 987 6543',
    branch: coach.branch,
    specialization: coach.specialization,
    bio: `${coach.specialization} coach focused on youth technical skills, tactical awareness, teamwork, and safe training progression.`,
    preferredLevel: toCoachLevel(coach.levels[0]),
    language: 'English',
    timezone: 'Asia/Dubai',
  };
}

function getLevelLabel(level: CoachLevel) {
  const labels: Record<CoachLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    allLevels: 'All Levels',
  };

  return labels[level];
}

function getAvailabilityLabel(status: AvailabilityStatus) {
  const labels: Record<AvailabilityStatus, string> = {
    available: 'Available',
    limited: 'Limited',
    unavailable: 'Unavailable',
  };

  return labels[status];
}

export default function CoachSettingsPage() {
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);

  const defaultProfile = useMemo(
    () => buildInitialProfile(currentCoach),
    [currentCoach],
  );

  const [profile, setProfile] =
    useState<CoachAccountProfile>(() => defaultProfile);

  const [availability, setAvailability] =
    useState<AvailabilitySlot[]>(initialAvailability);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const [sessionReminders, setSessionReminders] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [parentMessages, setParentMessages] = useState(true);
  const [adminUpdates, setAdminUpdates] = useState(true);
  const [incidentAlerts, setIncidentAlerts] = useState(true);

  const [darkModePreference, setDarkModePreference] = useState(false);
  const [publicCoachProfile, setPublicCoachProfile] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  const summary = useMemo(() => {
    const availableDays = availability.filter(
      (slot) => slot.status === 'available',
    ).length;

    const limitedDays = availability.filter(
      (slot) => slot.status === 'limited',
    ).length;

    const validCertificates = certifications.filter(
      (item) => item.status === 'valid',
    ).length;

    const expiringCertificates = certifications.filter(
      (item) => item.status === 'expiringSoon',
    ).length;

    return {
      availableDays,
      limitedDays,
      validCertificates,
      expiringCertificates,
    };
  }, [availability]);

  const updateProfile = <K extends keyof CoachAccountProfile,>(
    key: K,
    value: CoachAccountProfile[K],
  ) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));

    setSavedMessage('');
  };

  const updateAvailability = <K extends keyof Omit<AvailabilitySlot, 'id'>,>(
    id: string,
    key: K,
    value: Omit<AvailabilitySlot, 'id'>[K],
  ) => {
    setAvailability((current) =>
      current.map((slot) =>
        slot.id === id
          ? {
            ...slot,
            [key]: value,
          }
          : slot,
      ),
    );

    setSavedMessage('');
  };

  const resetSettings = () => {
    setProfile(defaultProfile);
    setAvailability(initialAvailability);
    setEmailNotifications(true);
    setSmsNotifications(false);
    setWhatsappNotifications(true);
    setInAppNotifications(true);
    setSessionReminders(true);
    setAttendanceAlerts(true);
    setParentMessages(true);
    setAdminUpdates(true);
    setIncidentAlerts(true);
    setDarkModePreference(false);
    setPublicCoachProfile(true);
    setSavedMessage('');
  };

  const saveSettings = () => {
    setSavedMessage(
      'Coach settings saved locally. Backend profile/settings endpoint will be connected later.',
    );
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <UserRound className="h-4 w-4" />
              Coach Account Settings
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Settings
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Update your coach profile, availability, notification preferences,
              communication channels, certifications, and account safety
              settings for {currentCoach.name}.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>

              <button
                type="button"
                onClick={resetSettings}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarDays}
              label="Available Days"
              value={`${summary.availableDays}`}
              caption="Fully available coaching days"
              positive
            />

            <HeroMetricCard
              icon={Clock3}
              label="Limited Days"
              value={`${summary.limitedDays}`}
              caption="Days with limited availability"
              positive={summary.limitedDays <= 1}
            />

            <HeroMetricCard
              icon={ShieldCheck}
              label="Valid Certificates"
              value={`${summary.validCertificates}`}
              caption="Active compliance documents"
              positive
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Expiring Soon"
              value={`${summary.expiringCertificates}`}
              caption="Certificates needing attention"
              positive={summary.expiringCertificates === 0}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={UserRound}
          title="Coach Profile"
          value={`${profile.firstName} ${profile.lastName}`}
          description={profile.specialization}
          tone="blue"
        />

        <KpiCard
          icon={MapPin}
          title="Main Branch"
          value={profile.branch}
          description="Primary coaching location."
          tone="brand"
        />

        <KpiCard
          icon={Dumbbell}
          title="Preferred Level"
          value={getLevelLabel(profile.preferredLevel)}
          description="Default student level preference."
          tone="success"
        />

        <KpiCard
          icon={Bell}
          title="Notifications"
          value={inAppNotifications ? 'Enabled' : 'Limited'}
          description="Coach communication preferences."
          tone={inAppNotifications ? 'success' : 'warning'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={UserRound}
              title="Profile Information"
              description="Manage the coach profile information used inside the Coach Portal."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="First Name"
                value={profile.firstName}
                onChange={(value) => updateProfile('firstName', value)}
              />

              <InputField
                label="Last Name"
                value={profile.lastName}
                onChange={(value) => updateProfile('lastName', value)}
              />

              <InputField
                label="Email"
                value={profile.email}
                onChange={(value) => updateProfile('email', value)}
              />

              <InputField
                label="Phone"
                value={profile.phone}
                onChange={(value) => updateProfile('phone', value)}
              />

              <InputField
                label="Emergency Phone"
                value={profile.emergencyPhone}
                onChange={(value) => updateProfile('emergencyPhone', value)}
              />

              <InputField
                label="Main Branch"
                value={profile.branch}
                onChange={(value) => updateProfile('branch', value)}
              />

              <InputField
                label="Specialization"
                value={profile.specialization}
                onChange={(value) => updateProfile('specialization', value)}
              />

              <SelectField
                label="Preferred Level"
                value={profile.preferredLevel}
                options={[
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' },
                  { label: 'All Levels', value: 'allLevels' },
                ]}
                onChange={(value) =>
                  updateProfile('preferredLevel', value as CoachLevel)
                }
              />

              <SelectField
                label="Language"
                value={profile.language}
                options={[
                  { label: 'English', value: 'English' },
                  { label: 'Arabic', value: 'Arabic' },
                  { label: 'English / Arabic', value: 'English / Arabic' },
                ]}
                onChange={(value) => updateProfile('language', value)}
              />

              <SelectField
                label="Timezone"
                value={profile.timezone}
                options={[
                  { label: 'Asia/Dubai', value: 'Asia/Dubai' },
                  { label: 'Africa/Cairo', value: 'Africa/Cairo' },
                  { label: 'Asia/Riyadh', value: 'Asia/Riyadh' },
                ]}
                onChange={(value) => updateProfile('timezone', value)}
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Coach Bio</span>

              <textarea
                value={profile.bio}
                onChange={(event) => updateProfile('bio', event.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={CalendarDays}
              title="Weekly Availability"
              description="Set the working availability shown to academy scheduling workflows."
            />

            <div className="grid gap-4">
              {availability.map((slot) => (
                <AvailabilityRow
                  key={slot.id}
                  slot={slot}
                  onChange={(key, value) =>
                    updateAvailability(slot.id, key, value)
                  }
                />
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={Bell}
                title="Notification Channels"
                description="Choose how you prefer to receive updates."
              />

              <div className="grid gap-3">
                <ToggleRow
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive schedule and admin updates by email."
                  active={emailNotifications}
                  onToggle={() => setEmailNotifications((current) => !current)}
                />

                <ToggleRow
                  icon={Smartphone}
                  title="SMS Notifications"
                  description="Receive critical reminders by SMS."
                  active={smsNotifications}
                  onToggle={() => setSmsNotifications((current) => !current)}
                />

                <ToggleRow
                  icon={MessageSquare}
                  title="WhatsApp Notifications"
                  description="Receive selected parent/admin alerts on WhatsApp."
                  active={whatsappNotifications}
                  onToggle={() =>
                    setWhatsappNotifications((current) => !current)
                  }
                />

                <ToggleRow
                  icon={Bell}
                  title="In-App Notifications"
                  description="Show alerts inside the Coach Portal."
                  active={inAppNotifications}
                  onToggle={() => setInAppNotifications((current) => !current)}
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={Sparkles}
                title="Coach Preferences"
                description="Control which coach alerts and preferences are active."
              />

              <div className="grid gap-3">
                <ToggleRow
                  icon={CalendarCheck}
                  title="Session Reminders"
                  description="Remind me before assigned sessions."
                  active={sessionReminders}
                  onToggle={() => setSessionReminders((current) => !current)}
                />

                <ToggleRow
                  icon={ClipboardCheck}
                  title="Attendance Alerts"
                  description="Notify me about pending attendance."
                  active={attendanceAlerts}
                  onToggle={() => setAttendanceAlerts((current) => !current)}
                />

                <ToggleRow
                  icon={Users}
                  title="Parent Messages"
                  description="Notify me about parent communication."
                  active={parentMessages}
                  onToggle={() => setParentMessages((current) => !current)}
                />

                <ToggleRow
                  icon={ShieldCheck}
                  title="Incident Alerts"
                  description="Notify me about incident follow-up."
                  active={incidentAlerts}
                  onToggle={() => setIncidentAlerts((current) => !current)}
                />

                <ToggleRow
                  icon={MessageSquare}
                  title="Admin Updates"
                  description="Notify me about administration updates."
                  active={adminUpdates}
                  onToggle={() => setAdminUpdates((current) => !current)}
                />
              </div>
            </section>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Certifications & Compliance"
              description="Coach-visible certification status. Upload/edit actions can be connected later."
            />

            <div className="grid gap-4">
              {certifications.map((item) => (
                <CertificationCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <CoachSummaryPanel profile={profile} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={LockKeyhole}
              title="Security & Access"
              description="Coach account access and privacy preferences."
            />

            <div className="grid gap-3">
              <ToggleRow
                icon={Moon}
                title="Prefer Dark Mode"
                description="Use dark appearance when supported."
                active={darkModePreference}
                onToggle={() => setDarkModePreference((current) => !current)}
              />

              <ToggleRow
                icon={UserRound}
                title="Public Coach Profile"
                description="Allow public website to show coach profile."
                active={publicCoachProfile}
                onToggle={() => setPublicCoachProfile((current) => !current)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
              Password, two-factor authentication, and device sessions should be
              connected to the authentication backend later.
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={Sparkles}
              title="Quick Actions"
              description="Useful shortcuts for your coach workspace."
            />

            <div className="grid gap-3">
              <QuickAction
                icon={CalendarDays}
                title="Coach Schedule"
                description="Open your weekly schedule."
                href="/coach/schedule"
              />

              <QuickAction
                icon={Users}
                title="Assigned Students"
                description="Review students assigned to you."
                href="/coach/players"
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Attendance"
                description="Mark or review attendance."
                href="/coach/attendance"
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add development notes."
                href="/coach/progress-notes"
              />

              <QuickAction
                icon={ShieldCheck}
                title="Incident Reports"
                description="Report safety or behavior concerns."
                href="/coach/incidents"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={Save}
              title="Save Changes"
              description="Apply the updated local settings."
            />

            <div className="grid gap-3">
              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>

              <button
                type="button"
                onClick={resetSettings}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Settings
              </button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function HeroMetricCard({
  icon: Icon,
  label,
  value,
  caption,
  positive,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  positive: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black',
            positive
              ? 'bg-green-400/15 text-green-200'
              : 'bg-red-400/15 text-red-200',
          ].join(' ')}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Live
        </span>
      </div>

      <p className="text-xs font-black uppercase tracking-[0.15em] text-white/55">
        {label}
      </p>

      <h3 className="mt-2 line-clamp-1 text-xl font-black text-white">
        {value}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/60">
        {caption}
      </p>
    </article>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  tone: 'blue' | 'brand' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    brand: 'bg-brand-yellow text-brand-blue',
    success:
      'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -end-10 -top-10 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl" />

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="relative mt-5 text-sm font-bold text-muted-foreground">
        {title}
      </p>

      <p className="relative mt-2 line-clamp-1 text-2xl font-black text-brand-blue dark:text-white">
        {value}
      </p>

      <p className="relative mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AvailabilityRow({
  slot,
  onChange,
}: {
  slot: AvailabilitySlot;
  onChange: <K extends keyof Omit<AvailabilitySlot, 'id'>>(
    key: K,
    value: Omit<AvailabilitySlot, 'id'>[K],
  ) => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <InputField
          label="Day"
          value={slot.day}
          onChange={(value) => onChange('day', value)}
        />

        <InputField
          label="Start Time"
          value={slot.startTime}
          onChange={(value) => onChange('startTime', value)}
        />

        <InputField
          label="End Time"
          value={slot.endTime}
          onChange={(value) => onChange('endTime', value)}
        />

        <SelectField
          label="Status"
          value={slot.status}
          options={[
            { label: 'Available', value: 'available' },
            { label: 'Limited', value: 'limited' },
            { label: 'Unavailable', value: 'unavailable' },
          ]}
          onChange={(value) => onChange('status', value as AvailabilityStatus)}
        />
      </div>

      <div className="mt-3">
        <AvailabilityBadge status={slot.status} />
      </div>
    </article>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  active,
  onToggle,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-start transition hover:border-brand-yellow hover:bg-brand-yellow/10',
        active
          ? 'border-brand-yellow bg-brand-yellow/10'
          : 'border-border bg-background',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            active
              ? 'bg-brand-yellow text-brand-blue'
              : 'bg-secondary text-muted-foreground',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <span
        className={[
          'inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition',
          active ? 'bg-brand-yellow' : 'bg-secondary',
        ].join(' ')}
      >
        <span
          className={[
            'h-5 w-5 rounded-full bg-background shadow transition',
            active ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </span>
    </button>
  );
}

function CoachSummaryPanel({ profile }: { profile: CoachAccountProfile }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Star className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Coach Summary
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {profile.firstName} {profile.lastName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {profile.specialization} · {profile.branch}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            {getLevelLabel(profile.preferredLevel)}
          </span>

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {profile.language}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Mail} label="Email" value={profile.email} />
        <DetailLine icon={Phone} label="Phone" value={profile.phone} />
        <DetailLine
          icon={Phone}
          label="Emergency"
          value={profile.emergencyPhone}
        />
        <DetailLine icon={MapPin} label="Branch" value={profile.branch} />
        <DetailLine icon={Languages} label="Language" value={profile.language} />
        <DetailLine icon={Clock3} label="Timezone" value={profile.timezone} />
      </div>
    </aside>
  );
}

function CertificationCard({ item }: { item: CertificationItem }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-black">{item.title}</h3>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              {item.issuer}
            </p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Expiry: {item.expiryDate}
            </p>
          </div>
        </div>

        <CertificationBadge status={item.status} />
      </div>
    </article>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:shadow-sm dark:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="break-words text-sm font-black">{value}</p>
    </div>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const className =
    status === 'available'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'limited'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getAvailabilityLabel(status)}
    </span>
  );
}

function CertificationBadge({
  status,
}: {
  status: CertificationItem['status'];
}) {
  const label =
    status === 'valid'
      ? 'Valid'
      : status === 'expiringSoon'
        ? 'Expiring Soon'
        : 'Expired';

  const className =
    status === 'valid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'expiringSoon'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {label}
    </span>
  );
}