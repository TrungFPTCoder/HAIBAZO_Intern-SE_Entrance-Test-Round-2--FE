import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { notification } from "antd";
import reviewService from "../../services/reviewService";

export const fetchReviews = createAsyncThunk(
  "books/fetchReviews",
  async (
    { page = 0, size = 10, sort = "id,desc", ...params } = {},
    { rejectWithValue },
  ) => {
    try {
      const data = await reviewService.getAll({ page, size, sort, ...params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchReviewDetail = createAsyncThunk(
  "books/fetchReviewDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await reviewService.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createReview = createAsyncThunk(
  "books/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await reviewService.create(reviewData);
      notification.success({
        message: "Success",
        description: "Review created successfully!",
        duration: "3",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateReview = createAsyncThunk(
  "books/updateReview",
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const data = await reviewService.update(id, reviewData);
      notification.success({
        message: "Success",
        description: "Review updated successfully!",
        duration: "3",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await reviewService.delete(id);
      notification.success({
        message: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  items: [],
  currentReview: null,
  loading: false,
  detailLoading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 1,
    pageSize: 10,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  },
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load reviews list";
      })

      .addCase(fetchReviewDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentReview = action.payload.data || null;
      })
      .addCase(fetchReviewDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || "Failed to load review details";
      });
  },
});

export const { clearCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
