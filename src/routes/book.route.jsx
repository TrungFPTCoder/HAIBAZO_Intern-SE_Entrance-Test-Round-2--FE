import Book from "../pages/Book/Book";
import BookForm from "../pages/Book/BookForm";
import BookList from "../pages/Book/BookList";

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
    ],
  },
];
