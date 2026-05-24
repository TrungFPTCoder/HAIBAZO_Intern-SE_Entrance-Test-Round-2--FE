import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Generate customized breadcrumb segments based on pathname
  let segments = [];
  if (pathname.startsWith("/authors")) {
    segments.push("authors");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else if (pathname.endsWith("/edit")) {
      segments.push("edit");
    } else {
      segments.push("list");
    }
  } else if (pathname.startsWith("/books")) {
    segments.push("books");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else if (pathname.endsWith("/edit")) {
      segments.push("edit");
    } else {
      segments.push("list");
    }
  } else if (pathname.startsWith("/reviews")) {
    segments.push("reviews");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else if (pathname.endsWith("/edit")) {
      segments.push("edit");
    } else {
      segments.push("list");
    }
  } else {
    // Fallback split logic
    segments = pathname.split("/").filter(Boolean);
  }

  // If on the root page, we don't show any breadcrumbs
  if (segments.length === 0 || pathname === "/") {
    return null;
  }

  // Map segments to Antd Breadcrumb items
  const breadcrumbItems = segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1;
    return {
      key: seg,
      title: (
        <span
          className={
            isLast
              ? "text-violet-600! font-semibold! capitalize tracking-wider"
              : "text-zinc-500! font-medium! capitalize tracking-wider"
          }
        >
          {seg}
        </span>
      ),
    };
  });

  return (
    <div className="mb-6 select-none">
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
      />
    </div>
  );
}
