import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/layout/AppSidebar";
import { requireAuth } from "~/lib/authUtils";

// This loader runs before rendering any _app.* routes
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const auth = await requireAuth(request);
    return { authenticated: true, username: auth.username };
  } catch {
    // Not authenticated, redirect to login
    const url = new URL(request.url);
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
}

export default function AppLayout() {
  const { username } = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar username={username} />
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
