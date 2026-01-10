"use client";

import { createContext, useContext } from "react";
import useSWR, { mutate as globalMutate } from "swr";

type User = {
  id: string;
  email: string;
  isAdmin: boolean;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

type APIResponse = {
  success: boolean;
  message: string;
  data: { user: User } | null;
};

const fetcher = async (url: string): Promise<User | null> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error("Failed to fetch");
  }
  const json: APIResponse = await res.json();
  return json.data?.user ?? null;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading } = useSWR<User | null>(
    "/api/auth/me",
    fetcher,
  );

  const refetchUser = async () => {
    await globalMutate("/api/auth/me");
  };

  return (
    <UserContext.Provider
      value={{
        user: data ?? null,
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
