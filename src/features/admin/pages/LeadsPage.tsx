import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  Globe2,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'trialBooked'
  | 'converted'
  | 'lost';

type LeadPriority = 'low' | 'normal' | 'high' | 'urgent';

type LeadSource =
  | 'Website'
  | 'WhatsApp'
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Referral'
  | 'Walk-in'
  | 'Campaign';

interface Lead {
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  phone: string;
  email: string;
  source: LeadSource;
  interestedProgram: string;
  preferredBranch: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  nextFollowUp: string;
  budgetRange: string;
  notes: string;
}

const initialLeads: Lead[] = [
  {
    id: 'LED-1001',
    parentName: 'Khaled Hassan',
    childName: 'Omar Khaled',
    childAge: 9,
    phone: '+971 50 123 4567',
    email: 'khaled.parent@example.com',
    source: 'Website',
    interestedProgram: 'Football Development',
    preferredBranch: 'Dubai Main Branch',
    status: 'new',
    priority: 'urgent',
    assignedTo: 'Unassigned',
    createdAt: '2026-05-26 08:40 PM',
    lastContact: 'Not contacted yet',
    nextFollowUp: 'Today',
    budgetRange: 'Monthly subscription',
    notes:
      'Parent submitted contact form from homepage. Interested in weekend football trial.',
  },
  {
    id: 'LED-1002',
    parentName: 'Ali Mansour',
    childName: 'Mariam Ali',
    childAge: 7,
    phone: '+971 55 222 8844',
    email: 'ali.mansour@example.com',
    source: 'Instagram',
    interestedProgram: 'Swimming Academy',
    preferredBranch: 'Abu Dhabi Branch',
    status: 'contacted',
    priority: 'high',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-26 06:10 PM',
    lastContact: '2026-05-26 07:15 PM',
    nextFollowUp: 'Tomorrow',
    budgetRange: 'Trial first',
    notes:
      'Asked about beginner swimming classes and female coach availability.',
  },
  {
    id: 'LED-1003',
    parentName: 'Ahmed Nasser',
    childName: 'Yousef Ahmed',
    childAge: 12,
    phone: '+971 52 987 1100',
    email: 'ahmed.nasser@example.com',
    source: 'WhatsApp',
    interestedProgram: 'Basketball Skills',
    preferredBranch: 'Sharjah Branch',
    status: 'qualified',
    priority: 'normal',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-26 04:30 PM',
    lastContact: '2026-05-26 05:10 PM',
    nextFollowUp: '2026-05-27',
    budgetRange: 'Quarterly package',
    notes:
      'Parent is interested in a trial and asked about available evening slots.',
  },
  {
    id: 'LED-1004',
    parentName: 'Mohamed Sami',
    childName: 'Sara Mohamed',
    childAge: 6,
    phone: '+971 58 300 9090',
    email: 'm.sami@example.com',
    source: 'Facebook',
    interestedProgram: 'Fitness & Movement',
    preferredBranch: 'Dubai Main Branch',
    status: 'trialBooked',
    priority: 'normal',
    assignedTo: 'Coach Omar',
    createdAt: '2026-05-25 03:15 PM',
    lastContact: '2026-05-25 04:45 PM',
    nextFollowUp: 'After trial',
    budgetRange: 'Monthly subscription',
    notes:
      'Trial booked. Parent wants a beginner-friendly movement program.',
  },
  {
    id: 'LED-1005',
    parentName: 'Saeed Al Nuaimi',
    childName: 'Hamdan Saeed',
    childAge: 15,
    phone: '+971 56 777 3131',
    email: 'saeed@example.com',
    source: 'Referral',
    interestedProgram: 'Football Development',
    preferredBranch: 'Al Ain Branch',
    status: 'converted',
    priority: 'high',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-24 01:30 PM',
    lastContact: '2026-05-25 11:00 AM',
    nextFollowUp: 'Subscription follow-up',
    budgetRange: 'Advanced package',
    notes:
      'Converted after referral call. Needs enrollment completion and subscription setup.',
  },
  {
    id: 'LED-1006',
    parentName: 'Noura Salem',
    childName: 'Lina Kareem',
    childAge: 8,
    phone: '+971 54 111 6677',
    email: 'noura@example.com',
    source: 'TikTok',
    interestedProgram: 'Swimming Academy',
    preferredBranch: 'Dubai Main Branch',
    status: 'lost',
    priority: 'low',
    assignedTo: 'Marketing Admin',
    createdAt: '2026-05-23 10:20 AM',
    lastContact: '2026-05-24 12:10 PM',
    nextFollowUp: 'No follow-up',
    budgetRange: 'Not confirmed',
    notes:
      'Parent asked for a time slot that is currently unavailable. Marked for future retargeting.',
  },
];

const statusOptions: Array<{ label: string; value: LeadStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Trial booked', value: 'trialBooked' },
  { label: 'Converted', value: 'converted' },
  { label: 'Lost', value: 'lost' },
];

const sourceOptions: Array<{ label: string; value: LeadSource | 'all' }> = [
  { label: 'All sources', value: 'all' },
  { label: 'Website', value: 'Website' },
  { label: 'WhatsApp', value: 'WhatsApp' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'TikTok', value: 'TikTok' },
  { label: 'Referral', value: 'Referral' },
  { label: 'Walk-in', value: 'Walk-in' },
  { label: 'Campaign', value: 'Campaign' },
];

const priorityOptions: Array<{ label: string; value: LeadPriority | 'all' }> = [
  { label: 'All priorities', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState(
    initialLeads[0]?.id ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [priorityFilter, setPriorityFilter] =
    useState<LeadPriority | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredLeads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.id.toLowerCase().includes(normalizedSearch) ||
        lead.parentName.toLowerCase().includes(normalizedSearch) ||
        lead.childName.toLowerCase().includes(normalizedSearch) ||
        lead.phone.toLowerCase().includes(normalizedSearch) ||
        lead.email.toLowerCase().includes(normalizedSearch) ||
        lead.interestedProgram.toLowerCase().includes(normalizedSearch) ||
        lead.preferredBranch.toLowerCase().includes(normalizedSearch) ||
        lead.source.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === 'all' || lead.source === sourceFilter;

      const matchesPriority =
        priorityFilter === 'all' || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesPriority;
    });
  }, [leads, priorityFilter, searchTerm, sourceFilter, statusFilter]);

  const selectedLead =
    leads.find((lead) => lead.id === selectedLeadId) ??
    filteredLeads[0] ??
    leads[0];

  const newCount = leads.filter((lead) => lead.status === 'new').length;
  const qualifiedCount = leads.filter(
    (lead) => lead.status === 'qualified',
  ).length;
  const trialBookedCount = leads.filter(
    (lead) => lead.status === 'trialBooked',
  ).length;
  const convertedCount = leads.filter(
    (lead) => lead.status === 'converted',
  ).length;
  const hotCount = leads.filter(
    (lead) => lead.priority === 'urgent' || lead.priority === 'high',
  ).length;

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
            ...lead,
            status,
            lastContact:
              status === 'contacted' ||
                status === 'qualified' ||
                status === 'trialBooked'
                ? new Date().toLocaleString()
                : lead.lastContact,
          }
          : lead,
      ),
    );

    setSavedMessage(`Lead ${id} updated to "${status}".`);
  };

  const assignLead = (id: string, assignedTo: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
            ...lead,
            assignedTo,
          }
          : lead,
      ),
    );

    setSavedMessage(`Lead ${id} assigned to ${assignedTo}.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSourceFilter('all');
    setPriorityFilter('all');
    setSavedMessage('');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Target className="h-4 w-4" />
              Marketing Pipeline
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Leads
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Track marketing and enrollment leads from the website, social
              channels, WhatsApp, campaigns, referrals, and walk-ins. Qualify
              leads, assign follow-ups, book trials, and convert interested
              families into active academy customers.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5 lg:grid-cols-1">
            <HeroMetric icon={Sparkles} label="New Leads" value={`${newCount}`} />
            <HeroMetric
              icon={UserCheck}
              label="Qualified"
              value={`${qualifiedCount}`}
            />
            <HeroMetric
              icon={CalendarDays}
              label="Trials"
              value={`${trialBookedCount}`}
            />
            <HeroMetric
              icon={CheckCircle2}
              label="Converted"
              value={`${convertedCount}`}
            />
            <HeroMetric icon={AlertTriangle} label="Hot Leads" value={`${hotCount}`} />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <StatusCard
          icon={Target}
          title={`${leads.length} Total`}
          description="Total leads currently available in frontend mock mode."
          tone="info"
        />
        <StatusCard
          icon={AlertTriangle}
          title={`${hotCount} Hot`}
          description="High-priority leads needing fast follow-up."
          tone="warning"
        />
        <StatusCard
          icon={CalendarDays}
          title={`${trialBookedCount} Trials`}
          description="Leads already moved to trial booking stage."
          tone="info"
        />
        <StatusCard
          icon={TrendingUp}
          title={`${convertedCount} Converted`}
          description="Leads successfully converted into customers."
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <main className="space-y-6">
          <Panel
            icon={Target}
            title="Lead Pipeline"
            description="Search, filter, inspect, qualify, and convert leads before moving them to trial requests or enrollment."
            actions={
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset Filters
              </button>
            }
          >
            <div className="mb-5 grid gap-3 xl:grid-cols-[1fr_13rem_13rem_13rem]">
              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search parent, child, phone, email, program, source..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <FilterSelect
                icon={Filter}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
                options={statusOptions}
              />

              <FilterSelect
                icon={Megaphone}
                value={sourceFilter}
                onChange={(value) => setSourceFilter(value as LeadSource | 'all')}
                options={sourceOptions}
              />

              <FilterSelect
                icon={AlertTriangle}
                value={priorityFilter}
                onChange={(value) =>
                  setPriorityFilter(value as LeadPriority | 'all')
                }
                options={priorityOptions}
              />
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70 dark:bg-white/[0.03]">
              <div className="hidden border-b border-border bg-secondary/80 px-5 py-4 xl:grid xl:grid-cols-[1.2fr_9rem_9rem_8rem_8rem] xl:items-center xl:gap-4">
                <TableHead>Lead</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </div>

              <div className="divide-y divide-border">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      active={selectedLead?.id === lead.id}
                      onSelect={() => {
                        setSelectedLeadId(lead.id);
                        setSavedMessage('');
                      }}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                      <Search className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg font-black">No leads found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try another search term, source, priority, or status.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </main>

        <aside className="space-y-6">
          {selectedLead ? (
            <LeadDetailsPanel
              lead={selectedLead}
              onMarkContacted={() => updateLeadStatus(selectedLead.id, 'contacted')}
              onQualify={() => updateLeadStatus(selectedLead.id, 'qualified')}
              onBookTrial={() => updateLeadStatus(selectedLead.id, 'trialBooked')}
              onConvert={() => updateLeadStatus(selectedLead.id, 'converted')}
              onMarkLost={() => updateLeadStatus(selectedLead.id, 'lost')}
              onAssignAdmissions={() =>
                assignLead(selectedLead.id, 'Admissions Team')
              }
              onAssignMarketing={() =>
                assignLead(selectedLead.id, 'Marketing Admin')
              }
            />
          ) : null}

          <StatusCard
            icon={ShieldCheck}
            title="Frontend Workflow"
            description="This page is ready for UI review. Backend persistence comes later."
            tone="success"
          />
        </aside>
      </section>
    </div>
  );
}

function LeadRow({
  lead,
  active,
  onSelect,
}: {
  lead: Lead;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        'grid gap-4 p-4 transition xl:grid-cols-[1.2fr_9rem_9rem_8rem_8rem] xl:items-center xl:gap-4 xl:px-5',
        active ? 'bg-brand-yellow/10' : 'hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            lead.priority === 'urgent'
              ? 'bg-red-500/10 text-red-600 dark:text-red-300'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          ].join(' ')}
        >
          <Users className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black">{lead.parentName}</h3>
            <PriorityBadge priority={lead.priority} />
          </div>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {lead.id} • {lead.childName} • age {lead.childAge}
          </p>

          <p className="mt-2 text-xs font-bold text-muted-foreground">
            Assigned: {lead.assignedTo}
          </p>
        </div>
      </div>

      <div>
        <MobileLabel>Program</MobileLabel>
        <p className="text-sm font-black">{lead.interestedProgram}</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          {lead.preferredBranch}
        </p>
      </div>

      <div>
        <MobileLabel>Source</MobileLabel>
        <SourceBadge source={lead.source} />
        <p className="mt-2 text-xs font-bold text-muted-foreground">
          {lead.createdAt}
        </p>
      </div>

      <div>
        <MobileLabel>Status</MobileLabel>
        <StatusBadge status={lead.status} />
      </div>

      <div>
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black text-foreground transition hover:bg-brand-blue hover:text-white dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
        >
          <Eye className="h-4 w-4" />
          Inspect
        </button>
      </div>
    </article>
  );
}

function LeadDetailsPanel({
  lead,
  onMarkContacted,
  onQualify,
  onBookTrial,
  onConvert,
  onMarkLost,
  onAssignAdmissions,
  onAssignMarketing,
}: {
  lead: Lead;
  onMarkContacted: () => void;
  onQualify: () => void;
  onBookTrial: () => void;
  onConvert: () => void;
  onMarkLost: () => void;
  onAssignAdmissions: () => void;
  onAssignMarketing: () => void;
}) {
  return (
    <Panel
      icon={Eye}
      title="Lead Details"
      description="Review family details, communication source, interest level, and pipeline actions."
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background dark:bg-white/[0.03]">
          <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-5 text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge status={lead.status} />
              <PriorityBadge priority={lead.priority} />
              <SourceBadge source={lead.source} dark />
            </div>

            <h3 className="text-2xl font-black">{lead.parentName}</h3>
            <p className="mt-2 text-sm font-semibold text-white/70">
              Interested in {lead.interestedProgram} for {lead.childName}
            </p>
          </div>

          <div className="space-y-3 p-5">
            <DetailItem
              icon={Users}
              label="Child"
              value={`${lead.childName} — age ${lead.childAge}`}
            />
            <DetailItem icon={Phone} label="Phone" value={lead.phone} />
            <DetailItem icon={Mail} label="Email" value={lead.email} />
            <DetailItem
              icon={Trophy}
              label="Program"
              value={lead.interestedProgram}
            />
            <DetailItem
              icon={MapPin}
              label="Preferred branch"
              value={lead.preferredBranch}
            />
            <DetailItem
              icon={Globe2}
              label="Source"
              value={lead.source}
            />
            <DetailItem
              icon={Clock3}
              label="Created / last contact"
              value={`${lead.createdAt} / ${lead.lastContact}`}
            />
            <DetailItem
              icon={CalendarDays}
              label="Next follow-up"
              value={lead.nextFollowUp}
            />
            <DetailItem
              icon={FileText}
              label="Budget range"
              value={lead.budgetRange}
            />

            <div className="rounded-2xl border border-border bg-card p-4 dark:bg-white/[0.04]">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <p className="text-sm font-semibold leading-7 text-muted-foreground">
                {lead.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onMarkContacted}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
          >
            <MessageCircle className="h-4 w-4" />
            Mark as Contacted
          </button>

          <button
            type="button"
            onClick={onQualify}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <UserCheck className="h-4 w-4" />
            Mark as Qualified
          </button>

          <button
            type="button"
            onClick={onBookTrial}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <CalendarDays className="h-4 w-4" />
            Book Trial Stage
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAssignAdmissions}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              <Send className="h-4 w-4" />
              Assign Admissions
            </button>

            <button
              type="button"
              onClick={onAssignMarketing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              <Megaphone className="h-4 w-4" />
              Assign Marketing
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onConvert}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Convert
            </button>

            <button
              type="button"
              onClick={onMarkLost}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-300"
            >
              <XCircle className="h-4 w-4" />
              Mark Lost
            </button>
          </div>
        </div>
      </div>
    </Panel>
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

function FilterSelect<T extends string>({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  value: T | 'all';
  onChange: (value: T | 'all') => void;
  options: Array<{ label: string; value: T | 'all' }>;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | 'all')}
        className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="break-words text-sm font-black">{value}</p>
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

function StatusBadge({ status }: { status: LeadStatus }) {
  const className =
    status === 'converted'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'lost'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300'
        : status === 'trialBooked'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : status === 'qualified'
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
            : status === 'contacted'
              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
              : 'bg-orange-500/15 text-orange-700 dark:text-orange-300';

  const label =
    status === 'trialBooked'
      ? 'Trial Booked'
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black ${className}`}
    >
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: LeadPriority }) {
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

function SourceBadge({
  source,
  dark = false,
}: {
  source: LeadSource;
  dark?: boolean;
}) {
  const className = dark
    ? 'bg-white/10 text-white'
    : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow';

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${className}`}>
      {source}
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