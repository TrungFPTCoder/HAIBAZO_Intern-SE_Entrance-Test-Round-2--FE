import { notification } from "antd";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Can not connect to server!";

    notification.error({
      message: "Connection error!",
      description: errorMessage,
      placement: "topRight",
      duration: "5",
    });
    return Promise.reject(error);
  },
);

export default apiClient;
