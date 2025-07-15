"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type UseUserResult = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch user");
        }
        const data = await res.json();
        if (!cancelled) {
          setUser(data.user);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          setUser(null);
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return { user: null, loading: true, error: null };
  if (error) return { user: null, loading: false, error };
  return { user, loading: false, error: null };
}
