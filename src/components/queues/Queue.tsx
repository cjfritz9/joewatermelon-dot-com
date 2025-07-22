"use client";

import { APIToaQueueEntrant } from "@/@types/api";
import { DBToaQueueEntrant } from "@/@types/firestore";
import { Badge, Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import { IconSquareCheck, IconSquareX } from "@tabler/icons-react";

interface QueueProps {
  players: APIToaQueueEntrant[];
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
  players
}: QueueProps) {
  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>{player.rsn ?? "-"}</Table.Td>
      <Table.Td>{player.expertKC ?? "-"}</Table.Td>
      <Table.Td style={{ textAlign: "right" }}>
        {getGearIcon(player.redKeris) ?? "-"}
      </Table.Td>
      <Table.Td>{getGearIcon(player.bgs) ?? "-"}</Table.Td>
      <Table.Td>{getGearIcon(player.zcb) ?? "-"}</Table.Td>
      <Table.Td>{getStatusBadge(player.ready)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      <Title fw={700} order={3}>
        Current Queue
      </Title>

      <Text size="sm" c="dimmed">
        Players waiting for the next run. Make sure your gear and skills meet
        the requirements!
      </Text>

      <Card withBorder shadow="sm">
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>RSN</Table.Th>
              <Table.Th>KC</Table.Th>
              <Table.Th>Red Keris</Table.Th>
              <Table.Th>BGS</Table.Th>
              <Table.Th>ZCB</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
