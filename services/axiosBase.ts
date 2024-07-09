import { API_BASE_URL } from "@/config/apiConfig";
import axios from "axios";

export const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
