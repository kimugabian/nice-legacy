"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHome,
  IconBook,
  IconSettings,
} from "@tabler/icons-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;

  // menu default
  const navMain = [
    { title: "Home", url: "/", icon: IconHome },
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  ];

  // role-based menu
  if (role === "ADMIN") {
    navMain.push({ title: "Manage Courses", url: "/dashboard/admin/courses", icon: IconBook });
  }

  if (role === "TEACHER") {
    navMain.push({ title: "My Courses", url: "/dashboard/teacher/courses", icon: IconBook });
  }

  if (role === "STUDENT") {
    navMain.push({ title: "Enrolled Courses", url: "/dashboard/student", icon: IconBook });
  }

  const navSecondary = [
    { title: "Settings", url: "/settings", icon: IconSettings },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <span className="text-lg font-bold px-2">LMS</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
