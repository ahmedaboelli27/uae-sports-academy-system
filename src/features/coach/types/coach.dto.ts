export type CoachSessionStatus =
  | 'scheduled'
  | 'inProgress'
  | 'completed'
  | 'attendancePending'
  | 'cancelled';

export type CoachPlayerStatus =
  | 'active'
  | 'needsFollowUp'
  | 'excellent'
  | 'inactive';

export type CoachTaskPriority = 'high' | 'medium' | 'low';

export type CoachSkillStatus = 'excellent' | 'good' | 'needsWork';

export type CoachNoteType =
  | 'development'
  | 'skill'
  | 'attendance'
  | 'behavior'
  | 'followUp';

export type CoachNotePriority = 'low' | 'medium' | 'high';

export type CoachNoteVisibility = 'coachOnly' | 'adminParent';

export interface CoachProfileDto {
  id: string;
  name: string;
  specialization: string;
  branch: string;
  levels: string[];
  rating: number;
}

export interface CoachSessionDto {
  id: string;
  assignedCoachIds: string[];
  title: string;
  program: string;
  branch: string;
  court: string;
  time: string;
  duration: string;
  level: string;
  status: CoachSessionStatus;
  assignedPlayers: number;
  attendanceMarked: number;
  capacity: number;
}

export interface CoachSkillSummaryDto {
  name: string;
  score: number;
  status: CoachSkillStatus;
}

export interface CoachAssignedPlayerDto {
  id: string;
  assignedCoachIds: string[];
  name: string;
  age: number;
  program: string;
  group: string;
  branch: string;
  level: string;
  status: CoachPlayerStatus;
  parentName: string;
  attendanceRate: number;
  progressScore: number;
  skillScore: number;
  sessionsAttended: number;
  totalSessions: number;
  lastSession: string;
  nextSession: string;
  latestNote: string;
  coachRecommendation: string;
  strengths: string[];
  improvementAreas: string[];
  skills: CoachSkillSummaryDto[];
}

export interface CoachProgressNoteDto {
  id: string;
  studentId: string;
  sessionId: string;
  coachId: string;
  date: string;
  type: CoachNoteType;
  priority: CoachNotePriority;
  visibility: CoachNoteVisibility;
  rating: number;
  title: string;
  note: string;
  recommendation: string;
  followUpRequired: boolean;
}

export interface CoachTaskDto {
  id: string;
  coachId: string;
  title: string;
  description: string;
  priority: CoachTaskPriority;
  due: string;
  href: string;
}

export interface CoachAttendanceTrendPointDto {
  day: string;
  attendance: number;
  completion: number;
}

export interface CoachCapacityPointDto {
  name: string;
  assigned: number;
  remaining: number;
}

export interface CoachDashboardSummaryDto {
  totalSessions: number;
  totalAssignedPlayers: number;
  attendancePending: number;
  attendanceCompletion: number;
  averageAttendance: number;
  pendingNotes: number;
}

export interface CoachStatusBreakdownPointDto {
  name: string;
  value: number;
  color: string;
}

export type CoachSkillCategory = 'technical' | 'tactical' | 'physical' | 'mental';

export interface CoachSkillAssessmentDto {
  id: string;
  studentId: string;
  coachId: string;
  date: string;
  skillName: string;
  category: CoachSkillCategory;
  currentScore: number;
  targetScore: number;
  status: CoachSkillStatus;
  note: string;
  recommendation: string;
}

export type CoachIncidentType =
  | 'safety'
  | 'behavior'
  | 'attendance'
  | 'equipment'
  | 'medical'
  | 'other';

export type CoachIncidentSeverity = 'low' | 'medium' | 'high';

export type CoachIncidentStatus =
  | 'open'
  | 'underReview'
  | 'resolved'
  | 'closed';

export interface CoachIncidentReportDto {
  id: string;
  studentId: string;
  sessionId: string;
  coachId: string;
  date: string;
  type: CoachIncidentType;
  severity: CoachIncidentSeverity;
  status: CoachIncidentStatus;
  title: string;
  description: string;
  immediateAction: string;
  adminNotified: boolean;
  parentFollowUpRequired: boolean;
  reviewedByAdmin: boolean;
  resolutionNote: string;
}