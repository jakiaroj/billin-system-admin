"use client";

import SystemAdminAuthProvider from "@/providers/SystemAdminAuthProvider";
import LoginForm from "./login-form";
import { Title } from "rizzui";

export default function LoginPage() {
  return (
    <SystemAdminAuthProvider>
      <div className="flex min-h-screen w-full flex-col justify-between">
        <div className="flex w-full flex-grow flex-col items-center justify-center px-5">
          <div className="w-full max-w-md py-12">
            <div className="mb-8 flex flex-col items-center">
              <Title
                as="h2"
                className="text-center text-3xl font-bold leading-snug"
              >
                System Admin{" "}
                <span style={{ color: "#35B56B" }}>Portal</span>
              </Title>
            </div>
            <LoginForm />
          </div>
        </div>
        <footer className="flex items-center justify-center px-4 py-5">
          <p className="text-center text-sm text-gray-500">
            © Copyright 2024. Billin, all rights reserved.
          </p>
        </footer>
      </div>
    </SystemAdminAuthProvider>
  );
}
