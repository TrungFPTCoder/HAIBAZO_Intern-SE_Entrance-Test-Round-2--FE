import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorService from "../../services/authorService";
import { notification } from "antd";

// 1. Fetch paginated list of authors
export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async ({ page = 0, size = 10, sort = "id,desc" } = {}, { rejectWithValue }) => {
    try {
      const data = await authorService.getAll({ page, size, sort });
      return data; // Expected: { success, status, message, data: [...], pagination: {...} }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Fetch single author detail
export const fetchAuthorDetail = createAsyncThunk(
  "authors/fetchAuthorDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await authorService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Create a new author
export const createAuthor = createAsyncThunk(
  "authors/createAuthor",
  async (authorData, { rejectWithValue }) => {
    try {
      const data = await authorService.create(authorData);
      notification.success({
        message: "Success",
        description: "Author created successfully!",
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Update an author
export const updateAuthor = createAsyncThunk(
  "authors/updateAuthor",
  async ({ id, authorData }, { rejectWithValue }) => {
    try {
      const data = await authorService.update(id, authorData);
      notification.success({
        message: "Success",
        description: "Author updated successfully!",
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Delete an author
export const deleteAuthor = createAsyncThunk(
  "authors/deleteAuthor",
  async (id, { rejectWithValue }) => {
    try {
      await authorService.delete(id);
      notification.success({
        message: "Success",
        description: "Author deleted successfully!",
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  items: [],
  currentAuthor: null,
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

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    clearCurrentAuthor: (state) => {
      state.currentAuthor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Authors List
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load authors list.";
      })

      // Fetch Author Detail
      .addCase(fetchAuthorDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthorDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentAuthor = action.payload.data || null;
      })
      .addCase(fetchAuthorDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || "Failed to load author details.";
      });
  },
});

export const { clearCurrentAuthor } = authorSlice.actions;
export default authorSlice.reducer;
