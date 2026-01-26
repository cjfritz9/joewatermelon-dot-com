"use client";

import {
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ContentFilterManager() {
  const [termCount, setTermCount] = useState<number>(0);
  const [newTerm, setNewTerm] = useState("");
  const [removeTerm, setRemoveTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchTermCount();
  }, []);

  const fetchTermCount = async () => {
    try {
      const res = await fetch("/api/admin/content-filter/custom");
      const data = await res.json();
      if (data.success) {
        setTermCount(data.data.terms.length);
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load custom terms",
        color: "red",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTerm.trim()) return;

    setAdding(true);
    try {
      const res = await fetch("/api/admin/content-filter/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: newTerm.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setTermCount(data.data.terms.length);
        setNewTerm("");
        notifications.show({
          title: "Added",
          message: "Term added to blocklist",
          color: "green",
          position: "top-right",
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to add term",
          color: "red",
          position: "top-right",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to add term",
        color: "red",
        position: "top-right",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTerm.trim()) return;

    setRemoving(true);
    try {
      const res = await fetch("/api/admin/content-filter/custom", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: removeTerm.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setTermCount(data.data.terms.length);
        setRemoveTerm("");
        notifications.show({
          title: "Removed",
          message: "Term removed from blocklist",
          color: "green",
          position: "top-right",
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Term not found",
          color: "red",
          position: "top-right",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to remove term",
        color: "red",
        position: "top-right",
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Card withBorder radius="md" p="lg" maw={500} w="100%">
      <Stack gap="md">
        <Title order={3}>Content Filter</Title>

        {loading ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            {termCount} custom term{termCount !== 1 ? "s" : ""} blocked
          </Text>
        )}

        <Group wrap="nowrap">
          <TextInput
            placeholder="Add term"
            value={newTerm}
            onChange={(e) => setNewTerm(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{ flex: 1 }}
          />
          <Button
            w={110}
            leftSection={<IconPlus size={16} />}
            onClick={handleAdd}
            loading={adding}
            disabled={!newTerm.trim()}
          >
            Add
          </Button>
        </Group>

        <Group wrap="nowrap">
          <TextInput
            placeholder="Remove term"
            value={removeTerm}
            onChange={(e) => setRemoveTerm(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRemove()}
            style={{ flex: 1 }}
          />
          <Button
            w={110}
            leftSection={<IconMinus size={16} />}
            color="red"
            variant="outline"
            onClick={handleRemove}
            loading={removing}
            disabled={!removeTerm.trim()}
          >
            Remove
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
