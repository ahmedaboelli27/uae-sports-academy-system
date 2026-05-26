
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
    UserRound,
    WalletCards,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FinanceDeleteButton from '@/features/admin/finance/components/FinanceDeleteButton';
import {
    deleteFinanceInvoice,
    getFinanceInvoiceById,
} from '@/features/admin/finance/services/finance-data.service';
import type {
    FinanceCurrency,
    FinanceInvoiceDetailsDto,
    FinanceInvoiceLineItemDto,
    FinanceInvoiceStatus,
    FinancePaymentListItemDto,
    FinancePaymentMethod,
    FinancePaymentStatus,
} from '@/features/admin/finance/types/finance.dto';

function formatMoney(amount: number, currency: FinanceCurrency) {
    return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} ${currency}`;
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

export default function FinanceInvoiceDetailsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { invoiceId } = useParams<{ invoiceId: string }>();

    const [invoice, setInvoice] = useState<FinanceInvoiceDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        let isMounted = true;

        const loadInvoice = async () => {
            setIsLoading(true);

            try {
                if (!invoiceId) {
                    setInvoice(null);
                    return;
                }

                const response = await getFinanceInvoiceById(invoiceId);

                if (isMounted) {
                    setInvoice(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadInvoice();

        return () => {
            isMounted = false;
        };
    }, [invoiceId]);

    const handleDeleteInvoice = async () => {
        if (!invoice) return;

        setIsDeleting(true);

        try {
            await deleteFinanceInvoice(invoice.id);
            navigate('/admin/finance');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <FinanceInvoiceDetailsLoadingState />;
    }

    if (!invoice) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('financeInvoiceDetailsPage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('financeInvoiceDetailsPage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/finance"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('financeInvoiceDetailsPage.notFound.back')}
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
                        to={`/admin/finance/invoices/${invoice.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <Pencil className="h-4 w-4" />
                        {t('financeInvoiceDetailsPage.actions.editInvoice')}
                    </Link>

                    <Link
                        to="/admin/finance"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
                    >
                        <Receipt className="h-4 w-4" />
                        {t('financeInvoiceDetailsPage.actions.backToFinance')}
                    </Link>
                </div>
            </div>
            <FinanceDeleteButton
                title={t('financeInvoiceDetailsPage.delete.title')}
                description={t('financeInvoiceDetailsPage.delete.description')}
                confirmLabel={t('financeInvoiceDetailsPage.delete.confirm')}
                isDeleting={isDeleting}
                onConfirm={handleDeleteInvoice}
            />
            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <Receipt className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {invoice.invoiceNumber}
                                </p>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {invoice.studentName}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{invoice.studentCode}</span>
                                    <span>•</span>
                                    <span>{invoice.parentName}</span>
                                    <span>•</span>
                                    <span>{invoice.dueDate}</span>
                                </div>

                                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                                    {invoice.subscriptionCode ??
                                        t('financeInvoiceDetailsPage.common.noSubscription')}
                                </p>
                            </div>
                        </div>

                        <InvoiceStatusBadge status={invoice.status} />
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
                    <ProfileInfoCard
                        icon={BadgeDollarSign}
                        label={t('financeInvoiceDetailsPage.profile.totalAmount')}
                        value={formatMoney(invoice.totalAmount, invoice.currency)}
                    />

                    <ProfileInfoCard
                        icon={CheckCircle2}
                        label={t('financeInvoiceDetailsPage.profile.paidAmount')}
                        value={formatMoney(invoice.paidAmount, invoice.currency)}
                    />

                    <ProfileInfoCard
                        icon={AlertTriangle}
                        label={t('financeInvoiceDetailsPage.profile.balanceDue')}
                        value={formatMoney(invoice.balanceDue, invoice.currency)}
                    />

                    <ProfileInfoCard
                        icon={CalendarDays}
                        label={t('financeInvoiceDetailsPage.profile.issueDate')}
                        value={invoice.issueDate}
                    />

                    <ProfileInfoCard
                        icon={Clock}
                        label={t('financeInvoiceDetailsPage.profile.dueDate')}
                        value={invoice.dueDate}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={Receipt}
                        title={t('financeInvoiceDetailsPage.overview.title')}
                        description={t('financeInvoiceDetailsPage.overview.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.invoiceNumber')}
                                value={invoice.invoiceNumber}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.status')}
                                value={t(getInvoiceStatusLabelKey(invoice.status))}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.currency')}
                                value={invoice.currency}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.issueDate')}
                                value={invoice.issueDate}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.dueDate')}
                                value={invoice.dueDate}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.overview.subscriptionCode')}
                                value={
                                    invoice.subscriptionCode ??
                                    t('financeInvoiceDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={UserRound}
                        title={t('financeInvoiceDetailsPage.student.title')}
                        description={t('financeInvoiceDetailsPage.student.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.student.studentName')}
                                value={invoice.student.fullName}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.student.studentCode')}
                                value={invoice.student.studentCode}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.student.parentName')}
                                value={invoice.student.parentName}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.student.parentPhone')}
                                value={invoice.student.parentPhone}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.student.parentEmail')}
                                value={
                                    invoice.student.parentEmail ||
                                    t('financeInvoiceDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('financeInvoiceDetailsPage.lineItems.title')}
                        description={t('financeInvoiceDetailsPage.lineItems.description')}
                    >
                        {invoice.lineItems.length > 0 ? (
                            <LineItemsTable
                                rows={invoice.lineItems}
                                currency={invoice.currency}
                            />
                        ) : (
                            <EmptyMiniState
                                text={t('financeInvoiceDetailsPage.lineItems.empty')}
                            />
                        )}
                    </DetailsSection>

                    <DetailsSection
                        icon={CreditCard}
                        title={t('financeInvoiceDetailsPage.payments.title')}
                        description={t('financeInvoiceDetailsPage.payments.description')}
                    >
                        {invoice.payments.length > 0 ? (
                            <PaymentsTable rows={invoice.payments} currency={invoice.currency} />
                        ) : (
                            <EmptyMiniState
                                text={t('financeInvoiceDetailsPage.payments.empty')}
                            />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={BadgeDollarSign}
                        title={t('financeInvoiceDetailsPage.amounts.title')}
                        description={t('financeInvoiceDetailsPage.amounts.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.subtotal')}
                                value={formatMoney(invoice.subtotal, invoice.currency)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.discountAmount')}
                                value={formatMoney(invoice.discountAmount, invoice.currency)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.taxAmount')}
                                value={formatMoney(invoice.taxAmount, invoice.currency)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.totalAmount')}
                                value={formatMoney(invoice.totalAmount, invoice.currency)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.paidAmount')}
                                value={formatMoney(invoice.paidAmount, invoice.currency)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.amounts.balanceDue')}
                                value={formatMoney(invoice.balanceDue, invoice.currency)}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={WalletCards}
                        title={t('financeInvoiceDetailsPage.subscription.title')}
                        description={t('financeInvoiceDetailsPage.subscription.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.subscription.subscriptionCode')}
                                value={
                                    invoice.subscriptionCode ??
                                    t('financeInvoiceDetailsPage.common.notAvailable')
                                }
                            />

                            {invoice.subscriptionId ? (
                                <Link
                                    to={`/admin/finance/subscriptions/${invoice.subscriptionId}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-black transition hover:border-brand-yellow"
                                >
                                    {t('financeInvoiceDetailsPage.subscription.viewSubscription')}
                                </Link>
                            ) : null}
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('financeInvoiceDetailsPage.notes.title')}
                        description={t('financeInvoiceDetailsPage.notes.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.notes.notes')}
                                value={
                                    invoice.notes ??
                                    t('financeInvoiceDetailsPage.common.notAvailable')
                                }
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.notes.terms')}
                                value={
                                    invoice.terms ??
                                    t('financeInvoiceDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Clock}
                        title={t('financeInvoiceDetailsPage.timeline.title')}
                        description={t('financeInvoiceDetailsPage.timeline.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financeInvoiceDetailsPage.timeline.createdAt')}
                                value={invoice.createdAt.slice(0, 10)}
                            />

                            <InfoItem
                                label={t('financeInvoiceDetailsPage.timeline.updatedAt')}
                                value={invoice.updatedAt.slice(0, 10)}
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
            {t('financeInvoiceDetailsPage.backToFinance')}
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

function LineItemsTable({
    rows,
    currency,
}: {
    rows: FinanceInvoiceLineItemDto[];
    currency: FinanceCurrency;
}) {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr className="border-b border-border bg-secondary/60">
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.descriptionField')}</TableHead>
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.quantity')}</TableHead>
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.unitPrice')}</TableHead>
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.discount')}</TableHead>
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.tax')}</TableHead>
                        <TableHead>{t('financeInvoiceDetailsPage.lineItems.total')}</TableHead>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                        >
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatMoney(item.unitPrice, currency)}</TableCell>
                            <TableCell>{formatMoney(item.discountAmount, currency)}</TableCell>
                            <TableCell>{formatMoney(item.taxAmount, currency)}</TableCell>
                            <TableCell>{formatMoney(item.totalAmount, currency)}</TableCell>
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
            <table className="w-full min-w-[900px] border-collapse">
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
                                    t('financeInvoiceDetailsPage.common.notAvailable')}
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

function FinanceInvoiceDetailsLoadingState() {
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