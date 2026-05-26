export type AttendanceRecordStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'excused'
  | 'not_marked';

export type AttendanceSessionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'locked';

export type AttendanceSessionType =
  | 'regular_training'
  | 'trial_session'
  | 'makeup_session'
  | 'assessment'
  | 'private_session'
  | 'event_session';

export type AttendanceSportType =
  | 'football'
  | 'swimming'
  | 'basketball'
  | 'multi_sport'
  | 'fitness'
  | 'martial_arts'
  | 'tennis'
  | 'other';

export type AttendanceDayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface AttendanceStudentDto {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;

  parentName: string;
  parentPhone: string;

  status: AttendanceRecordStatus;

  checkInTime: string | null;
  checkOutTime: string | null;

  lateMinutes: number;
  notes: string | null;
}

export interface AttendanceSessionSummaryDto {
  id: string;
  sessionCode: string;
  title: string;

  sessionType: AttendanceSessionType;
  sportType: AttendanceSportType;

  date: string;
  dayOfWeek: AttendanceDayOfWeek;
  startTime: string;
  endTime: string;

  branchId: string;
  branchName: string;

  programId: string;
  programName: string;

  coachId: string;
  coachName: string;

  facilityId: string;
  facilityName: string;
}

export interface AttendanceListItemDto {
  id: string;

  attendanceCode: string;

  sessionId: string;
  sessionCode: string;
  sessionTitle: string;

  sessionType: AttendanceSessionType;
  sportType: AttendanceSportType;

  date: string;
  dayOfWeek: AttendanceDayOfWeek;
  startTime: string;
  endTime: string;

  branchId: string;
  branchName: string;

  programId: string;
  programName: string;

  coachId: string;
  coachName: string;

  facilityName: string;

  sessionStatus: AttendanceSessionStatus;

  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  notMarkedCount: number;

  attendanceRate: number;

  markedBy: string | null;
  markedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AttendanceDetailsDto extends AttendanceListItemDto {
  session: AttendanceSessionSummaryDto;

  students: AttendanceStudentDto[];

  generalNotes: string | null;

  lockedBy: string | null;
  lockedAt: string | null;
}

export interface AttendanceSummaryDto {
  totalAttendanceSheets: number;

  completedSheets: number;
  inProgressSheets: number;
  notStartedSheets: number;
  lockedSheets: number;

  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  totalNotMarked: number;

  averageAttendanceRate: number;
}

export interface AttendanceFiltersDto {
  search?: string;

  sessionStatus?: AttendanceSessionStatus | 'all';
  recordStatus?: AttendanceRecordStatus | 'all';
  sessionType?: AttendanceSessionType | 'all';
  sportType?: AttendanceSportType | 'all';

  branchId?: string | 'all';
  programId?: string | 'all';
  coachId?: string | 'all';

  dateFrom?: string;
  dateTo?: string;
}

export interface AttendanceListResponseDto {
  summary: AttendanceSummaryDto;
  attendanceSheets: AttendanceListItemDto[];
}

export interface MarkAttendanceStudentRequestDto {
  studentId: string;
  status: AttendanceRecordStatus;

  checkInTime?: string | null;
  checkOutTime?: string | null;

  lateMinutes?: number;
  notes?: string | null;
}

export interface CreateAttendanceSheetRequestDto {
  sessionId: string;
  sessionCode: string;
  sessionTitle: string;

  sessionType: AttendanceSessionType;
  sportType: AttendanceSportType;

  date: string;
  dayOfWeek: AttendanceDayOfWeek;
  startTime: string;
  endTime: string;

  branchId: string;
  branchName: string;

  programId: string;
  programName: string;

  coachId: string;
  coachName: string;

  facilityId: string;
  facilityName: string;

  sessionStatus?: AttendanceSessionStatus;

  students: MarkAttendanceStudentRequestDto[];

  generalNotes?: string;
  markedBy?: string;
}

export interface UpdateAttendanceSheetRequestDto {
  sessionStatus?: AttendanceSessionStatus;

  students?: MarkAttendanceStudentRequestDto[];

  generalNotes?: string | null;

  markedBy?: string | null;
  markedAt?: string | null;

  lockedBy?: string | null;
  lockedAt?: string | null;
}

export interface DeleteAttendanceSheetResponseDto {
  id: string;
  deleted: boolean;
}

export interface AttendanceStatusCountDto {
  status: AttendanceRecordStatus;
  count: number;
  percentage: number;
}