import { apiClient } from "../api-client";
import type {
  ClockInDto,
  ClockOutDto,
  AttendanceRecord,
  DailyReportResponse,
  MonthlyReportResponse,
  AttendanceCorrectionRequest,
  CreateCorrectionDto,
  ShiftDefinition,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftAssignment,
  AssignShiftDto,
  OvertimeRule,
  CreateOvertimeRuleDto,
  UpdateOvertimeRuleDto,
  LatenessRule,
  CreateLatenessRuleDto,
  Holiday,
  CreateHolidayDto,
  TimeException,
  ShiftTypeModel,
  CreateShiftTypeDto,
  UpdateShiftTypeDto,
} from "@/types/time-management";

// ==================== ATTENDANCE ====================
export const attendanceApi = {
  async clockIn(data: ClockInDto): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>(
      "/attendance/clock-in",
      data
    );
    return response.data;
  },

  async clockOut(data: ClockOutDto): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>(
      "/attendance/clock-out",
      data
    );
    return response.data;
  },

  async getDailyReport(date: string): Promise<DailyReportResponse> {
    const response = await apiClient.get<DailyReportResponse>(
      "/attendance/daily-report",
      {
        params: { date },
      }
    );
    return response.data;
  },

  async getMonthlyReport(
    employeeId: string,
    month: number,
    year: number
  ): Promise<MonthlyReportResponse> {
    const response = await apiClient.get<MonthlyReportResponse>(
      "/attendance/monthly-report",
      {
        params: { employeeId, month, year },
      }
    );
    return response.data;
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    const response = await apiClient.get<AttendanceRecord | null>(
      "/attendance/today",
      {
        params: { employeeId },
      }
    );
    return response.data;
  },
};

// ==================== ATTENDANCE CORRECTIONS ====================
export const correctionApi = {
  async createRequest(
    data: CreateCorrectionDto
  ): Promise<AttendanceCorrectionRequest> {
    const response = await apiClient.post<AttendanceCorrectionRequest>(
      "/attendance/corrections",
      data
    );
    return response.data;
  },

  async getAllRequests(): Promise<AttendanceCorrectionRequest[]> {
    const response = await apiClient.get<AttendanceCorrectionRequest[]>(
      "/attendance/corrections"
    );
    return response.data;
  },

  async approveByManager(id: string): Promise<AttendanceCorrectionRequest> {
    const response = await apiClient.patch<AttendanceCorrectionRequest>(
      `/attendance/corrections/${id}/manager`
    );
    return response.data;
  },

  async approveByHR(id: string): Promise<AttendanceCorrectionRequest> {
    const response = await apiClient.patch<AttendanceCorrectionRequest>(
      `/attendance/corrections/${id}/hr`
    );
    return response.data;
  },

  async reject(id: string): Promise<AttendanceCorrectionRequest> {
    const response = await apiClient.patch<AttendanceCorrectionRequest>(
      `/attendance/corrections/${id}/reject`
    );
    return response.data;
  },
};

// ==================== SHIFT DEFINITIONS ====================
export const shiftDefinitionApi = {
  async create(data: CreateShiftDto): Promise<ShiftDefinition> {
    const response = await apiClient.post<ShiftDefinition>(
      "/shift-definitions",
      data
    );
    return response.data;
  },

  async getAll(): Promise<ShiftDefinition[]> {
    const response = await apiClient.get<ShiftDefinition[]>(
      "/shift-definitions"
    );
    return response.data;
  },

  async getById(id: string): Promise<ShiftDefinition> {
    const response = await apiClient.get<ShiftDefinition>(
      `/shift-definitions/${id}`
    );
    return response.data;
  },

  async update(id: string, data: UpdateShiftDto): Promise<ShiftDefinition> {
    const response = await apiClient.patch<ShiftDefinition>(
      `/shift-definitions/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/shift-definitions/${id}`);
  },
};

// ==================== SHIFT TYPES ====================
export const shiftTypeApi = {
  async create(data: CreateShiftTypeDto): Promise<ShiftTypeModel> {
    const response = await apiClient.post<ShiftTypeModel>("/shift-types", data);
    return response.data;
  },

  async getAll(): Promise<ShiftTypeModel[]> {
    const response = await apiClient.get<ShiftTypeModel[]>("/shift-types");
    return response.data;
  },

  async getById(id: string): Promise<ShiftTypeModel> {
    const response = await apiClient.get<ShiftTypeModel>(`/shift-types/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateShiftTypeDto): Promise<ShiftTypeModel> {
    const response = await apiClient.patch<ShiftTypeModel>(`/shift-types/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/shift-types/${id}`);
  },
};

// ==================== SHIFT ASSIGNMENTS ====================
export const shiftAssignmentApi = {
  async assign(data: AssignShiftDto): Promise<ShiftAssignment> {
    const response = await apiClient.post<ShiftAssignment>(
      "/shifts/assign",
      data
    );
    return response.data;
  },

  async getMyShifts(employeeId: string): Promise<ShiftAssignment[]> {
    const response = await apiClient.get<ShiftAssignment[]>("/shifts/my", {
      params: { employeeId },
    });
    return response.data;
  },

  async getAll(): Promise<ShiftAssignment[]> {
    const response = await apiClient.get<ShiftAssignment[]>("/shifts");
    return response.data;
  },

  async getById(id: string): Promise<ShiftAssignment> {
    const response = await apiClient.get<ShiftAssignment>(`/shifts/${id}`);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<AssignShiftDto>
  ): Promise<ShiftAssignment> {
    const response = await apiClient.patch<ShiftAssignment>(
      `/shifts/${id}`,
      data
    );
    return response.data;
  },
};

// ==================== OVERTIME RULES ====================
export const overtimeRuleApi = {
  async create(data: CreateOvertimeRuleDto): Promise<OvertimeRule> {
    const response = await apiClient.post<OvertimeRule>(
      "/overtime-rules",
      data
    );
    return response.data;
  },

  async getAll(): Promise<OvertimeRule[]> {
    const response = await apiClient.get<OvertimeRule[]>("/overtime-rules");
    return response.data;
  },

  async getById(id: string): Promise<OvertimeRule> {
    const response = await apiClient.get<OvertimeRule>(`/overtime-rules/${id}`);
    return response.data;
  },

  async update(
    id: string,
    data: UpdateOvertimeRuleDto
  ): Promise<OvertimeRule> {
    const response = await apiClient.patch<OvertimeRule>(
      `/overtime-rules/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/overtime-rules/${id}`);
  },
};

// ==================== LATENESS RULES ====================
export const latenessRuleApi = {
  async create(data: CreateLatenessRuleDto): Promise<LatenessRule> {
    const response = await apiClient.post<LatenessRule>(
      "/lateness-rules",
      data
    );
    return response.data;
  },

  async getAll(): Promise<LatenessRule[]> {
    const response = await apiClient.get<LatenessRule[]>("/lateness-rules");
    return response.data;
  },

  async getById(id: string): Promise<LatenessRule> {
    const response = await apiClient.get<LatenessRule>(
      `/lateness-rules/${id}`
    );
    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreateLatenessRuleDto>
  ): Promise<LatenessRule> {
    const response = await apiClient.patch<LatenessRule>(
      `/lateness-rules/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/lateness-rules/${id}`);
  },
};

// ==================== HOLIDAYS ====================
export const holidayApi = {
  async create(data: CreateHolidayDto): Promise<Holiday> {
    const response = await apiClient.post<Holiday>("/holidays", data);
    return response.data;
  },

  async getAll(): Promise<Holiday[]> {
    const response = await apiClient.get<Holiday[]>("/holidays");
    return response.data;
  },

  async getById(id: string): Promise<Holiday> {
    const response = await apiClient.get<Holiday>(`/holidays/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<CreateHolidayDto>): Promise<Holiday> {
    const response = await apiClient.patch<Holiday>(`/holidays/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/holidays/${id}`);
  },
};

// ==================== TIME EXCEPTIONS ====================
export const timeExceptionApi = {
  async getAll(): Promise<TimeException[]> {
    const response = await apiClient.get<TimeException[]>("/time-exceptions");
    return response.data;
  },

  async getById(id: string): Promise<TimeException> {
    const response = await apiClient.get<TimeException>(
      `/time-exceptions/${id}`
    );
    return response.data;
  },
};
