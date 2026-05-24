import React from "react";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-150/80 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Toggle Button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Title: Haibazo Book review */}
        <h1 className="text-xl font-bold text-zinc-800 tracking-tight text-center md:text-left w-full">
          Haibazo Book review
        </h1>

        {/* Spacer for mobile alignment */}
        <div className="w-8 md:hidden"></div>
      </div>
    </header>
  );
}
