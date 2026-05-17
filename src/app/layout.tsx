import type { Metadata } from "next";
import { inter, lexendDeca } from "./fonts";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProviders from "@/providers/QueryProviders";

export const metadata: Metadata = {
  title: "Billin System Admin",
  description: "System Administration Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexendDeca.variable} font-inter`}>
        <QueryProviders>
          {children}
          <Toaster position="top-right" />
        </QueryProviders>
      </body>
    </html>
  );
}
