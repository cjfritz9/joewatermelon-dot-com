"use client";

import { APIToaQueueEntrant } from "@/@types/api";
import {
  ActionIcon,
  Badge,
  Card,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSquareCheck, IconSquareX, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface AdminQueueProps {
  players: APIToaQueueEntrant[];
}

const getStatusBadge = (status: boolean) =>
  status ? (
    <Badge color="green">Ready</Badge>
  ) : (
    <Badge color="red">Not Ready</Badge>
  );

const getGearIcon = (hasItem: boolean) =>
  hasItem ? <IconSquareCheck color="green" /> : <IconSquareX color="red" />;

export default function AdminQueue({ players }: AdminQueueProps) {
  const router = useRouter();

  const handleRemove = async (id: string, rsn: string) => {
    const res = await fetch(`/api/queues/toa/8-man-speed/${id}`, {
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

  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>{player.rsn ?? "-"}</Table.Td>
      <Table.Td>{player.twitchUsername ?? "-"}</Table.Td>
      <Table.Td>{player.expertKC ?? "-"}</Table.Td>
      <Table.Td>{getGearIcon(player.redKeris)}</Table.Td>
      <Table.Td>{getGearIcon(player.bgs)}</Table.Td>
      <Table.Td>{getGearIcon(player.zcb)}</Table.Td>
      <Table.Td>{getStatusBadge(player.ready)}</Table.Td>
      <Table.Td>
        <Tooltip label={player.notes || "No notes"} multiline maw={300}>
          <Text size="sm" truncate maw={150}>
            {player.notes || "-"}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => handleRemove(player.id, player.rsn)}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md" w="100%" maw={800}>
      <Title fw={700} order={3}>
        Queue Management
      </Title>

      <Text size="sm" c="dimmed">
        Admin view - Remove players or view their notes.
      </Text>

      <Text size="xs" c="dimmed" hiddenFrom="sm">
        Swipe to see more →
      </Text>
      <Card withBorder shadow="sm" p={0}>
        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>RSN</Table.Th>
                <Table.Th>Twitch</Table.Th>
                <Table.Th>KC</Table.Th>
                <Table.Th>Keris</Table.Th>
                <Table.Th>BGS</Table.Th>
                <Table.Th>ZCB</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Notes</Table.Th>
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
