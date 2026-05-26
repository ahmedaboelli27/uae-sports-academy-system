import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    Lock,
    Save,
    ShieldCheck,
    Unlock,
    UserRound,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
    getAttendanceById,
    getAttendanceList,
    lockAttendanceSheet,
    unlockAttendanceSheet,
    updateAttendanceSheet,
} from '@/features/admin/attendance/services/attendance.service';
import type {
    AttendanceDetailsDto,
    AttendanceListItemDto,
    AttendanceRecordStatus,
    AttendanceSessionStatus,
    MarkAttendanceStudentRequestDto,
} from '@/features/admin/attendance/types/attendance.dto';

interface EditableStudentAttendance {
    studentId: string;
    studentCode: string;
    fullName: string;
    age: number;
    parentName: string;
    parentPhone: string;
    status: AttendanceRecordStatus;
    checkInTime: string;
    checkOutTime: string;
    lateMinutes: string;
    notes: string;
}

const attendanceStatusOptions: AttendanceRecordStatus[] = [
    'present',
    'absent',
    'late',
    'excused',
    'not_marked',
];

const sheetStatusOptions: AttendanceSessionStatus[] = [
    'not_started',
    'in_progress',
    'completed',
    'locked',
];

function getRecordStatusLabelKey(status: AttendanceRecordStatus) {
    return `attendancePage.recordStatus.${status}`;
}

function getSessionStatusLabelKey(status: AttendanceSessionStatus) {
    return `attendancePage.sessionStatus.${status}`;
}

function buildEditableStudents(
    attendance: AttendanceDetailsDto,
): EditableStudentAttendance[] {
    return attendance.students.map((student) => ({
        studentId: student.id,
        studentCode: student.studentCode,
        fullName: student.fullName,
        age: student.age,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        status: student.status,
        checkInTime: student.checkInTime ?? '',
        checkOutTime: student.checkOutTime ?? '',
        lateMinutes: String(student.lateMinutes ?? 0),
        notes: student.notes ?? '',
    }));
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

export default function MarkAttendancePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { attendanceId } = useParams<{ attendanceId?: string }>();

    const [attendanceList, setAttendanceList] = useState<AttendanceListItemDto[]>(
        [],
    );
    const [attendance, setAttendance] = useState<AttendanceDetailsDto | null>(
        null,
    );

    const [students, setStudents] = useState<EditableStudentAttendance[]>([]);
    const [sessionStatus, setSessionStatus] =
        useState<AttendanceSessionStatus>('not_started');
    const [generalNotes, setGeneralNotes] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocking, setIsLocking] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const selectedAttendanceId = attendanceId ?? attendanceList[0]?.id;

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            setIsLoading(true);

            try {
                const listResponse = await getAttendanceList();

                if (!isMounted) return;

                setAttendanceList(listResponse.attendanceSheets);

                const targetAttendanceId =
                    attendanceId ?? listResponse.attendanceSheets[0]?.id;

                if (!targetAttendanceId) {
                    setAttendance(null);
                    return;
                }

                const detailsResponse = await getAttendanceById(targetAttendanceId);

                if (!isMounted) return;

                setAttendance(detailsResponse);

                if (detailsResponse) {
                    setStudents(buildEditableStudents(detailsResponse));
                    setSessionStatus(detailsResponse.sessionStatus);
                    setGeneralNotes(detailsResponse.generalNotes ?? '');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadInitialData();

        return () => {
            isMounted = false;
        };
    }, [attendanceId]);

    const attendanceStats = useMemo(() => {
        const total = students.length;

        const present = students.filter((student) => student.status === 'present')
            .length;
        const absent = students.filter((student) => student.status === 'absent')
            .length;
        const late = students.filter((student) => student.status === 'late').length;
        const excused = students.filter((student) => student.status === 'excused')
            .length;
        const notMarked = students.filter(
            (student) => student.status === 'not_marked',
        ).length;

        const effectivePresent = present + late + excused;

        return {
            total,
            present,
            absent,
            late,
            excused,
            notMarked,
            rate:
                total > 0 ? Number(((effectivePresent / total) * 100).toFixed(1)) : 0,
        };
    }, [students]);

    const updateStudent = <K extends keyof EditableStudentAttendance>(
        studentId: string,
        key: K,
        value: EditableStudentAttendance[K],
    ) => {
        setStudents((currentStudents) =>
            currentStudents.map((student) =>
                student.studentId === studentId
                    ? {
                        ...student,
                        [key]: value,
                    }
                    : student,
            ),
        );
    };

    const markAll = (status: AttendanceRecordStatus) => {
        setStudents((currentStudents) =>
            currentStudents.map((student) => ({
                ...student,
                status,
                checkInTime:
                    status === 'present' && !student.checkInTime
                        ? attendance?.startTime ?? ''
                        : student.checkInTime,
                lateMinutes: status === 'late' ? student.lateMinutes : '0',
            })),
        );
    };

    const handleAttendanceChange = (
        studentId: string,
        status: AttendanceRecordStatus,
    ) => {
        setStudents((currentStudents) =>
            currentStudents.map((student) => {
                if (student.studentId !== studentId) {
                    return student;
                }

                return {
                    ...student,
                    status,
                    checkInTime:
                        (status === 'present' || status === 'late') && !student.checkInTime
                            ? attendance?.startTime ?? ''
                            : student.checkInTime,
                    checkOutTime:
                        status === 'absent' || status === 'excused'
                            ? ''
                            : student.checkOutTime,
                    lateMinutes: status === 'late' ? student.lateMinutes : '0',
                };
            }),
        );
    };

    const buildPayloadStudents = (): MarkAttendanceStudentRequestDto[] => {
        return students.map((student) => ({
            studentId: student.studentId,
            status: student.status,
            checkInTime: student.checkInTime.trim() || null,
            checkOutTime: student.checkOutTime.trim() || null,
            lateMinutes: toNumber(student.lateMinutes, 0),
            notes: cleanNullableText(student.notes),
        }));
    };

    const handleSave = async () => {
        if (!attendance) return;

        setIsSaving(true);
        setIsSaved(false);

        try {
            const updatedAttendance = await updateAttendanceSheet(attendance.id, {
                sessionStatus,
                students: buildPayloadStudents(),
                generalNotes: cleanNullableText(generalNotes),
                markedBy: 'Admin User',
            });

            if (!updatedAttendance) {
                setAttendance(null);
                return;
            }

            setAttendance(updatedAttendance);
            setStudents(buildEditableStudents(updatedAttendance));
            setSessionStatus(updatedAttendance.sessionStatus);
            setGeneralNotes(updatedAttendance.generalNotes ?? '');
            setIsSaved(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLockToggle = async () => {
        if (!attendance) return;

        setIsLocking(true);

        try {
            const updatedAttendance =
                attendance.sessionStatus === 'locked'
                    ? await unlockAttendanceSheet(attendance.id)
                    : await lockAttendanceSheet(attendance.id, 'Admin User');

            if (!updatedAttendance) {
                setAttendance(null);
                return;
            }

            setAttendance(updatedAttendance);
            setStudents(buildEditableStudents(updatedAttendance));
            setSessionStatus(updatedAttendance.sessionStatus);
            setGeneralNotes(updatedAttendance.generalNotes ?? '');
        } finally {
            setIsLocking(false);
        }
    };

    const handleSelectAttendance = (nextAttendanceId: string) => {
        if (!nextAttendanceId) return;
        navigate(`/admin/attendance/${nextAttendanceId}/mark`);
    };

    if (isLoading) {
        return <MarkAttendanceLoadingState />;
    }

    if (!attendance) {
        return (
            <main className="space-y-6">
                <BackToAttendance />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('markAttendancePage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('markAttendancePage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/attendance"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('markAttendancePage.notFound.back')}
                    </Link>
                </section>
            </main>
        );
    }

    const isLocked = attendance.sessionStatus === 'locked';

    return (
        <main className="space-y-8">
            <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <BackToAttendance />

                    <div className="mt-5 mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
                        <ClipboardCheck className="h-4 w-4" />
                        {t('markAttendancePage.badge')}
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                        {t('markAttendancePage.title')}
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                        {t('markAttendancePage.description')}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:pt-10">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || isLocked}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        {isSaving ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving
                            ? t('markAttendancePage.actions.saving')
                            : t('markAttendancePage.actions.save')}
                    </button>

                    <button
                        type="button"
                        onClick={handleLockToggle}
                        disabled={isLocking}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLocked ? (
                            <Unlock className="h-4 w-4" />
                        ) : (
                            <Lock className="h-4 w-4" />
                        )}

                        {isLocked
                            ? t('markAttendancePage.actions.unlock')
                            : t('markAttendancePage.actions.lock')}
                    </button>
                </div>
            </section>

            {isSaved && (
                <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

                        <div>
                            <h2 className="text-lg font-black">
                                {t('markAttendancePage.success.title')}
                            </h2>

                            <p className="mt-1 text-sm font-semibold leading-6">
                                {t('markAttendancePage.success.description')}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <ClipboardCheck className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {attendance.attendanceCode} • {attendance.sessionCode}
                                </p>

                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {attendance.sessionTitle}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{attendance.date}</span>
                                    <span>•</span>
                                    <span>
                                        {attendance.startTime} - {attendance.endTime}
                                    </span>
                                    <span>•</span>
                                    <span>{attendance.branchName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur">
                            {t(getSessionStatusLabelKey(attendance.sessionStatus))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
                    <StatCard
                        icon={Users}
                        label={t('markAttendancePage.stats.total')}
                        value={`${attendanceStats.total}`}
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label={t('markAttendancePage.stats.present')}
                        value={`${attendanceStats.present}`}
                    />

                    <StatCard
                        icon={AlertTriangle}
                        label={t('markAttendancePage.stats.absent')}
                        value={`${attendanceStats.absent}`}
                    />

                    <StatCard
                        icon={Clock}
                        label={t('markAttendancePage.stats.late')}
                        value={`${attendanceStats.late}`}
                    />

                    <StatCard
                        icon={ShieldCheck}
                        label={t('markAttendancePage.stats.rate')}
                        value={`${attendanceStats.rate}%`}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
                <aside className="space-y-6">
                    <DetailsSection
                        icon={ClipboardCheck}
                        title={t('markAttendancePage.sheetSelector.title')}
                        description={t('markAttendancePage.sheetSelector.description')}
                    >
                        <label className="block">
                            <span className="mb-2 block text-sm font-black">
                                {t('markAttendancePage.sheetSelector.label')}
                            </span>

                            <select
                                value={selectedAttendanceId}
                                onChange={(event) => handleSelectAttendance(event.target.value)}
                                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                            >
                                {attendanceList.map((sheet) => (
                                    <option key={sheet.id} value={sheet.id}>
                                        {sheet.attendanceCode} - {sheet.sessionTitle}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('markAttendancePage.sheetStatus.title')}
                        description={t('markAttendancePage.sheetStatus.description')}
                    >
                        <label className="block">
                            <span className="mb-2 block text-sm font-black">
                                {t('markAttendancePage.sheetStatus.label')}
                            </span>

                            <select
                                value={sessionStatus}
                                disabled={isLocked}
                                onChange={(event) =>
                                    setSessionStatus(event.target.value as AttendanceSessionStatus)
                                }
                                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                            >
                                {sheetStatusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {t(getSessionStatusLabelKey(status))}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </DetailsSection>

                    <DetailsSection
                        icon={Users}
                        title={t('markAttendancePage.bulk.title')}
                        description={t('markAttendancePage.bulk.description')}
                    >
                        <div className="grid gap-3">
                            <BulkButton
                                label={t('markAttendancePage.bulk.markAllPresent')}
                                onClick={() => markAll('present')}
                                disabled={isLocked}
                            />

                            <BulkButton
                                label={t('markAttendancePage.bulk.markAllAbsent')}
                                onClick={() => markAll('absent')}
                                disabled={isLocked}
                            />

                            <BulkButton
                                label={t('markAttendancePage.bulk.resetAll')}
                                onClick={() => markAll('not_marked')}
                                disabled={isLocked}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('markAttendancePage.notes.title')}
                        description={t('markAttendancePage.notes.description')}
                    >
                        <textarea
                            rows={6}
                            value={generalNotes}
                            disabled={isLocked}
                            onChange={(event) => setGeneralNotes(event.target.value)}
                            placeholder={t('markAttendancePage.notes.placeholder')}
                            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                        />
                    </DetailsSection>
                </aside>

                <section className="rounded-[2rem] border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-5 sm:p-6">
                        <h2 className="text-xl font-black">
                            {t('markAttendancePage.students.title')}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('markAttendancePage.students.description')}
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 sm:p-6">
                        {students.map((student) => (
                            <StudentAttendanceCard
                                key={student.studentId}
                                student={student}
                                disabled={isLocked}
                                onStatusChange={(status) =>
                                    handleAttendanceChange(student.studentId, status)
                                }
                                onChange={(key, value) =>
                                    updateStudent(student.studentId, key, value)
                                }
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}

function BackToAttendance() {
    const { t } = useTranslation();

    return (
        <Link
            to="/admin/attendance"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
        >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('markAttendancePage.backToAttendance')}
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

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
                <Icon className="h-5 w-5" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-black">{value}</p>
        </div>
    );
}

interface BulkButtonProps {
    label: string;
    disabled: boolean;
    onClick: () => void;
}

function BulkButton({ label, disabled, onClick }: BulkButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-3 text-sm font-black transition hover:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-60"
        >
            {label}
        </button>
    );
}

interface StudentAttendanceCardProps {
    student: EditableStudentAttendance;
    disabled: boolean;
    onStatusChange: (status: AttendanceRecordStatus) => void;
    onChange: <K extends keyof EditableStudentAttendance>(
        key: K,
        value: EditableStudentAttendance[K],
    ) => void;
}

function StudentAttendanceCard({
    student,
    disabled,
    onStatusChange,
    onChange,
}: StudentAttendanceCardProps) {
    const { t } = useTranslation();

    return (
        <article className="rounded-[2rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                        <UserRound className="h-6 w-6" />
                    </div>

                    <div>
                        <h3 className="text-base font-black">{student.fullName}</h3>

                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {student.studentCode} • {student.age}{' '}
                            {t('markAttendancePage.common.years')}
                        </p>

                        <p className="mt-2 text-xs font-semibold text-muted-foreground">
                            {student.parentName} • {student.parentPhone}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {attendanceStatusOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            disabled={disabled}
                            onClick={() => onStatusChange(status)}
                            className={`rounded-full border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${student.status === status
                                ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-brand-yellow'
                                : 'border-border bg-card text-muted-foreground hover:border-brand-yellow hover:text-foreground'
                                }`}
                        >
                            {t(getRecordStatusLabelKey(status))}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="block">
                    <span className="mb-2 block text-xs font-black text-muted-foreground">
                        {t('markAttendancePage.fields.checkInTime')}
                    </span>

                    <input
                        type="time"
                        value={student.checkInTime}
                        disabled={disabled}
                        onChange={(event) => onChange('checkInTime', event.target.value)}
                        className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-black text-muted-foreground">
                        {t('markAttendancePage.fields.checkOutTime')}
                    </span>

                    <input
                        type="time"
                        value={student.checkOutTime}
                        disabled={disabled}
                        onChange={(event) => onChange('checkOutTime', event.target.value)}
                        className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-black text-muted-foreground">
                        {t('markAttendancePage.fields.lateMinutes')}
                    </span>

                    <input
                        type="number"
                        value={student.lateMinutes}
                        disabled={disabled}
                        onChange={(event) => onChange('lateMinutes', event.target.value)}
                        className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                    />
                </label>
            </div>

            <label className="mt-4 block">
                <span className="mb-2 block text-xs font-black text-muted-foreground">
                    {t('markAttendancePage.fields.notes')}
                </span>

                <textarea
                    rows={3}
                    value={student.notes}
                    disabled={disabled}
                    onChange={(event) => onChange('notes', event.target.value)}
                    placeholder={t('markAttendancePage.fields.notesPlaceholder')}
                    className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
            </label>
        </article>
    );
}

function MarkAttendanceLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>

                <div className="h-[600px] animate-pulse rounded-[2rem] bg-secondary" />
            </div>
        </main>
    );
}