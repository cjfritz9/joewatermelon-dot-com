"use client";

import { getBrandColor } from "@/lib/theme";
import {
  Badge,
  Button,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "active" | "inactive";

interface AdminStatusSectionProps {
  initialStatus: Status;
  initialNextRunTime: Date | null;
  apiEndpoint?: string;
}

export default function AdminStatusSection({
  initialStatus,
  initialNextRunTime,
  apiEndpoint = "/api/queues/toa-speed/settings",
}: AdminStatusSectionProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [nextRunTime, setNextRunTime] = useState<Date | null>(initialNextRunTime);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isValidDate = (date: Date | null): boolean => {
    return date !== null && !isNaN(date.getTime());
  };

  const isWithinSixHours = (date: Date | null): boolean => {
    if (!isValidDate(date)) return false;
    const now = new Date();
    const diffMs = date!.getTime() - now.getTime();
    const sixHoursMs = 6 * 60 * 60 * 1000;
    return diffMs <= sixHoursMs && diffMs >= -sixHoursMs;
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as Status);
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
          status,
          nextRunTime: isValidDate(nextRunTime) ? nextRunTime?.toISOString() : null,
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

  return (
    <Card shadow="md" mb="xl" radius="md" p="lg" maw={{ base: "100%", sm: 500 }} w="100%" withBorder>
      <Stack gap="md" align="center">
        <Group align="center">
          <Text fw={700} size="lg">
            Event Status:
          </Text>
          <Badge color={status === "active" ? "green" : "red"}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <SegmentedControl
          value={status}
          onChange={handleStatusChange}
          data={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />

        {status === "inactive" && (
          <>
            {isWithinSixHours(nextRunTime) && (
              <Text key="warning" size="xs" c="yellow">
                Within 6 hours of run time - consider setting to Active
              </Text>
            )}

            <DateTimePicker
              key="datetime-picker"
              label="Next Run Time"
              value={nextRunTime}
              onChange={handleDateChange}
              placeholder="Select date and time"
              clearable
              w="100%"
            />

            {isValidDate(nextRunTime) && (
              <Text key="formatted-time" size="sm" c={getBrandColor(7)}>
                {getFormattedLocalTime(nextRunTime!)}
              </Text>
            )}
          </>
        )}

        {status === "active" && (
          <Text size="sm" c="green">
            Event is currently active
          </Text>
        )}

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
