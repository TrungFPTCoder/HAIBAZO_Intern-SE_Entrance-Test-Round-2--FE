import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Dropdown } from "antd";
import { BookOpen, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/books", label: "Sách", dropdown: true },
    { to: "/authors", label: "Tác Giả", dropdown: true },
    { to: "/reviews", label: "Bản Tin Review", dropdown: true },
  ];

  const bookItems = [
    {
      key: "list",
      label: (
        <Link
          to="/books"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Danh sách Sách
        </Link>
      ),
    },
    {
      key: "create",
      label: (
        <Link
          to="/books/create"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Thêm Sách Mới
        </Link>
      ),
    },
  ];

  const authorItems = [
    {
      key: "list",
      label: (
        <Link
          to="/authors"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Danh sách Tác Giả
        </Link>
      ),
    },
    {
      key: "create",
      label: (
        <Link
          to="/authors/create"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Thêm Tác Giả Mới
        </Link>
      ),
    },
  ];

  const reviewItems = [
    {
      key: "list",
      label: (
        <Link
          to="/reviews"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Danh sách Đánh Giá
        </Link>
      ),
    },
    {
      key: "create",
      label: (
        <Link
          to="/reviews/create"
          className="font-semibold text-zinc-700 hover:text-violet-600"
        >
          Thêm Đánh Giá Mới
        </Link>
      ),
    },
  ];

  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-150/85 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-650 text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900 bg-clip-text">
                Book<span className="text-violet-600">Review</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname.startsWith(link.to) &&
                (link.to !== "/" || location.pathname === "/");
              const activeClass = isActive
                ? "bg-violet-50 text-violet-600"
                : "text-zinc-600 hover:text-violet-600 hover:bg-zinc-50";
              const commonClass = `rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${activeClass}`;

              if (link.dropdown) {
                let menuItems = bookItems;
                if (link.to === "/authors") menuItems = authorItems;
                if (link.to === "/reviews") menuItems = reviewItems;

                return (
                  <Dropdown
                    key={link.to}
                    menu={{ items: menuItems }}
                    trigger={["click"]}
                    placement="bottom"
                    arrow
                  >
                    <span className={commonClass}>{link.label}</span>
                  </Dropdown>
                );
              }
              return (
                <NavLink key={link.to} to={link.to} className={commonClass}>
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none transition-colors cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Mở menu chính</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        id="mobile-menu"
      >
        <div className="space-y-1.5 px-4 pb-5 pt-2 border-t border-zinc-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-base font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-violet-50 text-violet-600"
                    : "text-zinc-600 hover:text-violet-600 hover:bg-zinc-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
