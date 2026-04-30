import axios from "axios";

const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_API_BACKENDSPRINGBOOT_URL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;

export const PublicAPI = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});