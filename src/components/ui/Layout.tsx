"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/app/providers/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-grow min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
