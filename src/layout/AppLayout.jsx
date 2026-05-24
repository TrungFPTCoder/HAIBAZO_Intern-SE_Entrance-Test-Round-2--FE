import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AppBreadcrumb from "../components/AppBreadcrumb";
import { Drawer } from "antd";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-zinc-50 text-zinc-800 transition-colors duration-300">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-[#1f2438] bg-[#0d0f17] h-screen sticky top-0 shrink-0 select-none">
        <Sidebar />
      </aside>

      {/* 2. Mobile Drawer Sidebar */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        styles={{ body: { padding: 0 } }}
        size={280}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </Drawer>

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Minimalist Header */}
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AppBreadcrumb />
          <Outlet />
        </main>

        {/* Minimalist Footer */}
        <footer className="border-t border-zinc-150/80 bg-white py-6 transition-all mt-auto">
          <div className="px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-zinc-900">
                Book<span className="text-violet-600">Review</span>
              </span>
              <span className="text-xs text-zinc-400">| © 2026 Haibazo Book review</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
