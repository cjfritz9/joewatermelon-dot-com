"use client";

import { getBrandColor } from "@/lib/theme";
import { EVENT_TIMEZONE } from "@/lib/time";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "active" | "inactive";

interface StatusSectionProps {
  status: Status;
  nextRunTime?: Date;
  onNotify?: () => void;
}

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const RUN_WINDOW_MS = 12 * 60 * 60 * 1000;

export default function StatusSection({
  status,
  nextRunTime,
  onNotify,
}: StatusSectionProps) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  const refreshedRef = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const start = nextRunTime?.getTime() ?? null;
  const inRunWindow =
    now !== null &&
    start !== null &&
    now >= start &&
    now < start + RUN_WINDOW_MS;

  useEffect(() => {
    if (status !== "inactive" || !inRunWindow) {
      refreshedRef.current = false;
      return;
    }
    if (!refreshedRef.current) {
      refreshedRef.current = true;
      router.refresh();
    }
  }, [status, inRunWindow, router]);

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge color="green">Active</Badge>;
      case "inactive":
        return <Badge color="red">Inactive</Badge>;
    }
  };

  const getAdvertisedTime = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: EVENT_TIMEZONE,
      timeZoneName: "short",
    }).format(date);

  const getViewerTime = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    }).format(date);

  const getRelativeTime = (): string | null => {
    if (now === null || start === null) return null;
    const diffMs = start - now;
    if (diffMs <= 0 || diffMs > FOUR_HOURS_MS) return null;

    const totalMinutes = Math.max(1, Math.round(diffMs / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `Starts in ${minutes}m`;
    if (minutes === 0) return `Starts in ${hours}h`;
    return `Starts in ${hours}h ${minutes}m`;
  };

  const getNextRunText = () => {
    if (status === "active") return "Runs are currently in progress!";
    if (status === "inactive" && nextRunTime)
      return getAdvertisedTime(nextRunTime);
    if (status === "inactive") return "Next run TBD";
  };

  const viewerIsCentral =
    now !== null &&
    Intl.DateTimeFormat().resolvedOptions().timeZone === EVENT_TIMEZONE;
  const viewerTime =
    status === "inactive" && nextRunTime && now !== null && !viewerIsCentral
      ? getViewerTime(nextRunTime)
      : null;

  const relativeTime = status === "inactive" ? getRelativeTime() : null;
  const showStartingNow = status === "inactive" && inRunWindow;

  return (
    <Card
      shadow="md"
      mb="xl"
      radius="md"
      p="lg"
      maw={{ base: "100%", sm: 500 }}
      w="100%"
      withBorder
    >
      <Stack gap="xs" align="center">
        <Group align="center">
          <Text fw={700} size="lg">
            Current Status:
          </Text>
          {getStatusBadge()}
        </Group>

        <Text>Next planned runs:</Text>
        <Text fw={700} c={getBrandColor(7)}>
          {getNextRunText()}
        </Text>

        {viewerTime && (
          <Text size="sm" c="dimmed">
            Your time: {viewerTime}
          </Text>
        )}

        {showStartingNow ? (
          <Text fw={700} c="yellow">
            Starting now…
          </Text>
        ) : (
          relativeTime && (
            <Text fw={700} c="yellow">
              {relativeTime}
            </Text>
          )
        )}

        <Button
          mt="md"
          variant="light"
          color="yellow"
          onClick={onNotify}
          disabled
        >
          Notify me when active
        </Button>
      </Stack>
    </Card>
  );
}
