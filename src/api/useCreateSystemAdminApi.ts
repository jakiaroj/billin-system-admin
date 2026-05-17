"use client";
import { parse } from "cookie";
import axios from "axios";

const getSystemAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookies = parse(document.cookie);
  return cookies.systemAdminToken || null;
};

const handleSystemAdminLogout = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const useCreateSystemAdminApi = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/",
  });

  api.interceptors.request.use(function (config) {
    if (config.headers) {
      const authToken = getSystemAdminToken();
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
      config.headers["Content-Type"] = "application/json";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Headers"] =
        "Origin, X-Requested-With, Content-Type, Accept, Authorization";
      return config;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginAttempt = error.config?.url?.includes("/system-admin/login");
      if (
        [401, 403].includes(parseInt(error?.response?.status)) &&
        !isLoginAttempt
      ) {
        handleSystemAdminLogout();
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useCreateSystemAdminApi;
