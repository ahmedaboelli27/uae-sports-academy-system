import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    ArrowLeft,
    CreditCard,
    FileText,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ReceiptText,
    UserRound,
    Users,
    WalletCards,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getParentById } from "@/features/admin/parents/services/parents.service";
import type {
    ParentChildSummaryDto,
    ParentCommunicationDto,
    ParentContactPreference,
    ParentDetailsDto,
    ParentPaymentDto,
    ParentPaymentStatus,
    ParentStatus,
} from "@/features/admin/parents/types/parents.dto";

function getParentStatusLabelKey(status: ParentStatus) {
    return `parentsPage.status.${status}`;
}

function getPaymentStatusLabelKey(status: ParentPaymentStatus | ParentPaymentDto["status"]) {
    return `parentsPage.payment.${status}`;
}

function getContactMethodLabelKey(method: ParentContactPreference) {
    return `parentsPage.contact.${method}`;
}

function getSubscriptionStatusLabelKey(
    status: ParentChildSummaryDto["subscriptionStatus"],
) {
    const keys: Record<ParentChildSummaryDto["subscriptionStatus"], string> = {
        active: "studentsPage.subscription.active",
        expired: "studentsPage.subscription.expired",
        expiring_soon: "studentsPage.subscription.expiringSoon",
        not_started: "studentsPage.subscription.notStarted",
    };

    return keys[status];
}

function getCommunicationTypeLabelKey(type: ParentCommunicationDto["type"]) {
    return `parentDetailsPage.communication.types.${type}`;
}

export default function ParentDetailsPage() {
    const { t } = useTranslation();
    const { parentId } = useParams<{ parentId: string }>();

    const [parent, setParent] = useState<ParentDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadParent = async () => {
            setIsLoading(true);

            try {
                if (!parentId) {
                    setParent(null);
                    return;
                }

                const response = await getParentById(parentId);

                if (isMounted) {
                    setParent(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadParent();

        return () => {
            isMounted = false;
        };
    }, [parentId]);

    if (isLoading) {
        return <ParentDetailsLoadingState />;
    }

    if (!parent) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t("parentDetailsPage.notFound.title")}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t("parentDetailsPage.notFound.description")}
                    </p>

                    <Link
                        to="/admin/parents"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t("parentDetailsPage.notFound.back")}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="space-y-8">
            <BackLink />

            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <UserRound className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {t("parentDetailsPage.profile.parentProfile")}
                                </p>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {parent.fullName}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{parent.city}</span>
                                    <span>•</span>
                                    <span>
                                        {parent.childrenCount}{" "}
                                        {t("parentDetailsPage.profile.children")}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {t(getContactMethodLabelKey(parent.preferredContactMethod))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <StatusBadge
                                value={parent.status}
                                label={t(getParentStatusLabelKey(parent.status))}
                                type="parent"
                            />

                            <StatusBadge
                                value={parent.paymentStatus}
                                label={t(getPaymentStatusLabelKey(parent.paymentStatus))}
                                type="payment"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
                    <ProfileInfoCard
                        icon={Phone}
                        label={t("parentDetailsPage.profile.phone")}
                        value={parent.phone}
                    />

                    <ProfileInfoCard
                        icon={Mail}
                        label={t("parentDetailsPage.profile.email")}
                        value={parent.email}
                    />

                    <ProfileInfoCard
                        icon={WalletCards}
                        label={t("parentDetailsPage.profile.outstanding")}
                        value={`${parent.totalOutstandingAmount} ${parent.currency}`}
                    />

                    <ProfileInfoCard
                        icon={CreditCard}
                        label={t("parentDetailsPage.profile.paid")}
                        value={`${parent.totalPaidAmount} ${parent.currency}`}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={Users}
                        title={t("parentDetailsPage.children.title")}
                        description={t("parentDetailsPage.children.description")}
                    >
                        {parent.children.length > 0 ? (
                            <div className="space-y-3">
                                {parent.children.map((child) => (
                                    <ChildCard key={child.id} child={child} />
                                ))}
                            </div>
                        ) : (
                            <EmptyMiniState text={t("parentDetailsPage.children.empty")} />
                        )}
                    </DetailsSection>

                    <DetailsSection
                        icon={ReceiptText}
                        title={t("parentDetailsPage.payments.title")}
                        description={t("parentDetailsPage.payments.description")}
                    >
                        {parent.recentPayments.length > 0 ? (
                            <div className="space-y-3">
                                {parent.recentPayments.map((payment) => (
                                    <PaymentCard key={payment.id} payment={payment} />
                                ))}
                            </div>
                        ) : (
                            <EmptyMiniState text={t("parentDetailsPage.payments.empty")} />
                        )}
                    </DetailsSection>

                    <DetailsSection
                        icon={MessageCircle}
                        title={t("parentDetailsPage.communication.title")}
                        description={t("parentDetailsPage.communication.description")}
                    >
                        {parent.communicationHistory.length > 0 ? (
                            <div className="space-y-3">
                                {parent.communicationHistory.map((item) => (
                                    <CommunicationCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <EmptyMiniState
                                text={t("parentDetailsPage.communication.empty")}
                            />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={WalletCards}
                        title={t("parentDetailsPage.financial.title")}
                        description={t("parentDetailsPage.financial.description")}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t("parentDetailsPage.financial.totalPaid")}
                                value={`${parent.totalPaidAmount} ${parent.currency}`}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.financial.totalOutstanding")}
                                value={`${parent.totalOutstandingAmount} ${parent.currency}`}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.financial.pendingPayments")}
                                value={`${parent.pendingPaymentsCount}`}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.financial.overduePayments")}
                                value={`${parent.overduePaymentsCount}`}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={MapPin}
                        title={t("parentDetailsPage.contact.title")}
                        description={t("parentDetailsPage.contact.description")}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t("parentDetailsPage.contact.city")}
                                value={parent.city}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.contact.address")}
                                value={
                                    parent.address ?? t("parentDetailsPage.common.notAvailable")
                                }
                            />

                            <InfoItem
                                label={t("parentDetailsPage.contact.preferredContact")}
                                value={t(getContactMethodLabelKey(parent.preferredContactMethod))}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.contact.lastContact")}
                                value={
                                    parent.lastContactDate ??
                                    t("parentDetailsPage.common.notAvailable")
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t("parentDetailsPage.notes.title")}
                        description={t("parentDetailsPage.notes.description")}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t("parentDetailsPage.notes.notes")}
                                value={parent.notes ?? t("parentDetailsPage.common.notAvailable")}
                            />

                            <InfoItem
                                label={t("parentDetailsPage.notes.emergencyContact")}
                                value={
                                    parent.emergencyContactName
                                        ? `${parent.emergencyContactName} - ${parent.emergencyContactPhone ?? ""
                                        }`
                                        : t("parentDetailsPage.common.notAvailable")
                                }
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
            to="/admin/parents"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
        >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("parentDetailsPage.backToParents")}
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
            <p className="mt-1 text-sm font-black">{value}</p>
        </div>
    );
}

function ChildCard({ child }: { child: ParentChildSummaryDto }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link
                        to={`/admin/students/${child.id}`}
                        className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                    >
                        {child.fullName}
                    </Link>

                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {child.studentCode} • {child.age}{" "}
                        {t("parentDetailsPage.profile.yearsOld")}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-muted-foreground">
                        {child.programName} • {child.branchName}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <StatusBadge
                        value={child.subscriptionStatus}
                        label={t(getSubscriptionStatusLabelKey(child.subscriptionStatus))}
                        type="subscription"
                    />

                    <StatusBadge
                        value={child.paymentStatus}
                        label={t(getPaymentStatusLabelKey(child.paymentStatus))}
                        type="payment"
                    />
                </div>
            </div>
        </div>
    );
}

function PaymentCard({ payment }: { payment: ParentPaymentDto }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-black">{payment.invoiceNumber}</p>

                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {payment.studentName}
                    </p>
                </div>

                <StatusBadge
                    value={payment.status}
                    label={t(getPaymentStatusLabelKey(payment.status))}
                    type="payment"
                />
            </div>

            <div className="mt-4 grid gap-2 text-xs font-semibold text-muted-foreground sm:grid-cols-3">
                <p>
                    {t("parentDetailsPage.payments.amount")}: {payment.amount}{" "}
                    {payment.currency}
                </p>

                <p>
                    {t("parentDetailsPage.payments.dueDate")}: {payment.dueDate}
                </p>

                <p>
                    {t("parentDetailsPage.payments.paidAt")}:{" "}
                    {payment.paidAt ?? t("parentDetailsPage.common.notAvailable")}
                </p>
            </div>
        </div>
    );
}

function CommunicationCard({ item }: { item: ParentCommunicationDto }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-black">{item.title}</p>

                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {t(getCommunicationTypeLabelKey(item.type))} • {item.date}
                    </p>
                </div>

                <p className="text-xs font-black text-muted-foreground">
                    {item.handledBy}
                </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
            </p>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-black leading-6">{value}</p>
        </div>
    );
}

interface StatusBadgeProps {
    value: string;
    label: string;
    type: "parent" | "payment" | "subscription";
}

function StatusBadge({ value, label, type }: StatusBadgeProps) {
    const getClasses = () => {
        if (type === "parent") {
            if (value === "active") {
                return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
            }

            if (value === "inactive") {
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
            }

            if (value === "blocked") {
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
            }

            return "bg-secondary text-secondary-foreground";
        }

        if (type === "payment") {
            if (value === "paid") {
                return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
            }

            if (value === "pending") {
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
            }

            if (value === "overdue") {
                return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
            }

            return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
        }

        if (value === "active") {
            return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
        }

        if (value === "expired") {
            return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
        }

        if (value === "expiring_soon") {
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
        }

        return "bg-secondary text-secondary-foreground";
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
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

function ParentDetailsLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
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