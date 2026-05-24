import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div className="relative mb-8">
        {/* Glow Effects */}
        <div className="absolute -inset-4 rounded-full bg-violet-600/10 blur-xl"></div>
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-500/15 blur-2xl"></div>

        <h1 className="relative text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-indigo-600 tracking-tight leading-none selection:bg-transparent">
          404
        </h1>
      </div>

      <div className="space-y-3 max-w-md mb-8">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Ồ! Trang này không tồn tại
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm md:text-base leading-relaxed">
          Đường dẫn có thể đã bị thay đổi, bị xóa, hoặc bạn đã gõ nhầm địa chỉ URL. Hãy quay về trang chủ để tiếp tục khám phá nhé.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-bold px-6 py-3.5 transition-all shadow-md shadow-violet-500/20 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      >
        <Home className="h-5 w-5" />
        <span>Quay về trang chủ</span>
      </Link>
    </div>
  );
}
