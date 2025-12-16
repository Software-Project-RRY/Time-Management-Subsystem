"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { attendanceApi } from "@/lib/api/time-management";
import { MonthlyReportResponse } from "@/types/time-management";
import { Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportResponse | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user?.employeeId) {
      loadMyAttendance();
    }
  }, [user, selectedMonth, selectedYear]);

  const loadMyAttendance = async () => {
    if (!user?.employeeId) return;

    setLoading(true);
    try {
      const data = await attendanceApi.getMonthlyReport(
        user.employeeId,
        selectedMonth,
        selectedYear
      );
      setMonthlyReport(data);
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAttendancePercentage = () => {
    if (!monthlyReport) return 0;
    const { daysPresent, totalWorkingDays } = monthlyReport.summary;
    return totalWorkingDays > 0 ? Math.round((daysPresent / totalWorkingDays) * 100) : 0;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Attendance</h1>
          <p className="text-muted-foreground">
            View your attendance history and statistics
          </p>
        </div>

        {/* Period Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="grid gap-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2030"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
              <Button onClick={loadMyAttendance} disabled={loading}>
                {loading ? "Loading..." : "Load Attendance"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {monthlyReport && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getAttendancePercentage()}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthlyReport.summary.daysPresent} / {monthlyReport.summary.totalWorkingDays} days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Work Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatMinutes(monthlyReport.summary.totalWorkMinutes)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overtime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatMinutes(monthlyReport.summary.totalOvertimeMinutes)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Extra hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Late Arrivals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {monthlyReport.summary.totalLateCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Times late</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Indicators */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Days Present</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyReport.summary.daysPresent}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {monthlyReport.summary.daysAbsent}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {monthlyReport.summary.totalWorkingDays}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Records */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Records</CardTitle>
                <CardDescription>
                  Detailed punch-in/punch-out records for {format(new Date(selectedYear, selectedMonth - 1), "MMMM yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading records...</div>
                ) : monthlyReport.attendanceRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records found for this period
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Punches</TableHead>
                        <TableHead>Work Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exceptions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReport.attendanceRecords.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">
                            {record.createdAt && format(new Date(record.createdAt), "EEE, MMM dd")}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {record.punches.length === 0 ? (
                                <span className="text-sm text-muted-foreground">No punches</span>
                              ) : (
                                record.punches.map((punch, idx) => (
                                  <div key={idx} className="text-sm">
                                    <Badge
                                      variant={punch.type === "IN" ? "success" : "secondary"}
                                      className="mr-2 text-xs"
                                    >
                                      {punch.type}
                                    </Badge>
                                    {format(new Date(punch.time), "HH:mm:ss")}
                                  </div>
                                ))
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.totalWorkMinutes > 0 ? formatMinutes(record.totalWorkMinutes) : "-"}
                          </TableCell>
                          <TableCell>
                            {record.hasMissedPunch ? (
                              <Badge variant="destructive">Missed Punch</Badge>
                            ) : record.finalisedForPayroll ? (
                              <Badge variant="success">Complete</Badge>
                            ) : (
                              <Badge variant="warning">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.exceptionIds.length > 0 && (
                              <Badge variant="outline">
                                {record.exceptionIds.length} Exception(s)
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!monthlyReport && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Data Available</p>
                <p className="text-sm">Select a period to view your attendance records</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
