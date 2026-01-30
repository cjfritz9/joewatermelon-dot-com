"use client";

import APIResponse from "@/lib/classes/APIResponse";
import { MAX_NOTES_LENGTH } from "@/lib/db/validation";
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
import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";

interface EditQueueEntryModalProps {
  config: QueueConfig;
  entry: Record<string, unknown>;
  opened: boolean;
  onClose: () => void;
}

export default function EditQueueEntryModal({
  config,
  entry,
  opened,
  onClose,
}: EditQueueEntryModalProps) {
  const initialColumnState = config.columns.reduce(
    (acc, col) => ({ ...acc, [col.key]: (entry[col.key] as boolean) ?? false }),
    {} as Record<string, boolean>,
  );

  const [formData, setFormData] = useState({
    twitchUsername: (entry.twitchUsername as string) || "",
    rsn: (entry.rsn as string) || "",
    [config.kcField]: (entry[config.kcField] as number) || 0,
    ready: (entry.ready as boolean) || false,
    notes: (entry.notes as string) || "",
    notificationsEnabled: (entry.notificationsEnabled as boolean) || false,
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
  }, [config]);

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
    if (!formData.rsn.trim() || !formData.twitchUsername.trim()) {
      notifications.show({
        title: "Missing fields",
        message: "Please fill out all required fields.",
        position: "top-right",
        color: "red",
      });
      return;
    }

    setSubmitting(true);
    try {
      const editToken = localStorage.getItem(`${config.storageKey}_editToken`);

      const res = await fetch(`${config.apiBasePath}/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editToken, data: formData }),
      });

      const data = (await res.json()) as APIResponse<{ id: string }>;

      if (data.success) {
        localStorage.setItem("anonTwitchUsername", formData.twitchUsername);
        localStorage.setItem("anonRsn", formData.rsn);

        onClose();
        notifications.show({
          title: "Updated",
          message: "Your queue entry has been updated.",
          position: "top-right",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to update entry.",
          position: "top-right",
          color: "red",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Queue Entry" centered>
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
                onChange={(e) =>
                  handleUpdateFormData(col.key, e.target.checked)
                }
              />
            ))}
          </Stack>
        ))}

        <Text>Ready Check</Text>

        <Checkbox
          label="I am Ready"
          checked={formData.ready}
          onChange={(e) => handleUpdateFormData("ready", e.target.checked)}
        />

        <Textarea
          label="Notes (optional)"
          placeholder="Anything you'd like to add?"
          value={formData.notes}
          maxLength={MAX_NOTES_LENGTH}
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
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color={getBrandColor(7)}
            onClick={handleSubmit}
            loading={submitting}
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
