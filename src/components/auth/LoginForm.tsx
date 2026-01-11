"use client";

import { useUser } from "@/lib/context/UserContext";
import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconBrandTwitch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const { refetchUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { email, password } = form.values;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to login");
        return;
      }

      await refetchUser();

      notifications.show({
        title: "Welcome back!",
        message: "You have successfully logged in.",
        position: "top-right",
        color: "green",
      });

      router.push(redirectTo);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="lg" withBorder maw={400} w="100%">
      <Text size="lg" fw={500}>
        Welcome, login with
      </Text>

      <Group grow mb="md" mt="md">
        <Button
          leftSection={<IconBrandTwitch />}
          radius="xl"
          color="violet"
          component="a"
          href="/api/auth/twitch?action=login"
        >
          Twitch
        </Button>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mb="md"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="example@gmail.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Link href="/register">
            <Anchor component="button" type="button" c="dimmed" size="xs">
              Don&apos;t have an account? Register
            </Anchor>
          </Link>
          <Button type="submit" radius="xl" loading={loading}>
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
