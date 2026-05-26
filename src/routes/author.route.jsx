import Author from "../pages/Author/Author";
import AuthorForm from "../pages/Author/AuthorForm";
import AuthorList from "../pages/Author/AuthorList";

export const authorRoutes = [
    {
        path: "/authors",
        element: <Author/>,
        children: [
            {
                path: "",
                element: <AuthorList/>
            },
            {
                path: "create",
                element: <AuthorForm/>
            }
        ]
    }
]