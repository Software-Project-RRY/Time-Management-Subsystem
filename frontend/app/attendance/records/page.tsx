"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { attendanceApi } from "@/lib/api/time-management";
import { DailyReportResponse } from "@/types/time-management";
import { Calendar, Search, Download } from "lucide-react";
import { format } from "date-fns";

export default function AttendanceRecordsPage() {
  const [report, setReport] = useState<DailyReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await attendanceApi.getDailyReport(selectedDate);
      setReport(data);
    } catch (error) {
      console.error("Failed to load attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-muted-foreground">
            View and manage employee attendance records
          </p>
        </div>

        {/* Date Selection Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <Button onClick={loadReport}>
                <Search className="mr-2 h-4 w-4" />
                Load Records
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {report && (
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalPresent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalAbsent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalLate}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Missed Punches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalMissedPunch}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Records Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Attendance Report</CardTitle>
                <CardDescription>
                  {selectedDate && format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading records...</div>
            ) : !report || report.attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records found for this date
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Punches</TableHead>
                    <TableHead>Total Work Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Exceptions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.attendanceRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">
                        {record.employee ? (
                          <div>
                            <div>{record.employee.firstName} {record.employee.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              {record.employee.email}
                            </div>
                          </div>
                        ) : (
                          record.employeeId
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.punches.map((punch, idx) => (
                            <div key={idx} className="text-sm">
                              <Badge variant={punch.type === "IN" ? "success" : "secondary"} className="mr-2">
                                {punch.type}
                              </Badge>
                              {format(new Date(punch.time), "HH:mm:ss")}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatMinutes(record.totalWorkMinutes)}</TableCell>
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
                          <Badge variant="outline">{record.exceptionIds.length} Exception(s)</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
