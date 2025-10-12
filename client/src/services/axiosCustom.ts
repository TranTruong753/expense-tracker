import axios from "axios";
import { getAccessToken, clearToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL as string;

// Tạo instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // nếu backend set cookie (nếu không cần thì bỏ)
});

// Interceptor: Gắn access token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Interceptor: Xử lý lỗi response (ví dụ token hết hạn)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token hết hạn hoặc không hợp lệ -> logout
      if (status === 401 || status === 403) {
        clearToken(); 
        window.location.href = "/login"; // chuyển hướng login
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
