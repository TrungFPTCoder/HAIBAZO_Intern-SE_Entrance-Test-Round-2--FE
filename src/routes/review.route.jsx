import Review from "../pages/Review/Review";
import ReviewList from "../pages/Review/ReviewList";
import ReviewForm from "../pages/Review/ReviewForm";

export const reviewRoutes = [
  {
    path: "/reviews",
    element: <Review />,
    children: [
      {
        path: "",
        element: <ReviewList />,
      },
      {
        path: "create",
        element: <ReviewForm />,
      },
      {
        path: ":id/edit",
        element: <ReviewForm />,
      },
    ],
  },
];
