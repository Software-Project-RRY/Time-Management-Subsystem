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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shiftAssignmentApi, shiftDefinitionApi } from "@/lib/api/time-management";
import { ShiftAssignment, ShiftDefinition, ShiftAssignmentStatus } from "@/types/time-management";
import { Plus, UserCog, Check } from "lucide-react";
import { format } from "date-fns";

export default function ShiftAssignmentsPage() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shifts, setShifts] = useState<ShiftDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    shiftId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsData, shiftsData] = await Promise.all([
        shiftAssignmentApi.getAll(),
        shiftDefinitionApi.getAll(),
      ]);
      setAssignments(assignmentsData);
      setShifts(shiftsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shiftAssignmentApi.assign({
        ...formData,
        endDate: formData.endDate || undefined,
      });
      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to assign shift:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      employeeId: "",
      shiftId: "",
      startDate: "",
      endDate: "",
    });
  };

  const getShiftName = (shiftId: string) => {
    const shift = shifts.find((s) => s._id === shiftId);
    return shift ? shift.name : "Unknown";
  };

  const handleApprove = async (assignmentId: string) => {
    try {
      await shiftAssignmentApi.update(assignmentId, {
        status: ShiftAssignmentStatus.APPROVED,
      });
      await loadData();
    } catch (error) {
      console.error("Failed to approve assignment:", error);
      alert("Failed to approve shift assignment");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shift Assignments</h1>
            <p className="text-muted-foreground">
              Assign shifts to employees and manage schedules
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Assign Shift to Employee</DialogTitle>
                  <DialogDescription>
                    Select an employee and shift to create an assignment
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="shiftId">Shift</Label>
                    <Select
                      value={formData.shiftId}
                      onValueChange={(value) => setFormData({ ...formData, shiftId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift._id} value={shift._id}>
                            {shift.name} ({shift.startTime} - {shift.endTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">Assign Shift</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Current Shift Assignments
            </CardTitle>
            <CardDescription>
              All active and scheduled shift assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No shift assignments yet. Click "Assign Shift" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment._id}>
                      <TableCell className="font-medium">
                        {assignment.employeeId}
                      </TableCell>
                      <TableCell>{getShiftName(assignment.shiftId)}</TableCell>
                      <TableCell>
                        {format(new Date(assignment.startDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {assignment.endDate
                          ? format(new Date(assignment.endDate), "MMM dd, yyyy")
                          : "Ongoing"}
                      </TableCell>
                      <TableCell>
                        {assignment.status === ShiftAssignmentStatus.APPROVED ? (
                          <Badge variant="success">Approved</Badge>
                        ) : assignment.status === ShiftAssignmentStatus.PENDING ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : assignment.status === ShiftAssignmentStatus.CANCELLED ? (
                          <Badge variant="destructive">Cancelled</Badge>
                        ) : (
                          <Badge variant="outline">Expired</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {assignment.status === ShiftAssignmentStatus.PENDING && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(assignment._id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
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
