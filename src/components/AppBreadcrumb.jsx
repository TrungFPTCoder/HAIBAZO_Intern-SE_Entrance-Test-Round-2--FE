import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/books": "Danh sách Sách",
  "/authors": "Tác giả",
  "/reviews": "Đánh giá",
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    // Check if the current snippet might be an ID (e.g., number or UUID)
    const currentSnippet = pathSnippets[index];
    const isId = !isNaN(currentSnippet) || currentSnippet.length > 15;

    let name = breadcrumbNameMap[url];
    if (!name) {
      if (isId && index > 0) {
        name = "Chi tiết";
      } else {
        // Fallback: capitalize the first letter
        name = currentSnippet.charAt(0).toUpperCase() + currentSnippet.slice(1);
      }
    }

    return {
      key: url,
      title: <Link to={url}>{name}</Link>,
    };
  });

  const breadcrumbItems = [
    {
      title: <Link to="/">Trang chủ</Link>,
      key: "home",
    },
  ].concat(extraBreadcrumbItems);

  // If we are at root, maybe don't show breadcrumb or just show Home
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="mb-6">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}
