"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { correctionApi } from "@/lib/api/time-management";
import { AttendanceCorrectionRequest, CorrectionStatus } from "@/types/time-management";
import { useAuth } from "@/contexts/auth-context";
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function CorrectionsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AttendanceCorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    attendanceRecordId: "",
    requestedClockIn: "",
    requestedClockOut: "",
    reason: "",
    employeeId: user?.employeeId || "",
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await correctionApi.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load correction requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await correctionApi.createRequest({
        ...formData,
        employeeId: user?.employeeId || formData.employeeId,
      });
      await loadRequests();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to create correction request:", error);
    }
  };

  const handleApproveByManager = async (id: string) => {
    try {
      await correctionApi.approveByManager(id);
      await loadRequests();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleApproveByHR = async (id: string) => {
    try {
      await correctionApi.approveByHR(id);
      await loadRequests();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await correctionApi.reject(id);
      await loadRequests();
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      attendanceRecordId: "",
      requestedClockIn: "",
      requestedClockOut: "",
      reason: "",
      employeeId: user?.employeeId || "",
    });
  };

  const getStatusBadge = (status: CorrectionStatus) => {
    switch (status) {
      case CorrectionStatus.PENDING:
        return <Badge variant="warning">Pending</Badge>;
      case CorrectionStatus.MANAGER_APPROVED:
        return <Badge variant="secondary">Manager Approved</Badge>;
      case CorrectionStatus.HR_APPROVED:
        return <Badge variant="success">HR Approved</Badge>;
      case CorrectionStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const canApproveAsManager = user?.role === "DEPARTMENT_MANAGER" || user?.role === "HR_MANAGER";
  const canApproveAsHR = user?.role === "HR_MANAGER" || user?.role === "SYSTEM_ADMIN";

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance Corrections</h1>
            <p className="text-muted-foreground">
              Request and manage attendance corrections
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Request Attendance Correction</DialogTitle>
                  <DialogDescription>
                    Submit a request to correct your attendance record
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="attendanceRecordId">Attendance Record ID</Label>
                    <Input
                      id="attendanceRecordId"
                      value={formData.attendanceRecordId}
                      onChange={(e) => setFormData({ ...formData, attendanceRecordId: e.target.value })}
                      placeholder="Enter record ID"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requestedClockIn">Requested Clock In</Label>
                    <Input
                      id="requestedClockIn"
                      type="datetime-local"
                      value={formData.requestedClockIn}
                      onChange={(e) => setFormData({ ...formData, requestedClockIn: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requestedClockOut">Requested Clock Out</Label>
                    <Input
                      id="requestedClockOut"
                      type="datetime-local"
                      value={formData.requestedClockOut}
                      onChange={(e) => setFormData({ ...formData, requestedClockOut: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Explain why correction is needed"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Correction Requests
            </CardTitle>
            <CardDescription>
              All attendance correction requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No correction requests found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Requested Times</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        {request.employeeId}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {request.requestedClockIn && (
                            <div>
                              <span className="text-muted-foreground">In:</span>{" "}
                              {format(new Date(request.requestedClockIn), "MMM dd, HH:mm")}
                            </div>
                          )}
                          {request.requestedClockOut && (
                            <div>
                              <span className="text-muted-foreground">Out:</span>{" "}
                              {format(new Date(request.requestedClockOut), "MMM dd, HH:mm")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {request.status === CorrectionStatus.PENDING && canApproveAsManager && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveByManager(request._id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {request.status === CorrectionStatus.MANAGER_APPROVED && canApproveAsHR && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveByHR(request._id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {(request.status === CorrectionStatus.PENDING ||
                            request.status === CorrectionStatus.MANAGER_APPROVED) &&
                            (canApproveAsManager || canApproveAsHR) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(request._id)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
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
