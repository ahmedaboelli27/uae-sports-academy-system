import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  Eye,
  FileText,
  Globe2,
  Image,
  Info,
  KeyRound,
  Languages,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Receipt,
  RefreshCcw,
  RotateCcw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type SettingsSectionKey =
  | 'academy'
  | 'branding'
  | 'localization'
  | 'schedule'
  | 'enrollment'
  | 'finance'
  | 'notifications'
  | 'security'
  | 'integrations'
  | 'data';

interface SettingsSection {
  key: SettingsSectionKey;
  title: string;
  description: string;
  icon: LucideIcon;
}

const initialSettings = {
  academyName: 'AspireX Sports Academy',
  legalName: 'AspireX Sports Academy LLC',
  academyCode: 'ASPX-UAE',
  primaryEmail: 'info@academy.ae',
  supportEmail: 'support@academy.ae',
  primaryPhone: '+971 50 000 0000',
  whatsappNumber: '+971 50 000 0000',
  headquarters: 'Dubai, United Arab Emirates',
  defaultBranch: 'Dubai Main Branch',

  primaryColor: '#00129B',
  accentColor: '#FFD400',
  logoUrl: '/logo.png',
  faviconUrl: '/logo.png',
  publicWebsiteEnabled: true,
  showOffersOnHomepage: true,
  showGalleryOnHomepage: true,
  maintenanceMode: false,

  defaultLanguage: 'en',
  secondaryLanguage: 'ar',
  timezone: 'Asia/Dubai',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'AED',
  firstDayOfWeek: 'monday',

  sessionDuration: '60',
  bufferBetweenSessions: '15',
  maxStudentsPerSession: '18',
  attendanceGraceMinutes: '10',
  allowCoachAttendanceEdit: true,
  allowMakeUpSessions: true,
  autoMarkNoShow: true,

  trialBookingEnabled: true,
  parentSelfRegistration: true,
  coachRequestEnabled: true,
  requireAdminApprovalForCoach: true,
  requireTermsAcceptance: true,
  minimumPlayerAge: '4',
  maximumPlayerAge: '18',
  trialExpiryDays: '7',

  invoicePrefix: 'INV',
  receiptPrefix: 'RCPT',
  subscriptionPrefix: 'SUB',
  taxEnabled: true,
  taxName: 'VAT',
  taxRate: '5',
  paymentDueDays: '7',
  latePaymentReminderDays: '3',
  allowPartialPayments: true,
  autoGenerateInvoices: true,

  emailNotifications: true,
  smsNotifications: false,
  whatsappNotifications: true,
  inAppNotifications: true,
  notifyParentsOnAttendance: true,
  notifyParentsOnInvoice: true,
  notifyCoachesOnScheduleChange: true,
  notificationSenderName: 'AspireX Academy',

  passwordMinLength: '8',
  requireStrongPassword: true,
  requireTwoFactorForAdmins: false,
  sessionTimeoutMinutes: '60',
  maxLoginAttempts: '5',
  lockoutMinutes: '15',
  allowMultipleSessions: true,
  auditLogsEnabled: true,

  googleAnalyticsId: '',
  metaPixelId: '',
  whatsappApiProvider: 'manual',
  emailProvider: 'smtp',
  smsProvider: 'disabled',
  paymentGateway: 'manual',
  mapProvider: 'google',
  storageProvider: 'local',

  backupEnabled: true,
  backupFrequency: 'daily',
  retentionDays: '90',
  exportFormat: 'xlsx',
  anonymizeDeletedUsers: true,
  allowDataExport: true,
  allowHardDelete: false,
  systemHealthChecks: true,
};

type SettingsState = typeof initialSettings;

const settingsSections: SettingsSection[] = [
  {
    key: 'academy',
    title: 'Academy Profile',
    description: 'Core academy identity, contact details, and default branch.',
    icon: Building2,
  },
  {
    key: 'branding',
    title: 'Branding & Website',
    description: 'Logo, colors, public website controls, and maintenance mode.',
    icon: Palette,
  },
  {
    key: 'localization',
    title: 'Localization',
    description: 'Language, timezone, dates, currency, and regional preferences.',
    icon: Globe2,
  },
  {
    key: 'schedule',
    title: 'Scheduling',
    description: 'Session duration, capacity, attendance grace, and make-up rules.',
    icon: CalendarDays,
  },
  {
    key: 'enrollment',
    title: 'Enrollment',
    description: 'Trial bookings, registration rules, approvals, and age limits.',
    icon: Users,
  },
  {
    key: 'finance',
    title: 'Finance',
    description: 'Invoices, receipts, VAT, reminders, and payment behavior.',
    icon: WalletCards,
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Email, WhatsApp, SMS, in-app alerts, and user communication.',
    icon: Bell,
  },
  {
    key: 'security',
    title: 'Security & Access',
    description: 'Passwords, admin protection, sessions, lockouts, and audit logs.',
    icon: ShieldCheck,
  },
  {
    key: 'integrations',
    title: 'Integrations',
    description: 'Analytics, maps, WhatsApp, payment, email, and storage providers.',
    icon: Link2,
  },
  {
    key: 'data',
    title: 'Data & Backups',
    description: 'Backups, exports, retention, deletion policy, and system health.',
    icon: Database,
  },
];

export default function SystemSettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionKey>('academy');
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [savedMessage, setSavedMessage] = useState('');

  const activeSectionMeta = useMemo(
    () =>
      settingsSections.find((section) => section.key === activeSection) ??
      settingsSections[0],
    [activeSection],
  );

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleSave = () => {
    setSavedMessage('Settings saved locally. Backend connection will be added in the API phase.');
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setActiveSection('academy');
    setSavedMessage('Settings restored to the default frontend configuration.');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Settings className="h-4 w-4" />
              Admin Control Center
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              System Settings
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage the complete academy configuration from one place:
              identity, public website, scheduling, enrollment, finance,
              notifications, security, integrations, backups, and data rules.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroMetric
              icon={ShieldCheck}
              label="Access Mode"
              value="Admin Only"
            />
            <HeroMetric
              icon={Server}
              label="Current Mode"
              value="Frontend Mock"
            />
            <HeroMetric
              icon={Clock3}
              label="Last Update"
              value="Not synced"
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold leading-6 text-green-700 dark:text-green-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3 px-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                <Settings className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black">Settings Menu</p>
                <p className="text-xs font-bold text-muted-foreground">
                  Choose a configuration area
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;

                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActiveSection(section.key)}
                    className={[
                      'flex w-full items-start gap-3 rounded-2xl border p-3 text-start transition',
                      isActive
                        ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.18)]'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        isActive
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'bg-background text-muted-foreground',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-black">
                        {section.title}
                      </span>
                      <span
                        className={[
                          'mt-1 block text-xs font-semibold leading-5',
                          isActive ? 'text-brand-blue/70' : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {section.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-yellow/30 bg-brand-yellow/10 p-5 text-brand-blue shadow-sm dark:text-brand-yellow">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <p className="text-sm font-black">Important</p>
            <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
              These settings are currently frontend-ready. When the backend
              settings module is added, the same structure can be connected to
              the database without changing the page design.
            </p>
          </div>
        </aside>

        <main className="space-y-6">
          <SettingsPanel
            icon={activeSectionMeta.icon}
            title={activeSectionMeta.title}
            description={activeSectionMeta.description}
            actions={
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>
            }
          >
            {activeSection === 'academy' ? (
              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Building2}
                  label="Academy display name"
                  value={settings.academyName}
                  onChange={(value) => updateSetting('academyName', value)}
                />

                <InputField
                  icon={FileText}
                  label="Legal entity name"
                  value={settings.legalName}
                  onChange={(value) => updateSetting('legalName', value)}
                />

                <InputField
                  icon={KeyRound}
                  label="Academy code"
                  value={settings.academyCode}
                  onChange={(value) => updateSetting('academyCode', value)}
                />

                <InputField
                  icon={Mail}
                  label="Primary email"
                  type="email"
                  value={settings.primaryEmail}
                  onChange={(value) => updateSetting('primaryEmail', value)}
                />

                <InputField
                  icon={Mail}
                  label="Support email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(value) => updateSetting('supportEmail', value)}
                />

                <InputField
                  icon={Smartphone}
                  label="Primary phone"
                  value={settings.primaryPhone}
                  onChange={(value) => updateSetting('primaryPhone', value)}
                />

                <InputField
                  icon={MessageSquare}
                  label="WhatsApp number"
                  value={settings.whatsappNumber}
                  onChange={(value) => updateSetting('whatsappNumber', value)}
                />

                <InputField
                  icon={MapPin}
                  label="Headquarters"
                  value={settings.headquarters}
                  onChange={(value) => updateSetting('headquarters', value)}
                />

                <InputField
                  icon={Building2}
                  label="Default branch"
                  value={settings.defaultBranch}
                  onChange={(value) => updateSetting('defaultBranch', value)}
                />
              </div>
            ) : null}

            {activeSection === 'branding' ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Palette}
                    label="Primary brand color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(value) => updateSetting('primaryColor', value)}
                  />

                  <InputField
                    icon={Palette}
                    label="Accent brand color"
                    type="color"
                    value={settings.accentColor}
                    onChange={(value) => updateSetting('accentColor', value)}
                  />

                  <InputField
                    icon={Image}
                    label="Logo URL"
                    value={settings.logoUrl}
                    onChange={(value) => updateSetting('logoUrl', value)}
                  />

                  <InputField
                    icon={Image}
                    label="Favicon URL"
                    value={settings.faviconUrl}
                    onChange={(value) => updateSetting('faviconUrl', value)}
                  />
                </div>

                <SettingsGrid>
                  <ToggleRow
                    icon={Globe2}
                    title="Enable public website"
                    description="Allow visitors to access public pages and program information."
                    checked={settings.publicWebsiteEnabled}
                    onChange={(value) =>
                      updateSetting('publicWebsiteEnabled', value)
                    }
                  />

                  <ToggleRow
                    icon={CreditCard}
                    title="Show offers on homepage"
                    description="Display current offers and seasonal promotions on the public homepage."
                    checked={settings.showOffersOnHomepage}
                    onChange={(value) =>
                      updateSetting('showOffersOnHomepage', value)
                    }
                  />

                  <ToggleRow
                    icon={Image}
                    title="Show gallery on homepage"
                    description="Display training and academy images in the public website."
                    checked={settings.showGalleryOnHomepage}
                    onChange={(value) =>
                      updateSetting('showGalleryOnHomepage', value)
                    }
                  />

                  <ToggleRow
                    icon={AlertTriangle}
                    title="Maintenance mode"
                    description="Temporarily hide public pages during major updates."
                    checked={settings.maintenanceMode}
                    onChange={(value) => updateSetting('maintenanceMode', value)}
                    danger
                  />
                </SettingsGrid>
              </div>
            ) : null}

            {activeSection === 'localization' ? (
              <div className="grid gap-5 lg:grid-cols-2">
                <SelectField
                  icon={Languages}
                  label="Default language"
                  value={settings.defaultLanguage}
                  onChange={(value) => updateSetting('defaultLanguage', value)}
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'Arabic', value: 'ar' },
                  ]}
                />

                <SelectField
                  icon={Languages}
                  label="Secondary language"
                  value={settings.secondaryLanguage}
                  onChange={(value) => updateSetting('secondaryLanguage', value)}
                  options={[
                    { label: 'Arabic', value: 'ar' },
                    { label: 'English', value: 'en' },
                  ]}
                />

                <SelectField
                  icon={Globe2}
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) => updateSetting('timezone', value)}
                  options={[
                    { label: 'Asia/Dubai', value: 'Asia/Dubai' },
                    { label: 'Africa/Cairo', value: 'Africa/Cairo' },
                    { label: 'UTC', value: 'UTC' },
                  ]}
                />

                <SelectField
                  icon={CalendarDays}
                  label="Date format"
                  value={settings.dateFormat}
                  onChange={(value) => updateSetting('dateFormat', value)}
                  options={[
                    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                  ]}
                />

                <SelectField
                  icon={Clock3}
                  label="Time format"
                  value={settings.timeFormat}
                  onChange={(value) => updateSetting('timeFormat', value)}
                  options={[
                    { label: '12-hour', value: '12h' },
                    { label: '24-hour', value: '24h' },
                  ]}
                />

                <SelectField
                  icon={WalletCards}
                  label="Currency"
                  value={settings.currency}
                  onChange={(value) => updateSetting('currency', value)}
                  options={[
                    { label: 'AED — UAE Dirham', value: 'AED' },
                    { label: 'USD — US Dollar', value: 'USD' },
                    { label: 'EGP — Egyptian Pound', value: 'EGP' },
                  ]}
                />

                <SelectField
                  icon={CalendarDays}
                  label="First day of week"
                  value={settings.firstDayOfWeek}
                  onChange={(value) => updateSetting('firstDayOfWeek', value)}
                  options={[
                    { label: 'Monday', value: 'monday' },
                    { label: 'Sunday', value: 'sunday' },
                    { label: 'Saturday', value: 'saturday' },
                  ]}
                />
              </div>
            ) : null}

            {activeSection === 'schedule' ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Clock3}
                    label="Default session duration / minutes"
                    type="number"
                    value={settings.sessionDuration}
                    onChange={(value) => updateSetting('sessionDuration', value)}
                  />

                  <InputField
                    icon={Clock3}
                    label="Buffer between sessions / minutes"
                    type="number"
                    value={settings.bufferBetweenSessions}
                    onChange={(value) =>
                      updateSetting('bufferBetweenSessions', value)
                    }
                  />

                  <InputField
                    icon={Users}
                    label="Maximum students per session"
                    type="number"
                    value={settings.maxStudentsPerSession}
                    onChange={(value) =>
                      updateSetting('maxStudentsPerSession', value)
                    }
                  />

                  <InputField
                    icon={Clock3}
                    label="Attendance grace period / minutes"
                    type="number"
                    value={settings.attendanceGraceMinutes}
                    onChange={(value) =>
                      updateSetting('attendanceGraceMinutes', value)
                    }
                  />
                </div>

                <SettingsGrid>
                  <ToggleRow
                    icon={UserCheck}
                    title="Allow coaches to edit attendance"
                    description="Coaches can correct attendance records after marking sessions."
                    checked={settings.allowCoachAttendanceEdit}
                    onChange={(value) =>
                      updateSetting('allowCoachAttendanceEdit', value)
                    }
                  />

                  <ToggleRow
                    icon={RefreshCcw}
                    title="Allow make-up sessions"
                    description="Parents can request replacement sessions for missed classes."
                    checked={settings.allowMakeUpSessions}
                    onChange={(value) =>
                      updateSetting('allowMakeUpSessions', value)
                    }
                  />

                  <ToggleRow
                    icon={Eye}
                    title="Auto mark no-show"
                    description="Automatically mark students as no-show after the grace period."
                    checked={settings.autoMarkNoShow}
                    onChange={(value) => updateSetting('autoMarkNoShow', value)}
                  />
                </SettingsGrid>
              </div>
            ) : null}

            {activeSection === 'enrollment' ? (
              <div className="space-y-6">
                <SettingsGrid>
                  <ToggleRow
                    icon={CalendarDays}
                    title="Enable trial booking"
                    description="Allow visitors to book trial sessions from the public website."
                    checked={settings.trialBookingEnabled}
                    onChange={(value) =>
                      updateSetting('trialBookingEnabled', value)
                    }
                  />

                  <ToggleRow
                    icon={Users}
                    title="Parent self-registration"
                    description="Allow parents to create accounts from the public registration page."
                    checked={settings.parentSelfRegistration}
                    onChange={(value) =>
                      updateSetting('parentSelfRegistration', value)
                    }
                  />

                  <ToggleRow
                    icon={UserCheck}
                    title="Coach request registration"
                    description="Allow coaches to submit requests without immediate active access."
                    checked={settings.coachRequestEnabled}
                    onChange={(value) =>
                      updateSetting('coachRequestEnabled', value)
                    }
                  />

                  <ToggleRow
                    icon={ShieldCheck}
                    title="Require admin approval for coaches"
                    description="Coach accounts remain inactive until approved by an admin."
                    checked={settings.requireAdminApprovalForCoach}
                    onChange={(value) =>
                      updateSetting('requireAdminApprovalForCoach', value)
                    }
                  />

                  <ToggleRow
                    icon={FileText}
                    title="Require terms acceptance"
                    description="Parents and coaches must accept terms before submitting forms."
                    checked={settings.requireTermsAcceptance}
                    onChange={(value) =>
                      updateSetting('requireTermsAcceptance', value)
                    }
                  />
                </SettingsGrid>

                <div className="grid gap-5 lg:grid-cols-3">
                  <InputField
                    icon={Users}
                    label="Minimum player age"
                    type="number"
                    value={settings.minimumPlayerAge}
                    onChange={(value) =>
                      updateSetting('minimumPlayerAge', value)
                    }
                  />

                  <InputField
                    icon={Users}
                    label="Maximum player age"
                    type="number"
                    value={settings.maximumPlayerAge}
                    onChange={(value) =>
                      updateSetting('maximumPlayerAge', value)
                    }
                  />

                  <InputField
                    icon={Clock3}
                    label="Trial request expiry / days"
                    type="number"
                    value={settings.trialExpiryDays}
                    onChange={(value) =>
                      updateSetting('trialExpiryDays', value)
                    }
                  />
                </div>
              </div>
            ) : null}

            {activeSection === 'finance' ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-3">
                  <InputField
                    icon={Receipt}
                    label="Invoice prefix"
                    value={settings.invoicePrefix}
                    onChange={(value) => updateSetting('invoicePrefix', value)}
                  />

                  <InputField
                    icon={Receipt}
                    label="Receipt prefix"
                    value={settings.receiptPrefix}
                    onChange={(value) => updateSetting('receiptPrefix', value)}
                  />

                  <InputField
                    icon={CreditCard}
                    label="Subscription prefix"
                    value={settings.subscriptionPrefix}
                    onChange={(value) =>
                      updateSetting('subscriptionPrefix', value)
                    }
                  />

                  <InputField
                    icon={Receipt}
                    label="Tax name"
                    value={settings.taxName}
                    onChange={(value) => updateSetting('taxName', value)}
                  />

                  <InputField
                    icon={Receipt}
                    label="Tax rate %"
                    type="number"
                    value={settings.taxRate}
                    onChange={(value) => updateSetting('taxRate', value)}
                  />

                  <InputField
                    icon={Clock3}
                    label="Payment due after / days"
                    type="number"
                    value={settings.paymentDueDays}
                    onChange={(value) => updateSetting('paymentDueDays', value)}
                  />

                  <InputField
                    icon={Bell}
                    label="Late payment reminder / days"
                    type="number"
                    value={settings.latePaymentReminderDays}
                    onChange={(value) =>
                      updateSetting('latePaymentReminderDays', value)
                    }
                  />
                </div>

                <SettingsGrid>
                  <ToggleRow
                    icon={Receipt}
                    title="Enable tax"
                    description="Apply VAT/tax configuration to invoices."
                    checked={settings.taxEnabled}
                    onChange={(value) => updateSetting('taxEnabled', value)}
                  />

                  <ToggleRow
                    icon={WalletCards}
                    title="Allow partial payments"
                    description="Parents can pay invoices in more than one transaction."
                    checked={settings.allowPartialPayments}
                    onChange={(value) =>
                      updateSetting('allowPartialPayments', value)
                    }
                  />

                  <ToggleRow
                    icon={Receipt}
                    title="Auto-generate invoices"
                    description="Automatically create invoices when subscriptions are created."
                    checked={settings.autoGenerateInvoices}
                    onChange={(value) =>
                      updateSetting('autoGenerateInvoices', value)
                    }
                  />
                </SettingsGrid>
              </div>
            ) : null}

            {activeSection === 'notifications' ? (
              <div className="space-y-6">
                <InputField
                  icon={Bell}
                  label="Notification sender name"
                  value={settings.notificationSenderName}
                  onChange={(value) =>
                    updateSetting('notificationSenderName', value)
                  }
                />

                <SettingsGrid>
                  <ToggleRow
                    icon={Mail}
                    title="Email notifications"
                    description="Send automated email messages for important system events."
                    checked={settings.emailNotifications}
                    onChange={(value) =>
                      updateSetting('emailNotifications', value)
                    }
                  />

                  <ToggleRow
                    icon={Smartphone}
                    title="SMS notifications"
                    description="Enable SMS messages when provider integration is ready."
                    checked={settings.smsNotifications}
                    onChange={(value) => updateSetting('smsNotifications', value)}
                  />

                  <ToggleRow
                    icon={MessageSquare}
                    title="WhatsApp notifications"
                    description="Send WhatsApp reminders and payment updates."
                    checked={settings.whatsappNotifications}
                    onChange={(value) =>
                      updateSetting('whatsappNotifications', value)
                    }
                  />

                  <ToggleRow
                    icon={Bell}
                    title="In-app notifications"
                    description="Show notifications inside parent, coach, and admin portals."
                    checked={settings.inAppNotifications}
                    onChange={(value) =>
                      updateSetting('inAppNotifications', value)
                    }
                  />

                  <ToggleRow
                    icon={UserCheck}
                    title="Notify parents on attendance"
                    description="Send attendance updates after session marking."
                    checked={settings.notifyParentsOnAttendance}
                    onChange={(value) =>
                      updateSetting('notifyParentsOnAttendance', value)
                    }
                  />

                  <ToggleRow
                    icon={Receipt}
                    title="Notify parents on invoices"
                    description="Notify parents when invoices are issued or overdue."
                    checked={settings.notifyParentsOnInvoice}
                    onChange={(value) =>
                      updateSetting('notifyParentsOnInvoice', value)
                    }
                  />

                  <ToggleRow
                    icon={CalendarDays}
                    title="Notify coaches on schedule changes"
                    description="Alert coaches when sessions are created, updated, or canceled."
                    checked={settings.notifyCoachesOnScheduleChange}
                    onChange={(value) =>
                      updateSetting('notifyCoachesOnScheduleChange', value)
                    }
                  />
                </SettingsGrid>
              </div>
            ) : null}

            {activeSection === 'security' ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-3">
                  <InputField
                    icon={Lock}
                    label="Minimum password length"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(value) =>
                      updateSetting('passwordMinLength', value)
                    }
                  />

                  <InputField
                    icon={Clock3}
                    label="Session timeout / minutes"
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(value) =>
                      updateSetting('sessionTimeoutMinutes', value)
                    }
                  />

                  <InputField
                    icon={ShieldCheck}
                    label="Max login attempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(value) =>
                      updateSetting('maxLoginAttempts', value)
                    }
                  />

                  <InputField
                    icon={Clock3}
                    label="Lockout duration / minutes"
                    type="number"
                    value={settings.lockoutMinutes}
                    onChange={(value) => updateSetting('lockoutMinutes', value)}
                  />
                </div>

                <SettingsGrid>
                  <ToggleRow
                    icon={Lock}
                    title="Require strong password"
                    description="Passwords must include uppercase, lowercase, number, and special character."
                    checked={settings.requireStrongPassword}
                    onChange={(value) =>
                      updateSetting('requireStrongPassword', value)
                    }
                  />

                  <ToggleRow
                    icon={ShieldCheck}
                    title="Require 2FA for admins"
                    description="Add an extra security step for admin accounts."
                    checked={settings.requireTwoFactorForAdmins}
                    onChange={(value) =>
                      updateSetting('requireTwoFactorForAdmins', value)
                    }
                  />

                  <ToggleRow
                    icon={Users}
                    title="Allow multiple sessions"
                    description="Users can remain logged in from more than one device."
                    checked={settings.allowMultipleSessions}
                    onChange={(value) =>
                      updateSetting('allowMultipleSessions', value)
                    }
                  />

                  <ToggleRow
                    icon={FileText}
                    title="Enable audit logs"
                    description="Record important admin actions for accountability and compliance."
                    checked={settings.auditLogsEnabled}
                    onChange={(value) =>
                      updateSetting('auditLogsEnabled', value)
                    }
                  />
                </SettingsGrid>
              </div>
            ) : null}

            {activeSection === 'integrations' ? (
              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Link2}
                  label="Google Analytics ID"
                  value={settings.googleAnalyticsId}
                  onChange={(value) =>
                    updateSetting('googleAnalyticsId', value)
                  }
                  placeholder="G-XXXXXXXXXX"
                />

                <InputField
                  icon={Link2}
                  label="Meta Pixel ID"
                  value={settings.metaPixelId}
                  onChange={(value) => updateSetting('metaPixelId', value)}
                  placeholder="000000000000000"
                />

                <SelectField
                  icon={MessageSquare}
                  label="WhatsApp provider"
                  value={settings.whatsappApiProvider}
                  onChange={(value) =>
                    updateSetting('whatsappApiProvider', value)
                  }
                  options={[
                    { label: 'Manual links', value: 'manual' },
                    { label: 'WhatsApp Cloud API', value: 'cloud' },
                    { label: 'Twilio WhatsApp', value: 'twilio' },
                  ]}
                />

                <SelectField
                  icon={Mail}
                  label="Email provider"
                  value={settings.emailProvider}
                  onChange={(value) => updateSetting('emailProvider', value)}
                  options={[
                    { label: 'SMTP', value: 'smtp' },
                    { label: 'SendGrid', value: 'sendgrid' },
                    { label: 'Amazon SES', value: 'ses' },
                  ]}
                />

                <SelectField
                  icon={Smartphone}
                  label="SMS provider"
                  value={settings.smsProvider}
                  onChange={(value) => updateSetting('smsProvider', value)}
                  options={[
                    { label: 'Disabled', value: 'disabled' },
                    { label: 'Twilio', value: 'twilio' },
                    { label: 'Local gateway', value: 'local' },
                  ]}
                />

                <SelectField
                  icon={CreditCard}
                  label="Payment gateway"
                  value={settings.paymentGateway}
                  onChange={(value) => updateSetting('paymentGateway', value)}
                  options={[
                    { label: 'Manual payments', value: 'manual' },
                    { label: 'Stripe', value: 'stripe' },
                    { label: 'Telr', value: 'telr' },
                    { label: 'PayTabs', value: 'paytabs' },
                  ]}
                />

                <SelectField
                  icon={MapPin}
                  label="Map provider"
                  value={settings.mapProvider}
                  onChange={(value) => updateSetting('mapProvider', value)}
                  options={[
                    { label: 'Google Maps', value: 'google' },
                    { label: 'Mapbox', value: 'mapbox' },
                  ]}
                />

                <SelectField
                  icon={Database}
                  label="Storage provider"
                  value={settings.storageProvider}
                  onChange={(value) => updateSetting('storageProvider', value)}
                  options={[
                    { label: 'Local storage', value: 'local' },
                    { label: 'Amazon S3', value: 's3' },
                    { label: 'Cloudinary', value: 'cloudinary' },
                  ]}
                />
              </div>
            ) : null}

            {activeSection === 'data' ? (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-3">
                  <SelectField
                    icon={RefreshCcw}
                    label="Backup frequency"
                    value={settings.backupFrequency}
                    onChange={(value) =>
                      updateSetting('backupFrequency', value)
                    }
                    options={[
                      { label: 'Daily', value: 'daily' },
                      { label: 'Weekly', value: 'weekly' },
                      { label: 'Monthly', value: 'monthly' },
                    ]}
                  />

                  <InputField
                    icon={Database}
                    label="Retention period / days"
                    type="number"
                    value={settings.retentionDays}
                    onChange={(value) => updateSetting('retentionDays', value)}
                  />

                  <SelectField
                    icon={FileText}
                    label="Default export format"
                    value={settings.exportFormat}
                    onChange={(value) => updateSetting('exportFormat', value)}
                    options={[
                      { label: 'Excel XLSX', value: 'xlsx' },
                      { label: 'CSV', value: 'csv' },
                      { label: 'PDF', value: 'pdf' },
                    ]}
                  />
                </div>

                <SettingsGrid>
                  <ToggleRow
                    icon={Database}
                    title="Enable backups"
                    description="Allow scheduled backups when the backend storage module is ready."
                    checked={settings.backupEnabled}
                    onChange={(value) => updateSetting('backupEnabled', value)}
                  />

                  <ToggleRow
                    icon={UserCheck}
                    title="Anonymize deleted users"
                    description="Remove personally identifiable data from deleted accounts."
                    checked={settings.anonymizeDeletedUsers}
                    onChange={(value) =>
                      updateSetting('anonymizeDeletedUsers', value)
                    }
                  />

                  <ToggleRow
                    icon={FileText}
                    title="Allow data export"
                    description="Admins can export operational data for reporting."
                    checked={settings.allowDataExport}
                    onChange={(value) =>
                      updateSetting('allowDataExport', value)
                    }
                  />

                  <ToggleRow
                    icon={AlertTriangle}
                    title="Allow hard delete"
                    description="Permanently delete records instead of soft delete. Use carefully."
                    checked={settings.allowHardDelete}
                    onChange={(value) => updateSetting('allowHardDelete', value)}
                    danger
                  />

                  <ToggleRow
                    icon={Server}
                    title="System health checks"
                    description="Display system health and integration status indicators."
                    checked={settings.systemHealthChecks}
                    onChange={(value) =>
                      updateSetting('systemHealthChecks', value)
                    }
                  />
                </SettingsGrid>
              </div>
            ) : null}
          </SettingsPanel>

          <div className="grid gap-4 lg:grid-cols-3">
            <StatusCard
              icon={Info}
              title="Frontend Ready"
              description="This page is ready for UI testing in mock mode."
              tone="info"
            />
            <StatusCard
              icon={Database}
              title="Backend Pending"
              description="Settings persistence will be connected later."
              tone="warning"
            />
            <StatusCard
              icon={ShieldCheck}
              title="Admin Scope"
              description="This page should remain admin-only."
              tone="success"
            />
          </div>
        </main>
      </section>
    </div>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function SettingsPanel({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-5 border-b border-border bg-gradient-to-r from-brand-blue/[0.06] via-card to-brand-yellow/10 p-5 dark:from-white/[0.04] dark:via-card dark:to-brand-yellow/10 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
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

        {actions}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SettingsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        />
      </div>
    </label>
  );
}

function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  danger = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        'flex items-start gap-4 rounded-2xl border p-4 text-start transition',
        checked
          ? danger
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-brand-yellow/40 bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.03]',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
          checked
            ? danger
              ? 'bg-red-500 text-white'
              : 'bg-brand-yellow text-brand-blue'
            : 'bg-secondary text-muted-foreground',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black">{title}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={[
          'relative mt-1 h-6 w-11 shrink-0 rounded-full transition',
          checked
            ? danger
              ? 'bg-red-500'
              : 'bg-brand-blue dark:bg-brand-yellow'
            : 'bg-muted-foreground/25',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition',
            checked ? 'start-6' : 'start-1',
          ].join(' ')}
        />
      </span>
    </button>
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
  tone: 'info' | 'warning' | 'success';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'warning'
        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow'
        : 'border-brand-blue/20 bg-brand-blue/10 text-brand-blue dark:text-blue-300';

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