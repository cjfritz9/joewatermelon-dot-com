"use client";

import APIResponse from "@/lib/classes/APIResponse";
import { QueueConfig } from "@/lib/queue-config";
import { Badge, Card, Group, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { ReactNode } from "react";
import useSWR from "swr";
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

export default function Queue({ players: initialPlayers, config, joinModal }: QueueProps) {
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((data: APIResponse<Record<string, unknown>[]>) => data.data ?? []);

  const { data: players } = useSWR(config.apiBasePath, fetcher, {
    fallbackData: initialPlayers,
    refreshInterval: 10000,
  });

  const rows = players.map((player) => {
    const id = player.id as string;
    const rsn = player.rsn as string;
    const ready = player.ready as boolean;

    return (
      <Table.Tr key={id}>
        <Table.Td>{rsn ?? "-"}</Table.Td>
        <Table.Td>{(player[config.kcField] as number) ?? "-"}</Table.Td>
        {config.columns.map((col) => (
          <Table.Td key={col.key}>{getGearIcon(player[col.key] as boolean)}</Table.Td>
        ))}
        <Table.Td>{getStatusBadge(ready)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md" w="100%" maw={1040} mb="xl">
      <QueueNotificationListener players={players} storageKey={config.storageKey} apiBasePath={config.apiBasePath} />
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
    </Stack>
  );
}
