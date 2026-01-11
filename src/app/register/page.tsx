"use client";

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
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconBrandTwitch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      rsn: "",
      twitchUsername: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (val, values) =>
        val !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { email, password, rsn, twitchUsername } = form.values;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ...(rsn && { rsn }),
          ...(twitchUsername && { twitchUsername }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to register");
        return;
      }

      notifications.show({
        title: "Account created!",
        message: "Please log in with your new account.",
        position: "top-right",
        color: "green",
      });

      router.push("/login");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack align="center" my="xl">
      <Paper radius="md" p="lg" withBorder maw={400} w="100%">
        <Text size="lg" fw={500}>
          Create an account
        </Text>

        <Group grow mb="md" mt="md">
          <Button
            leftSection={<IconBrandTwitch />}
            radius="xl"
            color="violet"
            component="a"
            href={`/api/auth/twitch?action=login&returnUrl=${encodeURIComponent(redirectTo)}`}
          >
            Sign up with Twitch
          </Button>
        </Group>

        <Divider label="Or register with email" labelPosition="center" my="lg" />

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
              error={form.errors.email}
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
              error={form.errors.password}
              radius="md"
            />

            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue("confirmPassword", event.currentTarget.value)
              }
              error={form.errors.confirmPassword}
              radius="md"
            />

            <Divider label="Optional" labelPosition="center" my="xs" />

            <TextInput
              label="RSN (RuneScape Name)"
              placeholder="Your in-game name"
              value={form.values.rsn}
              onChange={(event) =>
                form.setFieldValue("rsn", event.currentTarget.value)
              }
              radius="md"
            />

            <TextInput
              label="Twitch Username"
              placeholder="Your Twitch username"
              value={form.values.twitchUsername}
              onChange={(event) =>
                form.setFieldValue("twitchUsername", event.currentTarget.value)
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Link href="/login">
              <Anchor component="button" type="button" c="dimmed" size="xs">
                Already have an account? Log in
              </Anchor>
            </Link>
            <Button type="submit" radius="xl" loading={loading}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Stack>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
