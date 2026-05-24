import Book from "../pages/Book/Book";
import BookList from "../pages/Book/BookList";
import BookDetail from "../pages/Book/BookDetail";
import BookForm from "../pages/Book/BookForm";

export const bookRoutes = [
  {
    path: "/books",
    element: <Book />,
    children: [
      {
        path: "",
        element: <BookList />,
      },
      {
        path: "create",
        element: <BookForm />,
      },
      {
        path: ":id",
        element: <BookDetail />,
      },
      {
        path: ":id/edit",
        element: <BookForm />,
      },
    ],
  },
];
