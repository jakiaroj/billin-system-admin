"use client";

import SystemAdminAuthProvider, {
  useSystemAdminAuth,
} from "@/providers/SystemAdminAuthProvider";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { token, user } = useSystemAdminAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token || !user) {
        router.push("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [token, user, router]);

  if (!token || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SystemAdminAuthProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </SystemAdminAuthProvider>
  );
}
