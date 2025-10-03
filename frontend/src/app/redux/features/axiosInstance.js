import axios from "axios";
// export const serverUrl = "https://api.delhibookstore.com"
export const serverUrl = "http://localhost:14000"

const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json", },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling/logging here
    // console.error("API Error:", error?.response || error?.message);
    return Promise.reject(error);
  }
);

export function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
export default axiosInstance ;

