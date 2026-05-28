"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { serialize, parse } from "cookie";
import toast from "react-hot-toast";
import { SystemAdmin } from "@/types/system-admin";

interface ISystemAdminUser {
  id: number;
  name: string;
  email: string;
  mobile_no: string;
  status: number;
}

type Value = {
  login: (user: ISystemAdminUser, token: string, route: string) => void;
  logout: (route: string, message: string) => void;
  token: string | null;
  user: ISystemAdminUser | null;
  initialized: boolean;
};

const SystemAdminAuthContext = createContext<Value | undefined>(undefined);

const SystemAdminAuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const client = useQueryClient();

  const [authState, setAuthState] = useState<{ user: ISystemAdminUser | null; token: string | null; initialized: boolean }>({ user: null, token: null, initialized: false });

  useEffect(() => {
    const cookies = parse(document.cookie);
    const initialUser = cookies.systemAdminUser
      ? JSON.parse(cookies.systemAdminUser)
      : null;
    const initialToken = cookies.systemAdminToken || null;
    setAuthState({ user: initialUser, token: initialToken, initialized: true });
  }, []);

  const login = (user: ISystemAdminUser, token: string, route: string) => {
    document.cookie = serialize("systemAdminUser", JSON.stringify(user), {
      path: "/",
      sameSite: "strict",
    });
    document.cookie = serialize("systemAdminToken", token, {
      path: "/",
      sameSite: "strict",
    });
    setAuthState({ user, token });
    setTimeout(() => {
      window.location.href = route || "/dashboard";
    }, 100);
  };

  const logout = (route: string, message: string) => {
    document.cookie = serialize("systemAdminUser", "", {
      path: "/",
      maxAge: -1,
      sameSite: "strict",
    });
    document.cookie = serialize("systemAdminToken", "", {
      path: "/",
      maxAge: -1,
      sameSite: "strict",
    });
    setAuthState({ user: null, token: null });
    router.push(route || "/login");
    client.clear();
    setTimeout(() => {
      toast.success(message || "Logged out Successfully", { id: "logout-toast" });
    }, 100);
  };

  const value = { login, logout, token: authState.token, user: authState.user, initialized: authState.initialized };

  return (
    <SystemAdminAuthContext.Provider value={value}>
      {children}
    </SystemAdminAuthContext.Provider>
  );
};

const useSystemAdminAuth = () => {
  const context = useContext(SystemAdminAuthContext);
  if (context === undefined) {
    throw new Error("useSystemAdminAuth must be used within a SystemAdminAuthProvider");
  }
  return context;
};

export { useSystemAdminAuth };
export default SystemAdminAuthProvider;
