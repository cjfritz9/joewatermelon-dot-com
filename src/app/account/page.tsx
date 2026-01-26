"use client";

import ContentFilterManager from "@/components/admin/ContentFilterManager";
import RoleManager from "@/components/admin/RoleManager";
import { useUser } from "@/lib/context/UserContext";
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
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
  const [rsn, setRsn] = useState("");
  const [manualTwitchUsername, setManualTwitchUsername] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setRsn(user.rsn || "");
      setManualTwitchUsername(user.twitchUsername || "");
    }
  }, [user]);

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

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsn: rsn.trim() || null,
          twitchUsername: manualTwitchUsername.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        notifications.show({
          title: "Profile Updated",
          message: "Your profile has been saved.",
          color: "green",
          position: "top-right",
        });
        await refetchUser();
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to update profile.",
          color: "red",
          position: "top-right",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update profile.",
        color: "red",
        position: "top-right",
      });
    } finally {
      setSavingProfile(false);
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
            <Text fw={500}>Roles</Text>
            <Group gap="xs">
              {user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge
                    key={role}
                    color={
                      role === "admin"
                        ? "green"
                        : role === "queue_admin"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {role === "queue_admin" ? "Queue Admin" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                ))
              ) : (
                <Badge color="gray">No roles</Badge>
              )}
            </Group>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" maw={500} w="100%">
        <Stack gap="md">
          <Text fw={500} size="lg">Profile</Text>

          <TextInput
            label="RSN (RuneScape Name)"
            placeholder="Your in-game name"
            value={rsn}
            onChange={(e) => setRsn(e.currentTarget.value)}
          />

          <TextInput
            label="Twitch Username"
            placeholder="Your Twitch username"
            value={manualTwitchUsername}
            onChange={(e) => setManualTwitchUsername(e.currentTarget.value)}
            disabled={user.hasTwitchLinked}
            description={user.hasTwitchLinked ? "Managed by linked Twitch account" : undefined}
          />

          <Button onClick={handleSaveProfile} loading={savingProfile}>
            Save Profile
          </Button>
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

      {user.isAdmin && (
        <Stack align="center" w="100%" mt="xl" gap="md">
          <Title order={3} c="dimmed">Admin</Title>
          <RoleManager />
          <ContentFilterManager />
        </Stack>
      )}
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
