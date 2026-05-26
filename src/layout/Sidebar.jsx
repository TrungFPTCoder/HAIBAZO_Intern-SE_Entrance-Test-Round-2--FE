import { Collapse } from "antd";
import { Book, BookOpen, BookUser, Key, UserStar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../assets/Sidebar.css";

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const collapseItems = [
    {
      key: "books",
      label: (
        <span className="flex items-center gap-2.5 font-semibold text-zinc-300 tracking-wider text-xs">
          <Book className="h-4 w-4 text-violet-400" />
          <span>BOOKS</span>
        </span>
      ),
      children: (
        <div className="flex flex-col space-y-1.5 pl-1.5">
          <Link
            to="/books"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/books"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none! pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Book List
          </Link>
          <Link
            to="/books/create"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/books/create"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Create Book
          </Link>
        </div>
      ),
    },

    {
      key: "authors",
      label: (
        <span className="flex items-center gap-2.5 font-semibold text-zinc-300 tracking-wider text-xs">
          <BookUser className="h-4 w-4 text-violet-400" />
          <span>AUTHORS</span>
        </span>
      ),
      children: (
        <div className="flex flex-col space-y-1.5 pl-1.5">
          <Link
            to="/authors"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/authors"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none! pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Author List
          </Link>
          <Link
            to="/authors/create"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/authors/create"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Create Author
          </Link>
        </div>
      ),
    },

    {
      key: "reviews",
      label: (
        <span className="flex items-center gap-2.5 font-semibold text-zinc-300 tracking-wider text-xs">
          <UserStar className="h-4 w-4 text-violet-400" />
          <span>REVIEWS</span>
        </span>
      ),
      children: (
        <div className="flex flex-col space-y-1.5 pl-1.5">
          <Link
            to="/reviews"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/reviews"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none! pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Review List
          </Link>
          <Link
            to="/reviews/create"
            onClick={onClose}
            className={`text-sm! block! py-2! transition-all! ${
              location.pathname === "/reviews/create"
                ? "bg-violet-500/10! text-violet-400! font-semibold! border-l-2 border-violet-500! rounded-r-xl! rounded-l-none pl-1.5"
                : "text-zinc-400! hover:text-zinc-200! hover:bg-white/5! pl-3.5! rounded-xl!"
            }`}
          >
            Create Review
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col h-full bg-[#280a28] p-4 text-white">
      <Link to={"/"} className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-[#1f2438]">
        <div className="flex bg-purple-400 h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-650 to-indigo-650 text-white shadow-md shadow-violet-500/20">
          <BookOpen className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white select-none">
          Book<span className="text-violet-400">Review</span>
        </span>
      </Link>

      <Collapse
        items={collapseItems}
        defaultActiveKey={["books", "authors", "reviews"]}
        ghost
        expandIconPlacement="end"
        className="sidebar-collapse-custom flex-1"
      ></Collapse>
    </div>
  );
}
