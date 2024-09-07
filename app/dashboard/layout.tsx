import { Suspense } from "react";
import SideNav from "../ui/sidenav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex bg-gray-100">
      <div className="flex-none">
        <SideNav />
      </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
