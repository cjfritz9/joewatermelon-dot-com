"use client";

import { useQueueRealtime } from "@/hooks/useQueueRealtime";
import { QueueConfig } from "@/lib/queue-config";
import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowBackUp,
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconChevronsDown,
  IconChevronsUp,
  IconSquareCheck,
  IconSquareX,
  IconTrash,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import CopyButton from "./CopyButton";

interface AdminQueueProps {
  players: Record<string, unknown>[];
  config: QueueConfig;
  nextPartyNumber: number;
}

const getGearIcon = (hasItem: boolean) =>
  hasItem ? <IconSquareCheck color="green" /> : <IconSquareX color="red" />;

const formatJoinedDate = (dateString: string) => {
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default function AdminQueue({
  players: initialPlayers,
  config,
  nextPartyNumber,
}: AdminQueueProps) {
  const { players } = useQueueRealtime({
    collectionName: config.collectionName,
    initialData: initialPlayers,
  });
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("default");
  const [openNotes, setOpenNotes] = useState<{
    rsn: string;
    notes: string;
  } | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmingParty, setConfirmingParty] = useState(false);
  const [world, setWorld] = useState("495");
  const [partyNumber, setPartyNumber] = useState(nextPartyNumber);
  const [submitting, setSubmitting] = useState(false);
  const lastRemoveToastId = useRef<string | null>(null);

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

  const partyMembers = useMemo(
    () => players.filter((p) => p.inParty),
    [players],
  );

  const waitingPlayers = useMemo(() => {
    const waiting = players.filter((p) => !p.inParty);

    if (sortBy === "default") {
      return waiting;
    }

    return [...waiting].sort((a, b) => {
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

  const hasParty = partyMembers.length > 0;

  const partyLabel = hasParty
    ? `${partyMembers[0].partyName as string} · World ${partyMembers[0].partyWorld as string}`
    : "";

  const partyMessage = useMemo(() => {
    if (!hasParty) return "";
    const handles = partyMembers
      .map((m) => `@${m.twitchUsername as string}`)
      .join(" ");
    const name = partyMembers[0].partyName as string;
    const w = partyMembers[0].partyWorld as string;
    return `${handles} World ${w}, Party: ${name}`;
  }, [hasParty, partyMembers]);

  const handleRemove = async (id: string, rsn: string) => {
    const res = await fetch(`${config.apiBasePath}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      if (lastRemoveToastId.current) {
        notifications.hide(lastRemoveToastId.current);
      }
      lastRemoveToastId.current = notifications.show({
        title: "Player Removed",
        message: `${rsn} has been removed from the queue.`,
        position: "top-right",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error",
        message: `Failed to remove ${rsn} from the queue.`,
        position: "top-right",
        color: "red",
        autoClose: false,
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

  const handleNotifyAll = async () => {
    const targets = partyMembers.filter((m) => m.notificationsEnabled);

    if (targets.length === 0) {
      notifications.show({
        title: "No one to notify",
        message: "No group members have notifications enabled.",
        position: "top-right",
        color: "yellow",
      });
      return;
    }

    const results = await Promise.all(
      targets.map((m) =>
        fetch(`${config.apiBasePath}/${m.id as string}/notify`, {
          method: "POST",
          credentials: "include",
        }).then((res) => res.ok),
      ),
    );

    const sent = results.filter(Boolean).length;
    const failed = results.length - sent;

    notifications.show({
      title: failed === 0 ? "Group notified" : "Some notifications failed",
      message:
        failed === 0
          ? `Notified ${sent} player${sent === 1 ? "" : "s"}.`
          : `Notified ${sent}, ${failed} failed.`,
      position: "top-right",
      color: failed === 0 ? "green" : "yellow",
    });
  };

  const handleReorder = async (
    id: string,
    direction: "up" | "down" | "top" | "bottom",
  ) => {
    const res = await fetch(`${config.apiBasePath}/reorder`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    });

    if (!res.ok) {
      notifications.show({
        title: "Error",
        message: "Failed to reorder queue.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const startSelecting = () => {
    setPartyNumber(nextPartyNumber);
    setSelectedIds(new Set());
    setSelecting(true);
  };

  const cancelSelecting = () => {
    setSelecting(false);
    setSelectedIds(new Set());
  };

  const handleCreateParty = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${config.apiBasePath}/party`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberIds: [...selectedIds],
          world,
          partyNumber,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        notifications.show({
          title: "Group started",
          message: `melon${partyNumber} is now in progress.`,
          position: "top-right",
          color: "green",
        });
        setConfirmingParty(false);
        cancelSelecting();
        router.refresh();
      } else {
        notifications.show({
          title: "Error",
          message: data?.message || "Failed to start group.",
          position: "top-right",
          color: "red",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (ids: string[]) => {
    const res = await fetch(`${config.apiBasePath}/party/return`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      notifications.show({
        title: "Error",
        message: "Failed to return players to the queue.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const handleDoneParty = async () => {
    const res = await fetch(`${config.apiBasePath}/party`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      notifications.show({
        title: "Group cleared",
        message: "The group has been removed from the queue.",
        position: "top-right",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to clear the group.",
        position: "top-right",
        color: "red",
      });
    }
  };

  const commonCells = (player: Record<string, unknown>) => {
    const id = player.id as string;
    const rsn = player.rsn as string;
    const twitchUsername = player.twitchUsername as string;
    const notes = player.notes as string;
    const notificationsEnabled = player.notificationsEnabled as boolean;
    const createdAt = player.createdAt as string;

    return (
      <>
        <Table.Td>{rsn ?? "-"}</Table.Td>
        <Table.Td>
          <Group gap={2} wrap="nowrap">
            <span>{twitchUsername ?? "-"}</span>
            {twitchUsername && (
              <CopyButton value={`@${twitchUsername}`} label="Copy @handle" />
            )}
          </Group>
        </Table.Td>
        <Table.Td>{(player[config.kcField] as number) ?? "-"}</Table.Td>
        {config.columns.map((col) => (
          <Table.Td key={col.key}>
            {getGearIcon(player[col.key] as boolean)}
          </Table.Td>
        ))}
        <Table.Td>
          <Tooltip label={formatFullDateTime(createdAt)}>
            <Text size="sm">{formatJoinedDate(createdAt)}</Text>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          {notes ? (
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={() => setOpenNotes({ rsn, notes })}
            >
              View
            </Anchor>
          ) : (
            <Text size="sm" c="dimmed">
              -
            </Text>
          )}
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
      </>
    );
  };

  const tableHead = (firstLabel: string) => (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>{firstLabel}</Table.Th>
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
        <Table.Th>Joined</Table.Th>
        <Table.Th>Notes</Table.Th>
        <Table.Th>Notify</Table.Th>
        <Table.Th>Remove</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );

  const waitingRows = waitingPlayers.map((player, index) => {
    const id = player.id as string;

    return (
      <Table.Tr key={id}>
        <Table.Td>
          {selecting ? (
            <Checkbox
              checked={selectedIds.has(id)}
              onChange={() => toggleSelected(id)}
            />
          ) : (
            <ActionIcon.Group>
              <Tooltip label="Move to top">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => handleReorder(id, "top")}
                >
                  <IconChevronsUp size={14} />
                </ActionIcon>
              </Tooltip>
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
                  disabled={index === waitingPlayers.length - 1}
                  onClick={() => handleReorder(id, "down")}
                >
                  <IconArrowDown size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Move to bottom">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  disabled={index === waitingPlayers.length - 1}
                  onClick={() => handleReorder(id, "bottom")}
                >
                  <IconChevronsDown size={14} />
                </ActionIcon>
              </Tooltip>
            </ActionIcon.Group>
          )}
        </Table.Td>
        {commonCells(player)}
      </Table.Tr>
    );
  });

  const partyRows = partyMembers.map((player) => {
    const id = player.id as string;

    return (
      <Table.Tr key={id}>
        <Table.Td>
          <Tooltip label="Return to queue">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={() => handleReturn([id])}
            >
              <IconArrowBackUp size={16} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
        {commonCells(player)}
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md" w="100%" maw={1040} mb="xl">
      {hasParty && (
        <Card withBorder shadow="sm" p={0}>
          <Group justify="space-between" p="sm" wrap="wrap" gap="xs">
            <Group gap="xs">
              <Text fw={700}>In Progress</Text>
              <Text c="dimmed">{partyLabel}</Text>
            </Group>
            <Group gap="xs">
              <CopyButton
                value={partyMessage}
                text="Copy chat message"
                size={14}
              />
              <Button
                size="xs"
                variant="default"
                leftSection={<IconBell size={14} />}
                onClick={handleNotifyAll}
              >
                Notify all
              </Button>
              <Button
                size="xs"
                variant="default"
                onClick={() =>
                  handleReturn(partyMembers.map((m) => m.id as string))
                }
              >
                Return all
              </Button>
              <Button size="xs" color="red" onClick={handleDoneParty}>
                Done
              </Button>
            </Group>
          </Group>
          <Table.ScrollContainer minWidth={700}>
            <Table highlightOnHover withTableBorder withColumnBorders>
              {tableHead("Return")}
              <Table.Tbody>{partyRows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      )}

      <Group justify="space-between" align="flex-end">
        <div>
          <Title fw={700} order={3}>
            Queue Management ({waitingPlayers.length})
          </Title>
          <Text size="sm" c="dimmed">
            Admin view - Remove players or view their notes.
          </Text>
        </div>
        <Group gap="sm" align="flex-end">
          {selecting ? (
            <Group gap="xs">
              <Button
                size="xs"
                disabled={selectedIds.size === 0}
                onClick={() => setConfirmingParty(true)}
              >
                Confirm ({selectedIds.size})
              </Button>
              <Button size="xs" variant="default" onClick={cancelSelecting}>
                Cancel
              </Button>
            </Group>
          ) : (
            <Tooltip
              label={
                hasParty
                  ? "Finish the current group first"
                  : "Select players for a run"
              }
            >
              <Button
                size="xs"
                variant="light"
                leftSection={<IconUsersGroup size={16} />}
                disabled={hasParty || waitingPlayers.length === 0}
                onClick={startSelecting}
              >
                Select Group
              </Button>
            </Tooltip>
          )}
          <Select
            label="Sort by"
            size="xs"
            w={220}
            data={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value || "default")}
          />
        </Group>
      </Group>

      <Text size="xs" c="dimmed" hiddenFrom="sm">
        Swipe to see more →
      </Text>
      <Card withBorder shadow="sm" p={0}>
        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover withTableBorder withColumnBorders>
            {tableHead(selecting ? "Select" : "Order")}
            <Table.Tbody>{waitingRows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      <Modal
        opened={openNotes !== null}
        onClose={() => setOpenNotes(null)}
        title={openNotes ? `Notes - ${openNotes.rsn}` : "Notes"}
        centered
      >
        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
          {openNotes?.notes}
        </Text>
      </Modal>

      <Modal
        opened={confirmingParty}
        onClose={() => setConfirmingParty(false)}
        title="Start group"
        centered
      >
        <Stack>
          <Text size="sm" c="dimmed">
            {selectedIds.size} player{selectedIds.size === 1 ? "" : "s"}{" "}
            selected. Confirm the world and party name.
          </Text>
          <TextInput
            label="World"
            value={world}
            onChange={(e) => setWorld(e.currentTarget.value)}
          />
          <NumberInput
            label="Party number"
            description={`Party name: melon${partyNumber}`}
            value={partyNumber}
            min={1}
            allowDecimal={false}
            onChange={(value) => setPartyNumber(Number(value) || 1)}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setConfirmingParty(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateParty}
              loading={submitting}
              disabled={!world.trim()}
            >
              Start melon{partyNumber}
            </Button>
          </Group>
        </Stack>
      </Modal>

    </Stack>
  );
}
