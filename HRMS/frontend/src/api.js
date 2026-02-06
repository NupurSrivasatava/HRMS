import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-lite-production-8301.up.railway.app", // FastAPI backend
});
