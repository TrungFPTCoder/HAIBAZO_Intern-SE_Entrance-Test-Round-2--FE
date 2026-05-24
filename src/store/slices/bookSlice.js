import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../../services/bookService";
import { notification } from "antd";

// 1. Fetch paginated list of books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ page = 0, size = 10, sort = "id,desc", ...params } = {}, { rejectWithValue }) => {
    try {
      const data = await bookService.getAll({ page, size, sort, ...params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Fetch single book detail
export const fetchBookDetail = createAsyncThunk(
  "books/fetchBookDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await bookService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Create a new book
export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, { rejectWithValue, dispatch }) => {
    try {
      const data = await bookService.create(bookData);
      notification.success({
        message: "Thành công",
        description: "Thêm mới cuốn sách thành công!",
      });
      dispatch(fetchBooks({ page: 0 }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Update a book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }, { rejectWithValue, dispatch }) => {
    try {
      const data = await bookService.update(id, bookData);
      notification.success({
        message: "Thành công",
        description: "Cập nhật sách thành công!",
      });
      dispatch(fetchBooks({ page: 0 }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Delete a book
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await bookService.delete(id);
      notification.success({
        message: "Thành công",
        description: "Xóa sách thành công!",
      });
      dispatch(fetchBooks({ page: 0 }));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
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
      // Fetch Books
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
        state.error = action.payload || "Không thể tải danh sách sách.";
      })

      // Fetch Book Detail
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
        state.error = action.payload || "Không thể tải thông tin cuốn sách.";
      });
  },
});

export const { clearCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;
