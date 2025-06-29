import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const customAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// put access token to request header
customAxios.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("accessToken")}`;

// Add a request interceptor
customAxios.interceptors.request.use(
  (config) => {
    // // If the access token is available, set it in the headers
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
customAxios.interceptors.response.use(
  (response) => {
    // If the response is successful, return it
    return response;
  },
  (error) => {
    // If the response is an error, check if it's a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - authentication required");

      // Check if the request was for the user profile API
      const isProfileRequest = error.config.url.includes("/api/user/profile");

      // Only emit auth:unauthorized if:
      // 1. We're not already on the login page (prevents infinite loops)
      // 2. The request is NOT for the user profile API (allow this to fail gracefully)
      // if (!window.location.pathname.includes("/login") && !isProfileRequest) {
      //   eventSystem.emit("auth:unauthorized");
      // }

      if (!isProfileRequest) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default customAxios;
