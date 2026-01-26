"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface SearchUser {
  id: string;
  email: string;
  twitchUsername: string | null;
  rsn: string | null;
  roles: string[];
}

export default function RoleManager() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/users/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = await res.json();
        if (data.success) {
          setUsers(data.data.users);
        }
      } catch {
        notifications.show({
          title: "Error",
          message: "Failed to search users",
          color: "red",
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  const handleRoleToggle = async (userId: string, hasRole: boolean) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "queue_admin",
          action: hasRole ? "remove" : "add",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, roles: data.data.roles } : u,
          ),
        );
        notifications.show({
          title: "Success",
          message: `Queue Admin role ${hasRole ? "removed" : "added"}`,
          color: "green",
          position: "top-right",
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to update role",
          color: "red",
          position: "top-right",
        });
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update role",
        color: "red",
        position: "top-right",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Card withBorder radius="md" p="lg" maw={700} w="100%">
      <Stack gap="md">
        <Title order={3}>Role Manager</Title>

        <TextInput
          placeholder="Search by email, Twitch username, or RSN"
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />

        {loading && (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        )}

        {!loading && users.length > 0 && (
          <Table.ScrollContainer minWidth={500}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Roles</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((user) => {
                  const isQueueAdmin = user.roles.includes("queue_admin");
                  const isAdmin = user.roles.includes("admin");

                  return (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {user.email}
                          </Text>
                          {(user.twitchUsername || user.rsn) && (
                            <Text size="xs" c="dimmed">
                              {[user.twitchUsername, user.rsn]
                                .filter(Boolean)
                                .join(" / ")}
                            </Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge
                                key={role}
                                size="sm"
                                color={
                                  role === "admin"
                                    ? "green"
                                    : role === "queue_admin"
                                      ? "orange"
                                      : "blue"
                                }
                              >
                                {role === "queue_admin"
                                  ? "Queue Admin"
                                  : role.charAt(0).toUpperCase() + role.slice(1)}
                              </Badge>
                            ))
                          ) : (
                            <Text size="xs" c="dimmed">
                              No roles
                            </Text>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {isAdmin ? (
                          <Text size="xs" c="dimmed">
                            Admin (all access)
                          </Text>
                        ) : (
                          <Button
                            size="xs"
                            variant={isQueueAdmin ? "outline" : "filled"}
                            color={isQueueAdmin ? "red" : "orange"}
                            loading={updatingUserId === user.id}
                            onClick={() => handleRoleToggle(user.id, isQueueAdmin)}
                          >
                            {isQueueAdmin ? "Remove Queue Admin" : "Make Queue Admin"}
                          </Button>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}

        {!loading && debouncedQuery.length >= 2 && users.length === 0 && (
          <Text c="dimmed" ta="center" py="md">
            No users found
          </Text>
        )}

        {!loading && debouncedQuery.length < 2 && (
          <Text c="dimmed" ta="center" py="md" size="sm">
            Enter at least 2 characters to search
          </Text>
        )}
      </Stack>
    </Card>
  );
}
