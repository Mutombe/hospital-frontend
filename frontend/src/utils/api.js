import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const isDevelopment = import.meta.env.MODE === "development";
const BASE_URL = "http://localhost:8000/api";
//const baseURL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;


export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

export default api;