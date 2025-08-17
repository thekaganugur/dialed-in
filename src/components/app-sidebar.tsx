"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart3, Bean, Coffee, Home, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

const navigationItems = [
  {
    title: "Brews",
    href: "/app/brews",
    icon: Coffee,
  },
  {
    title: "Beans",
    href: "/app/beans",
    icon: Bean,
  },
  {
    title: "Methods",
    href: "/app/methods",
    icon: Zap,
  },
  {
    title: "Analytics",
    href: "/app/analytics",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const pathName = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathName === "/app"}>
              <Link href="/app" aria-label="Go to dashboard">
                <Home className="h-4 w-4" />
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-base font-bold text-transparent">
                  Dialed In
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathName === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
