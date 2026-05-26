import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { notification } from "antd";
import bookService from "../../services/bookService";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (
    { page = 0, size = 10, sort = "id,desc", ...params } = {},
    { rejectWithValue },
  ) => {
    try {
      const data = await bookService.getAll({ page, size, sort, ...params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchBookDetail = createAsyncThunk(
  "books/fetchBookDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await bookService.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const data = await bookService.create(bookData);
      notification.success({
        message: "Success",
        description: "Book created successfully!",
        duration: "3",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const data = await bookService.update(id, bookData);
      notification.success({
        message: "Success",
        description: "Book updated successfully!",
        duration: "3",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      await bookService.delete(id);
      notification.success({
        message: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  items: [],
  currentBook: null,
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

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load books list";
      })

      .addCase(fetchBookDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentBook = action.payload.data || null;
      })
      .addCase(fetchBookDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || "Failed to load book details";
      });
  },
});

export const { clearCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;
