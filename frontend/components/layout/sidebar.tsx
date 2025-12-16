"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Clock,
  Calendar,
  Users,
  Settings,
  FileText,
  ClipboardCheck,
  AlertCircle,
  BarChart3,
  CalendarClock,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[]; // Roles that can see this item
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Clock In/Out",
    href: "/attendance/clock",
    icon: Clock,
  },
  {
    title: "My Attendance",
    href: "/attendance/my",
    icon: CalendarClock,
  },
  {
    title: "Attendance Records",
    href: "/attendance/records",
    icon: ClipboardCheck,
    roles: ["HR Manager", "department head", "System Admin"],
  },
  {
    title: "Correction Requests",
    href: "/attendance/corrections",
    icon: AlertCircle,
  },
  {
    title: "Shifts",
    href: "/shifts",
    icon: Calendar,
    roles: ["HR Manager", "System Admin"],
  },
  {
    title: "Shift Assignments",
    href: "/shifts/assignments",
    icon: UserCog,
    roles: ["HR Manager", "System Admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["HR Manager", "department head", "System Admin"],
  },
  {
    title: "Rules & Policies",
    href: "/policies",
    icon: Settings,
    roles: ["HR Manager", "System Admin"],
  },
  {
    title: "Holidays",
    href: "/holidays",
    icon: Calendar,
    roles: ["HR Manager", "System Admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Clock className="h-6 w-6" />
          <span>Time Management</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
