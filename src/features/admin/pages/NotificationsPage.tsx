import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  Inbox,
  Mail,
  Megaphone,
  MessageCircle,
  RefreshCcw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  loadAdminNotificationInbox,
  markContactNotificationAsRead,
  type AdminContactMessageDto,
  type ContactMessagePriority,
  type ContactMessageStatus,
} from '@/features/admin/notifications/services/admin-notifications.service';
import { cn } from '@/lib/utils';

type NotificationTab = 'inbox' | 'compose' | 'templates' | 'history' | 'rules';

type AudienceKey =
  | 'all'
  | 'parents'
  | 'coaches'
  | 'admins'
  | 'activeStudents'
  | 'trialLeads'
  | 'overdueInvoices';

type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'inApp';

type CampaignPriority = 'low' | 'normal' | 'high' | 'urgent';

type CampaignStatus = 'sent' | 'scheduled' | 'draft' | 'failed';

type ContactStatusFilter = ContactMessageStatus | 'ALL';

type ContactPriorityFilter = ContactMessagePriority | 'ALL';

interface NotificationDraft {
  title: string;
  message: string;
  audience: AudienceKey;
  priority: CampaignPriority;
  scheduledAt: string;
  sendMode: 'now' | 'schedule';
  channels: Record<NotificationChannel, boolean>;
}

interface AudienceOption {
  key: AudienceKey;
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
  sensitive?: boolean;
}

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  audience: AudienceKey;
  priority: CampaignPriority;
  message: string;
  icon: LucideIcon;
}

interface NotificationHistoryItem {
  id: string;
  title: string;
  audience: AudienceKey;
  channels: NotificationChannel[];
  status: CampaignStatus;
  priority: CampaignPriority;
  sentBy: string;
  createdAt: string;
  delivered: number;
  failed: number;
  opened: number;
}

interface InboxSummary {
  total: number;
  new: number;
  replied: number;
  urgent: number;
}

const defaultInboxSummary: InboxSummary = {
  total: 0,
  new: 0,
  replied: 0,
  urgent: 0,
};

const audienceOptions: AudienceOption[] = [
  {
    key: 'all',
    title: 'All Users',
    description: 'Send to parents, coaches, and admin users.',
    count: 1458,
    icon: Users,
    sensitive: true,
  },
  {
    key: 'parents',
    title: 'Parents',
    description: 'Notify parent accounts about payments, sessions, and updates.',
    count: 820,
    icon: Users,
  },
  {
    key: 'coaches',
    title: 'Coaches',
    description: 'Send operational updates to coaching staff.',
    count: 36,
    icon: UserCheck,
  },
  {
    key: 'admins',
    title: 'Admins',
    description: 'Notify internal administrators only.',
    count: 8,
    icon: ShieldCheck,
    sensitive: true,
  },
  {
    key: 'activeStudents',
    title: 'Active Students',
    description: 'Reach families of currently active enrolled players.',
    count: 1200,
    icon: Sparkles,
  },
  {
    key: 'trialLeads',
    title: 'Trial Leads',
    description: 'Follow up with leads who requested a trial session.',
    count: 64,
    icon: Megaphone,
  },
  {
    key: 'overdueInvoices',
    title: 'Overdue Invoices',
    description: 'Send reminders to families with overdue payments.',
    count: 27,
    icon: AlertTriangle,
    sensitive: true,
  },
];

const notificationTemplates: TemplateItem[] = [
  {
    id: 'tpl-001',
    title: 'Training Schedule Update',
    description: 'Notify parents and coaches about a timetable change.',
    audience: 'parents',
    priority: 'normal',
    icon: CalendarDays,
    message:
      'Dear parent, please note that your child’s training schedule has been updated. Kindly check your portal for the latest session timing.',
  },
  {
    id: 'tpl-002',
    title: 'Payment Reminder',
    description: 'Send a polite reminder for pending invoices.',
    audience: 'overdueInvoices',
    priority: 'high',
    icon: FileText,
    message:
      'Dear parent, this is a friendly reminder that you have a pending academy invoice. Please review your account and complete the payment at your convenience.',
  },
  {
    id: 'tpl-003',
    title: 'Trial Session Confirmation',
    description: 'Confirm a trial booking request.',
    audience: 'trialLeads',
    priority: 'normal',
    icon: CheckCircle2,
    message:
      'Your trial session request has been received successfully. Our team will contact you shortly to confirm the final schedule and branch details.',
  },
  {
    id: 'tpl-004',
    title: 'Coach Operational Notice',
    description: 'Send an internal note to coaches.',
    audience: 'coaches',
    priority: 'high',
    icon: UserCheck,
    message:
      'Dear coach, please review your updated schedule and attendance responsibilities for the upcoming sessions.',
  },
  {
    id: 'tpl-005',
    title: 'System Maintenance Notice',
    description: 'Notify users about planned system maintenance.',
    audience: 'all',
    priority: 'urgent',
    icon: Settings,
    message:
      'Please note that the academy system may be temporarily unavailable during scheduled maintenance. We appreciate your understanding.',
  },
];

const initialHistory: NotificationHistoryItem[] = [
  {
    id: 'NTF-1001',
    title: 'May Payment Reminder',
    audience: 'overdueInvoices',
    channels: ['email', 'whatsapp', 'inApp'],
    status: 'sent',
    priority: 'high',
    sentBy: 'Admin User',
    createdAt: '2026-05-26 19:20',
    delivered: 25,
    failed: 2,
    opened: 18,
  },
  {
    id: 'NTF-1002',
    title: 'Dubai Branch Schedule Update',
    audience: 'parents',
    channels: ['email', 'inApp'],
    status: 'sent',
    priority: 'normal',
    sentBy: 'Admin User',
    createdAt: '2026-05-26 16:45',
    delivered: 312,
    failed: 4,
    opened: 221,
  },
  {
    id: 'NTF-1003',
    title: 'Coach Attendance Reminder',
    audience: 'coaches',
    channels: ['whatsapp', 'inApp'],
    status: 'sent',
    priority: 'high',
    sentBy: 'Operations Admin',
    createdAt: '2026-05-26 13:10',
    delivered: 34,
    failed: 1,
    opened: 29,
  },
  {
    id: 'NTF-1004',
    title: 'System Maintenance',
    audience: 'all',
    channels: ['email', 'inApp'],
    status: 'scheduled',
    priority: 'urgent',
    sentBy: 'System Admin',
    createdAt: '2026-05-27 02:00',
    delivered: 0,
    failed: 0,
    opened: 0,
  },
  {
    id: 'NTF-1005',
    title: 'Trial Follow-up Campaign',
    audience: 'trialLeads',
    channels: ['whatsapp'],
    status: 'draft',
    priority: 'normal',
    sentBy: 'Marketing Admin',
    createdAt: '2026-05-25 17:30',
    delivered: 0,
    failed: 0,
    opened: 0,
  },
];

const defaultDraft: NotificationDraft = {
  title: '',
  message: '',
  audience: 'parents',
  priority: 'normal',
  scheduledAt: '',
  sendMode: 'now',
  channels: {
    email: true,
    whatsapp: true,
    sms: false,
    inApp: true,
  },
};

const tabs: Array<{
  key: NotificationTab;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
    {
      key: 'inbox',
      title: 'Inbox',
      description: 'Real contact messages.',
      icon: Inbox,
    },
    {
      key: 'compose',
      title: 'Compose',
      description: 'Create and preview a notification.',
      icon: Send,
    },
    {
      key: 'templates',
      title: 'Templates',
      description: 'Reusable message templates.',
      icon: FileText,
    },
    {
      key: 'history',
      title: 'History',
      description: 'Review sent and scheduled messages.',
      icon: Clock3,
    },
    {
      key: 'rules',
      title: 'Automation Rules',
      description: 'Future-ready notification triggers.',
      icon: Settings,
    },
  ];

const contactStatusTabs: Array<{
  value: ContactStatusFilter;
  label: string;
  description: string;
}> = [
    {
      value: 'ALL',
      label: 'All',
      description: 'All contact notifications',
    },
    {
      value: 'NEW',
      label: 'New',
      description: 'Unread direct messages',
    },
    {
      value: 'READ',
      label: 'Read',
      description: 'Reviewed messages',
    },
    {
      value: 'REPLIED',
      label: 'Replied',
      description: 'Messages with replies',
    },
    {
      value: 'CLOSED',
      label: 'Closed',
      description: 'Resolved conversations',
    },
  ];

const contactPriorityOptions: Array<{
  value: ContactPriorityFilter;
  label: string;
}> = [
    { value: 'ALL', label: 'All priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('inbox');
  const [draft, setDraft] = useState<NotificationDraft>(defaultDraft);
  const [history, setHistory] =
    useState<NotificationHistoryItem[]>(initialHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>(
    'all',
  );
  const [savedMessage, setSavedMessage] = useState('');
  const [inboxSummary, setInboxSummary] =
    useState<InboxSummary>(defaultInboxSummary);

  const selectedAudience =
    audienceOptions.find((audience) => audience.key === draft.audience) ??
    audienceOptions[1];

  const selectedChannels = Object.entries(draft.channels)
    .filter(([, enabled]) => enabled)
    .map(([channel]) => channel as NotificationChannel);

  const filteredHistory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.sentBy.toLowerCase().includes(normalizedSearch) ||
        item.id.toLowerCase().includes(normalizedSearch) ||
        item.audience.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [history, searchTerm, statusFilter]);

  const sentCount = history.filter((item) => item.status === 'sent').length;
  const scheduledCount = history.filter(
    (item) => item.status === 'scheduled',
  ).length;


  const updateDraft = (partial: Partial<NotificationDraft>) => {
    setDraft((current) => ({
      ...current,
      ...partial,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const toggleChannel = (channel: NotificationChannel) => {
    setDraft((current) => ({
      ...current,
      channels: {
        ...current.channels,
        [channel]: !current.channels[channel],
      },
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const applyTemplate = (template: TemplateItem) => {
    setDraft((current) => ({
      ...current,
      title: template.title,
      message: template.message,
      audience: template.audience,
      priority: template.priority,
    }));

    setActiveTab('compose');
    setSavedMessage(`Template "${template.title}" applied to composer.`);
  };

  const saveDraft = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      setSavedMessage('Please add a title and message before saving.');
      return;
    }

    const nextItem: NotificationHistoryItem = {
      id: `NTF-${Math.floor(2000 + Math.random() * 7000)}`,
      title: draft.title,
      audience: draft.audience,
      channels: selectedChannels,
      status: 'draft',
      priority: draft.priority,
      sentBy: 'Admin User',
      createdAt: new Date().toLocaleString(),
      delivered: 0,
      failed: 0,
      opened: 0,
    };

    setHistory((current) => [nextItem, ...current]);
    setSavedMessage('Notification draft saved locally.');
  };

  const sendNotification = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      setSavedMessage('Please add a title and message before sending.');
      return;
    }

    if (selectedChannels.length === 0) {
      setSavedMessage('Please select at least one delivery channel.');
      return;
    }

    const isScheduled = draft.sendMode === 'schedule';

    const nextItem: NotificationHistoryItem = {
      id: `NTF-${Math.floor(2000 + Math.random() * 7000)}`,
      title: draft.title,
      audience: draft.audience,
      channels: selectedChannels,
      status: isScheduled ? 'scheduled' : 'sent',
      priority: draft.priority,
      sentBy: 'Admin User',
      createdAt:
        isScheduled && draft.scheduledAt
          ? draft.scheduledAt
          : new Date().toLocaleString(),
      delivered: isScheduled ? 0 : Math.max(selectedAudience.count - 3, 0),
      failed: isScheduled ? 0 : Math.min(3, selectedAudience.count),
      opened: isScheduled ? 0 : Math.floor(selectedAudience.count * 0.62),
    };

    setHistory((current) => [nextItem, ...current]);
    setDraft(defaultDraft);
    setSavedMessage(
      isScheduled
        ? 'Notification scheduled locally. Backend scheduling will be connected later.'
        : 'Notification sent locally in frontend mock mode.',
    );
  };

  const resetComposer = () => {
    setDraft(defaultDraft);
    setSavedMessage('');
  };

  const handleInboxSummaryChange = useCallback((summary: InboxSummary) => {
    setInboxSummary(summary);
  }, []);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Bell className="h-4 w-4" />
              Communication Center
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Notifications
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage academy communications in one place. The Inbox is connected
              to real messages from the public Contact page, while Compose,
              Templates, History, and Automation Rules prepare the full
              notification center.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            <HeroMetric
              icon={Inbox}
              label="Inbox"
              value={`${inboxSummary.total}`}
            />
            <HeroMetric
              icon={Bell}
              label="New Messages"
              value={`${inboxSummary.new}`}
              danger={inboxSummary.new > 0}
            />
            <HeroMetric
              icon={Send}
              label="Sent Campaigns"
              value={`${sentCount}`}
            />
            <HeroMetric
              icon={CalendarDays}
              label="Scheduled"
              value={`${scheduledCount}`}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <Bell className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'relative overflow-hidden rounded-[2rem] border p-5 text-start transition',
                isActive
                  ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.20)]'
                  : 'border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:bg-secondary hover:text-foreground',
              ].join(' ')}
            >
              {tab.key === 'inbox' && inboxSummary.new > 0 ? (
                <span className="absolute end-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(220,38,38,0.35)]">
                  {inboxSummary.new > 99 ? '99+' : inboxSummary.new}
                </span>
              ) : null}

              <div
                className={[
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl',
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
                ].join(' ')}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="text-sm font-black">{tab.title}</h2>
              <p
                className={[
                  'mt-2 text-xs font-semibold leading-6',
                  isActive ? 'text-brand-blue/75' : 'text-muted-foreground',
                ].join(' ')}
              >
                {tab.description}
              </p>
            </button>
          );
        })}
      </section>

      {activeTab === 'inbox' ? (
        <AdminNotificationsInbox
          onSummaryChange={handleInboxSummaryChange}
        />
      ) : null}

      {activeTab === 'compose' ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <main className="space-y-6">
            <Panel
              icon={Send}
              title="Compose Notification"
              description="Write the message, choose the audience, select channels, and send or schedule the notification."
              actions={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetComposer}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={saveDraft}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={sendNotification}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Send className="h-4 w-4" />
                    {draft.sendMode === 'schedule' ? 'Schedule' : 'Send Now'}
                  </button>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Bell}
                    label="Notification title"
                    value={draft.title}
                    onChange={(value) => updateDraft({ title: value })}
                    placeholder="Example: Schedule update"
                  />

                  <SelectField
                    icon={AlertTriangle}
                    label="Priority"
                    value={draft.priority}
                    onChange={(value) =>
                      updateDraft({
                        priority: value as CampaignPriority,
                      })
                    }
                    options={[
                      { label: 'Low', value: 'low' },
                      { label: 'Normal', value: 'normal' },
                      { label: 'High', value: 'high' },
                      { label: 'Urgent', value: 'urgent' },
                    ]}
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-black">Audience</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {audienceOptions.map((audience) => (
                      <AudienceCard
                        key={audience.key}
                        audience={audience}
                        active={draft.audience === audience.key}
                        onClick={() => updateDraft({ audience: audience.key })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-black">Delivery Channels</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ChannelButton
                      channel="email"
                      icon={Mail}
                      title="Email"
                      description="Formal communication"
                      checked={draft.channels.email}
                      onClick={() => toggleChannel('email')}
                    />
                    <ChannelButton
                      channel="whatsapp"
                      icon={MessageCircle}
                      title="WhatsApp"
                      description="Fast parent updates"
                      checked={draft.channels.whatsapp}
                      onClick={() => toggleChannel('whatsapp')}
                    />
                    <ChannelButton
                      channel="sms"
                      icon={Smartphone}
                      title="SMS"
                      description="Short alerts"
                      checked={draft.channels.sms}
                      onClick={() => toggleChannel('sms')}
                    />
                    <ChannelButton
                      channel="inApp"
                      icon={Bell}
                      title="In-app"
                      description="Portal notification"
                      checked={draft.channels.inApp}
                      onClick={() => toggleChannel('inApp')}
                    />
                  </div>
                </div>

                <TextareaField
                  label="Message"
                  value={draft.message}
                  onChange={(value) => updateDraft({ message: value })}
                  placeholder="Write your notification message here..."
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  <SelectField
                    icon={Clock3}
                    label="Send mode"
                    value={draft.sendMode}
                    onChange={(value) =>
                      updateDraft({
                        sendMode: value as NotificationDraft['sendMode'],
                      })
                    }
                    options={[
                      { label: 'Send immediately', value: 'now' },
                      { label: 'Schedule for later', value: 'schedule' },
                    ]}
                  />

                  <InputField
                    icon={CalendarDays}
                    label="Scheduled date and time"
                    type="datetime-local"
                    value={draft.scheduledAt}
                    onChange={(value) => updateDraft({ scheduledAt: value })}
                  />
                </div>
              </div>
            </Panel>
          </main>

          <aside className="space-y-6">
            <PreviewCard
              draft={draft}
              audience={selectedAudience}
              channels={selectedChannels}
            />

            <StatusCard
              icon={ShieldCheck}
              title="Admin Controlled"
              description="Only authorized admins should send bulk notifications."
              tone="success"
            />

            <StatusCard
              icon={AlertTriangle}
              title="Campaign Mock Mode"
              description="Campaign sending is currently frontend-only. The Inbox tab is connected to the real backend contact messages."
              tone="warning"
            />
          </aside>
        </section>
      ) : null}

      {activeTab === 'templates' ? (
        <Panel
          icon={FileText}
          title="Notification Templates"
          description="Use ready-made templates for common academy communication scenarios."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {notificationTemplates.map((template) => {
              const Icon = template.icon;

              return (
                <article
                  key={template.id}
                  className="rounded-[2rem] border border-border bg-background/70 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-secondary/70 dark:bg-white/[0.03]"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-base font-black">{template.title}</h3>
                      <p className="mt-1 text-xs font-semibold leading-6 text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <p className="rounded-2xl bg-card p-4 text-sm font-semibold leading-7 text-muted-foreground">
                    {template.message}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <CampaignPriorityBadge priority={template.priority} />
                    <button
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-xs font-black text-brand-blue transition hover:bg-white"
                    >
                      <Sparkles className="h-4 w-4" />
                      Use Template
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </Panel>
      ) : null}

      {activeTab === 'history' ? (
        <Panel
          icon={Clock3}
          title="Notification History"
          description="Review sent, scheduled, drafted, and failed notification campaigns."
        >
          <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_16rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search notifications..."
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>

            <SelectField
              icon={Filter}
              label=""
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as CampaignStatus | 'all')
              }
              options={[
                { label: 'All statuses', value: 'all' },
                { label: 'Sent', value: 'sent' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Draft', value: 'draft' },
                { label: 'Failed', value: 'failed' },
              ]}
            />
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70 dark:bg-white/[0.03]">
            <div className="hidden border-b border-border bg-secondary/80 px-5 py-4 xl:grid xl:grid-cols-[1.3fr_8rem_10rem_9rem_8rem_8rem] xl:gap-4">
              <TableHead>Notification</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Opened</TableHead>
            </div>

            <div className="divide-y divide-border">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <HistoryRow key={item.id} item={item} />
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-black">No notifications found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another search term or reset the status filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      ) : null}

      {activeTab === 'rules' ? (
        <Panel
          icon={Settings}
          title="Automation Rules"
          description="Prepare the notification automation layer for future backend triggers."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <AutomationRule
              icon={FileText}
              title="Invoice Due Reminder"
              description="Automatically notify parents before or after invoice due dates."
              enabled
            />
            <AutomationRule
              icon={CalendarDays}
              title="Session Reminder"
              description="Send reminders before upcoming training sessions."
              enabled
            />
            <AutomationRule
              icon={UserCheck}
              title="Coach Schedule Change"
              description="Alert coaches when assigned sessions change."
              enabled
            />
            <AutomationRule
              icon={AlertTriangle}
              title="Failed Payment Alert"
              description="Notify admins when payment issues require manual follow-up."
              enabled={false}
            />
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

function AdminNotificationsInbox({
  onSummaryChange,
}: {
  onSummaryChange: (summary: InboxSummary) => void;
}) {
  const [items, setItems] = useState<AdminContactMessageDto[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<AdminContactMessageDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] =
    useState<ContactPriorityFilter>('ALL');
  const [summary, setSummary] = useState<InboxSummary>(defaultInboxSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await loadAdminNotificationInbox({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
      });

      setItems(data.items);
      setSummary(data.summary);
      onSummaryChange(data.summary);

      setSelectedMessage((current) => {
        if (!current) {
          return data.items[0] ?? null;
        }

        return data.items.find((item) => item.id === current.id) ??
          data.items[0] ??
          null;
      });
    } catch {
      setItems([]);
      setSummary(defaultInboxSummary);
      onSummaryChange(defaultInboxSummary);
      setSelectedMessage(null);
      setError('Failed to load notification inbox.');
    } finally {
      setLoading(false);
    }
  }, [onSummaryChange, priorityFilter, searchTerm, statusFilter]);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const handleSelectMessage = async (message: AdminContactMessageDto) => {
    setSelectedMessage(message);

    if (message.status !== 'NEW') {
      return;
    }

    try {
      await markContactNotificationAsRead(message.id);

      setItems((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, status: 'READ' } : item,
        ),
      );

      const nextSummary = {
        ...summary,
        new: Math.max(summary.new - 1, 0),
      };

      setSummary(nextSummary);
      onSummaryChange(nextSummary);

      setSelectedMessage((current) =>
        current?.id === message.id ? { ...current, status: 'READ' } : current,
      );
    } catch {
      // Do not break inbox display if read update fails.
    }
  };

  return (
    <Panel
      icon={Inbox}
      title="Inbox"
      description="Real contact messages submitted from the public Contact page. New messages appear here automatically and are marked as read when opened."
      actions={
        <button
          type="button"
          onClick={() => void loadInbox()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      }
    >
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <InboxMetric icon={Inbox} label="Total" value={summary.total} />
        <InboxMetric
          icon={Bell}
          label="New"
          value={summary.new}
          danger={summary.new > 0}
        />
        <InboxMetric icon={CheckCircle2} label="Replied" value={summary.replied} />
        <InboxMetric
          icon={AlertTriangle}
          label="Urgent"
          value={summary.urgent}
          danger={summary.urgent > 0}
        />
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_14rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search sender, subject, message, or code..."
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
          />
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as ContactPriorityFilter)
            }
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04]"
          >
            {contactPriorityOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
            setPriorityFilter('ALL');
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {contactStatusTabs.map((tab) => {
          const active = statusFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                'rounded-[1.35rem] border p-4 text-left transition',
                active
                  ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.18)]'
                  : 'border-border bg-background hover:-translate-y-0.5 hover:bg-secondary',
              )}
            >
              <p className="text-sm font-black">{tab.label}</p>
              <p
                className={cn(
                  'mt-1 text-xs font-semibold leading-5',
                  active ? 'text-brand-blue/75' : 'text-muted-foreground',
                )}
              >
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>

      {error ? (
        <section className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[27rem_1fr]">
        <div className="rounded-[1.7rem] border border-border bg-background/70 shadow-sm dark:bg-white/[0.03]">
          <div className="border-b border-border p-5">
            <h3 className="text-lg font-black">Contact Inbox</h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Select a message to review its details.
            </p>
          </div>

          <div className="max-h-[620px] overflow-y-auto p-3">
            {loading ? (
              <InboxLoading />
            ) : items.length > 0 ? (
              <div className="space-y-2">
                {items.map((message) => (
                  <NotificationListItem
                    key={message.id}
                    message={message}
                    active={selectedMessage?.id === message.id}
                    onClick={() => void handleSelectMessage(message)}
                  />
                ))}
              </div>
            ) : (
              <EmptyInbox />
            )}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-border bg-background/70 p-5 dark:bg-white/[0.03]">
          {selectedMessage ? (
            <MessageDetails message={selectedMessage} />
          ) : (
            <EmptyDetails />
          )}
        </div>
      </section>
    </Panel>
  );
}

function NotificationListItem({
  message,
  active,
  onClick,
}: {
  message: AdminContactMessageDto;
  active: boolean;
  onClick: () => void;
}) {
  const isNew = message.status === 'NEW';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-[1.4rem] border p-4 text-left transition',
        active
          ? 'border-brand-yellow bg-brand-yellow/15 shadow-[0_12px_28px_rgba(255,212,0,0.12)]'
          : 'border-transparent hover:border-border hover:bg-secondary/70',
        isNew ? 'bg-red-50/60 dark:bg-red-500/10' : '',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
            isNew
              ? 'bg-red-600 text-white'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          )}
        >
          <Mail className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-sm font-black">{message.subject}</p>

            {isNew ? (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">
                NEW
              </span>
            ) : null}
          </div>

          <p className="mt-1 truncate text-xs font-bold text-muted-foreground">
            {getSenderName(message)}
          </p>

          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-muted-foreground">
            {message.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ContactStatusBadge status={message.status} />
            <ContactPriorityBadge priority={message.priority} />
          </div>
        </div>
      </div>
    </button>
  );
}

function MessageDetails({ message }: { message: AdminContactMessageDto }) {
  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <ContactStatusBadge status={message.status} />
            <ContactPriorityBadge priority={message.priority} />
          </div>

          <h2 className="text-2xl font-black">{message.subject}</h2>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {message.messageCode} • {formatDate(message.createdAt)}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            Preferred contact
          </p>
          <p className="mt-1 text-sm font-black">
            {message.preferredContactMethod}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoCard
          icon={UserRound}
          label="Sender"
          value={getSenderName(message)}
          helper={message.user?.email ?? 'No email'}
        />
        <InfoCard
          icon={MessageCircle}
          label="Category"
          value={message.category}
          helper="Message category"
        />
        <InfoCard
          icon={Clock3}
          label="Updated"
          value={formatDate(message.updatedAt)}
          helper="Last activity"
        />
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-border bg-card p-5">
        <p className="mb-3 text-sm font-black">Message content</p>
        <p className="whitespace-pre-line text-sm font-semibold leading-8 text-muted-foreground">
          {message.message}
        </p>
      </div>

      {message.adminReply ? (
        <div className="mt-5 rounded-[1.5rem] border border-green-300 bg-green-50 p-5 dark:border-green-500/40 dark:bg-green-500/10">
          <p className="mb-3 text-sm font-black text-green-700 dark:text-green-300">
            Admin reply
          </p>
          <p className="whitespace-pre-line text-sm font-semibold leading-8 text-green-800 dark:text-green-200">
            {message.adminReply}
          </p>
        </div>
      ) : null}

      {message.internalNote ? (
        <div className="mt-5 rounded-[1.5rem] border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
          <p className="mb-3 text-sm font-black text-amber-800 dark:text-amber-200">
            Internal note
          </p>
          <p className="whitespace-pre-line text-sm font-semibold leading-8 text-amber-900 dark:text-amber-100">
            {message.internalNote}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AudienceCard({
  audience,
  active,
  onClick,
}: {
  audience: AudienceOption;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = audience.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-2xl border p-4 text-start transition',
        active
          ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.18)]'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.03]',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
            active
              ? 'bg-brand-blue/10 text-brand-blue'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black">{audience.title}</p>
            {audience.sensitive ? (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-600 dark:text-red-300">
                Sensitive
              </span>
            ) : null}
          </div>

          <p
            className={[
              'mt-1 text-xs font-semibold leading-5',
              active ? 'text-brand-blue/75' : 'text-muted-foreground',
            ].join(' ')}
          >
            {audience.description}
          </p>

          <p
            className={[
              'mt-2 text-[11px] font-black',
              active
                ? 'text-brand-blue'
                : 'text-brand-blue dark:text-brand-yellow',
            ].join(' ')}
          >
            {audience.count.toLocaleString()} recipients
          </p>
        </div>
      </div>
    </button>
  );
}

function ChannelButton({
  icon: Icon,
  title,
  description,
  checked,
  onClick,
}: {
  channel: NotificationChannel;
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
        'rounded-2xl border p-4 text-start transition',
        checked
          ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.03]',
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

function PreviewCard({
  draft,
  audience,
  channels,
}: {
  draft: NotificationDraft;
  audience: AudienceOption;
  channels: NotificationChannel[];
}) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Eye className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-black">Live Preview</h2>
          <p className="text-xs font-bold text-muted-foreground">
            How the notification will appear
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-background p-4 dark:bg-white/[0.04]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <CampaignPriorityBadge priority={draft.priority} />
          <span className="text-xs font-black text-muted-foreground">
            {audience.count.toLocaleString()} recipients
          </span>
        </div>

        <h3 className="text-base font-black">
          {draft.title || 'Notification title preview'}
        </h3>

        <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
          {draft.message ||
            'Your message preview will appear here as you write it in the composer.'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {channels.length > 0 ? (
            channels.map((channel) => (
              <span
                key={channel}
                className="rounded-full bg-brand-yellow/20 px-3 py-1 text-[11px] font-black capitalize text-brand-blue dark:text-brand-yellow"
              >
                {channel}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-black text-red-600 dark:text-red-300">
              No channels selected
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

function HistoryRow({ item }: { item: NotificationHistoryItem }) {
  const audience = audienceOptions.find(
    (option) => option.key === item.audience,
  );

  return (
    <article className="grid gap-4 p-4 transition hover:bg-secondary/60 xl:grid-cols-[1.3fr_8rem_10rem_9rem_8rem_8rem] xl:items-center xl:gap-4 xl:px-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
          {item.id}
        </p>
        <h3 className="mt-1 text-sm font-black">{item.title}</h3>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {item.createdAt} • by {item.sentBy}
        </p>
      </div>

      <div>
        <MobileLabel>Audience</MobileLabel>
        <p className="text-sm font-black">{audience?.title ?? item.audience}</p>
      </div>

      <div>
        <MobileLabel>Channels</MobileLabel>
        <div className="flex flex-wrap gap-1.5">
          {item.channels.map((channel) => (
            <span
              key={channel}
              className="rounded-full bg-brand-yellow/15 px-2.5 py-1 text-[10px] font-black capitalize text-brand-blue dark:text-brand-yellow"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>

      <div>
        <MobileLabel>Status</MobileLabel>
        <CampaignStatusBadge status={item.status} />
      </div>

      <div>
        <MobileLabel>Delivered</MobileLabel>
        <p className="text-sm font-black">{item.delivered}</p>
        <p className="text-xs font-bold text-muted-foreground">
          Failed: {item.failed}
        </p>
      </div>

      <div>
        <MobileLabel>Opened</MobileLabel>
        <p className="text-sm font-black">{item.opened}</p>
      </div>
    </article>
  );
}

function AutomationRule({
  icon: Icon,
  title,
  description,
  enabled,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-background/70 p-5 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <Icon className="h-6 w-6" />
        </div>

        <CampaignStatusBadge status={enabled ? 'sent' : 'draft'} />
      </div>

      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
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
      {label ? <span className="mb-2 block">{label}</span> : null}

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

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={7}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-7 outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
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
  tone: 'info' | 'warning' | 'success' | 'danger';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'danger'
        ? 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300'
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

function HeroMetric({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div
        className={cn(
          'mb-3 flex h-10 w-10 items-center justify-center rounded-2xl',
          danger ? 'bg-red-500 text-white' : 'bg-brand-yellow text-brand-blue',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function InboxMetric({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-[1.5rem] border p-4',
        danger
          ? 'border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10'
          : 'border-border bg-background dark:bg-white/[0.03]',
      )}
    >
      <div
        className={cn(
          'mb-3 flex h-10 w-10 items-center justify-center rounded-xl',
          danger
            ? 'bg-red-600 text-white'
            : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-border bg-card p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black">{value}</p>
      <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
        {helper}
      </p>
    </div>
  );
}

function CampaignPriorityBadge({ priority }: { priority: CampaignPriority }) {
  const className =
    priority === 'urgent'
      ? 'bg-red-500 text-white'
      : priority === 'high'
        ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
        : priority === 'normal'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : 'bg-green-500/10 text-green-700 dark:text-green-300';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}
    >
      {priority}
    </span>
  );
}

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const className =
    status === 'sent'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'scheduled'
        ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
        : status === 'failed'
          ? 'bg-red-500/10 text-red-700 dark:text-red-300'
          : 'bg-slate-500/10 text-slate-700 dark:text-slate-300';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}
    >
      {status}
    </span>
  );
}

function ContactStatusBadge({ status }: { status: ContactMessageStatus }) {
  const styles: Record<ContactMessageStatus, string> = {
    NEW: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    READ: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    REPLIED:
      'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    CLOSED:
      'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/70',
  };

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[10px] font-black',
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

function ContactPriorityBadge({
  priority,
}: {
  priority: ContactMessagePriority;
}) {
  const styles: Record<ContactMessagePriority, string> = {
    LOW: 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/70',
    NORMAL:
      'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
    HIGH: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    URGENT: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  };

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[10px] font-black',
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </div>
  );
}

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground xl:hidden">
      {children}
    </p>
  );
}

function InboxLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 animate-pulse rounded-[1.4rem] bg-muted"
        />
      ))}
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <Inbox className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-black">No inbox notifications</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-muted-foreground">
        There are no contact messages yet. New direct messages from the public
        Contact page will appear here.
      </p>
    </div>
  );
}

function EmptyDetails() {
  return (
    <div className="flex min-h-[420px] items-center justify-center text-center">
      <div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <Eye className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-black">Select a notification</h3>
        <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-muted-foreground">
          Choose a message from the Inbox section to view its details.
        </p>
      </div>
    </div>
  );
}

function getSenderName(message: AdminContactMessageDto) {
  const firstName = message.user?.firstName ?? '';
  const lastName = message.user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || message.user?.email || 'Unknown user';
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}