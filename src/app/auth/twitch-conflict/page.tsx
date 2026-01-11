"use client";

import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { IconBrandTwitch } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TwitchConflictContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Stack align="center" my="xl">
      <Paper radius="md" p="xl" withBorder maw={500}>
        <Stack align="center" gap="lg">
          <IconBrandTwitch size={48} color="var(--mantine-color-violet-6)" />
          <Title order={2} ta="center">
            Account Already Exists
          </Title>
          <Text ta="center" c="dimmed">
            An account with the email <strong>{email}</strong> already exists.
            To link your Twitch account, please log in with your email and
            password first, then link Twitch from your account settings.
          </Text>
          <Stack w="100%" gap="sm">
            <Button
              component={Link}
              href={`/login?redirect=/account`}
              fullWidth
            >
              Log in with Email
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outline"
              fullWidth
            >
              Go Home
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default function TwitchConflictPage() {
  return (
    <Suspense fallback={null}>
      <TwitchConflictContent />
    </Suspense>
  );
}
