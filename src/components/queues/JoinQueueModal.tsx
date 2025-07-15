"use client";

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

// interface JoinQueueModalProps {
//   onSubmit: (data: { rsn: string; availability: string; notes?: string }) => void;
// }

export default function JoinQueueModal() {
  // { onSubmit }: JoinQueueModalProps
  const [opened, { open, close }] = useDisclosure(false);
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

  const { twitchUsername, rsn, expertKC, ready, redKeris, bgs, zcb, notes } =
    formData;

  const handleSubmit = () => {
    if (rsn.trim() || !ready) {
      // Add Error logic
      return;
    }

    close();
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
            placeholder="Your Twitch Username"
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
            placeholder="Your RSN"
            value={rsn}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rsn: e.target.value }))
            }
          />

          <NumberInput
            required
            label="Expert Mode KC"
            placeholder="0"
            value={expertKC}
            allowNegative={false}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expertKC: Number(e) }))
            }
          />

          <Text>Gear Check</Text>

          <Checkbox
            required
            label="Red Keris"
            checked={redKeris}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, redKeris: e.target.checked }))
            }
          />

          <Checkbox
            required
            label="BGS"
            checked={bgs}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bgs: e.target.checked }))
            }
          />

          <Checkbox
            required
            label="ZCB"
            checked={zcb}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, zcb: e.target.checked }))
            }
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Anything you'd like to add?"
            value={notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button color={getBrandColor(7)} onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
