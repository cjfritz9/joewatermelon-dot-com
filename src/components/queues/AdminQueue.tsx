"use client";

import { QueueConfig } from "@/lib/queue-config";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowDown, IconArrowUp, IconBell, IconSquareCheck, IconSquareX, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface AdminQueueProps {
  players: Record<string, unknown>[];
  config: QueueConfig;
}

const getStatusBadge = (status: boolean) =>
  status ? (
    <Badge color="green">Ready</Badge>
  ) : (
    <Badge color="red">Not Ready</Badge>
  );

const getGearIcon = (hasItem: boolean) =>
  hasItem ? <IconSquareCheck color="green" /> : <IconSquareX color="red" />;

export default function AdminQueue({ players, config }: AdminQueueProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("default");

  const sortOptions = useMemo(() => {
    const options = [{ value: "default", label: "Queue Order (Join Time)" }];
    for (const col of config.columns) {
      options.push({
        value: col.key,
        label: `Prioritize: ${col.tooltip}`,
      });
    }
    return options;
  }, [config.columns]);

  const sortedPlayers = useMemo(() => {
    if (sortBy === "default") {
      return players;
    }

    return [...players].sort((a, b) => {
      const aHas = a[sortBy] as boolean;
      const bHas = b[sortBy] as boolean;

      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;

      const aOrder = (a.order as number) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = (b.order as number) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;

      const aCreated = a.createdAt as string;
      const bCreated = b.createdAt as string;
      return new Date(aCreated).getTime() - new Date(bCreated).getTime();
    });
  }, [players, sortBy]);

  const handleRemove = async (id: string, rsn: string) => {
    const res = await fetch(`${config.apiBasePath}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      notifications.show({
        title: "Player Removed",
        message: `${rsn} has been removed from the queue.`,
        position: "top-right",
        color: "green",
      });
      router.refresh();
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to remove player from queue.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const handleNotify = async (id: string, rsn: string) => {
    const res = await fetch(`${config.apiBasePath}/${id}/notify`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      notifications.show({
        title: "Notification Sent",
        message: `${rsn} has been notified.`,
        position: "top-right",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to send notification.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const res = await fetch(`${config.apiBasePath}/reorder`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to reorder queue.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const rows = sortedPlayers.map((player, index) => {
    const id = player.id as string;
    const rsn = player.rsn as string;
    const twitchUsername = player.twitchUsername as string;
    const ready = player.ready as boolean;
    const notes = player.notes as string;
    const notificationsEnabled = player.notificationsEnabled as boolean;

    return (
      <Table.Tr key={id}>
        <Table.Td>
          <ActionIcon.Group>
            <Tooltip label="Move up">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                disabled={index === 0}
                onClick={() => handleReorder(id, "up")}
              >
                <IconArrowUp size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Move down">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                disabled={index === sortedPlayers.length - 1}
                onClick={() => handleReorder(id, "down")}
              >
                <IconArrowDown size={14} />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>
        </Table.Td>
        <Table.Td>{rsn ?? "-"}</Table.Td>
        <Table.Td>{twitchUsername ?? "-"}</Table.Td>
        <Table.Td>{(player[config.kcField] as number) ?? "-"}</Table.Td>
        {config.columns.map((col) => (
          <Table.Td key={col.key}>{getGearIcon(player[col.key] as boolean)}</Table.Td>
        ))}
        <Table.Td>{getStatusBadge(ready)}</Table.Td>
        <Table.Td>
          <Tooltip label={notes || "No notes"} multiline maw={300}>
            <Text size="sm" truncate maw={150}>
              {notes || "-"}
            </Text>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          {notificationsEnabled ? (
            <Tooltip label="Send notification">
              <ActionIcon
                color="yellow"
                variant="subtle"
                onClick={() => handleNotify(id, rsn)}
              >
                <IconBell size={18} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label="Notifications not enabled">
              <ActionIcon color="gray" variant="subtle" disabled>
                <IconBell size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Table.Td>
        <Table.Td>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => handleRemove(id, rsn)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md" w="100%" maw={1040} mb="xl">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title fw={700} order={3}>
            Queue Management
          </Title>
          <Text size="sm" c="dimmed">
            Admin view - Remove players or view their notes.
          </Text>
        </div>
        <Select
          label="Sort by"
          size="xs"
          w={220}
          data={sortOptions}
          value={sortBy}
          onChange={(value) => setSortBy(value || "default")}
        />
      </Group>

      <Text size="xs" c="dimmed" hiddenFrom="sm">
        Swipe to see more →
      </Text>
      <Card withBorder shadow="sm" p={0}>
        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order</Table.Th>
                <Table.Th>RSN</Table.Th>
                <Table.Th>Twitch</Table.Th>
                <Table.Th>KC</Table.Th>
                {config.columns.map((col) => (
                  <Table.Th key={col.key}>
                    <Tooltip label={col.tooltip}>
                      <span>{col.label}</span>
                    </Tooltip>
                  </Table.Th>
                ))}
                <Table.Th>Status</Table.Th>
                <Table.Th>Notes</Table.Th>
                <Table.Th>Notify</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  );
}
