"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, LayoutGrid, Lock, Mic2, Radio, DoorOpen, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Événement", url: "/events/ev1", icon: Calendar },
  { title: "Planning", url: "/events/ev1/planning", icon: LayoutGrid },
  { title: "Sessions live", url: "/live", icon: Radio },
  { title: "Salles", url: "/rooms", icon: DoorOpen },
  { title: "Speakers", url: "/speakers", icon: Mic2 },
  { title: "Favoris", url: "/favorites", icon: Star },
  { title: "Admin", url: "/admin", icon: Lock },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname() ?? "/";
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-7 pt-4 pb-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center btn-glow">
              <Radio className="h-4 w-4 text-primary-foreground animate-pulse" />
              <span aria-hidden className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-live animate-ping" />
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-lg tracking-tight text-shimmer">EventFlow</span>
            )}
          </Link>
        </div>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}