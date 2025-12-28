import axios from "axios";

export const authInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_HOST,
});
