"use client";
import SideNav from "../ui/sidenav";
import { useState } from "react";
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(true);
  return (
    <div className="min-h-screen sm:h-screen sm:flex bg-gray-100">
      <button
        onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
        className={`${!isNavMenuOpen ? "bg-white text-indigo-500" : "bg-indigo-500  text-white"} fixed top-0 w-full h-12 text-center hover:bg-indigo-600 hover:text-gray-200 border border-indigo-500 sm:hidden`}
      >
        Stock Market Simulator
      </button>
      <div className={`${isNavMenuOpen && "hidden"} sm:block sm:flex-none`}>
        <SideNav />
      </div>
      <div
        className={`${
          isNavMenuOpen ? "mt-12" : "mt-0"
        } sm:mt-0 flex-1 sm:overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}
