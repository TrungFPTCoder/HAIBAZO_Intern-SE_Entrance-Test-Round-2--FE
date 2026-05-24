import apiClient from "./apiClient";

const reviewService = {
  getAll: async ({ page = 0, size = 10, sort = "id,desc", ...params } = {}) => {
    const response = await apiClient.get("/reviews", {
      params: { page, size, sort, ...params },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },

  create: async (reviewData) => {
    const response = await apiClient.post("/reviews", reviewData);
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await apiClient.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
