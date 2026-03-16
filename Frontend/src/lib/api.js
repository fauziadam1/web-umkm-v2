import axios from "axios";

export const BASE_URL = "http://localhot:8000";

export const api = axios.create({
  baseURL: BASE_URL,
});
