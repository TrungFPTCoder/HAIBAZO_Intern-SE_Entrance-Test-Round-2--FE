import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { bookRoutes } from "./book.route";
import { authorRoutes } from "./author.route";
import { reviewRoutes } from "./review.route";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />, // Handles runtime errors beautifully
    children: [
      // Redirect root to /books
      {
        path: "",
        element: <Navigate to="/books" replace />,
      },
      // Spread all modular routes
      ...bookRoutes,
      ...authorRoutes,
      ...reviewRoutes,
      // 404 Route for anything else under AppLayout
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
