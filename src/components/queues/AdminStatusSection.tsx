"use client";

import type { EventPhase, SignupOverride } from "@/lib/server/event-settings";
import { getBrandColor } from "@/lib/theme";
import {
  formatWeeklySchedule,
  scheduleFromDate,
  WeeklySchedule,
} from "@/lib/time";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OverrideValue = "auto" | "open" | "closed";

interface AdminStatusSectionProps {
  initialPhase: EventPhase;
  initialOverride: SignupOverride | null;
  initialNextRunTime: Date | null;
  initialWeeklySchedule: WeeklySchedule | null;
  apiEndpoint?: string;
}

const PHASE_BADGE: Record<EventPhase, { color: string; label: string }> = {
  closed: { color: "gray", label: "Sign-ups closed" },
  open: { color: "green", label: "Sign-ups open" },
  in_progress: { color: "green", label: "Runs in progress" },
};

export default function AdminStatusSection({
  initialPhase,
  initialOverride,
  initialNextRunTime,
  initialWeeklySchedule,
  apiEndpoint = "/api/queues/toa-speed/settings",
}: AdminStatusSectionProps) {
  const [override, setOverride] = useState<OverrideValue>(
    initialOverride ?? "auto",
  );
  const [nextRunTime, setNextRunTime] = useState<Date | null>(
    initialNextRunTime,
  );
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isValidDate = (date: Date | null): boolean => {
    return date !== null && !isNaN(date.getTime());
  };

  const handleDateChange = (value: unknown) => {
    if (value === null) {
      setNextRunTime(null);
      return;
    }

    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string") {
      date = new Date(value);
    } else {
      return;
    }

    if (!isNaN(date.getTime())) {
      setNextRunTime(date);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch(apiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          override,
          nextRunTime: isValidDate(nextRunTime)
            ? nextRunTime?.toISOString()
            : null,
          ...(repeatWeekly && isValidDate(nextRunTime)
            ? { weeklySchedule: scheduleFromDate(nextRunTime!) }
            : {}),
        }),
      });

      if (res.ok) {
        notifications.show({
          title: "Settings saved",
          message: "Event settings have been updated.",
          position: "top-right",
          color: "green",
        });
        router.refresh();
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to save settings.",
          position: "top-right",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to save settings.",
        position: "top-right",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const getFormattedLocalTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    }).format(date);
  };

  const badge = PHASE_BADGE[initialPhase];

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
      <Stack gap="md" align="center">
        <Group align="center">
          <Text fw={700} size="lg">
            Sign-ups:
          </Text>
          <Badge color={badge.color}>{badge.label}</Badge>
        </Group>

        <Stack gap={4} w="100%" align="center">
          <SegmentedControl
            value={override}
            onChange={(value) => setOverride(value as OverrideValue)}
            data={[
              { label: "Auto", value: "auto" },
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ]}
          />
          <Text size="xs" c="dimmed" ta="center">
            {override === "auto"
              ? "Sign-ups open automatically 2h before the run and close 12h after."
              : override === "open"
                ? "Sign-ups forced open. Reverts to Auto after the run window."
                : "Sign-ups forced closed. Reverts to Auto after the run window."}
          </Text>
        </Stack>

        <DateTimePicker
          key="datetime-picker"
          label="Next Run Time"
          value={nextRunTime}
          onChange={handleDateChange}
          placeholder="Select date and time"
          valueFormat="MM/DD/YYYY hh:mm A"
          clearable
          w="100%"
        />

        {isValidDate(nextRunTime) && (
          <Text key="formatted-time" size="sm" c={getBrandColor(7)}>
            {getFormattedLocalTime(nextRunTime!)}
          </Text>
        )}

        <Stack gap={4} w="100%">
          <Checkbox
            label="Repeat this time weekly"
            checked={repeatWeekly}
            onChange={(e) => setRepeatWeekly(e.currentTarget.checked)}
          />
          {initialWeeklySchedule && (
            <Text size="xs" c="dimmed">
              Currently repeating: {formatWeeklySchedule(initialWeeklySchedule)}
            </Text>
          )}
        </Stack>

        <Button
          mt="md"
          color="green"
          onClick={handleSave}
          loading={saving}
          fullWidth
        >
          Save Settings
        </Button>
      </Stack>
    </Card>
  );
}
