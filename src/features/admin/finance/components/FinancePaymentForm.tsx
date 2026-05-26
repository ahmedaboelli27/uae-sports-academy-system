import type { LucideIcon } from 'lucide-react';
import {
    AlertCircle,
    BadgeDollarSign,
    CheckCircle2,
    CreditCard,
    FileText,
    Receipt,
    ShieldCheck,
    UserRound,
    WalletCards
} from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    CreatePaymentRequestDto,
    FinanceCurrency,
    FinancePaymentMethod,
    FinancePaymentStatus,
    FinanceTransactionType,
} from '../types/finance.dto';

export interface FinancePaymentFormPayload extends CreatePaymentRequestDto { }

type FinancePaymentFormMode = 'create' | 'edit';
type LinkedRecordType = 'invoice' | 'subscription' | 'none';

interface FinancePaymentFormValues {
    linkedRecordType: LinkedRecordType;

    invoiceId: string;
    invoiceNumber: string;

    subscriptionId: string;
    subscriptionCode: string;

    studentId: string;
    studentName: string;
    studentCode: string;

    parentId: string;
    parentName: string;
    parentPhone: string;

    paymentDate: string;
    paymentMethod: FinancePaymentMethod;
    status: FinancePaymentStatus;

    transactionType: FinanceTransactionType;

    currency: FinanceCurrency;
    amount: string;

    referenceNumber: string;
    receivedBy: string;

    notes: string;
}

interface FinancePaymentFormProps {
    mode: FinancePaymentFormMode;
    initialValues?: Partial<FinancePaymentFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: FinancePaymentFormPayload) => void | Promise<void>;
}

const invoiceOptions = [
    {
        id: 'invoice-001',
        invoiceNumber: 'INV-1001',
        subscriptionId: 'subscription-001',
        subscriptionCode: 'SUB-1001',

        studentId: 'student-001',
        studentName: 'Mohammed Khaled',
        studentCode: 'STU-1001',

        parentId: 'parent-001',
        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 0,
    },
    {
        id: 'invoice-002',
        invoiceNumber: 'INV-1002',
        subscriptionId: 'subscription-002',
        subscriptionCode: 'SUB-1002',

        studentId: 'student-002',
        studentName: 'Omar Ahmed',
        studentCode: 'STU-1002',

        parentId: 'parent-002',
        parentName: 'Ahmed Omar',
        parentPhone: '+971 50 222 3333',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 1500,
    },
    {
        id: 'invoice-003',
        invoiceNumber: 'INV-1003',
        subscriptionId: 'subscription-003',
        subscriptionCode: 'SUB-1003',

        studentId: 'student-003',
        studentName: 'Layan Omar',
        studentCode: 'STU-1003',

        parentId: 'parent-003',
        parentName: 'Omar Salem',
        parentPhone: '+971 55 111 2222',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 0,
    },
    {
        id: 'invoice-004',
        invoiceNumber: 'INV-1004',
        subscriptionId: 'subscription-004',
        subscriptionCode: 'SUB-1004',

        studentId: 'student-004',
        studentName: 'Mariam Hassan',
        studentCode: 'STU-1004',

        parentId: 'parent-004',
        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 407.5,
    },
];

const subscriptionOptions = [
    {
        id: 'subscription-001',
        subscriptionCode: 'SUB-1001',

        studentId: 'student-001',
        studentName: 'Mohammed Khaled',
        studentCode: 'STU-1001',

        parentId: 'parent-001',
        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 0,
    },
    {
        id: 'subscription-002',
        subscriptionCode: 'SUB-1002',

        studentId: 'student-002',
        studentName: 'Omar Ahmed',
        studentCode: 'STU-1002',

        parentId: 'parent-002',
        parentName: 'Ahmed Omar',
        parentPhone: '+971 50 222 3333',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 1500,
    },
    {
        id: 'subscription-003',
        subscriptionCode: 'SUB-1003',

        studentId: 'student-003',
        studentName: 'Layan Omar',
        studentCode: 'STU-1003',

        parentId: 'parent-003',
        parentName: 'Omar Salem',
        parentPhone: '+971 55 111 2222',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 0,
    },
    {
        id: 'subscription-004',
        subscriptionCode: 'SUB-1004',

        studentId: 'student-004',
        studentName: 'Mariam Hassan',
        studentCode: 'STU-1004',

        parentId: 'parent-004',
        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',

        currency: 'AED' as FinanceCurrency,
        balanceDue: 407.5,
    },
];

const defaultFormValues: FinancePaymentFormValues = {
    linkedRecordType: 'invoice',

    invoiceId: 'invoice-002',
    invoiceNumber: 'INV-1002',

    subscriptionId: 'subscription-002',
    subscriptionCode: 'SUB-1002',

    studentId: 'student-002',
    studentName: 'Omar Ahmed',
    studentCode: 'STU-1002',

    parentId: 'parent-002',
    parentName: 'Ahmed Omar',
    parentPhone: '+971 50 222 3333',

    paymentDate: '',
    paymentMethod: 'cash',
    status: 'paid',

    transactionType: 'invoice_payment',

    currency: 'AED',
    amount: '1500',

    referenceNumber: '',
    receivedBy: 'Admin User',

    notes: '',
};

function buildInitialValues(
    initialValues?: Partial<FinancePaymentFormValues>,
): FinancePaymentFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
    };
}

function toNumber(value: string, fallback = 0) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return fallback;
    }

    return parsedValue;
}

function cleanNullableText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : null;
}

function findInvoice(invoiceId: string) {
    return invoiceOptions.find((invoice) => invoice.id === invoiceId);
}

function findSubscription(subscriptionId: string) {
    return subscriptionOptions.find(
        (subscription) => subscription.id === subscriptionId,
    );
}

export default function FinancePaymentForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: FinancePaymentFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<FinancePaymentFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof FinancePaymentFormValues>(
        key: K,
        value: FinancePaymentFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleLinkedRecordTypeChange = (linkedRecordType: LinkedRecordType) => {
        if (linkedRecordType === 'invoice') {
            const selectedInvoice = findInvoice(defaultFormValues.invoiceId);

            if (!selectedInvoice) return;

            setValues((currentValues) => ({
                ...currentValues,
                linkedRecordType,

                invoiceId: selectedInvoice.id,
                invoiceNumber: selectedInvoice.invoiceNumber,

                subscriptionId: selectedInvoice.subscriptionId,
                subscriptionCode: selectedInvoice.subscriptionCode,

                studentId: selectedInvoice.studentId,
                studentName: selectedInvoice.studentName,
                studentCode: selectedInvoice.studentCode,

                parentId: selectedInvoice.parentId,
                parentName: selectedInvoice.parentName,
                parentPhone: selectedInvoice.parentPhone,

                currency: selectedInvoice.currency,
                amount: String(selectedInvoice.balanceDue),

                transactionType: 'invoice_payment',
            }));

            return;
        }

        if (linkedRecordType === 'subscription') {
            const selectedSubscription = findSubscription(
                defaultFormValues.subscriptionId,
            );

            if (!selectedSubscription) return;

            setValues((currentValues) => ({
                ...currentValues,
                linkedRecordType,

                invoiceId: '',
                invoiceNumber: '',

                subscriptionId: selectedSubscription.id,
                subscriptionCode: selectedSubscription.subscriptionCode,

                studentId: selectedSubscription.studentId,
                studentName: selectedSubscription.studentName,
                studentCode: selectedSubscription.studentCode,

                parentId: selectedSubscription.parentId,
                parentName: selectedSubscription.parentName,
                parentPhone: selectedSubscription.parentPhone,

                currency: selectedSubscription.currency,
                amount: String(selectedSubscription.balanceDue),

                transactionType: 'subscription_payment',
            }));

            return;
        }

        setValues((currentValues) => ({
            ...currentValues,
            linkedRecordType,

            invoiceId: '',
            invoiceNumber: '',

            subscriptionId: '',
            subscriptionCode: '',

            transactionType: 'adjustment',
        }));
    };

    const handleInvoiceChange = (invoiceId: string) => {
        const selectedInvoice = findInvoice(invoiceId);

        if (!selectedInvoice) return;

        setValues((currentValues) => ({
            ...currentValues,

            invoiceId: selectedInvoice.id,
            invoiceNumber: selectedInvoice.invoiceNumber,

            subscriptionId: selectedInvoice.subscriptionId,
            subscriptionCode: selectedInvoice.subscriptionCode,

            studentId: selectedInvoice.studentId,
            studentName: selectedInvoice.studentName,
            studentCode: selectedInvoice.studentCode,

            parentId: selectedInvoice.parentId,
            parentName: selectedInvoice.parentName,
            parentPhone: selectedInvoice.parentPhone,

            currency: selectedInvoice.currency,
            amount: String(selectedInvoice.balanceDue),
        }));
    };

    const handleSubscriptionChange = (subscriptionId: string) => {
        const selectedSubscription = findSubscription(subscriptionId);

        if (!selectedSubscription) return;

        setValues((currentValues) => ({
            ...currentValues,

            subscriptionId: selectedSubscription.id,
            subscriptionCode: selectedSubscription.subscriptionCode,

            studentId: selectedSubscription.studentId,
            studentName: selectedSubscription.studentName,
            studentCode: selectedSubscription.studentCode,

            parentId: selectedSubscription.parentId,
            parentName: selectedSubscription.parentName,
            parentPhone: selectedSubscription.parentPhone,

            currency: selectedSubscription.currency,
            amount: String(selectedSubscription.balanceDue),
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: FinancePaymentFormPayload = {
            invoiceId: values.linkedRecordType === 'invoice' ? values.invoiceId : null,
            invoiceNumber:
                values.linkedRecordType === 'invoice' ? values.invoiceNumber : null,

            subscriptionId:
                values.linkedRecordType === 'invoice' ||
                    values.linkedRecordType === 'subscription'
                    ? values.subscriptionId || null
                    : null,
            subscriptionCode:
                values.linkedRecordType === 'invoice' ||
                    values.linkedRecordType === 'subscription'
                    ? values.subscriptionCode || null
                    : null,

            studentId: values.studentId,
            studentName: values.studentName,
            studentCode: values.studentCode,

            parentId: values.parentId,
            parentName: values.parentName,
            parentPhone: values.parentPhone,

            paymentDate: values.paymentDate,
            paymentMethod: values.paymentMethod,
            status: values.status,

            transactionType: values.transactionType,

            currency: values.currency,
            amount: toNumber(values.amount, 0),

            referenceNumber: cleanNullableText(values.referenceNumber),
            receivedBy: cleanNullableText(values.receivedBy),

            notes: cleanNullableText(values.notes),
        };

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-[2rem] border border-brand-yellow/40 bg-brand-yellow/15 p-5 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="text-sm font-black">
                            {mode === 'create'
                                ? t('financePaymentForm.notice.createTitle')
                                : t('financePaymentForm.notice.editTitle')}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === 'create'
                                ? t('financePaymentForm.notice.createDescription')
                                : t('financePaymentForm.notice.editDescription')}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={WalletCards}
                title={t('financePaymentForm.sections.linkedRecord.title')}
                description={t('financePaymentForm.sections.linkedRecord.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('financePaymentForm.fields.linkedRecordType')}
                        value={values.linkedRecordType}
                        onChange={(value) =>
                            handleLinkedRecordTypeChange(value as LinkedRecordType)
                        }
                        options={[
                            {
                                value: 'invoice',
                                label: t('financePaymentForm.linkedRecordType.invoice'),
                            },
                            {
                                value: 'subscription',
                                label: t('financePaymentForm.linkedRecordType.subscription'),
                            },
                            {
                                value: 'none',
                                label: t('financePaymentForm.linkedRecordType.none'),
                            },
                        ]}
                        required
                    />

                    {values.linkedRecordType === 'invoice' ? (
                        <FormSelect
                            label={t('financePaymentForm.fields.invoice')}
                            value={values.invoiceId}
                            onChange={handleInvoiceChange}
                            options={invoiceOptions.map((invoice) => ({
                                value: invoice.id,
                                label: `${invoice.invoiceNumber} - ${invoice.studentName}`,
                            }))}
                            required
                        />
                    ) : null}

                    {values.linkedRecordType === 'subscription' ? (
                        <FormSelect
                            label={t('financePaymentForm.fields.subscription')}
                            value={values.subscriptionId}
                            onChange={handleSubscriptionChange}
                            options={subscriptionOptions.map((subscription) => ({
                                value: subscription.id,
                                label: `${subscription.subscriptionCode} - ${subscription.studentName}`,
                            }))}
                            required
                        />
                    ) : null}
                </div>
            </FormSection>

            <FormSection
                icon={UserRound}
                title={t('financePaymentForm.sections.student.title')}
                description={t('financePaymentForm.sections.student.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t('financePaymentForm.fields.studentName')}
                        value={values.studentName}
                        onChange={(value) => updateValue('studentName', value)}
                        required
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.studentCode')}
                        value={values.studentCode}
                        onChange={(value) => updateValue('studentCode', value)}
                        required
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.parentName')}
                        value={values.parentName}
                        onChange={(value) => updateValue('parentName', value)}
                        required
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.parentPhone')}
                        value={values.parentPhone}
                        onChange={(value) => updateValue('parentPhone', value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={CreditCard}
                title={t('financePaymentForm.sections.payment.title')}
                description={t('financePaymentForm.sections.payment.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormInput
                        label={t('financePaymentForm.fields.paymentDate')}
                        type="date"
                        value={values.paymentDate}
                        onChange={(value) => updateValue('paymentDate', value)}
                        required
                    />

                    <FormSelect
                        label={t('financePaymentForm.fields.paymentMethod')}
                        value={values.paymentMethod}
                        onChange={(value) =>
                            updateValue('paymentMethod', value as FinancePaymentMethod)
                        }
                        options={[
                            { value: 'cash', label: t('financePage.paymentMethod.cash') },
                            { value: 'card', label: t('financePage.paymentMethod.card') },
                            {
                                value: 'bank_transfer',
                                label: t('financePage.paymentMethod.bank_transfer'),
                            },
                            {
                                value: 'online_payment',
                                label: t('financePage.paymentMethod.online_payment'),
                            },
                            { value: 'wallet', label: t('financePage.paymentMethod.wallet') },
                            { value: 'other', label: t('financePage.paymentMethod.other') },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('financePaymentForm.fields.status')}
                        value={values.status}
                        onChange={(value) =>
                            updateValue('status', value as FinancePaymentStatus)
                        }
                        options={[
                            { value: 'paid', label: t('financePage.paymentStatus.paid') },
                            {
                                value: 'pending',
                                label: t('financePage.paymentStatus.pending'),
                            },
                            {
                                value: 'overdue',
                                label: t('financePage.paymentStatus.overdue'),
                            },
                            { value: 'failed', label: t('financePage.paymentStatus.failed') },
                            {
                                value: 'refunded',
                                label: t('financePage.paymentStatus.refunded'),
                            },
                            {
                                value: 'cancelled',
                                label: t('financePage.paymentStatus.cancelled'),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('financePaymentForm.fields.transactionType')}
                        value={values.transactionType}
                        onChange={(value) =>
                            updateValue('transactionType', value as FinanceTransactionType)
                        }
                        options={[
                            {
                                value: 'subscription_payment',
                                label: t(
                                    'financePaymentDetailsPage.transactionType.subscription_payment',
                                ),
                            },
                            {
                                value: 'invoice_payment',
                                label: t('financePaymentDetailsPage.transactionType.invoice_payment'),
                            },
                            {
                                value: 'refund',
                                label: t('financePaymentDetailsPage.transactionType.refund'),
                            },
                            {
                                value: 'adjustment',
                                label: t('financePaymentDetailsPage.transactionType.adjustment'),
                            },
                            {
                                value: 'discount',
                                label: t('financePaymentDetailsPage.transactionType.discount'),
                            },
                            {
                                value: 'late_fee',
                                label: t('financePaymentDetailsPage.transactionType.late_fee'),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={BadgeDollarSign}
                title={t('financePaymentForm.sections.amounts.title')}
                description={t('financePaymentForm.sections.amounts.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormSelect
                        label={t('financePaymentForm.fields.currency')}
                        value={values.currency}
                        onChange={(value) => updateValue('currency', value as FinanceCurrency)}
                        options={[
                            { value: 'AED', label: 'AED' },
                            { value: 'USD', label: 'USD' },
                            { value: 'EGP', label: 'EGP' },
                            { value: 'SAR', label: 'SAR' },
                        ]}
                        required
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.amount')}
                        type="number"
                        value={values.amount}
                        onChange={(value) => updateValue('amount', value)}
                        required
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.referenceNumber')}
                        value={values.referenceNumber}
                        onChange={(value) => updateValue('referenceNumber', value)}
                    />

                    <FormInput
                        label={t('financePaymentForm.fields.receivedBy')}
                        value={values.receivedBy}
                        onChange={(value) => updateValue('receivedBy', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Receipt}
                title={t('financePaymentForm.sections.summary.title')}
                description={t('financePaymentForm.sections.summary.description')}
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <AmountPreview
                        label={t('financePaymentForm.preview.linkedInvoice')}
                        value={
                            values.invoiceNumber ||
                            t('financePaymentForm.preview.notLinked')
                        }
                    />

                    <AmountPreview
                        label={t('financePaymentForm.preview.linkedSubscription')}
                        value={
                            values.subscriptionCode ||
                            t('financePaymentForm.preview.notLinked')
                        }
                    />

                    <AmountPreview
                        label={t('financePaymentForm.preview.amount')}
                        value={`${values.amount || 0} ${values.currency}`}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t('financePaymentForm.sections.notes.title')}
                description={t('financePaymentForm.sections.notes.description')}
            >
                <FormTextarea
                    label={t('financePaymentForm.fields.notes')}
                    value={values.notes}
                    onChange={(value) => updateValue('notes', value)}
                    placeholder={t('financePaymentForm.placeholders.notes')}
                />
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t('financePaymentForm.submit.title')}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('financePaymentForm.submit.description')}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-4 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        {isSubmitting ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <ShieldCheck className="h-4 w-4" />
                        )}

                        {isSubmitting ? t('financePaymentForm.submit.saving') : submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}

interface FormSectionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: ReactNode;
}

function FormSection({
    icon: Icon,
    title,
    description,
    children,
}: FormSectionProps) {
    return (
        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start gap-4">
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

function AmountPreview({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-black text-brand-blue dark:text-white">
                {value}
            </p>
        </div>
    );
}

interface FormInputProps {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    onChange: (value: string) => void;
}

function FormInput({
    label,
    value,
    type = 'text',
    placeholder,
    required = false,
    onChange,
}: FormInputProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>

            <input
                type={type}
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
            />
        </label>
    );
}

interface FormSelectProps {
    label: string;
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    required?: boolean;
    onChange: (value: string) => void;
}

function FormSelect({
    label,
    value,
    options,
    required = false,
    onChange,
}: FormSelectProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>

            <select
                value={value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
            >
                {options.map((option) => (
                    <option key={option.value || option.label} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

interface FormTextareaProps {
    label: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (value: string) => void;
}

function FormTextarea({
    label,
    value,
    placeholder,
    required = false,
    onChange,
}: FormTextareaProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>

            <textarea
                rows={5}
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
            />
        </label>
    );
}