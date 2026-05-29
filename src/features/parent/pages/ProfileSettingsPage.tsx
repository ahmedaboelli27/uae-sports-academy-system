import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Globe2,
  HeartPulse,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  MonitorCog,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCog,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ThemeMode = 'system' | 'light' | 'dark';
type LanguageMode = 'en' | 'ar';
type NotificationChannel = 'email' | 'whatsapp' | 'inApp';
type ContactPreference = 'email' | 'phone' | 'whatsapp';

interface ChildSummary {
  id: string;
  name: string;
  program: string;
  status: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface ParentProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  role: string;
  emiratesId: string;
  address: string;
  city: string;
  country: string;
  preferredContact: ContactPreference;
  language: LanguageMode;
  theme: ThemeMode;
  billingEmail: string;
  billingPhone: string;
  notifications: Record<NotificationChannel, boolean>;
  emergencyContact: EmergencyContact;
}

const linkedChildren: ChildSummary[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    program: 'Football Development',
    status: 'Active',
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    program: 'Swimming Academy',
    status: 'Expiring Soon',
  },
  {
    id: 'child-003',
    name: 'Yousef Khaled',
    program: 'Basketball Skills',
    status: 'Active',
  },
];

const accountActivity = [
  {
    id: 'activity-001',
    title: 'Profile information reviewed',
    date: '2026-06-02',
    description: 'Parent profile information was opened from the portal.',
  },
  {
    id: 'activity-002',
    title: 'Invoice viewed',
    date: '2026-06-01',
    description: 'Pending swimming academy invoice was reviewed.',
  },
  {
    id: 'activity-003',
    title: 'Message sent',
    date: '2026-05-23',
    description: 'Progress question was sent to Coach Sara.',
  },
];

const initialProfile: ParentProfileForm = {
  firstName: 'Khaled',
  lastName: 'Al Mansouri',
  email: 'parent@academy.ae',
  phone: '+971 50 000 0000',
  secondaryPhone: '+971 55 000 0000',
  role: 'Parent Account',
  emiratesId: '784-0000-0000000-0',
  address: 'Dubai Marina',
  city: 'Dubai',
  country: 'United Arab Emirates',
  preferredContact: 'whatsapp',
  language: 'en',
  theme: 'system',
  billingEmail: 'billing.parent@academy.ae',
  billingPhone: '+971 50 000 0000',
  notifications: {
    email: true,
    whatsapp: true,
    inApp: true,
  },
  emergencyContact: {
    name: 'Sara Al Mansouri',
    relationship: 'Mother',
    phone: '+971 56 000 0000',
  },
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ParentProfileForm>(initialProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const updateProfile = <K extends keyof ParentProfileForm>(
    key: K,
    value: ParentProfileForm[K],
  ) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));

    setSavedMessage('');
  };

  const updateEmergencyContact = <K extends keyof EmergencyContact>(
    key: K,
    value: EmergencyContact[K],
  ) => {
    setProfile((current) => ({
      ...current,
      emergencyContact: {
        ...current.emergencyContact,
        [key]: value,
      },
    }));

    setSavedMessage('');
  };

  const toggleNotification = (channel: NotificationChannel) => {
    setProfile((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [channel]: !current.notifications[channel],
      },
    }));

    setSavedMessage('');
  };

  const saveProfile = () => {
    setSavedMessage(
      'Parent profile settings saved locally. Backend update endpoint will be connected later.',
    );
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSavedMessage('Please complete all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSavedMessage('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setSavedMessage('Password must be at least 8 characters.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSavedMessage(
      'Password change validated locally. Backend password endpoint will be connected later.',
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
              <UserCog className="h-4 w-4" />
              Parent Account Center
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Profile & Account Settings
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage parent profile information, contact details, linked
              children, emergency contact, billing preferences, notifications,
              language, theme, password, and account security settings.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveProfile}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </button>

              <Link
                to="/parent/children"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Users className="h-4 w-4" />
                My Children
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-yellow text-brand-blue">
                <UserRound className="h-10 w-10" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
                  Signed in as
                </p>
                <h2 className="mt-1 text-2xl font-black">{fullName}</h2>
                <p className="mt-1 text-sm font-semibold text-white/70">
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <HeroMiniCard icon={Mail} label="Email" value={profile.email} />
              <HeroMiniCard icon={Smartphone} label="Phone" value={profile.phone} />
              <HeroMiniCard
                icon={Users}
                label="Children"
                value={`${linkedChildren.length} Linked`}
              />
              <HeroMiniCard
                icon={MonitorCog}
                label="Theme"
                value={formatTheme(profile.theme)}
              />
            </div>
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
          icon={Users}
          title="Linked Children"
          value={`${linkedChildren.length}`}
          description="Children connected to this parent account."
          tone="blue"
        />

        <KpiCard
          icon={Bell}
          title="Notifications"
          value={`${Object.values(profile.notifications).filter(Boolean).length}/3`}
          description="Enabled communication channels."
          tone="success"
        />

        <KpiCard
          icon={ShieldCheck}
          title="Security"
          value="Ready"
          description="Password and session actions are prepared."
          tone="success"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Backend"
          value="Pending"
          description="Frontend is ready for API integration."
          tone="warning"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <Panel
            icon={UserRound}
            title="Parent Information"
            description="Update the parent profile details used across the parent portal."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                icon={UserRound}
                label="First name"
                value={profile.firstName}
                onChange={(value) => updateProfile('firstName', value)}
              />

              <InputField
                icon={UserRound}
                label="Last name"
                value={profile.lastName}
                onChange={(value) => updateProfile('lastName', value)}
              />

              <InputField
                icon={Mail}
                label="Email address"
                value={profile.email}
                onChange={(value) => updateProfile('email', value)}
              />

              <InputField
                icon={Smartphone}
                label="Primary phone"
                value={profile.phone}
                onChange={(value) => updateProfile('phone', value)}
              />

              <InputField
                icon={Phone}
                label="Secondary phone"
                value={profile.secondaryPhone}
                onChange={(value) => updateProfile('secondaryPhone', value)}
              />

              <InputField
                icon={ShieldCheck}
                label="Emirates ID"
                value={profile.emiratesId}
                onChange={(value) => updateProfile('emiratesId', value)}
              />
            </div>
          </Panel>

          <Panel
            icon={MapPin}
            title="Address Information"
            description="Manage location information used for academy communication and records."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <InputField
                icon={MapPin}
                label="Address"
                value={profile.address}
                onChange={(value) => updateProfile('address', value)}
              />

              <InputField
                icon={MapPin}
                label="City"
                value={profile.city}
                onChange={(value) => updateProfile('city', value)}
              />

              <InputField
                icon={Globe2}
                label="Country"
                value={profile.country}
                onChange={(value) => updateProfile('country', value)}
              />
            </div>
          </Panel>

          <Panel
            icon={Users}
            title="Linked Children"
            description="Children connected to this parent account with quick access to profiles."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {linkedChildren.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          </Panel>

          <Panel
            icon={HeartPulse}
            title="Emergency Contact"
            description="Emergency contact information used by the academy when urgent follow-up is needed."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <InputField
                icon={UserRound}
                label="Contact name"
                value={profile.emergencyContact.name}
                onChange={(value) => updateEmergencyContact('name', value)}
              />

              <InputField
                icon={Users}
                label="Relationship"
                value={profile.emergencyContact.relationship}
                onChange={(value) =>
                  updateEmergencyContact('relationship', value)
                }
              />

              <InputField
                icon={Smartphone}
                label="Emergency phone"
                value={profile.emergencyContact.phone}
                onChange={(value) => updateEmergencyContact('phone', value)}
              />
            </div>
          </Panel>

          <Panel
            icon={WalletCards}
            title="Billing Preferences"
            description="Manage billing contact information used for invoices, receipts, and payment reminders."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                icon={Mail}
                label="Billing email"
                value={profile.billingEmail}
                onChange={(value) => updateProfile('billingEmail', value)}
              />

              <InputField
                icon={Smartphone}
                label="Billing phone"
                value={profile.billingPhone}
                onChange={(value) => updateProfile('billingPhone', value)}
              />
            </div>
          </Panel>

          <Panel
            icon={MonitorCog}
            title="Preferences & Notifications"
            description="Set preferred language, theme, communication method, and personal notification channels."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              <SelectCard
                icon={Globe2}
                title="Language"
                value={profile.language}
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Arabic', value: 'ar' },
                ]}
                onChange={(value) =>
                  updateProfile('language', value as LanguageMode)
                }
              />

              <SelectCard
                icon={MonitorCog}
                title="Theme"
                value={profile.theme}
                options={[
                  { label: 'System Default', value: 'system' },
                  { label: 'Light Mode', value: 'light' },
                  { label: 'Dark Mode', value: 'dark' },
                ]}
                onChange={(value) => updateProfile('theme', value as ThemeMode)}
              />

              <SelectCard
                icon={MessageSquare}
                title="Preferred Contact"
                value={profile.preferredContact}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Phone', value: 'phone' },
                  { label: 'WhatsApp', value: 'whatsapp' },
                ]}
                onChange={(value) =>
                  updateProfile('preferredContact', value as ContactPreference)
                }
              />
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-black">Notification Channels</p>

              <div className="grid gap-3 md:grid-cols-3">
                <ToggleCard
                  icon={Mail}
                  title="Email"
                  description="Invoices, documents, and account updates"
                  checked={profile.notifications.email}
                  onClick={() => toggleNotification('email')}
                />

                <ToggleCard
                  icon={Smartphone}
                  title="WhatsApp"
                  description="Fast attendance and schedule alerts"
                  checked={profile.notifications.whatsapp}
                  onClick={() => toggleNotification('whatsapp')}
                />

                <ToggleCard
                  icon={Bell}
                  title="In-app"
                  description="Portal alerts and reminders"
                  checked={profile.notifications.inApp}
                  onClick={() => toggleNotification('inApp')}
                />
              </div>
            </div>
          </Panel>

          <Panel
            icon={KeyRound}
            title="Password & Security"
            description="Change password and prepare security actions for backend integration."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <InputField
                icon={Lock}
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <InputField
                icon={KeyRound}
                label="New password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <InputField
                icon={KeyRound}
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={changePassword}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>

              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
                Sign out other sessions
              </button>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <AccountSummaryCard profile={profile} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Account Activity</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recent parent portal activity.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {accountActivity.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          </section>

          <StatusCard
            icon={ShieldCheck}
            title="Security Ready"
            description="This page is ready to connect with profile update, password change, and session management backend endpoints."
            tone="success"
          />

          <StatusCard
            icon={MonitorCog}
            title="Preference Layer"
            description="Language, theme, notification, and billing preferences are currently frontend-ready and can later persist to the user profile API."
            tone="warning"
          />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful account shortcuts.
                </p>
              </div>

              <Eye className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Users}
                title="My Children"
                description="Open linked children profiles."
                href="/parent/children"
              />

              <QuickAction
                icon={CreditCard}
                title="Invoices"
                description="Review family invoices and payments."
                href="/parent/invoices"
              />

              <QuickAction
                icon={FileText}
                title="Documents"
                description="Review documents and consent files."
                href="/parent/documents"
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
                description="Contact academy staff."
                href="/parent/messages"
              />
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex items-start gap-4 border-b border-border bg-gradient-to-r from-brand-blue/[0.06] via-card to-brand-yellow/10 p-5 dark:from-white/[0.04] dark:via-card dark:to-brand-yellow/10 sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-7 w-7" />
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
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
  tone: 'blue' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
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

      <p className="relative mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>

      <p className="relative mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        />
      </div>
    </label>
  );
}

function SelectCard({
  icon: Icon,
  title,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[1.5rem] border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-black">{title}</p>
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm font-bold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
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

function ToggleCard({
  icon: Icon,
  title,
  description,
  checked,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-[1.5rem] border p-4 text-start transition',
        checked
          ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.04]',
      ].join(' ')}
    >
      <div
        className={[
          'mb-4 flex h-11 w-11 items-center justify-center rounded-2xl',
          checked
            ? 'bg-brand-blue/10 text-brand-blue'
            : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm font-black">{title}</p>
      <p
        className={[
          'mt-1 text-xs font-semibold leading-5',
          checked ? 'text-brand-blue/70' : 'text-muted-foreground',
        ].join(' ')}
      >
        {description}
      </p>
    </button>
  );
}

function ChildCard({ child }: { child: ChildSummary }) {
  return (
    <article className="rounded-[1.5rem] border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-black">{child.name}</h3>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {child.program}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
          {child.status}
        </span>
      </div>

      <Link
        to={`/parent/children/${child.id}`}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
      >
        View Profile
      </Link>
    </article>
  );
}

function AccountSummaryCard({ profile }: { profile: ParentProfileForm }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Account Overview
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {profile.firstName} {profile.lastName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {profile.role} · {profile.email}
        </p>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Mail} label="Email" value={profile.email} />
        <DetailLine icon={Smartphone} label="Phone" value={profile.phone} />
        <DetailLine
          icon={MessageSquare}
          label="Preferred Contact"
          value={formatContact(profile.preferredContact)}
        />
        <DetailLine
          icon={Globe2}
          label="Language"
          value={profile.language.toUpperCase()}
        />
        <DetailLine
          icon={MonitorCog}
          label="Theme"
          value={formatTheme(profile.theme)}
        />
      </div>
    </aside>
  );
}

function ActivityRow({
  activity,
}: {
  activity: {
    id: string;
    title: string;
    date: string;
    description: string;
  };
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{activity.title}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {activity.date}
          </p>
          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
            {activity.description}
          </p>
        </div>
      </div>
    </article>
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

function StatusCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow';

  return (
    <article className={`rounded-[2rem] border p-5 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-current dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-black">{title}</h3>
      <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
        {description}
      </p>
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

      <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function HeroMiniCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
      <div className="mb-2 flex items-center gap-2 text-white/60">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-black uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="break-words text-xs font-black text-white">{value}</p>
    </div>
  );
}

function formatTheme(theme: ThemeMode) {
  const labels: Record<ThemeMode, string> = {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  };

  return labels[theme];
}

function formatContact(contact: ContactPreference) {
  const labels: Record<ContactPreference, string> = {
    email: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
  };

  return labels[contact];
}