"use client";
import Navbar from "../ui/navbar";
import { useState } from "react";
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  return (
    <div className="h-screen sm:flex bg-gray-100">
      <button
        onClick={() => setIsNavMenuOpen(prev => !prev)}
        className={`${
          isNavMenuOpen
            ? "bg-white text-indigo-500"
            : "bg-indigo-500  text-white"
        } fixed top-0 z-20 w-full h-12 text-center hover:bg-indigo-600 hover:text-gray-200 border border-indigo-500 sm:hidden`}
      >
        Stock Market Simulator
      </button>
      <div
        className={`${
          !isNavMenuOpen && "hidden sm:block"
        } fixed z-10 w-full sm:w-auto sm:relative sm:flex-none`}
      >
        <Navbar setIsNavMenuOpen={setIsNavMenuOpen}/>
      </div>

      <div
        className={`${
          !isNavMenuOpen ? "block" : "hidden"
        } mt-12 sm:mt-0 flex-1 sm:overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}
