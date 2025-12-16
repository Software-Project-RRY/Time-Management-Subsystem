"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceApi } from "@/lib/api/time-management";
import { MonthlyReportResponse } from "@/types/time-management";
import { FileText, Download, Calendar, Search } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"monthly" | "custom">("monthly");
  const [loading, setLoading] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportResponse | null>(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleGenerateMonthlyReport = async () => {
    setLoading(true);
    try {
      const data = await attendanceApi.getMonthlyReport(
        formData.employeeId,
        formData.month,
        formData.year
      );
      setMonthlyReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMonthName = (month: number) => {
    return format(new Date(2024, month - 1, 1), "MMMM");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Attendance Reports</h1>
          <p className="text-muted-foreground">
            Generate and export attendance reports for employees
          </p>
        </div>

        {/* Report Generation Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Report
            </CardTitle>
            <CardDescription>
              Select parameters to generate an attendance report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleGenerateMonthlyReport} disabled={loading || !formData.employeeId}>
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Results */}
        {monthlyReport && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {monthlyReport.summary.totalWorkingDays}
                  </div>
                  <p className="text-xs text-muted-foreground">Expected days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Days Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyReport.summary.daysPresent}
                  </div>
                  <p className="text-xs text-muted-foreground">Attended</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {monthlyReport.summary.daysAbsent}
                  </div>
                  <p className="text-xs text-muted-foreground">Not attended</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Late Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {monthlyReport.summary.totalLateCount}
                  </div>
                  <p className="text-xs text-muted-foreground">Times late</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Work Summary</CardTitle>
                <CardDescription>
                  Total hours and overtime for {getMonthName(monthlyReport.month)} {monthlyReport.year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Work Time</div>
                    <div className="text-2xl font-bold">
                      {formatMinutes(monthlyReport.summary.totalWorkMinutes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Overtime</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatMinutes(monthlyReport.summary.totalOvertimeMinutes)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Monthly Attendance Details
                    </CardTitle>
                    <CardDescription>
                      Employee: {monthlyReport.employeeId}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {monthlyReport.attendanceRecords.length === 0 ? (
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReport.attendanceRecords.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">
                            {record.createdAt && format(new Date(record.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {record.punches.map((punch, idx) => (
                                <div key={idx} className="text-sm">
                                  <Badge
                                    variant={punch.type === "IN" ? "success" : "secondary"}
                                    className="mr-2 text-xs"
                                  >
                                    {punch.type}
                                  </Badge>
                                  {format(new Date(punch.time), "HH:mm")}
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
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Report Generated</p>
                <p className="text-sm">Enter an employee ID and click "Generate Report" to view attendance data</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
