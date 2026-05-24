import apiClient from "./apiClient";

const bookService = {
  getAll: async ({ page = 0, size = 10, sort = "id,desc", ...params } = {}) => {
    const response = await apiClient.get("/books", {
      params: { page, size, sort, ...params },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  create: async (bookData) => {
    const response = await apiClient.post("/books", bookData);
    return response.data;
  },

  update: async (id, bookData) => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },
};

export default bookService;
