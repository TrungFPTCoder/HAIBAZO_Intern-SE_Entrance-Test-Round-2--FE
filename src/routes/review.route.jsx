import Review from "../pages/Review/Review";
import ReviewForm from "../pages/Review/ReviewForm";
import ReviewList from "../pages/Review/ReviewList";

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
    ],
  },
];
