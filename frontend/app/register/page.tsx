"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { authService } from "@/lib/auth";
import { useAuth } from "@/contexts/auth-context";

enum SystemRole {
  DEPARTMENT_EMPLOYEE = "department employee",
  DEPARTMENT_HEAD = "department head",
  HR_MANAGER = "HR Manager",
  HR_EMPLOYEE = "HR Employee",
  PAYROLL_SPECIALIST = "Payroll Specialist",
  PAYROLL_MANAGER = "Payroll Manager",
  SYSTEM_ADMIN = "System Admin",
  LEGAL_POLICY_ADMIN = "Legal & Policy Admin",
  RECRUITER = "Recruiter",
  FINANCE_STAFF = "Finance Staff",
  JOB_CANDIDATE = "Job Candidate",
  HR_ADMIN = "HR Admin",
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    employeeNumber: "",
    dateOfHire: "",
    role: SystemRole.DEPARTMENT_EMPLOYEE,
  });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard (only once, not in useEffect)
  if (user) {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.register(formData);
      // Registration automatically logs the user in (JWT cookie is set)
      // Redirect to dashboard instead of login to avoid redirect loop
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Register a new user for the Time Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  minLength={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input
                  id="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfHire">Date of Hire</Label>
              <Input
                id="dateOfHire"
                type="date"
                value={formData.dateOfHire}
                onChange={(e) => setFormData({ ...formData, dateOfHire: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">System Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as SystemRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SystemRole.DEPARTMENT_EMPLOYEE}>Department Employee</SelectItem>
                  <SelectItem value={SystemRole.DEPARTMENT_HEAD}>Department Head</SelectItem>
                  <SelectItem value={SystemRole.HR_MANAGER}>HR Manager</SelectItem>
                  <SelectItem value={SystemRole.HR_EMPLOYEE}>HR Employee</SelectItem>
                  <SelectItem value={SystemRole.PAYROLL_SPECIALIST}>Payroll Specialist</SelectItem>
                  <SelectItem value={SystemRole.PAYROLL_MANAGER}>Payroll Manager</SelectItem>
                  <SelectItem value={SystemRole.SYSTEM_ADMIN}>System Admin</SelectItem>
                  <SelectItem value={SystemRole.LEGAL_POLICY_ADMIN}>Legal/Policy Admin</SelectItem>
                  <SelectItem value={SystemRole.RECRUITER}>Recruiter</SelectItem>
                  <SelectItem value={SystemRole.FINANCE_STAFF}>Finance Staff</SelectItem>
                  <SelectItem value={SystemRole.JOB_CANDIDATE}>Job Candidate</SelectItem>
                  <SelectItem value={SystemRole.HR_ADMIN}>HR Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                For testing: Use "System Admin" for full access, "HR Manager" for HR features, "department head" for manager features, or "department employee" for basic access
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
