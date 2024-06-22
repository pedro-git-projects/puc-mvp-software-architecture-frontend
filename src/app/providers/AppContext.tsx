import { createContext, useContext, useState, useEffect, useRef } from "react";

export const AppContext = createContext<{ previousPathname?: string }>({});

const IsClientContext = createContext(false);

export function IsClientContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <IsClientContext.Provider value={isClient}>
      {children}
    </IsClientContext.Provider>
  );
}

export function useIsClient() {
  return useContext(IsClientContext);
}

export function usePrevious<T>(value: T) {
  let ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
