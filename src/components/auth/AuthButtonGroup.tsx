"use client";

import { logout } from "@/lib/auth";
import { useUser } from "@/lib/context/UserContext";
import { Button, Group, Loader } from "@mantine/core";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const AuthButtonGroup: React.FC = () => {
  const { user, loading, refetchUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout(refetchUser, router);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return <Loader type="bars" />;
  }

  if (user) {
    return (
      <Group visibleFrom="sm">
        <Link href="/account">
          <Button variant="default">Account</Button>
        </Link>
        <Button color="brand.8" onClick={handleLogout} loading={loggingOut}>
          Log out
        </Button>
      </Group>
    );
  }

  return (
    <Group visibleFrom="sm">
      <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
        <Button variant="default">Log in</Button>
      </Link>
      <Link href="/register">
        <Button color="brand.8">Sign up</Button>
      </Link>
    </Group>
  );
};

export default AuthButtonGroup;
