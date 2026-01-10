"use client";

import { useUser } from "@/lib/context/UserContext";
import { Button, Group, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AuthButtonGroup: React.FC = () => {
  const { user, loading, refetchUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to log out");
    }

    await refetchUser();

    notifications.show({
      title: "Goodbye!",
      message: "You have successfully logged out.",
      position: "top-right",
      color: "green",
    });

    router.push("/");
  };

  if (loading) {
    return <Loader type="bars" />;
  }

  if (user) {
    return (
      <Group visibleFrom="sm">
        <Button color="brand.8" onClick={handleLogout}>
          Log out
        </Button>
      </Group>
    );
  }

  return (
    <Group visibleFrom="sm">
      <Link href="/login">
        <Button variant="default">Log in</Button>
      </Link>
      <Link href="/register">
        <Button color="brand.8">Sign up</Button>
      </Link>
    </Group>
  );
};

export default AuthButtonGroup;
