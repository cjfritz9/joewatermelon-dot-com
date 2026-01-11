"use client";

import APIResponse from "@/lib/classes/APIResponse";
import { useUser } from "@/lib/context/UserContext";
import { QueueConfig } from "@/lib/queue-config";
import { getBrandColor } from "@/lib/theme";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface JoinQueueModalProps {
  config: QueueConfig;
}

export default function JoinQueueModal({ config }: JoinQueueModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { user } = useUser();

  const initialColumnState = config.columns.reduce(
    (acc, col) => ({ ...acc, [col.key]: false }),
    {} as Record<string, boolean>
  );

  const [formData, setFormData] = useState({
    twitchUsername: "",
    rsn: "",
    [config.kcField]: 0,
    ready: false,
    notes: "",
    notificationsEnabled: false,
    ...initialColumnState,
  });

  const [submitting, setSubmitting] = useState(false);

  const columnsBySection = useMemo(() => {
    const grouped: Record<string, typeof config.columns> = {};
    for (const col of config.columns) {
      const section = col.section || "Options";
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(col);
    }
    return grouped;
  }, [config.columns]);

  useEffect(() => {
    if (opened && user) {
      setFormData((prev) => ({
        ...prev,
        twitchUsername: user.twitchUsername || prev.twitchUsername,
        rsn: user.rsn || prev.rsn,
      }));
    }
  }, [opened, user]);

  const handleUpdateFormData = (
    key: string,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      if (!("Notification" in window)) {
        notifications.show({
          title: "Not Supported",
          message: "Your browser does not support notifications.",
          position: "top-right",
          color: "red",
        });
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        handleUpdateFormData("notificationsEnabled", true);
        notifications.show({
          title: "Notifications Enabled",
          message: "You will be notified when it's your turn.",
          position: "top-right",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Permission Denied",
          message: "Please enable notifications in your browser settings.",
          position: "top-right",
          color: "yellow",
        });
      }
    } else {
      handleUpdateFormData("notificationsEnabled", false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.rsn.trim() || !formData.twitchUsername.trim() || !formData.ready) {
      notifications.show({
        title: "Missing fields",
        message: "Please fill out all required fields and confirm you are ready.",
        position: "top-right",
        color: "red",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(config.apiBasePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const data = (await res.json()) as APIResponse<{ id: string }>;

      if (data.success && data.data?.id) {
        localStorage.setItem(config.storageKey, data.data.id);
        close();
        notifications.show({
          title: "You're in!",
          message: "You have been added to the queue.",
          position: "top-right",
          color: "green",
        });
        router.refresh();
      } else if (!data.success) {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to join queue.",
          position: "top-right",
          color: "red",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button color={config.buttonColor} onClick={open}>
        Join
      </Button>

      <Modal opened={opened} onClose={close} title="Join the Queue" centered>
        <Stack>
          <TextInput
            required
            label="Twitch Username"
            placeholder="Twitch Name"
            value={formData.twitchUsername}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                twitchUsername: e.target.value,
              }))
            }
          />

          <TextInput
            required
            label="RuneScape Name"
            placeholder="RSN"
            value={formData.rsn}
            onChange={(e) => handleUpdateFormData("rsn", e.target.value)}
          />

          <NumberInput
            required
            label={config.kcLabel}
            placeholder="0"
            value={formData[config.kcField] as number}
            allowNegative={false}
            onChange={(e) => handleUpdateFormData(config.kcField, Number(e))}
          />

          {Object.entries(columnsBySection).map(([section, cols]) => (
            <Stack key={section} gap="xs">
              <Text>{section}</Text>
              {cols.map((col) => (
                <Checkbox
                  key={col.key}
                  label={col.tooltip}
                  checked={formData[col.key] as boolean}
                  onChange={(e) => handleUpdateFormData(col.key, e.target.checked)}
                />
              ))}
            </Stack>
          ))}

          <Text>Ready Check</Text>

          <Checkbox
            required
            label="I am Ready"
            checked={formData.ready}
            onChange={(e) => handleUpdateFormData("ready", e.target.checked)}
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Anything you'd like to add?"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
          />

          <Checkbox
            label="Notify me when it's my turn"
            description="Receive a browser notification when an admin marks you as ready"
            checked={formData.notificationsEnabled}
            onChange={(e) => handleNotificationToggle(e.target.checked)}
          />

          <Group justify="flex-end" wrap="nowrap" mt="md">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              color={getBrandColor(7)}
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
