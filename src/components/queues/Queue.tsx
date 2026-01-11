"use client";

import { APIToaQueueEntrant } from "@/@types/api";
import APIResponse from "@/lib/classes/APIResponse";
import { Badge, Card, Group, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import useSWR from "swr";
import JoinQueueModal from "./JoinQueueModal";
import QueueNotificationListener from "./QueueNotificationListener";

interface QueueProps {
  players: APIToaQueueEntrant[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data: APIResponse<APIToaQueueEntrant[]>) => data.data ?? []);

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

export default function Queue({ players: initialPlayers }: QueueProps) {
  const { data: players } = useSWR("/api/queues/toa-speed", fetcher, {
    fallbackData: initialPlayers,
    refreshInterval: 10000,
  });

  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>{player.rsn ?? "-"}</Table.Td>
      <Table.Td>{player.expertKC ?? "-"}</Table.Td>
      <Table.Td>{getGearIcon(player.redKeris)}</Table.Td>
      <Table.Td>{getGearIcon(player.bgs)}</Table.Td>
      <Table.Td>{getGearIcon(player.zcb)}</Table.Td>
      <Table.Td>{getGearIcon(player.eye)}</Table.Td>
      <Table.Td>{getStatusBadge(player.ready)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md" w="100%" maw={1040} mb="xl">
      <QueueNotificationListener players={players} />
      <Group justify="space-between" align="center">
        <Title fw={700} order={3}>
          Current Queue
        </Title>
        <JoinQueueModal />
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
                <Table.Th>
                  <Tooltip label="Keris Partisan of Corruption">
                    <span>Keris</span>
                  </Tooltip>
                </Table.Th>
                <Table.Th>
                  <Tooltip label="Bandos Godsword">
                    <span>BGS</span>
                  </Tooltip>
                </Table.Th>
                <Table.Th>
                  <Tooltip label="Zaryte Crossbow">
                    <span>ZCB</span>
                  </Tooltip>
                </Table.Th>
                <Table.Th>
                  <Tooltip label="Eye of Ayak">
                    <span>Eye</span>
                  </Tooltip>
                </Table.Th>
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
