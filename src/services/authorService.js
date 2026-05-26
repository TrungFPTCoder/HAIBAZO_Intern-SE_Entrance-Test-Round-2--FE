import { create } from "axios";
import apiClient from "./apiClient";
import { Upload } from "antd";

const authorService = {
  getAll: async ({ page = 0, size = 10, sort = "id,desc" } = {}) => {
    const response = await apiClient.get("/authors", {
      params: { page, size, sort },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/authors/${id}`);
    return response.data;
  },
  create: async (authorData) => {
    const response = await apiClient.post("/authors", authorData);
    return response.data;
  },
  update: async (id, authorData) => {
    const response = await apiClient.put(`/authors/${id}`, authorData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/authors/${id}`);
    return response.data;
  },
};

export default authorService;
