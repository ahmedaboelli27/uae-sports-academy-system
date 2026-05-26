import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    ArrowLeft,
    BadgeDollarSign,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Pencil,
    Receipt,
    Trophy,
    UserRound,
    Users,
    WalletCards
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FinanceDeleteButton from '@/features/admin/finance/components/FinanceDeleteButton';
import {
    deleteFinanceSubscription,
    getFinanceSubscriptionById,
} from '@/features/admin/finance/services/finance-data.service';
import type {
    FinanceCurrency,
    FinanceInvoiceListItemDto,
    FinanceInvoiceStatus,
    FinancePaymentListItemDto,
    FinancePaymentMethod,
    FinancePaymentStatus,
    FinanceSubscriptionDetailsDto,
    FinanceSubscriptionStatus,
} from '@/features/admin/finance/types/finance.dto';

function formatMoney(amount: number, currency: FinanceCurrency) {
    return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} ${currency}`;
}

function getSubscriptionStatusLabelKey(status: FinanceSubscriptionStatus) {
    return `financePage.subscriptionStatus.${status}`;
}

function getInvoiceStatusLabelKey(status: FinanceInvoiceStatus) {
    return `financePage.invoiceStatus.${status}`;
}

function getPaymentStatusLabelKey(status: FinancePaymentStatus) {
    return `financePage.paymentStatus.${status}`;
}

function getPaymentMethodLabelKey(method: FinancePaymentMethod) {
    return `financePage.paymentMethod.${method}`;
}

export default function FinanceSubscriptionDetailsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { subscriptionId } = useParams<{ subscriptionId: string }>();

    const [subscription, setSubscription] =
        useState<FinanceSubscriptionDetailsDto | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadSubscription = async () => {
            setIsLoading(true);

            try {
                if (!subscriptionId) {
                    setSubscription(null);
                    return;
                }

                const response = await getFinanceSubscriptionById(subscriptionId);

                if (isMounted) {
                    setSubscription(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadSubscription();

        return () => {
            isMounted = false;
        };
    }, [subscriptionId]);

    const handleDeleteSubscription = async () => {
        if (!subscription) return;

        setIsDeleting(true);

        try {
            await deleteFinanceSubscription(subscription.id);
            navigate('/admin/finance');
        } finally {
            setIsDeleting(false);
        }
    };


    if (isLoading) {
        return <FinanceSubscriptionDetailsLoadingState />;
    }

    if (!subscription) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('financeSubscriptionDetailsPage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('financeSubscriptionDetailsPage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/finance"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('financeSubscriptionDetailsPage.notFound.back')}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <BackLink />

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        to={`/admin/finance/subscriptions/${subscription.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <Pencil className="h-4 w-4" />
                        {t('financeSubscriptionDetailsPage.actions.editSubscription')}
                    </Link>

                    <Link
                        to="/admin/finance"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
                    >
                        <WalletCards className="h-4 w-4" />
                        {t('financeSubscriptionDetailsPage.actions.backToFinance')}
                    </Link>
                </div>
            </div>
            <FinanceDeleteButton
                title={t('financeSubscriptionDetailsPage.delete.title')}
                description={t('financeSubscriptionDetailsPage.delete.description')}
                confirmLabel={t('financeSubscriptionDetailsPage.delete.confirm')}
                isDeleting={isDeleting}
                onConfirm={handleDeleteSubscription}
            />

            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <WalletCards className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {subscription.subscriptionCode}
                                </p>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {subscription.studentName}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{subscription.programName}</span>
                                    <span>•</span>
                                    <span>{subscription.branchName}</span>
                                    <span>•</span>
                                    <span>{t(`financePage.plan.${subscription.plan}`)}</span>
                                </div>

                                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                                    {subscription.startDate} → {subscription.endDate}
                                </p>
                            </div>
                        </div>

                        <SubscriptionStatusBadge status={subscription.status} />
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
                    <ProfileInfoCard
                        icon={BadgeDollarSign}
                        label={t('financeSubscriptionDetailsPage.profile.totalAmount')}
                        value={formatMoney(subscription.totalAmount, subscription.currency)}
                    />

                    <ProfileInfoCard
                        icon={CheckCircle2}
                        label={t('financeSubscriptionDetailsPage.profile.paidAmount')}
                        value={formatMoney(subscription.paidAmount, subscription.currency)}
                    />

                    <ProfileInfoCard
                        icon={AlertTriangle}
                        label={t('financeSubscriptionDetailsPage.profile.balanceDue')}
                        value={formatMoney(subscription.balanceDue, subscription.currency)}
                    />

                    <ProfileInfoCard
                        icon={CalendarDays}
                        label={t('financeSubscriptionDetailsPage.profile.sessions')}
                        value={`${subscription.sessionsUsed}/${subscription.sessionsIncluded}`}
                    />

                    <ProfileInfoCard
                        icon={Clock}
                        label={t('financeSubscriptionDetailsPage.profile.nextDueDate')}
                        value={
                            subscription.nextPaymentDueDate ??
                            t('financeSubscriptionDetailsPage.common.notAvailable')
                        }
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={WalletCards}
                        title={t('financeSubscriptionDetailsPage.overview.title')}
                        description={t('financeSubscriptionDetailsPage.overview.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.code')}
                                value={subscription.subscriptionCode}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.plan')}
                                value={t(`financePage.plan.${subscription.plan}`)}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.status')}
                                value={t(getSubscriptionStatusLabelKey(subscription.status))}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.startDate')}
                                value={subscription.startDate}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.endDate')}
                                value={subscription.endDate}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.overview.nextPaymentDueDate')}
                                value={
                                    subscription.nextPaymentDueDate ??
                                    t('financeSubscriptionDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={UserRound}
                        title={t('financeSubscriptionDetailsPage.student.title')}
                        description={t('financeSubscriptionDetailsPage.student.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.student.studentName')}
                                value={subscription.student.fullName}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.student.studentCode')}
                                value={subscription.student.studentCode}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.student.parentName')}
                                value={subscription.student.parentName}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.student.parentPhone')}
                                value={subscription.student.parentPhone}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Trophy}
                        title={t('financeSubscriptionDetailsPage.program.title')}
                        description={t('financeSubscriptionDetailsPage.program.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.program.programName')}
                                value={subscription.program.name}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.program.programCode')}
                                value={subscription.program.programCode}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.program.branchName')}
                                value={subscription.branch.name}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.program.branchLocation')}
                                value={`${subscription.branch.city} • ${subscription.branch.area}`}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Receipt}
                        title={t('financeSubscriptionDetailsPage.invoices.title')}
                        description={t('financeSubscriptionDetailsPage.invoices.description')}
                    >
                        {subscription.invoices.length > 0 ? (
                            <InvoicesTable
                                rows={subscription.invoices}
                                currency={subscription.currency}
                            />
                        ) : (
                            <EmptyMiniState
                                text={t('financeSubscriptionDetailsPage.invoices.empty')}
                            />
                        )}
                    </DetailsSection>

                    <DetailsSection
                        icon={CreditCard}
                        title={t('financeSubscriptionDetailsPage.payments.title')}
                        description={t('financeSubscriptionDetailsPage.payments.description')}
                    >
                        {subscription.payments.length > 0 ? (
                            <PaymentsTable
                                rows={subscription.payments}
                                currency={subscription.currency}
                            />
                        ) : (
                            <EmptyMiniState
                                text={t('financeSubscriptionDetailsPage.payments.empty')}
                            />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={BadgeDollarSign}
                        title={t('financeSubscriptionDetailsPage.amounts.title')}
                        description={t('financeSubscriptionDetailsPage.amounts.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.amounts.baseAmount')}
                                value={formatMoney(subscription.baseAmount, subscription.currency)}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.amounts.discount')}
                                value={formatMoney(
                                    subscription.discountAmount,
                                    subscription.currency,
                                )}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.amounts.totalAmount')}
                                value={formatMoney(subscription.totalAmount, subscription.currency)}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.amounts.paidAmount')}
                                value={formatMoney(subscription.paidAmount, subscription.currency)}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.amounts.balanceDue')}
                                value={formatMoney(subscription.balanceDue, subscription.currency)}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Users}
                        title={t('financeSubscriptionDetailsPage.sessions.title')}
                        description={t('financeSubscriptionDetailsPage.sessions.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.sessions.included')}
                                value={`${subscription.sessionsIncluded}`}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.sessions.used')}
                                value={`${subscription.sessionsUsed}`}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.sessions.remaining')}
                                value={`${subscription.sessionsRemaining}`}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('financeSubscriptionDetailsPage.notes.title')}
                        description={t('financeSubscriptionDetailsPage.notes.description')}
                    >
                        <InfoItem
                            label={t('financeSubscriptionDetailsPage.notes.notes')}
                            value={
                                subscription.notes ??
                                t('financeSubscriptionDetailsPage.common.notAvailable')
                            }
                        />
                    </DetailsSection>

                    <DetailsSection
                        icon={Clock}
                        title={t('financeSubscriptionDetailsPage.timeline.title')}
                        description={t('financeSubscriptionDetailsPage.timeline.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.timeline.createdAt')}
                                value={subscription.createdAt.slice(0, 10)}
                            />

                            <InfoItem
                                label={t('financeSubscriptionDetailsPage.timeline.updatedAt')}
                                value={subscription.updatedAt.slice(0, 10)}
                            />
                        </div>
                    </DetailsSection>
                </aside>
            </section>
        </main>
    );
}

function BackLink() {
    const { t } = useTranslation();

    return (
        <Link
            to="/admin/finance"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
        >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('financeSubscriptionDetailsPage.backToFinance')}
        </Link>
    );
}

interface DetailsSectionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: ReactNode;
}

function DetailsSection({
    icon: Icon,
    title,
    description,
    children,
}: DetailsSectionProps) {
    return (
        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-4">
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

interface ProfileInfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function ProfileInfoCard({ icon: Icon, label, value }: ProfileInfoCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                <Icon className="h-5 w-5" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-black">{value}</p>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-black leading-6">{value}</p>
        </div>
    );
}

function SubscriptionStatusBadge({
    status,
}: {
    status: FinanceSubscriptionStatus;
}) {
    const { t } = useTranslation();

    const tone =
        status === 'active'
            ? 'green'
            : status === 'pending'
                ? 'yellow'
                : status === 'expired'
                    ? 'red'
                    : 'slate';

    return (
        <StatusBadge label={t(getSubscriptionStatusLabelKey(status))} tone={tone} />
    );
}

function InvoiceStatusBadge({ status }: { status: FinanceInvoiceStatus }) {
    const { t } = useTranslation();

    const tone =
        status === 'paid'
            ? 'green'
            : status === 'partially_paid'
                ? 'yellow'
                : status === 'overdue'
                    ? 'red'
                    : 'slate';

    return <StatusBadge label={t(getInvoiceStatusLabelKey(status))} tone={tone} />;
}

function PaymentStatusBadge({ status }: { status: FinancePaymentStatus }) {
    const { t } = useTranslation();

    const tone =
        status === 'paid'
            ? 'green'
            : status === 'pending'
                ? 'yellow'
                : status === 'failed' || status === 'overdue'
                    ? 'red'
                    : 'slate';

    return <StatusBadge label={t(getPaymentStatusLabelKey(status))} tone={tone} />;
}

function StatusBadge({
    label,
    tone,
}: {
    label: string;
    tone: 'green' | 'yellow' | 'red' | 'slate';
}) {
    const toneClasses: Record<typeof tone, string> = {
        green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
        yellow:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
        red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
        slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneClasses[tone]}`}
        >
            {label}
        </span>
    );
}

function InvoicesTable({
    rows,
    currency,
}: {
    rows: FinanceInvoiceListItemDto[];
    currency: FinanceCurrency;
}) {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
                <thead>
                    <tr className="border-b border-border bg-secondary/60">
                        <TableHead>{t('financePage.table.invoice')}</TableHead>
                        <TableHead>{t('financePage.table.issueDate')}</TableHead>
                        <TableHead>{t('financePage.table.dueDate')}</TableHead>
                        <TableHead>{t('financePage.table.total')}</TableHead>
                        <TableHead>{t('financePage.table.paid')}</TableHead>
                        <TableHead>{t('financePage.table.balance')}</TableHead>
                        <TableHead>{t('financePage.table.status')}</TableHead>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((invoice) => (
                        <tr
                            key={invoice.id}
                            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                        >
                            <TableCell>
                                <Link
                                    to={`/admin/finance/invoices/${invoice.id}`}
                                    className="font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                                >
                                    {invoice.invoiceNumber}
                                </Link>
                            </TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{formatMoney(invoice.totalAmount, currency)}</TableCell>
                            <TableCell>{formatMoney(invoice.paidAmount, currency)}</TableCell>
                            <TableCell>{formatMoney(invoice.balanceDue, currency)}</TableCell>
                            <TableCell>
                                <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PaymentsTable({
    rows,
    currency,
}: {
    rows: FinancePaymentListItemDto[];
    currency: FinanceCurrency;
}) {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
                <thead>
                    <tr className="border-b border-border bg-secondary/60">
                        <TableHead>{t('financePage.table.payment')}</TableHead>
                        <TableHead>{t('financePage.table.date')}</TableHead>
                        <TableHead>{t('financePage.table.method')}</TableHead>
                        <TableHead>{t('financePage.table.amount')}</TableHead>
                        <TableHead>{t('financePage.table.reference')}</TableHead>
                        <TableHead>{t('financePage.table.status')}</TableHead>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((payment) => (
                        <tr
                            key={payment.id}
                            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                        >
                            <TableCell>
                                <Link
                                    to={`/admin/finance/payments/${payment.id}`}
                                    className="font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                                >
                                    {payment.paymentCode}
                                </Link>
                            </TableCell>
                            <TableCell>{payment.paymentDate}</TableCell>
                            <TableCell>{t(getPaymentMethodLabelKey(payment.paymentMethod))}</TableCell>
                            <TableCell>{formatMoney(payment.amount, currency)}</TableCell>
                            <TableCell>
                                {payment.referenceNumber ??
                                    t('financeSubscriptionDetailsPage.common.notAvailable')}
                            </TableCell>
                            <TableCell>
                                <PaymentStatusBadge status={payment.status} />
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableHead({ children }: { children: ReactNode }) {
    return (
        <th className="px-5 py-4 text-start text-xs font-black uppercase tracking-wide text-muted-foreground">
            {children}
        </th>
    );
}

function TableCell({ children }: { children: ReactNode }) {
    return <td className="px-5 py-4 align-middle text-sm font-semibold">{children}</td>;
}

function EmptyMiniState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
            {text}
        </div>
    );
}

function FinanceSubscriptionDetailsLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
                </div>

                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>
            </div>
        </main>
    );
}