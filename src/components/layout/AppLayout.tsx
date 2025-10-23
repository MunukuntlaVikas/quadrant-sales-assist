import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopNav />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
