import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import NotFound from "../pages/NotFound/NotFound";
import { bookRoutes } from "./book.route";
import { authorRoutes } from "./author.route";
import { reviewRoutes } from "./review.route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Navigate to="/books" replace />,
      },
      ...bookRoutes,
      ...authorRoutes,
      ...reviewRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
