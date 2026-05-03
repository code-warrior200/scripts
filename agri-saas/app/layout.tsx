import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { CustomerAssistant } from "../components/CustomerAssistant";

export const metadata: Metadata = {
  title: "AgriSaaS",
  description: "Agriculture SaaS dashboard for farm and crop management",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
        <CustomerAssistant />
      </body>
    </html>
  );
}
