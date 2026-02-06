import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-production-467b.up.railway.app", // FastAPI backend
});
