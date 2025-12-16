// Enums matching backend
export enum PunchType {
  IN = "IN",
  OUT = "OUT",
}

export enum CorrectionStatus {
  PENDING = "PENDING",
  MANAGER_APPROVED = "MANAGER_APPROVED",
  HR_APPROVED = "HR_APPROVED",
  REJECTED = "REJECTED",
}

// ShiftType is now a model, not an enum
export interface ShiftTypeModel {
  _id: string;
  name: string;
  active: boolean;
}

export interface CreateShiftTypeDto {
  name: string;
  active?: boolean;
}

export interface UpdateShiftTypeDto extends Partial<CreateShiftTypeDto> {}

export enum OvertimeRuleType {
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
  HOLIDAY = "HOLIDAY",
}

// DTOs matching backend
export interface ClockInDto {
  employeeId: string;
  timestamp?: string;
}

export interface ClockOutDto {
  employeeId: string;
  timestamp?: string;
}

export interface CorrectionDto {
  clockIn?: string;
  clockOut?: string;
  managerId: string;
  correctionReason: string;
}

export interface CreateCorrectionDto {
  attendanceRecordId: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  employeeId: string;
}

// Models matching backend schemas
export interface Punch {
  type: PunchType;
  time: Date | string;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  punches: Punch[];
  totalWorkMinutes: number;
  hasMissedPunch: boolean;
  exceptionIds: string[];
  finalisedForPayroll: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceCorrectionRequest {
  _id: string;
  attendanceRecordId: string;
  employeeId: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  status: CorrectionStatus;
  managerApprovalDate?: string;
  hrApprovalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftDefinition {
  _id: string;
  name: string;
  shiftType: string; // MongoDB ObjectId reference
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  graceInMinutes?: number;
  graceOutMinutes?: number;
  punchPolicy?: string;
  requiresApprovalForOvertime?: boolean;
  active: boolean;
}

export enum ShiftAssignmentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface ShiftAssignment {
  _id: string;
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
  status: ShiftAssignmentStatus;
  isActive?: boolean;
}

export interface OvertimeRule {
  _id: string;
  name: string;
  type: OvertimeRuleType;
  multiplier: number;
  minimumMinutes: number;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface LatenessRule {
  _id: string;
  name: string;
  gracePeriodMinutes: number;
  thresholds: {
    minutes: number;
    penalty: string;
  }[];
  isActive: boolean;
}

export interface Holiday {
  _id: string;
  name: string;
  date: string;
  isRecurring: boolean;
  affectsAttendance: boolean;
}

export interface TimeException {
  _id: string;
  employeeId: string;
  date: string;
  type: string;
  reason: string;
  status: string;
  approvedBy?: string;
  createdAt: string;
}

// Response types
export interface DailyReportResponse {
  date: string;
  attendanceRecords: (AttendanceRecord & {
    employee?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  })[];
  summary: {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalMissedPunch: number;
  };
}

export interface MonthlyReportResponse {
  employeeId: string;
  month: number;
  year: number;
  attendanceRecords: AttendanceRecord[];
  summary: {
    totalWorkingDays: number;
    daysPresent: number;
    daysAbsent: number;
    totalLateCount: number;
    totalOvertimeMinutes: number;
    totalWorkMinutes: number;
  };
}

// Create/Update DTOs
export interface CreateShiftDto {
  name: string;
  shiftType: string; // MongoDB ObjectId
  startTime: string;
  endTime: string;
  graceInMinutes?: number;
  graceOutMinutes?: number;
  punchPolicy?: string;
  requiresApprovalForOvertime?: boolean;
  active?: boolean;
}

export interface UpdateShiftDto extends Partial<CreateShiftDto> {}

export interface AssignShiftDto {
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
}

export interface CreateOvertimeRuleDto {
  name: string;
  type: OvertimeRuleType;
  multiplier: number;
  minimumMinutes: number;
  requiresApproval: boolean;
}

export interface UpdateOvertimeRuleDto extends Partial<CreateOvertimeRuleDto> {}

export interface CreateLatenessRuleDto {
  name: string;
  gracePeriodMinutes: number;
  thresholds: {
    minutes: number;
    penalty: string;
  }[];
}

export interface CreateHolidayDto {
  name: string;
  date: string;
  isRecurring: boolean;
  affectsAttendance: boolean;
}
