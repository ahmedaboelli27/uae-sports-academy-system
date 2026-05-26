import type { LucideIcon } from "lucide-react";
import {
    AlertCircle,
    CheckCircle2,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
    Users,
} from "lucide-react";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type {
    CreateParentRequestDto,
    ParentContactPreference,
    ParentStatus,
} from "../types/parents.dto";

type ParentFormMode = "create" | "edit";

interface ParentFormValues {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    status: ParentStatus;
    preferredContactMethod: ParentContactPreference;
    address: string;
    notes: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

interface ParentFormProps {
    mode: ParentFormMode;
    initialValues?: Partial<ParentFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateParentRequestDto) => void | Promise<void>;
}

interface SelectOption {
    value: string;
    labelKey: string;
}

const defaultFormValues: ParentFormValues = {
    fullName: "",
    phone: "",
    email: "",
    city: "",
    status: "active",
    preferredContactMethod: "whatsapp",
    address: "",
    notes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
};

const cityOptions: SelectOption[] = [
    {
        value: "Dubai",
        labelKey: "parentForm.options.cities.dubai",
    },
    {
        value: "Abu Dhabi",
        labelKey: "parentForm.options.cities.abuDhabi",
    },
    {
        value: "Sharjah",
        labelKey: "parentForm.options.cities.sharjah",
    },
    {
        value: "Ajman",
        labelKey: "parentForm.options.cities.ajman",
    },
];

function buildInitialValues(
    initialValues?: Partial<ParentFormValues>,
): ParentFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
    };
}

function cleanOptionalText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

export default function ParentForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: ParentFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<ParentFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof ParentFormValues>(
        key: K,
        value: ParentFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: CreateParentRequestDto = {
            fullName: values.fullName.trim(),
            phone: values.phone.trim(),
            email: values.email.trim(),
            city: values.city,
            status: values.status,
            preferredContactMethod: values.preferredContactMethod,
            address: cleanOptionalText(values.address),
            notes: cleanOptionalText(values.notes),
            emergencyContactName: cleanOptionalText(values.emergencyContactName),
            emergencyContactPhone: cleanOptionalText(values.emergencyContactPhone),
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
                            {mode === "create"
                                ? t("parentForm.notice.createTitle")
                                : t("parentForm.notice.editTitle")}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === "create"
                                ? t("parentForm.notice.createDescription")
                                : t("parentForm.notice.editDescription")}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={UserRound}
                title={t("parentForm.sections.parent.title")}
                description={t("parentForm.sections.parent.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("parentForm.fields.fullName")}
                        value={values.fullName}
                        onChange={(value) => updateValue("fullName", value)}
                        placeholder={t("parentForm.placeholders.fullName")}
                        required
                    />

                    <FormInput
                        label={t("parentForm.fields.phone")}
                        type="tel"
                        value={values.phone}
                        onChange={(value) => updateValue("phone", value)}
                        placeholder="+971 50 000 0000"
                        required
                    />

                    <FormInput
                        label={t("parentForm.fields.email")}
                        type="email"
                        value={values.email}
                        onChange={(value) => updateValue("email", value)}
                        placeholder="parent@example.com"
                        required
                    />

                    <FormSelect
                        label={t("parentForm.fields.city")}
                        value={values.city}
                        onChange={(value) => updateValue("city", value)}
                        options={[
                            {
                                value: "",
                                label: t("parentForm.placeholders.selectCity"),
                            },
                            ...cityOptions.map((option) => ({
                                value: option.value,
                                label: t(option.labelKey),
                            })),
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Phone}
                title={t("parentForm.sections.communication.title")}
                description={t("parentForm.sections.communication.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t("parentForm.fields.preferredContactMethod")}
                        value={values.preferredContactMethod}
                        onChange={(value) =>
                            updateValue(
                                "preferredContactMethod",
                                value as ParentContactPreference,
                            )
                        }
                        options={[
                            {
                                value: "phone",
                                label: t("parentForm.options.contact.phone"),
                            },
                            {
                                value: "whatsapp",
                                label: t("parentForm.options.contact.whatsapp"),
                            },
                            {
                                value: "email",
                                label: t("parentForm.options.contact.email"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("parentForm.fields.status")}
                        value={values.status}
                        onChange={(value) => updateValue("status", value as ParentStatus)}
                        options={[
                            {
                                value: "active",
                                label: t("parentForm.options.status.active"),
                            },
                            {
                                value: "inactive",
                                label: t("parentForm.options.status.inactive"),
                            },
                            {
                                value: "blocked",
                                label: t("parentForm.options.status.blocked"),
                            },
                            {
                                value: "archived",
                                label: t("parentForm.options.status.archived"),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={MapPin}
                title={t("parentForm.sections.address.title")}
                description={t("parentForm.sections.address.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t("parentForm.fields.address")}
                        value={values.address}
                        onChange={(value) => updateValue("address", value)}
                        placeholder={t("parentForm.placeholders.address")}
                    />

                    <FormTextarea
                        label={t("parentForm.fields.notes")}
                        value={values.notes}
                        onChange={(value) => updateValue("notes", value)}
                        placeholder={t("parentForm.placeholders.notes")}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Users}
                title={t("parentForm.sections.emergency.title")}
                description={t("parentForm.sections.emergency.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("parentForm.fields.emergencyContactName")}
                        value={values.emergencyContactName}
                        onChange={(value) => updateValue("emergencyContactName", value)}
                        placeholder={t("parentForm.placeholders.emergencyContactName")}
                    />

                    <FormInput
                        label={t("parentForm.fields.emergencyContactPhone")}
                        type="tel"
                        value={values.emergencyContactPhone}
                        onChange={(value) => updateValue("emergencyContactPhone", value)}
                        placeholder="+971 50 000 0000"
                    />
                </div>
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t("parentForm.submit.title")}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t("parentForm.submit.description")}
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

                        {isSubmitting ? t("parentForm.submit.saving") : submitLabel}
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
    type = "text",
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
    onChange: (value: string) => void;
}

function FormTextarea({
    label,
    value,
    placeholder,
    onChange,
}: FormTextareaProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black">{label}</span>

            <textarea
                rows={5}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
            />
        </label>
    );
}