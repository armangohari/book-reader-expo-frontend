import { API_BASE_URL } from "@/config/apiConfig";
import axios from "axios";

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosBase;
