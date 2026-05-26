import type { LucideIcon } from 'lucide-react';
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    ShieldCheck,
    Timer,
    Trophy,
    Users
} from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    CreateScheduleSessionRequestDto,
    ScheduleAttendanceStatus,
    ScheduleDayOfWeek,
    ScheduleSessionStatus,
    ScheduleSessionType,
    ScheduleSportType,
} from '../types/schedule.dto';

export interface ScheduleFormPayload extends CreateScheduleSessionRequestDto {
    cancellationReason?: string | null;
    postponementReason?: string | null;
}

type ScheduleFormMode = 'create' | 'edit';

interface ScheduleFormValues {
    title: string;
    description: string;

    sessionType: ScheduleSessionType;
    status: ScheduleSessionStatus;
    attendanceStatus: ScheduleAttendanceStatus;

    sportType: ScheduleSportType;

    date: string;
    dayOfWeek: ScheduleDayOfWeek;
    startTime: string;
    endTime: string;
    durationMinutes: string;

    branchId: string;
    branchName: string;

    programId: string;
    programName: string;

    coachId: string;
    coachName: string;

    facilityId: string;
    facilityName: string;

    capacity: string;
    studentsCount: string;

    notes: string;
    cancellationReason: string;
    postponementReason: string;
}

interface ScheduleFormProps {
    mode: ScheduleFormMode;
    initialValues?: Partial<ScheduleFormValues>;
    isSubmitting?: boolean;
    submitLabel: string;
    onSubmit: (payload: ScheduleFormPayload) => void | Promise<void>;
}

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

const programOptions: {
    id: string;
    name: string;
    sportType: ScheduleSportType;
}[] = [
        {
            id: 'program-001',
            name: 'Football Academy',
            sportType: 'football',
        },
        {
            id: 'program-002',
            name: 'Swimming Program',
            sportType: 'swimming',
        },
        {
            id: 'program-003',
            name: 'Basketball Training',
            sportType: 'basketball',
        },
        {
            id: 'program-004',
            name: 'Multi-Sport Program',
            sportType: 'multi_sport',
        },
    ];

const coachOptions: {
    id: string;
    name: string;
    sportType: ScheduleSportType;
}[] = [
        {
            id: 'coach-001',
            name: 'Ahmed Al Mansoori',
            sportType: 'football',
        },
        {
            id: 'coach-002',
            name: 'Sara Khaled',
            sportType: 'swimming',
        },
        {
            id: 'coach-003',
            name: 'Omar Hassan',
            sportType: 'basketball',
        },
        {
            id: 'coach-004',
            name: 'Fatima Al Nuaimi',
            sportType: 'multi_sport',
        },
    ];

const facilityOptions = [
    {
        id: 'facility-dubai-001',
        name: 'Main Football Pitch',
        capacity: 60,
    },
    {
        id: 'facility-dubai-002',
        name: 'Kids Training Zone',
        capacity: 25,
    },
    {
        id: 'facility-abudhabi-001',
        name: 'Indoor Pool',
        capacity: 45,
    },
    {
        id: 'facility-sharjah-001',
        name: 'Indoor Court',
        capacity: 40,
    },
];

const defaultFormValues: ScheduleFormValues = {
    title: '',
    description: '',

    sessionType: 'regular_training',
    status: 'scheduled',
    attendanceStatus: 'not_taken',

    sportType: 'football',

    date: '',
    dayOfWeek: 'sunday',
    startTime: '17:00',
    endTime: '18:00',
    durationMinutes: '60',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    programId: 'program-001',
    programName: 'Football Academy',

    coachId: 'coach-001',
    coachName: 'Ahmed Al Mansoori',

    facilityId: 'facility-dubai-001',
    facilityName: 'Main Football Pitch',

    capacity: '24',
    studentsCount: '0',

    notes: '',
    cancellationReason: '',
    postponementReason: '',
};

function buildInitialValues(
    initialValues?: Partial<ScheduleFormValues>,
): ScheduleFormValues {
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

function toNumber(value: string, fallback = 0) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return fallback;
    }

    return parsedValue;
}

function findBranch(branchId: string) {
    return branchOptions.find((branch) => branch.id === branchId);
}

function findProgram(programId: string) {
    return programOptions.find((program) => program.id === programId);
}

function findCoach(coachId: string) {
    return coachOptions.find((coach) => coach.id === coachId);
}

function findFacility(facilityId: string) {
    return facilityOptions.find((facility) => facility.id === facilityId);
}

export default function ScheduleForm({
    mode,
    initialValues,
    isSubmitting = false,
    submitLabel,
    onSubmit,
}: ScheduleFormProps) {
    const { t } = useTranslation();

    const [values, setValues] = useState<ScheduleFormValues>(() =>
        buildInitialValues(initialValues),
    );

    useEffect(() => {
        setValues(buildInitialValues(initialValues));
    }, [initialValues]);

    const updateValue = <K extends keyof ScheduleFormValues>(
        key: K,
        value: ScheduleFormValues[K],
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
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

    const handleProgramChange = (programId: string) => {
        const selectedProgram = findProgram(programId);

        setValues((currentValues) => ({
            ...currentValues,
            programId,
            programName: selectedProgram?.name ?? currentValues.programName,
            sportType: selectedProgram?.sportType ?? currentValues.sportType,
        }));
    };

    const handleCoachChange = (coachId: string) => {
        const selectedCoach = findCoach(coachId);

        setValues((currentValues) => ({
            ...currentValues,
            coachId,
            coachName: selectedCoach?.name ?? currentValues.coachName,
        }));
    };

    const handleFacilityChange = (facilityId: string) => {
        const selectedFacility = findFacility(facilityId);

        setValues((currentValues) => ({
            ...currentValues,
            facilityId,
            facilityName: selectedFacility?.name ?? currentValues.facilityName,
            capacity:
                currentValues.capacity === '0' || currentValues.capacity.trim() === ''
                    ? String(selectedFacility?.capacity ?? currentValues.capacity)
                    : currentValues.capacity,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const selectedBranch = findBranch(values.branchId);
        const selectedProgram = findProgram(values.programId);
        const selectedCoach = findCoach(values.coachId);
        const selectedFacility = findFacility(values.facilityId);

        const payload: ScheduleFormPayload = {
            title: values.title.trim(),
            description: cleanOptionalText(values.description),

            sessionType: values.sessionType,
            status: values.status,
            attendanceStatus: values.attendanceStatus,

            sportType: values.sportType,

            date: values.date,
            dayOfWeek: values.dayOfWeek,
            startTime: values.startTime,
            endTime: values.endTime,
            durationMinutes: toNumber(values.durationMinutes, 60),

            branchId: values.branchId,
            branchName: selectedBranch?.name ?? values.branchName,

            programId: values.programId,
            programName: selectedProgram?.name ?? values.programName,

            coachId: values.coachId,
            coachName: selectedCoach?.name ?? values.coachName,

            facilityId: values.facilityId,
            facilityName: selectedFacility?.name ?? values.facilityName,

            capacity: toNumber(values.capacity, 0),
            studentsCount: toNumber(values.studentsCount, 0),

            notes: cleanOptionalText(values.notes),

            cancellationReason: cleanOptionalNullableText(values.cancellationReason),
            postponementReason: cleanOptionalNullableText(values.postponementReason),
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
                                ? t('scheduleForm.notice.createTitle')
                                : t('scheduleForm.notice.editTitle')}
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6">
                            {mode === 'create'
                                ? t('scheduleForm.notice.createDescription')
                                : t('scheduleForm.notice.editDescription')}
                        </p>
                    </div>
                </div>
            </div>

            <FormSection
                icon={CalendarClock}
                title={t('scheduleForm.sections.basic.title')}
                description={t('scheduleForm.sections.basic.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t('scheduleForm.fields.title')}
                        value={values.title}
                        onChange={(value) => updateValue('title', value)}
                        placeholder={t('scheduleForm.placeholders.title')}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.sessionType')}
                        value={values.sessionType}
                        onChange={(value) =>
                            updateValue('sessionType', value as ScheduleSessionType)
                        }
                        options={[
                            {
                                value: 'regular_training',
                                label: t('schedulePage.sessionType.regular_training'),
                            },
                            {
                                value: 'trial_session',
                                label: t('schedulePage.sessionType.trial_session'),
                            },
                            {
                                value: 'makeup_session',
                                label: t('schedulePage.sessionType.makeup_session'),
                            },
                            {
                                value: 'assessment',
                                label: t('schedulePage.sessionType.assessment'),
                            },
                            {
                                value: 'private_session',
                                label: t('schedulePage.sessionType.private_session'),
                            },
                            {
                                value: 'event_session',
                                label: t('schedulePage.sessionType.event_session'),
                            },
                        ]}
                        required
                    />

                    <div className="md:col-span-2">
                        <FormTextarea
                            label={t('scheduleForm.fields.description')}
                            value={values.description}
                            onChange={(value) => updateValue('description', value)}
                            placeholder={t('scheduleForm.placeholders.description')}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection
                icon={Timer}
                title={t('scheduleForm.sections.time.title')}
                description={t('scheduleForm.sections.time.description')}
            >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormInput
                        label={t('scheduleForm.fields.date')}
                        type="date"
                        value={values.date}
                        onChange={(value) => updateValue('date', value)}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.dayOfWeek')}
                        value={values.dayOfWeek}
                        onChange={(value) =>
                            updateValue('dayOfWeek', value as ScheduleDayOfWeek)
                        }
                        options={[
                            { value: 'sunday', label: t('schedulePage.days.sunday') },
                            { value: 'monday', label: t('schedulePage.days.monday') },
                            { value: 'tuesday', label: t('schedulePage.days.tuesday') },
                            { value: 'wednesday', label: t('schedulePage.days.wednesday') },
                            { value: 'thursday', label: t('schedulePage.days.thursday') },
                            { value: 'friday', label: t('schedulePage.days.friday') },
                            { value: 'saturday', label: t('schedulePage.days.saturday') },
                        ]}
                        required
                    />

                    <FormInput
                        label={t('scheduleForm.fields.startTime')}
                        type="time"
                        value={values.startTime}
                        onChange={(value) => updateValue('startTime', value)}
                        required
                    />

                    <FormInput
                        label={t('scheduleForm.fields.endTime')}
                        type="time"
                        value={values.endTime}
                        onChange={(value) => updateValue('endTime', value)}
                        required
                    />

                    <FormInput
                        label={t('scheduleForm.fields.durationMinutes')}
                        type="number"
                        value={values.durationMinutes}
                        onChange={(value) => updateValue('durationMinutes', value)}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Trophy}
                title={t('scheduleForm.sections.assignment.title')}
                description={t('scheduleForm.sections.assignment.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('scheduleForm.fields.program')}
                        value={values.programId}
                        onChange={handleProgramChange}
                        options={programOptions.map((program) => ({
                            value: program.id,
                            label: program.name,
                        }))}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.sport')}
                        value={values.sportType}
                        onChange={(value) =>
                            updateValue('sportType', value as ScheduleSportType)
                        }
                        options={[
                            { value: 'football', label: t('schedulePage.sport.football') },
                            { value: 'swimming', label: t('schedulePage.sport.swimming') },
                            { value: 'basketball', label: t('schedulePage.sport.basketball') },
                            { value: 'multi_sport', label: t('schedulePage.sport.multi_sport') },
                            { value: 'fitness', label: t('schedulePage.sport.fitness') },
                            {
                                value: 'martial_arts',
                                label: t('schedulePage.sport.martial_arts'),
                            },
                            { value: 'tennis', label: t('schedulePage.sport.tennis') },
                            { value: 'other', label: t('schedulePage.sport.other') },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.branch')}
                        value={values.branchId}
                        onChange={handleBranchChange}
                        options={branchOptions.map((branch) => ({
                            value: branch.id,
                            label: branch.name,
                        }))}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.coach')}
                        value={values.coachId}
                        onChange={handleCoachChange}
                        options={coachOptions.map((coach) => ({
                            value: coach.id,
                            label: coach.name,
                        }))}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.facility')}
                        value={values.facilityId}
                        onChange={handleFacilityChange}
                        options={facilityOptions.map((facility) => ({
                            value: facility.id,
                            label: facility.name,
                        }))}
                        required
                    />
                </div>
            </FormSection>

            <FormSection
                icon={Users}
                title={t('scheduleForm.sections.capacity.title')}
                description={t('scheduleForm.sections.capacity.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        label={t('scheduleForm.fields.capacity')}
                        type="number"
                        value={values.capacity}
                        onChange={(value) => updateValue('capacity', value)}
                        required
                    />

                    <FormInput
                        label={t('scheduleForm.fields.studentsCount')}
                        type="number"
                        value={values.studentsCount}
                        onChange={(value) => updateValue('studentsCount', value)}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={ClipboardCheck}
                title={t('scheduleForm.sections.status.title')}
                description={t('scheduleForm.sections.status.description')}
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormSelect
                        label={t('scheduleForm.fields.status')}
                        value={values.status}
                        onChange={(value) =>
                            updateValue('status', value as ScheduleSessionStatus)
                        }
                        options={[
                            { value: 'scheduled', label: t('schedulePage.status.scheduled') },
                            { value: 'completed', label: t('schedulePage.status.completed') },
                            { value: 'cancelled', label: t('schedulePage.status.cancelled') },
                            { value: 'postponed', label: t('schedulePage.status.postponed') },
                        ]}
                        required
                    />

                    <FormSelect
                        label={t('scheduleForm.fields.attendanceStatus')}
                        value={values.attendanceStatus}
                        onChange={(value) =>
                            updateValue('attendanceStatus', value as ScheduleAttendanceStatus)
                        }
                        options={[
                            {
                                value: 'not_taken',
                                label: t('schedulePage.attendance.not_taken'),
                            },
                            {
                                value: 'partially_taken',
                                label: t('schedulePage.attendance.partially_taken'),
                            },
                            {
                                value: 'completed',
                                label: t('schedulePage.attendance.completed'),
                            },
                        ]}
                        required
                    />

                    <FormTextarea
                        label={t('scheduleForm.fields.cancellationReason')}
                        value={values.cancellationReason}
                        onChange={(value) => updateValue('cancellationReason', value)}
                        placeholder={t('scheduleForm.placeholders.cancellationReason')}
                    />

                    <FormTextarea
                        label={t('scheduleForm.fields.postponementReason')}
                        value={values.postponementReason}
                        onChange={(value) => updateValue('postponementReason', value)}
                        placeholder={t('scheduleForm.placeholders.postponementReason')}
                    />
                </div>
            </FormSection>

            <FormSection
                icon={FileText}
                title={t('scheduleForm.sections.notes.title')}
                description={t('scheduleForm.sections.notes.description')}
            >
                <FormTextarea
                    label={t('scheduleForm.fields.notes')}
                    value={values.notes}
                    onChange={(value) => updateValue('notes', value)}
                    placeholder={t('scheduleForm.placeholders.notes')}
                />
            </FormSection>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            {t('scheduleForm.submit.title')}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('scheduleForm.submit.description')}
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

                        {isSubmitting ? t('scheduleForm.submit.saving') : submitLabel}
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