import type { LucideIcon } from "lucide-react";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Layers,
    ShieldCheck,
    Target,
    Trophy,
    Users,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type {
    CreateProgramRequestDto,
    ProgramAgeGroup,
    ProgramEnrollmentStatus,
    ProgramLevel,
    ProgramSportType,
    ProgramStatus,
} from "../types/programs.dto";

type ProgramFormMode = "create" | "edit";

interface ProgramFormValues {
    name: string;
    shortDescription: string;
    description: string;

    sportType: ProgramSportType;
    level: ProgramLevel;
    ageGroup: ProgramAgeGroup;

    status: ProgramStatus;
    enrollmentStatus: ProgramEnrollmentStatus;

    minAge: string;
    maxAge: string;

    durationWeeks: string;
    sessionsPerWeek: string;
    sessionDurationMinutes: string;

    monthlyPrice: string;

    objectivesText: string;
    requirementsText: string;

    coverImageUrl: string;
    notes: string;
}

interface ProgramFormProps {
    mode: ProgramFormMode;
    initialValues?: Partial<ProgramFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateProgramRequestDto) => void | Promise<void>;
}

const defaultFormValues: ProgramFormValues = {
    name: "",
    shortDescription: "",
    description: "",

    sportType: "football",
    level: "beginner",
    ageGroup: "kids",

    status: "draft",
    enrollmentStatus: "closed",

    minAge: "4",
    maxAge: "16",

    durationWeeks: "12",
    sessionsPerWeek: "2",
    sessionDurationMinutes: "60",

    monthlyPrice: "0",

    objectivesText: "",
    requirementsText: "",

    coverImageUrl: "",
    notes: "",
};

function buildInitialValues(
    initialValues?: Partial<ProgramFormValues>,
): ProgramFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
    };
}

function cleanOptionalText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function cleanOptionalNullableText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : null;
}

function splitTextToArray(value: string) {
    return value
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function toNumber(value: string, fallback = 0) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return fallback;
    }

    return parsedValue;
}

export default function ProgramForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: ProgramFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<ProgramFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof ProgramFormValues>(
        key: K,
        value: ProgramFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: CreateProgramRequestDto = {
            name: values.name.trim(),
            shortDescription: values.shortDescription.trim(),
            description: values.description.trim(),

            sportType: values.sportType,
            level: values.level,
            ageGroup: values.ageGroup,

            status: values.status,
            enrollmentStatus: values.enrollmentStatus,

            minAge: toNumber(values.minAge),
            maxAge: toNumber(values.maxAge),

            durationWeeks: toNumber(values.durationWeeks),
            sessionsPerWeek: toNumber(values.sessionsPerWeek),
            sessionDurationMinutes: toNumber(values.sessionDurationMinutes),

            monthlyPrice: toNumber(values.monthlyPrice),
            currency: "AED",

            objectives: splitTextToArray(values.objectivesText),
            requirements: splitTextToArray(values.requirementsText),

            coverImageUrl: cleanOptionalNullableText(values.coverImageUrl),
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
                                ? t("programForm.notice.createTitle")
                                : t("programForm.notice.editTitle")}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === "create"
                                ? t("programForm.notice.createDescription")
                                : t("programForm.notice.editDescription")}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={Layers}
                title={t("programForm.sections.basic.title")}
                description={t("programForm.sections.basic.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("programForm.fields.name")}
                        value={values.name}
                        onChange={(value) => updateValue("name", value)}
                        placeholder={t("programForm.placeholders.name")}
                        required
                    />

                    <FormInput
                        label={t("programForm.fields.shortDescription")}
                        value={values.shortDescription}
                        onChange={(value) => updateValue("shortDescription", value)}
                        placeholder={t("programForm.placeholders.shortDescription")}
                        required
                    />

                    <div className="md:col-span-2">
                        <FormTextarea
                            label={t("programForm.fields.description")}
                            value={values.description}
                            onChange={(value) => updateValue("description", value)}
                            placeholder={t("programForm.placeholders.description")}
                            required
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection
                icon={Trophy}
                title={t("programForm.sections.classification.title")}
                description={t("programForm.sections.classification.description")}
            >
                <div className="grid gap-5 md:grid-cols-3">
                    <FormSelect
                        label={t("programForm.fields.sportType")}
                        value={values.sportType}
                        onChange={(value) =>
                            updateValue("sportType", value as ProgramSportType)
                        }
                        options={[
                            {
                                value: "football",
                                label: t("programForm.options.sport.football"),
                            },
                            {
                                value: "swimming",
                                label: t("programForm.options.sport.swimming"),
                            },
                            {
                                value: "basketball",
                                label: t("programForm.options.sport.basketball"),
                            },
                            {
                                value: "multi_sport",
                                label: t("programForm.options.sport.multi_sport"),
                            },
                            {
                                value: "fitness",
                                label: t("programForm.options.sport.fitness"),
                            },
                            {
                                value: "martial_arts",
                                label: t("programForm.options.sport.martial_arts"),
                            },
                            {
                                value: "tennis",
                                label: t("programForm.options.sport.tennis"),
                            },
                            {
                                value: "other",
                                label: t("programForm.options.sport.other"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("programForm.fields.level")}
                        value={values.level}
                        onChange={(value) => updateValue("level", value as ProgramLevel)}
                        options={[
                            {
                                value: "beginner",
                                label: t("programForm.options.level.beginner"),
                            },
                            {
                                value: "intermediate",
                                label: t("programForm.options.level.intermediate"),
                            },
                            {
                                value: "advanced",
                                label: t("programForm.options.level.advanced"),
                            },
                            {
                                value: "elite",
                                label: t("programForm.options.level.elite"),
                            },
                            {
                                value: "all_levels",
                                label: t("programForm.options.level.all_levels"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("programForm.fields.ageGroup")}
                        value={values.ageGroup}
                        onChange={(value) =>
                            updateValue("ageGroup", value as ProgramAgeGroup)
                        }
                        options={[
                            {
                                value: "kids",
                                label: t("programForm.options.ageGroup.kids"),
                            },
                            {
                                value: "juniors",
                                label: t("programForm.options.ageGroup.juniors"),
                            },
                            {
                                value: "teens",
                                label: t("programForm.options.ageGroup.teens"),
                            },
                            {
                                value: "adults",
                                label: t("programForm.options.ageGroup.adults"),
                            },
                            {
                                value: "all_ages",
                                label: t("programForm.options.ageGroup.all_ages"),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Users}
                title={t("programForm.sections.age.title")}
                description={t("programForm.sections.age.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("programForm.fields.minAge")}
                        type="number"
                        value={values.minAge}
                        onChange={(value) => updateValue("minAge", value)}
                        required
                    />

                    <FormInput
                        label={t("programForm.fields.maxAge")}
                        type="number"
                        value={values.maxAge}
                        onChange={(value) => updateValue("maxAge", value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Clock}
                title={t("programForm.sections.duration.title")}
                description={t("programForm.sections.duration.description")}
            >
                <div className="grid gap-5 md:grid-cols-3">
                    <FormInput
                        label={t("programForm.fields.durationWeeks")}
                        type="number"
                        value={values.durationWeeks}
                        onChange={(value) => updateValue("durationWeeks", value)}
                        required
                    />

                    <FormInput
                        label={t("programForm.fields.sessionsPerWeek")}
                        type="number"
                        value={values.sessionsPerWeek}
                        onChange={(value) => updateValue("sessionsPerWeek", value)}
                        required
                    />

                    <FormInput
                        label={t("programForm.fields.sessionDurationMinutes")}
                        type="number"
                        value={values.sessionDurationMinutes}
                        onChange={(value) => updateValue("sessionDurationMinutes", value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={DollarSign}
                title={t("programForm.sections.pricing.title")}
                description={t("programForm.sections.pricing.description")}
            >
                <div className="grid gap-5 md:grid-cols-3">
                    <FormInput
                        label={t("programForm.fields.monthlyPrice")}
                        type="number"
                        value={values.monthlyPrice}
                        onChange={(value) => updateValue("monthlyPrice", value)}
                        required
                    />

                    <FormSelect
                        label={t("programForm.fields.status")}
                        value={values.status}
                        onChange={(value) => updateValue("status", value as ProgramStatus)}
                        options={[
                            {
                                value: "active",
                                label: t("programForm.options.status.active"),
                            },
                            {
                                value: "inactive",
                                label: t("programForm.options.status.inactive"),
                            },
                            {
                                value: "draft",
                                label: t("programForm.options.status.draft"),
                            },
                            {
                                value: "archived",
                                label: t("programForm.options.status.archived"),
                            },
                            {
                                value: "seasonal",
                                label: t("programForm.options.status.seasonal"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("programForm.fields.enrollmentStatus")}
                        value={values.enrollmentStatus}
                        onChange={(value) =>
                            updateValue(
                                "enrollmentStatus",
                                value as ProgramEnrollmentStatus,
                            )
                        }
                        options={[
                            {
                                value: "open",
                                label: t("programForm.options.enrollment.open"),
                            },
                            {
                                value: "limited",
                                label: t("programForm.options.enrollment.limited"),
                            },
                            {
                                value: "full",
                                label: t("programForm.options.enrollment.full"),
                            },
                            {
                                value: "closed",
                                label: t("programForm.options.enrollment.closed"),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Target}
                title={t("programForm.sections.objectives.title")}
                description={t("programForm.sections.objectives.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t("programForm.fields.objectives")}
                        value={values.objectivesText}
                        onChange={(value) => updateValue("objectivesText", value)}
                        placeholder={t("programForm.placeholders.objectives")}
                    />

                    <FormTextarea
                        label={t("programForm.fields.requirements")}
                        value={values.requirementsText}
                        onChange={(value) => updateValue("requirementsText", value)}
                        placeholder={t("programForm.placeholders.requirements")}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t("programForm.sections.media.title")}
                description={t("programForm.sections.media.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("programForm.fields.coverImageUrl")}
                        value={values.coverImageUrl}
                        onChange={(value) => updateValue("coverImageUrl", value)}
                        placeholder={t("programForm.placeholders.coverImageUrl")}
                    />

                    <FormTextarea
                        label={t("programForm.fields.notes")}
                        value={values.notes}
                        onChange={(value) => updateValue("notes", value)}
                        placeholder={t("programForm.placeholders.notes")}
                    />
                </div>
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t("programForm.submit.title")}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t("programForm.submit.description")}
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

                        {isSubmitting ? t("programForm.submit.saving") : submitLabel}
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