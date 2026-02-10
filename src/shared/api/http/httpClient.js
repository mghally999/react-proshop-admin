import axios from "axios";

export const httpClient = axios.create({
  baseURL: "", // IMPORTANT (use Vite proxy)
  withCredentials: true, // send/receive session cookie
});
