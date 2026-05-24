import Author from "../pages/Author/Author";
import AuthorList from "../pages/Author/AuthorList";
import AuthorDetail from "../pages/Author/AuthorDetail";
import AuthorForm from "../pages/Author/AuthorForm";

export const authorRoutes = [
  {
    path: "/authors",
    element: <Author />,
    children: [
      {
        path: "",
        element: <AuthorList />,
      },
      {
        path: "create",
        element: <AuthorForm />,
      },
      {
        path: ":id",
        element: <AuthorDetail />,
      },
      {
        path: ":id/edit",
        element: <AuthorForm />,
      },
    ],
  },
];
