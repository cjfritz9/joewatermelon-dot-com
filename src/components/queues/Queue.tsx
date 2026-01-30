"use client";

import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import { QueueConfig } from "@/lib/queue-config";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPencil,
  IconSquareCheck,
  IconSquareX,
  IconTrash,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import EditQueueEntryModal from "./EditQueueEntryModal";
import QueueNotificationListener from "./QueueNotificationListener";

interface QueueProps {
  players: Record<string, unknown>[];
  config: QueueConfig;
  joinModal: ReactNode;
}

const getStatusBadge = (status: boolean) =>
  status ? (
    <Group justify="flex-end">
      <Badge color="green">Ready</Badge>
    </Group>
  ) : (
    <Group justify="flex-end">
      <Badge color="red">Not Ready</Badge>
    </Group>
  );

const getGearIcon = (hasItem: boolean) =>
  hasItem ? (
    <Group justify="flex-end">
      <IconSquareCheck color="green" />
    </Group>
  ) : (
    <Group justify="flex-end">
      <IconSquareX color="red" />
    </Group>
  );

export default function Queue({
  players: initialPlayers,
  config,
  joinModal,
}: QueueProps) {
  const { players } = useQueueRealtime({
    collectionName: config.collectionName,
    initialData: initialPlayers,
  });

  const [myEntryId, setMyEntryId] = useState<string | null>(null);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  useEffect(() => {
    const storedId = localStorage.getItem(config.storageKey);
    const entryExists = players.some((p) => p.id === storedId);
    setMyEntryId(entryExists ? storedId : null);
  }, [config.storageKey, players]);

  const myEntry = players.find((p) => p.id === myEntryId);

  const handleDelete = async () => {
    if (!myEntryId) return;

    const editToken = localStorage.getItem(`${config.storageKey}_editToken`);

    const res = await fetch(`${config.apiBasePath}/${myEntryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editToken }),
    });

    if (res.ok) {
      localStorage.removeItem(config.storageKey);
      localStorage.removeItem(`${config.storageKey}_editToken`);
      setMyEntryId(null);
      notifications.show({
        title: "Removed",
        message: "You have been removed from the queue.",
        position: "top-right",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to remove from queue.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const rows = players.map((player) => {
    const id = player.id as string;
    const rsn = player.rsn as string;
    const ready = player.ready as boolean;
    const isMyEntry = id === myEntryId;

    return (
      <Table.Tr key={id}>
        <Table.Td>
          <Group gap="xs" wrap="nowrap">
            <span>{rsn ?? "-"}</span>
            {isMyEntry && (
              <ActionIcon.Group>
                <Tooltip label="Edit">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    size="sm"
                    onClick={openEditModal}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Leave queue">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </ActionIcon.Group>
            )}
          </Group>
        </Table.Td>
        <Table.Td>{(player[config.kcField] as number) ?? "-"}</Table.Td>
        {config.columns.map((col) => (
          <Table.Td key={col.key}>
            {getGearIcon(player[col.key] as boolean)}
          </Table.Td>
        ))}
        <Table.Td>{getStatusBadge(ready)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md" w="100%" maw={1040} mb="xl">
      <QueueNotificationListener
        players={players}
        storageKey={config.storageKey}
        apiBasePath={config.apiBasePath}
      />
      <Group justify="space-between" align="center">
        <Title fw={700} order={3}>
          Current Queue
        </Title>
        {joinModal}
      </Group>

      <Text size="sm" c="dimmed">
        Players waiting for the next run. Make sure your gear and skills meet
        the requirements!
      </Text>

      <Text size="xs" c="dimmed" hiddenFrom="sm">
        Swipe to see more →
      </Text>
      <Card withBorder shadow="sm" p={0}>
        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>RSN</Table.Th>
                <Table.Th>KC</Table.Th>
                {config.columns.map((col) => (
                  <Table.Th key={col.key}>
                    <Tooltip label={col.tooltip}>
                      <span>{col.label}</span>
                    </Tooltip>
                  </Table.Th>
                ))}
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {myEntry && (
        <EditQueueEntryModal
          config={config}
          entry={myEntry}
          opened={editModalOpened}
          onClose={closeEditModal}
        />
      )}
    </Stack>
  );
}
