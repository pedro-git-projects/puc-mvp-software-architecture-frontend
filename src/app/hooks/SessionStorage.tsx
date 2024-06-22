"use client";

import { useState, useEffect } from "react";

function useSessionStorage(key: string) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.sessionStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : null);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return storedValue;
}

export default useSessionStorage;
