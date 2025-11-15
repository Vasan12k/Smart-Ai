import axios from "axios";

// Set the base URL for all axios requests
// Clean the URL to remove any BOM characters, line breaks, or extra whitespace
const rawURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const baseURL = rawURL.replace(/[\uFEFF\r\n\t]/g, "").trim();
console.log("🔧 Axios Base URL (raw):", rawURL);
console.log("🔧 Axios Base URL (cleaned):", baseURL);

axios.defaults.baseURL = baseURL;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(
      "📡 API Request:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default axios;
