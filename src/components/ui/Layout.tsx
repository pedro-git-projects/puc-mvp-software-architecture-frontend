"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isAuthenticated={true} />
      <main className="flex-grow min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
