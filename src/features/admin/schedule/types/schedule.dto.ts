export type ScheduleSessionStatus =
    | 'scheduled'
    | 'completed'
    | 'cancelled'
    | 'postponed';

export type ScheduleSessionType =
    | 'regular_training'
    | 'trial_session'
    | 'makeup_session'
    | 'assessment'
    | 'private_session'
    | 'event_session';

export type ScheduleDayOfWeek =
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday';

export type ScheduleSportType =
    | 'football'
    | 'swimming'
    | 'basketball'
    | 'multi_sport'
    | 'fitness'
    | 'martial_arts'
    | 'tennis'
    | 'other';

export type ScheduleAttendanceStatus =
    | 'not_taken'
    | 'partially_taken'
    | 'completed';

export interface ScheduleBranchSummaryDto {
    id: string;
    name: string;
    city: string;
    area: string;
}

export interface ScheduleProgramSummaryDto {
    id: string;
    programCode: string;
    name: string;
    sportType: ScheduleSportType;
}

export interface ScheduleCoachSummaryDto {
    id: string;
    coachCode: string;
    fullName: string;
    sportSpecialty: ScheduleSportType;
}

export interface ScheduleFacilitySummaryDto {
    id: string;
    name: string;
    type:
    | 'football_pitch'
    | 'swimming_pool'
    | 'indoor_court'
    | 'fitness_area'
    | 'multi_purpose_hall'
    | 'kids_zone'
    | 'other';
    capacity: number;
}

export interface ScheduleStudentSummaryDto {
    id: string;
    studentCode: string;
    fullName: string;
    age: number;
    attendanceStatus:
    | 'present'
    | 'absent'
    | 'late'
    | 'excused'
    | 'not_marked';
}

export interface ScheduleListItemDto {
    id: string;

    sessionCode: string;
    title: string;

    sessionType: ScheduleSessionType;
    status: ScheduleSessionStatus;
    attendanceStatus: ScheduleAttendanceStatus;

    sportType: ScheduleSportType;

    date: string;
    dayOfWeek: ScheduleDayOfWeek;
    startTime: string;
    endTime: string;
    durationMinutes: number;

    branchId: string;
    branchName: string;

    programId: string;
    programName: string;

    coachId: string;
    coachName: string;

    facilityId: string;
    facilityName: string;

    studentsCount: number;
    capacity: number;

    createdAt: string;
    updatedAt: string;
}

export interface ScheduleDetailsDto extends ScheduleListItemDto {
    description: string | null;

    branch: ScheduleBranchSummaryDto;
    program: ScheduleProgramSummaryDto;
    coach: ScheduleCoachSummaryDto;
    facility: ScheduleFacilitySummaryDto;

    students: ScheduleStudentSummaryDto[];

    notes: string | null;
    cancellationReason: string | null;
    postponementReason: string | null;
}

export interface ScheduleSummaryDto {
    totalSessions: number;
    scheduledSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    postponedSessions: number;

    todaySessions: number;
    upcomingSessions: number;

    totalStudentsScheduled: number;
    averageCapacityUsage: number;

    attendanceCompletedSessions: number;
    attendancePendingSessions: number;
}

export interface ScheduleFiltersDto {
    search?: string;

    status?: ScheduleSessionStatus | 'all';
    sessionType?: ScheduleSessionType | 'all';
    sportType?: ScheduleSportType | 'all';
    attendanceStatus?: ScheduleAttendanceStatus | 'all';

    branchId?: string | 'all';
    programId?: string | 'all';
    coachId?: string | 'all';

    dateFrom?: string;
    dateTo?: string;
}

export interface ScheduleListResponseDto {
    summary: ScheduleSummaryDto;
    sessions: ScheduleListItemDto[];
}

export interface CreateScheduleSessionRequestDto {
    title: string;
    description?: string;

    sessionType: ScheduleSessionType;
    status?: ScheduleSessionStatus;
    attendanceStatus?: ScheduleAttendanceStatus;

    sportType: ScheduleSportType;

    date: string;
    dayOfWeek: ScheduleDayOfWeek;
    startTime: string;
    endTime: string;
    durationMinutes: number;

    branchId: string;
    branchName: string;

    programId: string;
    programName: string;

    coachId: string;
    coachName: string;

    facilityId: string;
    facilityName: string;

    capacity: number;
    studentsCount?: number;

    notes?: string;
}

export interface UpdateScheduleSessionRequestDto
    extends Partial<CreateScheduleSessionRequestDto> {
    cancellationReason?: string | null;
    postponementReason?: string | null;
}

export interface DeleteScheduleSessionResponseDto {
    id: string;
    deleted: boolean;
}