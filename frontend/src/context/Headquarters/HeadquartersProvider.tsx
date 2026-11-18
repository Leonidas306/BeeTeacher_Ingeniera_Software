"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { HeadquartersContext } from "./HeadquartersContext";

const STORAGE_KEY = "beeteacher:selected-headquarters";
const AVAILABLE_HEADQUARTERS = ["Salamanca", "Yuriria"];

export function HeadquartersProvider({ children }: { children: ReactNode }) {
  const [selectedHeadquarters, setSelectedHeadquartersState] = useState(
    () => AVAILABLE_HEADQUARTERS[0],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && AVAILABLE_HEADQUARTERS.includes(stored)) {
      setSelectedHeadquartersState(stored);
      return;
    }

    setSelectedHeadquartersState(AVAILABLE_HEADQUARTERS[0]);
  }, []);

  const setSelectedHeadquarters = (headquarters: string) => {
    setSelectedHeadquartersState(headquarters);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, headquarters);
    }
  };

  return (
    <HeadquartersContext.Provider
      value={{
        availableHeadquarters: AVAILABLE_HEADQUARTERS,
        selectedHeadquarters,
        setSelectedHeadquarters,
      }}
    >
      {children}
    </HeadquartersContext.Provider>
  );
}
