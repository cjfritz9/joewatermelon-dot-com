"use client";

import APIResponse from "@/lib/classes/APIResponse";
import { useUser } from "@/lib/context/UserContext";
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
import { useEffect, useState } from "react";

interface FormData {
  twitchUsername: string;
  rsn: string;
  expertKC: number;
  ready: boolean;
  redKeris: boolean;
  bgs: boolean;
  zcb: boolean;
  eye: boolean;
  notes: string;
}

export default function JoinQueueModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    twitchUsername: "",
    rsn: "",
    expertKC: 0,
    ready: false,
    redKeris: false,
    bgs: false,
    zcb: false,
    eye: false,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Auto-populate from user account when modal opens
  useEffect(() => {
    if (opened && user) {
      setFormData((prev) => ({
        ...prev,
        twitchUsername: user.twitchUsername || prev.twitchUsername,
        rsn: user.rsn || prev.rsn,
      }));
    }
  }, [opened, user]);

  const { twitchUsername, rsn, expertKC, ready, notes } = formData;

  const handleUpdateFormData = (
    key: keyof FormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!rsn.trim() || !twitchUsername.trim() || !ready) {
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
      const res = await fetch("/api/queues/toa/8-man-speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const data = (await res.json()) as APIResponse;

      if (data.success) {
        close();
        notifications.show({
          title: "You're in!",
          message: "You have been added to the queue.",
          position: "top-right",
          color: "green",
        });
        router.refresh();
      } else {
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
      <Button color="yellow" onClick={open}>
        Join
      </Button>

      <Modal opened={opened} onClose={close} title="Join the Queue" centered>
        <Stack>
          <TextInput
            required
            label="Twitch Username"
            placeholder="Twitch Name"
            value={twitchUsername}
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
            value={rsn}
            onChange={(e) => handleUpdateFormData("rsn", e.target.value)}
          />

          <NumberInput
            required
            label="Expert Mode KC"
            placeholder="0"
            value={expertKC}
            allowNegative={false}
            onChange={(e) => handleUpdateFormData("expertKC", Number(e))}
          />

          <Text>Gear Check</Text>

          <Checkbox
            required
            label="Red Keris"
            onChange={(e) => handleUpdateFormData("redKeris", e.target.checked)}
          />

          <Checkbox
            required
            label="BGS"
            onChange={(e) => handleUpdateFormData("bgs", e.target.checked)}
          />

          <Checkbox
            required
            label="ZCB"
            onChange={(e) => handleUpdateFormData("zcb", e.target.checked)}
          />

          <Checkbox
            required
            label="Eye of Ayak"
            onChange={(e) => handleUpdateFormData("eye", e.target.checked)}
          />

          <Text>Ready Check</Text>

          <Checkbox
            required
            label="I am Ready"
            onChange={(e) => handleUpdateFormData("ready", e.target.checked)}
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Anything you'd like to add?"
            value={notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
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
