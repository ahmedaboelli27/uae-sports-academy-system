import type { LucideIcon } from "lucide-react";
import {
    AlertCircle,
    BriefcaseBusiness,
    CheckCircle2,
    Languages,
    MapPin,
    Phone,
    ShieldCheck,
    Trophy,
    UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type {
    CoachAvailabilityStatus,
    CoachEmploymentType,
    CoachGender,
    CoachSkillLevel,
    CoachSportSpecialty,
    CoachStatus,
    CreateCoachRequestDto,
} from "../types/coaches.dto";

type CoachFormMode = "create" | "edit";

interface CoachFormValues {
    fullName: string;
    gender: CoachGender;

    phone: string;
    email: string;

    sportSpecialty: CoachSportSpecialty;
    skillLevel: CoachSkillLevel;
    employmentType: CoachEmploymentType;

    branchId: string;

    status: CoachStatus;
    availabilityStatus: CoachAvailabilityStatus;

    nationality: string;
    dateOfBirth: string;

    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;

    bio: string;
    experienceYears: string;

    languagesText: string;
    specialtiesText: string;

    notes: string;
}

interface CoachFormProps {
    mode: CoachFormMode;
    initialValues?: Partial<CoachFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateCoachRequestDto) => void | Promise<void>;
}

interface SelectOption {
    value: string;
    labelKey: string;
}

const defaultFormValues: CoachFormValues = {
    fullName: "",
    gender: "male",

    phone: "",
    email: "",

    sportSpecialty: "football",
    skillLevel: "junior",
    employmentType: "full_time",

    branchId: "",

    status: "active",
    availabilityStatus: "available",

    nationality: "",
    dateOfBirth: "",

    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",

    bio: "",
    experienceYears: "0",

    languagesText: "",
    specialtiesText: "",

    notes: "",
};

const branchOptions: SelectOption[] = [
    {
        value: "branch-dubai",
        labelKey: "coachForm.options.branches.dubai",
    },
    {
        value: "branch-abudhabi",
        labelKey: "coachForm.options.branches.abuDhabi",
    },
    {
        value: "branch-sharjah",
        labelKey: "coachForm.options.branches.sharjah",
    },
    {
        value: "branch-ajman",
        labelKey: "coachForm.options.branches.ajman",
    },
];

function buildInitialValues(
    initialValues?: Partial<CoachFormValues>,
): CoachFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
    };
}

function cleanOptionalText(value: string) {
    const cleanedValue = value.trim();
    return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function splitTextToArray(value: string) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function CoachForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: CoachFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<CoachFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof CoachFormValues>(
        key: K,
        value: CoachFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: CreateCoachRequestDto = {
            fullName: values.fullName.trim(),
            gender: values.gender,

            phone: values.phone.trim(),
            email: values.email.trim(),

            sportSpecialty: values.sportSpecialty,
            skillLevel: values.skillLevel,
            employmentType: values.employmentType,

            branchId: values.branchId,

            status: values.status,
            availabilityStatus: values.availabilityStatus,

            nationality: cleanOptionalText(values.nationality),
            dateOfBirth: cleanOptionalText(values.dateOfBirth),

            address: cleanOptionalText(values.address),
            emergencyContactName: cleanOptionalText(values.emergencyContactName),
            emergencyContactPhone: cleanOptionalText(values.emergencyContactPhone),

            bio: cleanOptionalText(values.bio),
            experienceYears: Number(values.experienceYears) || 0,

            languages: splitTextToArray(values.languagesText),
            specialties: splitTextToArray(values.specialtiesText),

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
                                ? t("coachForm.notice.createTitle")
                                : t("coachForm.notice.editTitle")}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === "create"
                                ? t("coachForm.notice.createDescription")
                                : t("coachForm.notice.editDescription")}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={UserRound}
                title={t("coachForm.sections.personal.title")}
                description={t("coachForm.sections.personal.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("coachForm.fields.fullName")}
                        value={values.fullName}
                        onChange={(value) => updateValue("fullName", value)}
                        placeholder={t("coachForm.placeholders.fullName")}
                        required
                    />

                    <FormSelect
                        label={t("coachForm.fields.gender")}
                        value={values.gender}
                        onChange={(value) => updateValue("gender", value as CoachGender)}
                        options={[
                            {
                                value: "male",
                                label: t("coachForm.options.gender.male"),
                            },
                            {
                                value: "female",
                                label: t("coachForm.options.gender.female"),
                            },
                        ]}
                        required
                    />

                    <FormInput
                        label={t("coachForm.fields.nationality")}
                        value={values.nationality}
                        onChange={(value) => updateValue("nationality", value)}
                        placeholder={t("coachForm.placeholders.nationality")}
                    />

                    <FormInput
                        label={t("coachForm.fields.dateOfBirth")}
                        type="date"
                        value={values.dateOfBirth}
                        onChange={(value) => updateValue("dateOfBirth", value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Phone}
                title={t("coachForm.sections.contact.title")}
                description={t("coachForm.sections.contact.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("coachForm.fields.phone")}
                        type="tel"
                        value={values.phone}
                        onChange={(value) => updateValue("phone", value)}
                        placeholder="+971 50 000 0000"
                        required
                    />

                    <FormInput
                        label={t("coachForm.fields.email")}
                        type="email"
                        value={values.email}
                        onChange={(value) => updateValue("email", value)}
                        placeholder="coach@example.com"
                        required
                    />

                    <FormInput
                        label={t("coachForm.fields.emergencyContactName")}
                        value={values.emergencyContactName}
                        onChange={(value) => updateValue("emergencyContactName", value)}
                        placeholder={t("coachForm.placeholders.emergencyContactName")}
                    />

                    <FormInput
                        label={t("coachForm.fields.emergencyContactPhone")}
                        type="tel"
                        value={values.emergencyContactPhone}
                        onChange={(value) => updateValue("emergencyContactPhone", value)}
                        placeholder="+971 50 000 0000"
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Trophy}
                title={t("coachForm.sections.sport.title")}
                description={t("coachForm.sections.sport.description")}
            >
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <FormSelect
                        label={t("coachForm.fields.sportSpecialty")}
                        value={values.sportSpecialty}
                        onChange={(value) =>
                            updateValue("sportSpecialty", value as CoachSportSpecialty)
                        }
                        options={[
                            {
                                value: "football",
                                label: t("coachForm.options.specialty.football"),
                            },
                            {
                                value: "swimming",
                                label: t("coachForm.options.specialty.swimming"),
                            },
                            {
                                value: "basketball",
                                label: t("coachForm.options.specialty.basketball"),
                            },
                            {
                                value: "multi_sport",
                                label: t("coachForm.options.specialty.multi_sport"),
                            },
                            {
                                value: "fitness",
                                label: t("coachForm.options.specialty.fitness"),
                            },
                            {
                                value: "martial_arts",
                                label: t("coachForm.options.specialty.martial_arts"),
                            },
                            {
                                value: "tennis",
                                label: t("coachForm.options.specialty.tennis"),
                            },
                            {
                                value: "other",
                                label: t("coachForm.options.specialty.other"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("coachForm.fields.skillLevel")}
                        value={values.skillLevel}
                        onChange={(value) =>
                            updateValue("skillLevel", value as CoachSkillLevel)
                        }
                        options={[
                            {
                                value: "junior",
                                label: t("coachForm.options.skill.junior"),
                            },
                            {
                                value: "mid_level",
                                label: t("coachForm.options.skill.mid_level"),
                            },
                            {
                                value: "senior",
                                label: t("coachForm.options.skill.senior"),
                            },
                            {
                                value: "expert",
                                label: t("coachForm.options.skill.expert"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("coachForm.fields.branch")}
                        value={values.branchId}
                        onChange={(value) => updateValue("branchId", value)}
                        options={[
                            {
                                value: "",
                                label: t("coachForm.placeholders.selectBranch"),
                            },
                            ...branchOptions.map((option) => ({
                                value: option.value,
                                label: t(option.labelKey),
                            })),
                        ]}
                        required
                    />

                    <FormInput
                        label={t("coachForm.fields.experienceYears")}
                        type="number"
                        value={values.experienceYears}
                        onChange={(value) => updateValue("experienceYears", value)}
                        placeholder="0"
                    />
                </div>
            </FormSection>

            <FormSection
                icon={BriefcaseBusiness}
                title={t("coachForm.sections.work.title")}
                description={t("coachForm.sections.work.description")}
            >
                <div className="grid gap-5 md:grid-cols-3">
                    <FormSelect
                        label={t("coachForm.fields.employmentType")}
                        value={values.employmentType}
                        onChange={(value) =>
                            updateValue("employmentType", value as CoachEmploymentType)
                        }
                        options={[
                            {
                                value: "full_time",
                                label: t("coachForm.options.employment.full_time"),
                            },
                            {
                                value: "part_time",
                                label: t("coachForm.options.employment.part_time"),
                            },
                            {
                                value: "freelance",
                                label: t("coachForm.options.employment.freelance"),
                            },
                            {
                                value: "contract",
                                label: t("coachForm.options.employment.contract"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("coachForm.fields.status")}
                        value={values.status}
                        onChange={(value) => updateValue("status", value as CoachStatus)}
                        options={[
                            {
                                value: "active",
                                label: t("coachForm.options.status.active"),
                            },
                            {
                                value: "inactive",
                                label: t("coachForm.options.status.inactive"),
                            },
                            {
                                value: "on_leave",
                                label: t("coachForm.options.status.on_leave"),
                            },
                            {
                                value: "suspended",
                                label: t("coachForm.options.status.suspended"),
                            },
                            {
                                value: "archived",
                                label: t("coachForm.options.status.archived"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("coachForm.fields.availabilityStatus")}
                        value={values.availabilityStatus}
                        onChange={(value) =>
                            updateValue(
                                "availabilityStatus",
                                value as CoachAvailabilityStatus,
                            )
                        }
                        options={[
                            {
                                value: "available",
                                label: t("coachForm.options.availability.available"),
                            },
                            {
                                value: "busy",
                                label: t("coachForm.options.availability.busy"),
                            },
                            {
                                value: "limited",
                                label: t("coachForm.options.availability.limited"),
                            },
                            {
                                value: "unavailable",
                                label: t("coachForm.options.availability.unavailable"),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Languages}
                title={t("coachForm.sections.experience.title")}
                description={t("coachForm.sections.experience.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t("coachForm.fields.languages")}
                        value={values.languagesText}
                        onChange={(value) => updateValue("languagesText", value)}
                        placeholder={t("coachForm.placeholders.languages")}
                    />

                    <FormTextarea
                        label={t("coachForm.fields.specialties")}
                        value={values.specialtiesText}
                        onChange={(value) => updateValue("specialtiesText", value)}
                        placeholder={t("coachForm.placeholders.specialties")}
                    />

                    <FormTextarea
                        label={t("coachForm.fields.bio")}
                        value={values.bio}
                        onChange={(value) => updateValue("bio", value)}
                        placeholder={t("coachForm.placeholders.bio")}
                    />

                    <FormTextarea
                        label={t("coachForm.fields.notes")}
                        value={values.notes}
                        onChange={(value) => updateValue("notes", value)}
                        placeholder={t("coachForm.placeholders.notes")}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={MapPin}
                title={t("coachForm.sections.address.title")}
                description={t("coachForm.sections.address.description")}
            >
                <FormTextarea
                    label={t("coachForm.fields.address")}
                    value={values.address}
                    onChange={(value) => updateValue("address", value)}
                    placeholder={t("coachForm.placeholders.address")}
                />
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t("coachForm.submit.title")}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t("coachForm.submit.description")}
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

                        {isSubmitting ? t("coachForm.submit.saving") : submitLabel}
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