import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    ArrowLeft,
    CalendarClock,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    Lock,
    MapPin,
    Pencil,
    Percent,
    ShieldCheck,
    Timer,
    Trophy,
    UserRound,
    Users,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
    getAttendanceById,
    getAttendanceStatusCounts,
} from '@/features/admin/attendance/services/attendance.service';
import type {
    AttendanceDetailsDto,
    AttendanceRecordStatus,
    AttendanceSessionStatus,
    AttendanceSessionType,
    AttendanceSportType,
    AttendanceStudentDto,
} from '@/features/admin/attendance/types/attendance.dto';

function getSessionStatusLabelKey(status: AttendanceSessionStatus) {
    return `attendancePage.sessionStatus.${status}`;
}

function getRecordStatusLabelKey(status: AttendanceRecordStatus) {
    return `attendancePage.recordStatus.${status}`;
}

function getSessionTypeLabelKey(type: AttendanceSessionType) {
    return `attendancePage.sessionType.${type}`;
}

function getSportLabelKey(sport: AttendanceSportType) {
    return `attendancePage.sport.${sport}`;
}

export default function AttendanceDetailsPage() {
    const { t } = useTranslation();
    const { attendanceId } = useParams<{ attendanceId: string }>();

    const [attendance, setAttendance] = useState<AttendanceDetailsDto | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadAttendance = async () => {
            setIsLoading(true);

            try {
                if (!attendanceId) {
                    setAttendance(null);
                    return;
                }

                const response = await getAttendanceById(attendanceId);

                if (isMounted) {
                    setAttendance(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadAttendance();

        return () => {
            isMounted = false;
        };
    }, [attendanceId]);

    const statusCounts = useMemo(() => {
        if (!attendance) return [];

        return getAttendanceStatusCounts(attendance.students);
    }, [attendance]);

    if (isLoading) {
        return <AttendanceDetailsLoadingState />;
    }

    if (!attendance) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('attendanceDetailsPage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('attendanceDetailsPage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/attendance"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('attendanceDetailsPage.notFound.back')}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <BackLink />

                <Link
                    to={`/admin/attendance/${attendance.id}/mark`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                >
                    <Pencil className="h-4 w-4" />
                    {t('attendanceDetailsPage.actions.markAttendance')}
                </Link>
            </div>

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

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {attendance.sessionTitle}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{attendance.date}</span>
                                    <span>•</span>
                                    <span>
                                        {attendance.startTime} - {attendance.endTime}
                                    </span>
                                    <span>•</span>
                                    <span>{attendance.branchName}</span>
                                </div>

                                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                                    {attendance.programName} • {attendance.coachName} •{' '}
                                    {attendance.facilityName}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <SessionStatusBadge
                                value={attendance.sessionStatus}
                                label={t(getSessionStatusLabelKey(attendance.sessionStatus))}
                            />

                            {attendance.sessionStatus === 'locked' ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
                                    <Lock className="h-3.5 w-3.5" />
                                    {t('attendanceDetailsPage.locked.label')}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
                    <ProfileInfoCard
                        icon={Users}
                        label={t('attendanceDetailsPage.profile.totalStudents')}
                        value={`${attendance.totalStudents}`}
                    />

                    <ProfileInfoCard
                        icon={CheckCircle2}
                        label={t('attendanceDetailsPage.profile.present')}
                        value={`${attendance.presentCount}`}
                    />

                    <ProfileInfoCard
                        icon={XCircle}
                        label={t('attendanceDetailsPage.profile.absent')}
                        value={`${attendance.absentCount}`}
                    />

                    <ProfileInfoCard
                        icon={Timer}
                        label={t('attendanceDetailsPage.profile.late')}
                        value={`${attendance.lateCount}`}
                    />

                    <ProfileInfoCard
                        icon={Percent}
                        label={t('attendanceDetailsPage.profile.rate')}
                        value={`${attendance.attendanceRate}%`}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={ClipboardCheck}
                        title={t('attendanceDetailsPage.overview.title')}
                        description={t('attendanceDetailsPage.overview.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoItem
                                label={t('attendanceDetailsPage.overview.sheetStatus')}
                                value={t(getSessionStatusLabelKey(attendance.sessionStatus))}
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.overview.sessionType')}
                                value={t(getSessionTypeLabelKey(attendance.sessionType))}
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.overview.sport')}
                                value={t(getSportLabelKey(attendance.sportType))}
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.overview.attendanceRate')}
                                value={`${attendance.attendanceRate}%`}
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.overview.markedBy')}
                                value={
                                    attendance.markedBy ??
                                    t('attendanceDetailsPage.common.notAvailable')
                                }
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.overview.markedAt')}
                                value={
                                    attendance.markedAt
                                        ? attendance.markedAt.slice(0, 10)
                                        : t('attendanceDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={CalendarClock}
                        title={t('attendanceDetailsPage.session.title')}
                        description={t('attendanceDetailsPage.session.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={CalendarClock}
                                label={t('attendanceDetailsPage.session.titleField')}
                                value={attendance.session.title}
                            />

                            <InfoItem
                                icon={Clock}
                                label={t('attendanceDetailsPage.session.time')}
                                value={`${attendance.startTime} - ${attendance.endTime}`}
                            />

                            <InfoItem
                                icon={MapPin}
                                label={t('attendanceDetailsPage.session.branch')}
                                value={attendance.branchName}
                            />

                            <InfoItem
                                icon={Trophy}
                                label={t('attendanceDetailsPage.session.program')}
                                value={attendance.programName}
                            />

                            <InfoItem
                                icon={UserRound}
                                label={t('attendanceDetailsPage.session.coach')}
                                value={attendance.coachName}
                            />

                            <InfoItem
                                icon={MapPin}
                                label={t('attendanceDetailsPage.session.facility')}
                                value={attendance.facilityName}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Users}
                        title={t('attendanceDetailsPage.students.title')}
                        description={t('attendanceDetailsPage.students.description')}
                    >
                        {attendance.students.length > 0 ? (
                            <div className="space-y-3">
                                {attendance.students.map((student) => (
                                    <StudentAttendanceCard key={student.id} student={student} />
                                ))}
                            </div>
                        ) : (
                            <EmptyMiniState
                                text={t('attendanceDetailsPage.students.empty')}
                            />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={Percent}
                        title={t('attendanceDetailsPage.statusBreakdown.title')}
                        description={t('attendanceDetailsPage.statusBreakdown.description')}
                    >
                        <div className="space-y-3">
                            {statusCounts.map((item) => (
                                <StatusCountCard
                                    key={item.status}
                                    status={item.status}
                                    count={item.count}
                                    percentage={item.percentage}
                                />
                            ))}
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={ShieldCheck}
                        title={t('attendanceDetailsPage.locked.title')}
                        description={t('attendanceDetailsPage.locked.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('attendanceDetailsPage.locked.lockedBy')}
                                value={
                                    attendance.lockedBy ??
                                    t('attendanceDetailsPage.common.notAvailable')
                                }
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.locked.lockedAt')}
                                value={
                                    attendance.lockedAt
                                        ? attendance.lockedAt.slice(0, 10)
                                        : t('attendanceDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('attendanceDetailsPage.notes.title')}
                        description={t('attendanceDetailsPage.notes.description')}
                    >
                        <InfoItem
                            label={t('attendanceDetailsPage.notes.generalNotes')}
                            value={
                                attendance.generalNotes ??
                                t('attendanceDetailsPage.common.notAvailable')
                            }
                        />
                    </DetailsSection>

                    <DetailsSection
                        icon={Clock}
                        title={t('attendanceDetailsPage.timeline.title')}
                        description={t('attendanceDetailsPage.timeline.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('attendanceDetailsPage.timeline.createdAt')}
                                value={attendance.createdAt.slice(0, 10)}
                            />

                            <InfoItem
                                label={t('attendanceDetailsPage.timeline.updatedAt')}
                                value={attendance.updatedAt.slice(0, 10)}
                            />
                        </div>
                    </DetailsSection>
                </aside>
            </section>
        </main>
    );
}

function BackLink() {
    const { t } = useTranslation();

    return (
        <Link
            to="/admin/attendance"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
        >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('attendanceDetailsPage.backToAttendance')}
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

interface ProfileInfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function ProfileInfoCard({ icon: Icon, label, value }: ProfileInfoCardProps) {
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

interface InfoItemProps {
    label: string;
    value: string;
    icon?: LucideIcon;
}

function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-1 flex items-center gap-2">
                {Icon && (
                    <Icon className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                )}

                <p className="text-xs font-bold text-muted-foreground">{label}</p>
            </div>

            <p className="text-sm font-black leading-6">{value}</p>
        </div>
    );
}

function StudentAttendanceCard({ student }: { student: AttendanceStudentDto }) {
    const { t } = useTranslation();

    return (
        <article className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                        <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm font-black">{student.fullName}</p>

                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {student.studentCode} • {student.age}{' '}
                            {t('attendanceDetailsPage.common.years')}
                        </p>

                        <p className="mt-2 text-xs font-semibold text-muted-foreground">
                            {student.parentName} • {student.parentPhone}
                        </p>
                    </div>
                </div>

                <RecordStatusBadge
                    value={student.status}
                    label={t(getRecordStatusLabelKey(student.status))}
                />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <InfoLine
                    label={t('attendanceDetailsPage.studentFields.checkInTime')}
                    value={
                        student.checkInTime ??
                        t('attendanceDetailsPage.common.notAvailable')
                    }
                />

                <InfoLine
                    label={t('attendanceDetailsPage.studentFields.checkOutTime')}
                    value={
                        student.checkOutTime ??
                        t('attendanceDetailsPage.common.notAvailable')
                    }
                />

                <InfoLine
                    label={t('attendanceDetailsPage.studentFields.lateMinutes')}
                    value={`${student.lateMinutes}`}
                />
            </div>

            {student.notes ? (
                <div className="mt-4 rounded-2xl bg-secondary p-4">
                    <p className="text-xs font-bold text-muted-foreground">
                        {t('attendanceDetailsPage.studentFields.notes')}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6">
                        {student.notes}
                    </p>
                </div>
            ) : null}
        </article>
    );
}

function InfoLine({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-black">{value}</p>
        </div>
    );
}

function StatusCountCard({
    status,
    count,
    percentage,
}: {
    status: AttendanceRecordStatus;
    count: number;
    percentage: number;
}) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
                <RecordStatusBadge
                    value={status}
                    label={t(getRecordStatusLabelKey(status))}
                />

                <span className="text-sm font-black">{count}</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-brand-blue dark:bg-brand-yellow"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="mt-2 text-xs font-bold text-muted-foreground">
                {percentage}%
            </p>
        </div>
    );
}

function SessionStatusBadge({
    value,
    label,
}: {
    value: AttendanceSessionStatus;
    label: string;
}) {
    const getClasses = () => {
        if (value === 'completed') {
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        }

        if (value === 'in_progress') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        }

        if (value === 'locked') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
        >
            {label}
        </span>
    );
}

function RecordStatusBadge({
    value,
    label,
}: {
    value: AttendanceRecordStatus;
    label: string;
}) {
    const getClasses = () => {
        if (value === 'present') {
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        }

        if (value === 'absent') {
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
        }

        if (value === 'late') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        }

        if (value === 'excused') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
        >
            {label}
        </span>
    );
}

function EmptyMiniState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
            {text}
        </div>
    );
}

function AttendanceDetailsLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
                </div>

                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>
            </div>
        </main>
    );
}