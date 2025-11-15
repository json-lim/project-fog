import { Outlet } from "@remix-run/react";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/layout/AppSidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="p-6">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
