"use client";

import APIResponse from "@/lib/classes/APIResponse";
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
import { useState } from "react";

interface FormData {
  twitchUsername: string;
  rsn: string;
  expertKC: number;
  ready: boolean;
  redKeris: boolean;
  bgs: boolean;
  zcb: boolean;
  notes: string;
}

export default function JoinQueueModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    twitchUsername: "",
    rsn: "",
    expertKC: 0,
    ready: false,
    redKeris: false,
    bgs: false,
    zcb: false,
    notes: "",
  });

  const { twitchUsername, rsn, expertKC, ready, notes } = formData;

  const handleUpdateFormData = (
    key: keyof FormData,
    value: string | number | boolean,
  ) => {
    setSuccess("");
    setError("");

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!rsn.trim() || !twitchUsername.trim() || !ready) {
      setError("Please fill out the entire form");
      return;
    }

    const res = await fetch("/api/queues/toa/8-man-speed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    });

    const data = (await res.json()) as APIResponse;

    if (data.success) {
      setSuccess("Added to queue");
    }

    setTimeout(() => {
      close();
      setSuccess("");
      setError("");
    }, 3000);
  };

  return (
    <>
      <Button color="yellow" onClick={open}>
        Join the Queue
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

          <Group justify="space-between" wrap="nowrap" mt="md">
            <Text c={success ? "green" : "red"}>{success || error}</Text>
            <Group wrap="nowrap">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button
                color={getBrandColor(7)}
                onClick={handleSubmit}
                disabled={success.length > 0 || error.length > 0}
              >
                Submit
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
