import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for JWT cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Token is handled via HTTP-only cookies, but you can add custom headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login (but only if not already on login/register page)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
