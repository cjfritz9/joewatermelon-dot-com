"use client";

import type { EventPhase } from "@/lib/server/event-settings";
import { getBrandColor } from "@/lib/theme";
import { EVENT_TIMEZONE, RUN_WINDOW_MS, SIGNUP_LEAD_MS } from "@/lib/time";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface StatusSectionProps {
  phase: EventPhase;
  nextRunTime?: Date;
  onNotify?: () => void;
}

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

const PHASE_BADGE: Record<EventPhase, { color: string; label: string }> = {
  closed: { color: "gray", label: "Closed" },
  open: { color: "green", label: "Sign-ups open" },
  in_progress: { color: "green", label: "In progress" },
};

export default function StatusSection({
  phase,
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

  const displayPhase: EventPhase =
    now !== null && phase === "open" && start !== null && now >= start
      ? "in_progress"
      : phase;

  useEffect(() => {
    if (now === null || start === null) return;
    const shouldBeOpen = now >= start - SIGNUP_LEAD_MS && now < start + RUN_WINDOW_MS;
    const serverOpen = phase !== "closed";
    if (shouldBeOpen !== serverOpen) {
      if (!refreshedRef.current) {
        refreshedRef.current = true;
        router.refresh();
      }
    } else {
      refreshedRef.current = false;
    }
  }, [now, start, phase, router]);

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

  const getNextRunText = () =>
    nextRunTime ? getAdvertisedTime(nextRunTime) : "Next run TBD";

  const viewerIsCentral =
    now !== null &&
    Intl.DateTimeFormat().resolvedOptions().timeZone === EVENT_TIMEZONE;
  const viewerTime =
    nextRunTime && now !== null && !viewerIsCentral
      ? getViewerTime(nextRunTime)
      : null;

  const relativeTime = getRelativeTime();
  const badge = PHASE_BADGE[displayPhase];

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
          <Badge color={badge.color}>{badge.label}</Badge>
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

        {displayPhase === "in_progress" && (
          <Text fw={700} c="yellow">
            Runs in progress!
          </Text>
        )}

        {displayPhase === "open" && (
          <Text fw={700} c="yellow">
            Sign-ups open{relativeTime ? ` · ${relativeTime}` : ""}
          </Text>
        )}

        {displayPhase === "closed" && (
          <Text size="xs" c="dimmed" ta="center">
            Sign-ups typically open ~2 hours before the run.
          </Text>
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
