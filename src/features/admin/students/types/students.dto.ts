export type StudentStatus = "active" | "inactive" | "suspended" | "archived";

export type PaymentStatus = "paid" | "pending" | "overdue" | "refunded";

export type SubscriptionStatus = "active" | "expired" | "expiring_soon" | "not_started";

export type Gender = "male" | "female";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "elite";

export interface StudentListItemDto {
  id: string;

  studentCode: string;
  fullName: string;
  age: number;
  gender: Gender;

  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;

  programId: string;
  programName: string;

  branchId: string;
  branchName: string;

  coachId: string;
  coachName: string;

  skillLevel: SkillLevel;

  status: StudentStatus;
  paymentStatus: PaymentStatus;
  subscriptionStatus: SubscriptionStatus;

  subscriptionStartDate: string;
  subscriptionEndDate: string;

  attendanceRate: number;
  lastAttendanceDate: string | null;

  medicalNotes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface StudentsSummaryDto {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  pendingPayments: number;
  overduePayments: number;
  expiredSubscriptions: number;
  expiringSoonSubscriptions: number;
}

export interface StudentsFiltersDto {
  search?: string;
  programId?: string;
  branchId?: string;
  coachId?: string;
  status?: StudentStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  subscriptionStatus?: SubscriptionStatus | "all";
  skillLevel?: SkillLevel | "all";
}

export interface StudentsListResponseDto {
  summary: StudentsSummaryDto;
  students: StudentListItemDto[];
  filters: {
    programs: FilterOptionDto[];
    branches: FilterOptionDto[];
    coaches: FilterOptionDto[];
  };
}

export interface FilterOptionDto {
  value: string;
  label: string;
}

export interface StudentDetailsDto extends StudentListItemDto {
  dateOfBirth: string;

  emergencyContactName: string | null;
  emergencyContactPhone: string | null;

  allergies: string | null;
  injuries: string | null;

  preferredTrainingDays: string[];
  preferredTrainingTime: string | null;

  documents: StudentDocumentDto[];
  recentAttendance: StudentAttendanceDto[];
  progressNotes: StudentProgressNoteDto[];
  paymentHistory: StudentPaymentDto[];
}

export interface StudentDocumentDto {
  id: string;
  title: string;
  type: "medical" | "consent" | "id" | "other";
  url: string;
  uploadedAt: string;
}

export interface StudentAttendanceDto {
  id: string;
  sessionDate: string;
  programName: string;
  coachName: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface StudentProgressNoteDto {
  id: string;
  coachName: string;
  title: string;
  note: string;
  rating: number;
  createdAt: string;
}

export interface StudentPaymentDto {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: "AED";
  status: PaymentStatus;
  paidAt: string | null;
  dueDate: string;
}

export interface CreateStudentRequestDto {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;

  parentId?: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;

  programId: string;
  branchId: string;
  coachId?: string;

  skillLevel: SkillLevel;

  medicalNotes?: string;
  allergies?: string;
  injuries?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  preferredTrainingDays?: string[];
  preferredTrainingTime?: string;
}

export interface UpdateStudentRequestDto extends Partial<CreateStudentRequestDto> {
  status?: StudentStatus;
  paymentStatus?: PaymentStatus;
  subscriptionStatus?: SubscriptionStatus;
}

export interface DeleteStudentResponseDto {
  id: string;
  deleted: boolean;
}