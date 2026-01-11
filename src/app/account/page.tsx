"use client";

import { useUser } from "@/lib/context/UserContext";
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandTwitch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AccountContent() {
  const { user, loading, refetchUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "twitch_linked") {
      notifications.show({
        title: "Twitch Linked",
        message: "Your Twitch account has been linked successfully.",
        color: "green",
        position: "top-right",
      });
      refetchUser();
      router.replace("/account");
    }

    if (error === "twitch_already_linked") {
      notifications.show({
        title: "Error",
        message: "This Twitch account is already linked to another user.",
        color: "red",
        position: "top-right",
      });
      router.replace("/account");
    }
  }, [searchParams, refetchUser, router]);

  if (loading) {
    return (
      <Stack align="center" my="xl">
        <Loader />
      </Stack>
    );
  }

  if (!user) {
    router.push("/login?redirect=/account");
    return null;
  }

  const handleUnlink = async () => {
    setUnlinking(true);
    try {
      const res = await fetch("/api/auth/twitch/unlink", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        notifications.show({
          title: "Twitch Unlinked",
          message: "Your Twitch account has been unlinked.",
          color: "green",
          position: "top-right",
        });
        await refetchUser();
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to unlink Twitch account.",
          color: "red",
          position: "top-right",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to unlink Twitch account.",
        color: "red",
        position: "top-right",
      });
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <Stack align="center" my="xl">
      <Title order={1} mb="lg">
        Account Settings
      </Title>

      <Card withBorder radius="md" p="lg" maw={500} w="100%">
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={500}>Email</Text>
            <Text c="dimmed">{user.email}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Role</Text>
            <Badge color={user.isAdmin ? "green" : "blue"}>
              {user.isAdmin ? "Admin" : "User"}
            </Badge>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" maw={500} w="100%">
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="xs">
              <IconBrandTwitch size={20} color="var(--mantine-color-violet-6)" />
              <Text fw={500}>Twitch Account</Text>
            </Group>
            {user.twitchUsername ? (
              <Badge color="violet">{user.twitchUsername}</Badge>
            ) : (
              <Badge color="gray">Not linked</Badge>
            )}
          </Group>

          {user.twitchUsername ? (
            <Button
              variant="outline"
              color="red"
              onClick={handleUnlink}
              loading={unlinking}
            >
              Unlink Twitch Account
            </Button>
          ) : (
            <Button
              leftSection={<IconBrandTwitch />}
              color="violet"
              component="a"
              href="/api/auth/twitch?action=link"
            >
              Link Twitch Account
            </Button>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<Stack align="center" my="xl"><Loader /></Stack>}>
      <AccountContent />
    </Suspense>
  );
}
