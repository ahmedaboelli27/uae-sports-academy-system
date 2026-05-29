import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  Users,
  WalletCards,
  XCircle,
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

type DocumentStatus = 'approved' | 'pendingReview' | 'missing' | 'expired';
type DocumentType =
  | 'medical'
  | 'consent'
  | 'identity'
  | 'enrollment'
  | 'invoice'
  | 'receipt'
  | 'program'
  | 'other';
type DocumentSource = 'parent' | 'academy';

interface DocumentItem {
  id: string;
  title: string;
  childId: string;
  childName: string;
  program: string;
  type: DocumentType;
  status: DocumentStatus;
  source: DocumentSource;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate: string;
  sizeKb: number;
  fileFormat: string;
  required: boolean;
  signed: boolean;
  reviewedBy: string;
  notes: string;
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

const documentsData: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'Medical Clearance Form',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    type: 'medical',
    status: 'approved',
    source: 'parent',
    uploadedBy: 'Parent Account',
    uploadedAt: '2026-05-01',
    expiryDate: '2027-05-01',
    sizeKb: 420,
    fileFormat: 'PDF',
    required: true,
    signed: true,
    reviewedBy: 'Academy Admin',
    notes: 'Approved medical clearance for football activities.',
  },
  {
    id: 'doc-002',
    title: 'Enrollment Agreement',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    type: 'enrollment',
    status: 'approved',
    source: 'academy',
    uploadedBy: 'Academy Admin',
    uploadedAt: '2026-04-25',
    expiryDate: '2027-04-25',
    sizeKb: 580,
    fileFormat: 'PDF',
    required: true,
    signed: true,
    reviewedBy: 'Academy Admin',
    notes: 'Signed enrollment agreement is active.',
  },
  {
    id: 'doc-003',
    title: 'Swimming Consent Form',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    type: 'consent',
    status: 'pendingReview',
    source: 'parent',
    uploadedBy: 'Parent Account',
    uploadedAt: '2026-05-28',
    expiryDate: '2027-05-28',
    sizeKb: 350,
    fileFormat: 'PDF',
    required: true,
    signed: true,
    reviewedBy: 'Pending',
    notes: 'Waiting for academy review before final approval.',
  },
  {
    id: 'doc-004',
    title: 'Emirates ID Copy',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    type: 'identity',
    status: 'missing',
    source: 'parent',
    uploadedBy: 'Not uploaded',
    uploadedAt: '—',
    expiryDate: '—',
    sizeKb: 0,
    fileFormat: '—',
    required: true,
    signed: false,
    reviewedBy: 'Pending',
    notes: 'Required identity document has not been uploaded yet.',
  },
  {
    id: 'doc-005',
    title: 'Basketball Program Rules',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    type: 'program',
    status: 'approved',
    source: 'academy',
    uploadedBy: 'Academy Admin',
    uploadedAt: '2026-05-10',
    expiryDate: '2027-05-10',
    sizeKb: 260,
    fileFormat: 'PDF',
    required: false,
    signed: false,
    reviewedBy: 'Academy Admin',
    notes: 'Academy program rules and participation guidelines.',
  },
  {
    id: 'doc-006',
    title: 'Old Medical Form',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    type: 'medical',
    status: 'expired',
    source: 'parent',
    uploadedBy: 'Parent Account',
    uploadedAt: '2025-04-20',
    expiryDate: '2026-04-20',
    sizeKb: 390,
    fileFormat: 'PDF',
    required: true,
    signed: true,
    reviewedBy: 'Academy Admin',
    notes: 'Expired medical form. Please upload an updated document.',
  },
];

const documentTrend = [
  { month: 'Jan', uploaded: 2, approved: 2 },
  { month: 'Feb', uploaded: 3, approved: 2 },
  { month: 'Mar', uploaded: 2, approved: 2 },
  { month: 'Apr', uploaded: 4, approved: 3 },
  { month: 'May', uploaded: 6, approved: 4 },
  { month: 'Jun', uploaded: 3, approved: 2 },
];

function getStatusLabel(status: DocumentStatus) {
  const labels: Record<DocumentStatus, string> = {
    approved: 'Approved',
    pendingReview: 'Pending Review',
    missing: 'Missing',
    expired: 'Expired',
  };

  return labels[status];
}

function getTypeLabel(type: DocumentType) {
  const labels: Record<DocumentType, string> = {
    medical: 'Medical',
    consent: 'Consent',
    identity: 'Identity',
    enrollment: 'Enrollment',
    invoice: 'Invoice',
    receipt: 'Receipt',
    program: 'Program',
    other: 'Other',
  };

  return labels[type];
}

function getSourceLabel(source: DocumentSource) {
  const labels: Record<DocumentSource, string> = {
    parent: 'Parent Upload',
    academy: 'Academy Document',
  };

  return labels[source];
}

function formatFileSize(sizeKb: number) {
  if (sizeKb <= 0) return '—';
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;

  return `${sizeKb} KB`;
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [selectedDocumentId, setSelectedDocumentId] = useState(
    documentsData[0]?.id ?? '',
  );

  const [uploadChild, setUploadChild] = useState('Omar Khaled');
  const [uploadType, setUploadType] = useState<DocumentType>('medical');
  const [uploadTitle, setUploadTitle] = useState('');

  const children = useMemo(() => {
    return Array.from(new Set(documentsData.map((document) => document.childName)));
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return documentsData.filter((document) => {
      const matchesSearch =
        !normalizedSearch ||
        document.title.toLowerCase().includes(normalizedSearch) ||
        document.childName.toLowerCase().includes(normalizedSearch) ||
        document.program.toLowerCase().includes(normalizedSearch) ||
        document.notes.toLowerCase().includes(normalizedSearch) ||
        document.reviewedBy.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || document.childName === childFilter;

      const matchesType = typeFilter === 'all' || document.type === typeFilter;

      const matchesStatus =
        statusFilter === 'all' || document.status === statusFilter;

      return matchesSearch && matchesChild && matchesType && matchesStatus;
    });
  }, [childFilter, searchTerm, statusFilter, typeFilter]);

  const selectedDocument =
    documentsData.find((document) => document.id === selectedDocumentId) ??
    filteredDocuments[0] ??
    documentsData[0];

  const summary = useMemo(() => {
    const approvedCount = documentsData.filter(
      (document) => document.status === 'approved',
    ).length;

    const pendingCount = documentsData.filter(
      (document) => document.status === 'pendingReview',
    ).length;

    const missingCount = documentsData.filter(
      (document) => document.status === 'missing',
    ).length;

    const expiredCount = documentsData.filter(
      (document) => document.status === 'expired',
    ).length;

    const requiredCount = documentsData.filter((document) => document.required).length;

    const signedCount = documentsData.filter((document) => document.signed).length;

    return {
      approvedCount,
      pendingCount,
      missingCount,
      expiredCount,
      requiredCount,
      signedCount,
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Approved',
        value: summary.approvedCount,
        color: chartColors.green,
      },
      {
        name: 'Pending',
        value: summary.pendingCount,
        color: chartColors.orange,
      },
      {
        name: 'Missing',
        value: summary.missingCount,
        color: chartColors.red,
      },
      {
        name: 'Expired',
        value: summary.expiredCount,
        color: chartColors.slate,
      },
    ].filter((item) => item.value > 0);
  }, [summary.approvedCount, summary.expiredCount, summary.missingCount, summary.pendingCount]);

  const typeBreakdown = useMemo(() => {
    const types: DocumentType[] = [
      'medical',
      'consent',
      'identity',
      'enrollment',
      'invoice',
      'receipt',
      'program',
      'other',
    ];

    return types
      .map((type) => ({
        name: getTypeLabel(type),
        value: documentsData.filter((document) => document.type === type).length,
        color:
          type === 'medical'
            ? chartColors.blue
            : type === 'consent'
              ? chartColors.green
              : type === 'identity'
                ? chartColors.orange
                : type === 'enrollment'
                  ? chartColors.purple
                  : type === 'program'
                    ? chartColors.yellow
                    : chartColors.slate,
      }))
      .filter((item) => item.value > 0);
  }, []);

  const childDocumentData = useMemo(() => {
    return children.map((childName) => {
      const childDocuments = documentsData.filter(
        (document) => document.childName === childName,
      );

      return {
        name: childName.split(' ')[0],
        approved: childDocuments.filter((document) => document.status === 'approved')
          .length,
        attention: childDocuments.filter(
          (document) =>
            document.status === 'pendingReview' ||
            document.status === 'missing' ||
            document.status === 'expired',
        ).length,
      };
    });
  }, [children]);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const clearUpload = () => {
    setUploadChild('Omar Khaled');
    setUploadType('medical');
    setUploadTitle('');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <FolderOpen className="h-4 w-4" />
              Documents & Consent
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Documents & Consent
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Upload, review, and track required documents for every child,
              including medical forms, consent forms, identity documents,
              enrollment agreements, receipts, and academy documents.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Document
              </button>

              <Link
                to="/parent/messages"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={FileText}
              label="Total Documents"
              value={`${documentsData.length}`}
              caption="Family document records"
              positive
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Approved"
              value={`${summary.approvedCount}`}
              caption="Reviewed and accepted"
              positive
            />

            <HeroMetricCard
              icon={Clock3}
              label="Pending"
              value={`${summary.pendingCount}`}
              caption="Waiting for academy review"
              positive={summary.pendingCount === 0}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Missing / Expired"
              value={`${summary.missingCount + summary.expiredCount}`}
              caption="Needs parent action"
              positive={summary.missingCount + summary.expiredCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={FolderOpen}
          title="Required Documents"
          value={`${summary.requiredCount}`}
          description="Documents required for enrollment and participation."
          tone="blue"
        />

        <KpiCard
          icon={FileCheck2}
          title="Signed"
          value={`${summary.signedCount}`}
          description="Documents already signed or confirmed."
          tone="success"
        />

        <KpiCard
          icon={Clock3}
          title="Pending Review"
          value={`${summary.pendingCount}`}
          description="Uploaded documents waiting for staff approval."
          tone={summary.pendingCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={XCircle}
          title="Action Needed"
          value={`${summary.missingCount + summary.expiredCount}`}
          description="Missing or expired documents that need follow-up."
          tone={summary.missingCount + summary.expiredCount > 0 ? 'danger' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Document Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter documents by child, type, status, program,
                  reviewer, or document notes.
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

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search document, child, program, notes..."
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
                label="Type"
                value={typeFilter}
                options={[
                  { label: 'All types', value: 'all' },
                  { label: 'Medical', value: 'medical' },
                  { label: 'Consent', value: 'consent' },
                  { label: 'Identity', value: 'identity' },
                  { label: 'Enrollment', value: 'enrollment' },
                  { label: 'Invoice', value: 'invoice' },
                  { label: 'Receipt', value: 'receipt' },
                  { label: 'Program', value: 'program' },
                  { label: 'Other', value: 'other' },
                ]}
                onChange={(value) => setTypeFilter(value as DocumentType | 'all')}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Pending Review', value: 'pendingReview' },
                  { label: 'Missing', value: 'missing' },
                  { label: 'Expired', value: 'expired' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as DocumentStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                active={selectedDocument.id === document.id}
                onSelect={() => setSelectedDocumentId(document.id)}
              />
            ))}

            {filteredDocuments.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Document Upload Trend"
              description="Monthly uploaded and approved document activity."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={documentTrend}>
                    <defs>
                      <linearGradient
                        id="documentsTrendGradient"
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
                      dataKey="uploaded"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#documentsTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke={chartColors.green}
                      strokeWidth={4}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Document Status"
              description="Approved, pending, missing, and expired documents."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {statusBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {statusBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={documentsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={FolderOpen}
              title="Document Types"
              description="How family documents are distributed by type."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {typeBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {typeBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={documentsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Users}
              title="Documents by Child"
              description="Approved and attention-needed documents by child."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={childDocumentData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="approved"
                      fill={chartColors.green}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="attention"
                      fill={chartColors.yellow}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>

        <aside className="space-y-6">
          <SelectedDocumentPanel document={selectedDocument} />

          <UploadDocumentBox
            uploadChild={uploadChild}
            uploadType={uploadType}
            uploadTitle={uploadTitle}
            childrenOptions={children}
            onChildChange={setUploadChild}
            onTypeChange={setUploadType}
            onTitleChange={setUploadTitle}
            onClear={clearUpload}
          />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Action Needed</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Documents requiring parent attention.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {documentsData
                .filter(
                  (document) =>
                    document.status === 'missing' ||
                    document.status === 'expired' ||
                    document.status === 'pendingReview',
                )
                .map((document) => (
                  <AttentionRow key={document.id} document={document} />
                ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful document shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={UserRound}
                title="Child Profile"
                description="Open child linked to selected document."
                href={`/parent/children/${selectedDocument.childId}`}
              />

              <QuickAction
                icon={WalletCards}
                title="Subscriptions"
                description="Review program subscriptions and requirements."
                href="/parent/subscriptions"
              />

              <QuickAction
                icon={MessageSquare}
                title="Contact Support"
                description="Ask the academy about document requirements."
                href="/parent/messages"
              />

              <QuickAction
                icon={ShieldCheck}
                title="Profile Settings"
                description="Review parent profile and account data."
                href="/parent/profile"
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

function DocumentCard({
  document,
  active,
  onSelect,
}: {
  document: DocumentItem;
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
          <FileText className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{document.title}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {document.childName} · {document.program}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {getTypeLabel(document.type)} · {getSourceLabel(document.source)}
              </p>
            </div>

            <DocumentStatusBadge status={document.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniInfo icon={CalendarDays} label="Uploaded" value={document.uploadedAt} />
        <MiniInfo icon={Clock3} label="Expiry" value={document.expiryDate} />
        <MiniInfo icon={FileText} label="Format" value={document.fileFormat} />
        <MiniInfo icon={FolderOpen} label="Size" value={formatFileSize(document.sizeKb)} />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {document.notes}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {document.required ? (
          <span className="inline-flex rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-black text-brand-blue dark:text-brand-yellow">
            Required
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            Optional
          </span>
        )}

        {document.signed ? (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
            Signed
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            Not Signed
          </span>
        )}
      </div>
    </article>
  );
}

function SelectedDocumentPanel({ document }: { document: DocumentItem }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <FileCheck2 className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Document
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {document.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {document.childName} · {document.program}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <DocumentStatusBadge status={document.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {document.fileFormat}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Child" value={document.childName} />
        <DetailLine icon={FolderOpen} label="Type" value={getTypeLabel(document.type)} />
        <DetailLine icon={UploadCloud} label="Source" value={getSourceLabel(document.source)} />
        <DetailLine icon={CalendarDays} label="Uploaded At" value={document.uploadedAt} />
        <DetailLine icon={Clock3} label="Expiry Date" value={document.expiryDate} />
        <DetailLine icon={FileText} label="File" value={`${document.fileFormat} · ${formatFileSize(document.sizeKb)}`} />
        <DetailLine icon={ShieldCheck} label="Reviewed By" value={document.reviewedBy} />
        <DetailLine icon={MessageSquare} label="Notes" value={document.notes} />

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </aside>
  );
}

function UploadDocumentBox({
  uploadChild,
  uploadType,
  uploadTitle,
  childrenOptions,
  onChildChange,
  onTypeChange,
  onTitleChange,
  onClear,
}: {
  uploadChild: string;
  uploadType: DocumentType;
  uploadTitle: string;
  childrenOptions: string[];
  onChildChange: (value: string) => void;
  onTypeChange: (value: DocumentType) => void;
  onTitleChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Upload Document</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prepare a document upload request.
          </p>
        </div>

        <UploadCloud className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
      </div>

      <div className="space-y-4">
        <FilterSelect
          label="Child"
          value={uploadChild}
          options={childrenOptions.map((child) => ({
            label: child,
            value: child,
          }))}
          onChange={onChildChange}
        />

        <FilterSelect
          label="Document Type"
          value={uploadType}
          options={[
            { label: 'Medical', value: 'medical' },
            { label: 'Consent', value: 'consent' },
            { label: 'Identity', value: 'identity' },
            { label: 'Enrollment', value: 'enrollment' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Receipt', value: 'receipt' },
            { label: 'Program', value: 'program' },
            { label: 'Other', value: 'other' },
          ]}
          onChange={(value) => onTypeChange(value as DocumentType)}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-black">Document Title</span>

          <input
            value={uploadTitle}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Example: Updated Medical Form"
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
          />
        </label>

        <div className="rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 p-5 text-center dark:border-brand-yellow/30 dark:bg-brand-yellow/5">
          <UploadCloud className="mx-auto h-8 w-8 text-brand-blue dark:text-brand-yellow" />

          <p className="mt-3 text-sm font-black">Drag file here or click upload</p>

          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            PDF, JPG, or PNG. This is currently a frontend placeholder until API
            upload is connected.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <UploadCloud className="h-4 w-4" />
            Upload
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}

function AttentionRow({ document }: { document: DocumentItem }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        {document.status === 'expired' || document.status === 'missing' ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <p className="text-sm font-black">{document.title}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {document.childName} · {getStatusLabel(document.status)} ·{' '}
            {document.notes}
          </p>
        </div>
      </div>
    </article>
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
        {percentage}% of documents
      </p>
    </div>
  );
}

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const className =
    status === 'approved'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pendingReview'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'missing'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getStatusLabel(status)}
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
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm lg:col-span-2">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <FolderOpen className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No documents found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, child, document type, or document status.
      </p>
    </div>
  );
}