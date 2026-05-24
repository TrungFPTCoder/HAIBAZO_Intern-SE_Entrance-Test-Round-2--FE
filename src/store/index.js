import { configureStore } from "@reduxjs/toolkit";
import authorReducer from "./slices/authorSlice";
import bookReducer from "./slices/bookSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    authors: authorReducer,
    books: bookReducer,
    reviews: reviewReducer,
  },
});

export default store;
