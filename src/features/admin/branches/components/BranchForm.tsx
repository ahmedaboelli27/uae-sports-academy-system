import type { LucideIcon } from "lucide-react";
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    FileText,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type {
    BranchCity,
    BranchStatus,
    BranchType,
    CreateBranchRequestDto,
} from "../types/branches.dto";

type BranchFormMode = "create" | "edit";

interface BranchFormValues {
    name: string;
    type: BranchType;

    city: BranchCity;
    area: string;
    address: string;

    phone: string;
    email: string;

    status: BranchStatus;

    managerName: string;
    managerPhone: string;

    capacity: string;

    latitude: string;
    longitude: string;

    description: string;
    notes: string;
}

interface BranchFormProps {
    mode: BranchFormMode;
    initialValues?: Partial<BranchFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateBranchRequestDto) => void | Promise<void>;
}

const defaultFormValues: BranchFormValues = {
    name: "",
    type: "main",

    city: "dubai",
    area: "",
    address: "",

    phone: "",
    email: "",

    status: "active",

    managerName: "",
    managerPhone: "",

    capacity: "0",

    latitude: "",
    longitude: "",

    description: "",
    notes: "",
};

function buildInitialValues(
    initialValues?: Partial<BranchFormValues>,
): BranchFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
    };
}

function cleanOptionalText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function toNumber(value: string, fallback = 0) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return fallback;
    }

    return parsedValue;
}

function toNullableNumber(value: string) {
    const cleanedValue = value.trim();

    if (!cleanedValue) {
        return null;
    }

    const parsedValue = Number(cleanedValue);

    if (Number.isNaN(parsedValue)) {
        return null;
    }

    return parsedValue;
}

export default function BranchForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: BranchFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<BranchFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof BranchFormValues>(
        key: K,
        value: BranchFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: CreateBranchRequestDto = {
            name: values.name.trim(),
            type: values.type,

            city: values.city,
            area: values.area.trim(),
            address: values.address.trim(),

            phone: values.phone.trim(),
            email: values.email.trim(),

            status: values.status,

            managerName: values.managerName.trim(),
            managerPhone: values.managerPhone.trim(),

            capacity: toNumber(values.capacity),

            latitude: toNullableNumber(values.latitude),
            longitude: toNullableNumber(values.longitude),

            description: cleanOptionalText(values.description),
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
                            {mode === "create"
                                ? t("branchForm.notice.createTitle")
                                : t("branchForm.notice.editTitle")}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === "create"
                                ? t("branchForm.notice.createDescription")
                                : t("branchForm.notice.editDescription")}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={Building2}
                title={t("branchForm.sections.basic.title")}
                description={t("branchForm.sections.basic.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("branchForm.fields.name")}
                        value={values.name}
                        onChange={(value) => updateValue("name", value)}
                        placeholder={t("branchForm.placeholders.name")}
                        required
                    />

                    <FormSelect
                        label={t("branchForm.fields.type")}
                        value={values.type}
                        onChange={(value) => updateValue("type", value as BranchType)}
                        options={[
                            {
                                value: "main",
                                label: t("branchForm.options.type.main"),
                            },
                            {
                                value: "satellite",
                                label: t("branchForm.options.type.satellite"),
                            },
                            {
                                value: "partner",
                                label: t("branchForm.options.type.partner"),
                            },
                            {
                                value: "temporary",
                                label: t("branchForm.options.type.temporary"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("branchForm.fields.status")}
                        value={values.status}
                        onChange={(value) => updateValue("status", value as BranchStatus)}
                        options={[
                            {
                                value: "active",
                                label: t("branchForm.options.status.active"),
                            },
                            {
                                value: "inactive",
                                label: t("branchForm.options.status.inactive"),
                            },
                            {
                                value: "under_maintenance",
                                label: t("branchForm.options.status.under_maintenance"),
                            },
                            {
                                value: "archived",
                                label: t("branchForm.options.status.archived"),
                            },
                        ]}
                        required
                    />

                    <FormInput
                        label={t("branchForm.fields.capacity")}
                        type="number"
                        value={values.capacity}
                        onChange={(value) => updateValue("capacity", value)}
                        placeholder="0"
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={MapPin}
                title={t("branchForm.sections.location.title")}
                description={t("branchForm.sections.location.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t("branchForm.fields.city")}
                        value={values.city}
                        onChange={(value) => updateValue("city", value as BranchCity)}
                        options={[
                            {
                                value: "dubai",
                                label: t("branchForm.options.city.dubai"),
                            },
                            {
                                value: "abu_dhabi",
                                label: t("branchForm.options.city.abu_dhabi"),
                            },
                            {
                                value: "sharjah",
                                label: t("branchForm.options.city.sharjah"),
                            },
                            {
                                value: "ajman",
                                label: t("branchForm.options.city.ajman"),
                            },
                            {
                                value: "ras_al_khaimah",
                                label: t("branchForm.options.city.ras_al_khaimah"),
                            },
                            {
                                value: "fujairah",
                                label: t("branchForm.options.city.fujairah"),
                            },
                            {
                                value: "umm_al_quwain",
                                label: t("branchForm.options.city.umm_al_quwain"),
                            },
                            {
                                value: "al_ain",
                                label: t("branchForm.options.city.al_ain"),
                            },
                        ]}
                        required
                    />

                    <FormInput
                        label={t("branchForm.fields.area")}
                        value={values.area}
                        onChange={(value) => updateValue("area", value)}
                        placeholder={t("branchForm.placeholders.area")}
                        required
                    />

                    <div className="md:col-span-2">
                        <FormTextarea
                            label={t("branchForm.fields.address")}
                            value={values.address}
                            onChange={(value) => updateValue("address", value)}
                            placeholder={t("branchForm.placeholders.address")}
                            required
                        />
                    </div>

                    <FormInput
                        label={t("branchForm.fields.latitude")}
                        type="number"
                        value={values.latitude}
                        onChange={(value) => updateValue("latitude", value)}
                        placeholder="25.0000"
                    />

                    <FormInput
                        label={t("branchForm.fields.longitude")}
                        type="number"
                        value={values.longitude}
                        onChange={(value) => updateValue("longitude", value)}
                        placeholder="55.0000"
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Phone}
                title={t("branchForm.sections.contact.title")}
                description={t("branchForm.sections.contact.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("branchForm.fields.phone")}
                        type="tel"
                        value={values.phone}
                        onChange={(value) => updateValue("phone", value)}
                        placeholder="+971 4 000 0000"
                        required
                    />

                    <FormInput
                        label={t("branchForm.fields.email")}
                        type="email"
                        value={values.email}
                        onChange={(value) => updateValue("email", value)}
                        placeholder="branch@example.com"
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={UserRound}
                title={t("branchForm.sections.manager.title")}
                description={t("branchForm.sections.manager.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("branchForm.fields.managerName")}
                        value={values.managerName}
                        onChange={(value) => updateValue("managerName", value)}
                        placeholder={t("branchForm.placeholders.managerName")}
                        required
                    />

                    <FormInput
                        label={t("branchForm.fields.managerPhone")}
                        type="tel"
                        value={values.managerPhone}
                        onChange={(value) => updateValue("managerPhone", value)}
                        placeholder="+971 50 000 0000"
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t("branchForm.sections.notes.title")}
                description={t("branchForm.sections.notes.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t("branchForm.fields.description")}
                        value={values.description}
                        onChange={(value) => updateValue("description", value)}
                        placeholder={t("branchForm.placeholders.description")}
                    />

                    <FormTextarea
                        label={t("branchForm.fields.notes")}
                        value={values.notes}
                        onChange={(value) => updateValue("notes", value)}
                        placeholder={t("branchForm.placeholders.notes")}
                    />
                </div>
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t("branchForm.submit.title")}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t("branchForm.submit.description")}
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

                        {isSubmitting ? t("branchForm.submit.saving") : submitLabel}
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