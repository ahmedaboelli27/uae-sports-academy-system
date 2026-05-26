import type { LucideIcon } from "lucide-react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    HeartPulse,
    Phone,
    ShieldCheck,
    Trophy,
    UserRound,
    Users,
} from "lucide-react";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type {
    CreateStudentRequestDto,
    Gender,
    SkillLevel,
} from "../types/students.dto";

type StudentFormMode = "create" | "edit";

interface StudentFormValues {
    fullName: string;
    dateOfBirth: string;
    gender: Gender;
    skillLevel: SkillLevel;

    parentName: string;
    parentPhone: string;
    parentEmail: string;

    programId: string;
    branchId: string;
    coachId: string;

    medicalNotes: string;
    allergies: string;
    injuries: string;

    emergencyContactName: string;
    emergencyContactPhone: string;

    preferredTrainingDays: string[];
    preferredTrainingTime: string;
}

interface StudentFormProps {
    mode: StudentFormMode;
    initialValues?: Partial<StudentFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: CreateStudentRequestDto) => void | Promise<void>;
}

interface SelectOption {
    value: string;
    labelKey: string;
}

const defaultFormValues: StudentFormValues = {
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    skillLevel: "beginner",

    parentName: "",
    parentPhone: "",
    parentEmail: "",

    programId: "",
    branchId: "",
    coachId: "",

    medicalNotes: "",
    allergies: "",
    injuries: "",

    emergencyContactName: "",
    emergencyContactPhone: "",

    preferredTrainingDays: [],
    preferredTrainingTime: "",
};

const programOptions: SelectOption[] = [
    {
        value: "program-football",
        labelKey: "studentForm.options.programs.football",
    },
    {
        value: "program-swimming",
        labelKey: "studentForm.options.programs.swimming",
    },
    {
        value: "program-basketball",
        labelKey: "studentForm.options.programs.basketball",
    },
    {
        value: "program-multisport",
        labelKey: "studentForm.options.programs.multiSport",
    },
];

const branchOptions: SelectOption[] = [
    {
        value: "branch-dubai",
        labelKey: "studentForm.options.branches.dubai",
    },
    {
        value: "branch-abudhabi",
        labelKey: "studentForm.options.branches.abuDhabi",
    },
    {
        value: "branch-sharjah",
        labelKey: "studentForm.options.branches.sharjah",
    },
];

const coachOptions: SelectOption[] = [
    {
        value: "coach-ahmed",
        labelKey: "studentForm.options.coaches.ahmed",
    },
    {
        value: "coach-sara",
        labelKey: "studentForm.options.coaches.sara",
    },
    {
        value: "coach-omar",
        labelKey: "studentForm.options.coaches.omar",
    },
    {
        value: "coach-fatima",
        labelKey: "studentForm.options.coaches.fatima",
    },
];

const trainingDayOptions: SelectOption[] = [
    {
        value: "Sunday",
        labelKey: "studentForm.options.days.sunday",
    },
    {
        value: "Monday",
        labelKey: "studentForm.options.days.monday",
    },
    {
        value: "Tuesday",
        labelKey: "studentForm.options.days.tuesday",
    },
    {
        value: "Wednesday",
        labelKey: "studentForm.options.days.wednesday",
    },
    {
        value: "Thursday",
        labelKey: "studentForm.options.days.thursday",
    },
    {
        value: "Friday",
        labelKey: "studentForm.options.days.friday",
    },
    {
        value: "Saturday",
        labelKey: "studentForm.options.days.saturday",
    },
];

function buildInitialValues(
    initialValues?: Partial<StudentFormValues>,
): StudentFormValues {
    return {
        ...defaultFormValues,
        ...initialValues,
        preferredTrainingDays: initialValues?.preferredTrainingDays ?? [],
    };
}

export default function StudentForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: StudentFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<StudentFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof StudentFormValues>(
        key: K,
        value: StudentFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const toggleTrainingDay = (day: string) => {
        setValues((currentValues) => {
            const exists = currentValues.preferredTrainingDays.includes(day);

            return {
                ...currentValues,
                preferredTrainingDays: exists
                    ? currentValues.preferredTrainingDays.filter((item) => item !== day)
                    : [...currentValues.preferredTrainingDays, day],
            };
        });
    };

    const cleanOptionalText = (value: string) => {
        const cleanedValue = value.trim();
        return cleanedValue.length > 0 ? cleanedValue : undefined;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: CreateStudentRequestDto = {
            fullName: values.fullName.trim(),
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,

            parentName: values.parentName.trim(),
            parentPhone: values.parentPhone.trim(),
            parentEmail: values.parentEmail.trim(),

            programId: values.programId,
            branchId: values.branchId,
            coachId: cleanOptionalText(values.coachId),

            skillLevel: values.skillLevel,

            medicalNotes: cleanOptionalText(values.medicalNotes),
            allergies: cleanOptionalText(values.allergies),
            injuries: cleanOptionalText(values.injuries),

            emergencyContactName: cleanOptionalText(values.emergencyContactName),
            emergencyContactPhone: cleanOptionalText(values.emergencyContactPhone),

            preferredTrainingDays: values.preferredTrainingDays,
            preferredTrainingTime: cleanOptionalText(values.preferredTrainingTime),
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
                                ? t("studentForm.notice.createTitle")
                                : t("studentForm.notice.editTitle")}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === "create"
                                ? t("studentForm.notice.createDescription")
                                : t("studentForm.notice.editDescription")}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={UserRound}
                title={t("studentForm.sections.student.title")}
                description={t("studentForm.sections.student.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("studentForm.fields.fullName")}
                        value={values.fullName}
                        onChange={(value) => updateValue("fullName", value)}
                        placeholder={t("studentForm.placeholders.fullName")}
                        required
                    />

                    <FormInput
                        label={t("studentForm.fields.dateOfBirth")}
                        type="date"
                        value={values.dateOfBirth}
                        onChange={(value) => updateValue("dateOfBirth", value)}
                        required
                    />

                    <FormSelect
                        label={t("studentForm.fields.gender")}
                        value={values.gender}
                        onChange={(value) => updateValue("gender", value as Gender)}
                        options={[
                            {
                                value: "male",
                                label: t("studentForm.options.gender.male"),
                            },
                            {
                                value: "female",
                                label: t("studentForm.options.gender.female"),
                            },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("studentForm.fields.skillLevel")}
                        value={values.skillLevel}
                        onChange={(value) =>
                            updateValue("skillLevel", value as SkillLevel)
                        }
                        options={[
                            {
                                value: "beginner",
                                label: t("studentForm.options.skill.beginner"),
                            },
                            {
                                value: "intermediate",
                                label: t("studentForm.options.skill.intermediate"),
                            },
                            {
                                value: "advanced",
                                label: t("studentForm.options.skill.advanced"),
                            },
                            {
                                value: "elite",
                                label: t("studentForm.options.skill.elite"),
                            },
                        ]}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Users}
                title={t("studentForm.sections.parent.title")}
                description={t("studentForm.sections.parent.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("studentForm.fields.parentName")}
                        value={values.parentName}
                        onChange={(value) => updateValue("parentName", value)}
                        placeholder={t("studentForm.placeholders.parentName")}
                        required
                    />

                    <FormInput
                        label={t("studentForm.fields.parentPhone")}
                        type="tel"
                        value={values.parentPhone}
                        onChange={(value) => updateValue("parentPhone", value)}
                        placeholder="+971 50 000 0000"
                        required
                    />

                    <FormInput
                        label={t("studentForm.fields.parentEmail")}
                        type="email"
                        value={values.parentEmail}
                        onChange={(value) => updateValue("parentEmail", value)}
                        placeholder="parent@example.com"
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Trophy}
                title={t("studentForm.sections.program.title")}
                description={t("studentForm.sections.program.description")}
            >
                <div className="grid gap-5 md:grid-cols-3">
                    <FormSelect
                        label={t("studentForm.fields.program")}
                        value={values.programId}
                        onChange={(value) => updateValue("programId", value)}
                        options={[
                            {
                                value: "",
                                label: t("studentForm.placeholders.selectProgram"),
                            },
                            ...programOptions.map((option) => ({
                                value: option.value,
                                label: t(option.labelKey),
                            })),
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("studentForm.fields.branch")}
                        value={values.branchId}
                        onChange={(value) => updateValue("branchId", value)}
                        options={[
                            {
                                value: "",
                                label: t("studentForm.placeholders.selectBranch"),
                            },
                            ...branchOptions.map((option) => ({
                                value: option.value,
                                label: t(option.labelKey),
                            })),
                        ]}
                        required
                    />

                    <FormSelect
                        label={t("studentForm.fields.coach")}
                        value={values.coachId}
                        onChange={(value) => updateValue("coachId", value)}
                        options={[
                            {
                                value: "",
                                label: t("studentForm.placeholders.selectCoach"),
                            },
                            ...coachOptions.map((option) => ({
                                value: option.value,
                                label: t(option.labelKey),
                            })),
                        ]}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={CalendarDays}
                title={t("studentForm.sections.preferences.title")}
                description={t("studentForm.sections.preferences.description")}
            >
                <div className="space-y-5">
                    <div>
                        <p className="mb-3 text-sm font-black">
                            {t("studentForm.fields.preferredTrainingDays")}
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {trainingDayOptions.map((day) => {
                                const isChecked = values.preferredTrainingDays.includes(
                                    day.value,
                                );

                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleTrainingDay(day.value)}
                                        className={[
                                            "flex items-center gap-3 rounded-2xl border p-4 text-start text-sm font-black transition",
                                            isChecked
                                                ? "border-brand-blue bg-brand-blue text-white dark:border-brand-yellow dark:bg-brand-yellow dark:text-brand-blue"
                                                : "border-border bg-background hover:border-brand-yellow",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "flex h-5 w-5 items-center justify-center rounded-full border",
                                                isChecked
                                                    ? "border-white bg-white text-brand-blue dark:border-brand-blue dark:bg-brand-blue dark:text-white"
                                                    : "border-border",
                                            ].join(" ")}
                                        >
                                            {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                                        </span>

                                        {t(day.labelKey)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <FormInput
                        label={t("studentForm.fields.preferredTrainingTime")}
                        value={values.preferredTrainingTime}
                        onChange={(value) => updateValue("preferredTrainingTime", value)}
                        placeholder={t("studentForm.placeholders.preferredTrainingTime")}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={HeartPulse}
                title={t("studentForm.sections.medical.title")}
                description={t("studentForm.sections.medical.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormTextarea
                        label={t("studentForm.fields.medicalNotes")}
                        value={values.medicalNotes}
                        onChange={(value) => updateValue("medicalNotes", value)}
                        placeholder={t("studentForm.placeholders.medicalNotes")}
                    />

                    <FormTextarea
                        label={t("studentForm.fields.allergies")}
                        value={values.allergies}
                        onChange={(value) => updateValue("allergies", value)}
                        placeholder={t("studentForm.placeholders.allergies")}
                    />

                    <FormTextarea
                        label={t("studentForm.fields.injuries")}
                        value={values.injuries}
                        onChange={(value) => updateValue("injuries", value)}
                        placeholder={t("studentForm.placeholders.injuries")}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Phone}
                title={t("studentForm.sections.emergency.title")}
                description={t("studentForm.sections.emergency.description")}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t("studentForm.fields.emergencyContactName")}
                        value={values.emergencyContactName}
                        onChange={(value) => updateValue("emergencyContactName", value)}
                        placeholder={t("studentForm.placeholders.emergencyContactName")}
                    />

                    <FormInput
                        label={t("studentForm.fields.emergencyContactPhone")}
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
                            {t("studentForm.submit.title")}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t("studentForm.submit.description")}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-4 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        {isSubmitting ? t("studentForm.submit.saving") : submitLabel}
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