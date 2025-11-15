import { Link, Form } from "@remix-run/react";
import { FileText, Home, Users, Settings, LogOut } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "~/components/ui/sidebar";

// Menu items for medical billing system
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Billing Records",
    url: "/billing",
    icon: FileText,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  username: string;
}

export function AppSidebar({ username }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Medical Billing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
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
        <div className="w-full flex items-center justify-between gap-2 px-2">
          <div className="text-sm text-gray-600">
            User: <span className="font-medium">{username}</span>
          </div>
          <Form method="post" action="/logout">
            <Button type="submit" variant="ghost" size="sm" className="gap-2">
              <LogOut />
              <span>Logout</span>
            </Button>
          </Form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
