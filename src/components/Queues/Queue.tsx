'use client'

import {
  Table,
  Card,
  Stack,
  Text,
  Button,
  Group,
  Badge,
} from "@mantine/core";

interface QueuePlayer {
  position: number;
  name: string;
  status: "ready" | "pending" | "not ready";
  notes?: string;
}

interface QueueProps {
  players: QueuePlayer[];
  onJoinQueue?: () => void;
}

const getStatusBadge = (status: QueuePlayer["status"]) => {
  switch (status) {
    case "ready":
      return <Badge color="green">Ready</Badge>;
    case "pending":
      return <Badge color="yellow">Pending</Badge>;
    case "not ready":
      return <Badge color="red">Not Ready</Badge>;
  }
};

export default function Queue({
  players,
  onJoinQueue,
}: QueueProps) {
  const rows = players.map((player) => (
    <Table.Tr key={player.position}>
      <Table.Td>{player.position}</Table.Td>
      <Table.Td>{player.name}</Table.Td>
      <Table.Td>{getStatusBadge(player.status)}</Table.Td>
      <Table.Td>{player.notes || "-"}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      <Text fw={700} size="lg">
        Current Queue
      </Text>

      <Text size="sm" c="dimmed">
        Players waiting for the next run. Make sure your gear and skills meet
        the requirements!
      </Text>

      <Card withBorder shadow="sm">
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Position</Table.Th>
              <Table.Th>Player Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
