"use client";

import { createContext, useContext } from "react";
import useSWR from "swr";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  mutate: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to fetch user");
  }
  return res.json();
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>("/api/auth/me", fetcher);

  return (
    <UserContext.Provider
      value={{
        user: data?.user ?? null,
        loading: isLoading,
        error: error?.message ?? null,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
