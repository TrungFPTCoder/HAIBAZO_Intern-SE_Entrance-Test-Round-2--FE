import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AppBreadcrumb from "../components/AppBreadcrumb";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-800 transition-colors duration-300">
      {/* Navigation bar */}
      <Navbar />

      {/* Main page content area */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AppBreadcrumb />
        <Outlet />
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-150/80 bg-white py-8 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-zinc-900">
              Book<span className="text-violet-600">Review</span>
            </span>
            <span className="text-xs text-zinc-400">| Đánh giá sách từ cộng đồng</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
