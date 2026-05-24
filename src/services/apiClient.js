import axios from "axios";
import { notification } from "antd";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for responses to automatically handle errors
apiClient.interceptors.response.use(
  (response) => {
    // If request succeeded, return the response data
    return response;
  },
  (error) => {
    // Handle global API errors gracefully
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Không thể kết nối đến máy chủ Backend (${baseURL}). Vui lòng kiểm tra lại!`;
    
    notification.error({
      message: "Lỗi kết nối hệ thống",
      description: errorMessage,
      placement: "topRight",
      duration: 5,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
