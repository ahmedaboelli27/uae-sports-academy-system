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
    deleteFinancePayment,
    getFinancePaymentById,
} from '@/features/admin/finance/services/finance-data.service';
import type {
    FinanceCurrency,
    FinanceInvoiceStatus,
    FinancePaymentDetailsDto,
    FinancePaymentMethod,
    FinancePaymentStatus,
    FinanceSubscriptionStatus,
    FinanceTransactionType,
} from '@/features/admin/finance/types/finance.dto';

function formatMoney(amount: number, currency: FinanceCurrency) {
    return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} ${currency}`;
}

function getPaymentStatusLabelKey(status: FinancePaymentStatus) {
    return `financePage.paymentStatus.${status}`;
}

function getPaymentMethodLabelKey(method: FinancePaymentMethod) {
    return `financePage.paymentMethod.${method}`;
}

function getInvoiceStatusLabelKey(status: FinanceInvoiceStatus) {
    return `financePage.invoiceStatus.${status}`;
}

function getSubscriptionStatusLabelKey(status: FinanceSubscriptionStatus) {
    return `financePage.subscriptionStatus.${status}`;
}

function getTransactionTypeLabelKey(type: FinanceTransactionType) {
    return `financePaymentDetailsPage.transactionType.${type}`;
}

export default function FinancePaymentDetailsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { paymentId } = useParams<{ paymentId: string }>();

    const [payment, setPayment] = useState<FinancePaymentDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        let isMounted = true;

        const loadPayment = async () => {
            setIsLoading(true);

            try {
                if (!paymentId) {
                    setPayment(null);
                    return;
                }

                const response = await getFinancePaymentById(paymentId);

                if (isMounted) {
                    setPayment(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadPayment();

        return () => {
            isMounted = false;
        };
    }, [paymentId]);

    const handleDeletePayment = async () => {
        if (!payment) return;

        setIsDeleting(true);

        try {
            await deleteFinancePayment(payment.id);
            navigate('/admin/finance');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <FinancePaymentDetailsLoadingState />;
    }

    if (!payment) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('financePaymentDetailsPage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('financePaymentDetailsPage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/finance"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('financePaymentDetailsPage.notFound.back')}
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
                        to={`/admin/finance/payments/${payment.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <Pencil className="h-4 w-4" />
                        {t('financePaymentDetailsPage.actions.editPayment')}
                    </Link>

                    <Link
                        to="/admin/finance"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
                    >
                        <CreditCard className="h-4 w-4" />
                        {t('financePaymentDetailsPage.actions.backToFinance')}
                    </Link>
                </div>
            </div>
            <FinanceDeleteButton
                title={t('financePaymentDetailsPage.delete.title')}
                description={t('financePaymentDetailsPage.delete.description')}
                confirmLabel={t('financePaymentDetailsPage.delete.confirm')}
                isDeleting={isDeleting}
                onConfirm={handleDeletePayment}
            />
            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <CreditCard className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {payment.paymentCode}
                                </p>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {payment.studentName}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{payment.studentCode}</span>
                                    <span>•</span>
                                    <span>{payment.parentName}</span>
                                    <span>•</span>
                                    <span>{payment.paymentDate}</span>
                                </div>

                                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                                    {payment.invoiceNumber ??
                                        payment.subscriptionCode ??
                                        t('financePaymentDetailsPage.common.noLinkedRecord')}
                                </p>
                            </div>
                        </div>

                        <PaymentStatusBadge status={payment.status} />
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
                    <ProfileInfoCard
                        icon={BadgeDollarSign}
                        label={t('financePaymentDetailsPage.profile.amount')}
                        value={formatMoney(payment.amount, payment.currency)}
                    />

                    <ProfileInfoCard
                        icon={CalendarDays}
                        label={t('financePaymentDetailsPage.profile.paymentDate')}
                        value={payment.paymentDate}
                    />

                    <ProfileInfoCard
                        icon={CreditCard}
                        label={t('financePaymentDetailsPage.profile.paymentMethod')}
                        value={t(getPaymentMethodLabelKey(payment.paymentMethod))}
                    />

                    <ProfileInfoCard
                        icon={CheckCircle2}
                        label={t('financePaymentDetailsPage.profile.status')}
                        value={t(getPaymentStatusLabelKey(payment.status))}
                    />

                    <ProfileInfoCard
                        icon={Receipt}
                        label={t('financePaymentDetailsPage.profile.reference')}
                        value={
                            payment.referenceNumber ??
                            t('financePaymentDetailsPage.common.notAvailable')
                        }
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={CreditCard}
                        title={t('financePaymentDetailsPage.overview.title')}
                        description={t('financePaymentDetailsPage.overview.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.paymentCode')}
                                value={payment.paymentCode}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.transactionType')}
                                value={t(getTransactionTypeLabelKey(payment.transactionType))}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.status')}
                                value={t(getPaymentStatusLabelKey(payment.status))}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.method')}
                                value={t(getPaymentMethodLabelKey(payment.paymentMethod))}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.currency')}
                                value={payment.currency}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.overview.receivedBy')}
                                value={
                                    payment.receivedBy ??
                                    t('financePaymentDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={UserRound}
                        title={t('financePaymentDetailsPage.student.title')}
                        description={t('financePaymentDetailsPage.student.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label={t('financePaymentDetailsPage.student.studentName')}
                                value={payment.student.fullName}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.student.studentCode')}
                                value={payment.student.studentCode}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.student.parentName')}
                                value={payment.student.parentName}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.student.parentPhone')}
                                value={payment.student.parentPhone}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.student.parentEmail')}
                                value={
                                    payment.student.parentEmail ||
                                    t('financePaymentDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Receipt}
                        title={t('financePaymentDetailsPage.invoice.title')}
                        description={t('financePaymentDetailsPage.invoice.description')}
                    >
                        {payment.invoice ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label={t('financePaymentDetailsPage.invoice.invoiceNumber')}
                                    value={payment.invoice.invoiceNumber}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.invoice.status')}
                                    value={t(getInvoiceStatusLabelKey(payment.invoice.status))}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.invoice.totalAmount')}
                                    value={formatMoney(
                                        payment.invoice.totalAmount,
                                        payment.invoice.currency,
                                    )}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.invoice.balanceDue')}
                                    value={formatMoney(
                                        payment.invoice.balanceDue,
                                        payment.invoice.currency,
                                    )}
                                />

                                <Link
                                    to={`/admin/finance/invoices/${payment.invoice.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-black transition hover:border-brand-yellow sm:col-span-2"
                                >
                                    {t('financePaymentDetailsPage.invoice.viewInvoice')}
                                </Link>
                            </div>
                        ) : (
                            <EmptyMiniState
                                text={t('financePaymentDetailsPage.invoice.empty')}
                            />
                        )}
                    </DetailsSection>

                    <DetailsSection
                        icon={WalletCards}
                        title={t('financePaymentDetailsPage.subscription.title')}
                        description={t('financePaymentDetailsPage.subscription.description')}
                    >
                        {payment.subscription ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label={t(
                                        'financePaymentDetailsPage.subscription.subscriptionCode',
                                    )}
                                    value={payment.subscription.subscriptionCode}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.subscription.status')}
                                    value={t(
                                        getSubscriptionStatusLabelKey(payment.subscription.status),
                                    )}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.subscription.totalAmount')}
                                    value={formatMoney(
                                        payment.subscription.totalAmount,
                                        payment.subscription.currency,
                                    )}
                                />

                                <InfoItem
                                    label={t('financePaymentDetailsPage.subscription.balanceDue')}
                                    value={formatMoney(
                                        payment.subscription.balanceDue,
                                        payment.subscription.currency,
                                    )}
                                />

                                <Link
                                    to={`/admin/finance/subscriptions/${payment.subscription.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-black transition hover:border-brand-yellow sm:col-span-2"
                                >
                                    {t('financePaymentDetailsPage.subscription.viewSubscription')}
                                </Link>
                            </div>
                        ) : (
                            <EmptyMiniState
                                text={t('financePaymentDetailsPage.subscription.empty')}
                            />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={BadgeDollarSign}
                        title={t('financePaymentDetailsPage.amounts.title')}
                        description={t('financePaymentDetailsPage.amounts.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financePaymentDetailsPage.amounts.amount')}
                                value={formatMoney(payment.amount, payment.currency)}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.amounts.currency')}
                                value={payment.currency}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.amounts.referenceNumber')}
                                value={
                                    payment.referenceNumber ??
                                    t('financePaymentDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('financePaymentDetailsPage.notes.title')}
                        description={t('financePaymentDetailsPage.notes.description')}
                    >
                        <InfoItem
                            label={t('financePaymentDetailsPage.notes.notes')}
                            value={
                                payment.notes ??
                                t('financePaymentDetailsPage.common.notAvailable')
                            }
                        />
                    </DetailsSection>

                    <DetailsSection
                        icon={Clock}
                        title={t('financePaymentDetailsPage.timeline.title')}
                        description={t('financePaymentDetailsPage.timeline.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('financePaymentDetailsPage.timeline.createdAt')}
                                value={payment.createdAt.slice(0, 10)}
                            />

                            <InfoItem
                                label={t('financePaymentDetailsPage.timeline.updatedAt')}
                                value={payment.updatedAt.slice(0, 10)}
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
            {t('financePaymentDetailsPage.backToFinance')}
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

function EmptyMiniState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
            {text}
        </div>
    );
}

function FinancePaymentDetailsLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>

                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>
            </div>
        </main>
    );
}