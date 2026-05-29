import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Mail,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { coachDataService } from '@/features/coach/services/coach-data.service';
import type { CoachAssignedPlayerDto } from '@/features/coach/types/coach.dto';

type MessageCategory = 'admin' | 'parent' | 'incident' | 'attendance' | 'progress';
type MessageStatus = 'unread' | 'read' | 'replied';
type MessagePriority = 'low' | 'medium' | 'high';

interface CoachMessageThread {
  id: string;
  studentId?: string;
  category: MessageCategory;
  status: MessageStatus;
  priority: MessagePriority;
  subject: string;
  senderName: string;
  senderRole: string;
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
}

function getCategoryLabel(category: MessageCategory) {
  const labels: Record<MessageCategory, string> = {
    admin: 'Admin',
    parent: 'Parent',
    incident: 'Incident',
    attendance: 'Attendance',
    progress: 'Progress',
  };

  return labels[category];
}

function getStatusLabel(status: MessageStatus) {
  const labels: Record<MessageStatus, string> = {
    unread: 'Unread',
    read: 'Read',
    replied: 'Replied',
  };

  return labels[status];
}

function getPriorityLabel(priority: MessagePriority) {
  const labels: Record<MessagePriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return labels[priority];
}

function buildInitialThreads(players: CoachAssignedPlayerDto[]): CoachMessageThread[] {
  const firstPlayer = players[0];
  const secondPlayer = players[1];
  const thirdPlayer = players[2];

  return [
    {
      id: 'msg-001',
      studentId: firstPlayer?.id,
      category: 'parent',
      status: 'unread',
      priority: 'medium',
      subject: 'Question about next training session',
      senderName: firstPlayer?.parentName ?? 'Parent',
      senderRole: 'Parent',
      lastMessage:
        'Hello coach, can you confirm the next training time and whether the student needs special equipment?',
      lastUpdated: 'Today · 09:15 AM',
      unreadCount: 2,
    },
    {
      id: 'msg-002',
      studentId: secondPlayer?.id,
      category: 'attendance',
      status: 'read',
      priority: 'high',
      subject: 'Attendance follow-up required',
      senderName: 'Academy Admin',
      senderRole: 'Admin',
      lastMessage:
        'Please review attendance consistency for this student and add a short coach note after the next session.',
      lastUpdated: 'Today · 11:40 AM',
      unreadCount: 0,
    },
    {
      id: 'msg-003',
      studentId: thirdPlayer?.id,
      category: 'progress',
      status: 'replied',
      priority: 'low',
      subject: 'Progress update shared',
      senderName: thirdPlayer?.parentName ?? 'Parent',
      senderRole: 'Parent',
      lastMessage:
        'Thank you for the progress update. We will keep supporting the training plan at home.',
      lastUpdated: 'Yesterday · 06:20 PM',
      unreadCount: 0,
    },
    {
      id: 'msg-004',
      category: 'admin',
      status: 'unread',
      priority: 'high',
      subject: 'Schedule update from administration',
      senderName: 'Academy Admin',
      senderRole: 'Admin',
      lastMessage:
        'Please check the updated weekly schedule and confirm if any assigned session timing conflicts with your availability.',
      lastUpdated: 'Yesterday · 03:10 PM',
      unreadCount: 1,
    },
    {
      id: 'msg-005',
      studentId: secondPlayer?.id,
      category: 'incident',
      status: 'read',
      priority: 'high',
      subject: 'Incident report follow-up',
      senderName: 'Safety Officer',
      senderRole: 'Admin',
      lastMessage:
        'A previous incident report requires a short follow-up note after the next observed session.',
      lastUpdated: 'Mon · 12:30 PM',
      unreadCount: 0,
    },
  ];
}

export default function CoachMessagesPage() {
  const [searchParams] = useSearchParams();
  const playerIdFromUrl = searchParams.get('playerId');

  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedPlayers = useMemo(() => coachDataService.getAssignedPlayers(), []);

  const [threads, setThreads] = useState<CoachMessageThread[]>(() =>
    buildInitialThreads(assignedPlayers),
  );

  const [selectedThreadId, setSelectedThreadId] = useState(threads[0]?.id ?? '');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState(playerIdFromUrl ?? 'all');
  const [categoryFilter, setCategoryFilter] = useState<MessageCategory | 'all'>(
    'all',
  );
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'all'>(
    'all',
  );

  const [composeStudentId, setComposeStudentId] = useState(
    playerIdFromUrl &&
      assignedPlayers.some((player) => player.id === playerIdFromUrl)
      ? playerIdFromUrl
      : assignedPlayers[0]?.id ?? '',
  );
  const [composeCategory, setComposeCategory] =
    useState<MessageCategory>('parent');
  const [composePriority, setComposePriority] =
    useState<MessagePriority>('medium');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const enrichedThreads = useMemo(() => {
    return threads.map((thread) => {
      const student = thread.studentId
        ? assignedPlayers.find((player) => player.id === thread.studentId)
        : undefined;

      return {
        ...thread,
        student,
      };
    });
  }, [assignedPlayers, threads]);

  const filteredThreads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return enrichedThreads.filter((thread) => {
      const matchesSearch =
        !normalizedSearch ||
        thread.subject.toLowerCase().includes(normalizedSearch) ||
        thread.senderName.toLowerCase().includes(normalizedSearch) ||
        thread.lastMessage.toLowerCase().includes(normalizedSearch) ||
        thread.student?.name.toLowerCase().includes(normalizedSearch) ||
        thread.student?.parentName.toLowerCase().includes(normalizedSearch);

      const matchesStudent =
        studentFilter === 'all' || thread.studentId === studentFilter;

      const matchesCategory =
        categoryFilter === 'all' || thread.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' || thread.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || thread.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStudent &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    categoryFilter,
    enrichedThreads,
    priorityFilter,
    searchTerm,
    statusFilter,
    studentFilter,
  ]);

  const selectedThread =
    enrichedThreads.find((thread) => thread.id === selectedThreadId) ??
    filteredThreads[0] ??
    enrichedThreads[0];

  const summary = useMemo(() => {
    const unread = threads.filter((thread) => thread.status === 'unread').length;
    const highPriority = threads.filter(
      (thread) => thread.priority === 'high',
    ).length;
    const parentMessages = threads.filter(
      (thread) => thread.category === 'parent',
    ).length;
    const adminMessages = threads.filter(
      (thread) => thread.category === 'admin',
    ).length;

    return {
      total: threads.length,
      unread,
      highPriority,
      parentMessages,
      adminMessages,
    };
  }, [threads]);

  const resetFilters = () => {
    setSearchTerm('');
    setStudentFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const markSelectedAsRead = () => {
    if (!selectedThread) return;

    setThreads((current) =>
      current.map((thread) =>
        thread.id === selectedThread.id
          ? {
            ...thread,
            status: 'read',
            unreadCount: 0,
          }
          : thread,
      ),
    );

    setSavedMessage('Message marked as read locally.');
  };

  const sendMessage = () => {
    if (!composeSubject.trim() || !composeBody.trim()) {
      setSavedMessage('Please add a subject and message before sending.');
      return;
    }

    const selectedStudent = assignedPlayers.find(
      (player) => player.id === composeStudentId,
    );

    const newThread: CoachMessageThread = {
      id: `msg-${Date.now()}`,
      studentId: composeCategory === 'admin' ? undefined : selectedStudent?.id,
      category: composeCategory,
      status: 'replied',
      priority: composePriority,
      subject: composeSubject.trim(),
      senderName: currentCoach.name,
      senderRole: 'Coach',
      lastMessage: composeBody.trim(),
      lastUpdated: 'Just now',
      unreadCount: 0,
    };

    setThreads((current) => [newThread, ...current]);
    setSelectedThreadId(newThread.id);
    setComposeSubject('');
    setComposeBody('');
    setSavedMessage(
      'Message saved locally. Backend messaging endpoint will be connected later.',
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
              <MessageSquare className="h-4 w-4" />
              Coach Communication Center
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Messages
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Communicate with academy administration and assigned parents,
              review important follow-ups, and keep student-related messages
              inside the coach scope only.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={sendMessage}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>

              <button
                type="button"
                onClick={markSelectedAsRead}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Selected Read
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Mail}
              label="Total Threads"
              value={`${summary.total}`}
              caption="Coach-scoped conversations"
              positive
            />

            <HeroMetricCard
              icon={Bell}
              label="Unread"
              value={`${summary.unread}`}
              caption="Messages needing review"
              positive={summary.unread === 0}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="High Priority"
              value={`${summary.highPriority}`}
              caption="Important conversations"
              positive={summary.highPriority === 0}
            />

            <HeroMetricCard
              icon={Users}
              label="Parents"
              value={`${summary.parentMessages}`}
              caption="Parent-related threads"
              positive
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
          icon={Mail}
          title="Total Messages"
          value={`${summary.total}`}
          description="All coach communication threads."
          tone="blue"
        />

        <KpiCard
          icon={Bell}
          title="Unread"
          value={`${summary.unread}`}
          description="Messages waiting for review."
          tone={summary.unread > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={AlertTriangle}
          title="High Priority"
          value={`${summary.highPriority}`}
          description="Urgent messages and follow-ups."
          tone={summary.highPriority > 0 ? 'danger' : 'success'}
        />

        <KpiCard
          icon={ShieldCheck}
          title="Admin Threads"
          value={`${summary.adminMessages}`}
          description="Administration communication."
          tone="brand"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={Send}
              title="Compose Message"
              description="Create a local coach message. Backend sending can be connected later."
            />

            <div className="grid gap-4 xl:grid-cols-3">
              <FilterSelect
                label="Recipient Type"
                value={composeCategory}
                options={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Parent', value: 'parent' },
                  { label: 'Incident Follow-up', value: 'incident' },
                  { label: 'Attendance Follow-up', value: 'attendance' },
                  { label: 'Progress Update', value: 'progress' },
                ]}
                onChange={(value) => setComposeCategory(value as MessageCategory)}
              />

              <FilterSelect
                label="Student"
                value={composeStudentId}
                options={assignedPlayers.map((player) => ({
                  label: `${player.name} · ${player.parentName}`,
                  value: player.id,
                }))}
                onChange={setComposeStudentId}
              />

              <FilterSelect
                label="Priority"
                value={composePriority}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) => setComposePriority(value as MessagePriority)}
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Subject</span>

              <input
                value={composeSubject}
                onChange={(event) => {
                  setComposeSubject(event.target.value);
                  setSavedMessage('');
                }}
                placeholder="Example: Attendance follow-up after today session"
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Message</span>

              <textarea
                value={composeBody}
                onChange={(event) => {
                  setComposeBody(event.target.value);
                  setSavedMessage('');
                }}
                placeholder="Write your message here..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={sendMessage}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeader
                icon={Filter}
                title="Message Filters"
                description="Search and filter messages by student, category, status, priority, or content."
              />

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(4,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search subject, sender, student, message..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Student"
                value={studentFilter}
                options={[
                  { label: 'All students', value: 'all' },
                  ...assignedPlayers.map((player) => ({
                    label: player.name,
                    value: player.id,
                  })),
                ]}
                onChange={setStudentFilter}
              />

              <FilterSelect
                label="Category"
                value={categoryFilter}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Parent', value: 'parent' },
                  { label: 'Incident', value: 'incident' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Progress', value: 'progress' },
                ]}
                onChange={(value) =>
                  setCategoryFilter(value as MessageCategory | 'all')
                }
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Unread', value: 'unread' },
                  { label: 'Read', value: 'read' },
                  { label: 'Replied', value: 'replied' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as MessageStatus | 'all')
                }
              />

              <FilterSelect
                label="Priority"
                value={priorityFilter}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) =>
                  setPriorityFilter(value as MessagePriority | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                active={selectedThread?.id === thread.id}
                onSelect={() => setSelectedThreadId(thread.id)}
              />
            ))}

            {filteredThreads.length === 0 ? <EmptyState /> : null}
          </section>
        </div>

        <aside className="space-y-6">
          {selectedThread ? (
            <SelectedThreadPanel
              thread={selectedThread}
              onMarkRead={markSelectedAsRead}
            />
          ) : null}

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={AlertTriangle}
              title="Needs Attention"
              description="Unread or high-priority communication."
            />

            <div className="space-y-3">
              {enrichedThreads
                .filter(
                  (thread) =>
                    thread.status === 'unread' || thread.priority === 'high',
                )
                .map((thread) => (
                  <AttentionRow
                    key={thread.id}
                    thread={thread}
                    onSelect={() => setSelectedThreadId(thread.id)}
                  />
                ))}

              {summary.unread === 0 && summary.highPriority === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No urgent communication is currently pending.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={Sparkles}
              title="Quick Actions"
              description="Open related coach workspace pages."
            />

            <div className="grid gap-3">
              <QuickAction
                icon={Users}
                title="Assigned Students"
                description="Review your assigned players."
                href="/coach/players"
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add or review progress notes."
                href="/coach/progress-notes"
              />

              <QuickAction
                icon={ShieldCheck}
                title="Incident Reports"
                description="Open safety and incident reports."
                href="/coach/incidents"
              />

              <QuickAction
                icon={MessageCircle}
                title="Attendance"
                description="Review attendance follow-up."
                href="/coach/attendance"
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

      <p className="relative mt-2 text-3xl font-black text-brand-blue dark:text-white">
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

function ThreadCard({
  thread,
  active,
  onSelect,
}: {
  thread: CoachMessageThread & { student?: CoachAssignedPlayerDto };
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
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <MessageSquare className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{thread.subject}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {thread.senderName} · {thread.senderRole}
              </p>

              {thread.student ? (
                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  Related student: {thread.student.name}
                </p>
              ) : null}
            </div>

            <PriorityBadge priority={thread.priority} />
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm font-semibold leading-6 text-muted-foreground">
        {thread.lastMessage}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={thread.category} />
        <StatusBadge status={thread.status} />

        {thread.unreadCount > 0 ? (
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            {thread.unreadCount} unread
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-xs font-bold text-muted-foreground">
        Last updated: {thread.lastUpdated}
      </p>
    </article>
  );
}

function SelectedThreadPanel({
  thread,
  onMarkRead,
}: {
  thread: CoachMessageThread & { student?: CoachAssignedPlayerDto };
  onMarkRead: () => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Mail className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Message
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {thread.subject}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {thread.senderName} · {getCategoryLabel(thread.category)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <PriorityBadge priority={thread.priority} />
          <StatusBadge status={thread.status} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Mail} label="Sender" value={thread.senderName} />
        <DetailLine icon={UserRound} label="Role" value={thread.senderRole} />
        <DetailLine
          icon={MessageSquare}
          label="Category"
          value={getCategoryLabel(thread.category)}
        />
        <DetailLine
          icon={AlertTriangle}
          label="Priority"
          value={getPriorityLabel(thread.priority)}
        />
        <DetailLine
          icon={Clock3}
          label="Last Updated"
          value={thread.lastUpdated}
        />

        {thread.student ? (
          <>
            <DetailLine
              icon={Users}
              label="Student"
              value={`${thread.student.name} · ${thread.student.group}`}
            />
            <DetailLine
              icon={UserRound}
              label="Parent"
              value={thread.student.parentName}
            />
          </>
        ) : null}

        <DetailLine icon={FileText} label="Message" value={thread.lastMessage} />

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onMarkRead}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Read
          </button>

          {thread.student ? (
            <Link
              to={`/coach/players/${thread.student.id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
            >
              <UserRound className="h-4 w-4" />
              Student
            </Link>
          ) : (
            <Link
              to="/coach/schedule"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
            >
              <Clock3 className="h-4 w-4" />
              Schedule
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({
  thread,
  onSelect,
}: {
  thread: CoachMessageThread & { student?: CoachAssignedPlayerDto };
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="block w-full rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-start text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-yellow/20 dark:text-brand-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{thread.subject}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {getPriorityLabel(thread.priority)} priority ·{' '}
            {getStatusLabel(thread.status)}
          </p>
        </div>
      </div>
    </button>
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

function CategoryBadge({ category }: { category: MessageCategory }) {
  return (
    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
      {getCategoryLabel(category)}
    </span>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  const className =
    status === 'unread'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
      : status === 'replied'
        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

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

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm lg:col-span-2">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <MessageSquare className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No messages found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, student, category, status, or priority
        filter.
      </p>
    </div>
  );
}