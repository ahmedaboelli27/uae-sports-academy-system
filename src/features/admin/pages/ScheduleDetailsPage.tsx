import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    CalendarClock,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    MapPin,
    Pencil,
    Timer,
    Trophy,
    UserRound,
    Users,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { getScheduleSessionById } from '@/features/admin/schedule/services/schedule.service';
import type {
    ScheduleAttendanceStatus,
    ScheduleDayOfWeek,
    ScheduleDetailsDto,
    ScheduleFacilitySummaryDto,
    ScheduleSessionStatus,
    ScheduleSessionType,
    ScheduleSportType,
    ScheduleStudentSummaryDto,
} from '@/features/admin/schedule/types/schedule.dto';

function getStatusLabelKey(status: ScheduleSessionStatus) {
    return `schedulePage.status.${status}`;
}

function getSessionTypeLabelKey(type: ScheduleSessionType) {
    return `schedulePage.sessionType.${type}`;
}

function getSportLabelKey(sport: ScheduleSportType) {
    return `schedulePage.sport.${sport}`;
}

function getAttendanceLabelKey(status: ScheduleAttendanceStatus) {
    return `schedulePage.attendance.${status}`;
}

function getDayLabelKey(day: ScheduleDayOfWeek) {
    return `schedulePage.days.${day}`;
}

function getFacilityTypeLabelKey(type: ScheduleFacilitySummaryDto['type']) {
    return `scheduleDetailsPage.facilityType.${type}`;
}

function getStudentAttendanceLabelKey(
    status: ScheduleStudentSummaryDto['attendanceStatus'],
) {
    return `scheduleDetailsPage.studentAttendance.${status}`;
}

export default function ScheduleDetailsPage() {
    const { t } = useTranslation();
    const { sessionId } = useParams<{ sessionId: string }>();

    const [session, setSession] = useState<ScheduleDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            setIsLoading(true);

            try {
                if (!sessionId) {
                    setSession(null);
                    return;
                }

                const response = await getScheduleSessionById(sessionId);

                if (isMounted) {
                    setSession(response);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadSession();

        return () => {
            isMounted = false;
        };
    }, [sessionId]);

    if (isLoading) {
        return <ScheduleDetailsLoadingState />;
    }

    if (!session) {
        return (
            <main className="space-y-6">
                <BackLink />

                <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-black">
                        {t('scheduleDetailsPage.notFound.title')}
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {t('scheduleDetailsPage.notFound.description')}
                    </p>

                    <Link
                        to="/admin/schedule"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('scheduleDetailsPage.notFound.back')}
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
                    to={`/admin/schedule/${session.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
                >
                    <Pencil className="h-4 w-4" />
                    {t('scheduleDetailsPage.actions.editSession')}
                </Link>
            </div>

            <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
                <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                                <CalendarClock className="h-12 w-12" />
                            </div>

                            <div>
                                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                                    {session.sessionCode}
                                </p>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {session.title}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                                    <span>{t(getSessionTypeLabelKey(session.sessionType))}</span>
                                    <span>•</span>
                                    <span>{t(getSportLabelKey(session.sportType))}</span>
                                    <span>•</span>
                                    <span>{t(getDayLabelKey(session.dayOfWeek))}</span>
                                </div>

                                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                                    {session.description ??
                                        t('scheduleDetailsPage.common.notAvailable')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <StatusBadge
                                value={session.status}
                                label={t(getStatusLabelKey(session.status))}
                                type="session"
                            />

                            <StatusBadge
                                value={session.attendanceStatus}
                                label={t(getAttendanceLabelKey(session.attendanceStatus))}
                                type="attendance"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
                    <ProfileInfoCard
                        icon={CalendarClock}
                        label={t('scheduleDetailsPage.profile.date')}
                        value={session.date}
                    />

                    <ProfileInfoCard
                        icon={Clock}
                        label={t('scheduleDetailsPage.profile.time')}
                        value={`${session.startTime} - ${session.endTime}`}
                    />

                    <ProfileInfoCard
                        icon={Users}
                        label={t('scheduleDetailsPage.profile.students')}
                        value={`${session.studentsCount}/${session.capacity}`}
                    />

                    <ProfileInfoCard
                        icon={Timer}
                        label={t('scheduleDetailsPage.profile.duration')}
                        value={`${session.durationMinutes} ${t(
                            'scheduleDetailsPage.common.minutes',
                        )}`}
                    />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <DetailsSection
                        icon={FileText}
                        title={t('scheduleDetailsPage.overview.title')}
                        description={t('scheduleDetailsPage.overview.description')}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoItem
                                label={t('scheduleDetailsPage.overview.sessionType')}
                                value={t(getSessionTypeLabelKey(session.sessionType))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.overview.sport')}
                                value={t(getSportLabelKey(session.sportType))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.overview.day')}
                                value={t(getDayLabelKey(session.dayOfWeek))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.overview.status')}
                                value={t(getStatusLabelKey(session.status))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.overview.attendanceStatus')}
                                value={t(getAttendanceLabelKey(session.attendanceStatus))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.overview.capacityUsage')}
                                value={`${session.studentsCount}/${session.capacity}`}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Building2}
                        title={t('scheduleDetailsPage.branch.title')}
                        description={t('scheduleDetailsPage.branch.description')}
                    >
                        <div className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 h-5 w-5 text-brand-blue dark:text-brand-yellow" />

                                    <div>
                                        <Link
                                            to={`/admin/branches/${session.branch.id}`}
                                            className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                                        >
                                            {session.branch.name}
                                        </Link>

                                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                            {session.branch.city} • {session.branch.area}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to={`/admin/branches/${session.branch.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-black transition hover:border-brand-yellow"
                                >
                                    {t('scheduleDetailsPage.branch.viewBranch')}
                                </Link>
                            </div>
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={Trophy}
                        title={t('scheduleDetailsPage.program.title')}
                        description={t('scheduleDetailsPage.program.description')}
                    >
                        <div className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <Link
                                        to={`/admin/programs/${session.program.id}`}
                                        className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                                    >
                                        {session.program.name}
                                    </Link>

                                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                        {session.program.programCode} •{' '}
                                        {t(getSportLabelKey(session.program.sportType))}
                                    </p>
                                </div>

                                <Link
                                    to={`/admin/programs/${session.program.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-black transition hover:border-brand-yellow"
                                >
                                    {t('scheduleDetailsPage.program.viewProgram')}
                                </Link>
                            </div>
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={UserRound}
                        title={t('scheduleDetailsPage.coach.title')}
                        description={t('scheduleDetailsPage.coach.description')}
                    >
                        <div className="rounded-2xl border border-border bg-background p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <Link
                                        to={`/admin/coaches/${session.coach.id}`}
                                        className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                                    >
                                        {session.coach.fullName}
                                    </Link>

                                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                        {session.coach.coachCode} •{' '}
                                        {t(getSportLabelKey(session.coach.sportSpecialty))}
                                    </p>
                                </div>

                                <Link
                                    to={`/admin/coaches/${session.coach.id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-black transition hover:border-brand-yellow"
                                >
                                    {t('scheduleDetailsPage.coach.viewCoach')}
                                </Link>
                            </div>
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={ClipboardCheck}
                        title={t('scheduleDetailsPage.students.title')}
                        description={t('scheduleDetailsPage.students.description')}
                    >
                        {session.students.length > 0 ? (
                            <div className="space-y-3">
                                {session.students.map((student) => (
                                    <StudentCard key={student.id} student={student} />
                                ))}
                            </div>
                        ) : (
                            <EmptyMiniState text={t('scheduleDetailsPage.students.empty')} />
                        )}
                    </DetailsSection>
                </div>

                <aside className="space-y-6">
                    <DetailsSection
                        icon={MapPin}
                        title={t('scheduleDetailsPage.facility.title')}
                        description={t('scheduleDetailsPage.facility.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('scheduleDetailsPage.facility.name')}
                                value={session.facility.name}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.facility.type')}
                                value={t(getFacilityTypeLabelKey(session.facility.type))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.facility.capacity')}
                                value={`${session.facility.capacity}`}
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={CheckCircle2}
                        title={t('scheduleDetailsPage.statusDetails.title')}
                        description={t('scheduleDetailsPage.statusDetails.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('scheduleDetailsPage.statusDetails.status')}
                                value={t(getStatusLabelKey(session.status))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.statusDetails.attendanceStatus')}
                                value={t(getAttendanceLabelKey(session.attendanceStatus))}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.statusDetails.cancellationReason')}
                                value={
                                    session.cancellationReason ??
                                    t('scheduleDetailsPage.common.notAvailable')
                                }
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.statusDetails.postponementReason')}
                                value={
                                    session.postponementReason ??
                                    t('scheduleDetailsPage.common.notAvailable')
                                }
                            />
                        </div>
                    </DetailsSection>

                    <DetailsSection
                        icon={FileText}
                        title={t('scheduleDetailsPage.notes.title')}
                        description={t('scheduleDetailsPage.notes.description')}
                    >
                        <InfoItem
                            label={t('scheduleDetailsPage.notes.notes')}
                            value={
                                session.notes ?? t('scheduleDetailsPage.common.notAvailable')
                            }
                        />
                    </DetailsSection>

                    <DetailsSection
                        icon={Clock}
                        title={t('scheduleDetailsPage.timeline.title')}
                        description={t('scheduleDetailsPage.timeline.description')}
                    >
                        <div className="grid gap-4">
                            <InfoItem
                                label={t('scheduleDetailsPage.timeline.createdAt')}
                                value={session.createdAt.slice(0, 10)}
                            />

                            <InfoItem
                                label={t('scheduleDetailsPage.timeline.updatedAt')}
                                value={session.updatedAt.slice(0, 10)}
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
            to="/admin/schedule"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
        >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('scheduleDetailsPage.backToSchedule')}
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
            <p className="mt-1 text-sm font-black">{value}</p>
        </div>
    );
}

function StudentCard({ student }: { student: ScheduleStudentSummaryDto }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-black">{student.fullName}</p>

                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {student.studentCode} • {student.age}{' '}
                        {t('scheduleDetailsPage.common.years')}
                    </p>
                </div>

                <StudentAttendanceBadge
                    value={student.attendanceStatus}
                    label={t(getStudentAttendanceLabelKey(student.attendanceStatus))}
                />
            </div>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-black leading-6">{value}</p>
        </div>
    );
}

function StatusBadge({
    value,
    label,
    type,
}: {
    value: string;
    label: string;
    type: 'session' | 'attendance';
}) {
    const getClasses = () => {
        if (type === 'attendance') {
            if (value === 'completed') {
                return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
            }

            if (value === 'partially_taken') {
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
            }

            return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }

        if (value === 'scheduled') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
        }

        if (value === 'completed') {
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        }

        if (value === 'cancelled') {
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
        }

        if (value === 'postponed') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        }

        return 'bg-secondary text-secondary-foreground';
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
        >
            {label}
        </span>
    );
}

function StudentAttendanceBadge({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    const getClasses = () => {
        if (value === 'present') {
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        }

        if (value === 'late') {
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        }

        if (value === 'absent') {
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
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

function ScheduleDetailsLoadingState() {
    return (
        <main className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
            <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

            <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>

                <div className="space-y-6">
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                    <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
                </div>
            </div>
        </main>
    );
}