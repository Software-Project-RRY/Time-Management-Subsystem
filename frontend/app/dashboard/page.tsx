"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { attendanceApi } from "@/lib/api/time-management";
import { Clock, Calendar, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [clockStatus, setClockStatus] = useState<string>("Not Clocked In");
  const [lastPunchTime, setLastPunchTime] = useState<string>("");

  useEffect(() => {
    if (user?.employeeId) {
      loadTodayStatus();
    }
  }, [user]);

  const loadTodayStatus = async () => {
    if (!user?.employeeId) return;

    try {
      const record = await attendanceApi.getTodayAttendance(user.employeeId);
      if (record && record.punches.length > 0) {
        const lastPunch = record.punches[record.punches.length - 1];
        setClockStatus(lastPunch.type === "IN" ? "Clocked In" : "Clocked Out");
        setLastPunchTime(format(new Date(lastPunch.time), "h:mm a"));
      }
    } catch (err) {
      console.error("Failed to load today's status:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-muted-foreground">
            Here's your time management overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clockStatus}</div>
              <p className="text-xs text-muted-foreground">
                {lastPunchTime ? `Last action: ${lastPunchTime}` : "Click to clock in"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22 Days</div>
              <p className="text-xs text-muted-foreground">Working days attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Direct reports</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No recent activity to display
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for easy access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Use the sidebar to navigate to different sections
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
