import { create } from "axios";
import apiClient from "./apiClient";
import { Upload } from "antd";

const reviewService = {
  getAll: async ({ page = 0, size = 10, sort = "id,desc", ...params } = {}) => {
    const response = await apiClient.get("/review", {
      params: { page, size, sort, ...params },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/review/${id}`);
    return response.data;
  },
  create: async (reviewData) => {
    const response = await apiClient.post("/review", reviewData);
    return response.data;
  },
  update: async (id, reviewData) => {
    const response = await apiClient.put(`/review/${id}`, reviewData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/review/${id}`);
    return response.data;
  },
};

export default reviewService;