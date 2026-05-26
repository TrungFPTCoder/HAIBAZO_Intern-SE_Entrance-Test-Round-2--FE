import { Breadcrumb } from "antd";
import { shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  let segments = [];
  if (pathname.startsWith("/authors")) {
    segments.push("authors");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else {
      segments.push("list");
    }
  } else if (pathname.startsWith("/books")) {
    segments.push("books");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else {
      segments.push("list");
    }
  } else if (pathname.startsWith("/reviews")) {
    segments.push("reviews");
    if (pathname.endsWith("/create")) {
      segments.push("create");
    } else {
      segments.push("list");
    }
  } else {
    segments = pathname.split("/").filter(Boolean);
  }

  if (segments.length === 0 || pathname === "/") {
    return null;
  }

  const breadcrumbItems = segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1;
    return {
      key: seg,
      title: (
        <span
          className={
            isLast
              ? "text-violet-600 font-semibold capitalize tracking-wider"
              : "text-zinc-500 font-medium capitalize tracking-wider"
          }
        >
          {seg}
        </span>
      ),
    };
  });
  return (
    <div className="select-none">
      <Breadcrumb separator=">" items={breadcrumbItems}></Breadcrumb>
    </div>
  );
}
