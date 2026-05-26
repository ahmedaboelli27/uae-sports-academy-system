import type { LucideIcon } from 'lucide-react';
import {
    AlertCircle,
    BadgeDollarSign,
    CalendarDays,
    CheckCircle2,
    FileText,
    PlusCircle,
    Receipt,
    ShieldCheck,
    Trash2,
    UserRound,
    WalletCards,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    CreateInvoiceRequestDto,
    FinanceCurrency,
    FinanceInvoiceLineItemDto,
    FinanceInvoiceStatus,
} from '../types/finance.dto';

export interface FinanceInvoiceFormPayload extends CreateInvoiceRequestDto { }

type FinanceInvoiceFormMode = 'create' | 'edit';

interface FinanceInvoiceFormLineItem {
    id: string;
    description: string;
    quantity: string;
    unitPrice: string;
    discountAmount: string;
    taxAmount: string;
}

interface FinanceInvoiceFormValues {
    subscriptionId: string;
    subscriptionCode: string;

    studentId: string;
    studentName: string;
    studentCode: string;

    parentId: string;
    parentName: string;
    parentPhone: string;

    issueDate: string;
    dueDate: string;

    status: FinanceInvoiceStatus;
    currency: FinanceCurrency;

    discountAmount: string;
    taxAmount: string;
    paidAmount: string;

    notes: string;
    terms: string;

    lineItems: FinanceInvoiceFormLineItem[];
}

interface FinanceInvoiceFormProps {
    mode: FinanceInvoiceFormMode;
    initialValues?: Partial<FinanceInvoiceFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: FinanceInvoiceFormPayload) => void | Promise<void>;
}

const subscriptionOptions = [
    {
        id: 'subscription-001',
        code: 'SUB-1001',
        studentId: 'student-001',
        studentName: 'Mohammed Khaled',
        studentCode: 'STU-1001',
        parentId: 'parent-001',
        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',
        description: 'Football Academy - Monthly Subscription',
        amount: 1200,
    },
    {
        id: 'subscription-002',
        code: 'SUB-1002',
        studentId: 'student-002',
        studentName: 'Omar Ahmed',
        studentCode: 'STU-1002',
        parentId: 'parent-002',
        parentName: 'Ahmed Omar',
        parentPhone: '+971 50 222 3333',
        description: 'Football Academy - Quarterly Subscription',
        amount: 3300,
    },
    {
        id: 'subscription-003',
        code: 'SUB-1003',
        studentId: 'student-003',
        studentName: 'Layan Omar',
        studentCode: 'STU-1003',
        parentId: 'parent-003',
        parentName: 'Omar Salem',
        parentPhone: '+971 55 111 2222',
        description: 'Swimming Program - Monthly Subscription',
        amount: 950,
    },
    {
        id: 'subscription-004',
        code: 'SUB-1004',
        studentId: 'student-004',
        studentName: 'Mariam Hassan',
        studentCode: 'STU-1004',
        parentId: 'parent-004',
        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',
        description: 'Basketball Training - Monthly Subscription',
        amount: 850,
    },
];

const defaultFormValues: FinanceInvoiceFormValues = {
    subscriptionId: 'subscription-001',
    subscriptionCode: 'SUB-1001',

    studentId: 'student-001',
    studentName: 'Mohammed Khaled',
    studentCode: 'STU-1001',

    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',

    issueDate: '',
    dueDate: '',

    status: 'issued',
    currency: 'AED',

    discountAmount: '0',
    taxAmount: '0',
    paidAmount: '0',

    notes: '',
    terms: 'Payment should be completed before the due date.',

    lineItems: [
        {
            id: 'line-temp-001',
            description: 'Football Academy - Monthly Subscription',
            quantity: '1',
            unitPrice: '1200',
            discountAmount: '0',
            taxAmount: '0',
        },
    ],
};

function buildInitialValues(
    initialValues?: Partial<FinanceInvoiceFormValues>,
): FinanceInvoiceFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
        lineItems:
            initialValues?.lineItems && initialValues.lineItems.length > 0
                ? initialValues.lineItems
                : defaultFormValues.lineItems,
    };
}

function toNumber(value: string, fallback = 0) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return fallback;
    }

    return parsedValue;
}

function cleanOptionalNullableText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function createLineItemId() {
    return `line-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function calculateLineTotal(item: FinanceInvoiceFormLineItem) {
    const quantity = toNumber(item.quantity, 0);
    const unitPrice = toNumber(item.unitPrice, 0);
    const discountAmount = toNumber(item.discountAmount, 0);
    const taxAmount = toNumber(item.taxAmount, 0);

    return Number((quantity * unitPrice - discountAmount + taxAmount).toFixed(2));
}

function findSubscription(subscriptionId: string) {
    return subscriptionOptions.find((subscription) => subscription.id === subscriptionId);
}

export default function FinanceInvoiceForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: FinanceInvoiceFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<FinanceInvoiceFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const totals = useMemo(() => {
        const subtotal = values.lineItems.reduce((total, item) => {
            return total + toNumber(item.quantity, 0) * toNumber(item.unitPrice, 0);
        }, 0);

        const lineDiscounts = values.lineItems.reduce((total, item) => {
            return total + toNumber(item.discountAmount, 0);
        }, 0);

        const lineTaxes = values.lineItems.reduce((total, item) => {
            return total + toNumber(item.taxAmount, 0);
        }, 0);

        const formDiscount = toNumber(values.discountAmount, 0);
        const formTax = toNumber(values.taxAmount, 0);
        const paidAmount = toNumber(values.paidAmount, 0);

        const totalAmount = Number(
            (subtotal - lineDiscounts - formDiscount + lineTaxes + formTax).toFixed(2),
        );

        const balanceDue = Number(Math.max(totalAmount - paidAmount, 0).toFixed(2));

        return {
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number((lineDiscounts + formDiscount).toFixed(2)),
            tax: Number((lineTaxes + formTax).toFixed(2)),
            totalAmount,
            paidAmount,
            balanceDue,
        };
    }, [values]);

    const updateValue = <K extends keyof FinanceInvoiceFormValues>(
        key: K,
        value: FinanceInvoiceFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubscriptionChange = (subscriptionId: string) => {
        const selectedSubscription = findSubscription(subscriptionId);

        if (!selectedSubscription) return;

        setValues((currentValues) => ({
            ...currentValues,

            subscriptionId: selectedSubscription.id,
            subscriptionCode: selectedSubscription.code,

            studentId: selectedSubscription.studentId,
            studentName: selectedSubscription.studentName,
            studentCode: selectedSubscription.studentCode,

            parentId: selectedSubscription.parentId,
            parentName: selectedSubscription.parentName,
            parentPhone: selectedSubscription.parentPhone,

            lineItems:
                currentValues.lineItems.length === 1
                    ? [
                        {
                            ...currentValues.lineItems[0],
                            description: selectedSubscription.description,
                            unitPrice: String(selectedSubscription.amount),
                        },
                    ]
                    : currentValues.lineItems,
        }));
    };

    const updateLineItem = <K extends keyof FinanceInvoiceFormLineItem>(
        lineItemId: string,
        key: K,
        value: FinanceInvoiceFormLineItem[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            lineItems: currentValues.lineItems.map((item) =>
                item.id === lineItemId
                    ? {
                        ...item,
                        [key]: value,
                    }
                    : item,
            ),
        }));
    };

    const addLineItem = () => {
        setValues((currentValues) => ({
            ...currentValues,
            lineItems: [
                ...currentValues.lineItems,
                {
                    id: createLineItemId(),
                    description: '',
                    quantity: '1',
                    unitPrice: '0',
                    discountAmount: '0',
                    taxAmount: '0',
                },
            ],
        }));
    };

    const removeLineItem = (lineItemId: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            lineItems:
                currentValues.lineItems.length > 1
                    ? currentValues.lineItems.filter((item) => item.id !== lineItemId)
                    : currentValues.lineItems,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const lineItems: FinanceInvoiceLineItemDto[] = values.lineItems.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: toNumber(item.quantity, 1),
            unitPrice: toNumber(item.unitPrice, 0),
            discountAmount: toNumber(item.discountAmount, 0),
            taxAmount: toNumber(item.taxAmount, 0),
            totalAmount: calculateLineTotal(item),
        }));

        const payload: FinanceInvoiceFormPayload = {
            subscriptionId: values.subscriptionId || null,
            subscriptionCode: values.subscriptionCode || null,

            studentId: values.studentId,
            studentName: values.studentName,
            studentCode: values.studentCode,

            parentId: values.parentId,
            parentName: values.parentName,
            parentPhone: values.parentPhone,

            issueDate: values.issueDate,
            dueDate: values.dueDate,

            status: values.status,

            currency: values.currency,

            lineItems,

            discountAmount: toNumber(values.discountAmount, 0),
            taxAmount: toNumber(values.taxAmount, 0),
            paidAmount: toNumber(values.paidAmount, 0),

            notes: cleanOptionalNullableText(values.notes),
            terms: cleanOptionalNullableText(values.terms),
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
                                ? t('financeInvoiceForm.notice.createTitle')
                                : t('financeInvoiceForm.notice.editTitle')}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === 'create'
                                ? t('financeInvoiceForm.notice.createDescription')
                                : t('financeInvoiceForm.notice.editDescription')}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={WalletCards}
                title={t('financeInvoiceForm.sections.subscription.title')}
                description={t('financeInvoiceForm.sections.subscription.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('financeInvoiceForm.fields.subscription')}
                        value={values.subscriptionId}
                        onChange={handleSubscriptionChange}
                        options={subscriptionOptions.map((subscription) => ({
                            value: subscription.id,
                            label: `${subscription.code} - ${subscription.studentName}`,
                        }))}
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.subscriptionCode')}
                        value={values.subscriptionCode}
                        onChange={(value) => updateValue('subscriptionCode', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={UserRound}
                title={t('financeInvoiceForm.sections.student.title')}
                description={t('financeInvoiceForm.sections.student.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t('financeInvoiceForm.fields.studentName')}
                        value={values.studentName}
                        onChange={(value) => updateValue('studentName', value)}
                        required
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.studentCode')}
                        value={values.studentCode}
                        onChange={(value) => updateValue('studentCode', value)}
                        required
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.parentName')}
                        value={values.parentName}
                        onChange={(value) => updateValue('parentName', value)}
                        required
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.parentPhone')}
                        value={values.parentPhone}
                        onChange={(value) => updateValue('parentPhone', value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={CalendarDays}
                title={t('financeInvoiceForm.sections.invoice.title')}
                description={t('financeInvoiceForm.sections.invoice.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormInput
                        label={t('financeInvoiceForm.fields.issueDate')}
                        type="date"
                        value={values.issueDate}
                        onChange={(value) => updateValue('issueDate', value)}
                        required
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.dueDate')}
                        type="date"
                        value={values.dueDate}
                        onChange={(value) => updateValue('dueDate', value)}
                        required
                    />

                    <FormSelect
                        label={t('financeInvoiceForm.fields.status')}
                        value={values.status}
                        onChange={(value) => updateValue('status', value as FinanceInvoiceStatus)}
                        options={[
                            { value: 'draft', label: t('financePage.invoiceStatus.draft') },
                            { value: 'issued', label: t('financePage.invoiceStatus.issued') },
                            { value: 'paid', label: t('financePage.invoiceStatus.paid') },
                            {
                                value: 'partially_paid',
                                label: t('financePage.invoiceStatus.partially_paid'),
                            },
                            { value: 'overdue', label: t('financePage.invoiceStatus.overdue') },
                            {
                                value: 'cancelled',
                                label: t('financePage.invoiceStatus.cancelled'),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('financeInvoiceForm.fields.currency')}
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
                </div>
            </FormSection>

            <FormSection
                icon={Receipt}
                title={t('financeInvoiceForm.sections.lineItems.title')}
                description={t('financeInvoiceForm.sections.lineItems.description')}
            >
                <div className="space-y-4">
                    {values.lineItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="rounded-[2rem] border border-border bg-background p-5"
                        >
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <h3 className="text-base font-black">
                                    {t('financeInvoiceForm.lineItem.title', {
                                        number: index + 1,
                                    })}
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => removeLineItem(item.id)}
                                    disabled={values.lineItems.length <= 1}
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-black transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t('financeInvoiceForm.lineItem.remove')}
                                </button>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
                                <div className="lg:col-span-2">
                                    <FormInput
                                        label={t('financeInvoiceForm.fields.description')}
                                        value={item.description}
                                        onChange={(value) =>
                                            updateLineItem(item.id, 'description', value)
                                        }
                                        required
                                    />
                                </div>

                                <FormInput
                                    label={t('financeInvoiceForm.fields.quantity')}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(value) => updateLineItem(item.id, 'quantity', value)}
                                    required
                                />

                                <FormInput
                                    label={t('financeInvoiceForm.fields.unitPrice')}
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(value) => updateLineItem(item.id, 'unitPrice', value)}
                                    required
                                />

                                <FormInput
                                    label={t('financeInvoiceForm.fields.lineDiscount')}
                                    type="number"
                                    value={item.discountAmount}
                                    onChange={(value) =>
                                        updateLineItem(item.id, 'discountAmount', value)
                                    }
                                />

                                <FormInput
                                    label={t('financeInvoiceForm.fields.lineTax')}
                                    type="number"
                                    value={item.taxAmount}
                                    onChange={(value) => updateLineItem(item.id, 'taxAmount', value)}
                                />
                            </div>

                            <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm font-black">
                                {t('financeInvoiceForm.lineItem.total')}: {calculateLineTotal(item)}{' '}
                                {values.currency}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addLineItem}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
                    >
                        <PlusCircle className="h-4 w-4" />
                        {t('financeInvoiceForm.lineItem.add')}
                    </button>
                </div>
            </FormSection>

            <FormSection
                icon={BadgeDollarSign}
                title={t('financeInvoiceForm.sections.amounts.title')}
                description={t('financeInvoiceForm.sections.amounts.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <FormInput
                        label={t('financeInvoiceForm.fields.discountAmount')}
                        type="number"
                        value={values.discountAmount}
                        onChange={(value) => updateValue('discountAmount', value)}
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.taxAmount')}
                        type="number"
                        value={values.taxAmount}
                        onChange={(value) => updateValue('taxAmount', value)}
                    />

                    <FormInput
                        label={t('financeInvoiceForm.fields.paidAmount')}
                        type="number"
                        value={values.paidAmount}
                        onChange={(value) => updateValue('paidAmount', value)}
                    />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <AmountPreview
                        label={t('financeInvoiceForm.preview.subtotal')}
                        value={`${totals.subtotal} ${values.currency}`}
                    />

                    <AmountPreview
                        label={t('financeInvoiceForm.preview.discount')}
                        value={`${totals.discount} ${values.currency}`}
                    />

                    <AmountPreview
                        label={t('financeInvoiceForm.preview.tax')}
                        value={`${totals.tax} ${values.currency}`}
                    />

                    <AmountPreview
                        label={t('financeInvoiceForm.preview.totalAmount')}
                        value={`${totals.totalAmount} ${values.currency}`}
                    />

                    <AmountPreview
                        label={t('financeInvoiceForm.preview.balanceDue')}
                        value={`${totals.balanceDue} ${values.currency}`}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t('financeInvoiceForm.sections.notes.title')}
                description={t('financeInvoiceForm.sections.notes.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t('financeInvoiceForm.fields.notes')}
                        value={values.notes}
                        onChange={(value) => updateValue('notes', value)}
                        placeholder={t('financeInvoiceForm.placeholders.notes')}
                    />

                    <FormTextarea
                        label={t('financeInvoiceForm.fields.terms')}
                        value={values.terms}
                        onChange={(value) => updateValue('terms', value)}
                        placeholder={t('financeInvoiceForm.placeholders.terms')}
                    />
                </div>
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t('financeInvoiceForm.submit.title')}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('financeInvoiceForm.submit.description')}
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

                        {isSubmitting ? t('financeInvoiceForm.submit.saving') : submitLabel}
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