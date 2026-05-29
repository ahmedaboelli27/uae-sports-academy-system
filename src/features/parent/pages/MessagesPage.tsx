import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  Filter,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  PenLine,
  RefreshCw,
  Reply,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type MessageFolder = 'inbox' | 'sent' | 'important' | 'archived';
type MessageStatus = 'unread' | 'read' | 'replied';
type MessageCategory =
  | 'coach'
  | 'admin'
  | 'finance'
  | 'attendance'
  | 'subscription'
  | 'progress'
  | 'general';
type MessagePriority = 'high' | 'medium' | 'low';
type MessageDirection = 'inbox' | 'sent';

interface ParentMessage {
  id: string;
  subject: string;
  body: string;
  sender: string;
  recipient: string;
  childId: string;
  childName: string;
  program: string;
  category: MessageCategory;
  priority: MessagePriority;
  status: MessageStatus;
  direction: MessageDirection;
  archived: boolean;
  important: boolean;
  date: string;
  time: string;
  relatedAction: string;
}

const chartColors = {
  blue: '#00129B',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  purple: '#7C3AED',
  slate: '#64748B',
};

const messagesData: ParentMessage[] = [
  {
    id: 'msg-001',
    subject: 'Omar showed strong improvement in passing drills',
    body:
      'Omar performed very well during the last football session. His passing accuracy improved, and he showed better positioning during team play. Please encourage him to keep practicing short passes at home.',
    sender: 'Coach Omar',
    recipient: 'Parent Account',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    category: 'coach',
    priority: 'medium',
    status: 'unread',
    direction: 'inbox',
    archived: false,
    important: true,
    date: '2026-06-02',
    time: '6:45 PM',
    relatedAction: 'View progress report',
  },
  {
    id: 'msg-002',
    subject: 'Swimming subscription renewal reminder',
    body:
      'Mariam’s swimming subscription is close to expiry. Please review the pending invoice and renew before the current package ends to avoid session interruption.',
    sender: 'Finance Team',
    recipient: 'Parent Account',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    category: 'finance',
    priority: 'high',
    status: 'unread',
    direction: 'inbox',
    archived: false,
    important: true,
    date: '2026-06-01',
    time: '10:20 AM',
    relatedAction: 'Pay pending invoice',
  },
  {
    id: 'msg-003',
    subject: 'Attendance follow-up for Basketball Skills',
    body:
      'Yousef has a lower attendance rate compared with the recommended level for the current basketball program. Please review his attendance report and contact the academy if you need schedule support.',
    sender: 'Academy Admin',
    recipient: 'Parent Account',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    category: 'attendance',
    priority: 'high',
    status: 'read',
    direction: 'inbox',
    archived: false,
    important: true,
    date: '2026-05-29',
    time: '2:10 PM',
    relatedAction: 'Review attendance',
  },
  {
    id: 'msg-004',
    subject: 'Make-up session request received',
    body:
      'Your make-up session request has been received. The academy team will review coach availability and confirm the proposed replacement session shortly.',
    sender: 'Academy Support',
    recipient: 'Parent Account',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    category: 'admin',
    priority: 'low',
    status: 'replied',
    direction: 'inbox',
    archived: false,
    important: false,
    date: '2026-05-25',
    time: '4:05 PM',
    relatedAction: 'Track request',
  },
  {
    id: 'msg-005',
    subject: 'Question about Mariam’s swimming progress',
    body:
      'Hello Coach Sara, could you please share whether Mariam needs extra home practice for breathing rhythm and floating confidence?',
    sender: 'Parent Account',
    recipient: 'Coach Sara',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    category: 'progress',
    priority: 'medium',
    status: 'read',
    direction: 'sent',
    archived: false,
    important: false,
    date: '2026-05-23',
    time: '8:30 PM',
    relatedAction: 'Open progress report',
  },
  {
    id: 'msg-006',
    subject: 'Old payment confirmation message',
    body:
      'Your previous cash payment confirmation was received and archived for reference.',
    sender: 'Finance Team',
    recipient: 'Parent Account',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    category: 'subscription',
    priority: 'low',
    status: 'read',
    direction: 'inbox',
    archived: true,
    important: false,
    date: '2026-04-15',
    time: '1:15 PM',
    relatedAction: 'View payments',
  },
];

const messageTrend = [
  { month: 'Jan', inbox: 3, sent: 1 },
  { month: 'Feb', inbox: 4, sent: 2 },
  { month: 'Mar', inbox: 5, sent: 2 },
  { month: 'Apr', inbox: 4, sent: 1 },
  { month: 'May', inbox: 7, sent: 3 },
  { month: 'Jun', inbox: 5, sent: 2 },
];

function getCategoryLabel(category: MessageCategory) {
  const labels: Record<MessageCategory, string> = {
    coach: 'Coach',
    admin: 'Admin',
    finance: 'Finance',
    attendance: 'Attendance',
    subscription: 'Subscription',
    progress: 'Progress',
    general: 'General',
  };

  return labels[category];
}

function getPriorityLabel(priority: MessagePriority) {
  const labels: Record<MessagePriority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return labels[priority];
}

function getStatusLabel(status: MessageStatus) {
  const labels: Record<MessageStatus, string> = {
    unread: 'Unread',
    read: 'Read',
    replied: 'Replied',
  };

  return labels[status];
}

export default function MessagesPage() {
  const [folder, setFolder] = useState<MessageFolder>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<MessageCategory | 'all'>(
    'all',
  );
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');
  const [selectedMessageId, setSelectedMessageId] = useState(
    messagesData[0]?.id ?? '',
  );

  const [composeTo, setComposeTo] = useState('Academy Support');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const children = useMemo(() => {
    return Array.from(new Set(messagesData.map((message) => message.childName)));
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return messagesData.filter((message) => {
      const matchesFolder =
        folder === 'inbox'
          ? message.direction === 'inbox' && !message.archived
          : folder === 'sent'
            ? message.direction === 'sent' && !message.archived
            : folder === 'important'
              ? message.important && !message.archived
              : message.archived;

      const matchesSearch =
        !normalizedSearch ||
        message.subject.toLowerCase().includes(normalizedSearch) ||
        message.body.toLowerCase().includes(normalizedSearch) ||
        message.sender.toLowerCase().includes(normalizedSearch) ||
        message.recipient.toLowerCase().includes(normalizedSearch) ||
        message.childName.toLowerCase().includes(normalizedSearch) ||
        message.program.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || message.childName === childFilter;

      const matchesCategory =
        categoryFilter === 'all' || message.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' || message.status === statusFilter;

      return (
        matchesFolder &&
        matchesSearch &&
        matchesChild &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [categoryFilter, childFilter, folder, searchTerm, statusFilter]);

  const selectedMessage =
    messagesData.find((message) => message.id === selectedMessageId) ??
    filteredMessages[0] ??
    messagesData[0];

  const summary = useMemo(() => {
    const inboxMessages = messagesData.filter(
      (message) => message.direction === 'inbox' && !message.archived,
    );

    const unreadCount = inboxMessages.filter(
      (message) => message.status === 'unread',
    ).length;

    const importantCount = messagesData.filter(
      (message) => message.important && !message.archived,
    ).length;

    const sentCount = messagesData.filter(
      (message) => message.direction === 'sent' && !message.archived,
    ).length;

    const highPriorityCount = messagesData.filter(
      (message) => message.priority === 'high' && !message.archived,
    ).length;

    return {
      inboxCount: inboxMessages.length,
      unreadCount,
      importantCount,
      sentCount,
      highPriorityCount,
    };
  }, []);

  const categoryBreakdown = useMemo(() => {
    const categories: MessageCategory[] = [
      'coach',
      'admin',
      'finance',
      'attendance',
      'subscription',
      'progress',
      'general',
    ];

    return categories
      .map((category) => ({
        name: getCategoryLabel(category),
        value: messagesData.filter(
          (message) => message.category === category && !message.archived,
        ).length,
        color:
          category === 'coach'
            ? chartColors.blue
            : category === 'finance'
              ? chartColors.green
              : category === 'attendance'
                ? chartColors.orange
                : category === 'subscription'
                  ? chartColors.purple
                  : category === 'progress'
                    ? chartColors.yellow
                    : chartColors.slate,
      }))
      .filter((item) => item.value > 0);
  }, []);

  const childMessageData = useMemo(() => {
    return children.map((childName) => {
      const childMessages = messagesData.filter(
        (message) => message.childName === childName && !message.archived,
      );

      return {
        name: childName.split(' ')[0],
        inbox: childMessages.filter((message) => message.direction === 'inbox')
          .length,
        sent: childMessages.filter((message) => message.direction === 'sent')
          .length,
      };
    });
  }, [children]);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const clearCompose = () => {
    setComposeTo('Academy Support');
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <MessageSquare className="h-4 w-4" />
              Communication Center
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Messages
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Communicate with coaches, academy administration, finance team,
              and support. Track unread messages, important alerts, attendance
              notes, subscription reminders, and progress updates.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/children"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Users className="h-4 w-4" />
                My Children
              </Link>

              <Link
                to="/parent/subscriptions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <WalletCards className="h-4 w-4" />
                Subscriptions
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Inbox}
              label="Inbox"
              value={`${summary.inboxCount}`}
              caption="Active received messages"
              positive
            />

            <HeroMetricCard
              icon={Bell}
              label="Unread"
              value={`${summary.unreadCount}`}
              caption="Messages waiting for review"
              positive={summary.unreadCount === 0}
            />

            <HeroMetricCard
              icon={Star}
              label="Important"
              value={`${summary.importantCount}`}
              caption="Marked as priority"
              positive={summary.importantCount === 0}
            />

            <HeroMetricCard
              icon={Send}
              label="Sent"
              value={`${summary.sentCount}`}
              caption="Messages sent by parent"
              positive
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Mail}
          title="Total Messages"
          value={`${messagesData.length}`}
          description="All inbox, sent, important, and archived messages."
          tone="blue"
        />

        <KpiCard
          icon={Bell}
          title="Unread"
          value={`${summary.unreadCount}`}
          description="Messages that still need parent review."
          tone={summary.unreadCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={AlertTriangle}
          title="High Priority"
          value={`${summary.highPriorityCount}`}
          description="Finance, attendance, or urgent operational messages."
          tone={summary.highPriorityCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={Reply}
          title="Sent"
          value={`${summary.sentCount}`}
          description="Messages sent from the parent account."
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Message Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter messages by folder, child, category, status,
                  sender, recipient, or content.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FolderButton
                icon={Inbox}
                label="Inbox"
                value="inbox"
                active={folder === 'inbox'}
                onClick={setFolder}
              />

              <FolderButton
                icon={Send}
                label="Sent"
                value="sent"
                active={folder === 'sent'}
                onClick={setFolder}
              />

              <FolderButton
                icon={Star}
                label="Important"
                value="important"
                active={folder === 'important'}
                onClick={setFolder}
              />

              <FolderButton
                icon={Archive}
                label="Archived"
                value="archived"
                active={folder === 'archived'}
                onClick={setFolder}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search subject, sender, child, message..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Child"
                value={childFilter}
                options={[
                  { label: 'All children', value: 'all' },
                  ...children.map((child) => ({
                    label: child,
                    value: child,
                  })),
                ]}
                onChange={setChildFilter}
              />

              <FilterSelect
                label="Category"
                value={categoryFilter}
                options={[
                  { label: 'All categories', value: 'all' },
                  { label: 'Coach', value: 'coach' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Finance', value: 'finance' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Subscription', value: 'subscription' },
                  { label: 'Progress', value: 'progress' },
                  { label: 'General', value: 'general' },
                ]}
                onChange={(value) =>
                  setCategoryFilter(value as MessageCategory | 'all')
                }
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Unread', value: 'unread' },
                  { label: 'Read', value: 'read' },
                  { label: 'Replied', value: 'replied' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as MessageStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4">
            {filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                active={selectedMessage.id === message.id}
                onSelect={() => setSelectedMessageId(message.id)}
              />
            ))}

            {filteredMessages.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Message Activity"
              description="Monthly inbox and sent message movement."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageTrend}>
                    <defs>
                      <linearGradient
                        id="messageActivityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.blue}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="inbox"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#messageActivityGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="sent"
                      stroke={chartColors.yellow}
                      strokeWidth={4}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Message Categories"
              description="Distribution of messages by communication type."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {categoryBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {categoryBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={messagesData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={Users}
            title="Messages by Child"
            description="Inbox and sent communication linked to each child."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={childMessageData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="inbox"
                    fill={chartColors.blue}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="sent"
                    fill={chartColors.yellow}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <aside className="space-y-6">
          <SelectedMessagePanel message={selectedMessage} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Compose Message</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Draft a new message to academy staff.
                </p>
              </div>

              <PenLine className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-4">
              <FilterSelect
                label="To"
                value={composeTo}
                options={[
                  { label: 'Academy Support', value: 'Academy Support' },
                  { label: 'Finance Team', value: 'Finance Team' },
                  { label: 'Coach Omar', value: 'Coach Omar' },
                  { label: 'Coach Sara', value: 'Coach Sara' },
                  { label: 'Academy Admin', value: 'Academy Admin' },
                ]}
                onChange={setComposeTo}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-black">Subject</span>
                <input
                  value={composeSubject}
                  onChange={(event) => setComposeSubject(event.target.value)}
                  placeholder="Write message subject"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black">Message</span>
                <textarea
                  value={composeBody}
                  onChange={(event) => setComposeBody(event.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
                >
                  <Send className="h-4 w-4" />
                  Send Draft
                </button>

                <button
                  type="button"
                  onClick={clearCompose}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful shortcuts related to communication.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={UserRound}
                title="Child Profile"
                description="Open child profile linked to selected message."
                href={`/parent/children/${selectedMessage.childId}`}
              />

              <QuickAction
                icon={CalendarDays}
                title="Attendance"
                description="Review attendance details."
                href={`/parent/children/${selectedMessage.childId}/attendance`}
              />

              <QuickAction
                icon={CreditCard}
                title="Invoices"
                description="Open finance and billing messages context."
                href="/parent/invoices"
              />

              <QuickAction
                icon={FileText}
                title="Documents"
                description="Review uploaded family documents."
                href="/parent/documents"
              />
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

function FolderButton({
  icon: Icon,
  label,
  value,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: MessageFolder;
  active: boolean;
  onClick: (value: MessageFolder) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        'flex items-center gap-3 rounded-2xl border p-4 text-start transition',
        active
          ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-sm'
          : 'border-border bg-background hover:border-brand-yellow hover:bg-brand-yellow/10 dark:bg-white/[0.04]',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-10 w-10 items-center justify-center rounded-2xl',
          active
            ? 'bg-brand-blue/10 text-brand-blue'
            : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </div>

      <span className="text-sm font-black">{label}</span>
    </button>
  );
}

function MessageCard({
  message,
  active,
  onSelect,
}: {
  message: ParentMessage;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={[
        'cursor-pointer rounded-[2rem] border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
        active ? 'border-brand-yellow' : 'border-border',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div
            className={[
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
              message.status === 'unread'
                ? 'bg-brand-yellow text-brand-blue'
                : 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
            ].join(' ')}
          >
            <MessageSquare className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black">{message.subject}</h3>
              {message.important ? (
                <Star className="h-4 w-4 text-brand-yellow" />
              ) : null}
            </div>

            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {message.direction === 'inbox'
                ? `From: ${message.sender}`
                : `To: ${message.recipient}`}
            </p>

            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-muted-foreground">
              {message.body}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <StatusBadge status={message.status} />
          <PriorityBadge priority={message.priority} />
          <CategoryBadge category={message.category} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniInfo icon={UserRound} label="Child" value={message.childName} />
        <MiniInfo icon={Trophy} label="Program" value={message.program} />
        <MiniInfo
          icon={CalendarDays}
          label="Date"
          value={`${message.date} · ${message.time}`}
        />
        <MiniInfo
          icon={ShieldCheck}
          label="Action"
          value={message.relatedAction}
        />
      </div>
    </article>
  );
}

function SelectedMessagePanel({ message }: { message: ParentMessage }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <MessageCircle className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Message
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {message.subject}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {message.childName} · {message.program}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge status={message.status} />
          <PriorityBadge priority={message.priority} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={Mail}
          label={message.direction === 'inbox' ? 'From' : 'To'}
          value={message.direction === 'inbox' ? message.sender : message.recipient}
        />

        <DetailLine icon={UserRound} label="Child" value={message.childName} />
        <DetailLine
          icon={CalendarDays}
          label="Date"
          value={`${message.date} · ${message.time}`}
        />
        <DetailLine
          icon={Bell}
          label="Category"
          value={getCategoryLabel(message.category)}
        />
        <DetailLine
          icon={ShieldCheck}
          label="Related Action"
          value={message.relatedAction}
        />

        <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            Message Body
          </div>

          <p className="text-sm font-semibold leading-7 text-muted-foreground">
            {message.body}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Reply className="h-4 w-4" />
            Reply
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
        </div>
      </div>
    </aside>
  );
}

function ChartCard({
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
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="absolute -end-12 -top-12 h-32 w-32 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex gap-3">
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

      <div className="relative">{children}</div>
    </section>
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

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="text-sm font-black">{value}</p>
    </div>
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

function DistributionRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />

          <span className="truncate text-sm font-black">{label}</span>
        </div>

        <span className="text-xs font-black text-muted-foreground">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      <p className="mt-1 text-xs font-bold text-muted-foreground">
        {percentage}% of messages
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  const className =
    status === 'unread'
      ? 'bg-brand-yellow text-brand-blue'
      : status === 'replied'
        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: MessagePriority }) {
  const className =
    priority === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : priority === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
}

function CategoryBadge({ category }: { category: MessageCategory }) {
  return (
    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
      {getCategoryLabel(category)}
    </span>
  );
}

function FilterSelect({
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

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <MessageSquare className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No messages found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the folder, search term, child, category, or message status.
      </p>
    </div>
  );
}