"use client";

import { createContext, useContext } from "react";
import useSWR, { mutate as globalMutate } from "swr";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    if (res.status === 401) return { user: null };
    throw new Error("Failed to fetch");
  }
  return res.json();
};


export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading } = useSWR<{ user: User }>("/api/auth/me", fetcher);

  const refetchUser = async () => {
    await globalMutate("/auth/api/me");
  };

  return (
    <UserContext.Provider
      value={{
        user: data?.user ?? null,
        loading: isLoading,
        error: error?.message ?? null,
        refetchUser,
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
