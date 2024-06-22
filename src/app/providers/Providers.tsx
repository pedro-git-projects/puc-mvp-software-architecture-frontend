"use client";
import { usePathname } from "next/navigation";
import {
  AppContext,
  IsClientContextProvider,
  usePrevious,
} from "@/app/providers/AppContext";
import { AuthProvider } from "@/app/providers/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();
  let previousPathname = usePrevious(pathname);

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <IsClientContextProvider>
        <AuthProvider>{children}</AuthProvider>
      </IsClientContextProvider>
    </AppContext.Provider>
  );
}
