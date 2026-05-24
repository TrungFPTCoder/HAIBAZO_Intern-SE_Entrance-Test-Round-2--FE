import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";
import { notification } from "antd";

// 1. Fetch paginated list of reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ page = 0, size = 10, sort = "id,desc", ...params } = {}, { rejectWithValue }) => {
    try {
      const data = await reviewService.getAll({ page, size, sort, ...params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Fetch single review detail
export const fetchReviewDetail = createAsyncThunk(
  "reviews/fetchReviewDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await reviewService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Create a new review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await reviewService.create(reviewData);
      notification.success({
        message: "Success",
        description: "Review created successfully!",
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Update a review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const data = await reviewService.update(id, reviewData);
      notification.success({
        message: "Success",
        description: "Review updated successfully!",
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await reviewService.delete(id);
      notification.success({
        message: "Success",
        description: "Review deleted successfully!",
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
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
      // Fetch Reviews
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
        state.error = action.payload || "Failed to load reviews list.";
      })

      // Fetch Review Detail
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
        state.error = action.payload || "Failed to load review details.";
      });
  },
});

export const { clearCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
