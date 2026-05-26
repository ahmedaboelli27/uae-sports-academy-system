import type { LucideIcon } from 'lucide-react';
import {
    AlertCircle,
    BadgeDollarSign,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Trophy,
    UserRound,
    Users,
    WalletCards
} from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    CreateSubscriptionRequestDto,
    FinanceCurrency,
    FinanceDiscountType,
    FinanceSubscriptionPlan,
    FinanceSubscriptionStatus,
} from '../types/finance.dto';

export interface FinanceSubscriptionFormPayload
    extends CreateSubscriptionRequestDto { }

type FinanceSubscriptionFormMode = 'create' | 'edit';

interface FinanceSubscriptionFormValues {
    studentId: string;
    studentName: string;
    studentCode: string;

    parentId: string;
    parentName: string;
    parentPhone: string;

    programId: string;
    programName: string;

    branchId: string;
    branchName: string;

    plan: FinanceSubscriptionPlan;
    status: FinanceSubscriptionStatus;

    startDate: string;
    endDate: string;

    sessionsIncluded: string;
    sessionsUsed: string;

    currency: FinanceCurrency;

    baseAmount: string;
    discountType: FinanceDiscountType;
    discountValue: string;

    paidAmount: string;
    nextPaymentDueDate: string;

    notes: string;
}

interface FinanceSubscriptionFormProps {
    mode: FinanceSubscriptionFormMode;
    initialValues?: Partial<FinanceSubscriptionFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: FinanceSubscriptionFormPayload) => void | Promise<void>;
}

const studentOptions = [
    {
        id: 'student-001',
        studentCode: 'STU-1001',
        name: 'Mohammed Khaled',
        parentId: 'parent-001',
        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',
    },
    {
        id: 'student-002',
        studentCode: 'STU-1002',
        name: 'Omar Ahmed',
        parentId: 'parent-002',
        parentName: 'Ahmed Omar',
        parentPhone: '+971 50 222 3333',
    },
    {
        id: 'student-003',
        studentCode: 'STU-1003',
        name: 'Layan Omar',
        parentId: 'parent-003',
        parentName: 'Omar Salem',
        parentPhone: '+971 55 111 2222',
    },
    {
        id: 'student-004',
        studentCode: 'STU-1004',
        name: 'Mariam Hassan',
        parentId: 'parent-004',
        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',
    },
];

const programOptions = [
    {
        id: 'program-001',
        name: 'Football Academy',
    },
    {
        id: 'program-002',
        name: 'Swimming Program',
    },
    {
        id: 'program-003',
        name: 'Basketball Training',
    },
    {
        id: 'program-004',
        name: 'Multi-Sport Program',
    },
];

const branchOptions = [
    {
        id: 'branch-dubai',
        name: 'Dubai Branch',
    },
    {
        id: 'branch-abudhabi',
        name: 'Abu Dhabi Branch',
    },
    {
        id: 'branch-sharjah',
        name: 'Sharjah Branch',
    },
];

const defaultFormValues: FinanceSubscriptionFormValues = {
    studentId: 'student-001',
    studentName: 'Mohammed Khaled',
    studentCode: 'STU-1001',

    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',

    programId: 'program-001',
    programName: 'Football Academy',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    plan: 'monthly',
    status: 'pending',

    startDate: '',
    endDate: '',

    sessionsIncluded: '12',
    sessionsUsed: '0',

    currency: 'AED',

    baseAmount: '1200',
    discountType: 'none',
    discountValue: '0',

    paidAmount: '0',
    nextPaymentDueDate: '',

    notes: '',
};

function buildInitialValues(
    initialValues?: Partial<FinanceSubscriptionFormValues>,
): FinanceSubscriptionFormValues {
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

function cleanOptionalText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function cleanOptionalNullableText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : null;
}

function findStudent(studentId: string) {
    return studentOptions.find((student) => student.id === studentId);
}

function findProgram(programId: string) {
    return programOptions.find((program) => program.id === programId);
}

function findBranch(branchId: string) {
    return branchOptions.find((branch) => branch.id === branchId);
}

export default function FinanceSubscriptionForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: FinanceSubscriptionFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<FinanceSubscriptionFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof FinanceSubscriptionFormValues>(
        key: K,
        value: FinanceSubscriptionFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleStudentChange = (studentId: string) => {
        const selectedStudent = findStudent(studentId);

        setValues((currentValues) => ({
            ...currentValues,
            studentId,
            studentName: selectedStudent?.name ?? currentValues.studentName,
            studentCode: selectedStudent?.studentCode ?? currentValues.studentCode,
            parentId: selectedStudent?.parentId ?? currentValues.parentId,
            parentName: selectedStudent?.parentName ?? currentValues.parentName,
            parentPhone: selectedStudent?.parentPhone ?? currentValues.parentPhone,
        }));
    };

    const handleProgramChange = (programId: string) => {
        const selectedProgram = findProgram(programId);

        setValues((currentValues) => ({
            ...currentValues,
            programId,
            programName: selectedProgram?.name ?? currentValues.programName,
        }));
    };

    const handleBranchChange = (branchId: string) => {
        const selectedBranch = findBranch(branchId);

        setValues((currentValues) => ({
            ...currentValues,
            branchId,
            branchName: selectedBranch?.name ?? currentValues.branchName,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const selectedStudent = findStudent(values.studentId);
        const selectedProgram = findProgram(values.programId);
        const selectedBranch = findBranch(values.branchId);

        const payload: FinanceSubscriptionFormPayload = {
            studentId: values.studentId,
            studentName: selectedStudent?.name ?? values.studentName,
            studentCode: selectedStudent?.studentCode ?? values.studentCode,

            parentId: selectedStudent?.parentId ?? values.parentId,
            parentName: selectedStudent?.parentName ?? values.parentName,
            parentPhone: selectedStudent?.parentPhone ?? values.parentPhone,

            programId: values.programId,
            programName: selectedProgram?.name ?? values.programName,

            branchId: values.branchId,
            branchName: selectedBranch?.name ?? values.branchName,

            plan: values.plan,
            status: values.status,

            startDate: values.startDate,
            endDate: values.endDate,

            sessionsIncluded: toNumber(values.sessionsIncluded, 0),
            sessionsUsed: toNumber(values.sessionsUsed, 0),

            currency: values.currency,

            baseAmount: toNumber(values.baseAmount, 0),
            discountType: values.discountType,
            discountValue: toNumber(values.discountValue, 0),

            paidAmount: toNumber(values.paidAmount, 0),
            nextPaymentDueDate: cleanOptionalNullableText(values.nextPaymentDueDate),

            notes: cleanOptionalText(values.notes),
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
                                ? t('financeSubscriptionForm.notice.createTitle')
                                : t('financeSubscriptionForm.notice.editTitle')}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === 'create'
                                ? t('financeSubscriptionForm.notice.createDescription')
                                : t('financeSubscriptionForm.notice.editDescription')}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={UserRound}
                title={t('financeSubscriptionForm.sections.student.title')}
                description={t('financeSubscriptionForm.sections.student.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('financeSubscriptionForm.fields.student')}
                        value={values.studentId}
                        onChange={handleStudentChange}
                        options={studentOptions.map((student) => ({
                            value: student.id,
                            label: `${student.name} - ${student.studentCode}`,
                        }))}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.parentName')}
                        value={values.parentName}
                        onChange={(value) => updateValue('parentName', value)}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.parentPhone')}
                        value={values.parentPhone}
                        onChange={(value) => updateValue('parentPhone', value)}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.studentCode')}
                        value={values.studentCode}
                        onChange={(value) => updateValue('studentCode', value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Trophy}
                title={t('financeSubscriptionForm.sections.assignment.title')}
                description={t('financeSubscriptionForm.sections.assignment.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('financeSubscriptionForm.fields.program')}
                        value={values.programId}
                        onChange={handleProgramChange}
                        options={programOptions.map((program) => ({
                            value: program.id,
                            label: program.name,
                        }))}
                        required
                    />

                    <FormSelect
                        label={t('financeSubscriptionForm.fields.branch')}
                        value={values.branchId}
                        onChange={handleBranchChange}
                        options={branchOptions.map((branch) => ({
                            value: branch.id,
                            label: branch.name,
                        }))}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={WalletCards}
                title={t('financeSubscriptionForm.sections.subscription.title')}
                description={t(
                    'financeSubscriptionForm.sections.subscription.description',
                )}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormSelect
                        label={t('financeSubscriptionForm.fields.plan')}
                        value={values.plan}
                        onChange={(value) =>
                            updateValue('plan', value as FinanceSubscriptionPlan)
                        }
                        options={[
                            { value: 'monthly', label: t('financePage.plan.monthly') },
                            { value: 'quarterly', label: t('financePage.plan.quarterly') },
                            {
                                value: 'semi_annual',
                                label: t('financePage.plan.semi_annual'),
                            },
                            { value: 'annual', label: t('financePage.plan.annual') },
                            { value: 'custom', label: t('financePage.plan.custom') },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('financeSubscriptionForm.fields.status')}
                        value={values.status}
                        onChange={(value) =>
                            updateValue('status', value as FinanceSubscriptionStatus)
                        }
                        options={[
                            {
                                value: 'active',
                                label: t('financePage.subscriptionStatus.active'),
                            },
                            {
                                value: 'pending',
                                label: t('financePage.subscriptionStatus.pending'),
                            },
                            {
                                value: 'expired',
                                label: t('financePage.subscriptionStatus.expired'),
                            },
                            {
                                value: 'cancelled',
                                label: t('financePage.subscriptionStatus.cancelled'),
                            },
                            {
                                value: 'paused',
                                label: t('financePage.subscriptionStatus.paused'),
                            },
                        ]}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.startDate')}
                        type="date"
                        value={values.startDate}
                        onChange={(value) => updateValue('startDate', value)}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.endDate')}
                        type="date"
                        value={values.endDate}
                        onChange={(value) => updateValue('endDate', value)}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.nextPaymentDueDate')}
                        type="date"
                        value={values.nextPaymentDueDate}
                        onChange={(value) => updateValue('nextPaymentDueDate', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Users}
                title={t('financeSubscriptionForm.sections.sessions.title')}
                description={t('financeSubscriptionForm.sections.sessions.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t('financeSubscriptionForm.fields.sessionsIncluded')}
                        type="number"
                        value={values.sessionsIncluded}
                        onChange={(value) => updateValue('sessionsIncluded', value)}
                        required
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.sessionsUsed')}
                        type="number"
                        value={values.sessionsUsed}
                        onChange={(value) => updateValue('sessionsUsed', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={BadgeDollarSign}
                title={t('financeSubscriptionForm.sections.amounts.title')}
                description={t('financeSubscriptionForm.sections.amounts.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormSelect
                        label={t('financeSubscriptionForm.fields.currency')}
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
                        label={t('financeSubscriptionForm.fields.baseAmount')}
                        type="number"
                        value={values.baseAmount}
                        onChange={(value) => updateValue('baseAmount', value)}
                        required
                    />

                    <FormSelect
                        label={t('financeSubscriptionForm.fields.discountType')}
                        value={values.discountType}
                        onChange={(value) =>
                            updateValue('discountType', value as FinanceDiscountType)
                        }
                        options={[
                            {
                                value: 'none',
                                label: t('financeSubscriptionForm.discountType.none'),
                            },
                            {
                                value: 'percentage',
                                label: t('financeSubscriptionForm.discountType.percentage'),
                            },
                            {
                                value: 'fixed_amount',
                                label: t('financeSubscriptionForm.discountType.fixed_amount'),
                            },
                        ]}
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.discountValue')}
                        type="number"
                        value={values.discountValue}
                        onChange={(value) => updateValue('discountValue', value)}
                    />

                    <FormInput
                        label={t('financeSubscriptionForm.fields.paidAmount')}
                        type="number"
                        value={values.paidAmount}
                        onChange={(value) => updateValue('paidAmount', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t('financeSubscriptionForm.sections.notes.title')}
                description={t('financeSubscriptionForm.sections.notes.description')}
            >
                <FormTextarea
                    label={t('financeSubscriptionForm.fields.notes')}
                    value={values.notes}
                    onChange={(value) => updateValue('notes', value)}
                    placeholder={t('financeSubscriptionForm.placeholders.notes')}
                />
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t('financeSubscriptionForm.submit.title')}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('financeSubscriptionForm.submit.description')}
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

                        {isSubmitting
                            ? t('financeSubscriptionForm.submit.saving')
                            : submitLabel}
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